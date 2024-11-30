# services/recommendation_engine.py
# fastApiServer/services/recommendation_engine.py
# services/recommendation_engine.py

import pandas as pd
from services.data_preparation import fetch_interaction_data, fetch_search_logs
from utils.similarity import calculate_cosine_similarity
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import linear_kernel
from typing import List, Dict
import pickle
from database import db
import os
import logging

# Initialize logger
logger = logging.getLogger(__name__)

MODEL_DIR = 'models'
CF_MODEL_PATH = os.path.join(MODEL_DIR, 'cf_model.pkl')
CBF_MODEL_PATH = os.path.join(MODEL_DIR, 'cbf_model.pkl')
DESIGNER_RECOMMENDATION_PATH = os.path.join(MODEL_DIR, 'designer_recommendation.pkl')
PRINTER_RECOMMENDATION_PATH = os.path.join(MODEL_DIR, 'printer_recommendation.pkl')

# Ensure the models directory exists
if not os.path.exists(MODEL_DIR):
    os.makedirs(MODEL_DIR)
    logger.info(f"Created models directory at {MODEL_DIR}")

# --- Training Functions ---

async def train_collaborative_filtering():
    """
    Train the Collaborative Filtering model using user interactions.
    Saves the trained model to disk.
    """
    logger.info("Starting training of Collaborative Filtering model...")
    interaction_df = await fetch_interaction_data()

    if interaction_df.empty:
        logger.warning("No interaction data available for training CF model.")
        return

    # Create user-item matrix
    user_item_matrix = interaction_df.pivot_table(
        index='user_id',
        columns='model_id',
        values='liked',
        fill_value=0
    )
    logger.debug(f"User-Item Matrix shape: {user_item_matrix.shape}")

    # Calculate cosine similarity between users
    user_similarity = calculate_cosine_similarity(user_item_matrix)
    logger.debug("Calculated user similarity matrix.")

    # Save the similarity matrix and user list
    with open(CF_MODEL_PATH, 'wb') as f:
        pickle.dump({
            'user_similarity': user_similarity,
            'users': user_item_matrix.index.tolist(),
            'models': user_item_matrix.columns.tolist()
        }, f)
    logger.info("Collaborative Filtering model trained and saved.")

async def train_content_based():
    """
    Train the Content-Based Filtering model using model attributes.
    Saves the trained model to disk.
    """
    logger.info("Starting training of Content-Based Filtering model...")
    # Fetch all models
    query = """
    SELECT model_id, name, description, tags
    FROM "Models"
    """
    models_records = await db.fetch(query)
    if not models_records:
        logger.warning("No model data available for training CBF model.")
        return

    df = pd.DataFrame([dict(record) for record in models_records])
    logger.debug(f"Fetched {len(df)} models for CBF training.")

    # Combine tags and description
    df['content'] = df.apply(lambda row: ' '.join(row['tags']) + ' ' + row['description'], axis=1)
    logger.debug("Combined tags and description into 'content' field.")

    # Initialize TF-IDF Vectorizer
    tfidf = TfidfVectorizer(stop_words='english')
    tfidf_matrix = tfidf.fit_transform(df['content'])
    logger.debug("TF-IDF vectorization completed.")

    # Compute cosine similarity matrix
    cosine_sim = linear_kernel(tfidf_matrix, tfidf_matrix)
    logger.debug("Computed cosine similarity matrix for CBF.")

    # Save the TF-IDF vectorizer and similarity matrix
    with open(CBF_MODEL_PATH, 'wb') as f:
        pickle.dump({
            'tfidf': tfidf,
            'cosine_sim': cosine_sim,
            'model_ids': df['model_id'].tolist()
        }, f)
    logger.info("Content-Based Filtering model trained and saved.")

