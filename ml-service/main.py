"""
Direct AgriConnect TN ML Service
FastAPI application for ML/AI features
"""

from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
import uvicorn
import os
from dotenv import load_dotenv

from models.price_prediction import PricePredictionModel
from models.crop_recommendation import CropRecommendationModel
from services.data_service import DataService
from services.model_service import ModelService

# Load environment variables
load_dotenv()

# Initialize FastAPI app
app = FastAPI(
    title="Direct AgriConnect TN ML Service",
    description="ML/AI service for price prediction and crop recommendations",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Add middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_middleware(
    TrustedHostMiddleware,
    allowed_hosts=["localhost", "127.0.0.1", "*.agriconnect.tn"]
)

# Initialize services
data_service = DataService()
model_service = ModelService()
price_model = PricePredictionModel()
crop_model = CropRecommendationModel()

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "service": "ml-service"}

@app.post("/predict-price")
async def predict_price(request: dict):
    """Predict crop prices based on historical data"""
    try:
        crop_id = request.get("crop_id")
        district = request.get("district")
        prediction_date = request.get("prediction_date")
        
        if not crop_id or not district:
            raise HTTPException(status_code=400, detail="crop_id and district are required")
        
        # Get historical data
        historical_data = await data_service.get_price_history(crop_id, district)
        
        # Make prediction
        prediction = await price_model.predict(historical_data, prediction_date)
        
        return {
            "predicted_price": prediction["price"],
            "confidence_score": prediction["confidence"],
            "model_version": "v1.0",
            "district": district,
            "prediction_date": prediction_date
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/recommendations")
async def get_crop_recommendations(
    district: str,
    season: str = None,
    user_type: str = "farmer"
):
    """Get crop recommendations based on location and season"""
    try:
        # Get recommendations
        recommendations = await crop_model.get_recommendations(
            district=district,
            season=season,
            user_type=user_type
        )
        
        return {
            "recommendations": recommendations,
            "district": district,
            "season": season,
            "user_type": user_type
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/price-history/{crop_id}")
async def get_price_history(crop_id: str, district: str = None, days: int = 30):
    """Get price history for a specific crop"""
    try:
        history = await data_service.get_price_history(crop_id, district, days)
        return {"price_history": history}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/analytics")
async def get_market_analytics(
    district: str = None,
    crop_id: str = None,
    days: int = 30
):
    """Get market analytics and insights"""
    try:
        analytics = await data_service.get_market_analytics(district, crop_id, days)
        return {"analytics": analytics}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/train-models")
async def train_models():
    """Retrain ML models with latest data"""
    try:
        # This would typically be called by a scheduled job
        await model_service.retrain_models()
        return {"message": "Models retrained successfully"}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/model-status")
async def get_model_status():
    """Get status of ML models"""
    try:
        status = await model_service.get_model_status()
        return {"model_status": status}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True if os.getenv("ENVIRONMENT") == "development" else False
    )

