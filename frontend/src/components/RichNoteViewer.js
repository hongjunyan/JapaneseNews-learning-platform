import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Box, Paper, CircularProgress } from '@mui/material';
import { getFurigana } from '../services/api';
import DOMPurify from 'dompurify';

// 添加振り仮名的 CSS 樣式
const furiganaStyles = `
  ruby {
    display: inline-flex;
    flex-direction: column-reverse;
    line-height: normal;
    text-align: center;
    vertical-align: bottom;
    margin-bottom: 0;
  }
  
  ruby > rt {
    font-size: 0.5em;
    line-height: 1;
    display: block;
    text-align: center;
    margin-bottom: -0.25em;
    color: #777;
    user-select: none;
    white-space: nowrap;
  }
  
  /* 確保振り仮名不會影響周圍文本的位置 */
  .japanese-text {
    line-height: 2.5;
  }
  
  /* 讓振り仮名文字相對於漢字居中 */
  ruby > rt {
    transform: translateX(-50%);
    left: 50%;
    position: relative;
  }
`;

const RichNoteViewer = ({ note }) => {
  const [japaneseWithFurigana, setJapaneseWithFurigana] = useState('');
  const [loading, setLoading] = useState(true);
  
  // 在組件初始化時添加振り仮名樣式到文檔
  useEffect(() => {
    // 創建 style 元素
    const styleEl = document.createElement('style');
    styleEl.type = 'text/css';
    styleEl.innerHTML = furiganaStyles;
    
    // 將樣式添加到文檔頭部
    document.head.appendChild(styleEl);
    
    // 組件卸載時移除樣式
    return () => {
      document.head.removeChild(styleEl);
    };
  }, []);
  
  useEffect(() => {
    const processJapaneseText = async () => {
      try {
        setLoading(true);
        if (note.japanese_text) {
          console.log("處理日文文本開始:", note.japanese_text);
          
          // 從HTML中提取純文本
          const tempDiv = document.createElement('div');
          tempDiv.innerHTML = note.japanese_text;
          const textContent = tempDiv.textContent;
          console.log("提取的純文本:", textContent);
          
          // 使用API獲取furigana
          console.log("調用 getFurigana API...");
          const data = await getFurigana(textContent);
          console.log("API 返回數據:", data);
          
          // 直接使用後端返回的HTML，簡化前端處理
          if (data && data.html) {
            console.log("使用後端生成的HTML:", data.html);
            
            // 將後端生成的HTML與原始HTML合併
            // 創建一個DOM解析器來處理HTML
            const parser = new DOMParser();
            const originalDoc = parser.parseFromString(note.japanese_text, 'text/html');
            const rubyDoc = parser.parseFromString(data.html, 'text/html');
            
            // 用原始HTML的樣式包裝振り仮名HTML
            const resultHTML = wrapWithOriginalStyles(originalDoc, rubyDoc.body.innerHTML);
            console.log("最終合併後的HTML:", resultHTML);
            
            // 使用 DOMPurify 清理 HTML 以防 XSS 攻擊
            const cleanHtml = DOMPurify.sanitize(resultHTML);
            setJapaneseWithFurigana(cleanHtml);
          } else {
            console.log("後端未返回HTML或返回空HTML，使用原始文本");
            setJapaneseWithFurigana(note.japanese_text);
          }
        } else {
          setJapaneseWithFurigana('');
          console.log("沒有日文文本");
        }
      } catch (error) {
        console.error('Error processing Japanese text:', error);
        console.error('詳細錯誤信息:', JSON.stringify(error, null, 2));
        setJapaneseWithFurigana(note.japanese_text || '');
      } finally {
        setLoading(false);
      }
    };
    
    processJapaneseText();
  }, [note.japanese_text]);
  
  // 將振り仮名HTML包裝在原始HTML的樣式中
  const wrapWithOriginalStyles = (originalDoc, rubyHTML) => {
    // 找到所有樣式相關的元素
    const styledElements = originalDoc.querySelectorAll('[style], [class]');
    
    // 創建一個新的容器
    const container = document.createElement('div');
    container.innerHTML = rubyHTML;
    container.className = 'japanese-text-with-furigana';
    
    // 如果原始文檔有樣式元素，將樣式應用到新容器
    if (styledElements.length > 0) {
      // 獲取outermost元素的樣式
      const outerElement = styledElements[0];
      if (outerElement.hasAttribute('style')) {
        container.setAttribute('style', outerElement.getAttribute('style'));
      }
      if (outerElement.hasAttribute('class')) {
        container.setAttribute('class', `${outerElement.getAttribute('class')} japanese-text-with-furigana`);
      }
    }
    
    return container.outerHTML;
  };
  
  if (loading) {
    return (
      <Card sx={{ mb: 3, p: 2 }}>
        <CardContent sx={{ display: 'flex', justifyContent: 'center' }}>
          <CircularProgress size={24} />
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card sx={{ 
      mb: 3, 
      boxShadow: 3,
      borderLeft: '4px solid #3f51b5' 
    }}>
      <CardContent>
        {/* 日文文本與 furigana */}
        <Paper 
          elevation={0} 
          sx={{ 
            p: 2, 
            mb: 2, 
            backgroundColor: '#f8f8ff',
            borderRadius: 1
          }}
        >
          <Typography 
            variant="body1"
            className="japanese-text"
            sx={{
              fontFamily: '"Hiragino Sans", "Hiragino Kaku Gothic ProN", "Noto Sans JP", sans-serif',
              lineHeight: 2.5, // 增加行高以容納 furigana
              fontSize: '1.2rem'
            }}
          >
            {japaneseWithFurigana ? (
              <div 
                dangerouslySetInnerHTML={{ __html: japaneseWithFurigana }}
                className="ql-editor japanese-text-container"
                style={{ padding: 0 }}
              />
            ) : (
              '無內容'
            )}
          </Typography>
        </Paper>
        
        {/* 中文筆記 */}
        <Box sx={{ pl: 2, borderLeft: '2px solid #ddd' }}>
          <Typography 
            variant="body1"
            sx={{ color: '#555' }}
          >
            {note.chinese_notes ? (
              <div 
                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(note.chinese_notes) }}
                className="ql-editor"
                style={{ padding: 0 }}
              />
            ) : (
              '無內容'
            )}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default RichNoteViewer; 