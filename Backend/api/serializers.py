from django.contrib.auth.models import User
from rest_framework import serializers

from .models import Favorite, Resource, Tool, UserProfile, Workflow, project
from .models import Tag, Task, Note, Activity
from .models import Snippet
from .models import GitHubAccount


class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = project
        fields = '__all__'


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = [
            'full_name',
            'avatar_url',
            'bio',
            'github',
            'linkedin',
            'x',
            'website',
        ]


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            'id',
            'username',
            'first_name',
            'last_name',
            'email',
        ]


class ResourceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Resource
        fields = '__all__'


class WorkflowSerializer(serializers.ModelSerializer):
    class Meta:
        model = Workflow
        fields = '__all__'


class FavoriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Favorite
        fields = '__all__'


class ToolSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tool
        fields = '__all__'


class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = '__all__'


class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = '__all__'


class NoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Note
        fields = '__all__'


class ActivitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Activity
        fields = '__all__'


class SnippetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Snippet
        fields = '__all__'


class GitHubAccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = GitHubAccount
        fields = ['github_id', 'login', 'scope', 'token_type', 'created_at', 'updated_at']