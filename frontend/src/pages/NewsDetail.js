import React, { useState, useEffect, useRef } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Button, 
  CircularProgress, 
  Alert,
  Paper,
  Divider,
  Tooltip
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DownloadIcon from '@mui/icons-material/Download';
import NoteCard from '../components/NoteCard';
import RichNoteViewer from '../components/RichNoteViewer';
import { getNewsById } from '../services/api';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// Helper function to extract YouTube video ID from URL
const getYoutubeVideoId = (url) => {
  if (!url) return null;
  
  // Handle different YouTube URL formats
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  
  return (match && match[2].length === 11) ? match[2] : null;
};

const NewsDetail = () => {
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pdfGenerating, setPdfGenerating] = useState(false);
  const contentRef = useRef(null);
  
  const { id } = useParams();
  const navigate = useNavigate();
  
  useEffect(() => {
    fetchNewsDetail();
  }, [id]);
  
  const fetchNewsDetail = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getNewsById(id);
      
      // Sort notes by order
      data.notes.sort((a, b) => a.order - b.order);
      
      setNews(data);
    } catch (error) {
      console.error('Error fetching news details:', error);
      setError('Failed to load news details. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleGoBack = () => {
    navigate('/');
  };
  
  const handleEdit = () => {
    navigate(`/edit/${id}`);
  };
  
  const handleDownloadPDF = async () => {
    if (!contentRef.current) return;
    
    try {
      setPdfGenerating(true);
      
      // 準備 PDF 格式設定
      const contentElement = contentRef.current;
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const margin = 10; // 邊距，單位是毫米
      
      // 獲取元素尺寸
      const contentWidth = contentElement.offsetWidth;
      const contentHeight = contentElement.offsetHeight;
      
      // 計算縮放比例，確保內容適合 PDF 頁面寬度
      const scale = (pdfWidth - 2 * margin) / contentWidth;
      
      // 估算需要的頁數
      const scaledContentHeight = contentHeight * scale;
      const totalPages = Math.ceil(scaledContentHeight / (pdfHeight - 2 * margin));
      
      console.log(`Generating PDF: ${totalPages} pages estimated`);
      
      // 將 HTML 內容轉換為 canvas
      const canvas = await html2canvas(contentElement, {
        scale: 2, // 較高的分辨率
        useCORS: true, // 允許跨域圖片
        logging: false,
        onclone: (document) => {
          // 在複製後的 DOM 中修正一些樣式以便更好地轉換為 PDF
          const clonedContent = document.querySelector('#pdf-content');
          if (clonedContent) {
            clonedContent.style.width = `${contentWidth}px`;
            clonedContent.style.margin = '0';
            clonedContent.style.padding = '10px';
            clonedContent.style.boxShadow = 'none';
          }
        }
      });
      
      // 將 canvas 轉換為圖片
      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      
      // 計算實際高度和需要的頁數
      const imgHeight = canvas.height;
      const imgWidth = canvas.width;
      const ratio = imgWidth / imgHeight;
      
      // 設置 PDF 頁面尺寸
      const pageHeight = pdfHeight - 2 * margin;
      const imgWidthPdf = pdfWidth - 2 * margin;
      const imgHeightPdf = imgWidthPdf / ratio;
      
      // 如果內容較長，分多頁添加
      if (imgHeightPdf > pageHeight) {
        let heightLeft = imgHeightPdf;
        let position = 0;
        let page = 1;
        
        // 第一頁
        pdf.addImage(imgData, 'JPEG', margin, margin, imgWidthPdf, imgHeightPdf);
        heightLeft -= pageHeight;
        
        // 添加更多頁面
        while (heightLeft > 0) {
          position = pageHeight * page;
          page++;
          
          // 添加新頁面
          pdf.addPage();
          
          // 在新頁面上繼續添加圖片
          pdf.addImage(
            imgData, 
            'JPEG', 
            margin, 
            margin - position, 
            imgWidthPdf, 
            imgHeightPdf
          );
          
          heightLeft -= pageHeight;
        }
      } else {
        // 如果內容較短，只需要一頁
        pdf.addImage(imgData, 'JPEG', margin, margin, imgWidthPdf, imgHeightPdf);
      }
      
      // 保存 PDF
      const fileName = `${news.title.replace(/\s+/g, '_')}_notes.pdf`;
      pdf.save(fileName);
      
      console.log('PDF generated and downloaded');
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setPdfGenerating(false);
    }
  };
  
  if (loading) {
    return (
      <Container maxWidth="md">
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }
  
  if (error) {
    return (
      <Container maxWidth="md">
        <Alert severity="error" sx={{ my: 2 }}>
          {error}
        </Alert>
        <Button 
          startIcon={<ArrowBackIcon />} 
          onClick={handleGoBack}
        >
          Back to Home
        </Button>
      </Container>
    );
  }
  
  if (!news) {
    return (
      <Container maxWidth="md">
        <Alert severity="info" sx={{ my: 2 }}>
          News article not found.
        </Alert>
        <Button 
          startIcon={<ArrowBackIcon />} 
          onClick={handleGoBack}
        >
          Back to Home
        </Button>
      </Container>
    );
  }
  
  return (
    <Container maxWidth="md">
      <Paper sx={{ p: 3, mb: 4 }} ref={contentRef} id="pdf-content">
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Button 
            startIcon={<ArrowBackIcon />} 
            onClick={handleGoBack}
          >
            Back
          </Button>
          
          <Box>
            <Tooltip title="Download as PDF">
              <Button 
                startIcon={<DownloadIcon />} 
                variant="outlined" 
                color="secondary"
                onClick={handleDownloadPDF}
                disabled={pdfGenerating}
                sx={{ mr: 2 }}
              >
                {pdfGenerating ? 'Generating...' : 'Download PDF'}
              </Button>
            </Tooltip>
            
            <Button 
              startIcon={<EditIcon />} 
              variant="outlined" 
              color="primary"
              onClick={handleEdit}
            >
              Edit
            </Button>
          </Box>
        </Box>
        
        <Typography variant="h4" component="h1" gutterBottom>
          {news.title}
        </Typography>
        
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          Created: {new Date(news.created_at).toLocaleString()}
        </Typography>
        
        {news.youtube_url && (
          <Box sx={{ my: 4 }}>
            <Divider sx={{ mb: 3 }} />
            <Box
              sx={{
                position: 'relative',
                width: '100%',
                paddingTop: '56.25%', // 16:9 Aspect Ratio
                overflow: 'hidden',
                '& iframe': {
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  bottom: 0,
                  right: 0,
                  width: '100%',
                  height: '100%',
                  border: 0
                }
              }}
            >
              <iframe
                src={`https://www.youtube.com/embed/${getYoutubeVideoId(news.youtube_url)}`}
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </Box>
          </Box>
        )}
        
        <Divider sx={{ my: 3 }} />
        
        <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
          Notes ({news.notes.length})
        </Typography>
        
        {news.notes.length === 0 ? (
          <Alert severity="info" sx={{ my: 2 }}>
            No notes added yet.
          </Alert>
        ) : (
          news.notes.map((note) => (
            <RichNoteViewer key={note.id} note={note} />
          ))
        )}
      </Paper>
    </Container>
  );
};

export default NewsDetail; 