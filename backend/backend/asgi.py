"""
ASGI config for backend project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.0/howto/deployment/asgi/
"""


import os
import django
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")
django.setup()

from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from group_chat.routes import websocket_urlpatterns
from dm_chat.routes import websocket_urlpatterns as personal_chat_urlpatterns


application = get_asgi_application()

application = ProtocolTypeRouter(
    {
        "http": application,  
        "websocket": URLRouter(
            websocket_urlpatterns + personal_chat_urlpatterns  
        ),
    }
)

