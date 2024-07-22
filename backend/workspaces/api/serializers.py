from rest_framework import serializers
from users.models import User
from workspaces.models import WorkSpaceMembers, WorkSpaces


class WorkSpaceSerializer(serializers.ModelSerializer):
    class Meta:
        model = WorkSpaces
        exclude = ["created_by"]

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation["workspace_name"] = representation["workspace_name"].upper()
        return representation


class EmailListSerializer(serializers.Serializer):
    email = serializers.EmailField()
    workspace_id = serializers.IntegerField()

    def validate_email(self, value):
        """
        check that the emial is verified

        """
        # We can perform any email specific validation

        return value

    def validate(self, data):
        """
        This method is called after individual field validations but before create and update.

        In here checking that the user is not already in the workspace.

        """

        email = data.get("email")
        workspace_id = data.get("workspace_id")

        if WorkSpaceMembers.objects.filter(
            user__email=email, workspace_id=workspace_id
        ).exists():
            raise serializers.ValidationError("This user is already in the Workspace")
        return data


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "email"]


class WorkspaceMemberSerializer(serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = WorkSpaceMembers
        fields = "__all__"

    def to_representation(self, instance):
        if instance.is_active:
            return super().to_representation(instance)
        return None


class WorkSpaceSerializerForWorkspace(serializers.ModelSerializer):
    class Meta:
        model = WorkSpaces
        fields = "__all__"

    # def to_representation(self, instance):
    #     representation = super().to_representation(instance)
    #     representation["workspace_name"] = representation["workspace_name"].upper()
    #     return representation


class UpdateWorkspaceNameSerializer(serializers.Serializer):
    workspace_id = serializers.IntegerField()
    workspace_name = serializers.CharField(max_length=100)


class UpdateWorkspaceDescrptionSerializer(serializers.Serializer):
    workspace_id = serializers.IntegerField()
    workspace_description = serializers.CharField(max_length=300)
