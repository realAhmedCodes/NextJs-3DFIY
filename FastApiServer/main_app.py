# main_app.py
# main_app.py
import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routers.image_search import router as image_router
from routers.scraping import router as scraping_router, start_scheduler, shutdown_scheduler

from database import init_db

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="Visual Image Search & Web Scraping API",
    description="A FastAPI application that handles image searching using CLIP and Pinecone, and web scraping for 3D models.",
    version="1.0.0"
)

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
