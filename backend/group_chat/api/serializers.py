from rest_framework import serializers
from workspaces.models import WorkSpaceMembers, WorkSpaces
from group_chat.models import WorkspaceGroups, GroupMembers, Task


class CreateGroupSerializer(serializers.ModelSerializer):
    workspace_id = serializers.IntegerField()

    class Meta:
        model = WorkspaceGroups
        fields = ["workspace_id", "group_name", "description", "topic", "is_private"]

    def validate_workspace_id(self, value):
        try:
            workspace = WorkSpaces.objects.get(id=value)
        except WorkSpaces.DoesNotExist:
            raise serializers.ValidationError("Workspace does not exist")
        return value

    def validate_user(self, data):
        workspace_id = data.get("workspace_id")
        user_id = self.context["request"].user.id
        try:
            member = WorkSpaceMembers.objects.get(
                user_id=user_id, workspace_id=workspace_id
            )
        except WorkSpaceMembers.DoesNotExist:
            raise serializers.ValidationError("Workspace member does not exist")
        return user_id

    def validate_group_name(self, value):
        workspace_id = self.initial_data.get("workspace_id")
        if WorkspaceGroups.objects.filter(
            group_name=value, workspace_id=workspace_id
        ).exists():
            raise serializers.ValidationError("Group name already exists")
        return value


class WorkspaceGroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = WorkspaceGroups
        fields = "__all__"


class GroupMembersSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source="member.user.username", read_only=True)
    user_id = serializers.IntegerField(source="member.user.id", read_only=True)

    class Meta:
        model = GroupMembers
        fields = "__all__"


class TaskSerializer(serializers.ModelSerializer):
    group_name = serializers.CharField(source="group.group_name", read_only=True)
    assigned_to_username = serializers.CharField(
        source="assigned_to.username", read_only=True
    )

    class Meta:
        model = Task
        fields = [
            "id",
            "task_name",
            "task_description",
            "start_date",
            "end_date",
            "assigned_by",
            "assigned_to",
            "assigned_to_username",
            "group",
            "group_name",
            "status",
            "workspace"
        ]
