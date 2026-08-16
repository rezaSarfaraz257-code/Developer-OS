from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from .serializers import ProjectSerializer
from .models import project
from rest_framework.permissions import IsAuthenticated


@api_view(['GET'])
def project_api(request):
    projects = project.objects.all()
    serializer = ProjectSerializer(projects, many=True)
    return Response(serializer.data)


@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def projects_api(request):
    if request.method == "GET":
        projects = project.objects.all()
        serializer = ProjectSerializer(projects, many=True)
        return Response(serializer.data)

    if not request.user or not request.user.is_authenticated:
        return Response({"detail": "Authentication required."}, status=401)

    serializer = ProjectSerializer(data=request.data)

    if serializer.is_valid():
        project_data = serializer.save()
        return Response(
            ProjectSerializer(project_data).data,
            status=201
        )

    return Response(serializer.errors, status=400)


@api_view(["PATCH", "DELETE"])
@permission_classes([IsAuthenticated])
def project_detail_api(request, pk):

    try:
        projects = project.objects.get(pk=pk)
    except project.DoesNotExist:
        return Response(
            {"error": "Project not found"},
            status=404
        )

    if request.method == "PATCH":
        serializer = ProjectSerializer(
            projects,
            data=request.data,
            partial=True
        )

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)

        return Response(
            serializer.errors,
            status=400
        )

    if request.method == "DELETE":
        project.delete()
        return Response(status=204)
