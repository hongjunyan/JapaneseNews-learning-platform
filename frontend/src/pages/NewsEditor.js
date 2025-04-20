import React, { useState, useEffect, useCallback } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Button, 
  TextField,
  CircularProgress, 
  Alert,
  Paper,
  Divider,
  Fab 
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AddIcon from '@mui/icons-material/Add';
import RichNoteEditor from '../components/RichNoteEditor';
import { 
  getNewsById, 
  createNote, 
  updateNote, 
  deleteNote,
  createNews,
  updateNews
} from '../services/api';

const NewsEditor = () => {
  const [newsData, setNewsData] = useState(null);
  const [title, setTitle] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  
  const { id } = useParams();
  const navigate = useNavigate();
  const isNewNews = !id;
  
  const fetchNewsDetail = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getNewsById(id);
      
      // Sort notes by order
      const sortedNotes = [...data.notes].sort((a, b) => a.order - b.order);
      
      // Use the data directly to update state
      setNewsData(data);
      setTitle(data.title);
      setYoutubeUrl(data.youtube_url || '');
      setNotes(sortedNotes);
    } catch (error) {
      console.error('Error fetching news details:', error);
      setError('Failed to load news details. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [id]);
  
  useEffect(() => {
    if (!isNewNews) {
      fetchNewsDetail();
    } else {
      setLoading(false);
    }
  }, [isNewNews, fetchNewsDetail]);
  
  const handleAddNote = () => {
    // Create a new note with the next order number
    const maxOrder = notes.length > 0 
      ? Math.max(...notes.map(note => note.order)) 
      : -1;
    
    const newNote = {
      id: `temp-${Date.now()}`, // Temporary ID until saved
      japanese_text: '',
      chinese_notes: '',
      text_style: JSON.stringify({
        fontSize: '1rem',
        color: '#000000',
        fontWeight: 'normal',
        fontStyle: 'normal',
        textDecoration: 'none',
        lineHeight: 1.5,
        custom: {}
      }),
      order: maxOrder + 1,
      news_id: id,
      isNew: true
    };
    
    setNotes([...notes, newNote]);
  };
  
  const handleSaveNote = async (updatedNote, index) => {
    try {
      setSaving(true);
      const note = notes[index];
      
      let savedNote;
      if (note.isNew) {
        // Create new note
        savedNote = await createNote(id, updatedNote);
      } else {
        // Update existing note
        savedNote = await updateNote(note.id, updatedNote);
      }
      
      // Update notes array
      const updatedNotes = [...notes];
      updatedNotes[index] = savedNote;
      setNotes(updatedNotes);
      
      setError(null);
    } catch (error) {
      console.error('Error saving note:', error);
      setError('Failed to save note. Please try again.');
    } finally {
      setSaving(false);
    }
  };
  
  const handleDeleteNote = async (index) => {
    try {
      const note = notes[index];
      
      if (!note.isNew) {
        // Only call API if the note was already saved
        await deleteNote(note.id);
      }
      
      // Remove from notes array
      const updatedNotes = notes.filter((_, i) => i !== index);
      
      // Update order values to ensure continuity
      const reorderedNotes = updatedNotes.map((note, idx) => ({
        ...note,
        order: idx
      }));
      
      setNotes(reorderedNotes);
      setError(null);
    } catch (error) {
      console.error('Error deleting note:', error);
      setError('Failed to delete note. Please try again.');
    }
  };
  
  const handleMoveNoteUp = async (index) => {
    if (index === 0) return; // Already at the top
    
    try {
      const updatedNotes = [...notes];
      const temp = updatedNotes[index];
      
      // Swap with previous note
      updatedNotes[index] = updatedNotes[index - 1];
      updatedNotes[index - 1] = temp;
      
      // Update order values
      updatedNotes[index].order = index;
      updatedNotes[index - 1].order = index - 1;
      
      setNotes(updatedNotes);
      
      // Update notes in the database
      if (!updatedNotes[index].isNew) {
        await updateNote(updatedNotes[index].id, {
          ...updatedNotes[index],
          order: index
        });
      }
      
      if (!updatedNotes[index - 1].isNew) {
        await updateNote(updatedNotes[index - 1].id, {
          ...updatedNotes[index - 1],
          order: index - 1
        });
      }
    } catch (error) {
      console.error('Error reordering notes:', error);
      setError('Failed to reorder notes. Please try again.');
      fetchNewsDetail(); // Reload to get consistent state
    }
  };
  
  const handleMoveNoteDown = async (index) => {
    if (index === notes.length - 1) return; // Already at the bottom
    
    try {
      const updatedNotes = [...notes];
      const temp = updatedNotes[index];
      
      // Swap with next note
      updatedNotes[index] = updatedNotes[index + 1];
      updatedNotes[index + 1] = temp;
      
      // Update order values
      updatedNotes[index].order = index;
      updatedNotes[index + 1].order = index + 1;
      
      setNotes(updatedNotes);
      
      // Update notes in the database
      if (!updatedNotes[index].isNew) {
        await updateNote(updatedNotes[index].id, {
          ...updatedNotes[index],
          order: index
        });
      }
      
      if (!updatedNotes[index + 1].isNew) {
        await updateNote(updatedNotes[index + 1].id, {
          ...updatedNotes[index + 1],
          order: index + 1
        });
      }
    } catch (error) {
      console.error('Error reordering notes:', error);
      setError('Failed to reorder notes. Please try again.');
      fetchNewsDetail(); // Reload to get consistent state
    }
  };
  
  const handleGoBack = () => {
    navigate('/');
  };
  
  const handleViewNews = () => {
    if (id) {
      navigate(`/news/${id}`);
    }
  };
  
  const createdDate = newsData ? new Date(newsData.created_at).toLocaleDateString() : '';
  
  const handleSaveNews = async () => {
    try {
      setSaving(true);
      if (isNewNews) {
        const newNews = await createNews(title, youtubeUrl || null);
        navigate(`/edit/${newNews.id}`);
      } else {
        // Update news title and youtube_url
        const updatedNews = await updateNews(id, {
          title,
          youtube_url: youtubeUrl || null
        });
        setNewsData(updatedNews);
      }
      setError(null);
    } catch (error) {
      console.error('Error saving news:', error);
      setError('Failed to save news. Please try again.');
    } finally {
      setSaving(false);
    }
  };
  
  if (loading) {
    return (
      <Container maxWidth="md">
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }
  
  return (
    <Container maxWidth="md">
      <Paper sx={{ p: 3, mb: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Button 
            startIcon={<ArrowBackIcon />} 
            onClick={handleGoBack}
          >
            Back to Home
          </Button>
          
          {!isNewNews && (
            <Button
              variant="outlined"
              startIcon={<VisibilityIcon />}
              onClick={handleViewNews}
            >
              View
            </Button>
          )}
        </Box>
        
        <Typography variant="h4" gutterBottom>
          {isNewNews ? 'Create New News' : `Edit News: ${title}`}
        </Typography>
        
        {newsData && !isNewNews && (
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Created on: {createdDate}
          </Typography>
        )}
        
        <TextField
          label="News Title"
          variant="outlined"
          fullWidth
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={saving}
          sx={{ mb: 3 }}
        />
        
        <TextField
          label="YouTube Video URL (optional)"
          variant="outlined"
          fullWidth
          value={youtubeUrl}
          onChange={(e) => setYoutubeUrl(e.target.value)}
          disabled={saving}
          placeholder="https://www.youtube.com/watch?v=..."
          helperText="Add a YouTube video URL related to this content"
          sx={{ mb: 3 }}
        />
        
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSaveNews}
            disabled={saving || !title.trim()}
          >
            {isNewNews ? 'Create News' : 'Save Changes'}
          </Button>
        </Box>
        
        {error && (
          <Alert severity="error" sx={{ my: 2 }}>
            {error}
          </Alert>
        )}
        
        <Divider sx={{ my: 3 }} />
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5">
            Notes ({notes.length})
          </Typography>
        </Box>
        
        {notes.map((note, index) => (
          <RichNoteEditor 
            key={note.id}
            note={note}
            onSave={(updatedNote) => handleSaveNote(updatedNote, index)}
            onDelete={() => handleDeleteNote(index)}
            onMoveUp={index > 0 ? () => handleMoveNoteUp(index) : null}
            onMoveDown={index < notes.length - 1 ? () => handleMoveNoteDown(index) : null}
            isNew={note.isNew}
          />
        ))}
        
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleAddNote}
            disabled={saving}
          >
            Add Note
          </Button>
        </Box>
      </Paper>
      
      <Fab
        color="secondary"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        onClick={handleViewNews}
        disabled={isNewNews || saving}
      >
        <VisibilityIcon />
      </Fab>
    </Container>
  );
};

export default NewsEditor; 