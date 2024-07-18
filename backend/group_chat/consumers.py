from channels.generic.websocket import AsyncWebsocketConsumer

class PersonalChatConsumer(AsyncWebsocketConsumer):
  async def connect(self):
    print("Testing connection")
    await self.accept()
    