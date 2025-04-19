from fastapi import FastAPI, Depends, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Optional
import json
from datetime import datetime

from database import get_db, News, Note, engine, Base
from furigana import get_furigana_for_text, format_furigana_html
from pydantic import BaseModel


# Initialize database
Base.metadata.create_all(bind=engine)

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Pydantic models for request and response
class NoteCreate(BaseModel):
    japanese_text: str
    chinese_notes: str
    text_style: Optional[str] = "{}"
    order: int


class NoteResponse(BaseModel):
    id: int
    japanese_text: str
    chinese_notes: str
    text_style: str
    order: int
    news_id: int

    class Config:
        from_attributes = True


class NewsCreate(BaseModel):
    title: str


class NewsResponse(BaseModel):
    id: int
    title: str
    created_at: str
    notes: List[NoteResponse] = []

    class Config:
        from_attributes = True


# API Endpoints
@app.get("/")
def read_root():
    return {"message": "Japanese News Learning Platform API"}


@app.post("/news", response_model=NewsResponse)
def create_news(news: NewsCreate, db: Session = Depends(get_db)):
    db_news = News(
        title=news.title,
        created_at=datetime.now().isoformat()
    )
    db.add(db_news)
    db.commit()
    db.refresh(db_news)
    return db_news


@app.get("/news", response_model=List[NewsResponse])
def get_all_news(db: Session = Depends(get_db)):
    return db.query(News).all()


@app.get("/news/{news_id}", response_model=NewsResponse)
def get_news(news_id: int, db: Session = Depends(get_db)):
    db_news = db.query(News).filter(News.id == news_id).first()
    if db_news is None:
        raise HTTPException(status_code=404, detail="News not found")
    return db_news


@app.delete("/news/{news_id}")
def delete_news(news_id: int, db: Session = Depends(get_db)):
    db_news = db.query(News).filter(News.id == news_id).first()
    if db_news is None:
        raise HTTPException(status_code=404, detail="News not found")
    db.delete(db_news)
    db.commit()
    return {"message": "News deleted successfully"}


@app.post("/news/{news_id}/notes", response_model=NoteResponse)
def create_note(
    news_id: int, note: NoteCreate, db: Session = Depends(get_db)
):
    db_news = db.query(News).filter(News.id == news_id).first()
    if db_news is None:
        raise HTTPException(status_code=404, detail="News not found")
    
    db_note = Note(
        japanese_text=note.japanese_text,
        chinese_notes=note.chinese_notes,
        text_style=note.text_style,
        order=note.order,
        news_id=news_id
    )
    db.add(db_note)
    db.commit()
    db.refresh(db_note)
    return db_note


@app.put("/notes/{note_id}", response_model=NoteResponse)
def update_note(
    note_id: int, note: NoteCreate, db: Session = Depends(get_db)
):
    db_note = db.query(Note).filter(Note.id == note_id).first()
    if db_note is None:
        raise HTTPException(status_code=404, detail="Note not found")
    
    db_note.japanese_text = note.japanese_text
    db_note.chinese_notes = note.chinese_notes
    db_note.text_style = note.text_style
    db_note.order = note.order
    
    db.commit()
    db.refresh(db_note)
    return db_note


@app.delete("/notes/{note_id}")
def delete_note(note_id: int, db: Session = Depends(get_db)):
    db_note = db.query(Note).filter(Note.id == note_id).first()
    if db_note is None:
        raise HTTPException(status_code=404, detail="Note not found")
    db.delete(db_note)
    db.commit()
    return {"message": "Note deleted successfully"}


@app.post("/furigana")
def get_furigana(text: str = Body(..., embed=True)):
    """
    Process Japanese text and return it with furigana information.
    """
    print(f"Received request for furigana with text: {text}")
    
    if not text:
        print("Empty text received, returning empty response")
        return {"text": "", "html": ""}
    
    print(f"Processing text with furigana: {text}")
    furigana_data = get_furigana_for_text(text)
    print(f"Furigana data: {furigana_data}")
    
    html_with_furigana = format_furigana_html(text)
    print(f"HTML with furigana: {html_with_furigana}")
    
    result = {
        "text": text,
        "furigana_data": furigana_data,
        "html": html_with_furigana
    }
    print(f"Returning result: {result}")
    return result 