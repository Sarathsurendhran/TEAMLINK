from django.urls import path
from .consumers import GroupChatConsumer


websocket_urlpatterns = [
    path("ws/group-chat/<int:group_id>/", GroupChatConsumer.as_asgi()),
]