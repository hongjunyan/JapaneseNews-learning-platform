import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import { getNewsById } from '../api/newsApi';
import MarkdownPreview from '../components/MarkdownPreview';

// Helper function to extract YouTube ID from URL
const getYoutubeEmbedUrl = (url) => {
  if (!url) return null;
  
  // Match YouTube URL patterns
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  
  if (match && match[2].length === 11) {
    // Return embed URL format
    return `https://www.youtube.com/embed/${match[2]}`;
  }
  
  return null;
};

const ViewNote = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [youtubeEmbedUrl, setYoutubeEmbedUrl] = useState(null);

  // Fetch news data on component mount
  useEffect(() => {
    const fetchNewsData = async () => {
      try {
        const data = await getNewsById(id);
        setNews(data);
        setYoutubeEmbedUrl(getYoutubeEmbedUrl(data.youtube_url));
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

  // Render loading spinner
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  // Render error message
  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  // Render news content
  return (
    <div>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          {news?.title}
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/')}
          >
            Back
          </Button>
          <Button
            variant="contained"
            color="primary"
            startIcon={<EditIcon />}
            onClick={() => navigate(`/edit/${id}`)}
          >
            Edit
          </Button>
        </Box>
      </Box>
      
      {youtubeEmbedUrl && (
        <Paper
          elevation={2}
          sx={{
            p: 2,
            borderRadius: 2,
            backgroundColor: '#fff',
            mb: 3,
            width: '100%',
            maxWidth: '800px',
            mx: 'auto'
          }}
        >
          <Box
            sx={{
              position: 'relative',
              paddingBottom: '56.25%', // 16:9 aspect ratio
              height: 0,
              overflow: 'hidden',
              maxWidth: '100%',
              width: '100%'
            }}
          >
            <iframe
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                border: 'none'
              }}
              src={youtubeEmbedUrl}
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </Box>
        </Paper>
      )}
      
      <Paper 
        elevation={2}
        sx={{
          p: 4,
          borderRadius: 2,
          backgroundColor: '#fff',
          minHeight: '400px'
        }}
      >
        <MarkdownPreview content={news?.content} />
      </Paper>
    </div>
  );
};

export default ViewNote; 