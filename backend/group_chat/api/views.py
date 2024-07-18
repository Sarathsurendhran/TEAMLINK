from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from workspaces.models import WorkSpaceMembers, WorkSpaces
from group_chat.models import WorkspaceGroups, GroupChatMessages, GroupMembers
from users.models import User

from .serializers import CreateGroupSerializer, WorkspaceGroupSerializer
from rest_framework.permissions import IsAuthenticated


class CreateGroupView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = CreateGroupSerializer(data=request.data)

        user_instance = User.objects.get(id=request.user.id)
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

                GroupMembers.objects.create(member_id=user_instance.id, group_id=group.id)
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
    parser_classes = [IsAuthenticated]

    def get(self, request):
        try:
            group_memberships = GroupMembers.objects.filter(member_id=request.user.id)
            if group_memberships.exists():
                groups = [membership.group for membership in group_memberships]
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
