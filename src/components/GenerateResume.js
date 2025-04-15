import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Container,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  CircularProgress
} from '@mui/material';

const GenerateResume = () => {
  const navigate = useNavigate();
  const [jobDescription, setJobDescription] = useState('');
  const [isLoading, setLoading] = useState(false);

  const handleGenerate = async () => {
    try {
      const token = localStorage.getItem('token');
      setLoading(true);
      const res = await axios.post(
        'http://localhost:8000/generate-resume',
        { job_description: jobDescription },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setLoading(false);
      // Navigate to ResumeForm with generated resume data
      navigate('/resume/new/', { state: { optimizedResume: res.data.generated_resume } });
    } catch (error) {
      setLoading(false);
      alert('Resume generation failed: ' + (error.response?.data?.detail || 'Unknown error'));
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Generate Resume
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
            onClick={handleGenerate}
            disabled={isLoading}
            sx={{ width: '100%' }}
          >
            {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Generate Resume'}
          </Button>
        </CardContent>
      </Card>
    </Container>
  );
};

export default GenerateResume;