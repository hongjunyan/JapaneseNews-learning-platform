import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { 
  Card, 
  CardContent, 
  Button, 
  Box, 
  Typography, 
  IconButton,
  Divider,
  Paper
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

const RichNoteEditor = ({ note, onSave, onDelete, onMoveUp, onMoveDown, isNew = false }) => {
  const [japaneseText, setJapaneseText] = useState(note?.japanese_text || '');
  const [chineseNotes, setChineseNotes] = useState(note?.chinese_notes || '');
  const [isEditing, setIsEditing] = useState(isNew);

  // 工具欄配置
  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'font': [] }, { 'size': ['small', false, 'large', 'huge'] }],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ 'align': [] }, { 'indent': '-1' }, { 'indent': '+1' }],
      ['blockquote', 'code-block'],
      [{ 'script': 'sub' }, { 'script': 'super' }],
      ['clean'],
      ['link', 'image', 'video'],
      [{ 'direction': 'rtl' }],
      [{ 'table': true }]
    ],
  };

  // 格式選項
  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'color', 'background',
    'font', 'size',
    'list', 'bullet',
    'align', 'indent',
    'blockquote', 'code-block',
    'script',
    'link', 'image', 'video',
    'direction',
    'table'
  ];

  const handleSave = () => {
    const updatedNote = {
      japanese_text: japaneseText,
      chinese_notes: chineseNotes,
      text_style: JSON.stringify({}), // 現在我們使用富文本編輯器，不需要單獨儲存樣式
      order: note?.order || 0
    };
    onSave(updatedNote);
    setIsEditing(false);
  };

  return (
    <Card sx={{ mb: 3, p: 1, border: isEditing ? '1px dashed #3f51b5' : '1px solid #eee' }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6">
            {isNew ? '新筆記' : `筆記 ${note.id}`}
          </Typography>
          <Box>
            {onMoveUp && (
              <IconButton onClick={onMoveUp} size="small" sx={{ mr: 1 }}>
                <ArrowUpwardIcon />
              </IconButton>
            )}
            {onMoveDown && (
              <IconButton onClick={onMoveDown} size="small" sx={{ mr: 1 }}>
                <ArrowDownwardIcon />
              </IconButton>
            )}
            {onDelete && (
              <IconButton onClick={onDelete} color="error" size="small">
                <DeleteIcon />
              </IconButton>
            )}
          </Box>
        </Box>

        <Divider sx={{ mb: 2 }} />

        <Typography variant="subtitle1" gutterBottom>
          日文文本
        </Typography>
        
        <Paper 
          elevation={0} 
          sx={{ 
            mb: 3, 
            border: '1px solid #e0e0e0',
            borderRadius: 1,
            '.ql-toolbar': {
              borderTopLeftRadius: 4,
              borderTopRightRadius: 4,
            },
            '.ql-container': {
              borderBottomLeftRadius: 4,
              borderBottomRightRadius: 4,
              fontFamily: '"Hiragino Sans", "Hiragino Kaku Gothic ProN", "Noto Sans JP", sans-serif',
              fontSize: '1.2rem',
              lineHeight: 2
            },
            '.ql-editor': {
              minHeight: '250px',
              resize: 'vertical',
              overflow: 'auto'
            }
          }}
        >
          <ReactQuill 
            theme="snow"
            value={japaneseText}
            onChange={setJapaneseText}
            modules={modules}
            formats={formats}
            placeholder="輸入日文文本..."
          />
        </Paper>

        <Typography variant="subtitle1" gutterBottom>
          中文筆記
        </Typography>
        
        <Paper 
          elevation={0} 
          sx={{ 
            mb: 3, 
            border: '1px solid #e0e0e0',
            borderRadius: 1,
            '.ql-toolbar': {
              borderTopLeftRadius: 4,
              borderTopRightRadius: 4,
            },
            '.ql-container': {
              borderBottomLeftRadius: 4,
              borderBottomRightRadius: 4
            },
            '.ql-editor': {
              minHeight: '250px',
              resize: 'vertical',
              overflow: 'auto'
            }
          }}
        >
          <ReactQuill 
            theme="snow"
            value={chineseNotes}
            onChange={setChineseNotes}
            modules={modules}
            formats={formats}
            placeholder="輸入中文筆記..."
          />
        </Paper>
        
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
          <Button 
            variant="contained" 
            color="primary"
            onClick={handleSave}
          >
            保存筆記
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default RichNoteEditor; 