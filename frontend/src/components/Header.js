import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import SearchIcon from '@mui/icons-material/Search';

const Header = () => {
  return (
    <AppBar position="fixed">
      <Toolbar>
        <MenuBookIcon sx={{ mr: 2 }} />
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          日本語ニュース学習プラットフォーム
        </Typography>
        <Box>
          <Button 
            color="inherit" 
            component={RouterLink} 
            to="/"
            sx={{ mx: 1 }}
          >
            ホーム
          </Button>
          <Button 
            color="inherit" 
            component={RouterLink} 
            to="/search"
            sx={{ mx: 1 }}
            startIcon={<SearchIcon />}
          >
            検索
          </Button>
          <Button 
            color="inherit" 
            component={RouterLink} 
            to="/create"
            variant="outlined"
            sx={{ ml: 1 }}
          >
            新しいニュース
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header; 