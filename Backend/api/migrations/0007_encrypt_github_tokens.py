import api.fields
from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ("api", "0006_reconcile_owned_models"),
    ]

    operations = [
        migrations.AlterField(
            model_name="githubaccount",
            name="access_token",
            field=api.fields.EncryptedTextField(blank=True, default=""),
        ),
    ]
