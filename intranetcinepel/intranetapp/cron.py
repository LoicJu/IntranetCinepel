
import os
import requests
from .models import ScheduleCinema
from django.utils import timezone

def my_cron_job():
    today = timezone.now().date()
    week = today + timezone.timedelta(days=7)
    r = requests.get('http://ticketapi.cinepel.ch:11709/2.0/tms?apikey=C1n3pelX4TMSNE5Qx4' + '&from=' +  str(today) + '&to=' + str(week))

    if(r.status_code==200):
        schedule = ScheduleCinema(id=1,content=r.content)
        schedule.save()

    