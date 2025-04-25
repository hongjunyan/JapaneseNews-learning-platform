from fastapi import FastAPI, HTTPException, Depends, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, Column, Integer, String, Text, or_, DateTime, desc, TypeDecorator
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
import os
from datetime import datetime
import json
import fugashi
import re
from pydantic import BaseModel

# Create a database directory if it doesn't exist
if not os.path.exists('data'):
    os.makedirs('data')

# SQLAlchemy setup
DATABASE_URL = "sqlite:///./data/jpnews.db"
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Custom DateTime type for SQLite
class SQLiteDateTime(TypeDecorator):
    impl = String

    def process_bind_param(self, value, dialect):
        if value is None:
            return None
        return value.isoformat()

    def process_result_value(self, value, dialect):
        if value is None:
            return None
        return datetime.fromisoformat(value)

# Define database model
class News(Base):
    __tablename__ = "news"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    content = Column(Text)
    youtube_url = Column(String, nullable=True)
    updated_at = Column(SQLiteDateTime, default=datetime.now, onupdate=datetime.now)

# Create the tables
Base.metadata.create_all(bind=engine)

# Dependency to get the database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Create FastAPI instance
app = FastAPI(title="Japanese News Notes API")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, you would want to restrict this
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Root endpoint
@app.get("/")
def read_root():
    return {"message": "Welcome to Japanese News Notes API"}

# Get all news endpoint
@app.get("/news")
def get_all_news(db: Session = Depends(get_db)):
    news = db.query(News).order_by(desc(News.updated_at)).all()
    return news

# Search news by keyword
@app.get("/news/search")
def search_news(keyword: str, db: Session = Depends(get_db)):
    if not keyword:
        return get_all_news(db=db)
    
    search_results = db.query(News).filter(
        or_(
            News.title.contains(keyword),
            News.content.contains(keyword)
        )
    ).order_by(desc(News.updated_at)).all()
    
    return search_results

# Get a specific news by ID
@app.get("/news/{news_id}")
def get_news(news_id: int, db: Session = Depends(get_db)):
    news = db.query(News).filter(News.id == news_id).first()
    if news is None:
        raise HTTPException(status_code=404, detail="News not found")
    return news

# Create a new news entry
@app.post("/news")
def create_news(title: str = Form(...), content: str = Form(...), youtube_url: str = Form(None), db: Session = Depends(get_db)):
    new_news = News(title=title, content=content, youtube_url=youtube_url, updated_at=datetime.now())
    db.add(new_news)
    db.commit()
    db.refresh(new_news)
    return new_news

# Update an existing news entry
@app.put("/news/{news_id}")
def update_news(news_id: int, title: str = Form(...), content: str = Form(...), youtube_url: str = Form(None), db: Session = Depends(get_db)):
    news = db.query(News).filter(News.id == news_id).first()
    if news is None:
        raise HTTPException(status_code=404, detail="News not found")
    
    news.title = title
    news.content = content
    news.youtube_url = youtube_url
    news.updated_at = datetime.now()
    db.commit()
    db.refresh(news)
    return news

# Delete a news entry
@app.delete("/news/{news_id}")
def delete_news(news_id: int, db: Session = Depends(get_db)):
    news = db.query(News).filter(News.id == news_id).first()
    if news is None:
        raise HTTPException(status_code=404, detail="News not found")
    
    db.delete(news)
    db.commit()
    return {"message": "News deleted successfully"}

# Function to convert katakana to hiragana
def katakana_to_hiragana(text):
    result = ""
    for char in text:
        # Check if the character is katakana
        if 0x30A0 <= ord(char) <= 0x30FF:
            # Convert to hiragana by shifting the Unicode code point
            result += chr(ord(char) - 0x60)
        else:
            # Keep non-katakana characters as-is
            result += char
    return result

# Add this Pydantic model for the furigana request
class FuriganaRequest(BaseModel):
    text: str

# Initialize the Japanese text analyzer
tagger = fugashi.Tagger()

# Add the furigana generation endpoint
@app.post("/furigana")
def generate_furigana(request: FuriganaRequest):
    text = request.text
    
    # Process the text with fugashi
    words = tagger(text)
    result = ""
    
    for word in words:
        # Skip punctuation and some parts of speech
        if word.surface in "「」、。？！…：　 ":
            result += word.surface
            continue
            
        # Get the reading if available
        if hasattr(word, 'feature') and word.feature.kana:
            # Check if the word contains kanji
            if any(0x4E00 <= ord(c) <= 0x9FFF for c in word.surface):
                # Convert katakana reading to hiragana for furigana
                hiragana_reading = katakana_to_hiragana(word.feature.kana)
                # Add furigana in the format [漢字]{ふりがな}
                result += f"[{word.surface}]{{{hiragana_reading}}}"
            else:
                # Just add the word without furigana
                result += word.surface
        else:
            # Fallback: just add the word without furigana
            result += word.surface
    
    return {"text": result} 