async def train_designer_recommendation():
    """
    Train the Designer Recommendation model using search logs.
    Saves the trained model to disk.
    """
    logger.info("Starting training of Designer Recommendation model...")
    search_logs = await fetch_search_logs()

    if search_logs.empty:
        logger.warning("No search log data available for training Designer Recommendation model.")
        return

    # Filter Designer search logs
    designer_logs = search_logs[search_logs['search_type'] == 'designer']

    if designer_logs.empty:
        logger.warning("No Designer search logs available.")
        return

    # Create a DataFrame with user_id and location
    df = designer_logs[['user_id', 'location']]
    logger.debug(f"Designer Recommendation DataFrame shape: {df.shape}")

    # Vectorize locations using TF-IDF
    tfidf = TfidfVectorizer(stop_words='english')
    tfidf_matrix = tfidf.fit_transform(df['location'])
    logger.debug("TF-IDF vectorization for Designer locations completed.")

    # Compute cosine similarity between users based on location
    user_similarity = calculate_cosine_similarity(pd.DataFrame(tfidf_matrix.toarray()))
    logger.debug("Computed user similarity matrix for Designer recommendations.")

    # Save the similarity matrix and user list
    with open(DESIGNER_RECOMMENDATION_PATH, 'wb') as f:
        pickle.dump({
            'user_similarity': user_similarity,
            'users': df['user_id'].tolist(),
            'locations': df['location'].tolist(),
            'tfidf': tfidf
        }, f)
    logger.info("Designer Recommendation model trained and saved.")

async def train_printer_recommendation():
    """
    Train the Printer Recommendation model using search logs.
    Saves the trained model to disk.
    """
    logger.info("Starting training of Printer Recommendation model...")
    search_logs = await fetch_search_logs()

    if search_logs.empty:
        logger.warning("No search log data available for training Printer Recommendation model.")
        return

    # Filter Printer search logs
    printer_logs = search_logs[search_logs['search_type'] == 'printer']

    if printer_logs.empty:
        logger.warning("No Printer search logs available.")
        return

    # Combine location and materials
    printer_logs['content'] = printer_logs.apply(
        lambda row: f"{row['location']} " + ' '.join(row['materials']),
        axis=1
    )

    # Vectorize combined content using TF-IDF
    tfidf = TfidfVectorizer(stop_words='english')
    tfidf_matrix = tfidf.fit_transform(printer_logs['content'])
    logger.debug("TF-IDF vectorization for Printer content completed.")

    # Compute cosine similarity matrix
    cosine_sim = linear_kernel(tfidf_matrix, tfidf_matrix)
    logger.debug("Computed cosine similarity matrix for Printer recommendations.")

    # Save the similarity matrix and user list
    with open(PRINTER_RECOMMENDATION_PATH, 'wb') as f:
        pickle.dump({
            'cosine_sim': cosine_sim,
            'users': printer_logs['user_id'].tolist(),
            'printer_ids': printer_logs['printer_owner_id'].tolist(),
            'tfidf': tfidf
        }, f)
    logger.info("Printer Recommendation model trained and saved.")

# --- Recommendation Functions ---

