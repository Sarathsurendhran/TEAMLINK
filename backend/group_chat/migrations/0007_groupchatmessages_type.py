# Generated by Django 5.0.6 on 2024-08-03 12:46

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('group_chat', '0006_groupchatmessages_group'),
    ]

    operations = [
        migrations.AddField(
            model_name='groupchatmessages',
            name='type',
            field=models.CharField(default='text_message'),
        ),
    ]
