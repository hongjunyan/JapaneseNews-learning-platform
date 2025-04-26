import React, { useRef, useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import ButtonGroup from '@mui/material/ButtonGroup';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import BorderAllIcon from '@mui/icons-material/BorderAll';
import FormatColorFillIcon from '@mui/icons-material/FormatColorFill';
import FormatColorTextIcon from '@mui/icons-material/FormatColorText';
import NoteAltIcon from '@mui/icons-material/NoteAlt';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Paper from '@mui/material/Paper';
import TranslateIcon from '@mui/icons-material/Translate';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import CircularProgress from '@mui/material/CircularProgress';
import Zoom from '@mui/material/Zoom';
import Slide from '@mui/material/Slide';
import Fab from '@mui/material/Fab';
import EditIcon from '@mui/icons-material/Edit';
import { generateFurigana } from '../api/newsApi';

// Japanese text constants
const JP_TEXT = {
  EDITOR: 'エディタ',
  FURIGANA_FORMAT: 'ふりがなを追加する形式: [漢字]{ふりがな}',
  BOLD: '太字',
  ADD_FURIGANA: 'ふりがな追加',
  FURIGANA_SHORT: 'ふり',
  AUTO_FURIGANA: '自動ふりがな',
  HIGHLIGHT: 'テキストをハイライト',
  ADD_TABLE: '表の追加',
  TEXT_COLOR: 'テキストの色を変更',
  NEWS_TEMPLATE: 'ニュース記事構造テンプレート',
  PLACEHOLDER: '日本語のニュースについてのメモを書いてください。漢字のふりがなを追加するには [漢字]{ふりがな} の形式を使ってください。',
};

// Japanese brush stroke pattern for right side decoration
const brushStroke = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='30' height='300' viewBox='0 0 30 300'%3E%3Cpath d='M15,0 C18,50 25,100 20,150 C15,200 5,250 15,300' stroke='%23D22630' stroke-width='2' fill='none' stroke-opacity='0.2'/%3E%3C/svg%3E";

const MarkdownEditor = ({ value, onChange }) => {
  const editorRef = useRef(null);
  const [colorMenuAnchorEl, setColorMenuAnchorEl] = React.useState(null);
  const colorMenuOpen = Boolean(colorMenuAnchorEl);
  const [textColorMenuAnchorEl, setTextColorMenuAnchorEl] = React.useState(null);
  const textColorMenuOpen = Boolean(textColorMenuAnchorEl);
  const [isAutoFuriganaLoading, setIsAutoFuriganaLoading] = useState(false);
  
  // New state for floating toolbar
  const [showFloatingToolbar, setShowFloatingToolbar] = useState(false);
  const [floatingToolbarOpen, setFloatingToolbarOpen] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Add scroll event listener to show/hide floating toolbar
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Show floating toolbar when the static toolbar is not visible
      if (editorRef.current) {
        const editorRect = editorRef.current.getBoundingClientRect();
        const toolbarElement = document.querySelector('[data-testid="static-toolbar"]');
        
        if (toolbarElement) {
          const toolbarRect = toolbarElement.getBoundingClientRect();
          if (toolbarRect.bottom < 0) {
            setShowFloatingToolbar(true);
            // Auto-open the floating toolbar when it first appears
            setFloatingToolbarOpen(true);
          } else {
            setShowFloatingToolbar(false);
            setFloatingToolbarOpen(false);
          }
        }
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY]);

  // Toggle floating toolbar
  const toggleFloatingToolbar = () => {
    setFloatingToolbarOpen(!floatingToolbarOpen);
  };

  const handleColorMenuClick = (event) => {
    setColorMenuAnchorEl(event.currentTarget);
  };

  const handleColorMenuClose = () => {
    setColorMenuAnchorEl(null);
  };

  const handleTextColorMenuClick = (event) => {
    setTextColorMenuAnchorEl(event.currentTarget);
  };

  const handleTextColorMenuClose = () => {
    setTextColorMenuAnchorEl(null);
  };

  // Get selected text and its position
  const getSelection = () => {
    const textarea = editorRef.current;
    if (!textarea) return { text: '', start: 0, end: 0 };
    
    return {
      text: textarea.value.substring(textarea.selectionStart, textarea.selectionEnd),
      start: textarea.selectionStart,
      end: textarea.selectionEnd
    };
  };

  // Replace selected text with support for undo/redo
  const replaceSelection = (newText) => {
    const textarea = editorRef.current;
    if (!textarea) return;
    
    // Focus the textarea to ensure it captures the history state
    textarea.focus();
    
    // Get current selection
    const { start, end } = getSelection();
    
    // This is the key change: instead of directly setting the value,
    // we'll use the browser's native text editing commands which
    // preserve undo history
    
    // First, ensure we have the right selection
    textarea.setSelectionRange(start, end);
    
    // Use execCommand to delete and insert text (this preserves undo history)
    // Insert the new text at the current selection
    document.execCommand('insertText', false, newText);
    
    // Update the parent component with the new value
    onChange(textarea.value);
    
    // Set cursor position after the operation
    const newPosition = start + newText.length;
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(newPosition, newPosition);
    }, 0);
  };

  // Handle bold formatting
  const handleBold = () => {
    const { text } = getSelection();
    if (text) {
      replaceSelection(`**${text}**`);
    }
  };

  // Handle highlighting with specified color
  const handleHighlight = (color) => {
    const { text } = getSelection();
    if (text) {
      replaceSelection(`<span style="background-color: ${color};">${text}</span>`);
    }
    handleColorMenuClose();
  };
  
  // Handle text color with specified color
  const handleTextColor = (color) => {
    const { text } = getSelection();
    if (text) {
      replaceSelection(`<span style="color: ${color};">${text}</span>`);
    }
    handleTextColorMenuClose();
  };
  
  // Handle furigana
  const handleFurigana = () => {
    const { text } = getSelection();
    if (text) {
      replaceSelection(`[${text}]{}`);
      
      // Position cursor inside the empty brackets
      const textarea = editorRef.current;
      if (textarea) {
        const cursorPos = textarea.selectionStart - 1;
        setTimeout(() => {
          textarea.focus();
          textarea.setSelectionRange(cursorPos, cursorPos);
        }, 0);
      }
    }
  };

  // Handle table with borders
  const handleTable = () => {
    const tableTemplate = 
`| 見出し 1 | 見出し 2 | 見出し 3 |
|----------|----------|----------|
| 一行目    | データ    | データ    |
| 二行目    | データ    | データ    |

`;
    
    // Insert at cursor position using replaceSelection for undo support
    const { start } = getSelection();
    const textarea = editorRef.current;
    if (textarea) {
      textarea.setSelectionRange(start, start);
      replaceSelection(tableTemplate);
    }
  };

  // Handle adding news article structure template
  const handleNewsTemplate = () => {
    const newsTemplate = 
`## 「ニュース文章を挿入」
### 📘 翻訳：
(日本語から自分の言語への翻訳)

### 📌 重点整理：
- 重要な単語・表現
- 文法ポイント
- 理解しにくかった部分
`;
    
    // Insert at cursor position using replaceSelection for undo support
    const { start } = getSelection();
    const textarea = editorRef.current;
    if (textarea) {
      textarea.setSelectionRange(start, start);
      replaceSelection(newsTemplate);
    }
  };

  // Handle auto furigana generation
  const handleAutoFurigana = async () => {
    const { text, start, end } = getSelection();
    
    if (!text || text.trim() === '') {
      return;
    }
    
    try {
      setIsAutoFuriganaLoading(true);
      
      const response = await generateFurigana(text);
      
      if (response && response.text) {
        replaceSelection(response.text);
      }
    } catch (error) {
      console.error('Error generating furigana:', error);
    } finally {
      setIsAutoFuriganaLoading(false);
    }
  };

  // Handle Tab key press for indentation
  const handleKeyDown = (e) => {
    // Check if Tab key is pressed
    if (e.key === 'Tab') {
      e.preventDefault(); // Prevent focus from leaving the textarea
      
      const textarea = editorRef.current;
      if (!textarea) return;
      
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      
      // Get the content before and after the selection
      const valueBeforeSelection = textarea.value.substring(0, start);
      const valueAfterSelection = textarea.value.substring(end);
      
      // If there's a selection and it spans multiple lines
      if (start !== end && textarea.value.substring(start, end).includes('\n')) {
        // For multi-line selections, indent or unindent each line
        const selectedText = textarea.value.substring(start, end);
        const lines = selectedText.split('\n');
        
        // Process each line based on whether Shift is pressed
        const newLines = lines.map(line => 
          e.shiftKey ? line.replace(/^(\s{2}|\t)/, '') : '  ' + line
        );
        
        const newSelectedText = newLines.join('\n');
        
        // Replace the selection with the processed text
        document.execCommand('insertText', false, newSelectedText);
        
        // Update parent component with the new value
        onChange(textarea.value);
        
        // Set the selection range to include all modified lines
        const newSelectionStart = start;
        const newSelectionEnd = start + newSelectedText.length;
        textarea.setSelectionRange(newSelectionStart, newSelectionEnd);
      } else {
        // For a single line or no selection, insert or remove indentation at cursor
        if (e.shiftKey) {
          // Shift+Tab: remove indentation if it exists
          const lineStart = valueBeforeSelection.lastIndexOf('\n') + 1;
          const lineBeforeCursor = valueBeforeSelection.substring(lineStart);
          
          // If the line has at least one tab or two spaces at the beginning, remove it
          if (lineBeforeCursor.startsWith('\t')) {
            textarea.setSelectionRange(lineStart, lineStart + 1);
            document.execCommand('delete', false);
            onChange(textarea.value);
          } else if (lineBeforeCursor.startsWith('  ')) {
            textarea.setSelectionRange(lineStart, lineStart + 2);
            document.execCommand('delete', false);
            onChange(textarea.value);
          }
        } else {
          // Tab: insert indentation (two spaces)
          document.execCommand('insertText', false, '  ');
          onChange(textarea.value);
        }
      }
    }
  };

  // Colors for highlighting
  const highlightColors = [
    { name: 'Sakura Pink', value: '#FFE4E6' },
    { name: 'Matcha Green', value: '#F1F8E9' },
    { name: 'Sky Blue', value: '#E3F2FD' },
    { name: 'Sunset Orange', value: '#FFF3E0' },
    { name: 'Lavender', value: '#F3E5F5' },
    { name: 'Ghibli Teal', value: '#E0F2F1' },
    { name: 'Totoro Gray', value: '#ECEFF1' },
    { name: 'Chihiro Yellow', value: '#FFFDE7' },
    { name: 'Howl Pastel Blue', value: '#E8F5E9' },
    { name: 'Ponyo Coral', value: '#FFEBEE' },
    { name: 'Mononoke Forest', value: '#E8F5E9' },
    { name: 'Castle Gold', value: '#FFF8E1' }
  ];

  // Colors for text
  const textColors = [
    { name: 'Red', value: '#D32F2F' },
    { name: 'Blue', value: '#1976D2' },
    { name: 'Green', value: '#388E3C' },
    { name: 'Purple', value: '#7B1FA2' },
    { name: 'Orange', value: '#E64A19' },
    { name: 'Ghibli Blue', value: '#0288D1' },
    { name: 'Ghibli Teal', value: '#00897B' },
    { name: 'Forest Green', value: '#558B2F' },
    { name: 'Earthy Brown', value: '#795548' },
    { name: 'Totoro Gray', value: '#546E7A' },
    { name: 'Studio Red', value: '#C62828' },
    { name: 'Deep Indigo', value: '#303F9F' }
  ];

  // Render toolbar buttons
  const renderToolbarButtons = () => (
    <ButtonGroup 
      variant="outlined" 
      sx={{ 
        '& .MuiButton-root': {
          borderColor: '#E0E0E0',
          color: '#555555',
          backgroundColor: '#FFFFFF',
          transition: 'all 0.2s ease',
          '&:hover': {
            borderColor: '#D22630',
            backgroundColor: 'rgba(210, 38, 48, 0.04)',
            transform: 'translateY(-2px)',
            boxShadow: '0 3px 5px rgba(0, 0, 0, 0.08)'
          }
        }
      }}
    >
      <Tooltip title={JP_TEXT.BOLD}>
        <Button onClick={handleBold}>
          <FormatBoldIcon />
        </Button>
      </Tooltip>
      
      <Tooltip title={JP_TEXT.ADD_FURIGANA}>
        <Button onClick={handleFurigana}>
          文<Typography component="span" sx={{ fontSize: '0.6rem', verticalAlign: 'top' }}>{JP_TEXT.FURIGANA_SHORT}</Typography>
        </Button>
      </Tooltip>
      
      <Tooltip title={JP_TEXT.AUTO_FURIGANA}>
        <Button 
          onClick={handleAutoFurigana}
          disabled={isAutoFuriganaLoading}
          sx={{
            position: 'relative',
          }}
        >
          {isAutoFuriganaLoading ? (
            <CircularProgress size={20} color="inherit" />
          ) : (
            <>
              <AutoAwesomeIcon />
              文<Typography component="span" sx={{ fontSize: '0.6rem', verticalAlign: 'top' }}>{JP_TEXT.FURIGANA_SHORT}</Typography>
            </>
          )}
        </Button>
      </Tooltip>
      
      <Tooltip title={JP_TEXT.HIGHLIGHT}>
        <Button 
          onClick={handleColorMenuClick}
          aria-haspopup="true"
          aria-expanded={colorMenuOpen ? 'true' : undefined}
        >
          <FormatColorFillIcon />
          <ExpandMoreIcon fontSize="small" />
        </Button>
      </Tooltip>
      
      <Tooltip title={JP_TEXT.TEXT_COLOR}>
        <Button 
          onClick={handleTextColorMenuClick}
          aria-haspopup="true"
          aria-expanded={textColorMenuOpen ? 'true' : undefined}
        >
          <FormatColorTextIcon />
          <ExpandMoreIcon fontSize="small" />
        </Button>
      </Tooltip>
      
      <Tooltip title={JP_TEXT.ADD_TABLE}>
        <Button onClick={handleTable}>
          <BorderAllIcon />
        </Button>
      </Tooltip>
      
      <Tooltip title={JP_TEXT.NEWS_TEMPLATE}>
        <Button onClick={handleNewsTemplate}>
          <NoteAltIcon />
        </Button>
      </Tooltip>
    </ButtonGroup>
  );

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
            background: 'linear-gradient(to bottom, #D22630, #68B0AB)',
            display: 'inline-block',
            marginRight: '8px',
          }}
        />
        {JP_TEXT.EDITOR}
      </Typography>
      
      <Typography 
        variant="subtitle2" 
        gutterBottom 
        sx={{ 
          mb: 2, 
          color: '#555555',
          display: 'flex',
          alignItems: 'center',
          fontFamily: "'M PLUS Rounded 1c', sans-serif",
          fontWeight: 400,
        }}
      >
        <TranslateIcon fontSize="small" sx={{ mr: 0.5, color: '#2A4B7C' }} />
        {JP_TEXT.FURIGANA_FORMAT}
      </Typography>
      
      {/* Static toolbar */}
      <Paper 
        elevation={0}
        data-testid="static-toolbar"
        sx={{ 
          p: 2, 
          mb: 2, 
          border: '1px solid #EEEEEE',
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)'
        }}
      >
        {renderToolbarButtons()}
      </Paper>
      
      {/* Floating toolbar */}
      <Zoom in={showFloatingToolbar}>
        <Box
          sx={{
            position: 'fixed',
            bottom: '80px',
            right: '20px',
            zIndex: 1000,
          }}
        >
          <Fab
            color="primary"
            size="medium"
            onClick={toggleFloatingToolbar}
            sx={{
              backgroundColor: '#2A4B7C',
              '&:hover': {
                backgroundColor: '#1A3B6C',
              },
              boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
            }}
          >
            <EditIcon />
          </Fab>
          
          <Slide 
            direction="up" 
            in={floatingToolbarOpen} 
            mountOnEnter 
            unmountOnExit
          >
            <Paper
              elevation={3}
              sx={{
                position: 'absolute',
                bottom: '60px',
                right: '0',
                p: 1,
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                borderRadius: '4px',
                boxShadow: '0 3px 14px rgba(0, 0, 0, 0.12)',
                border: '1px solid #EEEEEE',
                maxWidth: '100vw',
                overflow: 'auto',
                '&:before': {
                  content: '""',
                  position: 'absolute',
                  bottom: '-8px',
                  right: '14px',
                  width: '16px',
                  height: '16px',
                  backgroundColor: 'white',
                  boxShadow: '4px 4px 5px rgba(0, 0, 0, 0.05)',
                  transform: 'rotate(45deg)',
                  borderRight: '1px solid #EEEEEE',
                  borderBottom: '1px solid #EEEEEE',
                  zIndex: 0,
                }
              }}
            >
              {renderToolbarButtons()}
            </Paper>
          </Slide>
        </Box>
      </Zoom>
      
      {/* Menus */}
      <Menu
         anchorEl={colorMenuAnchorEl}
         open={colorMenuOpen}
         onClose={handleColorMenuClose}
         PaperProps={{
           sx: {
             border: '1px solid #EEEEEE',
             boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
             maxHeight: '400px',
             width: '180px',
             '& .MuiList-root': {
               padding: '8px',
               display: 'grid',
               gridTemplateColumns: 'repeat(2, 1fr)',
               gap: '4px'
             }
           }
         }}
       >
         {highlightColors.map((color) => (
           <MenuItem 
             key={color.name} 
             onClick={() => handleHighlight(color.value)}
             sx={{ 
               display: 'flex', 
               flexDirection: 'column',
               alignItems: 'center',
               justifyContent: 'center',
               padding: '8px 4px',
               borderRadius: '4px',
               transition: 'all 0.2s',
               '&:hover': {
                 backgroundColor: 'rgba(210, 38, 48, 0.04)',
                 transform: 'scale(1.05)'
               }
             }}
           >
             <Box 
               sx={{ 
                 width: 20, 
                 height: 20, 
                 backgroundColor: color.value, 
                 marginBottom: 0.5,
                 border: '1px solid #EEEEEE',
                 borderRadius: '4px',
                 boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
               }}
             />
             <Typography variant="caption" sx={{ fontSize: '0.7rem' }}>{color.name}</Typography>
           </MenuItem>
         ))}
       </Menu>
       
       <Menu
         anchorEl={textColorMenuAnchorEl}
         open={textColorMenuOpen}
         onClose={handleTextColorMenuClose}
         PaperProps={{
           sx: {
             border: '1px solid #EEEEEE',
             boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
             maxHeight: '400px',
             width: '180px',
             '& .MuiList-root': {
               padding: '8px',
               display: 'grid',
               gridTemplateColumns: 'repeat(2, 1fr)',
               gap: '4px'
             }
           }
         }}
       >
         {textColors.map((color) => (
           <MenuItem 
             key={color.name} 
             onClick={() => handleTextColor(color.value)}
             sx={{ 
               display: 'flex', 
               flexDirection: 'column',
               alignItems: 'center',
               justifyContent: 'center',
               padding: '8px 4px',
               borderRadius: '4px',
               transition: 'all 0.2s',
               '&:hover': {
                 backgroundColor: 'rgba(210, 38, 48, 0.04)',
                 transform: 'scale(1.05)'
               }
             }}
           >
             <Box 
               sx={{ 
                 width: 20, 
                 height: 20, 
                 backgroundColor: color.value, 
                 marginBottom: 0.5,
                 border: '1px solid #EEEEEE',
                 borderRadius: '4px',
                 boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
               }}
             />
             <Typography variant="caption" sx={{ fontSize: '0.7rem', color: color.value, fontWeight: 'bold' }}>{color.name}</Typography>
           </MenuItem>
         ))}
       </Menu>
      
      <Box 
        sx={{ 
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            width: '40px',
            backgroundImage: `url("${brushStroke}")`,
            backgroundRepeat: 'repeat-y',
            backgroundSize: '40px auto',
            opacity: 0.8,
            pointerEvents: 'none',
            zIndex: 1
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: 'linear-gradient(to right, #D22630, #68B0AB, #8FC0A9, #F9DBC6)',
            opacity: 0.6,
            zIndex: 1
          }
        }}
      >
        <TextField
          fullWidth
          multiline
          rows={20}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          variant="outlined"
          placeholder={JP_TEXT.PLACEHOLDER}
          inputRef={editorRef}
          sx={{
            '& .MuiOutlinedInput-root': {
              '& fieldset': { 
                borderColor: '#EEEEEE',
                borderWidth: '1px'
              },
              '&:hover fieldset': { 
                borderColor: '#2A4B7C',
                borderWidth: '1px'
              },
              '&.Mui-focused fieldset': { 
                borderColor: '#2A4B7C',
                borderWidth: '1px'
              },
              backgroundColor: 'rgba(255, 255, 255, 0.92)',
              fontFamily: '"Noto Sans JP", sans-serif',
              fontSize: '0.95rem',
              lineHeight: 1.7,
              letterSpacing: '0.01em',
              boxShadow: '0 2px 12px rgba(0, 0, 0, 0.03)',
              transition: 'all 0.3s',
              '&:hover': {
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.06)'
              }
            },
          }}
          InputProps={{
            sx: {
              '&::placeholder': {
                color: '#888888',
                opacity: 0.8,
                fontStyle: 'italic'
              },
              pr: '50px',  // Add right padding for the brush stroke decoration
              p: 2.5,
            },
          }}
        />
      </Box>
    </Box>
  );
};

export default MarkdownEditor; 