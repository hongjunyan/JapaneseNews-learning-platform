# 日本新聞筆記

一個支持振假名標記的日本新聞文章筆記平台。


## 進度追蹤

以下是已上傳的新聞筆記記錄：

| 日期 | 新聞 | 連結 |
|------|------|------|
| 2025-04-20 | AIでマグロの脂のり評価　世界初の検査装置 | [Link](https://www.youtube.com/watch?v=CrAdYelsDVU) |
| 2025-05-01 | 石破総理「関税措置の見直し訴える」　メーデー大会に出席 | [Link](https://www.youtube.com/watch?v=spsDKEvBYu8)|

## 開始使用

### 前置需求

- 請安裝docker desktop

### 運行應用程式

1. 使用 Git 複製專案：
   ```
   git clone https://github.com/your-username/japanese-news-learning-platform.git
   cd JapaneseNews-learning-platform
   ```

2. 啟動應用程式：
   ```
   docker compose -f ./docker-compose.prod.yml up -d
   ```

3. 打開瀏覽器並輸入網址：
   - 網頁界面：http://localhost
   - API：http://localhost/api

4. 所有新聞都會儲存在 `./backend/data/app.db` 資料庫中

### 開發環境

該項目包含三個服務：

- **後端**：FastAPI 與 SQLite 數據庫
  - 訪問地址：http://localhost:8000
  
- **前端**：具有 Markdown 編輯功能的 React 應用
  - 訪問地址：http://localhost:3000
  
- **Nginx**：路由流量到前端和後端的反向代理
  - 將端口 80 上的所有流量路由到前端
  - 將 /api/* 請求路由到後端

## 使用振假名標記

要為漢字添加振假名，請在 Markdown 中使用以下語法：

```
[漢字]{ふりがな}
```

例如：
- `[日本語]{にほんご}` 將顯示為帶有振假名 にほんご 的 日本語
- `[新聞]{しんぶん}` 將顯示為帶有振假名 しんぶん 的 新聞

## 項目結構

```
jpnews_note/
├── backend/               # FastAPI 後端
│   ├── data/              # SQLite 數據庫文件
│   ├── Dockerfile
│   ├── main.py            # 主應用程序文件
│   └── requirements.txt   # Python 依賴項
├── frontend/              # React 前端
│   ├── public/
│   ├── src/
│   │   ├── components/    # 可重用組件
│   │   ├── pages/         # 頁面組件
│   │   ├── api/           # API 集成
│   │   └── ...
│   ├── Dockerfile
│   └── package.json       # JavaScript 依賴項
├── nginx/                 # Nginx 配置
│   └── nginx.conf
└── docker-compose.yml     # Docker Compose 配置
``` 
