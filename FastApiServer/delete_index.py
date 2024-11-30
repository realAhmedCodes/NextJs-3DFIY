#delete_index.py
'''
import os
from pinecone import Pinecone, ServerlessSpec
from dotenv import load_dotenv
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

# Initialize Pinecone client
pinecone_api_key = os.getenv("PINECONE_API_KEY", "your_pinecone_api_key")
pinecone_env = os.getenv("PINECONE_ENVIRONMENT", "your_pinecone_environment")
index_name = os.getenv("PINECONE_INDEX_NAME", "model-images")

if not pinecone_api_key or not pinecone_env or not index_name:
    logger.error("Pinecone API key, environment, or index name not set.")
    raise ValueError("Pinecone configuration is incomplete.")

try:
    # Create an instance of Pinecone
    pc = Pinecone(api_key=pinecone_api_key, environment=pinecone_env)
    logger.info("Pinecone client initialized.")
except Exception as e:
    logger.error(f"Error initializing Pinecone: {e}")
    raise e

# Disable deletion protection
try:
    logger.info("Disabling deletion protection...")
    pc.configure_index(
        name=index_name,
        deletion_protection="disabled"
    )
    logger.info(f"Deletion protection disabled for index '{index_name}'.")
except Exception as e:
    logger.error(f"Error disabling deletion protection for index '{index_name}': {e}")
    raise e

# Delete the index
try:
    logger.info("Deleting the index...")
    pc.delete_index(index_name)
    logger.info(f"Index '{index_name}' deleted successfully.")
except Exception as e:
    logger.error(f"Error deleting index '{index_name}': {e}")
    raise e
'''