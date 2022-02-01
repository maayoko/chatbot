from django.shortcuts import render
from django.http.request import HttpRequest

# Create your views here.
def index(request: HttpRequest):
    return render(request, "chat/index.html")
