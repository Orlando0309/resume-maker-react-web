import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  CircularProgress
  } from '@mui/material';
import { secureApi } from '../config/axiosconfig';



const Optimize = () => {
  const { resumeId } = useParams();
  const [jobDescription, setJobDescription] = useState('');
  const [isLoading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleOptimize = async () => {
    try {
      setLoading(true);
      const res = await secureApi.post(
        'http://localhost:8000/optimize-resume',
        { resume_id: resumeId, job_description: jobDescription }
      );
      setLoading(false);
      // Navigate to ResumeForm with optimized resume data
      navigate(`/resume/new/`, { state: { optimizedResume: res.data.optimized_resume } });
    } catch (error) {
      setLoading(false);
      alert('Optimization failed: ' + (error.response?.data?.detail || 'Unknown error'));
    }
  };

  return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Optimize Resume
        </Typography>
        <Card variant="outlined" sx={{ p: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Job Description
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={6}
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the job description here"
              sx={{ mb: 2 }}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleOptimize}
              disabled={isLoading}
              sx={{ width: '100%' }}
            >
              {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Optimize'}
            </Button>
          </CardContent>
        </Card>
      </Container>
  );
};

export default Optimize;