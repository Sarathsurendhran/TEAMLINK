from channels.generic.websocket import AsyncWebsocketConsumer
import json
from django.utils import timezone
from channels.db import database_sync_to_async
from .models import GroupChatMessages
from workspaces.models import WorkSpaceMembers, WorkSpaces
from users.models import User


class GroupChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        group_id = self.scope["url_route"]["kwargs"]["group_id"]
        self.room_group_name = f"chat_{group_id}"
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



        print("sendererr", sender)
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
        messages = GroupChatMessages.objects.filter(group=self.room_group_name)
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
                group=self.room_group_name,
            )
            print("Message saved to the database")
        else:
            print("Sender not found")
