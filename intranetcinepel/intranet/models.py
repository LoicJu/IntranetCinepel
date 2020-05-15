from django.db import models

# Create your models here.
class NewUserModel(models.Model):
        user = models.OneToOneField(User, on_delete=models.CASCADE)
        posts = models.IntegerField(default=0)