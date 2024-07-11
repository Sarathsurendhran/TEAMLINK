from django.db import models
from workspaces.models import WorkSpaces, WorkSpaceMembers
from django.utils import timezone


class WorkspaceGroups(models.Model):
    group_name = models.CharField(max_length=100, null=True)
    description = models.CharField(max_length=200, null=True)
    is_private = models.BooleanField(default=False)
    created_by = models.ForeignKey(
        WorkSpaceMembers, on_delete=models.SET_NULL, null=True
    )
    workspace_name = models.ForeignKey(WorkSpaces, on_delete=models.CASCADE)
    created_on = models.DateTimeField(auto_now_add=True)

    def __str__(self) -> str:
        return self.group_name


class GroupMembers(models.Model):
    group = models.ForeignKey(WorkspaceGroups, on_delete=models.CASCADE)
    member = models.ForeignKey(WorkSpaceMembers, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.member} {self.group}"


class GroupChatMessages(models.Model):
    sender = models.ForeignKey(WorkSpaceMembers, on_delete=models.CASCADE)
    message = models.CharField(default=" ", null=True, blank=True)
    time_stamp = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"{self.sender}:{self.message}"
