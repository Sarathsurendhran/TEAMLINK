from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from workspaces.models import WorkSpaceMembers, WorkSpaces
from group_chat.models import WorkspaceGroups, GroupMembers
from users.models import User
from rest_framework.generics import CreateAPIView, ListAPIView
from workspaces.api.serializers import (
    WorkSpaceSerializer,
    EmailListSerializer,
    WorkSpaceSerializerForWorkspace,
    UserSerializer,
    WorkspaceMemberSerializer,
    UpdateWorkspaceNameSerializer,
    UpdateWorkspaceDescrptionSerializer,
    WorkspaceMemberSerializerForUserList,
)
from rest_framework.permissions import IsAuthenticated
from workspaces.send_invitation import send_invitation
from django.db.models import Q
from cryptography.fernet import Fernet
from decouple import config


class RemoveUser(APIView):
    """
    Removing user from the workspace
    """

    def post(self, request):
        user_id = request.data.get("user_id")
        workspace_id = request.data.get("workspaceID")
        if not user_id:
            return Response(
                {"error": "User ID is required"}, status=status.HTTP_400_BAD_REQUEST
            )
        if not workspace_id:
            return Response(
                {"error": "Workspace ID is required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            data = WorkSpaceMembers.objects.get(
                user_id=user_id, workspace_id=workspace_id
            )
            data.is_active = False
            data.save()
            return Response(
                {"message": "User Removed Successfully"}, status=status.HTTP_200_OK
            )
        except Exception as e:
            print(e)
            return Response(
                {"error": {str(e)}},
                status=status.HTTP_400_BAD_REQUEST,
            )


class CreateWorkSpace(CreateAPIView):
    serializer_class = WorkSpaceSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        workspace = serializer.save(created_by=self.request.user, is_active=True)
        WorkSpaceMembers.objects.create(
            workspace=workspace,
            user=self.request.user,
            is_admin=True,
        )


class ListWorkSpaces(ListAPIView):

    serializer_class = WorkSpaceSerializerForWorkspace
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        try:
            user = self.request.user

            # Combine both querysets with distinct workspaces
            workspaces = WorkSpaces.objects.filter(
                Q(created_by=user) | Q(workspacemembers__user=user), is_active=True
            ).distinct()

            # Combine both querysets
            return workspaces

        except Exception as e:
            return None

    def list(self, request):
        queryset = self.get_queryset()
        if not queryset or not queryset.exists():
            return Response(
                {"detail": "No workspace Found"}, status=status.HTTP_404_NOT_FOUND
            )
        user_serializer = UserSerializer(request.user)
        serializer = self.get_serializer(queryset, many=True)
        return Response({"workspaces": serializer.data, "user": user_serializer.data})


# encrypting the email and workspace_id for sending invitation URL
def encrypt_data(email, workspace_id):
    key = config("KEY")

    cipher_suite = Fernet(key)

    data = f"{email}:{workspace_id}"

    data_bytes = data.encode("utf-8")

    encrypted_data = cipher_suite.encrypt(data_bytes)

    # Encode encrypted data to a URL-safe string
    encrypted_base64 = encrypted_data.decode("utf-8")

    return encrypted_base64


class AddMembers(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = EmailListSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data["email"]
            workspace_id = serializer.validated_data["workspace_id"]

            encrypted_data = encrypt_data(email, workspace_id)
            send_invitation(email, encrypted_data)
            return Response(
                {"message": "Invitation sent successfully"}, status=status.HTTP_200_OK
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class WorkSpaceHome(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, id):
        try:
            workspace = WorkSpaces.objects.get(id=id, is_active=True)
            workspace_members = WorkSpaceMembers.objects.filter(
                workspace_id=id, is_active=True
            )

            workspace_serializer = WorkSpaceSerializerForWorkspace(workspace)
            member_serializer = WorkspaceMemberSerializer(workspace_members, many=True)

            try:
                user_name = User.objects.get(id=workspace.created_by.id)
                # workspace_admin = WorkSpaces.objects.get(id=id, is_active=True, )

            except Exception as e:
                print("error", e)

            return Response(
                {
                    "message": "Success",
                    "workspace_data": workspace_serializer.data,
                    "members_data": member_serializer.data,
                    "user_name": user_name.username,
                },
                status=status.HTTP_200_OK,
            )
        except Exception as e:
            print(e)
            return Response(
                {"message": "Error", "error": str(e)},
                status=status.HTTP_400_BAD_REQUEST,
            )


class CheckIsBlocked(APIView):
    def get(self, request, workspace_id):
        try:
            workspace = WorkSpaces.objects.get(id=workspace_id)
            if not workspace.is_active:
                return Response(
                    {"message": "workspace is blocked"}, status=status.HTTP_200_OK
                )
            else:
                return Response(
                    {"message": "workspace is active"}, status=status.HTTP_202_ACCEPTED
                )

        except Exception as e:
            print(e)
            return Response(
                {"message": "something went wrong"}, status=status.HTTP_400_BAD_REQUEST
            )


class UpdateWorkspaceName(APIView):
    def put(self, request):

        serializer = UpdateWorkspaceNameSerializer(data=request.data)
        if serializer.is_valid():
            try:
                workspace = WorkSpaces.objects.get(
                    id=serializer.validated_data["workspace_id"]
                )
                workspace.workspace_name = serializer.validated_data["workspace_name"]
                workspace.save()
                return Response(
                    {"message": "Worspace Name Updated Sucessfully"},
                    status=status.HTTP_200_OK,
                )
            except WorkSpaces.DoesNotExist:
                return Response(
                    {"message": "Workspace not found"}, status=status.HTTP_404_NOT_FOUND
                )

            except Exception as e:
                return Response(
                    {"message": "An unexpected error occurred"},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                )

        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UpdateWorkspaceDescription(APIView):
    def put(self, request):
        serializer = UpdateWorkspaceDescrptionSerializer(data=request.data)
        if serializer.is_valid():
            try:
                workspace = WorkSpaces.objects.get(
                    id=serializer.validated_data["workspace_id"]
                )
                workspace.description = serializer.validated_data[
                    "workspace_description"
                ]
                workspace.save()
                return Response(
                    {"message": "Worspace Description Updated Sucessfully"},
                    status=status.HTTP_200_OK,
                )
            except WorkSpaces.DoesNotExist:
                return Response(
                    {"message": "Workspace not found"}, status=status.HTTP_404_NOT_FOUND
                )

            except Exception as e:
                return Response(
                    {"message": "An unexpected error occurred"},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                )

        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)




class ListWorkSpaceUsers(APIView):
    def get(self, request):
        workspace_id = request.query_params.get("workspaceID")
        group_id = request.query_params.get("groupId")

        if not workspace_id:
            return Response(
                {"error": "workspaceID is required"}, status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            # Get users in the specified group
            group_members = GroupMembers.objects.filter(group=group_id).values_list('member', flat=True)
            
            # Get all workspace members
            workspace_members = WorkSpaceMembers.objects.filter(workspace_id=workspace_id)
            
            # Filter out users who are in the group
            users_to_exclude = group_members
            users = [member for member in workspace_members if member.id not in users_to_exclude]
            
            # Serialize the remaining users
            serializer = WorkspaceMemberSerializerForUserList(users, many=True)
            return Response({"users": serializer.data}, status=status.HTTP_200_OK)
        
        except WorkSpaceMembers.DoesNotExist:
            return Response(
                {"error": "Workspace not found"}, status=status.HTTP_404_NOT_FOUND
            )
        except GroupMembers.DoesNotExist:
            return Response(
                {"error": "Group not found"}, status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )