# ----------REST Framework imports---------------#
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework.views import APIView
from users.send_otp import send_otp
from rest_framework import status
from users.models import User
from rest_framework_simplejwt.tokens import RefreshToken, AccessToken
from django.contrib.auth import authenticate, login
from django.middleware.csrf import get_token
from django.conf import settings
from django.middleware import csrf
from workspaces.models import WorkSpaces, WorkSpaceMembers


from .serializers import UserRegisterSerializer, VerifyEmailSerializer, LoginSerializer


@api_view(["GET"])
def getRoutes(request):
    routes = ["/api/token", "/api/token/refresh"]

    return Response(routes)


class RegisterView(APIView):
    def post(self, request):
        try:
            serializer = UserRegisterSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save()

                email = serializer.data["email"]

                send_otp(request, email)
                content = {
                    "message": "User registration successful. Check email for OTP."
                }
                return Response(content, status=status.HTTP_201_CREATED)

            else:

                error_messages = []
                for field, errors in serializer.errors.items():

                    for error in errors:
                        if field == "email" and "unique" in error:
                            error_messages.append("Email already exists")
                        elif field == "password" and "min_length" in error:
                            error_messages.append(
                                "Password must be at least 8 characters long"
                            )
                        else:
                            error_messages.append(f"{field.capitalize()}: {error}")
                content = {"message": error_messages}
                print("errrorrr:", error_messages)
                return Response(content, status=status.HTTP_406_NOT_ACCEPTABLE)

        except Exception as e:
            print(e)
            content = {"message": "An error occurred during registration."}

            return Response(content, status=status.HTTP_400_BAD_REQUEST)


class VerifyOtp(APIView):
    def post(self, request):
        try:
            serializer = VerifyEmailSerializer(data=request.data)
            if serializer.is_valid():
                email = serializer.validated_data.get("email")
                otp = serializer.validated_data.get("otp")

                user = User.objects.get(email=email)
                if not user:
                    content = {"message": "Something Went Wrong! Please Register Again"}
                    return Response(content, status=status.HTTP_406_NOT_ACCEPTABLE)
                if user.otp != otp:
                    content = {"message": "Invalid OTP"}
                    return Response(content, status=status.HTTP_400_BAD_REQUEST)

                user.is_verified = True
                user.save()

                content = {"message": "Verified"}
                return Response(content, status.HTTP_200_OK)

        except Exception as e:
            print(e)


class LoginView(APIView):
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data["user"]

            # Generate new refresh token for the user
            refresh = RefreshToken.for_user(user)
            access_token = refresh.access_token

            # Adding custom claims
            refresh["username"] = str(user.username)
            refresh["isAdmin"] = user.is_superuser

            # Workspace handling
            workspaces = False
            if user.workspace_id:
                try:
                    workspace = WorkSpaces.objects.get(id=user.workspace_id)
                    if not WorkSpaceMembers.objects.filter(
                        user_id=user.id, workspace_id=workspace.id
                    ):
                        WorkSpaceMembers.objects.create(
                            is_admin=False, user_id=user.id, workspace_id=workspace.id, display_name=user.username
                        )
                except WorkSpaces.DoesNotExist:
                    print("Workspace does not exist")
                except Exception as e:
                    print(f"Error: {e}")

            try:
                if (
                    WorkSpaces.objects.filter(created_by=user.id).exists()
                    or WorkSpaceMembers.objects.filter(user_id=user.id).exists()
                ):
                    workspaces = True
            except Exception as e:
                print(f"Error: {e}")

            content = {
                "refresh": str(refresh),
                "access": str(access_token),
                "is_admin": user.is_superuser,
                "workspaces": workspaces,
            }

            return Response(content, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
