from django.db import models
from users.models import User

from django.utils import timezone


class OneToOneChatMessages(models.Model):
    sender = models.ForeignKey(User, on_delete=models.CASCADE)
    message = models.CharField(null=True)
    time_stamp = models.DateTimeField(default=timezone.now)
    type = models.CharField(default="text_message")
    room = models.CharField(max_length=100)

    def __str__(self) -> str:
        return f"{self.sender}:{self.message}"
