from rest_framework import serializers
from .models import Intranet_User, Template, Calendar
from django.contrib.auth import authenticate

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = Intranet_User
        fields = ('id', 'username', 'email', 'is_active', 'is_admin', 'permission', 'is_manager', 'city', 'infos', 'holidays')

class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Intranet_User
        fields = ('id', 'email', 'username', 'password')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = Intranet_User.objects.create_user(
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
    columns = serializers.JSONField(required=False)
    content = serializers.JSONField(required=False)
    class Meta:
        model = Template
        fields = ('id', 'id_create', 'name', 'columns', 'content')


class CalendarSerializer(serializers.ModelSerializer):
    specific_content = serializers.JSONField(required=False)
    class Meta:
        model = Calendar
        fields = ('id', 'id_template','date', 'specific_content')