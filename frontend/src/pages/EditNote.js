import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import { getNewsById, updateNews } from '../api/newsApi';
import MarkdownEditor from '../components/MarkdownEditor';
import MarkdownPreview from '../components/MarkdownPreview';
import Zoom from '@mui/material/Zoom';
import Fab from '@mui/material/Fab';
import Tooltip from '@mui/material/Tooltip';

const EditNote = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  // Fetch news data on component mount
  useEffect(() => {
    const fetchNewsData = async () => {
      try {
        const data = await getNewsById(id);
        setTitle(data.title);
        setContent(data.content);
        setYoutubeUrl(data.youtube_url || '');
        setError(null);
      } catch (error) {
        setError('Failed to fetch news data. Please try again later.');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchNewsData();
  }, [id]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title.trim()) {
      setError('Please enter a title');
      return;
    }
    
    try {
      setSaving(true);
      await updateNews(id, { title, content, youtube_url: youtubeUrl });
      navigate(`/view/${id}`);
    } catch (error) {
      setError('Failed to update note. Please try again.');
      console.error(error);
      setSaving(false);
    }
  };

  // Render loading spinner
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: '95%', mx: 'auto', position: 'relative', pb: 6 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Edit Note
      </Typography>
      
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      
      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ width: '100%' }}>
        <TextField
          margin="normal"
          required
          fullWidth
          id="title"
          label="Title"
          name="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          sx={{ mb: 2 }}
        />
        
        <TextField
          margin="normal"
          fullWidth
          id="youtubeUrl"
          label="YouTube URL"
          name="youtubeUrl"
          placeholder="https://www.youtube.com/watch?v=..."
          value={youtubeUrl}
          onChange={(e) => setYoutubeUrl(e.target.value)}
          sx={{ mb: 3 }}
        />
        
        <Grid container spacing={2} sx={{ maxWidth: '100%' }}>
          <Grid item xs={12} md={6} sx={{ width: '100%' }}>
            <MarkdownEditor
              value={content}
              onChange={setContent}
            />
          </Grid>
          <Grid item xs={12} md={6} sx={{ width: '100%' }}>
            <MarkdownPreview content={content} />
          </Grid>
        </Grid>
        
        <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            startIcon={<SaveIcon />}
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            startIcon={<CancelIcon />}
            onClick={() => navigate('/')}
            disabled={saving}
          >
            Cancel
          </Button>
        </Box>
      </Box>
      
      {/* Floating save button */}
      <Zoom in={true}>
        <Tooltip title="Save Changes">
          <Fab
            color="primary"
            aria-label="save"
            onClick={handleSubmit}
            disabled={saving}
            sx={{
              position: 'fixed',
              bottom: '20px',
              right: '20px',
              zIndex: 999,
              backgroundColor: '#2A4B7C',
              '&:hover': {
                backgroundColor: '#1A3B6C',
              },
              boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
            }}
          >
            {saving ? <CircularProgress size={24} color="inherit" /> : <SaveIcon />}
          </Fab>
        </Tooltip>
      </Zoom>
    </Box>
  );
};

export default EditNote; 