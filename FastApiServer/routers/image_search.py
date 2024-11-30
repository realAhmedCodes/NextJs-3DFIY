# image_search.py
# routers/image_search.py
'''
import os
import io
import logging
from typing import List

import torch
import clip
import numpy as np
from PIL import Image
from fastapi import APIRouter, UploadFile, File, Query, HTTPException
from pydantic import BaseModel
from dotenv import load_dotenv

from pinecone import Pinecone, ServerlessSpec
from pinecone.core.openapi.shared.exceptions import PineconeApiException

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

# Initialize Router
router = APIRouter()

# Load CLIP model
device = "cuda" if torch.cuda.is_available() else "cpu"
logger.info(f"Using device: {device}")
model, preprocess = clip.load("ViT-B/32", device=device)
logger.info("CLIP model loaded successfully.")

# Initialize Pinecone
pinecone_api_key = os.getenv("PINECONE_API_KEY", "your_pinecone_api_key")
pinecone_env = os.getenv("PINECONE_ENVIRONMENT", "your_pinecone_environment")
index_name = os.getenv("PINECONE_INDEX_NAME", "model-images")

if not pinecone_api_key or not pinecone_env or not index_name:
    logger.error("Pinecone API key, environment, or index name not set.")
    raise ValueError("Pinecone configuration is incomplete.")

try:
    pc = Pinecone(api_key=pinecone_api_key, environment=pinecone_env)
    logger.info("Pinecone client initialized.")
except Exception as e:
    logger.error(f"Error initializing Pinecone: {e}")
    raise HTTPException(status_code=500, detail="Failed to initialize Pinecone.")

# Check and create Pinecone index if necessary
try:
    existing_indexes = pc.list_indexes()
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
            if create_error.status == 409:  # Conflict error
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
        extra = "ignore"  # Ignore extra fields in the response

# Define a default similarity threshold
DEFAULT_SIMILARITY_THRESHOLD = 0.8  # Adjust as needed

@router.post("/index_image/")
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

@router.post("/search_image/", response_model=SearchResponse)
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

# routers/image_search.py
# routers/image_search.py
# routers/image_search.py
'''
import os
import io
import logging
import re  # Import re for regular expressions
from typing import List, Dict
import numpy as np
from PIL import Image
from fastapi import APIRouter, UploadFile, File, Query, HTTPException
from pydantic import BaseModel
from dotenv import load_dotenv

# Import PyTorch and torchvision
import torch
import torchvision.models as models
import torchvision.transforms as transforms

# Pinecone imports
from pinecone import Pinecone, ServerlessSpec

# Import imagehash for perceptual hashing
import imagehash

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

# Initialize Router
router = APIRouter()

# Device configuration
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
logger.info(f"Using device: {device}")

# Load MobileNetV2 model
model = models.mobilenet_v2(weights=models.MobileNet_V2_Weights.IMAGENET1K_V1)
model.classifier = torch.nn.Identity()  # Remove the classification layer
model = model.to(device)
model.eval()
logger.info("MobileNetV2 model loaded successfully.")

# Preprocessing pipeline
preprocess = transforms.Compose([
    transforms.Resize(256),
    transforms.CenterCrop(224),
    transforms.ToTensor(),
    transforms.Normalize(
        mean=[0.485, 0.456, 0.406],
        std=[0.229, 0.224, 0.225]
    ),
])

# Initialize Pinecone
pinecone_api_key = os.getenv("PINECONE_API_KEY", "your_pinecone_api_key")
pinecone_env = os.getenv("PINECONE_ENVIRONMENT", "your_pinecone_environment")
index_name = os.getenv("PINECONE_INDEX_NAME", "model-images")
pinecone_cloud = os.getenv("PINECONE_CLOUD", "aws")
pinecone_region = os.getenv("PINECONE_REGION", pinecone_env)

if not pinecone_api_key or not pinecone_env or not index_name:
    logger.error("Pinecone API key, environment, or index name not set.")
    raise ValueError("Pinecone configuration is incomplete.")

# Create an instance of the Pinecone client
pc = Pinecone(api_key=pinecone_api_key, environment=pinecone_env)
logger.info("Pinecone client initialized.")

# Check and create Pinecone index if necessary
if index_name not in [idx.name for idx in pc.list_indexes()]:
    logger.info(f"Index '{index_name}' not found. Creating a new index.")
    pc.create_index(
        name=index_name,
        dimension=1280,  # MobileNetV2 output dimension
        metric="cosine",
        spec=ServerlessSpec(
            cloud=pinecone_cloud,
            region=pinecone_region
        )
    )
    logger.info(f"Index '{index_name}' created successfully.")
