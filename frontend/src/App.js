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
      light: '#F5A7A3', // Light version for highlights
    },
    secondary: {
      main: '#2A4B7C', // Deep Japanese indigo
      light: '#A1BDE6', // Light version for accents
    },
    background: {
      default: '#FFFEF7', // Warm white background like Ghibli papers
      paper: '#FFFFFF', // White for cards
    },
    text: {
      primary: '#333333', // Deep charcoal for main text
      secondary: '#555555', // Slightly darker gray for better readability
    },
    ghibli: {
      teal: '#68B0AB', // Soft teal from Spirited Away
      sage: '#8FC0A9', // Muted sage green from Totoro
      wheat: '#F9DBC6', // Warm wheat color from Howl's Moving Castle
      dust: '#F1AB86', // Dusty rose color from Castle in the Sky
      moss: '#7A9E7E', // Moss green from Princess Mononoke
    }
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
      fontFamily: "'Shippori Mincho', serif",
    },
    h6: {
      fontWeight: 500,
      fontFamily: "'Shippori Mincho', serif",
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6, // Improved line height for better readability
    },
    body2: {
      fontSize: '0.925rem',
      lineHeight: 1.6,
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
          background: '#FFFEF7',
          backgroundImage: 'url(/japanese-subtle-pattern.png)',
          backgroundRepeat: 'repeat',
          backgroundAttachment: 'fixed',
          backgroundSize: '400px auto',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '8px',
            background: 'linear-gradient(to right, #D22630, #68B0AB, #8FC0A9, #F9DBC6, #F1AB86)',
            opacity: 0.75,
            zIndex: 1
          }
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