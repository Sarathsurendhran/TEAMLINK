from django.urls import path
from .import views

urlpatterns = [
  path('create-workspace/', views.CreateWorkSpace.as_view(), name='create-workspace/'),
  path('list-workspaces/', views.ListWorkSpaces.as_view(), name='list-workspaces/'),
  path('add-members/', views.AddMembers.as_view(), name='add-members/'),
  path('workspace-home/<int:id>/', views.WorkSpaceHome.as_view(), name='workspace-home/'),
  path('remove-user/', views.RemoveUser.as_view(), name='remove-user/'),
  path('check-isblocked/<int:workspace_id>', views.CheckIsBlocked.as_view(), name='check-isblocked/'),
  path('update-workspace-name/', views.UpdateWorkspaceName.as_view(), name='update-workspace-name/'),
  path('update-workspace-description/', views.UpdateWorkspaceDescription.as_view(), name='update-workspace-description/'),
]