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


class UserSerializer(ModelSerializer):
    class Meta:
        model = User
        exclude = ("password",)


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        token["username"] = user.username

        return token


class UserRegisterSerializer(ModelSerializer):

    class Meta:
        model = User
        fields = ["id", "username", "email", "password"]
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):

        # Hash the password before creating the user
        validated_data["password"] = make_password(validated_data.get("password"))
        # validated_data["password"] = validated_data.get("password")

        # Delegate the creation to the parent class's create method
        return super().create(validated_data)


class VerifyEmailSerializer(Serializer):
    email = EmailField()
    otp = CharField()
