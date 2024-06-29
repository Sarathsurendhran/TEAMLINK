from rest_framework import serializers
from users.models import User
from workspaces.models import WorkSpaceMembers, WorkSpaces


class WorkSpaceSerializer(serializers.ModelSerializer):
    class Meta:
        model = WorkSpaces
        exclude = ["created_by", "description"]

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation["workspace_name"] = representation["workspace_name"].upper()
        return representation


class EmailListSerializer(serializers.Serializer):
    email = serializers.EmailField()

    def validate_email(self, value):
        """
        Check that the user is not already in the workspace.
        """
        if WorkSpaceMembers.objects.filter(user__email=value).exists():
            raise serializers.ValidationError("The user is already in the workspace.")
        return value


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "email"]


class WorkspaceMemberSerializer(serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = WorkSpaceMembers
        fields = "__all__"


class WorkSpaceSerializerForWorkspace(serializers.ModelSerializer):
    class Meta:
        model = WorkSpaces
        fields = '__all__'
