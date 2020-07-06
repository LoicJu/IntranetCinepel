from django.db import models
from django.contrib.auth.models import (
    BaseUserManager, AbstractBaseUser
)
from django.utils.translation import gettext_lazy as _
from django.utils import timezone
from rest_framework import status
from django.conf import settings
import os
from jsonfield import JSONField


# Substituting a custom User model, adding necessary fields
class Intranet_UserManager(BaseUserManager):
    def create_user(self, email, username, is_manager, city, password=None):
        """Creates and saves a User with the given email, password"""
        if not email:
            raise ValueError('Users must have an email address')
        user = self.model(
            email=self.normalize_email(email),
            username=username,
            is_manager=is_manager,
            city=city
        )
        if is_manager == "true" or is_manager == True:
            user.is_manager = True
        else:
            user.is_manager = False
        user.set_password("password")
        user.save(using=self._db)
        return user
    
    def patch_user(self, user_id, request):
        """Patches the user with the given id"""
        user = None
        user = Intranet_User.objects.get(id__exact=user_id)

        username = request.data['username']
        user.username = username

        if "email" in request.data.keys():
            email = request.data['email']
            user.email = email
        
        if "city" in request.data.keys():
            city = request.data['city']
            user.city = city

        if "is_manager" in request.data.keys():
            is_manager = request.data['is_manager']
            if is_manager == "true":
                user.is_manager = True
            else:
                user.is_manager = False
        
        if "infos" in request.data.keys():
            infos = request.data['infos']
            user.infos = infos

        if "holidays" in request.data.keys():
            holidays = request.data['holidays']
            user.holidays = holidays

        if "password" in request.data.keys():
            password = request.data['password']
            user.set_password(password)
        
        user.save()

        return user


class Intranet_User(AbstractBaseUser):
    email = models.EmailField(
        verbose_name='email address',
        max_length=255,
        unique=True,
    )
    username = models.CharField(max_length=150)
    is_active = models.BooleanField(default=True)
    is_admin = models.BooleanField(default=False)
    date_joined = models.DateTimeField(_('date joined'), auto_now_add=True)
    permission = models.CharField(max_length=50, default='placeur')
    is_manager = models.BooleanField(default=False)
    city = models.CharField(max_length=50, default='Neuchatel')
    infos = models.CharField(max_length=150, default='nothing')
    holidays = models.CharField(max_length=150, default='nothing')
    USERNAME_FIELD = 'email'
    objects = Intranet_UserManager()    

# model template
class Template(models.Model):
    def gettemplatecity():
        file_path = os.path.join(settings.MEDIA_ROOT, 'defaultTemplate/templateNE.json')
        data_file = open(file_path , 'r')       
        return data_file.read()

    templateCity = gettemplatecity()
    id_create = models.ForeignKey(Intranet_User, on_delete=models.SET_NULL, null=True)
    name = models.CharField(max_length=50, default='template')
    template_content = JSONField(default=templateCity)

# model calendar
class Calendar(models.Model):
    id_template = models.ForeignKey(Template, on_delete=models.SET_NULL, blank=True, null=True)
    id_creator = models.ForeignKey(Intranet_User, on_delete=models.SET_NULL, null=True)
    date = models.TextField(null=True)
    specific_content = JSONField()

class ScheduleCinema(models.Model):
    content = models.TextField(null=True)
