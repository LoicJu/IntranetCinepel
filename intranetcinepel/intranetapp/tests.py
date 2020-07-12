import os
import re
import json
import tempfile
from rest_framework import status
from django.test import TestCase
from django.test import Client
from django.test import tag
from django.conf import settings
from django.core.files.uploadedfile import SimpleUploadedFile

from django.contrib.auth.models import User
from .models import *


# Like only a manager can create a user, we'll use a manager for our test
USERNAME = 'test'
EMAIL = 'test@test.com'
CITY = 'Neuchatel'
IS_MANAGER = 'true'
PASSWORD = 'password'

def _create_test_user():
    '''
    Creates a test user.
    '''
    user = Intranet_User.objects.create_user(
        username=USERNAME,
        email=EMAIL,
        city=CITY,
        is_manager=IS_MANAGER
    )
    user.save()
    return user

# Create your tests here.

class AuthTest(TestCase):
    '''
    Authentication unit testing
    '''
    def setUp(self):
        self.client = Client()

        self.user = _create_test_user()

    @tag('login')
    def test_login(self):
        # Login with email address
        response = self.client.post('/api/auth/login', { 'email': EMAIL, 'password': PASSWORD })
        self.assertEqual(200, response.status_code)
        # Successful login returns an authentication token and the username
        jsonResponse = json.loads(response.content)
        self.assertIn('token', jsonResponse)
        self.assertEqual(jsonResponse['user']['username'], USERNAME)

        # Wrong credentials
        response = self.client.post('/api/auth/login', { 'email': EMAIL, 'password': 'wrongpassword' })
        self.assertEqual(400, response.status_code)

    @tag('logout')
    def test_logout(self):
        response = self.client.post('/api/auth/login', { 'email': EMAIL, 'password': PASSWORD })
        token = json.loads(response.content)['token']
        
        headers = {
            'HTTP_AUTHORIZATION': 'Token ' + token
        }
        response = self.client.post('/api/auth/logout', **headers)
        self.assertEqual(204, response.status_code)

    @tag('registration')
    def test_registration(self):
        # we login first to be manager to register
        response = self.client.post('/api/auth/login', { 'email': EMAIL, 'password': PASSWORD })
        token = json.loads(response.content)['token']
        headers = {
            'HTTP_AUTHORIZATION': 'Token ' + token
        }
        response = self.client.post('/api/auth/register', {
            'username': 'test2',
            'email': 'test2@test2.com',
            'city': CITY,
            'is_manager': 'false'
        }, **headers)
        self.assertEqual(200, response.status_code)

        # Successful registration returns an authentication token
        jsonResponse = json.loads(response.content)
        self.assertIn('token', jsonResponse)
        self.assertIn('id', jsonResponse['user'])
        self.assertIn('username', jsonResponse['user'])

        # User Profile creation at registration
        user_id = jsonResponse['user']['id']
        user_profile = Intranet_User.objects.get(id=user_id)
        self.assertEqual(user_profile.id, user_id)
        self.assertEqual(user_profile.city, CITY)

class TemplatePLanningTest(TestCase):
    def setUp(self):
        self.client = Client()
        self.user = _create_test_user()

    @tag('template')
    def test_template(self):
        # Login with email address
        response = self.client.post('/api/auth/login', { 'email': EMAIL, 'password': PASSWORD })
        self.assertEqual(200, response.status_code)
        token = json.loads(response.content)['token']
        headers = {
            'HTTP_AUTHORIZATION': 'Token ' + token
        }
        user_id = json.loads(response.content)['user']['id']

        # create template
        response = self.client.post('/api/template/', { 'name': 'test', 'id_create': user_id }, **headers)
        self.assertEqual(201, response.status_code)
        jsonResponse = json.loads(response.content)

        template_id = jsonResponse['id']
        template_name = jsonResponse['name']

        ## get template
        template_get = Template.objects.get(id=template_id)
        self.assertEqual(template_get.id, template_id)
        self.assertEqual(template_get.name, template_name)


    @tag('planning')
    def test_planning(self):
        # Login with email address
        response = self.client.post('/api/auth/login', { 'email': EMAIL, 'password': PASSWORD })
        self.assertEqual(200, response.status_code)
        token = json.loads(response.content)['token']
        headers = {
            'HTTP_AUTHORIZATION': 'Token ' + token
        }
        user_id = json.loads(response.content)['user']['id']

        # create template
        response = self.client.post('/api/template/', { 'name': 'test', 'id_create': user_id }, **headers)
        self.assertEqual(201, response.status_code)
        jsonResponse = json.loads(response.content)

        template_id = jsonResponse['id']

        # create planning
        file_path = os.path.join(settings.MEDIA_ROOT, 'defaultTemplate/templateNE.json')
        data_file = open(file_path , 'r')       
        content =  data_file.read()
        response = self.client.post('/api/calendar/', { 'id_template': template_id, 'id_creator': user_id , 'date': '01.07.2020', 'specific_content':content}, **headers)
        self.assertEqual(201, response.status_code)
        jsonResponse = json.loads(response.content)

        planning_id = jsonResponse['id']
        planning_specific_content = jsonResponse['specific_content']

        ## get planning
        planning_get = Calendar.objects.get(id=planning_id)
        self.assertEqual(planning_get.id, planning_id)
        self.assertEqual(planning_get.specific_content, planning_specific_content)