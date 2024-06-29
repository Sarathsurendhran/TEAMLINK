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


class CreateWorkSpace(CreateAPIView):
    serializer_class = WorkSpaceSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        workspace = serializer.save(created_by=self.request.user, is_active=True)
        WorkSpaceMembers.objects.create(
            workspace=workspace,
            user=self.request.user,
            is_admin=True,
            display_name=self.request.user.username,
        )


class ListWorkSpaces(ListAPIView):

    serializer_class = WorkSpaceSerializerForWorkspace
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        try:
            user = self.request.user

            # Combine both querysets with distinct workspaces
            workspaces = WorkSpaces.objects.filter(
                Q(created_by=user) | Q(workspacemembers__user=user)
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


class AddMembers(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, workspace_id):
        serializer = EmailListSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data["email"]
            send_invitation(email, workspace_id)
            return Response(
                {"message": "Invitation sent successfully"}, status=status.HTTP_200_OK
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class WorkSpaceHome(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, id):
        try:
            workspace = WorkSpaces.objects.get(id=id, is_active=True)
            workspace_members = WorkSpaceMembers.objects.filter(workspace_id=id)

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
