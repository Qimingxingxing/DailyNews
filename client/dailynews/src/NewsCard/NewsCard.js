import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  styled
} from '@mui/material';
import Auth from '../Auth/Auth';

const StyledCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(5),
  cursor: 'pointer',
  maxWidth: 800,
  margin: '0 auto',
  '&:hover': {
    boxShadow: theme.shadows[4],
  },
}));

const NewsCard = ({ news }) => {
  const navigate = useNavigate();
  const defaultImage = 'https://picsum.photos/id/237/800/400?grayscale';

  const handleClick = () => {
    if (!Auth.isUserAuthenticated()) {
      navigate('/login');
      return;
    }

    const request = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Auth.getToken()}`
      },
      body: JSON.stringify({
        digest: news.digest
      })
    };

    fetch('http://0.0.0.0:3000/news/click', request)
      .then(() => window.open(news.url, '_blank'))
      .catch(error => console.error('Error logging click:', error));
  };

  return (
    <StyledCard onClick={handleClick}>
      <CardMedia
        component="img"
        sx={{
          width: '100%',
          height: 400,
          objectFit: 'cover',
          backgroundColor: '#f5f5f5',
          transition: 'filter 0.3s ease',
          '&:hover': {
            filter: 'grayscale(0%)'
          }
        }}
        image={news.image_url || defaultImage}
        alt={news.title}
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = defaultImage;
        }}
      />
      <CardContent sx={{ p: 4 }}>
        <Typography variant="h5" component="div" gutterBottom sx={{
          fontWeight: 'bold',
          fontSize: '1.5rem',
          lineHeight: 1.3
        }}>
          {news.title}
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph sx={{
          fontSize: '1.1rem',
          lineHeight: 1.6,
          mb: 2
        }}>
          {news.description}
        </Typography>
        <Box sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mt: 2,
          pt: 2,
          borderTop: '1px solid',
          borderColor: 'divider'
        }}>
          <Typography variant="body1" color="text.secondary">
            {news.source.name}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {news.time}
          </Typography>
        </Box>
      </CardContent>
    </StyledCard>
  );
};

export default NewsCard;
