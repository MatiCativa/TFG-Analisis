#Patient
from rest_framework import viewsets
from .serializer import PatientSerializer
from .models import Patient
from django.core.exceptions import ValidationError


#img
from .models import upload_image
from .models import patient_image_path
import logging
logging.basicConfig(level=logging.DEBUG)


#Login
from django.contrib.auth.models import User
from django.contrib.auth.hashers import check_password
from rest_framework.decorators import api_view
from rest_framework import status
from django.contrib.auth import authenticate
from rest_framework.views import APIView
from rest_framework.authtoken.models import Token
from rest_framework.response import Response

#Login
from rest_framework.permissions import IsAuthenticated

#Machine Learning
from patients.modelML.report import generate_medical_report


#Patient view.
class PatientView(viewsets.ModelViewSet):
    serializer_class = PatientSerializer
    queryset = Patient.objects.all()
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        instance = serializer.save()
        
        if 'image' in self.request.data:
            folder_name = patient_image_path(instance)
            instance.image = upload_image(self.request.data['image'], folder_name)
            instance.save()

        image_url = instance.image  # Obtener la URL de la imagen de Cloudinary
        report = generate_medical_report(image_url)  # Pasar la URL de la imagen a la función
        instance.report = report
        instance.save()
        
        

class LoginView(APIView):
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        user = authenticate(username=username, password=password)

        if user is None:
            return Response('Invalid username or password', status=status.HTTP_401_UNAUTHORIZED)

        token, _ = Token.objects.get_or_create(user=user)

        return Response({'token': token.key})
