from rest_framework import serializers
from users.models import User
from workspaces.models import WorkSpaces


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "email"]


class WorkspaceSerializer(serializers.ModelSerializer):
    created_by = UserSerializer(read_only=True)

    class Meta:
        model = WorkSpaces
        fields = "__all__"
