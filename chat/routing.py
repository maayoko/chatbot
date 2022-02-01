from django.conf.urls import url
from .consumers import ChatConsumer

websocket_urlpatterns = [
    url(r'^ws/chat/$', ChatConsumer.as_asgi()),
]