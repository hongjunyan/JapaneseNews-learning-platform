# 日本新聞學習平台

一個用於記錄日本新聞文章筆記的平台，具有自動振假名標註功能。


## 進度追蹤

以下是已上傳的新聞筆記記錄：

| 日期 | 新聞 | 連結 |
|------|------|------|
| 2025-04-20 | 日経平均 一時3万1000円割れ トランプ関税で景気後退懸念 | [Link](https://www.youtube.com/watch?v=--Id7OU34Ek) |


## 開始使用

### 前置需求

- Docker 和 Docker Compose

### 運行應用程式

1. 使用 Git 複製專案：
   ```bash
   git clone https://github.com/your-username/japanese-news-learning-platform.git
   ```

2. 啟動應用程式：
   ```bash
   docker compose -f ./docker-compose.prod.yml up -d
   ```

3. 打開瀏覽器並輸入網址： `http://localhost`

4. 所有新聞都會儲存在 `./backend/app.db` 資料庫中


## 功能特點

- 建立和管理多個新聞文章
- 為日文句子和中文筆記新增文字區塊
- 支援不同樣式、大小、顏色等文字格式
- 自動為日文漢字添加振假名
- 美觀且直覺的使用者介面

## 技術架構

- **Backend**: FastAPI, SQLite database
- **Frontend**: React, Material UI
- **Containerization**: Docker, Docker Compose
- **Japanese Processing**: Fugashi, unidic-lite

## 專案結構

```
.
├── backend/             # FastAPI 應用程式
│   ├── Dockerfile
│   ├── database.py      # SQLAlchemy 模型
│   ├── furigana.py      # 日文文本處理
│   ├── main.py          # API 端點
│   └── requirements.txt
├── frontend/            # React 應用程式
│   ├── Dockerfile
│   ├── public/
│   └── src/
│       ├── components/  # 可重複使用的 UI 元件
│       ├── pages/       # 頁面元件
│       └── services/    # API 服務
├── nginx/               # Nginx 設定
│   └── nginx.conf
├── docker-compose.yml   # Docker Compose 設定
└── README.md            # 此檔案
```

## 使用方法

1. 點擊「新しいニュース」按鈕建立新的新聞文章
2. 使用日文文字和中文筆記為文章添加筆記
3. 使用格式工具列依需要格式化文字
4. 查看帶有自動振假名標註的文章

## 開發

在開發模式下執行應用程式：

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

## 授權條款

本專案為開源專案，可根據 MIT License 使用。 