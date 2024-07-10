from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from workspaces.models import WorkSpaceMembers, WorkSpaces
from users.models import User
from rest_framework.generics import CreateAPIView, ListAPIView
from workspaces.api.serializers import (
    WorkSpaceSerializer,
    EmailListSerializer,
    WorkSpaceSerializerForWorkspace,
    UserSerializer,
    WorkspaceMemberSerializer,
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

            return Response(
                {
                    "message": "Success",
                    "workspace_data": workspace_serializer.data,
                    "members_data": member_serializer.data,
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
