from django.db import migrations, models

import api.models


class Migration(migrations.Migration):

    dependencies = [
        ("api", "0007_encrypt_github_tokens"),
    ]

    operations = [
        migrations.AddField(
            model_name="userprofile",
            name="avatar",
            field=models.ImageField(blank=True, upload_to=api.models.profile_avatar_upload_to),
        ),
    ]
