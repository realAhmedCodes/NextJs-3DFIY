#models.py

from sqlalchemy import Column, Integer, String, Float, DateTime, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.sql import func

Base = declarative_base()

class ScrapedModel(Base):
    __tablename__ = 'scraped_models'

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(String, nullable=False)
    file_path = Column(String, nullable=False, unique=True)
    image_url = Column(String, nullable=False)
    price = Column(Float, nullable=True)
    download_link = Column(String, nullable=True)
    specifications = Column(Text, nullable=True)  # New field for specifications
    formats = Column(Text, nullable=True)  # New field for formats & files
    tags = Column(Text, nullable=True)  # New field for tags
    created_at = Column(DateTime(timezone=True), server_default=func.now())
