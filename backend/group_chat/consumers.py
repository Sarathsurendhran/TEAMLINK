from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import async_to_sync, sync_to_async
import json
import asyncio
from django.utils import timezone
from channels.db import database_sync_to_async
from .models import GroupChatMessages, GroupMembers, Notification
from workspaces.models import WorkSpaceMembers, WorkSpaces
from users.models import User
from django.db.models import F
from channels.layers import get_channel_layer


class GroupChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.group_id = self.scope["url_route"]["kwargs"]["group_id"]
        self.room_group_name = f"chat_{self.group_id}"
        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        await self.accept()

        # Send existing messages to the client
        await self.send_existing_messages()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json["message"]
        sender = text_data_json.get("sender", "Anonymous")
        username = text_data_json.get("username", "unknown")
        time = text_data_json.get("time", "unknown")
        type = text_data_json.get("type", "text_message")

        if type == "video_call":
            await self.video_link_receive(username, sender)

        if type == "audio_call":
            await self.audio_link_receive(username, sender)

        # Save the message to the database
        await self.save_message(sender, message)

        # Send message to room group
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                "type": "chat.message",
                "data": {
                    "message": message,
                    "sender": sender,
                    "username": username,
                    "time": time,
                    "type": type,
                },
            },
        )

        # Notify group members except the sender
        await self.notify_group_members(sender, message)

    async def chat_message(self, event):
        message = event["data"]["message"]
        sender = event["data"]["sender"]
        username = event["data"]["username"]
        time = event["data"]["time"]
        type = event["data"]["type"]

        await self.send(
            text_data=json.dumps(
                {
                    "message": message,
                    "sender": sender,
                    "username": username,
                    "time": time,
                    "type": type,
                }
            )
        )

    async def send_existing_messages(self):
        existing_messages = await self.get_existing_messages()
        for message in existing_messages:
            # Convert datetime object to string
            formatted_time = (
                message["time"]
                .astimezone(timezone.get_current_timezone())
                .strftime("%Y-%m-%d %H:%M:%S")
            )

            # Serialize to JSON
            await self.send(
                text_data=json.dumps(
                    {
                        "message": message["message"],
                        "sender": message["sender"],
                        "username": message["username"],
                        "time": formatted_time,
                        "type": message["type"],
                    }
                )
            )

    # function to getting the previous messages in the database
    @database_sync_to_async
    def get_existing_messages(self):
        messages = GroupChatMessages.objects.filter(group=self.group_id)
        return [
            {
                "message": message.message,
                "sender": message.sender.id,
                "username": message.sender.username,
                "time": message.time_stamp,
                "type": message.type,
            }
            for message in messages
        ]

    async def save_message(self, sender, message):
        """
        Asynchronously saves a message to the database.

        Parameters:
        sender (str): The ID of the sender. If sender is "Anonymous" or not found, the message is not saved.
        message (str): The content of the message to be saved.

        Returns:
        None
        """
        if sender:
            sender = await self.get_member_instance(sender)
            await self.save_message_to_db(sender, message)
        else:
            print("sender not found")

    @database_sync_to_async
    def get_member_instance(self, member_id):
        """
        Retrieves a member instance from the database by their ID.

        Parameters:
        member_id (str): The ID of the member to be retrieved. If "Anonymous", None is returned.
        workspaceID : The current workspace id

        Returns:
        WorkSpaceMembers: The member instance if found, None otherwise.

        Raises:
        WorkSpaceMembers.DoesNotExist: If no member with the provided ID is found.
        """
        try:
            if member_id != "Anonymous":
                member = User.objects.get(id=int(member_id))
                return member
            else:
                return None
        except User.DoesNotExist:
            print("Cannot find the member")

    @database_sync_to_async
    def save_message_to_db(self, sender, message):
        """
        Saves a message to the GroupChatMessages model in the database.

        Parameters:
        sender (WorkSpaceMembers): The member instance who sent the message.
        message (str): The content of the message to be saved.

        Returns:
        None
        """
        if sender:
            GroupChatMessages.objects.create(
                sender=sender,
                message=message,
                group=self.group_id,
            )

            print("Message saved to the database")
        else:
            print("Sender not found")

    # --------------------------------------------------for video and audio call-----------------------------------------#

    async def video_link_receive(self, username, sender):
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                "type": "video_call_link",
                "data": {
                    "sender": sender,
                    "username": username,
                },
            },
        )

    async def video_call_link(self, event):
        sender = event["data"]["sender"]
        username = event["data"]["username"]
        await self.send(
            text_data=json.dumps(
                {"type": "video_call", "sender": sender, "username": username}
            )
        )

    async def audio_link_receive(self, username, sender):
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                "type": "audio_call_link",
                "data": {"username": username, "sender": sender},
            },
        )

    async def audio_call_link(self, event):
        username = event["data"]["username"]
        sender = event["data"]["sender"]
        await self.send(
            text_data=json.dumps(
                {"type": "audio_call", "username": username, "sender": sender}
            )
        )

    async def notify_group_members(self, sender, message):
        """
        Notify all group members except the sender about the new message.
        """
        channel_layer = get_channel_layer()
        unread_message_count = await self.get_unread_messages()

        data = {
            "count": unread_message_count,
            "message": message,
            "group_id": self.group_id,
            "sender": sender,
        }
        await channel_layer.group_send(
            f"notification_{self.group_id}",
            {
                "type": "send_notification",
                "value": json.dumps(data),
            },
        )

    @database_sync_to_async
    def get_unread_messages(self):
        return GroupChatMessages.objects.filter(group=self.group_id, read=False).count()


class NotificationConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.user_id = self.scope["url_route"]["kwargs"]["user_id"]
        self.workspace_id = self.scope["url_route"]["kwargs"]["workspace_id"]
        self.groups = await self.get_user_groups(self.user_id, self.workspace_id)

        for group in self.groups:
            room_group_name = f"notification_{group}"
            await self.channel_layer.group_add(room_group_name, self.channel_name)

        await self.accept()

        # Sending unread messages from the database
        notifications = await self.get_unread_notifications()
        for notification in notifications:
            await self.send(
                text_data=json.dumps(
                    {
                        "message": notification["message"],
                        "time_stamp": notification["time_stamp"].strftime(
                            "%Y-%m-%dT%H:%M:%S.%fZ"
                        ),
                        "read": notification["read"],
                    }
                )
            )

    @database_sync_to_async
    def get_user_groups(self, user_id, workspace_id):
        # Assuming GroupMembers has a foreign key to WorkSpaceMembers
        return list(
            GroupMembers.objects.filter(
                member__user_id=user_id, member__workspace_id=workspace_id
            ).values_list("group_id", flat=True)
        )

    @database_sync_to_async
    def get_unread_notifications(self):
        # Retrieve unread notifications for all groups the user is part of, excluding the sender's own messages
        return list(
            GroupChatMessages.objects.filter(group__in=self.groups, read=False)
            .exclude(sender=self.user_id)
            .values("message", "time_stamp", "read")
            .order_by("time_stamp")
        )

    async def disconnect(self, code):
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    async def send_notification(self, event):
        # Parse the JSON string in the `value` field
        data = json.loads(event["value"])

        # Access individual fields from the parsed data
        count = data.get("count")
        message = data.get("message")
        group_id = data.get("group_id")
        sender = data.get("sender")

        # Only send if this connection is not the sender
        if self.user_id != sender:
            await self.send(
                text_data=json.dumps(
                    {
                        "message": message,
                        "count": count,
                    }
                )
            )
