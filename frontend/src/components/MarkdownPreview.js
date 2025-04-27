import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';

// Japanese decorative motif - minimalist wave pattern (using softer colors)
const japaneseWave = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='20' viewBox='0 0 120 20'%3E%3Cpath d='M0,10 C10,5 20,15 30,10 C40,5 50,15 60,10 C70,5 80,15 90,10 C100,5 110,15 120,10' stroke='%235FB3BF' stroke-width='1' fill='none' stroke-opacity='0.3'/%3E%3C/svg%3E";

// Extra styles for PDF rendering
const pdfStyles = `
  @media print {
    .markdown-preview {
      font-family: "Shippori Mincho", serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif !important;
      color: #000 !important;
    }
    .markdown-preview h1 {
      font-size: 24px !important;
      font-weight: 600 !important;
      margin-bottom: 16px !important;
      padding-bottom: 8px !important;
      border-bottom: 1px solid #EEEEEE !important;
      font-family: "Shippori Mincho", serif !important;
    }
    .markdown-preview h2 {
      font-size: 20px !important;
      font-weight: 600 !important;
      margin-bottom: 12px !important;
      padding-left: 10px !important;
      border-left: 3px solid #5FB3BF !important;
      font-family: "Shippori Mincho", serif !important;
    }
    .markdown-preview h3 {
      font-size: 18px !important;
      font-weight: 600 !important;
      margin-bottom: 10px !important;
      color: #2D4B8D !important;
      font-family: "Shippori Mincho", serif !important;
    }
    .markdown-preview p {
      font-size: 14px !important;
      line-height: 1.8 !important;
      margin-bottom: 16px !important;
    }
    .markdown-preview table {
      border-collapse: collapse !important;
      width: 100% !important;
      margin-bottom: 16px !important;
    }
    .markdown-preview th, .markdown-preview td {
      border: 1px solid #ddd !important;
      padding: 8px !important;
      text-align: left !important;
    }
    .markdown-preview ruby {
      display: inline-flex !important;
      flex-direction: column-reverse !important;
      line-height: 1 !important;
      text-align: center !important;
    }
    .markdown-preview .kanji {
      font-size: 16px !important;
    }
    .markdown-preview .furigana {
      font-size: 10px !important;
      opacity: 0.75 !important;
      line-height: 1 !important;
    }
  }
`;

const MarkdownPreview = ({ content, noScroll = false }) => {
  const theme = useTheme();
  
  // Process furigana notation [kanji]{furigana}
  const processContent = (content) => {
    if (!content) return '';
    
    // Regex to match [kanji]{furigana} pattern
    const regex = /\[([^\]]+)\]\{([^}]+)\}/g;
    
    // Replace with HTML for proper display
    return content.replace(regex, (match, kanji, furigana) => {
      return `<ruby><span class="kanji">${kanji}</span><rt class="furigana">${furigana}</rt></ruby>`;
    });
  };

  const processedContent = processContent(content);

  return (
    <Box>
      <style>{pdfStyles}</style>
      <Typography 
        variant="h6" 
        gutterBottom 
        sx={{ 
          color: theme.palette.secondary.main, 
          fontFamily: "'Shippori Mincho', serif",
          fontWeight: 500, 
          display: 'flex', 
          alignItems: 'center',
          mb: 2
        }}
      >
        <Box 
          component="span" 
          sx={{
            width: '4px',
            height: '18px',
            backgroundColor: theme.palette.custom.asagi,
            display: 'inline-block',
            marginRight: '8px',
          }}
        />
        プレビュー
      </Typography>
      
      <Paper 
        elevation={0}
        sx={{ 
          p: 0, 
          ...(noScroll 
            ? { height: 'auto', minHeight: 'auto' } 
            : { height: 'calc(30 * 1.7rem + 5rem)', minHeight: 'auto' }
          ),
          overflow: 'hidden',
          border: '1px solid #EEEEEE',
          borderRadius: 0,
          position: 'relative',
          backgroundColor: '#FAFAFA', // Slightly off-white background for better eye comfort
        }}
      >
        {/* Decorative header */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            right: 0,
            left: 0,
            height: '20px',
            backgroundImage: `url("${japaneseWave}")`,
            backgroundRepeat: 'repeat-x',
            backgroundSize: 'auto 20px',
            opacity: 0.7
          }}
        />
        
        <Box 
          className="markdown-preview"
          sx={{ 
            p: 3,
            pt: '26px', // Account for the wave pattern height
            height: noScroll ? 'auto' : 'calc(100% - 26px)',
            overflow: noScroll ? 'visible' : 'auto',
            position: 'relative',
            backgroundColor: 'rgba(250, 250, 250, 0.95)', // Slightly off-white background
          }}
        >
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw]}
            components={{
              h1: (props) => (
                <Typography 
                  variant="h4" 
                  gutterBottom 
                  sx={{ 
                    fontFamily: "'Shippori Mincho', serif",
                    borderBottom: '1px solid #EEEEEE', 
                    paddingBottom: '8px',
                    color: theme.palette.text.primary,
                    fontWeight: 600
                  }} 
                  {...props} 
                />
              ),
              h2: (props) => (
                <Typography 
                  variant="h5" 
                  gutterBottom 
                  sx={{ 
                    fontFamily: "'Shippori Mincho', serif",
                    borderLeft: `3px solid ${theme.palette.custom.asagi}`, 
                    paddingLeft: '10px',
                    color: theme.palette.text.primary,
                    fontWeight: 600
                  }} 
                  {...props} 
                />
              ),
              h3: (props) => (
                <Typography 
                  variant="h6" 
                  gutterBottom 
                  sx={{ 
                    fontFamily: "'Shippori Mincho', serif",
                    color: theme.palette.secondary.main,
                    fontWeight: 600
                  }} 
                  {...props} 
                />
              ),
              p: (props) => (
                <Typography 
                  variant="body1" 
                  paragraph 
                  sx={{ lineHeight: 1.8 }} 
                  {...props} 
                />
              ),
              table: (props) => (
                <Box 
                  className="table-container" 
                  sx={{ overflowX: 'auto', marginBottom: '16px' }}
                >
                  <table {...props} />
                </Box>
              ),
              th: (props) => <th {...props} />,
              td: (props) => <td {...props} />
            }}
          >
            {processedContent}
          </ReactMarkdown>
        </Box>
        
        {/* Decorative corner */}
        <Box className="jp-corner" />
      </Paper>
    </Box>
  );
};

export default MarkdownPreview; 