# app/main.py

from fastapi import FastAPI, BackgroundTasks, HTTPException
from scraping import scrape_models
from database import init_db

app = FastAPI()

@app.on_event("startup")
async def on_startup():
    await init_db()

@app.post("/scrape")
async def trigger_scrape(background_tasks: BackgroundTasks):
    background_tasks.add_task(scrape_models)
    return {"message": "Scraping initiated"}
