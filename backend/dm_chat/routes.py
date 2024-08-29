from django.urls import path
from .consumers import PersonalChatConsumer, NotificationConsumer

websocket_urlpatterns = [
    path("ws/dm-chat/<int:user_id1>/<int:user_id2>/", PersonalChatConsumer.as_asgi()),
    path('ws/personal-notification/<int:user_id>/', NotificationConsumer.as_asgi()),
]
