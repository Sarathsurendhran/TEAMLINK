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
from cryptography.fernet import Fernet
from decouple import config

from workspaces.models import WorkSpaces, WorkSpaceMembers
from .serializers import (
    UserRegisterSerializer,
    VerifyEmailSerializer,
    LoginSerializer,
    WorkspaceMembersSerializer,
)

from workspaces.models import WorkSpaceMembers
from rest_framework.permissions import IsAuthenticated


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


# decrypting the encrypted data from the user database and return email and workspace_id
def decrypt_data(encrypted_data):
    # Decode base64 and ensure it's bytes
    encrypted_data = encrypted_data.encode("utf-8")

    key = config("KEY")
    cipher_suite = Fernet(key)

    # decrypt data
    decrypted_data = cipher_suite.decrypt(encrypted_data)

    # Decode bytes to string
    decrypted_data_str = decrypted_data.decode("utf-8")

    # Split decrypted string into email and workspace_id
    email, workspace_id = decrypted_data_str.split(":")

    return email, workspace_id


class LoginView(APIView):

    def generate_refresh_token_with_claims(self, user):
        refresh = RefreshToken.for_user(user)

        # Custom claims
        refresh["username"] = str(user.username)
        refresh["isAdmin"] = user.is_superuser

        return refresh

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data["user"]

            # Custom method to generate refresh token with custom claims
            refresh = self.generate_refresh_token_with_claims(user)
            access_token = refresh.access_token

            workspace_id = None
            if user.encrypted_data:
                datas = decrypt_data(user.encrypted_data)
                email, workspace_id = datas

            # Workspace handling
            workspaces = False
            if workspace_id:
                """
                checking the user is already in the workspaces if not creating a user

                """
                try:
                    workspace = WorkSpaces.objects.get(id=workspace_id)
                    if not WorkSpaceMembers.objects.filter(
                        user_id=user.id, workspace_id=workspace.id
                    ):
                        WorkSpaceMembers.objects.create(
                            is_admin=False,
                            user_id=user.id,
                            workspace_id=workspace.id,
                        )
                except WorkSpaces.DoesNotExist:
                    print("Workspace does not exist")
                except Exception as e:
                    print(f"Error: {e}")

            try:
                # if the user is in the workspace changing the workspace flag True so the user can redirect to different page in frontend
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


class UserChecking(APIView):
    def post(self, request, params):
        if params:
            datas = decrypt_data(params)
            email, workspace_id = datas
            try:
                workspace = WorkSpaces.objects.get(id=workspace_id)
                user = User.objects.get(email=email)
                if user:
                    try:
                        if not WorkSpaceMembers.objects.filter(
                            user_id=user.id, workspace_id=workspace.id
                        ):
                            WorkSpaceMembers.objects.create(
                                is_admin=False,
                                user_id=user.id,
                                workspace_id=workspace.id,
                            )

                    except WorkSpaces.DoesNotExist:
                        print("Workspace does not exist")

                    except Exception as e:
                        print(f"Error: {e}")

                    return Response(
                        {"message": "Welcome Back Please Login"},
                        status=status.HTTP_208_ALREADY_REPORTED,
                    )

            except WorkSpaces.DoesNotExist:
                return Response(
                    {"message": "Worskspace does not exist!"},
                    status=status.HTTP_404_NOT_FOUND,
                )

            except User.DoesNotExist:
                return Response(
                    {"message": " User does not exist!"},
                    status=status.HTTP_404_NOT_FOUND,
                )

            except Exception as e:
                print(f"Error: {e}")
                return Response(
                    {"message": "Something Went Wrong!"},
                    status=status.HTTP_400_BAD_REQUEST,
                )


class CheckIsBlocked(APIView):
    def get(self, request):
        user_id = request.query_params.get("user_id")
        print("user_id", user_id)
        try:
            user_data = User.objects.get(id=user_id)
            if not user_data.is_active:
                return Response(
                    {"message": "user is blocked"}, status=status.HTTP_200_OK
                )
            else:
                return Response(
                    {"message": "user is active"}, status=status.HTTP_202_ACCEPTED
                )
        except Exception as e:
            return Response({"message": "something went wrong"})


class GetUserProfile(APIView):
    def get(self, request):
        try:
            workspace_id = request.GET.get("workspace_id")
            user_id = request.GET.get("user_id")
            user_data = User.objects.get(id=user_id)

            member_profile = WorkSpaceMembers.objects.get(
                user_id=user_data, workspace_id=workspace_id
            )
            serializer = WorkspaceMembersSerializer(member_profile)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except WorkSpaceMembers.DoesNotExist:
            return Response(
                {"message": "User is not a member of this workspace"},
                status=status.HTTP_404_NOT_FOUND,
            )
        except Exception as e:
            print("errrorr", e)
            return Response(
                {"message": "Something went wrong"}, status=status.HTTP_400_BAD_REQUEST
            )


class ChangeUserName(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            username = request.data.get("username")
            user_id = request.data.get("user_id")

            user_data = User.objects.get(id=user_id)
            user_data.username = username
            user_data.save()
            return Response(
                {"message": "User Name Updated Sucessfully"}, status=status.HTTP_200_OK
            )
        except User.DoesNotExist:
            return Response(
                {"message": "User Not Found"}, status=status.HTTP_404_NOT_FOUND
            )

        except Exception as e:
            print(e)
            return Response(
                {"message": "Something Went Wrong"}, status=status.HTTP_400_BAD_REQUEST
            )


class ChangeAboutUser(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            about = request.data.get("about")
            user_id = request.data.get("user_id")
            workspace_id = request.data.get("workspace_id")

            user_data = User.objects.get(id=user_id)
            workspace_data = WorkSpaceMembers.objects.get(
                user=user_data, workspace_id=workspace_id
            )
            workspace_data.about_me = about
            workspace_data.save()
            return Response(
                {"message": "About Updated Sucessfully"}, status=status.HTTP_200_OK
            )
        except User.DoesNotExist:
            return Response(
                {"message": "User Not Found"}, status=status.HTTP_404_NOT_FOUND
            )

        except WorkSpaceMembers.DoesNotExist:
            return Response(
                {"message": "Workspace Not Found"}, status=status.HTTP_404_NOT_FOUND
            )

        except Exception as e:
            print(e)
            return Response(
                {"message": "Something Went Wrong"}, status=status.HTTP_400_BAD_REQUEST
            )


class ChangeProfilePic(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            profile_pic = request.data.get("profile_pic")
            user_id = request.data.get("user_id")
            workspace_id = request.data.get("workspace_id")

            user_data = User.objects.get(id=user_id)
            workspace_data = WorkSpaceMembers.objects.get(
                user=user_data, workspace_id=workspace_id
            )
            workspace_data.profile_picture = profile_pic
            workspace_data.save()
            return Response(
                {"message": "Profile Picture Updated Sucessfully"},
                status=status.HTTP_200_OK,
            )
        except User.DoesNotExist:
            return Response(
                {"message": "User Not Found"}, status=status.HTTP_404_NOT_FOUND
            )

        except WorkSpaceMembers.DoesNotExist:
            return Response(
                {"message": "Workspace Not Found"}, status=status.HTTP_404_NOT_FOUND
            )

        except Exception as e:
            print(e)
            return Response(
                {"message": "Something Went Wrong"}, status=status.HTTP_400_BAD_REQUEST
            )
