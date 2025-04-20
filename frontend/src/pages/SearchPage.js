import React, { useState } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  TextField, 
  Button, 
  CircularProgress,
  Alert,
  Divider
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import RichNoteViewer from '../components/RichNoteViewer';
import { searchNotes } from '../services/api';

const SearchPage = () => {
  const [keyword, setKeyword] = useState('');
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async () => {
    if (!keyword.trim()) return;

    try {
      setIsSearching(true);
      setError(null);
      const searchResults = await searchNotes(keyword.trim());
      setResults(searchResults);
      setHasSearched(true);
    } catch (error) {
      console.error('Error searching notes:', error);
      setError('Failed to search notes. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Search Notes
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
            label="Search Keyword"
            variant="outlined"
            fullWidth
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            disabled={isSearching}
            size="small"
            sx={{ mr: 2 }}
            onKeyPress={handleKeyPress}
            placeholder="Enter Japanese or Chinese keywords to search"
          />
          <Button
            variant="contained"
            color="primary"
            startIcon={<SearchIcon />}
            onClick={handleSearch}
            disabled={!keyword.trim() || isSearching}
          >
            {isSearching ? <CircularProgress size={24} color="inherit" /> : 'Search'}
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Divider sx={{ mb: 3 }} />

        {isSearching ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        ) : hasSearched ? (
          results.length === 0 ? (
            <Alert severity="info">
              No notes found for "{keyword}". Try a different keyword.
            </Alert>
          ) : (
            <Box>
              <Typography variant="h6" gutterBottom>
                Found {results.length} note{results.length !== 1 ? 's' : ''}:
              </Typography>
              {results.map(note => (
                <RichNoteViewer 
                  key={note.id}
                  note={note}
                />
              ))}
            </Box>
          )
        ) : null}
      </Box>
    </Container>
  );
};

export default SearchPage; 