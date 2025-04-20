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
    color: inherit; /* 確保繼承父元素的顏色 */
  }
  
  ruby > rt {
    font-size: 0.5em;
    line-height: 1;
    display: block;
    text-align: center;
    margin-bottom: -0.25em;
    color: #777; /* 振り仮名保持灰色 */
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
  
  /* 確保嵌套在帶顏色的span中的ruby標籤繼承正確的顏色 */
  span[style*="color"] > ruby {
    color: inherit;
  }
  
  /* 確保ruby內的非rt元素繼承顏色 */
  ruby > :not(rt) {
    color: inherit;
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
            
            // 保留原始文本的樣式結構，同時將漢字替換為帶有振り仮名的版本
            const resultHTML = preserveStylesAndApplyFurigana(originalDoc, data);
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
  
  // 保留原始文本的樣式結構，同時將漢字替換為帶有振り仮名的版本
  const preserveStylesAndApplyFurigana = (originalDoc, furiganaData) => {
    // 創建一個副本來處理
    const clonedDoc = originalDoc.cloneNode(true);
    
    // 檢查是否有振り仮名數據
    if (!furiganaData || !furiganaData.html) {
      return originalDoc.body.innerHTML;
    }
    
    // 解析振り仮名HTML
    const parser = new DOMParser();
    const rubyDoc = parser.parseFromString(furiganaData.html, 'text/html');
    
    // 獲取所有帶有ruby標籤的內容
    const rubyElements = rubyDoc.querySelectorAll('ruby');
    
    // 創建一個映射，將原始漢字映射到對應的ruby元素
    const rubyMap = new Map();
    rubyElements.forEach(ruby => {
      // 獲取漢字部分（ruby標籤中除rt之外的文本）
      const kanji = Array.from(ruby.childNodes)
        .filter(node => node.nodeType === Node.TEXT_NODE || node.nodeName !== 'RT')
        .map(node => node.textContent)
        .join('');
      
      // 保存完整的ruby標籤HTML
      rubyMap.set(kanji, ruby.outerHTML);
    });
    
    // 遞歸遍歷和替換文本節點
    const processNode = (node) => {
      // 處理文本節點
      if (node.nodeType === Node.TEXT_NODE) {
        const text = node.textContent;
        if (!text.trim()) return; // 跳過空白文本
        
        // 檢查文本中是否包含需要添加振り仮名的漢字
        let newHTML = text;
        let hasChanges = false;
        
        // 按長度排序，先處理較長的字符串，避免部分匹配問題
        const kanjiList = Array.from(rubyMap.keys()).sort((a, b) => b.length - a.length);
        
        for (const kanji of kanjiList) {
          if (text.includes(kanji)) {
            // 替換漢字為對應的ruby標籤
            newHTML = newHTML.replace(new RegExp(escapeRegExp(kanji), 'g'), rubyMap.get(kanji));
            hasChanges = true;
          }
        }
        
        // 如果文本被修改了，用新的HTML替換
        if (hasChanges) {
          const tempSpan = document.createElement('span');
          tempSpan.innerHTML = newHTML;
          
          // 檢查父節點是否有樣式
          const parentElement = node.parentNode;
          if (parentElement.nodeType === Node.ELEMENT_NODE && 
             (parentElement.hasAttribute('style') || parentElement.hasAttribute('class'))) {
             
            // 如果是span且有樣式，確保ruby元素繼承相應的樣式
            if (parentElement.tagName.toLowerCase() === 'span') {
              const style = parentElement.getAttribute('style');
              const className = parentElement.getAttribute('class');
              
              // 找到新創建的ruby元素並應用樣式
              const rubyElements = tempSpan.querySelectorAll('ruby');
              rubyElements.forEach(ruby => {
                // 保留非RT子元素的樣式
                const rubyContent = ruby.querySelectorAll(':not(rt)');
                rubyContent.forEach(element => {
                  if (style) {
                    const currentStyle = element.getAttribute('style') || '';
                    element.setAttribute('style', `${currentStyle}${currentStyle ? ';' : ''}${style}`);
                  }
                  if (className) {
                    const currentClass = element.getAttribute('class') || '';
                    element.setAttribute('class', `${currentClass}${currentClass ? ' ' : ''}${className}`);
                  }
                });
              });
            }
          }
          
          // 將創建的新節點替換原始文本節點
          const fragment = document.createDocumentFragment();
          while (tempSpan.firstChild) {
            fragment.appendChild(tempSpan.firstChild);
          }
          
          node.parentNode.replaceChild(fragment, node);
        }
        
        return;
      }
      
      // 遞歸處理元素節點的子節點
      if (node.nodeType === Node.ELEMENT_NODE) {
        const childNodes = Array.from(node.childNodes);
        for (const child of childNodes) {
          processNode(child);
        }
      }
    };
    
    // 輔助函數：轉義正則表達式特殊字符
    const escapeRegExp = (string) => {
      return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    };
    
    // 處理原始文檔的內容
    processNode(clonedDoc.body);
    
    return clonedDoc.body.innerHTML;
  };
  
  // 將振り仮名HTML包裝在原始HTML的樣式中 (保留作為後備)
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
      
      // 處理原始文檔中的內聯樣式
      // 創建一個映射來存儲每個文本段的樣式信息
      const styleMap = new Map();
      
      // 收集所有帶有樣式的文本節點
      const collectStyledText = (element) => {
        // 處理元素節點
        if (element.nodeType === Node.ELEMENT_NODE) {
          // 檢查是否具有樣式屬性
          if (element.hasAttribute('style') || element.hasAttribute('class')) {
            // 如果元素只有一個文本子節點，直接映射整個文本
            if (element.childNodes.length === 1 && element.firstChild.nodeType === Node.TEXT_NODE) {
              const text = element.textContent;
              if (text.trim()) {
                styleMap.set(text, {
                  style: element.getAttribute('style') || '',
                  class: element.getAttribute('class') || ''
                });
              }
            }
          }
          
          // 遞歸處理所有子元素
          element.childNodes.forEach(child => {
            if (child.nodeType === Node.ELEMENT_NODE) {
              collectStyledText(child);
            }
          });
        }
      };
      
      // 從原始文檔收集樣式信息
      collectStyledText(originalDoc.body);
      
      // 應用樣式到新的容器
      const applyStyles = (element) => {
        if (element.nodeType === Node.ELEMENT_NODE) {
          // 不處理 ruby 和 rt 標籤
          if (element.tagName.toLowerCase() !== 'ruby' && element.tagName.toLowerCase() !== 'rt') {
            const text = element.textContent;
            // 檢查此文本是否有對應的樣式
            if (styleMap.has(text)) {
              const styleInfo = styleMap.get(text);
              // 應用樣式和類別
              if (styleInfo.style) {
                const currentStyle = element.getAttribute('style') || '';
                element.setAttribute('style', `${currentStyle}${currentStyle ? ';' : ''}${styleInfo.style}`);
              }
              if (styleInfo.class) {
                const currentClass = element.getAttribute('class') || '';
                element.setAttribute('class', `${currentClass}${currentClass ? ' ' : ''}${styleInfo.class}`);
              }
            }
          }
          
          // 遞歸處理子元素
          element.childNodes.forEach(child => {
            if (child.nodeType === Node.ELEMENT_NODE) {
              applyStyles(child);
            }
          });
        }
      };
      
      // 將收集到的樣式應用到新容器
      applyStyles(container);
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