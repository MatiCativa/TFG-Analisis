from django.db import models
from django.conf import settings
from django.urls import reverse
import cloudinary.uploader
from cloudinary.models import CloudinaryField


import os

image_counter = 0

class CloudinaryFolderField(CloudinaryField):
    def __init__(self, upload_to_image, *args, **kwargs):
        self.upload_to_image = upload_to_image
        super().__init__(*args, **kwargs)

    def upload_options(self, model_instance):
        folder_name = self.upload_to_image(model_instance, '')
        return {
            'folder': folder_name
        }

def patient_image_path(instance):
    global image_counter
    last_name = instance.last_name.replace(" ", "_")
    return f'patient_images/{last_name}/'

def create_cloudinary_folder(upload_to_image):
    def cloudinary_folder(instance, filename):
        return upload_to_image(instance, filename)
    return cloudinary_folder

def upload_image(file, folder_name):
    response = cloudinary.uploader.upload(file, folder=folder_name, width=400, height=300, crop='fill')
    return response['secure_url']

def upload_to_image(instance, filename):
    last_name = instance.last_name.replace(' ', '_')
    folder_name = f'patient_images/{last_name}'
    return upload_image(instance.image, folder_name)

def folderFunction(instance):
    last_name = instance.last_name.replace(" ", "_")
    return f'patient_images/{last_name}/'

class Patient(models.Model):
    name = models.CharField(max_length=200)
    last_name = models.CharField(max_length=200)
    birth_date = models.DateField(null=True, blank=True)
    age = models.IntegerField()
    dni = models.CharField(max_length=200, blank=True)
    address = models.CharField(max_length=200, blank=True)
    city = models.CharField(max_length=200, blank=True)
    gender = models.CharField(max_length=200)
    email = models.EmailField(max_length=200)
    social_security = models.CharField(max_length=200)
    phone = models.CharField(max_length=200)
    image = CloudinaryField(
        resource_type='image',
        folder=folderFunction,
        transformation=[
            {'width': 400, 'height': 300, 'crop': 'fill'}
        ],
        null=True,
        blank=True
    )
    date = models.DateField(auto_now=True)
    description = models.TextField(blank=True)
    report = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.name
    
    def get_absolute_image_url(self):
        if self.image:
            return self.image
        return ''

    def get_frontend_image_url(self):
        if self.image:
            return self.image.url if hasattr(self.image, 'url') else ''
        return ''

