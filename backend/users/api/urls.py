from django.urls import path
from . import views
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
  path('', views.getRoutes),

  path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
  path('token/refresh', TokenRefreshView.as_view(), name='token_refresh'),

  path('register/', views.RegisterView.as_view(), name='user-register'),
  path('verify-otp/', views.VerifyOtp.as_view(), name='verify-otp'),
  path('user-login/', views.LoginView.as_view(), name='user-login')
  
]