from io import BytesIO
import tempfile

from django.contrib.auth.models import User
from django.db import connection
from django.test import override_settings
from django.core.files.uploadedfile import SimpleUploadedFile
from cryptography.fernet import Fernet
from PIL import Image
from rest_framework import status
from rest_framework.test import APITestCase
from rest_framework_simplejwt.exceptions import TokenError
from rest_framework_simplejwt.tokens import RefreshToken

from .models import GitHubAccount, Project, Tag, Tool


class ProjectApiSecurityTests(APITestCase):
    def setUp(self):
        self.owner = User.objects.create_user(username="owner", password="long-test-password-123")
        self.other_user = User.objects.create_user(username="other", password="long-test-password-123")
        self.owner_project = Project.objects.create(owner=self.owner, title="Private project")
        Project.objects.create(owner=self.other_user, title="Other private project")

    def authenticate(self, user):
        self.client.force_authenticate(user=user)

    def test_projects_are_visible_only_to_their_owner(self):
        self.authenticate(self.owner)
        response = self.client.get("/api/projects/")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual([project["id"] for project in response.data], [self.owner_project.id])
        self.assertNotIn("owner", response.data[0])

    def test_api_responses_include_restrictive_security_headers(self):
        self.authenticate(self.owner)
        response = self.client.get("/api/projects/")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("default-src 'none'", response["Content-Security-Policy"])
        self.assertEqual(response["X-Frame-Options"], "DENY")
        self.assertEqual(response["X-Content-Type-Options"], "nosniff")

    def test_cannot_access_another_users_project(self):
        self.authenticate(self.owner)
        response = self.client.get(f"/api/projects/{self.owner_project.id + 1}/")

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_favorites_use_the_tool_relation_without_exposing_user_id(self):
        self.authenticate(self.owner)
        tool = Tool.objects.create(name="Django", tag="Backend")

        response = self.client.post("/api/favorites/", {"tool_name": tool.name}, format="json")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["tool_name"], "Django")
        self.assertNotIn("user", response.data)

    def test_only_staff_can_modify_shared_catalogs(self):
        self.authenticate(self.owner)
        response = self.client.post("/api/resources/", {"title": "Untrusted resource"}, format="json")

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_logout_blacklists_the_authenticated_users_refresh_token(self):
        refresh = RefreshToken.for_user(self.owner)
        self.authenticate(self.owner)

        response = self.client.post("/api/logout/", {"refresh": str(refresh)}, format="json")

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        with self.assertRaises(TokenError):
            refresh.check_blacklist()

    def test_staff_created_tags_receive_a_unique_slug(self):
        self.owner.is_staff = True
        self.owner.save(update_fields=["is_staff"])
        self.authenticate(self.owner)

        first = self.client.post("/api/tags/", {"name": "API Security"}, format="json")
        second = self.client.post("/api/tags/", {"name": "API Security"}, format="json")

        self.assertEqual(first.status_code, status.HTTP_201_CREATED)
        self.assertEqual(first.data["slug"], "api-security")
        self.assertEqual(second.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(Tag.objects.count(), 1)

    def test_profile_rejects_non_http_urls(self):
        self.authenticate(self.owner)

        response = self.client.patch("/api/profile/", {"website": "ftp://example.test"}, format="json")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("website", response.data)

    def test_profile_avatar_is_reencoded_and_returned_as_a_media_url(self):
        image_buffer = BytesIO()
        Image.new("RGBA", (40, 30), "#2ad9ff").save(image_buffer, format="PNG")
        avatar = SimpleUploadedFile("portrait.png", image_buffer.getvalue(), content_type="image/png")
        media_directory = tempfile.TemporaryDirectory()
        self.addCleanup(media_directory.cleanup)

        self.authenticate(self.owner)
        with override_settings(MEDIA_ROOT=media_directory.name):
            response = self.client.patch("/api/profile/", {"avatar": avatar}, format="multipart")

            self.assertEqual(response.status_code, status.HTTP_200_OK)
            self.assertTrue(response.data["has_uploaded_avatar"])
            self.assertIn("/media/avatars/user_", response.data["avatar_url"])

            self.owner.profile.refresh_from_db()
            self.assertTrue(self.owner.profile.avatar.name.endswith(".webp"))
            with self.owner.profile.avatar.open("rb") as stored_file:
                with Image.open(stored_file) as stored_image:
                    self.assertEqual(stored_image.format, "WEBP")


class GitHubTokenEncryptionTests(APITestCase):
    @override_settings(GITHUB_TOKEN_ENCRYPTION_KEY=Fernet.generate_key().decode())
    def test_github_access_token_is_encrypted_at_rest(self):
        user = User.objects.create_user(username="token-owner", password="long-test-password-123")
        account = GitHubAccount.objects.create(user=user, login="token-owner", access_token="sensitive-token")

        with connection.cursor() as cursor:
            cursor.execute("SELECT access_token FROM api_githubaccount WHERE id = %s", [account.id])
            stored_token = cursor.fetchone()[0]

        self.assertNotEqual(stored_token, "sensitive-token")
        self.assertTrue(stored_token.startswith("enc:v1:"))
        account.refresh_from_db()
        self.assertEqual(account.access_token, "sensitive-token")
