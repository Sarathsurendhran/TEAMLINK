from django.urls import path
from . import views

urlpatterns = [
  path("dm-chat/read-status-update/<int:selected_user_id>/<int:authenticated_user>/", views.ReadStatusUpdate.as_view())
]