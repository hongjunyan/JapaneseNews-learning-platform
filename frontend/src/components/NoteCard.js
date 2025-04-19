import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Box, Paper } from '@mui/material';
import { getFurigana } from '../services/api';

const NoteCard = ({ note, isEditing }) => {
  const [furiganaHtml, setFuriganaHtml] = useState('');
  const textStyle = note.text_style ? JSON.parse(note.text_style) : {};
  
  useEffect(() => {
    const loadFurigana = async () => {
      try {
        if (note.japanese_text) {
          const data = await getFurigana(note.japanese_text);
          setFuriganaHtml(data.html);
        }
      } catch (error) {
        console.error('Error loading furigana:', error);
        setFuriganaHtml(note.japanese_text);
      }
    };
    
    loadFurigana();
  }, [note.japanese_text]);
  
  // Apply text styles from the stored JSON
  const appliedStyles = {
    fontSize: textStyle.fontSize || '1rem',
    color: textStyle.color || 'inherit',
    fontWeight: textStyle.fontWeight || 'normal',
    fontStyle: textStyle.fontStyle || 'normal',
    textDecoration: textStyle.textDecoration || 'none',
    lineHeight: textStyle.lineHeight || 1.5,
    ...textStyle.custom
  };
  
  return (
    <Card sx={{ 
      mb: 3, 
      boxShadow: 3,
      borderLeft: '4px solid #3f51b5' 
    }}>
      <CardContent>
        {/* Japanese text with furigana */}
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
            sx={appliedStyles}
          >
            {furiganaHtml ? (
              <span dangerouslySetInnerHTML={{ __html: furiganaHtml }} />
            ) : (
              note.japanese_text
            )}
          </Typography>
        </Paper>
        
        {/* Chinese notes */}
        <Box sx={{ pl: 2, borderLeft: '2px solid #ddd' }}>
          <Typography 
            variant="body1"
            sx={{
              fontStyle: 'italic',
              color: '#555',
              ...appliedStyles
            }}
          >
            {note.chinese_notes}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default NoteCard; 