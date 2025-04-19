import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Button, 
  TextField,
  CircularProgress,
  Alert
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';
import NewsCard from '../components/NewsCard';
import { getAllNews, deleteNews, createNews } from '../services/api';

const Home = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newTitle, setNewTitle] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  
  const navigate = useNavigate();
  
  useEffect(() => {
    fetchNews();
  }, []);
  
  const fetchNews = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllNews();
      setNews(data);
    } catch (error) {
      console.error('Error fetching news:', error);
      setError('Failed to load news. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleCreateNews = async () => {
    if (!newTitle.trim()) return;
    
    try {
      setIsCreating(true);
      const createdNews = await createNews(newTitle);
      navigate(`/edit/${createdNews.id}`);
    } catch (error) {
      console.error('Error creating news:', error);
      setError('Failed to create news. Please try again.');
      setIsCreating(false);
    }
  };
  
  const handleDeleteNews = async (newsId) => {
    try {
      await deleteNews(newsId);
      setNews(news.filter(item => item.id !== newsId));
    } catch (error) {
      console.error('Error deleting news:', error);
      setError('Failed to delete news. Please try again.');
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Japanese News Collection
        </Typography>
        
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center',
            mb: 3,
            p: 2,
            backgroundColor: '#f0f8ff',
            borderRadius: 1,
            boxShadow: 1
          }}
        >
          <TextField
            label="New News Title"
            variant="outlined"
            fullWidth
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            disabled={isCreating}
            size="small"
            sx={{ mr: 2 }}
          />
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleCreateNews}
            disabled={!newTitle.trim() || isCreating}
          >
            {isCreating ? <CircularProgress size={24} color="inherit" /> : 'Create'}
          </Button>
        </Box>
        
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        ) : news.length === 0 ? (
          <Alert severity="info">
            No news articles yet. Create your first one!
          </Alert>
        ) : (
          news.map(item => (
            <NewsCard 
              key={item.id}
              news={item}
              onDelete={handleDeleteNews}
            />
          ))
        )}
      </Box>
    </Container>
  );
};

export default Home; 