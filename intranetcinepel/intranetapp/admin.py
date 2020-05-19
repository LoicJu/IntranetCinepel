from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User
from .models import Template
from .models import Calendar

admin.site.register(User, UserAdmin)
admin.site.register(Template)
admin.site.register(Calendar)