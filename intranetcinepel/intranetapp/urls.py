from django.urls import path, include 
from . import views
from knox import views as knox_views

urlpatterns = [
    path('users/<int:pk>', views.UserView.as_view()),
    path('auth/', include('knox.urls')),
    path('auth/register', views.RegistrationAPI.as_view()),
    path('auth/login', views.LoginAPI.as_view()),
    path('auth/user', views.AuthAPI.as_view()),
    path('auth/resetPassword', views.ResetPassord.as_view()),
    path('auth/logout', knox_views.LogoutView.as_view(), name='knox_logout'),
    path('template/<int:pk>', views.TemplateDetails.as_view()),
    path('calendar/<int:pk>', views.CalendarDetails.as_view()),
]
