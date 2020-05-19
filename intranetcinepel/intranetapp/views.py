from rest_framework import viewsets

from .serializers import UserSerializer
from .serializers import TemplateSerializer
from .serializers import CalendarSerializer
from .models import User
from .models import Template
from .models import Calendar

# this classes are used to visualize our API

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all().order_by('email')
    serializer_class = UserSerializer

class TemplateViewSet(viewsets.ModelViewSet):
    queryset = Template.objects.all().order_by('name')
    serializer_class = TemplateSerializer

class CalendarViewSet(viewsets.ModelViewSet):
    queryset = Calendar.objects.all().order_by('month')
    serializer_class = CalendarSerializer