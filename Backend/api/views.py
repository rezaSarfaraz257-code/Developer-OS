from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .serializers import UserSerializer, ProjectSerializer
from .models import project, UserProfile


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
