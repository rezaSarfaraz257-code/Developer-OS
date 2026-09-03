from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

import os
import uuid
import requests

from django.shortcuts import redirect
from django.utils import timezone

from .models import (
    Favorite,
    Resource,
    Tool,
    UserProfile,
    Workflow,
    project,
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
)

GITHUB_API_URL = "https://api.github.com"


# =========================================================
# PROJECTS
# =========================================================

@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def projects_api(request):

    if request.method == "GET":
        projects = project.objects.all().order_by("-created_at")
        serializer = ProjectSerializer(projects, many=True)

        return Response(serializer.data)

    serializer = ProjectSerializer(data=request.data)

    if serializer.is_valid():
        project_data = serializer.save()

        return Response(
            ProjectSerializer(project_data).data,
            status=status.HTTP_201_CREATED
        )

    return Response(
        serializer.errors,
        status=status.HTTP_400_BAD_REQUEST
    )


@api_view(["GET", "PUT", "PATCH", "DELETE"])
@permission_classes([IsAuthenticated])
def project_detail_api(request, pk):

    try:
        project_item = project.objects.get(pk=pk)

    except project.DoesNotExist:
        return Response(
            {"error": "Project not found"},
            status=status.HTTP_404_NOT_FOUND
        )

    if request.method == "GET":

        return Response(
            ProjectSerializer(project_item).data
        )

    if request.method == "PATCH":

        serializer = ProjectSerializer(
            project_item,
            data=request.data,
            partial=True
        )

        if serializer.is_valid():
            serializer.save()

            return Response(serializer.data)

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )

    if request.method == "PUT":

        serializer = ProjectSerializer(
            project_item,
            data=request.data
        )

        if serializer.is_valid():
            serializer.save()

            return Response(serializer.data)

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )

    if request.method == "DELETE":

        project_item.delete()

        return Response(
            status=status.HTTP_204_NO_CONTENT
        )


# =========================================================
# PROFILE
# =========================================================

@api_view(["GET", "PATCH"])
@permission_classes([IsAuthenticated])
def profile_api(request):

    user = request.user

    profile, _ = UserProfile.objects.get_or_create(
        user=user
    )

    if request.method == "GET":

        full_name = (
            profile.full_name
            or " ".join(
                filter(
                    None,
                    [
                        user.first_name,
                        user.last_name
                    ]
                )
            ).strip()
        )

        return Response({
            "id": user.id,
            "username": user.username,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "email": user.email,
            "full_name": full_name,
            "avatar_url": profile.avatar_url,
            "bio": profile.bio,
            "github": profile.github,
            "linkedin": profile.linkedin,
            "x": profile.x,
            "website": profile.website,
        })

    payload = request.data

    user.first_name = payload.get(
        "first_name",
        user.first_name
    )

    user.last_name = payload.get(
        "last_name",
        user.last_name
    )

    user.email = payload.get(
        "email",
        user.email
    )

    user.save()

    profile.full_name = payload.get(
        "full_name",
        profile.full_name
    )

    profile.avatar_url = payload.get(
        "avatar_url",
        profile.avatar_url
    )

    profile.bio = payload.get(
        "bio",
        profile.bio
    )

    profile.github = payload.get(
        "github",
        profile.github
    )

    profile.linkedin = payload.get(
        "linkedin",
        profile.linkedin
    )

    profile.x = payload.get(
        "x",
        profile.x
    )

    profile.website = payload.get(
        "website",
        profile.website
    )

    profile.save()

    full_name = (
        profile.full_name
        or " ".join(
            filter(
                None,
                [
                    user.first_name,
                    user.last_name
                ]
            )
        ).strip()
    )

    return Response({
        "id": user.id,
        "username": user.username,
        "first_name": user.first_name,
        "last_name": user.last_name,
        "email": user.email,
        "full_name": full_name,
        "avatar_url": profile.avatar_url,
        "bio": profile.bio,
        "github": profile.github,
        "linkedin": profile.linkedin,
        "x": profile.x,
        "website": profile.website,
    })


# =========================================================
# REGISTER
# =========================================================

