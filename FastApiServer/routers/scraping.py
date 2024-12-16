# routers/scraping.py
import os
import re
import asyncio
import logging
import random
from typing import Optional

import aiohttp
from bs4 import BeautifulSoup
from fastapi import APIRouter, BackgroundTasks
from dotenv import load_dotenv

from apscheduler.schedulers.asyncio import AsyncIOScheduler

from database import db

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

# Initialize Router
router = APIRouter()

# Scraping Configuration
USER_AGENTS = [
    # Add your list of user agents here
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko)'
    ' Chrome/91.0.4472.124 Safari/537.36',
]

DOWNLOAD_DIR = 'downloaded_models'
os.makedirs(DOWNLOAD_DIR, exist_ok=True)
SEM = asyncio.Semaphore(5)

# Scheduler Initialization
scheduler = AsyncIOScheduler()

def start_scheduler():
    scheduler.add_job(scrape_models, 'interval', hours=24)      # Schedule scraping every 24 hours
    scheduler.add_job(validate_models, 'interval', hours=12)    # Validate models every 12 hours
    scheduler.start()
    logger.info("Scheduler started.")

def shutdown_scheduler():
    scheduler.shutdown()
    logger.info("Scheduler shut down.")

@router.post("/scrape")
async def trigger_scrape(background_tasks: BackgroundTasks):
    """Endpoint to manually trigger the scraping process."""
    background_tasks.add_task(scrape_models)
    return {"message": "Scraping initiated"}

# Scraping Functions
async def scrape_models():
    base_url = "https://free3d.com/3d-models/"
    download_limit = 50 
    downloaded_count = 0
    page = 1

    async with aiohttp.ClientSession(
    headers={'User-Agent': random.choice(USER_AGENTS)},
    connector=aiohttp.TCPConnector(ssl=False)  # Disable SSL verification
) as session:
        while downloaded_count < download_limit:
            url = f"{base_url}?page={page}"
            logger.info(f"Scraping URL: {url}")
            try:
                async with session.get(url) as response:
                    if response.status != 200:
                        logger.error(f"Failed to fetch {url}: Status {response.status}")
                        break
                    content = await response.text()
                    soup = BeautifulSoup(content, 'html.parser')
                    model_cards = soup.find_all('div', class_='search-result')

                    if not model_cards:
                        logger.info(f"No models found on page {page}. Ending pagination.")
                        break

                    for model in model_cards:
                        if downloaded_count >= download_limit:
                            break

                        # Extract basic model information
                        title_tag = model.find('div', class_='search-result__title')
                        name = title_tag.get_text(strip=True) if title_tag else 'Unknown'

                        price_tag = model.find('span', class_='search-result__price')
                        price_text = price_tag.get_text(strip=True) if price_tag else 'Free'
                        try:
                            price = 0.0 if price_text.lower() == 'free' else float(re.sub(r'[^\d.]', '', price_text))
                        except ValueError:
                            price = 0.0  # Default to free if parsing fails

                        # Skip paid models
                        if price > 0.0:
                            continue

                        image_tag = model.find('img', class_='search-result__thumb')
                        image_url = image_tag['src'] if image_tag else None

                        model_url = model.find('a', class_='product-page-link')['href']
                        full_model_url = f"https://free3d.com{model_url}"

                        # Extract additional details
                        specifications, formats, description, tags = await scrape_model_details(session, full_model_url)

                        # Extract the download link
                        download_link = await get_download_link(session, full_model_url)

                        model_data = {
                            'name': name,
                            'description': description,
                            'file_path': name,  
                            'image_url': image_url,
                            'price': price,
                            'download_link': download_link,
                            'specifications': specifications,
                            'formats': formats,
                            'tags': tags
                        }

                        # Save to database
                        saved = await save_model_to_db(model_data)
                        if saved:
                            downloaded_count += 1
                            if downloaded_count >= download_limit:
                                logger.info("Download limit reached.")
                                break
            except Exception as e:
                logger.error(f"Error scraping models: {e}")
                break

            page += 1
            await asyncio.sleep(1)  

