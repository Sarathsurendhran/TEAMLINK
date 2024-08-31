from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from users.api.serializers import UserSerializer
from users.models import User
from rest_framework import status
from rest_framework.pagination import PageNumberPagination
from workspaces.models import WorkSpaces, WorkSpaceMembers
from .serializer import WorkspaceSerializer
from .permissions import IsSuperUser


class UserList(APIView):
    permission_classes = [IsSuperUser]

    def get(self, request):
        try:
            paginator = PageNumberPagination()
            paginator.page_size = 5
            users = User.objects.filter(is_superuser=False)
            result_page = paginator.paginate_queryset(users, request)
            serializer = UserSerializer(result_page, many=True)
            return paginator.get_paginated_response(serializer.data)
        except User.DoesNotExist:
            return Response(
                {"error": "Users not found"}, status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {"error": "An error occurred while fetching users"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class UserStatusUpdate(APIView):
    def post(self, request, user_id):
        try:
            user_data = User.objects.get(id=user_id)
            user_data.is_active = not user_data.is_active
            user_data.save()

            # Update is_active status in Workspace table
            WorkSpaces.objects.filter(created_by=user_data.id).update(
                is_active=user_data.is_active
            )

            # Update is_active status in WorkspaceMembers table
            WorkSpaceMembers.objects.filter(user_id=user_data.id).update(
                is_active=user_data.is_active
            )

            return Response(
                {
                    "message": "User status updated successfully",
                    "is_active": user_data.is_active,
                },
                status=status.HTTP_200_OK,
            )

        except User.DoesNotExist:
            return Response(
                {"message": "User not found!"},
                status=status.HTTP_404_NOT_FOUND,
            )

        except Exception as e:
            print(e)
            return Response(
                {"message": "Something went wrong!"},
                status=status.HTTP_400_BAD_REQUEST,
            )


class WorkspaceList(APIView):
    permission_classes = [IsSuperUser]

    def get(self, request):
        try:
            paginator = PageNumberPagination()
            paginator.page_size = 5
            workspaces = WorkSpaces.objects.all()
            result_page = paginator.paginate_queryset(workspaces, request)
            serializer = WorkspaceSerializer(result_page, many=True)

            return paginator.get_paginated_response(serializer.data)

        except Exception as e:
            print(e)
            return Response(
                {"message": "Something went wrong", "error": str(e)},
                status=status.HTTP_400_BAD_REQUEST,
            )


class WorkspaceStatusUpdate(APIView):
    def post(self, request, workspace_id):
        try:
            workspaces = WorkSpaces.objects.get(id=workspace_id)
            workspaces.is_active = not workspaces.is_active
            workspaces.save()

            return Response(
                {
                    "message": "Workspace Status Updated Successfully",
                    "is_active": workspaces.is_active,
                },
                status=status.HTTP_200_OK,
            )
        except Exception as e:
            print(e)
            return Response({"message": "Something Went Wrong!"})


class TotalUserCount(APIView):
    def get(self, request):
        total_user = User.objects.count()
        return Response(total_user, status=status.HTTP_200_OK)
    

class TotalWorkSpaceCount(APIView):
    def get(self, request):
        total_workspaces = WorkSpaces.objects.count()
        return Response(total_workspaces, status=status.HTTP_200_OK)