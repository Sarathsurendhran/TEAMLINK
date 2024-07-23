from rest_framework.serializers import (
    ModelSerializer,
    ValidationError,
    Serializer,
    EmailField,
    CharField,
)
from users.models import MyAccountManager, User
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth.hashers import make_password
from rest_framework import serializers
from workspaces.models import WorkSpaces, WorkSpaceMembers
from django.contrib.auth import authenticate


class UserSerializer(ModelSerializer):
    class Meta:
        model = User
        exclude = ("password", "otp")


class UserRegisterSerializer(ModelSerializer):

    class Meta:
        model = User
        fields = ["id", "username", "email", "password", "encrypted_data"]
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):

        # Hash the password before creating the user
        validated_data["password"] = make_password(validated_data.get("password"))

        # Delegate the creation to the parent class's create method
        return super().create(validated_data)


class VerifyEmailSerializer(Serializer):
    email = EmailField()
    otp = CharField()


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()

    def validate(self, data):
        email = data.get("email").strip()
        password = data.get("password").strip()

        if not email or not password:
            raise serializers.ValidationError("All Fields Are Required")

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            raise serializers.ValidationError("Invalid Email Address")

        if not user.is_active:
            raise serializers.ValidationError("You are blocked by the Admin!")

        user = authenticate(username=email, password=password)
        if user is None:
            raise serializers.ValidationError("Invalid Password!")

        if not user.is_verified:
            raise serializers.ValidationError("Email is not verified!")

        data["user"] = user
        return data


class UserSerializerForProfile(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "email"]


class WorkspaceMembersSerializer(serializers.ModelSerializer):
    user = UserSerializerForProfile()

    class Meta:
        model = WorkSpaceMembers
        fields = ["id", "about_me", "profile_picture", "user"]
