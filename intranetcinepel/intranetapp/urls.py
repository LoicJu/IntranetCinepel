from django.urls import path, include 
from . import views
from knox import views as knox_views
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'template', views.TemplateView)
router.register(r'calendar', views.CalendarView)
router.register(r'schedule', views.ScheduleCinemaView)

urlpatterns = [
    path('users/<int:pk>', views.UserView.as_view()),
    path('users/all', views.UserList.as_view()),
    path('auth/', include('knox.urls')),
    path('auth/register', views.RegistrationAPI.as_view()),
    path('auth/login', views.LoginAPI.as_view()),
    path('auth/user', views.AuthAPI.as_view()),
    path('auth/resetPassword', views.ResetPassord.as_view()),
    path('auth/logout', knox_views.LogoutView.as_view(), name='knox_logout'),
    path("", include(router.urls))
]
