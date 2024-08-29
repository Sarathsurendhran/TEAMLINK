from django.urls import path
from . import views

urlpatterns = [
  path("read-status-update/<int:selected_user>/<int:authenticated_user>/", views.ReadStatusUpdate.as_view())
]