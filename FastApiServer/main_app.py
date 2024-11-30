# main_app.py
# main_app.py
# main_app.py

import logging
import os
from dotenv import load_dotenv

load_dotenv()  # Load environment variables from .env file

# Configure logging
logging.basicConfig(
    level=logging.DEBUG,  # Set to DEBUG for detailed logs
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    handlers=[
        logging.StreamHandler()  # Log to stderr
    ]
)
logger = logging.getLogger(__name__)  # Initialize the logger

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import db
from routers.scraping import start_scheduler, shutdown_scheduler

from routers.image_search import router as image_router
from routers.scraping import router as scraping_router
from routers.cost_estimation import router as cost_estimation_router
from routers.file_upload import router as file_upload_router
from routers.recommendation import router as recommendation_router

app = FastAPI()

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Update to your frontend's origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(image_router)
app.include_router(scraping_router)
app.include_router(cost_estimation_router)
app.include_router(file_upload_router)
app.include_router(recommendation_router)  # Ensure this is included

# Startup Event
@app.on_event("startup")
async def startup_event():
    logger.info("Starting up the application...")
    await db.init_db()          # Initialize the database
    start_scheduler()           # Start the scraping and validation scheduler
    logger.info("Application startup complete.")

# Shutdown Event
@app.on_event("shutdown")
async def shutdown_event():
    logger.info("Shutting down the application...")
    await db.close_db()         # Close the database connection pool
    shutdown_scheduler()        # Shutdown the scheduler
    logger.info("Application shutdown complete.")
