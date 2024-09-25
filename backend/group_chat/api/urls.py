from django.urls import path
from . import views

urlpatterns = [
    path("create-group/", views.CreateGroupView.as_view(), name="create-group/"),
    path("list-groups/<int:workspace_id>/", views.ListGroupsView.as_view(), name="list-groups/"),
    path("get-group-details/", views.GetGroupDetails.as_view(), name='get-group-details'),
    path("update-group-name/", views.UpdateGroupName.as_view(), name="edit-group-name" ),
    path("update-group-description/", views.UpdateGroupDescription.as_view(), name="edit-group-description" ),
    path("update-group-topic/", views.UpdateGroupTopic.as_view(), name="edit-group-topic" ),
    path("remove-group-member/", views.RemoveGroupMember.as_view(), name="remove-group-member" ),
    path("add-member/", views.AddMembers.as_view(), name='add-member'),


    path("group-detail/<int:workspace_id>/", views.GroupDetail.as_view()),
    path("read-status-update/<int:group_id>/", views.ReadStatusUpdate.as_view()),
    path("members-list", views.GetMembersList.as_view()),
    path("assign-task", views.AssignTaskView.as_view()),
    path("get-tasks",views.GetTaskView.as_view()),
    path("get-user-tasks",views.GetUserTaskView.as_view()),
    path("update-task-status", views.UpdateTaskStatus.as_view()),
    path("edit-task-details", views.GetEditTaskDetails.as_view()),
    path("update-assigned-task", views.EditTask.as_view()),
    path("delete-task", views.DeleteTask.as_view()),
]
