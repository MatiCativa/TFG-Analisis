from django.urls import path, include
from rest_framework import routers
from rest_framework.documentation import include_docs_urls
from .views import PatientView
from .views import LoginView
from django.conf import settings
from django.conf.urls.static import static

#Login
#from .views import login

router = routers.DefaultRouter()
router.register(r'patients', PatientView, 'patients')

urlpatterns = [
    path('login/', LoginView.as_view(), name='login'),
    path('api/v1/', include(router.urls)),
    path('docs/', include_docs_urls(title='Patients API'))
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

#Login
#urlpatterns += path('login', login),