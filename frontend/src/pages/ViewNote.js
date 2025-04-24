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

const ViewNote = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch news data on component mount
  useEffect(() => {
    const fetchNewsData = async () => {
      try {
        const data = await getNewsById(id);
        setNews(data);
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