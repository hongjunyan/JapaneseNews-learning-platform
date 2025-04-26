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

// Create a Japanese-inspired theme with cultural colors
const theme = createTheme({
  palette: {
    primary: {
      main: '#E83929', // Vermilion (朱色 Shu-iro) - traditional Japanese red
      light: '#F26957', // Lighter vermilion
      dark: '#C52F21', // Darker vermilion
    },
    secondary: {
      main: '#2D4B8D', // Kon (紺) - deep Japanese blue
      light: '#4F6CA3', // Lighter kon blue
      dark: '#1A3366', // Darker kon blue
    },
    background: {
      default: '#F5F2EB', // Warm rice paper color (和紙 washi)
      paper: '#FFFFFF', // White for cards
    },
    text: {
      primary: '#2A2522', // Dark brown (墨 sumi) for main text
      secondary: '#5C5552', // Medium brown for secondary text
    },
    // Japanese cultural color palette
    custom: {
      matcha: '#7B8D42', // Matcha green (抹茶色)
      sakura: '#FEDEDF', // Cherry blossom pink (桜色)
      fuji: '#8B81C3', // Wisteria purple (藤色)
      kuchiba: '#E2943B', // Fallen leaf amber (朽葉色)
      asagi: '#5FB3BF', // Light blue (浅葱色)
      hinoki: '#CF7449', // Cypress brown (檜色)
      karakurenai: '#D0104C', // Dark crimson (韓紅)
      lightBackground: '#F8F7F2', // Light washi paper
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
      letterSpacing: '0.02em',
    },
    h6: {
      fontWeight: 500,
      fontFamily: "'Shippori Mincho', serif",
      letterSpacing: '0.01em',
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
      letterSpacing: '0.01em',
    },
    body2: {
      fontSize: '0.925rem',
      lineHeight: 1.6,
      letterSpacing: '0.01em',
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
          borderRadius: '12px',
          transition: 'transform 0.3s, box-shadow 0.3s',
          overflow: 'hidden',
          border: 'none',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.08)',
          }
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          textTransform: 'none',
          fontWeight: 500,
          padding: '8px 16px',
          transition: 'all 0.3s ease',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            transform: 'translateY(-2px)',
          }
        },
        containedPrimary: {
          background: 'linear-gradient(135deg, #E83929 0%, #F26957 100%)',
          '&:hover': {
            background: 'linear-gradient(135deg, #D0331F 0%, #E35542 100%)',
          }
        },
        containedSecondary: {
          background: 'linear-gradient(135deg, #2D4B8D 0%, #4F6CA3 100%)',
          '&:hover': {
            background: 'linear-gradient(135deg, #1A3366 0%, #3C5A8F 100%)',
          }
        },
        outlined: {
          borderWidth: '1.5px',
          '&:hover': {
            borderWidth: '1.5px',
          }
        }
      }
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
          backdropFilter: 'blur(8px)',
          background: 'rgba(255, 255, 255, 0.95)',
        }
      }
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: '8px',
            transition: 'box-shadow 0.3s',
            '&:hover': {
              boxShadow: '0 0 0 4px rgba(232, 57, 41, 0.1)',
            },
            '&.Mui-focused': {
              boxShadow: '0 0 0 4px rgba(232, 57, 41, 0.2)',
            }
          }
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
        }
      }
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(to right, rgba(232, 57, 41, 0.2), rgba(45, 75, 141, 0.2))',
          height: '1px',
          border: 'none',
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
          background: 'linear-gradient(180deg, rgba(245, 242, 235, 0.9) 0%, rgba(248, 247, 242, 0.98) 100%)',
          backgroundAttachment: 'fixed',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '6px',
            background: 'linear-gradient(to right, #E83929, #D0104C, #2D4B8D, #8B81C3, #7B8D42)',
            opacity: 0.85,
            zIndex: 1
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'url(/japan-pattern.svg)',
            backgroundSize: '200px auto',
            backgroundRepeat: 'repeat',
            opacity: 0.05,
            pointerEvents: 'none',
            zIndex: 0
          }
        }}
      >
        <Header />
        <Container maxWidth="lg" sx={{ mt: 3, mb: 4, pt: 2, pb: 6, position: 'relative', zIndex: 1 }}>
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