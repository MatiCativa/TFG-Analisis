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
    try:
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
            report = "Según nuestra evaluación, existe una alta probabilidad de que la imagen sea cancerígena. Recomendamos realizar un examen adicional con un profesional médico para obtener un diagnóstico preciso y recibir el tratamiento adecuado."
        else:
            report = "Según nuestra evaluación, no se ha detectado evidencia de cáncer en la imagen. Sin embargo, es importante tener en cuenta que solo podemos proporcionar una evaluación preliminar y se recomienda consultar a un especialista médico para un análisis más detallado y un diagnóstico preciso."

        return report

    except requests.exceptions.RequestException:
        return "Lo sentimos, ha ocurrido un error al procesar la imagen. Por favor, asegúrate de proporcionar una URL válida e intenta nuevamente. Si el problema persiste, te recomendamos consultar a un especialista médico para una evaluación más precisa."

