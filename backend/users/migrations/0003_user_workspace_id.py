# Generated by Django 5.0.6 on 2024-06-27 14:56

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0002_alter_user_is_active'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='workspace_id',
            field=models.CharField(max_length=20, null=True),
        ),
    ]
