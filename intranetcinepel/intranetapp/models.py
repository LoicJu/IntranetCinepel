from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    email = models.EmailField(
        unique=True,
        max_length=254,
    )
    is_active = models.BooleanField(default=True)
    is_admin = models.BooleanField(default=False)
    permission = models.CharField(max_length=50, default='placeur')
    isboss = models.BooleanField(default=False)
    city = models.CharField(max_length=50, default='Neuchatel')
    infos = models.CharField(max_length=150, default='nothing')

