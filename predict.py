import cv2
import numpy as np
from model import load_model

# Define the class mapping
CLASSES = {
    0: ('akiec', 'Actinic keratoses and intraepithelial carcinomae'),
    1: ('bcc', 'Basal cell carcinoma'),
    2: ('bkl', 'Benign keratosis-like lesions'),
    3: ('df', 'Dermatofibroma'),
    4: ('nv', 'Melanocytic nevi'),
    5: ('vasc', 'Pyogenic granulomas and hemorrhage'),
    6: ('mel', 'Melanoma')
}

# Load model at module level so it's only loaded once
model = load_model()

def preprocess_image(image_path):
    """
    Preprocess the image as required by the model:
    - Resize to 28x28
    - Standardize
    """
    try:
        # Read and resize image
        img = cv2.imread(image_path)
        img = cv2.resize(img, (28, 28))
        
        # Standardize
        img = (img - np.mean(img)) / np.std(img)
        
        # Reshape for prediction
        img = img.reshape(1, 28, 28, 3)
        
        return img
    except Exception as e:
        print(f"Error preprocessing image: {str(e)}")
        return None

def predict_image(image_path):
    """
    Predict the skin lesion class for the given image
    Returns the class name and confidence score
    """
    if model is None:
        return "Model not loaded", 0
    
    img = preprocess_image(image_path)
    if img is None:
        return "Failed to process image", 0
    
    # Make prediction
    prediction = model.predict(img)
    
    # Get the class with highest probability
    class_idx = np.argmax(prediction[0])
    confidence = prediction[0][class_idx] * 100  # Convert to percentage
    
    # Get class name and description
    class_code, class_name = CLASSES[class_idx]
    result = f"{class_name} ({class_code})"
    
    return result, confidence
