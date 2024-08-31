from django.urls import path
from . import views

urlpatterns = [
    path("users-list/", views.UserList.as_view(), name="user-list/"),
    path(
        "change-user-status/<int:user_id>/",
        views.UserStatusUpdate.as_view(),
        name="user-status-update/",
    ),
    path("workspace-list/", views.WorkspaceList.as_view(), name="workspace-list/"),
    path(
        "change-workspace-status/<int:workspace_id>/",
        views.WorkspaceStatusUpdate.as_view(),
        name="change-workspace-status/",
    ),
    path("total-user/", views.TotalUserCount.as_view()),
    path("total-workspaces/", views.TotalWorkSpaceCount.as_view()),
    # path("total-user/", views.TotalUserCount.as_view()),
]
