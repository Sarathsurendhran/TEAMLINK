from django.urls import path
from .import views

urlpatterns = [
  path('create-workspace/', views.CreateWorkSpace.as_view(), name='create-workspace/'),
  path('list-workspaces/', views.ListWorkSpaces.as_view(), name='list-workspaces/'),
  path('add-members/<int:workspace_id>/', views.AddMembers.as_view(), name='add-members/'),
  path('workspace-home/<int:id>/', views.WorkSpaceHome.as_view(), name='workspace-home/')
]