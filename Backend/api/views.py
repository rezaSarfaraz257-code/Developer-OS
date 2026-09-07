from datetime import timedelta
import secrets
from urllib.parse import urlencode, urlparse

from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from django.core.validators import validate_email
from django.db import IntegrityError, transaction
from django.conf import settings
from rest_framework import status
from rest_framework.decorators import api_view, parser_classes, permission_classes
from rest_framework.parsers import FormParser, JSONParser, MultiPartParser
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.exceptions import TokenError
from rest_framework_simplejwt.tokens import RefreshToken
from django.shortcuts import get_object_or_404

import os
import requests

from django.shortcuts import redirect
from django.utils import timezone

from .models import (
    Favorite,
    Resource,
    Tool,
    UserProfile,
    Workflow,
    Project,
    Tag,
    Task,
    Note,
    Activity,
    Snippet,
    GitHubOAuthState,
    GitHubAccount,
)

from .serializers import (
    FavoriteSerializer,
    ProjectSerializer,
    ProfileUpdateSerializer,
    ResourceSerializer,
    ToolSerializer,
    WorkflowSerializer,
    TagSerializer,
    TaskSerializer,
    NoteSerializer,
    ActivitySerializer,
    SnippetSerializer,
    GitHubAccountSerializer,
)


def github_headers(access_token):
    return {
        "Authorization": f"Bearer {access_token}",
        "Accept": "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
    }
# =========================================================
# CONFIG
# =========================================================

GITHUB_CLIENT_ID = os.environ.get("GITHUB_CLIENT_ID")
GITHUB_CLIENT_SECRET = os.environ.get("GITHUB_CLIENT_SECRET")

GITHUB_OAUTH_REDIRECT = os.environ.get(
    "GITHUB_OAUTH_REDIRECT",
    "http://127.0.0.1:8000/api/github/callback/"
)

FRONTEND_URL = os.environ.get(
    "FRONTEND_URL",
    "http://localhost:5173"
).rstrip("/")

frontend_url_parts = urlparse(FRONTEND_URL)
if frontend_url_parts.scheme not in {"http", "https"} or not frontend_url_parts.netloc:
    raise ValueError("FRONTEND_URL must be an absolute http(s) URL.")

GITHUB_API_URL = "https://api.github.com"
GITHUB_TIMEOUT = (3.05, 15)


def github_service_unavailable():
    return Response(
        {"error": "GitHub is temporarily unavailable. Please try again later."},
        status=status.HTTP_502_BAD_GATEWAY,
    )


# =========================================================
# PROJECTS
# =========================================================

@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def projects_api(request):

    if request.method == "GET":
        projects = Project.objects.filter(
            owner=request.user
        ).order_by("-created_at")

        serializer = ProjectSerializer(projects, many=True)
        return Response(serializer.data)

    if request.method == "POST":
        serializer = ProjectSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save(owner=request.user)
            return Response(
                serializer.data,
                status=status.HTTP_201_CREATED
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )


@api_view(["GET", "PUT", "PATCH", "DELETE"])
@permission_classes([IsAuthenticated])
def project_detail_api(request, pk):

    project_obj = get_object_or_404(
        Project,
        pk=pk,
        owner=request.user
    )

    if request.method == "GET":
        serializer = ProjectSerializer(project_obj)
        return Response(serializer.data)

    if request.method in ["PUT", "PATCH"]:
        serializer = ProjectSerializer(
            project_obj,
            data=request.data,
            partial=request.method == "PATCH"
        )

        if serializer.is_valid():
            serializer.save(owner=request.user)
            return Response(serializer.data)

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )

    if request.method == "DELETE":
        project_obj.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


