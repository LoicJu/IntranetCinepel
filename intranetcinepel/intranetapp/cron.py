
import os
import requests
from .models import ScheduleCinema

def my_cron_job():
    r = requests.get('http://ticketapi.cinepel.ch:11709/2.0/tms?apikey=C1n3pelX4TMSNE5Qx4')

    if(r.status_code==200):
        schedule = ScheduleCinema(content=r.content)
        schedule.save()

    