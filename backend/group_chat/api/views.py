from django.http import Http404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from workspaces.models import WorkSpaceMembers, WorkSpaces
from group_chat.models import WorkspaceGroups, GroupChatMessages, GroupMembers, Task
from users.models import User

from .serializers import (
    CreateGroupSerializer,
    WorkspaceGroupSerializer,
    GroupMembersSerializer,
    TaskSerializer,
)
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404

from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
import json

from rest_framework.generics import (
    ListAPIView,
    CreateAPIView,
    UpdateAPIView,
    RetrieveAPIView,
    DestroyAPIView,
)
from rest_framework.exceptions import ValidationError

from django.shortcuts import get_object_or_404


class CreateGroupView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = CreateGroupSerializer(data=request.data)

        workspace_id = request.data.get("workspace_id")

        user_instance = WorkSpaceMembers.objects.get(
            user=request.user.id, workspace_id=workspace_id
        )
        if serializer.is_valid():
            try:
                group = WorkspaceGroups.objects.create(
                    group_name=serializer.validated_data["group_name"],
                    description=serializer.validated_data["description"],
                    is_private=serializer.validated_data["is_private"],
                    created_by=user_instance,
                    workspace_id=serializer.validated_data["workspace_id"],
                    topic=serializer.validated_data["topic"],
                )

                GroupMembers.objects.create(
                    member_id=user_instance.id, group_id=group.id
                )
                return Response(
                    {"message": "Group created successfully"},
                    status=status.HTTP_201_CREATED,
                )
            except Exception as e:
                print("sdgasdgasd", e)
                return Response(
                    {"message": "Something Went Wrong!"},
                    status=status.HTTP_400_BAD_REQUEST,
                )
        else:
            print(serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ListGroupsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, workspace_id):
        try:
            member = WorkSpaceMembers.objects.get(
                user=request.user.id, workspace_id=workspace_id
            )

            groups = WorkspaceGroups.objects.filter(
                id__in=GroupMembers.objects.filter(
                    member_id=member.id, group__workspace_id=workspace_id
                ).values_list("group_id", flat=True)
            ).select_related("workspace")

            if groups.exists():
                serializer = WorkspaceGroupSerializer(groups, many=True)

                return Response(
                    {"message": "success", "groups": serializer.data},
                    status=status.HTTP_200_OK,
                )
            else:
                return Response(
                    {"message": "Groups not found!"}, status=status.HTTP_404_NOT_FOUND
                )

        except GroupMembers.DoesNotExist:
            return Response(
                {"message": "Groups not Found!"}, status=status.HTTP_400_BAD_REQUEST
            )