async def get_model_recommendations(user_id: int, db_instance) -> List[int]:
    """
    Generate model recommendations for a user.
    Combines Collaborative Filtering and Content-Based Filtering.
    """
    logger.info(f"Generating model recommendations for user_id: {user_id}")

    # Load CF model
    if os.path.exists(CF_MODEL_PATH):
        with open(CF_MODEL_PATH, 'rb') as f:
            cf_model = pickle.load(f)
        logger.debug("Loaded Collaborative Filtering model.")
    else:
        logger.info("Collaborative Filtering model not found. Training...")
        await train_collaborative_filtering()
        with open(CF_MODEL_PATH, 'rb') as f:
            cf_model = pickle.load(f)
        logger.debug("Loaded Collaborative Filtering model after training.")

    # Load CBF model
    if os.path.exists(CBF_MODEL_PATH):
        with open(CBF_MODEL_PATH, 'rb') as f:
            cbf_model = pickle.load(f)
        logger.debug("Loaded Content-Based Filtering model.")
    else:
        logger.info("Content-Based Filtering model not found. Training...")
        await train_content_based()
        with open(CBF_MODEL_PATH, 'rb') as f:
            cbf_model = pickle.load(f)
        logger.debug("Loaded Content-Based Filtering model after training.")

    # Collaborative Filtering Recommendations
    try:
        user_idx = cf_model['users'].index(user_id)
        similar_users = cf_model['user_similarity'][user_idx]
        similar_users_sorted = sorted(
            range(len(similar_users)),
            key=lambda i: similar_users[i],
            reverse=True
        )
        logger.debug("Identified similar users based on CF.")

        recommended_models_cf = []
        for idx in similar_users_sorted:
            similar_user_id = cf_model['users'][idx]
            if similar_user_id == user_id:
                continue
            # Fetch models liked by similar_user_id
            query = """
            SELECT model_id
            FROM "Likes"
            WHERE user_id = $1 AND liked = TRUE
            """
            likes = await db_instance.fetch(query, similar_user_id)
            liked_model_ids = [record['model_id'] for record in likes]
            recommended_models_cf.extend(liked_model_ids)
            if len(recommended_models_cf) >= 10:
                break
        recommended_models_cf = recommended_models_cf[:10]
        logger.debug(f"Collaborative Filtering recommended models: {recommended_models_cf}")
    except ValueError:
        # User not found in CF model
        logger.warning(f"User_id {user_id} not found in Collaborative Filtering model.")
        recommended_models_cf = []

    # Content-Based Filtering Recommendations
    # Fetch models liked by the user
    query = """
    SELECT model_id
    FROM "Likes"
    WHERE user_id = $1 AND liked = TRUE
    """
    likes = await db_instance.fetch(query, user_id)
    liked_model_ids = [record['model_id'] for record in likes]
    logger.debug(f"User {user_id} has liked models: {liked_model_ids}")

    if liked_model_ids:
        # Use the first liked model to find similar models
        target_model_id = liked_model_ids[0]
        if target_model_id in cbf_model['model_ids']:
            idx = cbf_model['model_ids'].index(target_model_id)
            sim_scores = list(enumerate(cbf_model['cosine_sim'][idx]))
            sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)
            sim_scores = sim_scores[1:11]  # Exclude the first one as it is the model itself
            recommended_models_cbf = [cbf_model['model_ids'][i[0]] for i in sim_scores]
            logger.debug(f"Content-Based Filtering recommended models: {recommended_models_cbf}")
        else:
            logger.warning(f"Target model_id {target_model_id} not found in CBF model.")
            recommended_models_cbf = []
    else:
        # Fallback: Recommend popular models
        query = """
        SELECT model_id, COUNT(*) as purchase_count
        FROM "model_purchase"
        GROUP BY model_id
        ORDER BY purchase_count DESC
        LIMIT 10
        """
        popular_models = await db_instance.fetch(query)
        recommended_models_cbf = [record['model_id'] for record in popular_models]
        logger.debug(f"Fallback recommended popular models: {recommended_models_cbf}")

    # Combine CF and CBF recommendations with weights
    combined_scores = {}
    weight_cf = 0.7
    weight_cbf = 0.3

    for model_id in recommended_models_cf:
        combined_scores[model_id] = combined_scores.get(model_id, 0) + weight_cf

    for model_id in recommended_models_cbf:
        combined_scores[model_id] = combined_scores.get(model_id, 0) + weight_cbf

    # Sort models based on combined scores
    sorted_models = sorted(combined_scores.items(), key=lambda x: x[1], reverse=True)
    logger.debug(f"Combined and sorted models: {sorted_models}")

    # Extract top 10 unique model_ids
    top_recommendations_models = []
    seen = set()
    for model_id, _ in sorted_models:
        if model_id not in seen:
            top_recommendations_models.append(model_id)
            seen.add(model_id)
        if len(top_recommendations_models) >= 10:
            break
    logger.info(f"Top model recommendations for user_id {user_id}: {top_recommendations_models}")

    return top_recommendations_models

