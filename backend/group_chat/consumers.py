from channels.generic.websocket import AsyncWebsocketConsumer
import json


class GroupChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        group_id = self.scope["url_route"]["kwargs"]["id"]
        self.room_group_name = f"chat_{group_id}"
        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json["message"]
        sender = text_data_json.get("sender", "Anonymous")
        username = text_data_json.get("username", "unknown")
        time = text_data_json.get("time", "unknown")
        type = text_data_json.get("type", "text_message")

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
        message = event["message"]

        await self.send(text_data=json.dumps({"message": message}))
