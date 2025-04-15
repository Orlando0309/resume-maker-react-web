import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  IconButton,
  
} from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { secureApi } from '../config/axiosconfig';


const Preview = () => {
  const { resumeId } = useParams();
  const [resumeData, setResumeData] = useState(null);
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    const fetchResume = async () => {
      try {
        setLoading(true);
        const res = await secureApi.get(`/resume/${resumeId}`);
        setResumeData(res.data);
      } catch (error) {
        alert('Error fetching resume data: ' + (error.response?.data?.detail || 'Unknown error'));
      } finally {
        setLoading(false);
      }
    };

    fetchResume();
  }, [resumeId]);

  const handleDownload = async () => {
    try {
      const res = await secureApi.post(
        '/generate-resume-pdf',
        { resume_id: resumeId, template_id: 'basic' },
        {
          responseType: 'blob',
        }
      );
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'resume.pdf');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      alert('PDF generation failed: ' + (error.response?.data?.detail || 'Unknown error'));
    }
  };

  return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Resume Preview
        </Typography>
        <Card variant="outlined" sx={{ p: 3 }}>
          <CardContent>
            {isLoading ? (
              <Box display="flex" justifyContent="center" alignItems="center" height={200}>
                <CircularProgress />
              </Box>
            ) : (
              <>
                {resumeData ? (
                  <Box>
                    <Typography variant="h6" gutterBottom>
                      {resumeData.personal_info.full_name}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      {resumeData.personal_info.email}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      {resumeData.personal_info.phone}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      {resumeData.personal_info.address}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      LinkedIn: {resumeData.personal_info.linkedin}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      Facebook: {resumeData.personal_info.facebook}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      X (Twitter): {resumeData.personal_info.x}
                    </Typography>
                  </Box>
                ) : (
                  <Typography variant="body1">
                    Preview of your resume will be displayed here (fetch resume data to render).
                  </Typography>
                )}
              </>
            )}
            <Box sx={{ mt: 3, textAlign: 'right' }}>
              <IconButton color="primary" onClick={handleDownload}>
                <FileDownloadIcon />
              </IconButton>
              <Typography variant="button" sx={{ ml: 1 }}>
                Download PDF
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Container>
  );
};

export default Preview;