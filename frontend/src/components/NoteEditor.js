import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  TextField, 
  Button, 
  Box, 
  Typography, 
  IconButton, 
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Paper,
  Slider,
  Tooltip
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import FormatUnderlinedIcon from '@mui/icons-material/FormatUnderlined';
import FormatColorTextIcon from '@mui/icons-material/FormatColorText';
import FormatSizeIcon from '@mui/icons-material/FormatSize';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { v4 as uuidv4 } from 'uuid';

const NoteEditor = ({ note, onSave, onDelete, onMoveUp, onMoveDown, isNew = false }) => {
  const [japaneseText, setJapaneseText] = useState(note?.japanese_text || '');
  const [chineseNotes, setChineseNotes] = useState(note?.chinese_notes || '');
  const [textStyle, setTextStyle] = useState(
    note?.text_style ? JSON.parse(note.text_style) : {
      fontSize: '1rem',
      color: '#000000',
      fontWeight: 'normal',
      fontStyle: 'normal',
      textDecoration: 'none',
      lineHeight: 1.5,
      custom: {}
    }
  );

  const handleSave = () => {
    const updatedNote = {
      japanese_text: japaneseText,
      chinese_notes: chineseNotes,
      text_style: JSON.stringify(textStyle),
      order: note?.order || 0
    };
    onSave(updatedNote);
  };

  const handleStyleChange = (property, value) => {
    setTextStyle(prev => ({
      ...prev,
      [property]: value
    }));
  };

  const toggleStyle = (property, value, defaultValue) => {
    setTextStyle(prev => ({
      ...prev,
      [property]: prev[property] === value ? defaultValue : value
    }));
  };

  return (
    <Card sx={{ mb: 3, p: 1, border: '1px dashed #ccc' }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6">
            {isNew ? 'New Note' : `Edit Note ${note.id}`}
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

        <TextField
          label="Japanese Text"
          multiline
          fullWidth
          rows={3}
          value={japaneseText}
          onChange={(e) => setJapaneseText(e.target.value)}
          sx={{ mb: 3 }}
        />

        <TextField
          label="Chinese Notes"
          multiline
          fullWidth
          rows={3}
          value={chineseNotes}
          onChange={(e) => setChineseNotes(e.target.value)}
          sx={{ mb: 3 }}
        />

        <Typography variant="subtitle2" gutterBottom>
          Text Formatting
        </Typography>
        
        <Paper elevation={0} sx={{ p: 2, mb: 2, backgroundColor: '#f5f5f5' }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item>
              <Tooltip title="Bold">
                <IconButton 
                  onClick={() => toggleStyle('fontWeight', 'bold', 'normal')}
                  color={textStyle.fontWeight === 'bold' ? 'primary' : 'default'}
                >
                  <FormatBoldIcon />
                </IconButton>
              </Tooltip>
            </Grid>
            
            <Grid item>
              <Tooltip title="Italic">
                <IconButton 
                  onClick={() => toggleStyle('fontStyle', 'italic', 'normal')}
                  color={textStyle.fontStyle === 'italic' ? 'primary' : 'default'}
                >
                  <FormatItalicIcon />
                </IconButton>
              </Tooltip>
            </Grid>
            
            <Grid item>
              <Tooltip title="Underline">
                <IconButton 
                  onClick={() => toggleStyle('textDecoration', 'underline', 'none')}
                  color={textStyle.textDecoration === 'underline' ? 'primary' : 'default'}
                >
                  <FormatUnderlinedIcon />
                </IconButton>
              </Tooltip>
            </Grid>
            
            <Grid item xs={12} sm={3}>
              <FormControl size="small" fullWidth>
                <InputLabel>Font Size</InputLabel>
                <Select
                  value={textStyle.fontSize}
                  label="Font Size"
                  onChange={(e) => handleStyleChange('fontSize', e.target.value)}
                >
                  <MenuItem value="0.75rem">Small</MenuItem>
                  <MenuItem value="1rem">Normal</MenuItem>
                  <MenuItem value="1.25rem">Large</MenuItem>
                  <MenuItem value="1.5rem">X-Large</MenuItem>
                  <MenuItem value="2rem">XX-Large</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={3}>
              <FormControl size="small" fullWidth>
                <InputLabel>Text Color</InputLabel>
                <Select
                  value={textStyle.color}
                  label="Text Color"
                  onChange={(e) => handleStyleChange('color', e.target.value)}
                >
                  <MenuItem value="#000000">Black</MenuItem>
                  <MenuItem value="#0000FF">Blue</MenuItem>
                  <MenuItem value="#FF0000">Red</MenuItem>
                  <MenuItem value="#008000">Green</MenuItem>
                  <MenuItem value="#800080">Purple</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" gutterBottom>
                Line Height
              </Typography>
              <Slider
                value={typeof textStyle.lineHeight === 'number' ? textStyle.lineHeight : 1.5}
                min={1}
                max={3}
                step={0.1}
                onChange={(_, value) => handleStyleChange('lineHeight', value)}
                valueLabelDisplay="auto"
              />
            </Grid>
          </Grid>
        </Paper>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
          <Button 
            variant="contained" 
            color="primary"
            onClick={handleSave}
          >
            Save Note
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default NoteEditor; 