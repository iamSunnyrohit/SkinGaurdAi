import os
import io
import numpy as np
from PIL import Image
# pyrefly: ignore [missing-import]
from fastapi import FastAPI, File, UploadFile, HTTPException
# pyrefly: ignore [missing-import]
from fastapi.middleware.cors import CORSMiddleware

# Initialize FastAPI application
app = FastAPI(
    title="Skin Guard AI API",
    description="Inference server for classifying HAM10000 skin lesions.",
    version="1.0.0"
)

# Enable CORS for frontend clients (e.g. localhost, Vercel deployments)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Define label mapping classes sorted alphabetically (standard Keras loader directory sorting)
CLASSES = [
    'Actinic_Keratosis',
    'Basal_Cell_Carcinoma',
    'Benign_Keratosis',
    'Dermatofibroma',
    'Melanocytic_Nevi',
    'Melanoma',
    'Vascular_Lesion'
]

# Load model globally on server start
model = None
MODEL_LOAD_ERROR = None

try:
    # Resolve absolute paths relative to repository root
    BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    
    # Try loading the lighter .keras model first
    model_path = os.path.join(BASE_DIR, 'models', 'skin_classifier.keras')
    if not os.path.exists(model_path):
        # Fallback to .h5 model
        model_path = os.path.join(BASE_DIR, 'models', 'skin_classifier.h5')
        
    print(f"Attempting to load model from: {model_path}")
    
    if os.path.exists(model_path):
        import tensorflow as tf
        model = tf.keras.models.load_model(model_path)
        print("Successfully loaded Keras classification model.")
    else:
        raise FileNotFoundError(f"No classifier model found at {model_path}. Please check file staging.")
except Exception as e:
    MODEL_LOAD_ERROR = str(e)
    print(f"Error loading classification model: {MODEL_LOAD_ERROR}")


@app.get("/health")
def health_check():
    """Health check endpoint required for Render keep-alive validation."""
    if model is not None:
        return {
            "status": "healthy",
            "model_loaded": True,
            "architecture": "Sequential CNN",
            "classes_count": len(CLASSES)
        }
    else:
        return {
            "status": "degraded",
            "model_loaded": False,
            "error": MODEL_LOAD_ERROR
        }


@app.post("/api/classify")
async def classify_lesion(file: UploadFile = File(...)):
    """Classifies an uploaded skin lesion image using the loaded Keras model."""
    if model is None:
        raise HTTPException(
            status_code=503,
            detail=f"Inference model is currently unavailable. Error: {MODEL_LOAD_ERROR}"
        )
    
    # Only accept valid image files
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Uploaded file must be a valid image format.")
    
    try:
        # Read file bytes
        contents = await file.read()
        image = Image.open(io.BytesIO(contents)).convert("RGB")
        
        # Preprocess: resize to match model inputs (224 x 224 pixels)
        image = image.resize((224, 224))
        
        # Convert to numpy array and add batch dimension (shape: [1, 224, 224, 3])
        input_array = np.array(image, dtype=np.uint8)
        input_array = np.expand_dims(input_array, axis=0)
        
        # Run classification predictions
        predictions = model.predict(input_array)[0]
        
        # Format output predictions sorted by confidence descending
        results = []
        for index, probability in enumerate(predictions):
            results.append({
                "label": CLASSES[index],
                "confidence": float(probability)
            })
            
        # Sort results (confidence high to low)
        results.sort(key=lambda x: x["confidence"], reverse=True)
        return results
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error executing model inference: {str(e)}")
