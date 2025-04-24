import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

// Japanese decorative motif - minimalist wave pattern
const japaneseWave = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='20' viewBox='0 0 120 20'%3E%3Cpath d='M0,10 C10,5 20,15 30,10 C40,5 50,15 60,10 C70,5 80,15 90,10 C100,5 110,15 120,10' stroke='%23D22630' stroke-width='1' fill='none' stroke-opacity='0.3'/%3E%3C/svg%3E";

const MarkdownPreview = ({ content }) => {
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
      <Typography 
        variant="h6" 
        gutterBottom 
        sx={{ 
          color: '#2A4B7C', 
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
            backgroundColor: '#D22630',
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
          height: '100%', 
          minHeight: '400px',
          overflow: 'hidden',
          border: '1px solid #EEEEEE',
          borderRadius: 0,
          position: 'relative',
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
            opacity: 0.8
          }}
        />
        
        <Box 
          className="markdown-preview"
          sx={{ 
            p: 3,
            pt: '26px', // Account for the wave pattern height
            height: 'calc(100% - 20px)',
            overflow: 'auto',
            position: 'relative',
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
                    color: '#333333',
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
                    borderLeft: '3px solid #D22630', 
                    paddingLeft: '10px',
                    color: '#333333',
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
                    color: '#2A4B7C',
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