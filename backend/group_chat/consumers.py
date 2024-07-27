from channels.generic.websocket import AsyncWebsocketConsumer


class GroupChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        group_id = self.scope["url_route"]["kwargs"]["id"]
        self.room_group_name = f"chat_{group_id}"
        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        await self.accept()