async def get_designer_recommendations(user_id: int, db_instance) -> List[int]:
    """
    Generate designer recommendations for a user based on search logs.
    """
    logger.info(f"Generating designer recommendations for user_id: {user_id}")

    # Load Designer Recommendation model
    if os.path.exists(DESIGNER_RECOMMENDATION_PATH):
        with open(DESIGNER_RECOMMENDATION_PATH, 'rb') as f:
            designer_model = pickle.load(f)
        logger.debug("Loaded Designer Recommendation model.")
    else:
        logger.info("Designer Recommendation model not found. Training...")
        await train_designer_recommendation()
        if os.path.exists(DESIGNER_RECOMMENDATION_PATH):
            with open(DESIGNER_RECOMMENDATION_PATH, 'rb') as f:
                designer_model = pickle.load(f)
            logger.debug("Loaded Designer Recommendation model after training.")
        else:
            designer_model = None

    if not designer_model:
        logger.warning("Designer Recommendation model is not available.")
        return []

    try:
        user_idx = designer_model['users'].index(user_id)
        similar_users = designer_model['user_similarity'][user_idx]
        similar_users_sorted = sorted(
            range(len(similar_users)),
            key=lambda i: similar_users[i],
            reverse=True
        )
        logger.debug("Identified similar users based on Designer search logs.")

        recommended_designers = []
        for idx in similar_users_sorted:
            similar_user_id = designer_model['users'][idx]
            if similar_user_id == user_id:
                continue
            # Fetch designers interacted with by similar_user_id
            query = """
            SELECT DISTINCT d.designer_id
            FROM "Designers" d
            JOIN "Likes" l ON d.designer_id = l.model_id
            WHERE l.user_id = $1 AND l.liked = TRUE
            """
            designers = await db_instance.fetch(query, similar_user_id)
            designer_ids = [record['designer_id'] for record in designers]
            recommended_designers.extend(designer_ids)
            if len(recommended_designers) >= 10:
                break
        recommended_designers = list(set(recommended_designers))[:10]
        logger.debug(f"Designer Recommendation: {recommended_designers}")
        return recommended_designers
    except ValueError:
        # User not found in Designer Recommendation model
        logger.warning(f"User_id {user_id} not found in Designer Recommendation model.")
        return []

async def get_printer_recommendations(user_id: int, db_instance) -> List[int]:
    """
    Generate printer recommendations for a user based on search logs.
    """
    logger.info(f"Generating printer recommendations for user_id: {user_id}")

    # Load Printer Recommendation model
    if os.path.exists(PRINTER_RECOMMENDATION_PATH):
        with open(PRINTER_RECOMMENDATION_PATH, 'rb') as f:
            printer_model = pickle.load(f)
        logger.debug("Loaded Printer Recommendation model.")
    else:
        logger.info("Printer Recommendation model not found. Training...")
        await train_printer_recommendation()
        if os.path.exists(PRINTER_RECOMMENDATION_PATH):
            with open(PRINTER_RECOMMENDATION_PATH, 'rb') as f:
                printer_model = pickle.load(f)
            logger.debug("Loaded Printer Recommendation model after training.")
        else:
            printer_model = None

    if not printer_model:
        logger.warning("Printer Recommendation model is not available.")
        return []

    try:
        # Fetch user's printer search logs
        query = """
        SELECT location, materials
        FROM "PrintersSearchLog"
        WHERE user_id = $1
        """
        printer_searches = await db_instance.fetch(query, user_id)
        if not printer_searches:
            logger.info(f"No printer search logs found for user_id {user_id}.")
            # Fallback: Recommend popular printers
            query_popular = """
            SELECT printer_id, COUNT(*) as interaction_count
            FROM "printer_orders"
            GROUP BY printer_id
            ORDER BY interaction_count DESC
            LIMIT 10
            """
            popular_printers = await db_instance.fetch(query_popular)
            recommended_printers = [record['printer_id'] for record in popular_printers]
            logger.debug(f"Fallback recommended popular printers: {recommended_printers}")
            return recommended_printers

        user_search_content = ' '.join(
            [f"{record['location']} " + ' '.join(record['materials']) for record in printer_searches]
        )
        tfidf = printer_model['tfidf']
        user_vector = tfidf.transform([user_search_content])
        sim_scores = linear_kernel(user_vector, printer_model['cosine_sim']).flatten()
        similar_indices = sim_scores.argsort()[-10:][::-1]
        recommended_printers = [printer_model['printer_ids'][i] for i in similar_indices]
        logger.debug(f"Printer Recommendation based on search logs: {recommended_printers}")
        return recommended_printers
    except Exception as e:
        logger.error(f"Error in Printer Recommendation: {e}")
        return []
