import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import EditIcon from '@mui/icons-material/Edit';
import Fab from '@mui/material/Fab';
import DownloadIcon from '@mui/icons-material/Download';
import { getNewsById } from '../api/newsApi';
import MarkdownPreview from '../components/MarkdownPreview';
import { useTheme } from '@mui/material/styles';
import html2pdf from 'html2pdf.js';

// Helper function to extract YouTube ID from URL
const getYoutubeEmbedUrl = (url) => {
  if (!url) return null;
  
  // Match YouTube URL patterns
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  
  if (match && match[2].length === 11) {
    // Return embed URL format
    return `https://www.youtube.com/embed/${match[2]}`;
  }
  
  return null;
};

const ViewNote = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const contentRef = useRef(null);
  
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [youtubeEmbedUrl, setYoutubeEmbedUrl] = useState(null);

  // Fetch news data on component mount
  useEffect(() => {
    const fetchNewsData = async () => {
      try {
        const data = await getNewsById(id);
        setNews(data);
        setYoutubeEmbedUrl(getYoutubeEmbedUrl(data.youtube_url));
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

  const handleDownloadPdf = () => {
    if (!contentRef.current) return;
    
    // Create a clone of the content for PDF generation to avoid modifying the displayed content
    const clonedElement = contentRef.current.cloneNode(true);
    
    // Add title to PDF
    const titleElement = document.createElement('h1');
    titleElement.innerText = news?.title || 'Note';
    titleElement.style.fontFamily = '"Shippori Mincho", serif';
    titleElement.style.color = '#2D4B8D';
    titleElement.style.marginBottom = '20px';
    titleElement.style.paddingBottom = '10px';
    titleElement.style.borderBottom = '1px solid #EEEEEE';
    
    // Insert title at the beginning of content
    clonedElement.insertBefore(titleElement, clonedElement.firstChild);
    
    // Remove preview title if exists
    const previewTitles = clonedElement.querySelectorAll('h6');
    previewTitles.forEach(title => {
      if (title.textContent === 'プレビュー') {
        title.remove();
      }
    });
    
    // Configure pdf options
    const options = {
      margin: [15, 15, 15, 15],
      filename: `${news?.title || 'note'}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { 
        scale: 2, 
        useCORS: true,
        letterRendering: true,
        logging: false
      },
      jsPDF: { 
        unit: 'mm', 
        format: 'a4', 
        orientation: 'portrait',
        compress: true
      },
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
    };
    
    // Generate PDF
    html2pdf().from(clonedElement).set(options).save();
  };

  // Render loading spinner
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
        <CircularProgress sx={{ color: theme.palette.secondary.main }} />
      </Box>
    );
  }

  // Render error message
  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  // Render news content
  return (
    <Box className="japan-pattern" sx={{ pb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" color="secondary">
          {news?.title}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<DownloadIcon />}
          onClick={handleDownloadPdf}
          sx={{
            backgroundColor: theme.palette.custom?.asagi || '#5FB3BF',
            '&:hover': {
              backgroundColor: theme.palette.custom?.asagi ? theme.palette.custom.asagi + '99' : '#4CA3AF',
            },
          }}
        >
          Download PDF
        </Button>
      </Box>
      
      {youtubeEmbedUrl && (
        <Paper
          elevation={2}
          sx={{
            p: 2,
            borderRadius: 2,
            backgroundColor: '#FAFAFA',
            mb: 3,
            width: '100%',
            maxWidth: '800px',
            mx: 'auto',
            border: '1px solid rgba(45, 75, 141, 0.1)',
          }}
        >
          <Box
            sx={{
              position: 'relative',
              paddingBottom: '56.25%', // 16:9 aspect ratio
              height: 0,
              overflow: 'hidden',
              maxWidth: '100%',
              width: '100%'
            }}
          >
            <iframe
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                border: 'none'
              }}
              src={youtubeEmbedUrl}
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </Box>
        </Paper>
      )}
      
      <Paper 
        elevation={2}
        sx={{
          p: 4,
          borderRadius: 2,
          backgroundColor: '#FAFAFA',
          minHeight: '400px',
          border: '1px solid rgba(45, 75, 141, 0.1)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)',
        }}
      >
        <div ref={contentRef}>
          <MarkdownPreview content={news?.content} noScroll={true} />
        </div>
      </Paper>

      {/* Floating Edit Button */}
      <Fab
        color="secondary"
        aria-label="edit"
        onClick={() => navigate(`/edit/${id}`)}
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        }}
      >
        <EditIcon />
      </Fab>
    </Box>
  );
};

export default ViewNote; 