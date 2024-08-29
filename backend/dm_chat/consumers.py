# from channels.generic.websocket import AsyncWebsocketConsumer
# import json
# from django.utils import timezone
# from channels.db import database_sync_to_async
# from .models import OneToOneChatMessages
# from users.models import User


# class PersonalChatConsumer(AsyncWebsocketConsumer):
#     async def connect(self):
#         user_id1 = int(self.scope["url_route"]["kwargs"]["user_id1"])
#         user_id2 = int(self.scope["url_route"]["kwargs"]["user_id2"])
#         user_ids = sorted([user_id1, user_id2])
#         self.room_name = f"chat_{user_ids[0]}-{user_ids[1]}"

#         await self.channel_layer.group_add(self.room_name, self.channel_name)
#         await self.accept()

#         existing_messages = await self.get_existing_messages()
#         for message in existing_messages:
#             await self.send(text_data=json.dumps(message))

#     async def disconnect(self, code):
#         await self.channel_layer.group_discard(self.room_name, self.channel_name)

#     async def receive(self, text_data=None):
#         data = json.loads(text_data)

#         message = data.get("message", "")
#         sender = data.get("sender", "Anonymous")
#         time = data.get("time", timezone.now().strftime("%Y-%m-%d %H:%M:%S"))
#         message_type = data.get("type", "text_message")
#         link = data.get("link", "")

#         if sender and message_type in ["text_message", "photo", "video" ]:
#             await self.save_message(sender, message, message_type)

#         if message_type in ["video_call", "audio_call"]:
#             await self.send_call_link(link, sender, message_type)

#         await self.broadcast_message(message, sender, time, message_type)

#     async def chat_message(self, event):
#         await self.send(text_data=json.dumps(event["data"]))

#     async def send_call_link(self, link, sender, message_type):
#         await self.channel_layer.group_send(
#             self.room_name,
#             {
#                 "type": "chat_message",
#                 "data": {
#                     "message": link,
#                     "sender": sender,
#                     "time": timezone.now().strftime("%Y-%m-%d %H:%M:%S"),
#                     "type": message_type,
#                 },
#             },
#         )

#     async def broadcast_message(self, message, sender, time, message_type):
#         await self.channel_layer.group_send(
#             self.room_name,
#             {
#                 "type": "chat_message",
#                 "data": {
#                     "message": message,
#                     "sender": sender,
#                     "time": time,
#                     "type": message_type,
#                 },
#             },
#         )

#     @database_sync_to_async
#     def get_existing_messages(self):
#         messages = OneToOneChatMessages.objects.filter(room=self.room_name)
#         return [
#             {
#                 "message": message.message,
#                 "sender": message.sender.id,
#                 "time": message.time_stamp.astimezone(
#                     timezone.get_current_timezone()
#                 ).strftime("%Y-%m-%d %H:%M:%S"),
#                 "type": message.type,
#             }
#             for message in messages
#         ]

#     async def save_message(self, sender, message, message_type):
#         sender_instance = await self.get_member_instance(sender)
#         if sender_instance:
#             await self.save_message_to_db(sender_instance, message, message_type)

#     @database_sync_to_async
#     def get_member_instance(self, member_id):
#         try:
#             if member_id != "Anonymous":
#                 return User.objects.get(id=int(member_id))
#         except User.DoesNotExist:
#             print("Member not found.")
#         return None

#     @database_sync_to_async
#     def save_message_to_db(self, sender, message, message_type):
#         OneToOneChatMessages.objects.create(
#             sender=sender,
#             message=message,
#             room=self.room_name,
#             type=message_type,
#         )
#         print("Message saved to database.")


from channels.generic.websocket import AsyncWebsocketConsumer
import json
from django.utils import timezone
from channels.db import database_sync_to_async
from .models import OneToOneChatMessages
from users.models import User
from channels.layers import get_channel_layer


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

        if sender and message_type in ["text_message", "photo", "video"]:
            await self.save_message(sender, message, message_type)

        if message_type in ["video_call", "audio_call"]:
            await self.send_call_link(link, sender, message_type)

        await self.broadcast_message(message, sender, time, message_type)

        # Send a notification to the receiver
        await self.notify_receiver(sender, message, time)

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

    async def notify_receiver(self, sender, message, time):
        """
        Notify the receiver of the new message.
        """
        # Get the receiver's user_id
        receiver_id = await self.get_receiver_id(sender)

        sender_name = await self.get_sender_name(sender)


        # Get the channel layer
        channel_layer = get_channel_layer()

        # Prepare the notification data
        data = {
            "message": message,
            "sender": sender,
            "time": time,
            "sender_name": sender_name,
            "unread_count": 1,
        }

        # Send the notification to the receiver's notification group
        await channel_layer.group_send(
            f"notification_{receiver_id}",
            {
                "type": "send_notification",
                "value": json.dumps(data),
            },
        )

 
    @database_sync_to_async
    def get_receiver_id(self, sender_id):
        # Assuming the other user in the chat is the receiver
        user_ids = list(map(int, self.room_name.split("_")[1].split("-")))
        user_ids.remove(int(sender_id))
        return user_ids[0]

    @database_sync_to_async
    def get_sender_name(self, sender):
        sender_name = User.objects.get(id=sender)
        return sender_name.username

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


class NotificationConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.user_id = self.scope["url_route"]["kwargs"]["user_id"]
        self.group_name = f"notification_{self.user_id}"

        # Add the user to the notification group
        await self.channel_layer.group_add(self.group_name, self.channel_name)

        await self.accept()

        # Retrieve unread notifications upon connection
        unread_notifications, unread_count = await self.get_unread_notifications()

        await self.send(text_data=json.dumps({"unread_count": unread_count}))

        # Send unread notifications to the client
        for notification in unread_notifications:
            await self.send(text_data=json.dumps(notification))

    async def disconnect(self, close_code):
        # Remove the user from the notification group
        await self.channel_layer.group_discard(self.group_name, self.channel_name)

    async def send_notification(self, event):
        # Send the notification to the WebSocket client
        notification = json.loads(event["value"])

        await self.send(text_data=json.dumps(notification))

    @database_sync_to_async
    def get_unread_notifications(self):
        # Retrieve unread personal chat notifications for the user
        unread_notifications = (
            OneToOneChatMessages.objects.filter(
                room__contains=f"{self.user_id}-", is_read=False
            )
            .exclude(sender_id=self.user_id)
            .values("id", "message", "time_stamp", "sender_id", "sender__username")
            .order_by("time_stamp")
        )

        notifications = []
        for notification in unread_notifications:
            notifications.append(
                {
                    "message": notification["message"],
                    "time": notification["time_stamp"].isoformat(),
                    "sender_name": notification["sender__username"],
                }
            )

        unread_count = unread_notifications.count()

        return notifications, unread_count
