from django.db import models
from users.models import User


class WorkSpaces(models.Model):
    workspace_name = models.CharField(max_length=50)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE)
    description = models.CharField(max_length=250)
    is_premium = models.BooleanField(default=False)
    created_on = models.DateField(auto_now_add=True)
    is_active = models.BooleanField(default=True)

    def __str__(self) -> str:
        return self.workspace_name


class WorkSpaceMembers(models.Model):
    workspace = models.ForeignKey(WorkSpaces, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    display_name = models.CharField(max_length=50)
    about_me = models.CharField(max_length=250)
    is_admin = models.BooleanField(default=False)
    profile_picture = models.ImageField(upload_to="profile_picture")

    def __str__(self) -> str:
        return self.user.username
