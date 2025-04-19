import React from 'react';
import { Card, CardContent, CardActions, Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';

const NewsCard = ({ news, onDelete }) => {
  const navigate = useNavigate();
  
  const handleViewClick = () => {
    navigate(`/news/${news.id}`);
  };
  
  const handleEditClick = () => {
    navigate(`/edit/${news.id}`);
  };
  
  const handleDeleteClick = () => {
    if (window.confirm('Are you sure you want to delete this news?')) {
      onDelete(news.id);
    }
  };
  
  return (
    <Card sx={{ mb: 2, boxShadow: 2 }}>
      <CardContent>
        <Typography variant="h5" component="div" gutterBottom>
          {news.title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Created: {new Date(news.created_at).toLocaleDateString()}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Notes: {news.notes.length}
        </Typography>
      </CardContent>
      <CardActions sx={{ justifyContent: 'flex-end' }}>
        <Box>
          <Button 
            size="small" 
            color="primary" 
            startIcon={<VisibilityIcon />}
            onClick={handleViewClick}
            sx={{ mr: 1 }}
          >
            View
          </Button>
          <Button 
            size="small" 
            color="secondary" 
            startIcon={<EditIcon />}
            onClick={handleEditClick}
            sx={{ mr: 1 }}
          >
            Edit
          </Button>
          <Button 
            size="small" 
            color="error" 
            startIcon={<DeleteIcon />}
            onClick={handleDeleteClick}
          >
            Delete
          </Button>
        </Box>
      </CardActions>
    </Card>
  );
};

export default NewsCard; 