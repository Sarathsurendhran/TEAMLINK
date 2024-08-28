from django.urls import path
from .consumers import GroupChatConsumer, NotificationConsumer


websocket_urlpatterns = [
    path("ws/group-chat/<int:group_id>/", GroupChatConsumer.as_asgi()),
    path("ws/group-notification/<int:user_id>/<int:workspace_id>/", NotificationConsumer.as_asgi()),
]