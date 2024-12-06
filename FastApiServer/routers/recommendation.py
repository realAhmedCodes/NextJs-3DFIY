# routers/recommendation.py
# fastApiServer/routers/recommendation.py
'''
from fastapi import APIRouter, Depends, HTTPException
from typing import List
from services.recommendation_engine import get_recommendations
from database import get_db

router = APIRouter()

@router.get("/recommendations/{user_id}")
async def recommendations(user_id: int, db=Depends(get_db)):
    # Fetch recommendations
    model_ids = await get_recommendations(user_id, db)
    
    if not model_ids:
        return {"recommendations": []}
    
    # Fetch model details
    query = """
    SELECT model_id, name, description, image, price
    FROM models
    WHERE model_id = ANY($1)
    """
    records = await db.fetch(query, model_ids)
    
    # Return recommendations
    return {"recommendations": [dict(record) for record in records]}
'''
# routers/recommendation.py
# routers/recommendation.py

from fastapi import APIRouter, Depends, HTTPException
from services.recommendation_engine import (
    get_model_recommendations,
    get_designer_recommendations,
    get_printer_recommendations
)
from database import get_db
import logging

# Initialize logger
logger = logging.getLogger(__name__)

router = APIRouter()

# --- Models Recommendation Endpoint ---
@router.get("/recommendations/models/{user_id}")
async def model_recommendations(user_id: int, db=Depends(get_db)):
    logger.info(f"Received model recommendation request for user_id: {user_id}")
    try:
        # Fetch model recommendations
        model_ids = await get_model_recommendations(user_id, db)

        if not model_ids:
            logger.info(f"No model recommendations found for user_id: {user_id}")
            return {"recommendations": []}

        # Fetch model details
        query = """
        SELECT model_id, name, description, image, price,tags
        FROM "Models"
        WHERE model_id = ANY($1::int[])
        LIMIT 6
        """
        records = await db.fetch(query, model_ids)
        recommendations = [dict(record) for record in records]
        logger.info(f"Returning {len(recommendations)} model recommendations for user_id: {user_id}")

        return {"recommendations": recommendations}
    except Exception as e:
        logger.error(f"Error processing model recommendations for user_id {user_id}: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch model recommendations")

# --- Designers Recommendation Endpoint ---
@router.get("/recommendations/designers/{user_id}")
async def designer_recommendations(user_id: int, db=Depends(get_db)):
    logger.info(f"Received designer recommendation request for user_id: {user_id}")
    try:
        # Fetch designer recommendations
        designer_ids = await get_designer_recommendations(user_id, db)

        if not designer_ids:
            logger.info(f"No designer recommendations found for user_id: {user_id}")
            return {"recommendations": []}

        # Fetch designer details
        query = """
        SELECT d.designer_id, u.name, u.profile_pic, u.location, u.rating
        FROM "Designers" d
        JOIN "Users" u ON d.user_id = u.user_id
        WHERE d.designer_id = ANY($1::int[])
        LIMIT 6
        """
        records = await db.fetch(query, designer_ids)
        recommendations = [dict(record) for record in records]
        logger.info(f"Returning {len(recommendations)} designer recommendations for user_id: {user_id}")

        return {"recommendations": recommendations}
    except Exception as e:
        logger.error(f"Error processing designer recommendations for user_id {user_id}: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch designer recommendations")

# --- Printers Recommendation Endpoint ---
@router.get("/recommendations/printers/{user_id}")
async def printer_recommendations(user_id: int, db=Depends(get_db)):
    logger.info(f"Received printer recommendation request for user_id: {user_id}")
    try:
        # Fetch printer recommendations
        printer_ids = await get_printer_recommendations(user_id, db)

        if not printer_ids:
            logger.info(f"No printer recommendations found for user_id: {user_id}")
            return {"recommendations": []}

        # Fetch printer details
        query = """
        SELECT p.printer_id, p.name, p.image, p.location, p.rating, p.printer_type, p.materials
        FROM "Printers" p
        WHERE p.printer_id = ANY($1::int[])
        """
        records = await db.fetch(query, printer_ids)
        recommendations = [dict(record) for record in records]
        logger.info(f"Returning {len(recommendations)} printer recommendations for user_id: {user_id}")

        return {"recommendations": recommendations}
    except Exception as e:
        logger.error(f"Error processing printer recommendations for user_id {user_id}: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch printer recommendations")
