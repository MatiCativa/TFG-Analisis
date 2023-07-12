from rest_framework import serializers
from .models import Patient

class PatientSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()

    def get_image(self, instance):
        return instance.get_frontend_image_url()

    class Meta:
        model = Patient
        fields = '__all__'
    
    #def get_image(self, instance):
    #    return instance.get_frontend_image_url()

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['image'] = self.get_image(instance)
        return representation