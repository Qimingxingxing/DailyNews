import './NewsPanel.css';
import React, { useState, useEffect, useCallback } from 'react';
import "./NewsPanel.css";
import NewsCard from '../NewsCard/NewsCard';
import Auth from '../Auth/Auth';
import { CircularProgress, List, Box, AppBar, Toolbar, Button, Typography, Container } from '@mui/material';
import { debounce } from 'lodash';
import { useNavigate } from 'react-router-dom';

const NewsPanel = () => {
  const [news, setNews] = useState(null);
  const [pageNum, setPageNum] = useState(1);
  const [loadedAll, setLoadedAll] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    Auth.logout();
    navigate('/login');
  };

  const loadMoreNews = useCallback(() => {
    if (loadedAll) return;

    const request = {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${Auth.getToken()}`
      }
    };

    const url = `http://0.0.0.0:3000/news/userId/${Auth.getEmail()}/pageNum/${pageNum}`;

    fetch(url, request)
      .then((res) => res.json())
      .then((response) => {
        const newsResult = response.result;
        if (!newsResult || newsResult.length === 0) {
          setLoadedAll(true);
          return;
        }

        setNews(prevNews => prevNews ? [...prevNews, ...newsResult] : newsResult);
        setPageNum(prev => prev + 1);
      })
      .catch(error => {
        console.error('Error loading news:', error);
      });
  }, [pageNum, loadedAll]);

  useEffect(() => {
    loadMoreNews();
    const debouncedLoadMore = debounce(loadMoreNews, 1000);
    window.addEventListener('scroll', debouncedLoadMore);
    return () => window.removeEventListener('scroll', debouncedLoadMore);
  }, [loadMoreNews]);

  const handleScroll = () => {
    const scrollY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop;
    if ((window.innerHeight + scrollY) >= document.body.offsetHeight - 50) {
      loadMoreNews();
    }
  };

  if (!news) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <Box sx={{
        position: 'fixed',
        top: 0,
        right: 0,
        p: 2,
        zIndex: 1000
      }}>
        <Button
          variant="outlined"
          onClick={handleLogout}
          sx={{
            textTransform: 'none',
            backgroundColor: 'white',
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.04)'
            }
          }}
        >
          Logout
        </Button>
      </Box>
      <Box sx={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '20px',
        '& > *': {
          marginBottom: '40px !important'
        }
      }}>
        {news.map((newsItem, index) => (
          <NewsCard key={newsItem.digest || index} news={newsItem} />
        ))}
      </Box>
    </>
  );
};

export default NewsPanel;
