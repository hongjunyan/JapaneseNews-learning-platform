import React, { useRef, useState } from 'react';
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
`# ニュース記事のまとめ

> 「記事の一部を引用文として書いておく」

## 文の構造分析

1. 「第一の文を書いておく」
   - 重要なポイント
   - 単語の意味: 〇〇〇

2. 「第二の文を書いておく」
   - 重要なポイント
   - 語法メモ: 〜〜の使い方

3. 「第三の文を書いておく」
   - 文法ポイント: 〜〜
   - 関連語彙: 〇〇〇

## 総合メモ

- 重要単語一覧
- 理解が難しかった部分
- 関連知識

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

  // Colors for highlighting
  const highlightColors = [
    { name: 'Sakura Pink', value: '#FFEBEE' },
    { name: 'Matcha Green', value: '#F1F8E9' },
    { name: 'Sky Blue', value: '#E3F2FD' },
    { name: 'Sunset Orange', value: '#FFF3E0' },
    { name: 'Lavender', value: '#F3E5F5' }
  ];

  // Colors for text
  const textColors = [
    { name: 'Red', value: '#D32F2F' },
    { name: 'Blue', value: '#1976D2' },
    { name: 'Green', value: '#388E3C' },
    { name: 'Purple', value: '#7B1FA2' },
    { name: 'Orange', value: '#E64A19' }
  ];

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
        {JP_TEXT.EDITOR}
      </Typography>
      
      <Typography 
        variant="subtitle2" 
        gutterBottom 
        sx={{ 
          mb: 2, 
          color: '#666666',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <TranslateIcon fontSize="small" sx={{ mr: 0.5, color: '#2A4B7C' }} />
        {JP_TEXT.FURIGANA_FORMAT}
      </Typography>
      
      <Paper 
        elevation={0}
        sx={{ 
          p: 2, 
          mb: 2, 
          border: '1px solid #EEEEEE',
          backgroundColor: '#FAFAFA'
        }}
      >
        <ButtonGroup 
          variant="outlined" 
          sx={{ 
            '& .MuiButton-root': {
              borderColor: '#DDDDDD',
              color: '#666666',
              backgroundColor: '#FFFFFF',
              '&:hover': {
                borderColor: '#D22630',
                backgroundColor: 'rgba(210, 38, 48, 0.04)',
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
        
        <Menu
          anchorEl={colorMenuAnchorEl}
          open={colorMenuOpen}
          onClose={handleColorMenuClose}
          PaperProps={{
            sx: {
              border: '1px solid #EEEEEE',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
            }
          }}
        >
          {highlightColors.map((color) => (
            <MenuItem 
              key={color.name} 
              onClick={() => handleHighlight(color.value)}
              sx={{ 
                display: 'flex', 
                alignItems: 'center',
                '&:hover': {
                  backgroundColor: 'rgba(210, 38, 48, 0.04)',
                }
              }}
            >
              <Box 
                sx={{ 
                  width: 16, 
                  height: 16, 
                  backgroundColor: color.value, 
                  marginRight: 1,
                  border: '1px solid #EEEEEE',
                }}
              />
              {color.name}
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
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
            }
          }}
        >
          {textColors.map((color) => (
            <MenuItem 
              key={color.name} 
              onClick={() => handleTextColor(color.value)}
              sx={{ 
                display: 'flex', 
                alignItems: 'center',
                '&:hover': {
                  backgroundColor: 'rgba(210, 38, 48, 0.04)',
                }
              }}
            >
              <Box 
                sx={{ 
                  width: 16, 
                  height: 16, 
                  backgroundColor: color.value, 
                  marginRight: 1,
                  border: '1px solid #EEEEEE',
                }}
              />
              <Typography style={{ color: color.value }}>{color.name}</Typography>
            </MenuItem>
          ))}
        </Menu>
      </Paper>
      
      <Box 
        sx={{ 
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            width: '30px',
            backgroundImage: `url("${brushStroke}")`,
            backgroundRepeat: 'repeat-y',
            backgroundSize: '30px auto',
            opacity: 1,
            pointerEvents: 'none',
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
          variant="outlined"
          placeholder={JP_TEXT.PLACEHOLDER}
          inputRef={editorRef}
          sx={{
            '& .MuiOutlinedInput-root': {
              '& fieldset': { borderColor: '#EEEEEE' },
              '&:hover fieldset': { borderColor: '#D22630' },
              '&.Mui-focused fieldset': { borderColor: '#D22630' },
              backgroundColor: '#FFFFFF',
              fontFamily: '"Noto Sans JP", sans-serif',
            },
          }}
          InputProps={{
            sx: {
              '&::placeholder': {
                color: '#999999',
                opacity: 0.7,
              },
              pr: '40px',  // Add right padding for the brush stroke decoration
            },
          }}
        />
      </Box>
    </Box>
  );
};

export default MarkdownEditor; 