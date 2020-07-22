#! /bin/bash
service cron start
nginx
gunicorn intranetcinepel.wsgi -b 127.0.0.1:8000
echo "hold on"
