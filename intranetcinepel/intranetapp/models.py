from django.db import models
from django.contrib.auth.models import AbstractUser

# the json will be in charfield, we can deserialize as it's json

# Substituting a custom User model, adding necessary fields
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
    holidays = models.CharField(max_length=150, default='nothing')
    def __str__(self):
        return self.email

# model template
class Template(models.Model):
    idCreate = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=50, default='template')
    content = models.CharField(max_length=500)
    def __str__(self):
        return self.name

# model calendar
class Calendar(models.Model):
    idTemplate = models.ForeignKey(Template, on_delete=models.SET_NULL, blank=True, null=True)
    month = models.CharField(max_length=50, default="mois")
    specificContent = models.CharField(max_length=500)
    def __str__(self):
        return self.month