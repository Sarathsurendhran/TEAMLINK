from channels.generic.websocket import AsyncWebsocketConsumer
import json
from django.utils import timezone
from channels.db import database_sync_to_async
from .models import OneToOneChatMessages
from users.models import User


class PersonalChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        user_id1 = int(self.scope["url_route"]["kwargs"]["user_id1"])
        user_id2 = int(self.scope["url_route"]["kwargs"]["user_id2"])
        user_ids = sorted([user_id1, user_id2])
        self.room_name = f"chat_{user_ids[0]}-{user_ids[1]}"

        await self.channel_layer.group_add(self.room_name, self.channel_name)
        await self.accept()

        existing_messages = await self.get_existing_messages()
        for message in existing_messages:
            await self.send(text_data=json.dumps(message))

    async def disconnect(self, code):
        await self.channel_layer.group_discard(self.room_name, self.channel_name)

    async def receive(self, text_data=None):
        data = json.loads(text_data)

        message = data.get("message", "")
        sender = data.get("sender", "Anonymous")
        time = data.get("time", timezone.now().strftime("%Y-%m-%d %H:%M:%S"))
        message_type = data.get("type", "text_message")
        link = data.get("link", "")

        if sender and message_type in ["text_message", "photo", "video" ]:
            await self.save_message(sender, message, message_type)

        if message_type in ["video_call", "audio_call"]:
            await self.send_call_link(link, sender, message_type)

        await self.broadcast_message(message, sender, time, message_type)

    async def chat_message(self, event):
        await self.send(text_data=json.dumps(event["data"]))

    async def send_call_link(self, link, sender, message_type):
        await self.channel_layer.group_send(
            self.room_name,
            {
                "type": "chat_message",
                "data": {
                    "message": link,
                    "sender": sender,
                    "time": timezone.now().strftime("%Y-%m-%d %H:%M:%S"),
                    "type": message_type,
                },
            },
        )

    async def broadcast_message(self, message, sender, time, message_type):
        await self.channel_layer.group_send(
            self.room_name,
            {
                "type": "chat_message",
                "data": {
                    "message": message,
                    "sender": sender,
                    "time": time,
                    "type": message_type,
                },
            },
        )

    @database_sync_to_async
    def get_existing_messages(self):
        messages = OneToOneChatMessages.objects.filter(room=self.room_name)
        return [
            {
                "message": message.message,
                "sender": message.sender.id,
                "time": message.time_stamp.astimezone(
                    timezone.get_current_timezone()
                ).strftime("%Y-%m-%d %H:%M:%S"),
                "type": message.type,
            }
            for message in messages
        ]

    async def save_message(self, sender, message, message_type):
        sender_instance = await self.get_member_instance(sender)
        if sender_instance:
            await self.save_message_to_db(sender_instance, message, message_type)

    @database_sync_to_async
    def get_member_instance(self, member_id):
        try:
            if member_id != "Anonymous":
                return User.objects.get(id=int(member_id))
        except User.DoesNotExist:
            print("Member not found.")
        return None

    @database_sync_to_async
    def save_message_to_db(self, sender, message, message_type):
        OneToOneChatMessages.objects.create(
            sender=sender,
            message=message,
            room=self.room_name,
            type=message_type,
        )
        print("Message saved to database.")
