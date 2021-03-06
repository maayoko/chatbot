import json
from channels.generic.websocket import AsyncJsonWebsocketConsumer
from chatbot_ai.test import main, evaluateInput
import uuid

searcher, voc, args = main()

class ChatConsumer(AsyncJsonWebsocketConsumer):
    async def connect(self):
        print("Connected")
        # self.room_name = self.scope['url_route']['kwargs']['room_code']
        self.room_name = uuid.uuid4()
        self.room_group_name = 'room_%s' % self.room_name

        # Join room group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        await self.accept()

    async def disconnect(self, close_code):
        print("Disconnected")
        # Leave room group
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        """
        Receive message from WebSocket.
        Get the event and send the appropriate event
        """
        response = json.loads(text_data)
        event = response.get("event", None)
        message = response.get("message", None)
        responseMsg = "You are stupid"

        if event == 'MESSAGE':
            # Send message to room group
            responseMsg = evaluateInput(message, searcher, voc, args)
            await self.channel_layer.group_send(self.room_group_name, {
                'type': 'send_message',
                'message': responseMsg,
                "event": "MESSAGE"
            })

        if event == 'START':
            # Send message to room group
            await self.channel_layer.group_send(self.room_group_name, {
                'type': 'send_message',
                'message': message,
                'event': "START"
            })

        if event == 'END':
            # Send message to room group
            await self.channel_layer.group_send(self.room_group_name, {
                'type': 'send_message',
                'message': message,
                'event': "END"
            })

    async def send_message(self, res):
        """ Receive message from room group """
        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            "payload": res,
        }))