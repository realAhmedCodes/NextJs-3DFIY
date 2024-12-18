#app.py
'''
import torch
import clip
from PIL import Image
from fastapi import FastAPI, UploadFile, File, Query, HTTPException
import io
import numpy as np
from pinecone import Pinecone, ServerlessSpec
from pinecone.core.openapi.shared.exceptions import PineconeApiException
import os
from dotenv import load_dotenv
import logging
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

app = FastAPI()

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Update to your frontend's origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load CLIP model
device = "cuda" if torch.cuda.is_available() else "cpu"
logger.info(f"Using device: {device}")
model, preprocess = clip.load("ViT-B/32", device=device)
logger.info("CLIP model loaded successfully.")

# Initialize Pinecone using the Pinecone class
pinecone_api_key = os.getenv("PINECONE_API_KEY", "your_pinecone_api_key")
pinecone_env = os.getenv("PINECONE_ENVIRONMENT", "your_pinecone_environment")
index_name = os.getenv("PINECONE_INDEX_NAME", "model-images")

if not pinecone_api_key or not pinecone_env or not index_name:
    logger.error("Pinecone API key, environment, or index name not set.")
    raise ValueError("Pinecone configuration is incomplete.")

# Instantiate the Pinecone client
try:
    pc = Pinecone(api_key=pinecone_api_key, environment=pinecone_env)
    logger.info("Pinecone client initialized.")
except Exception as e:
    logger.error(f"Error initializing Pinecone: {e}")
    raise HTTPException(status_code=500, detail="Failed to initialize Pinecone.")

# Check if the index exists and connect to it if already present
try:
    existing_indexes = pc.list_indexes()  # List all existing indexes
    logger.info(f"Existing indexes: {existing_indexes}")
    if index_name not in existing_indexes:
        logger.info(f"Index '{index_name}' not found. Creating a new index.")
        try:
            pc.create_index(
                name=index_name,
                dimension=512,  # CLIP ViT-B/32 has 512 dimensions
                metric="cosine",
                spec=ServerlessSpec(cloud="aws", region=pinecone_env)  # Correct cloud and region
            )
            logger.info(f"Index '{index_name}' created successfully.")
        except PineconeApiException as create_error:
            if create_error.status == 409:  # Handle conflict error gracefully
                logger.warning(f"Index '{index_name}' already exists. Skipping creation.")
            else:
                raise
    else:
        logger.info(f"Index '{index_name}' already exists. Skipping creation.")
except Exception as e:
    logger.error(f"Error while checking or creating index: {e}")
    raise HTTPException(status_code=500, detail=f"Pinecone index setup failed: {e}")

# Connect to the Pinecone index
try:
    index = pc.Index(index_name)
    logger.info(f"Pinecone index '{index_name}' is ready.")
except Exception as e:
    logger.error(f"Error connecting to Pinecone index '{index_name}': {e}")
    raise HTTPException(status_code=500, detail="Failed to connect to Pinecone index.")

# Define Pydantic Models
class MatchModel(BaseModel):
    id: str
    score: float
    values: List[float]

class SearchResponse(BaseModel):
    matches: List[MatchModel]

    class Config:
        extra = "ignore"  # This ensures that extra fields are ignored and not included in the response

# Define a default similarity threshold (cosine similarity)
DEFAULT_SIMILARITY_THRESHOLD = 0.8  # Adjust based on desired minimum similarity

@app.post("/index_image/")
async def index_image(
    model_id: int = Query(..., description="Unique identifier for the model"),
    file: UploadFile = File(...),
):
    """
    Endpoint to index a model's image into Pinecone.
    """
    try:
        logger.info(f"Received model_id: {model_id} and file: {file.filename}")

        # Read and preprocess the image
        image_bytes = await file.read()
        image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        image_input = preprocess(image).unsqueeze(0).to(device)
        logger.info(f"Image size after preprocessing: {image_input.size()}")

        # Encode the image using CLIP
        with torch.no_grad():
            embedding = model.encode_image(image_input).cpu().numpy().flatten()

            # Normalize the embedding
            norm = np.linalg.norm(embedding)
            if norm == 0:
                logger.error("Zero norm encountered in embedding. Cannot normalize.")
                raise ValueError("Zero norm encountered in embedding.")
            embedding = embedding / norm
            logger.info(f"Embedding norm after normalization (should be 1.0): {np.linalg.norm(embedding)}")

            embedding = embedding.tolist()

        # Index the image embedding in Pinecone
        upsert_response = index.upsert(vectors=[(str(model_id), embedding)])
        logger.info(f"Upsert response: {upsert_response}")

        logger.info(f"Successfully indexed model_id: {model_id}")
        return {"message": "Image indexed successfully", "model_id": model_id}
    except Exception as e:
        logger.error(f"Error indexing image: {e}")
        raise HTTPException(status_code=500, detail="Failed to index image")

@app.post("/search_image/", response_model=SearchResponse)
async def search_image(
    file: UploadFile = File(..., description="Image file for search"),
    top_k: int = Query(5, ge=1, le=100, description="Number of top matches to return"),
    threshold: float = Query(DEFAULT_SIMILARITY_THRESHOLD, ge=-1.0, le=1.0, description="Similarity threshold for matches"),
):
    """
    Endpoint to search for similar models based on an uploaded image.
    """
    try:
        logger.info(f"Received search image: {file.filename} with top_k={top_k} and threshold={threshold}")

        # Read and preprocess the image
        image_bytes = await file.read()
        image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        image_input = preprocess(image).unsqueeze(0).to(device)
        logger.info(f"Search image size after preprocessing: {image_input.size()}")

        # Encode the image using CLIP
        with torch.no_grad():
            embedding = model.encode_image(image_input).cpu().numpy().flatten()

            # Normalize the embedding
            norm = np.linalg.norm(embedding)
            if norm == 0:
                logger.error("Zero norm encountered in embedding. Cannot normalize.")
                raise ValueError("Zero norm encountered in embedding.")
            embedding = embedding / norm
            logger.info(f"Embedding norm after normalization (should be 1.0): {np.linalg.norm(embedding)}")

            embedding_list = embedding.tolist()

        # Query Pinecone for similar images
        query_response = index.query(vector=embedding_list, top_k=top_k, include_values=True)
        logger.info(f"Query response: {query_response}")

        # Extract and filter matches based on the similarity threshold (cosine similarity)
        formatted_matches = []
        for match in query_response.matches:
            logger.info(f"Match ID: {match.id}, Score: {match.score}, Threshold: {threshold}")

            # Since we're using cosine similarity, higher scores indicate higher similarity
            if match.score >= threshold:
                formatted_match = MatchModel(
                    id=match.id,
                    score=match.score,
                    values=match.values,
                )
                formatted_matches.append(formatted_match)
                logger.info(f"Match accepted: ID={match.id}, Score={match.score}")
            else:
                logger.info(f"Match rejected: ID={match.id}, Score={match.score}")

            # Manually compute cosine similarity
            stored_embedding = np.array(match.values)
            manual_similarity = float(np.dot(embedding, stored_embedding))
            logger.info(f"Manual cosine similarity with match ID {match.id}: {manual_similarity}")

        if not formatted_matches:
            logger.info("No matches found above the similarity threshold.")

        return SearchResponse(matches=formatted_matches)
    except Exception as e:
        logger.error(f"Error searching image: {e}")
        raise HTTPException(status_code=500, detail="Failed to search image")
'''