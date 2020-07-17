FROM nikolaik/python-nodejs:latest
MAINTAINER loic.jurasz@he-arc.ch
ENV TZ=Europe/Zurich
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone
WORKDIR /opt
COPY . .
EXPOSE 8000
EXPOSE 3000
RUN apt-get update -y
RUN apt-get install -y git nginx
RUN pip3 install -r requirements.txt
RUN npm install ./intranetcinepel/intranet_frontend_app/
RUN python3 ./intranetcinepel/manage.py migrate
RUN python3 ./intranetcinepel/manage.py loaddata ./intranetcinepel/intranetapp/fixtures/db.json
RUN npm build ./intranetcinepel/intranet_frontend_app/
RUN python3 ./intranetcinepel/manage.py collectstatic
