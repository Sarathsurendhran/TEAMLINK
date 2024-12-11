# Generated by Django 5.0.6 on 2024-09-24 06:52

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('group_chat', '0012_task'),
    ]

    operations = [
        migrations.AddField(
            model_name='task',
            name='status',
            field=models.CharField(choices=[('pending', 'Pending'), ('in_progress', 'In Progress'), ('completed', 'Completed'), ('on_hold', 'On Hold')], default='pending', max_length=20),
        ),
    ]