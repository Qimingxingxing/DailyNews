import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  styled
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Auth from '../Auth/Auth';

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  position: 'fixed',
  zIndex: theme.zIndex.appBar,
}));

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
}));

const Base = ({ children }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    Auth.deauthenticate();
    navigate('/login');
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <StyledAppBar position="static">
        <StyledToolbar>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Daily News
            </Typography>
          </Box>
          {Auth.isUserAuthenticated() ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography>{Auth.getEmail()}</Typography>
              <Button color="inherit" onClick={handleLogout}>
                Logout
              </Button>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button color="inherit" onClick={() => navigate('/login')}>
                Login
              </Button>
              <Button color="inherit" onClick={() => navigate('/signup')}>
                Sign Up
              </Button>
            </Box>
          )}
        </StyledToolbar>
      </StyledAppBar>
      <Box sx={{ mt: 8 }}>
        {children}
      </Box>
    </Box>
  );
};

export default Base;
