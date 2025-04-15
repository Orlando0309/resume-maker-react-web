import React from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  
  IconButton,
  Menu,
  MenuItem
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useAuth } from './AuthProvider';


const Navbar = () => {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };
  return (
      <AppBar position="static" sx={{ mb: 4 }}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={handleMenu}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <RouterLink to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
              Resume Maker
            </RouterLink>
          </Typography>
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={open}
            onClose={handleClose}
          >
            {token
  ? [
      <MenuItem key="dashboard" onClick={handleClose}>
        <RouterLink to="/dashboard" style={{ textDecoration: 'none', color: 'inherit' }}>
          Dashboard
        </RouterLink>
      </MenuItem>,
      <MenuItem key="profile" onClick={handleClose}>
        <RouterLink to="/profile/edit" style={{ textDecoration: 'none', color: 'inherit' }}>
          User Information
        </RouterLink>
      </MenuItem>,
      <MenuItem key="resume" onClick={handleClose}>
        <RouterLink to="/resume" style={{ textDecoration: 'none', color: 'inherit' }}>
          Create Resume
        </RouterLink>
      </MenuItem>,
      <MenuItem key="logout" onClick={handleLogout}>Logout</MenuItem>
    ]
  : [
      <MenuItem key="login" onClick={handleClose}>
        <RouterLink to="/login" style={{ textDecoration: 'none', color: 'inherit' }}>
          Login
        </RouterLink>
      </MenuItem>,
      <MenuItem key="register" onClick={handleClose}>
        <RouterLink to="/register" style={{ textDecoration: 'none', color: 'inherit' }}>
          Register
        </RouterLink>
      </MenuItem>
    ]
}

          </Menu>
        </Toolbar>
      </AppBar>
  );
};

export default Navbar;