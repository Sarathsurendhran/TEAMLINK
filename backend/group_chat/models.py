from django.db import models
from workspaces.models import WorkSpaces, WorkSpaceMembers
from users.models import User
from django.utils import timezone


class WorkspaceGroups(models.Model):
    group_name = models.CharField(max_length=100, null=True)
    description = models.CharField(max_length=200, null=True)
    is_private = models.BooleanField(default=False)
    topic = models.CharField(max_length=200, null=True)
    created_by = models.ForeignKey(
        WorkSpaceMembers, on_delete=models.SET_NULL, null=True
    )
    workspace = models.ForeignKey(WorkSpaces, on_delete=models.CASCADE)
    created_on = models.DateTimeField(auto_now_add=True)

    def __str__(self) -> str:
        return self.group_name


class GroupMembers(models.Model):
    group = models.ForeignKey(WorkspaceGroups, on_delete=models.CASCADE)
    member = models.ForeignKey(WorkSpaceMembers, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.member} {self.group}"


class GroupChatMessages(models.Model):
    sender = models.ForeignKey(User, on_delete=models.CASCADE)
    message = models.CharField(default=" ", null=True, blank=True)
    time_stamp = models.DateTimeField(default=timezone.now)
    group = models.CharField(max_length=100, null=True)
    type = models.CharField(default="text_message")
    read = models.BooleanField(default=False, null=True)

    def __str__(self):
        return f"{self.sender}:{self.message}"


class Notification(models.Model):
    sender = models.ForeignKey(
        User, related_name="sent_notifications", on_delete=models.CASCADE, null=True
    )
    recipient = models.ForeignKey(
        User, related_name="received_notifications", on_delete=models.CASCADE, null=True
    )
    message = models.TextField(null=True)
    read = models.BooleanField(default=False, null=True)
    timestamp = models.DateTimeField(auto_now_add=True, null=True)

    class Meta:
        ordering = ["-timestamp"]


class Task(models.Model):
    STATUS_CHOICES = (
        ("pending", "Pending"),
        ("in_progress", "In Progress"),
        ("completed", "Completed"),
        ("on_hold", "On Hold"),
    )
    workspace = models.ForeignKey(WorkSpaces, on_delete=models.CASCADE)
    group = models.ForeignKey(WorkspaceGroups, on_delete=models.CASCADE)
    task_name = models.CharField(max_length=200)
    task_description = models.CharField(max_length=500)
    start_date = models.DateField()
    end_date = models.DateField()
    assigned_by = models.ForeignKey(
        User, related_name="task_assigned_by", on_delete=models.CASCADE
    )
    assigned_to = models.ForeignKey(
        User, related_name="task_assigned_to", on_delete=models.CASCADE
    )
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="pending")

    def __str__(self) -> str:
        return self.task_name
