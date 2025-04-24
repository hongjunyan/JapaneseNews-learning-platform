import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';

import Header from './components/Header';
import Home from './pages/Home';
import NewNote from './pages/NewNote';
import EditNote from './pages/EditNote';
import ViewNote from './pages/ViewNote';

// Create a Japanese-inspired theme with white background
const theme = createTheme({
  palette: {
    primary: {
      main: '#D22630', // Bright traditional Japanese red
    },
    secondary: {
      main: '#2A4B7C', // Deep Japanese indigo
    },
    background: {
      default: '#FFFFFF', // Clean white background
      paper: '#FFFFFF', // White for cards
    },
    text: {
      primary: '#333333', // Deep charcoal for main text
      secondary: '#666666', // Medium gray for secondary text
    },
  },
  typography: {
    fontFamily: [
      'Noto Sans JP',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
    h4: {
      fontWeight: 500,
    },
    h6: {
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 0, // More minimal, clean edges
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
          borderRadius: '0',
          border: '1px solid #EEEEEE',
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '0',
          textTransform: 'none',
          fontWeight: 500,
        }
      }
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
          borderBottom: '1px solid #EEEEEE',
        }
      }
    }
  }
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box 
        sx={{ 
          minHeight: '100vh',
          background: '#FFFFFF',
          backgroundImage: 'url(/japanese-subtle-pattern.png)',
          backgroundRepeat: 'repeat',
          backgroundAttachment: 'fixed',
          backgroundSize: '400px auto'
        }}
      >
        <Header />
        <Container maxWidth="lg" sx={{ mt: 3, mb: 4, pt: 2, pb: 6 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/new" element={<NewNote />} />
            <Route path="/edit/:id" element={<EditNote />} />
            <Route path="/view/:id" element={<ViewNote />} />
          </Routes>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App; 