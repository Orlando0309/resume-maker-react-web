import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Register from './components/Register';
import ResumeForm from './components/ResumeForm';
import Optimize from './components/Optimize';
import Preview from './components/Preview';
import Dashboard from './components/Dashboard';
import UserProfileForm from './components/UserProfileForm';
import { ThemeProvider } from '@mui/material';
import { theme } from './utils';
import GenerateResume from './components/GenerateResume';
import { AuthProvider } from './provider/AuthProvider';
const App = () => (
  <ThemeProvider theme={theme}>
    <AuthProvider>
    <Router>
    <Navbar />
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/resume" element={<ResumeForm />} />
      <Route path="/resume/:resumeId" element={<ResumeForm />} />
      <Route path="/resume/new/" element={<ResumeForm />} />
      <Route path="/optimize/:resumeId" element={<Optimize />} />
      <Route path="/preview/:resumeId" element={<Preview />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/profile/edit" element={<UserProfileForm />} />
      <Route path="/generate-resume" element={<GenerateResume />} />
      <Route path="/" element={<Dashboard />} />
    </Routes>
  </Router>
    </AuthProvider>
  </ThemeProvider>
);

export default App;