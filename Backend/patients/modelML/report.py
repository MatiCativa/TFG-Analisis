import tensorflow as tf
from tensorflow.keras.preprocessing import image
import numpy as np
import requests
from io import BytesIO

# Carga el modelo de machine learning (asegúrate de haber entrenado y guardado el modelo previamente)
model = tf.keras.models.load_model('patients/modelML/model_resnet50.h5')

def generate_medical_report(image_url):
    img_height, img_width = 224, 224

    # Descarga la imagen desde la URL y la convierte a un arreglo numpy
    response = requests.get(image_url)
    img = image.load_img(BytesIO(response.content), target_size=(img_height, img_width))
    img_array = image.img_to_array(img)
    img_array = np.expand_dims(img_array, axis=0)
    img_array /= 255.0

    # Haz una predicción con el modelo
    predictions = model.predict(img_array)
    predicted_class = np.argmax(predictions[0])

    # Genera el informe médico
    if predicted_class == 0:
        report = "La imagen es cancerígena"
    else:
        report = "La imagen no es cancerígena"

    return report
