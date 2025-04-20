from sqlalchemy import create_engine, Column, Integer, String, Text, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship

SQLALCHEMY_DATABASE_URL = "sqlite:///./app.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


class News(Base):
    __tablename__ = "news"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    youtube_url = Column(String, nullable=True)  # Field for YouTube video URL
    created_at = Column(String)
    notes = relationship("Note", back_populates="news", cascade="all, delete-orphan")


class Note(Base):
    __tablename__ = "notes"

    id = Column(Integer, primary_key=True, index=True)
    japanese_text = Column(Text)
    chinese_notes = Column(Text)
    text_style = Column(Text)  # JSON string for styling (color, size, etc.)
    news_id = Column(Integer, ForeignKey("news.id"))
    order = Column(Integer)  # To maintain the order of notes

    news = relationship("News", back_populates="notes")


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close() 