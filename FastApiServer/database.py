# database.py

import os
from dotenv import load_dotenv
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker

# Load environment variables from .env file
load_dotenv()

# Fetch the DATABASE_URL from the environment variables
DATABASE_URL = os.getenv("DATABASE_URL")
print(f"DATABASE_URL from .env: {DATABASE_URL}")  # Print the value to confirm it's loaded

# Create the async engine using DATABASE_URL
engine = create_async_engine(DATABASE_URL, echo=True)

# Define the session factory
AsyncSessionLocal = sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False
)

# Initialize the database
async def init_db():
    import models  # Import models to ensure they are registered
    async with engine.begin() as conn:
        # Create all tables
        await conn.run_sync(models.Base.metadata.create_all)
