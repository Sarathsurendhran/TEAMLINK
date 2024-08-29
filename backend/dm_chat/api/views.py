from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status


from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
import json

from dm_chat.models import OneToOneChatMessages


class ReadStatusUpdate(APIView):
    def post(self, request, selected_user, authenticated_user):
        try:
            # Sort the user IDs to create the room name
            user_ids = sorted([selected_user, authenticated_user])
            room_name = f"chat_{user_ids[0]}-{user_ids[1]}"

            # Filter messages in the room that are not read and not sent by the authenticated user
            OneToOneChatMessages.objects.filter(room=room_name, is_read=False).update(
                is_read=True
            )

            self.trigger_unread_notification(authenticated_user)

            return Response(
                {"message": "Read status updated successfully"},
                status=status.HTTP_200_OK,
            )

        except OneToOneChatMessages.DoesNotExist:
            return Response(
                {"error": "Messages not found"}, status=status.HTTP_404_NOT_FOUND
            )

    def trigger_unread_notification(self, room_id):
        channel_layer = get_channel_layer()
        group_name = f"notification_{room_id}"

   
        # Send the notification to the channel layer group
        async_to_sync(channel_layer.group_send)(
            group_name,
            {
                "type": "trigger_unread_notifications",
            },
        )
