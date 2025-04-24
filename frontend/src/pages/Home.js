import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import IconButton from '@mui/material/IconButton';
import ClearIcon from '@mui/icons-material/Clear';
import Paper from '@mui/material/Paper';
import Divider from '@mui/material/Divider';
import { getAllNews, deleteNews, searchNews } from '../api/newsApi';

// Japanese decorative elements
const cherryBlossom = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 60 60'%3E%3Cpath d='M30,10 C34,10 36,14 36,18 C36,22 34,26 30,26 C26,26 24,22 24,18 C24,14 26,10 30,10 Z' fill='%23FFD7D7'/%3E%3Cpath d='M30,34 C34,34 36,38 36,42 C36,46 34,50 30,50 C26,50 24,46 24,42 C24,38 26,34 30,34 Z' fill='%23FFD7D7'/%3E%3Cpath d='M10,30 C10,26 14,24 18,24 C22,24 26,26 26,30 C26,34 22,36 18,36 C14,36 10,34 10,30 Z' fill='%23FFD7D7'/%3E%3Cpath d='M34,30 C34,26 38,24 42,24 C46,24 50,26 50,30 C50,34 46,36 42,36 C38,36 34,34 34,30 Z' fill='%23FFD7D7'/%3E%3Cpath d='M17,17 C20,14 24,14 27,17 C30,20 30,24 27,27 C24,30 20,30 17,27 C14,24 14,20 17,17 Z' fill='%23FFD7D7'/%3E%3Cpath d='M33,33 C36,30 40,30 43,33 C46,36 46,40 43,43 C40,46 36,46 33,43 C30,40 30,36 33,33 Z' fill='%23FFD7D7'/%3E%3Cpath d='M33,17 C36,14 40,14 43,17 C46,20 46,24 43,27 C40,30 36,30 33,27 C30,24 30,20 33,17 Z' fill='%23FFD7D7'/%3E%3Cpath d='M17,33 C20,30 24,30 27,33 C30,36 30,40 27,43 C24,46 20,46 17,43 C14,40 14,36 17,33 Z' fill='%23FFD7D7'/%3E%3Ccircle cx='30' cy='30' r='5' fill='%23FFAAAA'/%3E%3C/svg%3E";