else:
    logger.info(f"Index '{index_name}' already exists. Skipping creation.")

# Connect to the Pinecone index
index = pc.Index(index_name)
logger.info(f"Pinecone index '{index_name}' is ready.")

# Define Pydantic Models
class MatchModel(BaseModel):
    id: str  # The original ID from Pinecone
    model_id: int  # The numeric model ID
    model_type: str  # 'user' or 'scraped'
    score: float
    metadata: Dict[str, str] = None  # Include metadata for perceptual hash

class SearchResponse(BaseModel):
    matches: List[MatchModel]

    class Config:
        extra = "ignore"  # Ignore extra fields in the response

# Define a default similarity threshold
DEFAULT_SIMILARITY_THRESHOLD = 0.6  # Adjusted threshold

def generate_embedding(image: Image.Image) -> List[float]:
    image_input = preprocess(image).unsqueeze(0).to(device)
    with torch.no_grad():
        embedding = model(image_input).cpu().numpy().flatten()
        # Normalize the embedding
        norm = np.linalg.norm(embedding)
        if norm == 0:
            logger.error("Zero norm encountered in embedding. Cannot normalize.")
            raise ValueError("Zero norm encountered in embedding.")
        embedding = embedding / norm
        embedding = embedding.tolist()
    return embedding

def generate_image_hash(image: Image.Image) -> str:
    hash_value = imagehash.phash(image)
    return str(hash_value)

@router.post("/index_image/")
async def index_image(
    model_id: int = Query(..., description="Unique identifier for the model"),
    file: UploadFile = File(...),
    model_type: str = Query("user", description="Type of model: 'user' or 'scraped'"),
):
    """
    Endpoint to index a model's image into Pinecone.
    """
    try:
        logger.info(f"Received model_id: {model_id}, model_type: {model_type}, file: {file.filename}")

        # Read and preprocess the image
        image_bytes = await file.read()
        image = Image.open(io.BytesIO(image_bytes)).convert("RGB")

        # Generate embedding
        embedding = generate_embedding(image)

        # Generate image hash
        image_hash_value = generate_image_hash(image)

        # Construct Pinecone ID
        pinecone_id = f"{model_type}_{model_id}"

        # Index the image embedding in Pinecone with metadata
        metadata = {'hash': image_hash_value}

        index.upsert(vectors=[{
            'id': pinecone_id,
            'values': embedding,
            'metadata': metadata
        }])
        logger.info(f"Successfully indexed model_id: {model_id}")
        return {"message": "Image indexed successfully", "model_id": model_id}
    except Exception as e:
        logger.error(f"Error indexing image: {e}")
        raise HTTPException(status_code=500, detail="Failed to index image")

@router.post("/search_image/", response_model=SearchResponse)
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

        # Generate embedding and image hash
        embedding = generate_embedding(image)
        query_hash = generate_image_hash(image)

        # Query Pinecone for similar images
        query_response = index.query(vector=embedding, top_k=top_k, include_values=False, include_metadata=True)
        logger.info(f"Query response: {query_response}")

        # Extract and filter matches based on the similarity threshold and perceptual hash
        formatted_matches = []
        for match in query_response.matches:
            match_id = match.id  # e.g., 'user_32'
            match_score = match.score
            match_metadata = match.metadata or {}

            # Parse match_id to extract model_type and model_id
            match_id_pattern = r'^(?P<model_type>user|scraped)_(?P<model_id>\d+)$'
            match_id_match = re.match(match_id_pattern, match_id)
            if match_id_match:
                model_type = match_id_match.group('model_type')
                model_id = int(match_id_match.group('model_id'))
            else:
                logger.error(f"Invalid match ID format: {match_id}")
                continue  # Skip this match

            logger.info(f"Match ID: {match_id}, Model ID: {model_id}, Model Type: {model_type}, Score: {match_score}, Threshold: {threshold}")

            # Calculate Hamming distance between hashes
            stored_hash_str = match_metadata.get('hash')
            if stored_hash_str:
                stored_hash = imagehash.hex_to_hash(stored_hash_str)
                query_hash_obj = imagehash.hex_to_hash(query_hash)
                hamming_distance = query_hash_obj - stored_hash
                max_hash_bits = query_hash_obj.hash.size
                hamming_similarity = 1 - (hamming_distance / max_hash_bits)
            else:
                hamming_similarity = 0  # No hash available

            # Combine cosine similarity and hash similarity
            combined_score = 0.7 * match_score + 0.3 * hamming_similarity

            if combined_score >= threshold:
                formatted_match = MatchModel(
                    id=match_id,
                    model_id=model_id,
                    model_type=model_type,
                    score=combined_score,
                    metadata=match_metadata
                )
                formatted_matches.append(formatted_match)
                logger.info(f"Match accepted: ID={match_id}, Combined Score={combined_score}")
            else:
                logger.info(f"Match rejected: ID={match_id}, Combined Score={combined_score}")

        if not formatted_matches:
            logger.info("No matches found above the similarity threshold.")

        # Sort matches by combined score in descending order
        formatted_matches.sort(key=lambda x: x.score, reverse=True)

        return SearchResponse(matches=formatted_matches)
    except Exception as e:
        logger.error(f"Error searching image: {e}")
        raise HTTPException(status_code=500, detail="Failed to search image")
