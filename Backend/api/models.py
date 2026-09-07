from uuid import uuid4

from django.contrib.auth.models import User
from django.db import models
from django.utils.text import slugify

from .fields import EncryptedTextField

def profile_avatar_upload_to(instance, _filename):
    """Store avatars under an opaque, user-scoped name.

    The API re-encodes every accepted avatar as WebP before saving it, so the
    generated extension is deliberate rather than supplied by the client.
    """
    return f"avatars/user_{instance.user_id}/{uuid4().hex}.webp"


# Create your models here.

class Project(models.Model):
    owner = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="projects"
    )

    CATEGORY_CHOICES = [
        ("Frontend", "Frontend"),
        ("Backend", "Backend"),
        ("DevOps", "DevOps"),
        ("AI", "AI"),
        ("Design", "Design"),
        ("Productivity", "Productivity"),
        ("General", "General"),
    ]

    STATUS_CHOICES = [
        ("In Progress", "In Progress"),
        ("Planning", "Planning"),
        ("Completed", "Completed"),
        ("On Hold", "On Hold"),
    ]

    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, default="")
    category = models.CharField(
        max_length=50,
        choices=CATEGORY_CHOICES,
        default="General"
    )
    tags = models.JSONField(default=list, blank=True)
    link = models.URLField(blank=True, default="")
    status = models.CharField(
        max_length=40,
        choices=STATUS_CHOICES,
        default="In Progress",
    )
    created_at = models.DateTimeField(auto_now_add=True)
    uploaded_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="profile")
    full_name = models.CharField(max_length=200, blank=True, default="")
    avatar = models.ImageField(upload_to=profile_avatar_upload_to, blank=True)
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

class Tool(models.Model):
    CATEGORY_CHOICES = [
        ("Frontend", "Frontend"),
        ("Backend", "Backend"),
        ("DevOps", "DevOps"),
        ("AI", "AI"),
        ("Design", "Design"),
        ("Productivity", "Productivity"),
        ("General", "General"),
    ]

    name = models.CharField(max_length=120)
    tag = models.CharField(max_length=50, default="General")
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES, default="General")
    description = models.TextField(blank=True, default="")
    accent = models.CharField(max_length=20, default="cyan")
    rating = models.DecimalField(max_digits=3, decimal_places=1, default=4.5)
    features = models.JSONField(default=list, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class Favorite(models.Model):
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="favorites"
    )

    tool = models.ForeignKey(
        Tool,
        on_delete=models.CASCADE,
        related_name="favorited_by",
    )

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["user", "tool"],
                name="unique_user_tool_favorite"
            )
        ]

    def __str__(self):
        return f"{self.user.username}: {self.tool.name}"

class Tag(models.Model):
    name = models.CharField(max_length=80, unique=True)
    slug = models.SlugField(max_length=100, unique=True, blank=True)

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            base_slug = slugify(self.name)[:90] or "tag"
            candidate = base_slug
            suffix = 2
            while type(self).objects.exclude(pk=self.pk).filter(slug=candidate).exists():
                candidate = f"{base_slug[:95 - len(str(suffix))]}-{suffix}"
                suffix += 1
            self.slug = candidate
        super().save(*args, **kwargs)

class Task(models.Model):
    STATUS = [
        ("todo", "To Do"),
        ("in_progress", "In Progress"),
        ("done", "Done"),
        ("blocked", "Blocked"),
    ]

    project = models.ForeignKey(
        Project,
        on_delete=models.CASCADE,
        related_name="tasks",
        null=True,
        blank=True,
    )

    assignee = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="assigned_tasks",
    )

    status = models.CharField(
        max_length=32,
        choices=STATUS,
        default="todo",
    )

    title = models.CharField(
        max_length=200
    )

    description = models.TextField(
        blank=True,
        default=""
    )

    due_date = models.DateField(
        null=True,
        blank=True
    )

    tags = models.JSONField(
        default=list,
        blank=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    def __str__(self):
        return self.title

class Note(models.Model):
    title = models.CharField(max_length=200, blank=True, default="")
    content = models.TextField()
    author = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name="notes")
    project = models.ForeignKey(Project, on_delete=models.CASCADE, null=True, blank=True, related_name="notes")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title or f"Note {self.pk}"

class Activity(models.Model):
    actor = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name="activities")
    verb = models.CharField(max_length=200)
    message = models.TextField(blank=True, default="")
    related_type = models.CharField(max_length=100, blank=True, default="")
    related_id = models.IntegerField(null=True, blank=True)
    metadata = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.actor or 'System'} {self.verb}"

class Snippet(models.Model):
    LANGUAGE_CHOICES = [
        ("py", "Python"),
        ("js", "JavaScript"),
        ("sh", "Shell"),
        ("sql", "SQL"),
        ("md", "Markdown"),
        ("txt", "Text"),
    ]

    project = models.ForeignKey(
        Project,
        on_delete=models.CASCADE,
        related_name="snippets",
        null=True,
        blank=True,
    )

    title = models.CharField(max_length=200)
    code = models.TextField()
    language = models.CharField(max_length=10, choices=LANGUAGE_CHOICES, default="py")
    description = models.TextField(blank=True, default="")
    author = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name="snippets")
    tags = models.JSONField(default=list, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title

class GitHubOAuthState(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="github_states")
    state = models.CharField(max_length=200, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    used = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.user.username} - {self.state}"

class GitHubAccount(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="github_account")
    github_id = models.IntegerField(null=True, blank=True)
    login = models.CharField(max_length=200, blank=True, default="")
    access_token = EncryptedTextField(blank=True, default="")
    scope = models.CharField(max_length=200, blank=True, default="")
    token_type = models.CharField(max_length=50, blank=True, default="")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.username} -> {self.login or 'github'}"

