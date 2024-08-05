from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from workspaces.models import WorkSpaceMembers, WorkSpaces
from group_chat.models import WorkspaceGroups, GroupChatMessages, GroupMembers
from users.models import User

from .serializers import (
    CreateGroupSerializer,
    WorkspaceGroupSerializer,
    GroupMembersSerializer,
)
from rest_framework.permissions import IsAuthenticated
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
            group = WorkspaceGroups.objects.filter(workspace_id=workspace_id).first()
        except WorkspaceGroups.DoesNotExist:
            print("workspace not found")
