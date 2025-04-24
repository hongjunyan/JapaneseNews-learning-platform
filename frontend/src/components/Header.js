import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import AddIcon from '@mui/icons-material/Add';
import SvgIcon from '@mui/material/SvgIcon';

// Custom Japanese mount Fuji icon
const FujiIcon = (props) => (
  <SvgIcon {...props}>
    <path d="M12,3 L4,21 H20 L12,3 Z M7,19 L8.8,15 H15.2 L17,19 H7 Z" />
  </SvgIcon>
);

// Custom Japanese paper lantern icon
const LanternIcon = (props) => (
  <SvgIcon {...props}>
    <path d="M12,2 C8,2 6,5 6,8 C6,11 6,16 6,19 C6,20 7,21 8,21 L16,21 C17,21 18,20 18,19 C18,16 18,11 18,8 C18,5 16,2 12,2 Z M12,4 C14,4 16,5 16,8 C16,9 14,10 12,10 C10,10 8,9 8,8 C8,5 10,4 12,4 Z M8,12 H16 V14 H8 Z M8,16 H16 V18 H8 Z" />
  </SvgIcon>
);

const Header = () => {
  return (
    <AppBar position="static" sx={{ 
      backgroundColor: '#FFFFFF',
      color: '#D22630',
    }}>
      <Toolbar>
        <FujiIcon sx={{ mr: 1, color: '#D22630' }} />
        <Typography 
          variant="h6" 
          component={RouterLink} 
          to="/" 
          color="inherit" 
          sx={{ 
            flexGrow: 1, 
            textDecoration: 'none',
            fontWeight: 500,
            letterSpacing: '0.5px',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Box component="span" sx={{ mr: 0.5, fontFamily: "'Noto Sans JP', sans-serif" }}>日本</Box>
          <Box component="span">News Notes</Box>
        </Typography>
        
        <LanternIcon sx={{ mx: 1, color: '#D22630', opacity: 0.7 }} />
        
        <Button 
          component={RouterLink} 
          to="/new" 
          color="inherit" 
          startIcon={<AddIcon />}
          sx={{
            border: '1px solid #D22630',
            '&:hover': {
              backgroundColor: 'rgba(210, 38, 48, 0.05)',
            }
          }}
        >
          New Note
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Header; 