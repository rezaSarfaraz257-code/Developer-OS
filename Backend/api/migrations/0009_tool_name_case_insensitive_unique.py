from django.db import migrations, models
from django.db.models.functions import Lower


def merge_duplicate_tools(apps, schema_editor):
    """Keep one catalog tool per case-insensitive name without losing favorites."""
    Favorite = apps.get_model("api", "Favorite")
    Tool = apps.get_model("api", "Tool")
    canonical_by_name = {}

    for tool in Tool.objects.order_by("id").iterator():
        normalized_name = tool.name.casefold()
        canonical = canonical_by_name.get(normalized_name)
        if canonical is None:
            canonical_by_name[normalized_name] = tool
            continue

        for favorite in Favorite.objects.filter(tool_id=tool.pk).iterator():
            if Favorite.objects.filter(user_id=favorite.user_id, tool_id=canonical.pk).exists():
                favorite.delete()
            else:
                favorite.tool_id = canonical.pk
                favorite.save(update_fields=["tool"])
        tool.delete()


class Migration(migrations.Migration):

    dependencies = [
        ("api", "0008_userprofile_avatar"),
    ]

    operations = [
        migrations.RunPython(merge_duplicate_tools, migrations.RunPython.noop),
        migrations.AddConstraint(
            model_name="tool",
            constraint=models.UniqueConstraint(
                Lower("name"),
                name="unique_tool_name_case_insensitive",
            ),
        ),
    ]
