from rest_framework import viewsets

from .serializers import UserSerializer, TemplateSerializer, PlanningSerializer, RegisterSerializer, LoginSerializer, ScheduleCinemaSerializer, InformationSerializer
from .models import Intranet_User, Template, Planning, ScheduleCinema, Information

from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework import status

from knox.models import AuthToken
from django.utils.crypto import get_random_string
from django.core.mail import send_mail

from rest_framework.permissions import IsAuthenticated

import requests

class RegistrationAPI(generics.GenericAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [IsAuthenticated,]
    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        return Response({
            'user': UserSerializer(user, context=self.get_serializer_context()).data,
            'token': AuthToken.objects.create(user)[1]
        })

class LoginAPI(generics.GenericAPIView):
    serializer_class = LoginSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data

        return Response({
            'user': UserSerializer(user, context=self.get_serializer_context()).data,
            'token': AuthToken.objects.create(user)[1]
        })

class AuthAPI(generics.RetrieveAPIView):
    serializer_class = UserSerializer

    permission_classes = [permissions.IsAuthenticated,]

    def get_object(self):
        return self.request.user

# get all users, only by manager
class UserList(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated,]
    serializer_class = UserSerializer
    queryset = Intranet_User.objects.all()


class UserView(generics.GenericAPIView):
    serializer_class = UserSerializer
    user_not_found = Response(data={'detail': 'User not found.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def get(self, request, *args, **kwargs):
        permission_classes = [IsAuthenticated,]
        user_id = None

        if 'pk' in kwargs:
            user_id = kwargs['pk']
            user = None

            try:
                user = Intranet_User.objects.get(id__exact=user_id)
            except Exception as e:
                return self.user_not_found

            response_body =  {
                'user': UserSerializer(user).data,
            }

            return Response(response_body)
        return Response(data={'detail': 'Unexpected error.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def patch(self, request, *args, **kwargs):
        permission_classes = [IsAuthenticated,] 
        user_id = None
        
        if 'pk' in kwargs:
            user_id = kwargs['pk']
            try:
                user = Intranet_User.objects.patch_user(user_id, request)
            except Exception as e:
                return self.user_not_found

            response_body = {
                'user': UserSerializer(user).data,
            }

            return Response(response_body)
        return Response(data={'detail': 'Unexpected error.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    def delete(self, request, *args, **kwargs):
        if request.user.is_manager:
            permission_classes = [IsAuthenticated,]
            user_id = None

            if 'pk' in kwargs:
                user_id = kwargs['pk']
                user = None

                try:
                    user = Intranet_User.objects.get(id__exact=user_id)
                except Exception as e:
                    return self.user_not_found

                user.delete()

                return Response(data={'detail': 'User was deleted successfully'})
        return Response(data={'detail': 'Unexpected error.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class ResetPassord(generics.GenericAPIView):
    serializer_class = UserSerializer
    subject = 'Intranet Cinepel Reset de mot de passe'
    sender = 'technique.projection@gmail.com'
    html_message ='''
    <h2>Bonjour {0},</h2>
    <p>Vous avez demandé à changer votre mot de passe pour notre website.</p>
    <p>Votre nouveau mot de passe est: <b style="font-size:1.5em">{1}</b></p>
    <p>Vous pouvez toujours changer votre mot de passe sur votre page de profil.</p>
    <p>Meilleures salutations</p>
    '''
    message ='''
    Bonjour {0},
    Vous avez demandé à changer votre mot de passe pour notre website.
    Votre nouveau mot de passe est: {1}
    Vous pouvez toujours changer votre mot de passe sur votre page de profil.
    Meilleures salutations
    '''

    def patch(self, request, *args, **kwargs):
        if "email" in request.data.keys():
            email = request.data['email']
            dest=[]
            try:
                user = Intranet_User.objects.get(email__exact=email)
                dest.append(email)
                # Generating new random temporary password
                new_password = get_random_string(8)
                try:
                    msg = self.message.format(user.username,new_password)
                    html_msg = self.html_message.format(user.username,new_password)
                    user.set_password(new_password)
                    send_mail(self.subject,msg,self.sender,dest,fail_silently=False,html_message=html_msg)
                    user.save()
                except Exception as e:
                    return Response(data={'detail': 'Unexpected error while sending mail. Please try again later.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

            except Exception as e1:
                response_body = {
                    'user': None,
                }

                return Response(response_body)

        response_body = {
            'user': None,
        }

        return Response(response_body)

class TemplateView(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated,]
    queryset = Template.objects.all()
    serializer_class = TemplateSerializer


class PlanningView(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated,]
    queryset = Planning.objects.all()
    serializer_class = PlanningSerializer

class ScheduleCinemaView(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated,]
    queryset = ScheduleCinema.objects.all()
    serializer_class = ScheduleCinemaSerializer

class InformationView(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated,]
    queryset = Information.objects.all()
    serializer_class = InformationSerializer