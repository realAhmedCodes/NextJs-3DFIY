# database.py
'''
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
'''

# database.py
'''
import os
from dotenv import load_dotenv
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker

# Load environment variables from .env file
load_dotenv()

# Fetch the DATABASE_URL from the environment variables
DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    raise ValueError("DATABASE_URL not set in environment variables.")

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
    from routers.scraping import Base  # Import Base from scraping.py
    async with engine.begin() as conn:
        # Create all tables
        await conn.run_sync(Base.metadata.create_all)
'''
# database.py
# fastApiServer/database.py
# database.py
# database.py
import asyncpg
import os
from dotenv import load_dotenv
import logging

load_dotenv()  # Load environment variables from .env file

DATABASE_URL = os.getenv("DATABASE_URL")

# Initialize logger
logger = logging.getLogger(__name__)

class Database:
    def __init__(self):
        self.pool = None

    async def init_db(self):
        """Initialize the connection pool."""
        if not self.pool:
            try:
                self.pool = await asyncpg.create_pool(
                    dsn=DATABASE_URL, 
                    min_size=10, 
                    max_size=100
                )
                logger.info(f"Database connection pool created with DSN: {DATABASE_URL}")
            except Exception as e:
                logger.error(f"Failed to create database connection pool: {e}")
                raise

    async def close_db(self):
        """Close the connection pool."""
        if self.pool:
            try:
                await self.pool.close()
                logger.info("Database connection pool closed.")
            except Exception as e:
                logger.error(f"Error closing database connection pool: {e}")
                raise

    async def fetch(self, query: str, *args):
        """Execute a fetch query."""
        async with self.pool.acquire() as connection:
            try:
                logger.debug(f"Executing fetch query: {query} with args: {args}")
                result = await connection.fetch(query, *args)
                logger.debug(f"Fetched {len(result)} rows.")
                return result
            except Exception as e:
                logger.error(f"Error executing fetch query: {e}")
                raise

    async def fetchrow(self, query: str, *args):
        """Execute a fetchrow query."""
        async with self.pool.acquire() as connection:
            try:
                logger.debug(f"Executing fetchrow query: {query} with args: {args}")
                result = await connection.fetchrow(query, *args)
                logger.debug(f"Fetched row: {result}")
                return result
            except Exception as e:
                logger.error(f"Error executing fetchrow query: {e}")
                raise

    async def execute(self, query: str, *args):
        """Execute a non-fetch query."""
        async with self.pool.acquire() as connection:
            try:
                logger.debug(f"Executing execute query: {query} with args: {args}")
                result = await connection.execute(query, *args)
                logger.debug(f"Query result: {result}")
                return result
            except Exception as e:
                logger.error(f"Error executing execute query: {e}")
                raise

# Create a global Database instance
db = Database()

# Dependency to access the database
async def get_db():
    if not db.pool:
        await db.init_db()
    return db
