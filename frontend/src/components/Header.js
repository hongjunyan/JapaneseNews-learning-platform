import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import AddIcon from '@mui/icons-material/Add';
import SvgIcon from '@mui/material/SvgIcon';
import { useTheme } from '@mui/material/styles';

// Custom Japanese mount Fuji icon
const FujiIcon = (props) => (
  <SvgIcon {...props} viewBox="0 0 24 24">
    <path d="M12,3 L4,21 H20 L12,3 Z M8,19 L9.5,16 H14.5 L16,19 H8 Z M11,7 L12,5 L13,7 L12,8 L11,7 Z" />
  </SvgIcon>
);

// Custom Japanese torii gate icon
const ToriiIcon = (props) => (
  <SvgIcon {...props} viewBox="0 0 24 24">
    <path d="M5,5 H19 V7 H17 V18 H15 V7 H13.5 V16 H10.5 V7 H9 V18 H7 V7 H5 V5 Z M4,4 V8 H6 V19 H10 V8 H14 V19 H18 V8 H20 V4 H4 Z" />
  </SvgIcon>
);

const Header = () => {
  const theme = useTheme();

  return (
    <AppBar 
      position="sticky" 
      elevation={0}
      sx={{ 
        backgroundColor: 'rgba(255, 255, 255, 0.85)',
        backdropFilter: 'blur(8px)',
        borderBottom: '1px solid rgba(0,0,0,0.05)',
      }}
    >
      <Box 
        sx={{ 
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: `linear-gradient(to right, ${theme.palette.primary.main}, ${theme.palette.custom.karakurenai}, ${theme.palette.secondary.main})`,
          opacity: 0.9,
        }} 
      />
      
      <Toolbar sx={{ p: { xs: 1, sm: 2 } }}>
        {/* Logo section with gradient effect */}
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            flexGrow: 1,
          }}
        >
          <Box 
            sx={{ 
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mr: 1.5,
              width: 42,
              height: 42,
              borderRadius: '50%',
              background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.custom.karakurenai})`,
              boxShadow: '0 2px 12px rgba(0,0,0,0.1)',
              color: 'white',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: -1,
                left: -1,
                right: -1,
                bottom: -1,
                background: 'white',
                borderRadius: '50%',
                zIndex: -1,
              },
              '&::after': {
                content: '""',
                position: 'absolute',
                top: -3,
                left: -3,
                right: -3,
                bottom: -3,
                background: 'linear-gradient(135deg, rgba(232, 57, 41, 0.3), rgba(208, 16, 76, 0.3))',
                borderRadius: '50%',
                zIndex: -2,
                filter: 'blur(2px)',
              }
            }} 
          >
            <FujiIcon sx={{ fontSize: 24 }} />
          </Box>
          
          <Typography 
            variant="h6" 
            component={RouterLink} 
            to="/" 
            sx={{ 
              textDecoration: 'none',
              fontWeight: 500,
              letterSpacing: '0.5px',
              display: 'flex',
              alignItems: 'center',
              color: 'text.primary',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-1px)'
              }
            }}
          >
            <Box component="span" sx={{ 
              mr: 0.5, 
              fontFamily: "'Noto Sans JP', sans-serif", 
              background: `linear-gradient(to right, ${theme.palette.primary.main}, ${theme.palette.custom.karakurenai})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 700,
              position: 'relative',
              '&::after': {
                content: '""',
                position: 'absolute',
                bottom: -2,
                left: 0,
                width: '100%',
                height: 2,
                background: `linear-gradient(to right, ${theme.palette.primary.main}, ${theme.palette.custom.karakurenai})`, 
                opacity: 0.3,
              }
            }}>日本語</Box>
            <Box component="span" sx={{ 
              color: theme.palette.secondary.main, 
              fontWeight: 600,
              position: 'relative',
              '&::after': {
                content: '""',
                position: 'absolute',
                bottom: -2,
                left: 0,
                width: '100%',
                height: 2,
                background: theme.palette.secondary.main,
                opacity: 0,
                transition: 'opacity 0.3s ease',
              },
              '&:hover::after': {
                opacity: 0.3
              }
            }}>学習</Box>
          </Typography>
        </Box>
        
        <Box sx={{ 
          position: 'relative', 
          mx: 2,
          animation: 'float 4s infinite ease-in-out',
          '@keyframes float': {
            '0%, 100%': { transform: 'translateY(0px)' },
            '50%': { transform: 'translateY(-3px)' }
          }
        }}>
          <ToriiIcon sx={{ 
            color: theme.palette.primary.main, 
            fontSize: 28
          }} />
        </Box>
        
        <Button 
          component={RouterLink} 
          to="/new" 
          startIcon={<AddIcon />}
          variant="contained"
          sx={{
            background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.custom.karakurenai})`,
            boxShadow: '0 4px 12px rgba(232, 57, 41, 0.2)',
            transition: 'all 0.3s ease',
            '&:hover': {
              boxShadow: '0 6px 16px rgba(232, 57, 41, 0.3)',
              transform: 'translateY(-2px)'
            }
          }}
        >
          新しいノート
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Header; 