from rest_framework import serializers
from .models import Intranet_User, Template, Calendar
from django.contrib.auth import authenticate

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = Intranet_User
        fields = ('email', 'is_active', 'is_admin', 'permission', 'is_manager', 'city', 'infos', 'holidays')

class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Intranet_User
        fields = ('id', 'email', 'username', 'password')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = CSRuby_User.objects.create_user(
            validated_data['email'],
            validated_data['username'],
            validated_data['password'],
        )
        return user

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()

    def validate(self, data):
        user = authenticate(**data)
        if user and user.is_active:
            return user
        raise serializers.ValidationError('Incorrect credentials')

class TemplateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Template
        fields = ('idCreate', 'name', 'content')

class CalendarSerializer(serializers.ModelSerializer):
    class Meta:
        model = Calendar
        fields = ('idTemplate', 'month', 'specificContent')