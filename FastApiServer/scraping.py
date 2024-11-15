from sqlalchemy.future import select
import logging
import aiohttp
import asyncio
import os
import random
from bs4 import BeautifulSoup
from database import AsyncSessionLocal
from models import ScrapedModel
import re

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Update User Agents list for request headers
USER_AGENTS = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    # Additional user agents
]

DOWNLOAD_DIR = 'downloaded_models'
os.makedirs(DOWNLOAD_DIR, exist_ok=True)
SEM = asyncio.Semaphore(5)

async def scrape_models():
    base_url = "https://free3d.com/3d-models/"
    headers = {
        'User-Agent': random.choice(USER_AGENTS)
    }
    download_limit = 20  # Limit to download just 20 models
    downloaded_count = 0  # Counter for downloaded models

    async with aiohttp.ClientSession(headers=headers) as session:
        page = 1
        while downloaded_count < download_limit:  # Stop when we reach the limit
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

                        format_tag = model.find('span', class_='search-result__format')
                        file_format = format_tag.get_text(strip=True) if format_tag else 'N/A'

                        price_tag = model.find('span', class_='search-result__price')
                        price_text = price_tag.get_text(strip=True) if price_tag else 'Free'
                        price = 0.0
                        if price_text.lower() != 'free':
                            price = float(re.sub(r'[^\d.]', '', price_text))

                        image_tag = model.find('img', class_='search-result__thumb')
                        image_url = image_tag['src'] if image_tag else None

                        model_url = model.find('a', class_='product-page-link')['href'] if model.find('a', class_='product-page-link') else None
                        full_model_url = f"https://free3d.com{model_url}"

                        # Extract the download link from the individual model page
                        download_link = await get_download_link(session, full_model_url)

                        model_data = {
                            'name': name,
                            'description': '',
                            'file_path': name,
                            'image_url': image_url,
                            'price': price,
                            'download_link': download_link
                        }

                        # Save to database
                        saved = await save_model_to_db(model_data)
                        if saved:
                            downloaded_count += 1  # Increment the counter if saved
                            if downloaded_count >= download_limit:
                                logger.info("Download limit reached.")
                                break
            except Exception as e:
                logger.error(f"Error scraping models: {e}")
                break

            page += 1
            await asyncio.sleep(1)  # Delay between requests to avoid overloading the server
'''
async def get_download_link(session, model_url):
    async with session.get(model_url) as response:
        if response.status != 200:
            logger.error(f"Failed to fetch model details from 
            return None
        content = await response.text()
        soup = BeautifulSoup(content, 'html.parser')
        download_tag = soup.find('a', href=re.compile(r'/dl-files\.php\?p='))
        if download_tag:
            return "https://free3d.com" + download_tag['href']
        return None
'''
async def get_download_link(session, model_url):
    async with session.get(model_url) as response:
        if response.status != 200:
            logger.error(f"Failed to fetch model details from {model_url}: Status {response.status}")
            return None
        content = await response.text()
        soup = BeautifulSoup(content, 'html.parser')
        
        # Look for the download link specifically in the `href` that matches the download pattern
        download_tag = soup.find('a', href=re.compile(r'^/dl-files\.php\?p='))
        if download_tag:
            # Build the full download URL by appending the site domain to the relative URL
            download_url = "https://free3d.com" + download_tag['href']
            return download_url
        
        logger.info(f"No download link found for {model_url}")
        return None

async def save_model_to_db(model_data):
    async with AsyncSessionLocal() as session:
        existing_model = await session.execute(select(ScrapedModel).where(ScrapedModel.name == model_data['name']))
        if existing_model.scalar() is None:
            new_model = ScrapedModel(**model_data)
            session.add(new_model)
            await session.commit()
            logger.info(f"Model '{model_data['name']}' saved to database.")
            return True  # Indicate the model was saved
        else:
            logger.info(f"Model '{model_data['name']}' already exists in database.")
            return False  # Indicate the model was not saved
