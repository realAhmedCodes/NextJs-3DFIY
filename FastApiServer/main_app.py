# main_app.py

import logging

logger = logging.getLogger(__name__)  # Initialize the logger

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import init_db
from routers.scraping import start_scheduler, shutdown_scheduler

from routers.image_search import router as image_router
from routers.scraping import router as scraping_router
from routers.cost_estimation import router as cost_estimation_router
from routers.file_upload import router as file_upload_router

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

# Startup Event
@app.on_event("startup")
async def startup_event():
    logger.info("Starting up the application...")
    await init_db()          # Initialize the database
    start_scheduler()        # Start the scraping and validation scheduler
    logger.info("Application startup complete.")

# Shutdown Event
@app.on_event("shutdown")
async def shutdown_event():
    logger.info("Shutting down the application...")
    shutdown_scheduler()     # Shutdown the scheduler
    logger.info("Application shutdown complete.")
