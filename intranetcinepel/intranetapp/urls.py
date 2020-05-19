from django.urls import path
from rest_framework import routers
from . import views
from django.conf.urls import include

# this is only to visualize our api
router = routers.DefaultRouter()
router.register(r'users', views.UserViewSet)
router.register(r'templates', views.TemplateViewSet)
router.register(r'calendar', views.CalendarViewSet)

# Wire up our API using automatic URL routing.
# Additionally, we include login URLs for the browsable API.
urlpatterns = [
    path('', include(router.urls)),
    path('api-auth/', include('rest_framework.urls', namespace='rest_framework'))
]