@api_view(["POST"])
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

    if User.objects.filter(
        username=username
    ).exists():

        return Response(
            {
                "error": "Username already exists."
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    if User.objects.filter(
        email__iexact=email
    ).exists():

        return Response(
            {
                "error": "Email already exists."
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    user = User.objects.create_user(
        username=username,
        email=email,
        password=password,
        first_name=first_name,
        last_name=last_name,
    )

    UserProfile.objects.get_or_create(
        user=user
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

        tool_name = (
            request.data.get("tool_name")
            or request.query_params.get("tool_name")
            or ""
        ).strip()

        if not tool_name:

            return Response(
                {
                    "error": "tool_name is required."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        deleted_count, _ = Favorite.objects.filter(
            user=request.user,
            tool_name=tool_name
        ).delete()

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

    serializer = FavoriteSerializer(
        data={
            "user": request.user.id,
            **request.data,
        }
    )

    if serializer.is_valid():

        serializer.save(
            user=request.user
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
# RESOURCES
# =========================================================

@api_view(["GET", "POST"])
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

@api_view(["GET", "POST"])
def tools_api(request):

    if request.method == "GET":

        tools = Tool.objects.all().order_by(
            "-created_at"
        )

        serializer = ToolSerializer(
            tools,
            many=True
        )

        return Response(serializer.data)

    serializer = ToolSerializer(
        data=request.data
    )

    if serializer.is_valid():

        tool = serializer.save()

        return Response(
            ToolSerializer(tool).data,
            status=status.HTTP_201_CREATED
        )

    return Response(
        serializer.errors,
        status=status.HTTP_400_BAD_REQUEST
    )


# =========================================================
# TAGS
# =========================================================

@api_view(["GET", "POST"])
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

        qs = Task.objects.all().order_by(
            "-created_at"
        )

        serializer = TaskSerializer(
            qs,
            many=True
        )

        return Response(serializer.data)

    serializer = TaskSerializer(
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
# NOTES
# =========================================================

@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def notes_api(request):

    if request.method == "GET":

        qs = Note.objects.all().order_by(
            "-created_at"
        )

        serializer = NoteSerializer(
            qs,
            many=True
        )

        return Response(serializer.data)

    serializer = NoteSerializer(
        data=request.data
    )

    if serializer.is_valid():

        serializer.save(
            author=request.user
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

    qs = Activity.objects.all().order_by(
        "-created_at"
    )[:200]

    serializer = ActivitySerializer(
        qs,
        many=True
    )

    return Response(serializer.data)


# =========================================================
# SNIPPETS
# =========================================================

@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def snippets_api(request):

    if request.method == "GET":

        qs = Snippet.objects.all().order_by(
            "-created_at"
        )

        serializer = SnippetSerializer(
            qs,
            many=True
        )

        return Response(serializer.data)

    serializer = SnippetSerializer(
        data=request.data
    )

    if serializer.is_valid():

        serializer.save(
            author=request.user
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
# GITHUB HELPERS
# =========================================================

def github_headers(access_token):

    return {
        "Authorization": f"Bearer {access_token}",
        "Accept": "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
    }


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

    # Generate secure random state
    state = uuid.uuid4().hex

    # Remove old states for this user
    GitHubOAuthState.objects.filter(
        user=request.user,
        used=False
    ).delete()

    # Save state
    GitHubOAuthState.objects.create(
        user=request.user,
        state=state
    )

    github_url = (
        "https://github.com/login/oauth/authorize"
        f"?client_id={GITHUB_CLIENT_ID}"
        f"&redirect_uri={GITHUB_OAUTH_REDIRECT}"
        f"&scope=read:user%20user:email%20repo"
        f"&state={state}"
    )

    # Frontend receives this URL and redirects browser to it.
    return Response({
        "authorization_url": github_url
    })


# =========================================================
# GITHUB CALLBACK
# =========================================================

@api_view(["GET"])
def github_callback(request):

    code = request.query_params.get("code")
    state = request.query_params.get("state")
    github_error = request.query_params.get("error")

    if github_error:

        return redirect(
            f"{FRONTEND_URL}/settings?github=error"
        )

    if not code or not state:

        return Response(
            {
                "error": "Missing code or state."
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    try:

        oauth_state = GitHubOAuthState.objects.select_related(
            "user"
        ).get(
            state=state,
            used=False
        )

    except GitHubOAuthState.DoesNotExist:

        return Response(
            {
                "error": "Invalid or expired OAuth state."
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    # Mark state as used immediately
    oauth_state.used = True
    oauth_state.save(update_fields=["used"])

    # Exchange code for GitHub access token
    token_response = requests.post(
        "https://github.com/login/oauth/access_token",
        data={
            "client_id": GITHUB_CLIENT_ID,
            "client_secret": GITHUB_CLIENT_SECRET,
            "code": code,
            "redirect_uri": GITHUB_OAUTH_REDIRECT,
        },
        headers={
            "Accept": "application/json"
        },
        timeout=15,
    )

    if token_response.status_code != 200:

        return Response(
            {
                "error": "Failed to exchange GitHub code.",
                "details": token_response.text,
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    token_data = token_response.json()

    access_token = token_data.get(
        "access_token"
    )

    if not access_token:

        return Response(
            {
                "error": "GitHub did not return an access token.",
                "details": token_data,
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    # -----------------------------------------------------
    # Get GitHub user
    # -----------------------------------------------------

    user_response = requests.get(
        f"{GITHUB_API_URL}/user",
        headers=github_headers(access_token),
        timeout=15,
    )

    if user_response.status_code != 200:

        return Response(
            {
                "error": "Failed to fetch GitHub user.",
                "details": user_response.text,
            },
            status=user_response.status_code
        )

    github_user = user_response.json()

    github_id = github_user.get("id")
    github_login = github_user.get("login", "")

    # -----------------------------------------------------
    # Save GitHub account
    # -----------------------------------------------------

    github_account, _ = GitHubAccount.objects.update_or_create(
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
    return redirect(
        f"{FRONTEND_URL}/settings?github=connected"
    )


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

    response = requests.get(
        f"{GITHUB_API_URL}/user/repos",
        headers=github_headers(
            github_account.access_token
        ),
        params={
            "sort": "updated",
            "direction": "desc",
            "per_page": per_page,
            "page": page,
        },
        timeout=15,
    )

    if response.status_code == 401:

        return Response(
            {
                "error": "GitHub access token is invalid or expired."
            },
            status=status.HTTP_401_UNAUTHORIZED
        )

    if response.status_code != 200:

        return Response(
            {
                "error": "Failed to fetch GitHub repositories.",
                "details": response.text,
            },
            status=response.status_code
        )

    repositories = response.json()

    formatted_repositories = []

    for repo in repositories:

        formatted_repositories.append({
            "id": repo.get("id"),
            "name": repo.get("name"),
            "full_name": repo.get("full_name"),
            "description": repo.get("description"),
            "html_url": repo.get("html_url"),
            "clone_url": repo.get("clone_url"),
            "ssh_url": repo.get("ssh_url"),
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

    user_response = requests.get(
        f"{GITHUB_API_URL}/user",
        headers=github_headers(
            github_account.access_token
        ),
        timeout=15,
    )

    if user_response.status_code != 200:

        return Response(
            {
                "error": "Failed to authenticate with GitHub.",
                "details": user_response.text,
            },
            status=user_response.status_code
        )

    github_user = user_response.json()

    github_login = github_user.get(
        "login"
    )

    # -----------------------------------------------------
    # Get GitHub events
    # -----------------------------------------------------

    events_response = requests.get(
        f"{GITHUB_API_URL}/users/{github_login}/events",
        headers=github_headers(
            github_account.access_token
        ),
        params={
            "per_page": 30
        },
        timeout=15,
    )

    if events_response.status_code != 200:

        return Response(
            {
                "error": "Failed to fetch GitHub activity.",
                "details": events_response.text,
            },
            status=events_response.status_code
        )

    events = events_response.json()

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

        payload = event.get(
            "payload"
        ) or {}

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
                "payload": payload,
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