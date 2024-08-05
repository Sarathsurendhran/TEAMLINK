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

    path("group-detail/<int:workspace_id>/", views.GroupDetail.as_view())
]