'''

# routers/image_search.py
# routers/image_search.py
# routers/image_search.py

# routers/image_search.py
# routers/image_search.py

import os
import io
import logging
import re
from typing import List, Dict
import numpy as np
from PIL import Image
from fastapi import APIRouter, UploadFile, File, Query, HTTPException
from pydantic import BaseModel
from dotenv import load_dotenv

# Import PyTorch and torchvision
import torch
import torchvision.models as models
import torchvision.transforms as transforms

# Import Pinecone classes
from pinecone import Pinecone, ServerlessSpec
from pinecone.core.openapi.shared.exceptions import PineconeApiException

# Import imagehash for perceptual hashing
import imagehash

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

# Initialize Router
router = APIRouter()

# Device configuration
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
logger.info(f"Using device: {device}")

# Load MobileNetV2 model
model = models.mobilenet_v2(weights=models.MobileNet_V2_Weights.IMAGENET1K_V1)
model.classifier = torch.nn.Identity()  # Remove the classification layer
model = model.to(device)
model.eval()
logger.info("MobileNetV2 model loaded successfully.")

# Preprocessing pipeline
preprocess = transforms.Compose([
    transforms.Resize(256),
    transforms.CenterCrop(224),
    transforms.ToTensor(),
    transforms.Normalize(
        mean=[0.485, 0.456, 0.406],
        std=[0.229, 0.224, 0.225]
    ),
])

# Initialize Pinecone
pinecone_api_key = os.getenv("PINECONE_API_KEY")
pinecone_env = os.getenv("PINECONE_ENVIRONMENT")
index_name = os.getenv("PINECONE_INDEX_NAME", "model-images")
pinecone_cloud = os.getenv("PINECONE_CLOUD", "aws")
pinecone_region = os.getenv("PINECONE_REGION", "us-east-1")  # Default to us-east-1 or your preferred region

if not pinecone_api_key or not pinecone_env or not index_name:
    logger.error("Pinecone API key, environment, or index name not set.")
    raise ValueError("Pinecone configuration is incomplete.")

# Create an instance of the Pinecone client
pc = Pinecone(api_key=pinecone_api_key, environment=pinecone_env)
logger.info("Pinecone client initialized.")

# Check and create Pinecone index if necessary
try:
    existing_indexes = pc.list_indexes()
    logger.debug(f"Existing Pinecone indexes: {existing_indexes}")
    if index_name not in existing_indexes:
        logger.info(f"Index '{index_name}' not found. Creating a new index.")
        pc.create_index(
            name=index_name,
            dimension=1280,  # MobileNetV2 output dimension
            metric="cosine",
            spec=ServerlessSpec(
                cloud=pinecone_cloud,
                region=pinecone_region
            )
        )
        logger.info(f"Index '{index_name}' created successfully.")
    else:
        logger.info(f"Index '{index_name}' already exists. Skipping creation.")
except PineconeApiException as e:
    if e.status == 409:
        logger.warning(f"Index '{index_name}' already exists (Conflict). Proceeding without creation.")
    else:
        logger.error(f"Error checking or creating index: {e}")
        raise HTTPException(status_code=500, detail="Failed to initialize Pinecone index")

# Connect to the Pinecone index
index = pc.Index(index_name)
logger.info(f"Pinecone index '{index_name}' is ready.")

# Define Pydantic Models
class MatchModel(BaseModel):
    id: str  # The original ID from Pinecone
    model_id: int  # The numeric model ID
    model_type: str  # 'user' or 'scraped'
    score: float
    metadata: Dict[str, str] = None  # Include metadata for perceptual hash

class SearchResponse(BaseModel):
    matches: List[MatchModel]

    class Config:
        extra = "ignore"  # Ignore extra fields in the response

# Define a default similarity threshold
DEFAULT_SIMILARITY_THRESHOLD = 0.6  # Adjusted threshold

def generate_embedding(image: Image.Image) -> List[float]:
    image_input = preprocess(image).unsqueeze(0).to(device)
    with torch.no_grad():
        embedding = model(image_input).cpu().numpy().flatten()
        # Normalize the embedding
        norm = np.linalg.norm(embedding)
        if norm == 0:
            logger.error("Zero norm encountered in embedding. Cannot normalize.")
            raise ValueError("Zero norm encountered in embedding.")
        embedding = embedding / norm
        embedding = embedding.tolist()
    return embedding

def generate_image_hash(image: Image.Image) -> str:
    hash_value = imagehash.phash(image)
    return str(hash_value)

@router.post("/index_image/")
async def index_image(
    model_id: int = Query(..., description="Unique identifier for the model"),
    file: UploadFile = File(...),
    model_type: str = Query("user", description="Type of model: 'user' or 'scraped'"),
):
    """
    Endpoint to index a model's image into Pinecone.
    """
    try:
        logger.info(f"Received model_id: {model_id}, model_type: {model_type}, file: {file.filename}")

        # Read and preprocess the image
        image_bytes = await file.read()
        image = Image.open(io.BytesIO(image_bytes)).convert("RGB")

        # Generate embedding
        embedding = generate_embedding(image)

        # Generate image hash
        image_hash_value = generate_image_hash(image)

        # Construct Pinecone ID
        pinecone_id = f"{model_type}_{model_id}"

        # Index the image embedding in Pinecone with metadata
        metadata = {'hash': image_hash_value}

        index.upsert(vectors=[{
            'id': pinecone_id,
            'values': embedding,
            'metadata': metadata
        }])
        logger.info(f"Successfully indexed model_id: {model_id}")
        return {"message": "Image indexed successfully", "model_id": model_id}
    except Exception as e:
        logger.error(f"Error indexing image: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail="Failed to index image")

@router.post("/search_image/", response_model=SearchResponse)
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

        # Generate embedding and image hash
        embedding = generate_embedding(image)
        query_hash = generate_image_hash(image)

        # Query Pinecone for similar images
        query_response = index.query(vector=embedding, top_k=top_k, include_values=False, include_metadata=True)
        logger.info(f"Query response: {query_response}")

        # Extract and filter matches based on the similarity threshold and perceptual hash
        formatted_matches = []
        for match in query_response.matches:
            match_id = match.id  # e.g., 'user_32'
            match_score = match.score
            match_metadata = match.metadata or {}

            # Parse match_id to extract model_type and model_id
            match_id_pattern = r'^(?P<model_type>user|scraped)_(?P<model_id>\d+)$'
            match_id_match = re.match(match_id_pattern, match_id)
            if match_id_match:
                model_type = match_id_match.group('model_type')
                model_id = int(match_id_match.group('model_id'))
            else:
                logger.error(f"Invalid match ID format: {match_id}")
                continue  # Skip this match

            logger.info(f"Match ID: {match_id}, Model ID: {model_id}, Model Type: {model_type}, Score: {match_score}, Threshold: {threshold}")

            # Calculate Hamming distance between hashes
            stored_hash_str = match_metadata.get('hash')
            if stored_hash_str:
                stored_hash = imagehash.hex_to_hash(stored_hash_str)
                query_hash_obj = imagehash.hex_to_hash(query_hash)
                hamming_distance = query_hash_obj - stored_hash
                max_hash_bits = query_hash_obj.hash.size
                hamming_similarity = 1 - (hamming_distance / max_hash_bits)
            else:
                hamming_similarity = 0  # No hash available

            # Combine cosine similarity and hash similarity
            combined_score = 0.7 * match_score + 0.3 * hamming_similarity

            if combined_score >= threshold:
                formatted_match = MatchModel(
                    id=match_id,
                    model_id=model_id,
                    model_type=model_type,
                    score=combined_score,
                    metadata=match_metadata
                )
                formatted_matches.append(formatted_match)
                logger.info(f"Match accepted: ID={match_id}, Combined Score={combined_score}")
            else:
                logger.info(f"Match rejected: ID={match_id}, Combined Score={combined_score}")

        if not formatted_matches:
            logger.info("No matches found above the similarity threshold.")

        # Sort matches by combined score in descending order
        formatted_matches.sort(key=lambda x: x.score, reverse=True)

        return SearchResponse(matches=formatted_matches)
    except Exception as e:
        logger.error(f"Error searching image: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail="Failed to search image")
