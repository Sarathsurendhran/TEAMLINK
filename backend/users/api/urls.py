from django.urls import path
from . import views
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)


urlpatterns = [
  path('', views.getRoutes),
  path('token/refresh', TokenRefreshView.as_view(), name='token_refresh'),

  path('register/', views.RegisterView.as_view(), name='user-register'),
  path('verify-otp/', views.VerifyOtp.as_view(), name='verify-otp'),
  path('user-login/', views.LoginView.as_view(), name='user-login'),

  path('user-checking/<str:params>', views.UserChecking.as_view(), name='user-checking/'),
  path('check-isblocked/', views.CheckIsBlocked.as_view(), name='check-isblocked/'),

  path('get-user-profile/', views.GetUserProfile.as_view(), name='get-user-profile/'),
  path('change-user-name/', views.ChangeUserName.as_view(), name='change-user-name'),
  path('change-about-user/', views.ChangeAboutUser.as_view(), name='change-about-user'),
  path('change-profile-pic/', views.ChangeProfilePic.as_view(), name='change-profile-pic'),

]