# =========================================================
# SESSION
# =========================================================

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def logout_api(request):
    """Blacklist the presented refresh token so logout also invalidates it."""
    refresh_token = request.data.get("refresh")
    if not isinstance(refresh_token, str) or not refresh_token:
        return Response({"error": "refresh is required."}, status=status.HTTP_400_BAD_REQUEST)

    try:
        token = RefreshToken(refresh_token)
        if str(token.get("user_id")) != str(request.user.id):
            return Response({"error": "Invalid refresh token."}, status=status.HTTP_400_BAD_REQUEST)
        token.blacklist()
    except TokenError:
        return Response({"error": "Invalid refresh token."}, status=status.HTTP_400_BAD_REQUEST)

    return Response(status=status.HTTP_204_NO_CONTENT)

# =========================================================
# PROFILE
# =========================================================

@api_view(["GET", "PATCH"])
@permission_classes([IsAuthenticated])
@parser_classes([JSONParser, FormParser, MultiPartParser])
def profile_api(request):
    user = request.user
    profile, _ = UserProfile.objects.get_or_create(user=user)

    def profile_response():
        full_name = profile.full_name or " ".join(
            filter(None, [user.first_name, user.last_name])
        ).strip()
        return Response({
            "id": user.id,
            "username": user.username,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "email": user.email,
            "full_name": full_name,
            "avatar_url": (
                request.build_absolute_uri(profile.avatar.url)
                if profile.avatar
                else profile.avatar_url
            ),
            "has_uploaded_avatar": bool(profile.avatar),
            "bio": profile.bio,
            "github": profile.github,
            "linkedin": profile.linkedin,
            "x": profile.x,
            "website": profile.website,
        })

    if request.method == "GET":
        return profile_response()

    serializer = ProfileUpdateSerializer(data=request.data, partial=True)
    serializer.is_valid(raise_exception=True)
    payload = serializer.validated_data.copy()
    uploaded_avatar = payload.pop("avatar", None)
    remove_avatar = payload.pop("remove_avatar", False)

    if "email" in payload and payload["email"] and User.objects.exclude(pk=user.pk).filter(
        email__iexact=payload["email"]
    ).exists():
        return Response({"error": "Unable to use this email address."}, status=status.HTTP_400_BAD_REQUEST)

    user_fields = {"first_name", "last_name", "email"}
    changed_user_fields = [field for field in user_fields if field in payload]
    for field in changed_user_fields:
        setattr(user, field, payload[field])
    if changed_user_fields:
        user.save(update_fields=changed_user_fields)

    profile_fields = {"full_name", "avatar_url", "bio", "github", "linkedin", "x", "website"}
    changed_profile_fields = [field for field in profile_fields if field in payload]
    for field in changed_profile_fields:
        setattr(profile, field, payload[field])

    old_avatar_name = profile.avatar.name if profile.avatar else ""
    old_avatar_storage = profile.avatar.storage if profile.avatar else None
    if uploaded_avatar:
        profile.avatar = uploaded_avatar
        changed_profile_fields.append("avatar")
    elif remove_avatar and old_avatar_name:
        profile.avatar = ""
        changed_profile_fields.append("avatar")

    if changed_profile_fields:
        profile.save(update_fields=[*changed_profile_fields, "updated_at"])

    if old_avatar_name and old_avatar_name != profile.avatar.name and old_avatar_storage:
        try:
            old_avatar_storage.delete(old_avatar_name)
        except OSError:
            # The profile update is already committed; a stale media object is
            # harmless and should not turn a successful update into an error.
            pass

    return profile_response()


# =========================================================
# REGISTER
# =========================================================