class GetGroupDetails(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        group_id = request.query_params.get("groupId")
        user = None

        try:
            group = WorkspaceGroups.objects.get(id=group_id)
            members = GroupMembers.objects.filter(group=group_id)

            group_serializer = WorkspaceGroupSerializer(group)
            members_serializer = GroupMembersSerializer(members, many=True)

            try:
                user = User.objects.get(id=group.created_by.user.id)
            except Exception as e:
                print("user not found", e)

            return Response(
                {
                    "message": "success",
                    "group": group_serializer.data,
                    "members": members_serializer.data,
                    "group_creator": user.username,
                },
                status=status.HTTP_200_OK,
            )

        except WorkspaceGroups.DoesNotExist:
            return Response(
                {"message": "Group not found"}, status=status.HTTP_404_NOT_FOUND
            )

        except Exception as e:
            print(e)
            return Response(
                {"message": "Something went wrong"}, status=status.HTTP_400_BAD_REQUEST
            )


class UpdateGroupName(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request):
        group_id = request.query_params.get("groupId")
        group_name = request.data.get("group_name")
        try:
            group = WorkspaceGroups.objects.get(id=group_id)
            group.group_name = group_name
            group.save()

            return Response(
                {"message": "Group Name Updated Successfully"},
                status=status.HTTP_200_OK,
            )
        except WorkspaceGroups.DoesNotExist:
            return Response(
                {"message": "Group not found"}, status=status.HTTP_404_NOT_FOUND
            )

        except Exception as e:
            print(e)
            return Response(
                {"message": "Something went wrong"}, status=status.HTTP_400_BAD_REQUEST
            )


class UpdateGroupDescription(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request):
        group_id = request.query_params.get("groupId")
        group_description = request.data.get("group_description")
        try:
            group = WorkspaceGroups.objects.get(id=group_id)
            group.description = group_description
            group.save()

            return Response(
                {"message": "Group Description Updated Successfully"},
                status=status.HTTP_200_OK,
            )
        except WorkspaceGroups.DoesNotExist:
            return Response(
                {"message": "Group not found"}, status=status.HTTP_404_NOT_FOUND
            )

        except Exception as e:
            print(e)
            return Response(
                {"message": "Something went wrong"}, status=status.HTTP_400_BAD_REQUEST
            )


class UpdateGroupTopic(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request):
        group_id = request.query_params.get("groupId")
        group_topic = request.data.get("group_topic")
        try:
            group = WorkspaceGroups.objects.get(id=group_id)
            group.topic = group_topic
            group.save()

            return Response(
                {"message": "Group Topic Updated Successfully"},
                status=status.HTTP_200_OK,
            )
        except WorkspaceGroups.DoesNotExist:
            return Response(
                {"message": "Group not found"}, status=status.HTTP_404_NOT_FOUND
            )

        except Exception as e:
            print(e)
            return Response(
                {"message": "Something went wrong"}, status=status.HTTP_400_BAD_REQUEST
            )


class RemoveGroupMember(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        group_id = request.query_params.get("groupId")
        workspace_member_id = request.data.get("member_id")

        try:
            group_member = GroupMembers.objects.get(
                group_id=group_id, member=workspace_member_id
            )
            group_member.delete()

            return Response(
                {"message": "Member Removed Successfully"}, status=status.HTTP_200_OK
            )
        except GroupMembers.DoesNotExist:
            return Response(
                {"message": "group member not found"}, status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            print(e)
            return Response(
                {"message": "Something went wrong"}, status=status.HTTP_400_BAD_REQUEST
            )


class AddMembers(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        group_id = request.query_params.get("groupId")
        workspace_id = request.query_params.get("workspaceID")
        workspace_member_id = request.data.get("member_id")

        # Validate parameters
        if not group_id or not workspace_id or not workspace_member_id:
            return Response(
                {"error": "Missing required parameters."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            group = get_object_or_404(WorkspaceGroups, id=group_id)
            workspace_member = get_object_or_404(
                WorkSpaceMembers, id=workspace_member_id
            )

            group_data = GroupMembers.objects.create(
                group=group, member=workspace_member
            )

            return Response(
                {"message": "Member added successfully.", "group_data": group_data.id},
                status=status.HTTP_201_CREATED,
            )

        except WorkspaceGroups.DoesNotExist:
            return Response(
                {"message": "Group not found."}, status=status.HTTP_404_NOT_FOUND
            )

        except WorkSpaceMembers.DoesNotExist:
            return Response(
                {"message": "Workspace member not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        except Exception as e:
            return Response(
                {"message": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class GroupDetail(APIView):
    def get(self, request, workspace_id):
        try:
            group_data = WorkspaceGroups.objects.filter(
                workspace_id=workspace_id
            ).first()
            serialized_data = WorkspaceGroupSerializer(group_data)
            return Response(serialized_data.data, status=status.HTTP_200_OK)
        except WorkspaceGroups.DoesNotExist:
            print("workspace not found")
            return Response(status=status.HTTP_400_BAD_REQUEST)


class ReadStatusUpdate(APIView):
    def post(self, request, group_id):
        try:
            # Fetch all messages in the group
            group_messages = GroupChatMessages.objects.filter(group=group_id)

            # Update the read status for all messages
            group_messages.update(read=True)

            self.trigger_unread_notification(group_id)

            return Response(
                {"message": "Read status updated successfully"},
                status=status.HTTP_200_OK,
            )

        except WorkspaceGroups.DoesNotExist:
            return Response(
                {"error": "Group not found"}, status=status.HTTP_404_NOT_FOUND
            )

    def trigger_unread_notification(self, group_id):
        channel_layer = get_channel_layer()
        group_name = f"notification_{group_id}"

        # Send the notification to the channel layer group
        async_to_sync(channel_layer.group_send)(
            group_name,
            {
                "type": "trigger_unread_notifications",
            },
        )


class GetMembersList(ListAPIView):
    serializer_class = GroupMembersSerializer

    def list(self, request):
        group_id = self.request.query_params.get("groupID")
        workspace_id = self.request.query_params.get("workspaceID")

        if not group_id and workspace_id:
            raise ValidationError("Both groupID and workspaceID are required")

        queryset = GroupMembers.objects.filter(
            group=group_id, group__workspace=workspace_id
        )

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class AssignTaskView(CreateAPIView):
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated]


class GetTaskView(ListAPIView):
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        workspace_id = self.request.query_params.get("workspaceID")
        return Task.objects.filter(workspace=workspace_id).order_by("-id")


class GetUserTaskView(ListAPIView):
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        workspace_id = self.request.query_params.get("workspaceID")
        user_id = self.request.query_params.get("authenticatedUser")
        return Task.objects.filter(
            workspace=workspace_id, assigned_to=user_id
        ).order_by("-id")


class UpdateTaskStatus(UpdateAPIView):
    permission_classes = [IsAuthenticated]
    status = None

    def get_queryset(self):
        task_id = self.request.query_params.get("taskID")
        return Task.objects.filter(id=task_id).first()

    def update(self, request):
        try:
            status = request.query_params.get("selectedStatus")
            task = self.get_queryset()
            task.status = status
            task.save()

            return Response({"message": "Status Updated Successfully"})

        except Task.DoesNotExist:
            return Response(
                {"error": "Task not found"}, status=status.HTTP_404_NOT_FOUND
            )


class GetEditTaskDetails(RetrieveAPIView):
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        task_id = self.request.query_params.get("taskID")
        try:
            return Task.objects.select_related(
                "workspace", "group", "assigned_by", "assigned_to"
            ).get(id=task_id)
        except Task.DoesNotExist:
            return Response(
                {"error": "Task not found"}, status=status.HTTP_404_NOT_FOUND
            )


class EditTask(UpdateAPIView):
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated]
    queryset = Task.objects.all()

    def get_object(self):
        task_id = self.request.query_params.get("taskID")
        try:
            return Task.objects.get(pk=task_id)
        except Task.DoesNotExist:
            raise Http404("Task not found")

    def put(self, request, *args, **kwargs):
        task = self.get_object()
        serializer = self.get_serializer(task, data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(
                {"message": "Task Updated Successfully"}, status=status.HTTP_200_OK
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class DeleteTask(DestroyAPIView):
    permission_classes = [IsAuthenticated]
    queryset = Task.objects.all()

    def delete(self, request, *args, **kwargs):
        task_id = self.request.query_params.get("taskID")
        try:
            task = Task.objects.get(pk=task_id)
            task.delete()
            return Response(
                {"message": "Task Deleted Successfully"},
                status=status.HTTP_200_OK,
            )
        except Task.DoesNotExist:
            return Response(
                {"error": "Task not found."}, status=status.HTTP_404_NOT_FOUND
            )