const Home = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  // Fetch news on component mount
  useEffect(() => {
    fetchNews();
  }, []);

  // Fetch all news entries
  const fetchNews = async () => {
    try {
      setLoading(true);
      const data = await getAllNews();
      setNews(data);
      setError(null);
    } catch (error) {
      setError('Failed to fetch news. Please try again later.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Handle search
  const handleSearch = async () => {
    if (!searchKeyword.trim()) {
      return fetchNews();
    }
    
    try {
      setIsSearching(true);
      const data = await searchNews(searchKeyword);
      setNews(data);
      setError(null);
    } catch (error) {
      setError('Failed to search news. Please try again later.');
      console.error(error);
    } finally {
      setIsSearching(false);
    }
  };

  // Clear search and show all news
  const clearSearch = () => {
    setSearchKeyword('');
    fetchNews();
  };

  // Handle keyword input and trigger search on Enter key
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // Handle news deletion
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this news entry?')) {
      try {
        await deleteNews(id);
        fetchNews(); // Refresh the list after deletion
      } catch (error) {
        setError('Failed to delete news entry. Please try again.');
        console.error(error);
      }
    }
  };

  // Render loading spinner
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
        <CircularProgress sx={{ color: '#D22630' }} />
      </Box>
    );
  }

  return (
    <Box sx={{ position: 'relative' }}>
      {/* Cherry Blossom decoration - top right */}
      <Box sx={{ 
        position: 'absolute', 
        top: -20, 
        right: -20, 
        width: 60, 
        height: 60,
        backgroundImage: `url("${cherryBlossom}")`,
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        opacity: 0.7,
        zIndex: 0
      }} />
      
      {/* Page title */}
      <Typography 
        variant="h4" 
        component="h1" 
        gutterBottom 
        className="jp-page-title" 
        sx={{ 
          fontFamily: "'Shippori Mincho', serif",
          fontWeight: 600,
          color: '#333333',
          mt: 3, 
          mb: 4
        }}
      >
        日本語 News Notes
      </Typography>
      
      {/* Beautiful Japanese-style banner */}
      <Box sx={{ 
        width: '100%', 
        height: '200px', 
        backgroundImage: 'url(/japanese-banner.svg)', 
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        mb: 4,
        border: '1px solid #EEEEEE'
      }} />
      
      {/* Search Bar */}
      <Paper elevation={0} sx={{ mb: 4, p: 3, backgroundColor: '#FFFFFF', border: '1px solid #EEEEEE' }}>
        <Box sx={{ display: 'flex' }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search by keyword..."
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            onKeyDown={handleKeyDown}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: 'text.secondary' }} />
                </InputAdornment>
              ),
              endAdornment: searchKeyword && (
                <InputAdornment position="end">
                  <IconButton onClick={clearSearch} edge="end" size="small">
                    <ClearIcon />
                  </IconButton>
                </InputAdornment>
              )
            }}
            disabled={isSearching}
            sx={{ 
              backgroundColor: '#FFFFFF',
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: '#DDDDDD' },
                '&:hover fieldset': { borderColor: '#D22630' },
                '&.Mui-focused fieldset': { borderColor: '#D22630' },
              }
            }}
          />
          <Button 
            variant="contained" 
            onClick={handleSearch} 
            sx={{ 
              ml: 1,
              backgroundColor: '#D22630',
              '&:hover': {
                backgroundColor: '#B31B1B',
              } 
            }}
            disabled={isSearching}
          >
            {isSearching ? <CircularProgress size={24} color="inherit" /> : "Search"}
          </Button>
        </Box>
      </Paper>
      
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      
      {/* Search Results Info */}
      {searchKeyword && news.length > 0 && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Found {news.length} result{news.length !== 1 ? 's' : ''} for "{searchKeyword}"
          </Typography>
        </Box>
      )}
      
      {news.length === 0 ? (
        <Alert severity="info" sx={{ backgroundColor: '#FAFAFA', color: '#666666', border: '1px solid #EEEEEE' }}>
          {searchKeyword 
            ? `No results found for "${searchKeyword}". Try different keywords.` 
            : "No news entries found. Click \"New Note\" to create your first entry!"}
        </Alert>
      ) : (
        <Grid container spacing={3}>
          {news.map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item.id}>
              <Card className="jp-card" sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1, pt: 3, pb: 1 }}>
                  <Typography 
                    variant="h6" 
                    component="h2" 
                    gutterBottom 
                    sx={{ 
                      fontFamily: "'Shippori Mincho', serif",
                      fontWeight: 600,
                      color: '#333333'
                    }}
                  >
                    {item.title}
                  </Typography>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="body2" color="text.secondary">
                    更新日: {new Date(item.updated_at).toLocaleString()}
                  </Typography>
                </CardContent>
                <CardActions sx={{ 
                  p: 2,
                  backgroundColor: '#FAFAFA',
                  borderTop: '1px solid #EEEEEE',
                }}>
                  <Button 
                    component={RouterLink} 
                    to={`/view/${item.id}`} 
                    size="small" 
                    startIcon={<VisibilityIcon />}
                    sx={{ color: '#2A4B7C' }}
                  >
                    View
                  </Button>
                  <Button 
                    component={RouterLink} 
                    to={`/edit/${item.id}`} 
                    size="small" 
                    startIcon={<EditIcon />}
                    sx={{ color: '#2A4B7C' }}
                  >
                    Edit
                  </Button>
                  <Button 
                    size="small" 
                    color="error" 
                    startIcon={<DeleteIcon />}
                    onClick={() => handleDelete(item.id)}
                    sx={{ ml: 'auto', color: '#D22630' }}
                  >
                    Delete
                  </Button>
                </CardActions>
                {/* Corner decoration */}
                <Box className="jp-corner" />
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default Home; 