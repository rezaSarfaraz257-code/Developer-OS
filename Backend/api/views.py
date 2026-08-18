from django.contrib.auth import get_user_model
from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import Favorite, Resource, UserProfile, Workflow, project
from .serializers import FavoriteSerializer, ProjectSerializer, ResourceSerializer, WorkflowSerializer


@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def projects_api(request):
    if request.method == "GET":
        projects = project.objects.all()
        serializer = ProjectSerializer(projects, many=True)
        return Response(serializer.data)

    serializer = ProjectSerializer(data=request.data)

    if serializer.is_valid():
        project_data = serializer.save()
        return Response(ProjectSerializer(project_data).data, status=201)

    return Response(serializer.errors, status=400)


@api_view(["GET", 'PUT', "PATCH", "DELETE"])
@permission_classes([IsAuthenticated])
def project_detail_api(request, pk):
    try:
        project_item = project.objects.get(pk=pk)
    except project.DoesNotExist:
        return Response({"error": "Project not found"}, status=404)

    if request.method == "GET":
        return Response(ProjectSerializer(project_item).data)

    if request.method == "PATCH":
        serializer = ProjectSerializer(project_item, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)

        return Response(serializer.errors, status=400)

    if request.method == "PUT":
        serializer = ProjectSerializer(project_item, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)

    if request.method == "DELETE":
        project_item.delete()
        return Response(status=204)


@api_view(["GET", "PATCH"])
@permission_classes([IsAuthenticated])
def profile_api(request):
    user = request.user
    profile, _ = UserProfile.objects.get_or_create(user=user)

    if request.method == "GET":
        payload = {
            "id": user.id,
            "username": user.username,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "email": user.email,
            "full_name": profile.full_name or " ".join(filter(None, [user.first_name, user.last_name])).strip(),
            "avatar_url": profile.avatar_url,
            "bio": profile.bio,
            "github": profile.github,
            "linkedin": profile.linkedin,
            "x": profile.x,
            "website": profile.website,
        }
        return Response(payload)

    payload = request.data

    user.first_name = payload.get("first_name", user.first_name)
    user.last_name = payload.get("last_name", user.last_name)
    user.email = payload.get("email", user.email)
    user.save()

    profile.full_name = payload.get("full_name", profile.full_name)
    profile.avatar_url = payload.get("avatar_url", profile.avatar_url)
    profile.bio = payload.get("bio", profile.bio)
    profile.github = payload.get("github", profile.github)
    profile.linkedin = payload.get("linkedin", profile.linkedin)
    profile.x = payload.get("x", profile.x)
    profile.website = payload.get("website", profile.website)
    profile.save()

    return Response({
        "id": user.id,
        "username": user.username,
        "first_name": user.first_name,
        "last_name": user.last_name,
        "email": user.email,
        "full_name": profile.full_name or " ".join(filter(None, [user.first_name, user.last_name])).strip(),
        "avatar_url": profile.avatar_url,
        "bio": profile.bio,
        "github": profile.github,
        "linkedin": profile.linkedin,
        "x": profile.x,
        "website": profile.website,
    })


@api_view(["POST"])
def register_api(request):
    username = (request.data.get("username") or "").strip()
    email = (request.data.get("email") or "").strip()
    password = request.data.get("password") or ""
    first_name = (request.data.get("first_name") or "").strip()
    last_name = (request.data.get("last_name") or "").strip()

    if not username or not email or not password:
        return Response({"error": "username, email and password are required."}, status=status.HTTP_400_BAD_REQUEST)

    if User.objects.filter(username=username).exists():
        return Response({"error": "Username already exists."}, status=status.HTTP_400_BAD_REQUEST)

    if User.objects.filter(email__iexact=email).exists():
        return Response({"error": "Email already exists."}, status=status.HTTP_400_BAD_REQUEST)

    user = User.objects.create_user(
        username=username,
        email=email,
        password=password,
        first_name=first_name,
        last_name=last_name,
    )

    UserProfile.objects.get_or_create(user=user)

    return Response({
        "id": user.id,
        "username": user.username,
        "email": user.email,
        "first_name": user.first_name,
        "last_name": user.last_name,
    }, status=status.HTTP_201_CREATED)


@api_view(["GET", "POST", "DELETE"])
@permission_classes([IsAuthenticated])
def favorites_api(request):
    if request.method == "GET":
        favorites = Favorite.objects.filter(user=request.user).order_by("-created_at")
        serializer = FavoriteSerializer(favorites, many=True)
        return Response(serializer.data)

    if request.method == "DELETE":
        tool_name = (request.data.get("tool_name") or request.query_params.get("tool_name") or "").strip()
        if not tool_name:
            return Response({"error": "tool_name is required."}, status=status.HTTP_400_BAD_REQUEST)

        deleted_count, _ = Favorite.objects.filter(user=request.user, tool_name=tool_name).delete()
        if deleted_count == 0:
            return Response({"error": "Favorite not found."}, status=status.HTTP_404_NOT_FOUND)

        return Response(status=status.HTTP_204_NO_CONTENT)

    serializer = FavoriteSerializer(data={
        "user": request.user.id,
        **request.data,
    })

    if serializer.is_valid():
        serializer.save(user=request.user)
        return Response(serializer.data, status=201)

    return Response(serializer.errors, status=400)


@api_view(["GET", "POST"])
def resources_api(request):
    if request.method == "GET":
        resources = Resource.objects.all().order_by("-created_at")
        serializer = ResourceSerializer(resources, many=True)
        return Response(serializer.data)

    serializer = ResourceSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=201)

    return Response(serializer.errors, status=400)


@api_view(["GET", "POST"])
def workflows_api(request):
    if request.method == "GET":
        workflows = Workflow.objects.all().order_by("-created_at")
        serializer = WorkflowSerializer(workflows, many=True)
        return Response(serializer.data)

    serializer = WorkflowSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=201)

    return Response(serializer.errors, status=400)
