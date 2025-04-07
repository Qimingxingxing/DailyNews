import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Box, Container } from '@mui/material';
import { styled } from '@mui/material/styles';
import logo from "./logo.png";
import NewsPanel from "../NewsPanel/NewsPanel";
import LoginPage from '../Login/LoginPage';
import SignUpPage from '../SignUp/SignUpPage';
import Auth from '../Auth/Auth';

const Logo = styled('img')({
  display: 'block',
  marginLeft: 'auto',
  marginRight: 'auto',
  paddingTop: '38px',
  width: '20%'
});

const App = () => {
  return (
    <Box>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route
          path="/"
          element={
            Auth.isUserAuthenticated() ? (
              <>
                <Logo src={logo} alt="logo" />
                <Container>
                  <NewsPanel />
                </Container>
              </>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/logout"
          element={
            <Logout />
          }
        />
      </Routes>
    </Box>
  );
};

const Logout = () => {
  Auth.deauthenticate();
  return <Navigate to="/login" replace />;
};

export default App;
