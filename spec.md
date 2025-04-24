Goal: 做一個平台，可以記錄我在學習日文新聞時的一些筆記，因此我希望平台上有的功能有:
- 能管理多篇新聞
- 能讓user在平台上，新增一篇新聞筆記，在這個新增頁面上，可以讓user:
    - 在頁面的左半邊可以透過markdown來編輯筆記，右半邊可以檢視呈現畫面
    - 在markdown中，可以透過某個語法來編寫漢字的furikana
- 在呈現的頁面，能超級精美的顯示

docker compose 有三個服務:
backend: 請使用fastapi，透過sqllite持久化保存新聞
frontend: React
nginx: 請將80 port導到frontend