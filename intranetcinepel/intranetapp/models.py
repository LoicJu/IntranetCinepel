from django.db import models
from django.contrib.auth.models import (
    BaseUserManager, AbstractBaseUser
)
from django.utils.translation import gettext_lazy as _
from django.utils import timezone
from rest_framework import status

# Substituting a custom User model, adding necessary fields
class Intranet_UserManager(BaseUserManager):
    def create_user(self, email, username, password=None, steamid=None):
        """Creates and saves a User with the given email, password and steamid"""
        if not email:
            raise ValueError('Users must have an email address')

        user = self.model(
            email=self.normalize_email(email),
            username=username,
        )
        user.set_password(password)
        user.save(using=self._db)
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
    id_create = models.ForeignKey(Intranet_User, on_delete=models.CASCADE, null=True)
    name = models.CharField(max_length=50, default='template')
    # the json will be in charfield, we can deserialize as it's json
    content = models.CharField(max_length=500)
    def __str__(self):
        return self.name

# model calendar
class Calendar(models.Model):
    id_Template = models.ForeignKey(Template, on_delete=models.SET_NULL, blank=True, null=True)
    month = models.CharField(max_length=50, default="mois")
    specific_content = models.CharField(max_length=500)
    def __str__(self):
        return self.month