@api_view(["POST"])
@permission_classes([AllowAny])
def register_api(request):

    username = (
        request.data.get("username") or ""
    ).strip()

    email = (
        request.data.get("email") or ""
    ).strip()

    password = (
        request.data.get("password") or ""
    )

    first_name = (
        request.data.get("first_name") or ""
    ).strip()

    last_name = (
        request.data.get("last_name") or ""
    ).strip()

    if not username or not email or not password:

        return Response(
            {
                "error": (
                    "username, email and password "
                    "are required."
                )
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        validate_email(email)
        candidate = User(username=username, email=email)
        validate_password(password, user=candidate)
    except ValidationError as error:
        return Response({"error": error.messages}, status=status.HTTP_400_BAD_REQUEST)

    # Keep the same response for every duplicate case so this endpoint cannot
    # be used to enumerate registered usernames or email addresses.
    if User.objects.filter(username__iexact=username).exists() or User.objects.filter(email__iexact=email).exists():
        return Response(
            {"error": "Unable to create an account with these details."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    try:
        with transaction.atomic():
            user = User.objects.create_user(
                username=username,
                email=email,
                password=password,
                first_name=first_name,
                last_name=last_name,
            )
            UserProfile.objects.get_or_create(user=user)
    except IntegrityError:
        return Response(
            {"error": "Unable to create an account with these details."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    return Response(
        {
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "first_name": user.first_name,
            "last_name": user.last_name,
        },
        status=status.HTTP_201_CREATED
    )


# =========================================================
# FAVORITES
# =========================================================

@api_view(["GET", "POST", "DELETE"])
@permission_classes([IsAuthenticated])
def favorites_api(request):

    if request.method == "GET":

        favorites = Favorite.objects.filter(
            user=request.user
        ).order_by("-created_at")

        serializer = FavoriteSerializer(
            favorites,
            many=True
        )

        return Response(serializer.data)

    if request.method == "DELETE":

        tool_name = (request.data.get("tool_name") or request.query_params.get("tool_name") or "").strip()

        if not tool_name:

            return Response(
                {
                    "error": "tool_name is required."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        deleted_count, _ = Favorite.objects.filter(user=request.user, tool__name__iexact=tool_name).delete()

        if deleted_count == 0:

            return Response(
                {
                    "error": "Favorite not found."
                },
                status=status.HTTP_404_NOT_FOUND
            )

        return Response(
            status=status.HTTP_204_NO_CONTENT
        )

    tool_name = (request.data.get("tool_name") or "").strip()
    if not tool_name or len(tool_name) > 120:
        return Response({"error": "A valid tool_name is required."}, status=status.HTTP_400_BAD_REQUEST)

    # The UI ships a small catalog before the database is seeded.  Resolve a
    # matching catalog item, creating only the harmless metadata it supplies.
    tool = Tool.objects.filter(name__iexact=tool_name).first()
    if tool is None:
        tool = Tool.objects.create(
            name=tool_name,
            tag=(request.data.get("tag") or "General").strip()[:50],
            description=(request.data.get("description") or "").strip()[:2000],
        )

    favorite, created = Favorite.objects.get_or_create(user=request.user, tool=tool)
    return Response(
        FavoriteSerializer(favorite).data,
        status=status.HTTP_201_CREATED if created else status.HTTP_200_OK,
    )


# =========================================================
# RESOURCES
# =========================================================

@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def resources_api(request):

    if request.method == "GET":

        resources = Resource.objects.all().order_by(
            "-created_at"
        )

        serializer = ResourceSerializer(
            resources,
            many=True
        )

        return Response(serializer.data)

    if not request.user.is_staff:
        return Response({"error": "Only staff can manage the shared resource catalog."}, status=status.HTTP_403_FORBIDDEN)

    serializer = ResourceSerializer(
        data=request.data
    )

    if serializer.is_valid():

        serializer.save()

        return Response(
            serializer.data,
            status=status.HTTP_201_CREATED
        )

    return Response(
        serializer.errors,
        status=status.HTTP_400_BAD_REQUEST
    )


# =========================================================
# WORKFLOWS
# =========================================================

@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def workflows_api(request):

    if request.method == "GET":

        workflows = Workflow.objects.all().order_by(
            "-created_at"
        )

        serializer = WorkflowSerializer(
            workflows,
            many=True
        )

        return Response(serializer.data)

    if not request.user.is_staff:
        return Response({"error": "Only staff can manage the shared workflow catalog."}, status=status.HTTP_403_FORBIDDEN)

    serializer = WorkflowSerializer(
        data=request.data
    )

    if serializer.is_valid():

        serializer.save()

        return Response(
            serializer.data,
            status=status.HTTP_201_CREATED
        )

    return Response(
        serializer.errors,
        status=status.HTTP_400_BAD_REQUEST
    )


# =========================================================
# TOOLS
# =========================================================

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def tools_api(request):
    tools = Tool.objects.all().order_by("name")

    serializer = ToolSerializer(
        tools,
        many=True
    )

    return Response(serializer.data)

# =========================================================
# TAGS
# =========================================================

@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def tags_api(request):

    if request.method == "GET":

        tags = Tag.objects.all().order_by(
            "name"
        )

        serializer = TagSerializer(
            tags,
            many=True
        )

        return Response(serializer.data)

    if not request.user.is_staff:
        return Response({"error": "Only staff can manage shared tags."}, status=status.HTTP_403_FORBIDDEN)

    serializer = TagSerializer(
        data=request.data
    )

    if serializer.is_valid():

        serializer.save()

        return Response(
            serializer.data,
            status=status.HTTP_201_CREATED
        )

    return Response(
        serializer.errors,
        status=status.HTTP_400_BAD_REQUEST
    )


# =========================================================
# TASKS
# =========================================================

@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def tasks_api(request):

    if request.method == "GET":
        tasks = Task.objects.filter(
            project__owner=request.user
        ).order_by("-created_at")

        serializer = TaskSerializer(tasks, many=True)
        return Response(serializer.data)

    if request.method == "POST":

        project_id = request.data.get("project")

        if not project_id:
            return Response({"error": "project is required."}, status=status.HTTP_400_BAD_REQUEST)

        project_obj = get_object_or_404(
            Project,
            pk=project_id,
            owner=request.user
        )

        serializer = TaskSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save(project=project_obj, assignee=request.user)

            return Response(
                serializer.data,
                status=status.HTTP_201_CREATED
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )

# =========================================================
# NOTES
# =========================================================

@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def notes_api(request):

    if request.method == "GET":
        notes = Note.objects.filter(
            project__owner=request.user
        ).order_by("-created_at")

        serializer = NoteSerializer(notes, many=True)
        return Response(serializer.data)

    if request.method == "POST":

        project_id = request.data.get("project")

        if not project_id:
            return Response({"error": "project is required."}, status=status.HTTP_400_BAD_REQUEST)

        project_obj = get_object_or_404(
            Project,
            pk=project_id,
            owner=request.user
        )

        serializer = NoteSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save(
                author=request.user,
                project=project_obj
            )

            return Response(
                serializer.data,
                status=status.HTTP_201_CREATED
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )


# =========================================================
# ACTIVITY
# =========================================================

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def activity_api(request):
    """Return only the authenticated user's activity, never global history."""
    activities = Activity.objects.filter(actor=request.user).order_by("-created_at")[:200]
    return Response(ActivitySerializer(activities, many=True).data)

# =========================================================
# SNIPPETS
# =========================================================

@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def snippets_api(request):

    if request.method == "GET":
        snippets = Snippet.objects.filter(
            author=request.user
        ).order_by("-created_at")

        serializer = SnippetSerializer(
            snippets,
            many=True
        )

        return Response(serializer.data)

    if request.method == "POST":

        project_id = request.data.get("project")

        project_obj = None

        if project_id:
            project_obj = get_object_or_404(
                Project,
                pk=project_id,
                owner=request.user
            )

        serializer = SnippetSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save(
                author=request.user,
                project=project_obj
            )

            return Response(
                serializer.data,
                status=status.HTTP_201_CREATED
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )

# =========================================================
# GITHUB AUTHORIZE
# =========================================================

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def github_authorize(request):

    if not GITHUB_CLIENT_ID:
        return Response(
            {
                "error": "GITHUB_CLIENT_ID is not configured."
            },
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

    if not GITHUB_CLIENT_SECRET:
        return Response(
            {
                "error": "GITHUB_CLIENT_SECRET is not configured."
            },
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

    if not settings.GITHUB_TOKEN_ENCRYPTION_KEY:
        return Response(
            {"error": "GitHub token encryption is not configured."},
            status=status.HTTP_503_SERVICE_UNAVAILABLE,
        )

    state = secrets.token_urlsafe(32)
    expires_before = timezone.now() - timedelta(minutes=10)
    GitHubOAuthState.objects.filter(user=request.user, created_at__lt=expires_before).delete()
    GitHubOAuthState.objects.filter(user=request.user, used=False).delete()
    GitHubOAuthState.objects.create(user=request.user, state=state)

    # Request the minimum scope needed for identity and public repositories.
    # Do not silently request broad private-repository access.
    github_url = "https://github.com/login/oauth/authorize?" + urlencode({
        "client_id": GITHUB_CLIENT_ID,
        "redirect_uri": GITHUB_OAUTH_REDIRECT,
        "scope": "read:user user:email",
        "state": state,
    })

    # Frontend receives this URL and redirects browser to it.
    return Response({
        "authorization_url": github_url
    })


# =========================================================
# GITHUB CALLBACK
# =========================================================

@api_view(["GET"])
@permission_classes([AllowAny])
def github_callback(request):

    code = request.query_params.get("code")
    state = request.query_params.get("state")
    github_error = request.query_params.get("error")

    if github_error:

        return redirect(f"{FRONTEND_URL}/?github=error")

    if not code or not state:

        return Response(
            {
                "error": "Missing code or state."
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        with transaction.atomic():
            oauth_state = GitHubOAuthState.objects.select_for_update().select_related("user").get(
                state=state,
                used=False,
                created_at__gte=timezone.now() - timedelta(minutes=10),
            )
            # Consume state before the external exchange to prevent replay.
            oauth_state.used = True
            oauth_state.save(update_fields=["used"])
    except GitHubOAuthState.DoesNotExist:
        return Response({"error": "Invalid or expired OAuth state."}, status=status.HTTP_400_BAD_REQUEST)

    # Exchange code for GitHub access token
    try:
        token_response = requests.post(
            "https://github.com/login/oauth/access_token",
            data={
                "client_id": GITHUB_CLIENT_ID,
                "client_secret": GITHUB_CLIENT_SECRET,
                "code": code,
                "redirect_uri": GITHUB_OAUTH_REDIRECT,
            },
            headers={"Accept": "application/json"},
            timeout=GITHUB_TIMEOUT,
        )

    except requests.RequestException:
        return github_service_unavailable()

    if token_response.status_code != 200:

        return Response({"error": "Failed to exchange GitHub code."}, status=status.HTTP_400_BAD_REQUEST)

    try:
        token_data = token_response.json()
    except ValueError:
        return github_service_unavailable()

    access_token = token_data.get(
        "access_token"
    )

    if not access_token:

        return Response({"error": "GitHub did not return an access token."}, status=status.HTTP_400_BAD_REQUEST)

    # -----------------------------------------------------
    # Get GitHub user
    # -----------------------------------------------------

    try:
        user_response = requests.get(
            f"{GITHUB_API_URL}/user",
            headers=github_headers(access_token),
            timeout=GITHUB_TIMEOUT,
        )
    except requests.RequestException:
        return github_service_unavailable()

    if user_response.status_code != 200:

        return Response({"error": "Failed to fetch GitHub user."}, status=status.HTTP_502_BAD_GATEWAY)

    try:
        github_user = user_response.json()
    except ValueError:
        return github_service_unavailable()

    github_id = github_user.get("id")
    github_login = github_user.get("login", "")

    # -----------------------------------------------------
    # Save GitHub account
    # -----------------------------------------------------

    GitHubAccount.objects.update_or_create(
        user=oauth_state.user,
        defaults={
            "github_id": github_id,
            "login": github_login,
            "access_token": access_token,
            "scope": token_data.get("scope", ""),
            "token_type": token_data.get(
                "token_type",
                "bearer"
            ),
        }
    )

    # -----------------------------------------------------
    # Update user profile
    # -----------------------------------------------------

    profile, _ = UserProfile.objects.get_or_create(
        user=oauth_state.user
    )

    github_html_url = github_user.get(
        "html_url",
        ""
    )

    if github_html_url:
        profile.github = github_html_url

    if not profile.avatar_url:
        profile.avatar_url = github_user.get(
            "avatar_url",
            ""
        )

    profile.save()

    # -----------------------------------------------------
    # Create activity
    # -----------------------------------------------------

    Activity.objects.create(
        actor=oauth_state.user,
        verb="connected_github",
        message=f"Connected GitHub account @{github_login}",
        related_type="github_account",
        metadata={
            "github_id": github_id,
            "login": github_login,
        }
    )

    # Redirect back to frontend
    return redirect(f"{FRONTEND_URL}/?github=connected")


# =========================================================
# GITHUB ACCOUNT
# =========================================================

@api_view(["GET", "DELETE"])
@permission_classes([IsAuthenticated])
def github_account_api(request):

    try:

        github_account = GitHubAccount.objects.get(
            user=request.user
        )

    except GitHubAccount.DoesNotExist:

        return Response({
            "connected": False,
            "account": None,
        })

    if request.method == "GET":

        serializer = GitHubAccountSerializer(
            github_account
        )

        data = serializer.data

        # Never expose access token
        data.pop(
            "access_token",
            None
        )

        return Response({
            "connected": True,
            "account": data,
        })

    # -----------------------------------------------------
    # Disconnect GitHub
    # -----------------------------------------------------

    github_account.delete()

    Activity.objects.create(
        actor=request.user,
        verb="disconnected_github",
        message="Disconnected GitHub account",
        related_type="github_account",
    )

    return Response(
        {
            "message": "GitHub account disconnected successfully."
        }
    )


# =========================================================
# GITHUB REPOSITORIES
# =========================================================

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def github_repos_api(request):


    try:

        github_account = GitHubAccount.objects.get(
            user=request.user
        )

    except GitHubAccount.DoesNotExist:

        return Response(
            {
                "error": "GitHub account is not connected."
            },
            status=status.HTTP_404_NOT_FOUND
        )

    if not github_account.access_token:

        return Response(
            {
                "error": "GitHub access token is missing."
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    page = request.query_params.get(
        "page",
        "1"
    )

    per_page = request.query_params.get(
        "per_page",
        "30"
    )

    try:
        page = max(1, int(page))
        per_page = min(
            100,
            max(1, int(per_page))
        )

    except ValueError:

        page = 1
        per_page = 30

    try:
        response = requests.get(
            f"{GITHUB_API_URL}/user/repos",
            headers=github_headers(github_account.access_token),
            params={
                "sort": "updated",
                "direction": "desc",
                "per_page": per_page,
                "page": page,
            },
            timeout=GITHUB_TIMEOUT,
        )
    except requests.RequestException:
        return github_service_unavailable()

    if response.status_code == 401:

        return Response(
            {
                "error": "GitHub access token is invalid or expired."
            },
            status=status.HTTP_401_UNAUTHORIZED
        )

    if response.status_code != 200:

        return Response({"error": "Failed to fetch GitHub repositories."}, status=status.HTTP_502_BAD_GATEWAY)

    try:
        repositories = response.json()
    except ValueError:
        return github_service_unavailable()

    formatted_repositories = []

    for repo in repositories:

        formatted_repositories.append({
            "id": repo.get("id"),
            "name": repo.get("name"),
            "full_name": repo.get("full_name"),
            "description": repo.get("description"),
            "html_url": repo.get("html_url"),
            "language": repo.get("language"),
            "private": repo.get("private"),
            "fork": repo.get("fork"),
            "default_branch": repo.get(
                "default_branch"
            ),
            "stars": repo.get(
                "stargazers_count",
                0
            ),
            "forks": repo.get(
                "forks_count",
                0
            ),
            "open_issues": repo.get(
                "open_issues_count",
                0
            ),
            "updated_at": repo.get(
                "updated_at"
            ),
            "created_at": repo.get(
                "created_at"
            ),
            "pushed_at": repo.get(
                "pushed_at"
            ),
            "owner": {
                "login": (
                    repo.get("owner") or {}
                ).get("login"),
                "avatar_url": (
                    repo.get("owner") or {}
                ).get("avatar_url"),
            },
        })

    return Response({
        "count": len(formatted_repositories),
        "page": page,
        "per_page": per_page,
        "repositories": formatted_repositories,
    })


# =========================================================
# GITHUB SYNC ACTIVITY
# =========================================================

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def github_sync_activity(request):

    try:

        github_account = GitHubAccount.objects.get(
            user=request.user
        )

    except GitHubAccount.DoesNotExist:

        return Response(
            {
                "error": "GitHub account is not connected."
            },
            status=status.HTTP_404_NOT_FOUND
        )

    if not github_account.access_token:

        return Response(
            {
                "error": "GitHub access token is missing."
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    # -----------------------------------------------------
    # Get authenticated GitHub user
    # -----------------------------------------------------

    try:
        user_response = requests.get(
            f"{GITHUB_API_URL}/user",
            headers=github_headers(github_account.access_token),
            timeout=GITHUB_TIMEOUT,
        )
    except requests.RequestException:
        return github_service_unavailable()

    if user_response.status_code != 200:

        return Response({"error": "Failed to authenticate with GitHub."}, status=status.HTTP_502_BAD_GATEWAY)

    try:
        github_user = user_response.json()
    except ValueError:
        return github_service_unavailable()

    github_login = github_user.get(
        "login"
    )

    # -----------------------------------------------------
    # Get GitHub events
    # -----------------------------------------------------

    try:
        events_response = requests.get(
            f"{GITHUB_API_URL}/users/{github_login}/events",
            headers=github_headers(github_account.access_token),
            params={"per_page": 30},
            timeout=GITHUB_TIMEOUT,
        )
    except requests.RequestException:
        return github_service_unavailable()

    if events_response.status_code != 200:

        return Response({"error": "Failed to fetch GitHub activity."}, status=status.HTTP_502_BAD_GATEWAY)

    try:
        events = events_response.json()
    except ValueError:
        return github_service_unavailable()

    synced = 0

    activities = []

    # -----------------------------------------------------
    # Convert GitHub events -> Developer OS Activity
    # -----------------------------------------------------

    for event in events:

        event_id = event.get(
            "id"
        )

        event_type = event.get(
            "type",
            "GitHubActivity"
        )

        repo = event.get(
            "repo"
        ) or {}

        repo_name = repo.get(
            "name",
            ""
        )

        message = (
            f"{event_type} in {repo_name}"
            if repo_name
            else event_type
        )

        # Avoid duplicate activity using metadata event_id
        already_exists = Activity.objects.filter(
            actor=request.user,
            related_type="github_event",
            metadata__github_event_id=event_id,
        ).exists()

        if already_exists:
            continue

        activity = Activity.objects.create(
            actor=request.user,
            verb=event_type,
            message=message,
            related_type="github_event",
            metadata={
                "github_event_id": event_id,
                "repo": repo_name,
                "event_type": event_type,
                "created_at": event.get(
                    "created_at"
                ),
            }
        )

        activities.append(
            ActivitySerializer(
                activity
            ).data
        )

        synced += 1

    # -----------------------------------------------------
    # Final sync activity
    # -----------------------------------------------------

    Activity.objects.create(
        actor=request.user,
        verb="synced_github_activity",
        message=f"Synced {synced} GitHub activities",
        related_type="github_account",
        metadata={
            "github_login": github_login,
            "synced_count": synced,
        }
    )

    return Response({
        "success": True,
        "github_user": github_login,
        "synced": synced,
        "activities": activities,
    })
