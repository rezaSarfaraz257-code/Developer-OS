from django.contrib.auth.models import User
from django.db import models

# Create your models here.

class project(models.Model):
    title = models.CharField(max_length=100)
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.title


class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="profile")
    full_name = models.CharField(max_length=200, blank=True, default="")
    avatar_url = models.URLField(blank=True, default="")
    bio = models.TextField(blank=True, default="")
    github = models.URLField(blank=True, default="")
    linkedin = models.URLField(blank=True, default="")
    x = models.URLField(blank=True, default="")
    website = models.URLField(blank=True, default="")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.username} profile"


class Resource(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True, default="")
    resource_type = models.CharField(max_length=50, default="Guide")
    category = models.CharField(max_length=80, default="General")
    link = models.URLField(blank=True, default="")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title


class Workflow(models.Model):
    title = models.CharField(max_length=200)
    level = models.CharField(max_length=50, default="Beginner")
    duration = models.CharField(max_length=50, default="Flexible")
    summary = models.TextField(blank=True, default="")
    steps = models.JSONField(default=list, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title


class Favorite(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="favorites")
    tool_name = models.CharField(max_length=100)
    tag = models.CharField(max_length=50, blank=True, default="")
    description = models.TextField(blank=True, default="")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("user", "tool_name")

    def __str__(self):
        return f"{self.user.username}: {self.tool_name}"