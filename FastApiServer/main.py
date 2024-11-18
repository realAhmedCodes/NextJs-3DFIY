#main.py
'''
from fastapi import FastAPI, BackgroundTasks
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from scraping import scrape_models, validate_models
from database import init_db

app = FastAPI()

scheduler = AsyncIOScheduler()

@app.on_event("startup")
async def startup_event():
    await init_db()  # Initialize the database
    scheduler.add_job(scrape_models, 'interval', hours=24)  # Schedule scraping every 24 hours
    scheduler.add_job(validate_models, 'interval', hours=12)  # Validate models every 12 hours
    scheduler.start()

@app.on_event("shutdown")
async def shutdown_event():
    scheduler.shutdown()

@app.post("/scrape")
async def trigger_scrape(background_tasks: BackgroundTasks):
    background_tasks.add_task(scrape_models)
    return {"message": "Scraping initiated"}
'''