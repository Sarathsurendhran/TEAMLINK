# Generated by Django 5.0.6 on 2024-07-24 05:49

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('workspaces', '0003_workspacemembers_is_active'),
    ]

    operations = [
        migrations.AlterField(
            model_name='workspacemembers',
            name='profile_picture',
            field=models.ImageField(upload_to='profile_pictures'),
        ),
    ]
