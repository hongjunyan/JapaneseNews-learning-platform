# Japanese News Learning Platform

A platform for taking notes on Japanese news articles with automatic furigana annotation.

## Features

- Create and manage multiple news articles
- Add text blocks for Japanese sentences and Chinese notes
- Format text with different styles, sizes, colors, etc.
- Automatically adds furigana to Japanese kanji characters
- Beautiful and intuitive user interface

## Tech Stack

- **Backend**: FastAPI, SQLite database
- **Frontend**: React, Material UI
- **Containerization**: Docker, Docker Compose
- **Japanese Processing**: Fugashi, unidic-lite

## Project Structure

```
.
├── backend/             # FastAPI application
│   ├── Dockerfile
│   ├── database.py      # SQLAlchemy models
│   ├── furigana.py      # Japanese text processing
│   ├── main.py          # API endpoints
│   └── requirements.txt
├── frontend/            # React application
│   ├── Dockerfile
│   ├── public/
│   └── src/
│       ├── components/  # Reusable UI components
│       ├── pages/       # Page components
│       └── services/    # API services
├── nginx/               # Nginx configuration
│   └── nginx.conf
├── docker-compose.yml   # Docker Compose configuration
└── README.md            # This file
```

## Getting Started

### Prerequisites

- Docker and Docker Compose

### Running the Application

1. Clone the repository
2. Start the application:

```bash
docker compose -f ./docker-compose.prod.yml up -d
```

3. Open your browser and navigate to `http://localhost`

## Usage

1. Create a new news article by clicking the "新しいニュース" button
2. Add notes to the article with Japanese text and Chinese notes
3. Format the text as needed using the formatting toolbar
4. View the article with automatic furigana annotations

## Development

To run the application in development mode:

```bash
# Backend
cd backend
pip install -r requirements.txt
uvicorn main:app --reload

# Frontend
cd frontend
npm install
npm start
```

## License

This project is open source and available under the MIT License. 