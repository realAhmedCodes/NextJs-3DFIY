# services/data_preparation.py
# fastApiServer/services/data_preparation.py
# services/data_preparation.py
# services/data_preparation.py
# services/data_preparation.py

import pandas as pd
from database import db
import logging

# Initialize logger
logger = logging.getLogger(__name__)

async def fetch_interaction_data() -> pd.DataFrame:
    """
    Fetch interaction data by combining likes and purchases.
    Returns a pandas DataFrame.
    """
    query = """
    SELECT user_id, model_id, liked::int as liked, saved::int as saved
    FROM public."Likes"
    UNION
    SELECT user_id, model_id, 1 as liked, 0 as saved
    FROM public."model_purchase"
    """
    try:
        # Execute query and fetch data
        records = await db.fetch(query)
        logger.info(f"Fetched {len(records)} rows from interaction data.")
        
        # Convert records to pandas DataFrame
        df = pd.DataFrame([dict(record) for record in records])
        logger.info(f"Converted interaction records to DataFrame with shape: {df.shape}")
        
        return df
    except Exception as e:
        logger.error(f"Error fetching interaction data: {e}")
        raise

async def fetch_search_logs() -> pd.DataFrame:
    """
    Fetch search logs for Models, Designers, and Printers.
    Returns a pandas DataFrame with all search logs.
    """
    try:
        # Fetch ModelsSearchLog
        query_models = """
        SELECT user_id, tags, timestamp
        FROM public."ModelsSearchLog"
        """
        models_logs = await db.fetch(query_models)
        df_models = pd.DataFrame([dict(record) for record in models_logs])
        df_models['search_type'] = 'model'
        logger.info(f"Fetched {len(df_models)} Model search logs.")
        
        # Fetch DesignersSearchLog
        query_designers = """
        SELECT user_id, location, timestamp
        FROM public."DesignersSearchLog"
        """
        designers_logs = await db.fetch(query_designers)
        df_designers = pd.DataFrame([dict(record) for record in designers_logs])
        df_designers['search_type'] = 'designer'
        logger.info(f"Fetched {len(df_designers)} Designer search logs.")
        
        # Fetch PrintersSearchLog
        query_printers = """
        SELECT user_id, location, materials, timestamp
        FROM public."PrintersSearchLog"
        """
        printers_logs = await db.fetch(query_printers)
        df_printers = pd.DataFrame([dict(record) for record in printers_logs])
        df_printers['search_type'] = 'printer'
        logger.info(f"Fetched {len(df_printers)} Printer search logs.")
        
        # Combine all search logs
        df_search_logs = pd.concat([df_models, df_designers, df_printers], ignore_index=True)
        logger.info(f"Combined search logs into DataFrame with shape: {df_search_logs.shape}")
        
        return df_search_logs
    except Exception as e:
        logger.error(f"Error fetching search logs: {e}")
        raise
