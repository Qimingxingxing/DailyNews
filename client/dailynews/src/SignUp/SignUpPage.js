import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SignUpForm from './SignUpForm';
import Auth from '../Auth/Auth';

const SignUpPage = () => {
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [user, setUser] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (event) => {
    setUser({
      ...user,
      [event.target.name]: event.target.value
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (user.password !== user.confirmPassword) {
      setErrors({
        confirmPassword: "Passwords don't match"
      });
      return;
    }

    const request = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: user.email,
        password: user.password
      })
    };

    fetch('http://0.0.0.0:3000/auth/signup', request)
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          setErrors({
            summary: data.error.message
          });
        } else {
          Auth.authenticateUser(data.token, user.email);
          navigate('/');
        }
      })
      .catch(error => {
        setErrors({
          summary: 'An error occurred during signup'
        });
      });
  };

  return (
    <SignUpForm
      onSubmit={handleSubmit}
      onChange={handleChange}
      errors={errors}
      user={user}
    />
  );
};

export default SignUpPage;