async def scrape_model_details(session: aiohttp.ClientSession, model_url: str):
    """Extract additional details like specifications, formats, and tags from the model page."""
    try:
        async with session.get(model_url) as response:
            if response.status != 200:
                logger.error(f"Failed to fetch model details from {model_url}: Status {response.status}")
                return None, None, None, None

            content = await response.text()
            soup = BeautifulSoup(content, 'html.parser')

            # Extract Specifications
            specs_list = soup.select('ul.product-specs-list > li')
            specifications = []
            for spec in specs_list:
                label_tag = spec.find('span', class_='spec-label')
                value_tag = spec.find('span', class_='spec-value')
                label = label_tag.get_text(strip=True) if label_tag else 'Unknown'
                value = value_tag.get_text(strip=True) if value_tag else 'Unknown'
                specifications.append(f"{label}: {value}")
            specifications = " | ".join(specifications) if specifications else "Unknown"

            # Extract Formats & Files
            formats_section = soup.find('div', class_='file-header')
            formats = formats_section.get_text(strip=True) if formats_section else "Unknown"

            # Extract Description
            description_section = soup.find('div', class_='product-description__text')
            description = description_section.get_text(separator=" ", strip=True) if description_section else "No description available"

            # Extract Tags
            tags_section = soup.select('div.tags-wrapper > a.indiv-tag')
            tags = [tag.get_text(strip=True) for tag in tags_section]
            tags = ",".join(tags) if tags else ""

            return specifications, formats, description, tags
    except Exception as e:
        logger.error(f"Error extracting model details: {e}")
        return None, None, None, None

async def get_download_link(session: aiohttp.ClientSession, model_url: str) -> Optional[str]:
    """Extract the download link from the model page."""
    try:
        async with session.get(model_url) as response:
            if response.status != 200:
                logger.error(f"Failed to fetch model details from {model_url}: Status {response.status}")
                return None
            content = await response.text()
            soup = BeautifulSoup(content, 'html.parser')

            # Look for the download link specifically in the href that matches the download pattern
            download_tag = soup.find('a', href=re.compile(r'^/dl-files\.php\?p='))
            if download_tag:
                # Build the full download URL by appending the site domain to the relative URL
                download_url = "https://free3d.com" + download_tag['href']
                return download_url

            logger.info(f"No download link found for {model_url}")
            return None
    except Exception as e:
        logger.error(f"Error fetching download link from {model_url}: {e}")
        return None

async def save_model_to_db(model_data: dict) -> bool:
    """Save the scraped model data to the database using asyncpg."""
    try:
        # Check if the model already exists
        query_check = "SELECT id FROM scraped_models WHERE name = $1"
        existing_model = await db.fetchrow(query_check, model_data['name'])

        if existing_model is None:
            # Insert new model
            query_insert = """
            INSERT INTO scraped_models (name, description, file_path, image_url, price, download_link, specifications, formats, tags)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            RETURNING id
            """
            record = await db.fetchrow(
                query_insert,
                model_data['name'],
                model_data['description'],
                model_data['file_path'],
                model_data['image_url'],
                model_data['price'],
                model_data['download_link'],
                model_data['specifications'],
                model_data['formats'],
                model_data['tags'],
            )
            logger.info(f"Model '{model_data['name']}' saved to database with id {record['id']}.")
            return True  # Model was saved
        else:
            logger.info(f"Model '{model_data['name']}' already exists in database.")
            return False  # Model was not saved
    except Exception as e:
        logger.error(f"Database error while saving model '{model_data['name']}': {e}")
        return False

async def validate_models():
    """Validate the availability of models by checking their download links."""
    try:
        # Fetch all models
        query = "SELECT id, name, download_link FROM scraped_models"
        models = await db.fetch(query)

        async with aiohttp.ClientSession() as client_session:
            for model in models:
                if not model['download_link']:
                    continue  # Skip if no download link

                try:
                    async with client_session.head(model['download_link']) as response:
                        if response.status == 404:
                            logger.warning(f"Model '{model['name']}' is no longer available. Marking as unavailable.")
                            # Update the model in the database
                            update_query = "UPDATE scraped_models SET download_link = NULL WHERE id = $1"
                            await db.execute(update_query, model['id'])
                except Exception as e:
                    logger.error(f"Error validating model '{model['name']}': {e}")
    except Exception as e:
        logger.error(f"Database error during validation: {e}")
