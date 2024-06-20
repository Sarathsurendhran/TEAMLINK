# ----------REST Framework imports---------------#
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework.views import APIView
from users.send_otp import send_otp
from rest_framework import status
from users.models import User
from rest_framework.exceptions import ParseError, AuthenticationFailed
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from django.contrib.auth.hashers import make_password

from .serializers import (
    UserRegisterSerializer,
    VerifyEmailSerializer,
)


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

        email = request.data.get("email").strip()
        password = request.data.get("password").strip()

        if not email or not password:
            content = {"message": "All Fields Are Required"}
            return Response(content, status=status.HTTP_406_NOT_ACCEPTABLE)

        if not User.objects.filter(email=email).exists():
            content = {"message": "Invalid Email Address"}
            return Response(content, status=status.HTTP_406_NOT_ACCEPTABLE)

        
        if User.objects.filter(email=email, is_active=False).exists():
            content = {"message": "You are blocked by the Admin!"}
            return Response(content, status=status.HTTP_406_NOT_ACCEPTABLE)
        

        user = authenticate(username=email, password=password)
        if user is None:
            content = {"message": "Invalid Password!"}
            return Response(content, status=status.HTTP_406_NOT_ACCEPTABLE)

        user_obj = User.objects.get(email=email)
        if not user_obj.is_verified:
            content = {"message": "Email is not verified!"}
            return Response(content, status=status.HTTP_406_NOT_ACCEPTABLE)

        # Generate new refresh token for the user
        refresh = RefreshToken.for_user(user)
        access_token = refresh.access_token

       
        # Adding claims
        access_token["username"] = str(user.username)
        access_token["is_admin"] = user.is_superuser


        response = Response({
            "message": "Login Success",
            "access_token": str(access_token),  
            "is_admin": user.is_superuser
        }, status=status.HTTP_200_OK)

        response.set_cookie(
            key="refresh", value=str(refresh), httponly=True, samesite="Lax"
        )
        response.set_cookie(
            key="access", value=str(access_token), httponly=True, samesite="Lax"
        )
        return response
