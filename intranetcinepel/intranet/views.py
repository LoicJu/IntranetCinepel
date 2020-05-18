from django.http import HttpResponse


def index(request):
    return HttpResponse("Hello, world. You're at the intranet Cinepel index. Bonjour les parents")
