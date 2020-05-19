from rest_framework import serializers
from .models import User
from .models import Template
from .models import Calendar

class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ('email', 'is_active', 'is_admin', 'permission', 'isboss', 'city', 'infos')


class TemplateSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Template
        fields = ('idCreate', 'name', 'content')

class CalendarSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Calendar
        fields = ('idTemplate', 'month', 'specificContent')