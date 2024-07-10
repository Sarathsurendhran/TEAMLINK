# Generated by Django 5.0.6 on 2024-07-04 12:56

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0003_user_workspace_id'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='user',
            name='workspace_id',
        ),
        migrations.AddField(
            model_name='user',
            name='encrypted_data',
            field=models.CharField(max_length=120, null=True),
        ),
    ]
