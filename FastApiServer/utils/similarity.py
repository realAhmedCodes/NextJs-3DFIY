# utils/similarity.py
# fastApiServer/utils/similarity.py

# utils/similarity.py
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
import pandas as pd

def calculate_cosine_similarity(matrix: pd.DataFrame) -> np.ndarray:
    """
    Calculate cosine similarity between users.
    Returns a similarity matrix.
    """
    return cosine_similarity(matrix)
