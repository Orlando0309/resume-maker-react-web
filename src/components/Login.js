import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import {
  
  Container,
  Card,
  CardContent,
  Typography,
  TextField,
  Button
} from '@mui/material';
import { api } from '../config/axiosconfig';
import { useLocalStorage } from '../hooks/useLocalStorage';

const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [, setToken] = useLocalStorage('token', null);

  const onSubmit = async (data) => {
    try {
      const res = await api.post('/login', data, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      });
      setToken(res.data.access_token)
      window.location.href = "/dashboard";
    } catch (error) {
      alert('Login failed: ' + (error.response?.data?.detail || 'Unknown error'));
    }
  };

  return (
      <Container maxWidth="sm" sx={{ mt: 4 }}>
        <Card variant="outlined" sx={{ p: 3 }}>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              Login
            </Typography>
            <form onSubmit={handleSubmit(onSubmit)}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                id="username"
                error={!!errors.username}
                helperText={errors.username?.message}
                {...register('username', { required: 'Email is required' })}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Password"
                type="password"
                id="password"
                error={!!errors.password}
                helperText={errors.password?.message}
                {...register('password', { required: 'Password is required' })}
                sx={{ mb: 2 }}
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
              >
                Login
              </Button>
            </form>
          </CardContent>
        </Card>
      </Container>
  );
};

export default Login;