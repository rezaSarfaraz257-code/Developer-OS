# Generated manually to preserve data while reconciling the previous model refactor.

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


def preserve_existing_data(apps, schema_editor):
    """Map the original string favorites and ownerless projects safely."""
    Favorite = apps.get_model("api", "Favorite")
    Tool = apps.get_model("api", "Tool")
    Project = apps.get_model("api", "Project")
    User = apps.get_model(*settings.AUTH_USER_MODEL.split("."))

    for favorite in Favorite.objects.filter(tool__isnull=True).iterator():
        tool = Tool.objects.filter(name__iexact=favorite.tool_name).order_by("id").first()
        if tool is None:
            tool = Tool.objects.create(
                name=favorite.tool_name,
                tag=favorite.tag or "General",
                description=favorite.description or "",
            )
        favorite.tool_id = tool.pk
        favorite.save(update_fields=["tool"])

    # Old Project rows had no owner.  Never assign their data to a real user:
    # place them under a disabled account so an administrator can explicitly
    # reassign them after the migration.
    if Project.objects.filter(owner__isnull=True).exists():
        legacy_owner, _ = User.objects.get_or_create(
            username="legacy-import",
            defaults={"is_active": False, "password": "!"},
        )
        Project.objects.filter(owner__isnull=True).update(owner=legacy_owner)


class Migration(migrations.Migration):

    dependencies = [
        ("api", "0005_tag_activity_githubaccount_githuboauthstate_note_and_more"),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.AlterUniqueTogether(
            name="favorite",
            unique_together=set(),
        ),
        migrations.AddField(
            model_name="favorite",
            name="tool",
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.CASCADE,
                related_name="favorited_by",
                to="api.tool",
            ),
        ),
        migrations.AddField(
            model_name="project",
            name="owner",
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.CASCADE,
                related_name="projects",
                to=settings.AUTH_USER_MODEL,
            ),
        ),
        migrations.AddField(
            model_name="snippet",
            name="project",
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.CASCADE,
                related_name="snippets",
                to="api.project",
            ),
        ),
        migrations.AlterField(
            model_name="project",
            name="description",
            field=models.TextField(blank=True, default=""),
        ),
        migrations.AlterField(
            model_name="project",
            name="title",
            field=models.CharField(max_length=255),
        ),
        migrations.AlterField(
            model_name="project",
            name="uploaded_at",
            field=models.DateTimeField(auto_now=True),
        ),
        migrations.AlterField(
            model_name="task",
            name="assignee",
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.SET_NULL,
                related_name="assigned_tasks",
                to=settings.AUTH_USER_MODEL,
            ),
        ),
        migrations.RunPython(preserve_existing_data, migrations.RunPython.noop),
        migrations.AlterField(
            model_name="favorite",
            name="tool",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE,
                related_name="favorited_by",
                to="api.tool",
            ),
        ),
        migrations.AlterField(
            model_name="project",
            name="owner",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE,
                related_name="projects",
                to=settings.AUTH_USER_MODEL,
            ),
        ),
        migrations.RemoveField(model_name="favorite", name="description"),
        migrations.RemoveField(model_name="favorite", name="tag"),
        migrations.RemoveField(model_name="favorite", name="tool_name"),
        migrations.AddConstraint(
            model_name="favorite",
            constraint=models.UniqueConstraint(fields=("user", "tool"), name="unique_user_tool_favorite"),
        ),
    ]
