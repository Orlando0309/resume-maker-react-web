import React, { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Button,
  
} from '@mui/material';
import { secureApi } from '../config/axiosconfig';


const Dashboard = () => {
  const [data, setData] = useState({ resumes: [], applications: [] });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await secureApi.get('/dashboard');
        setData(res.data);
      } catch (error) {
        alert('Error fetching dashboard data: ' + (error.response?.data?.detail || 'Unknown error'));
      }
    };
    fetchData();
  }, []);

  return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Dashboard
        </Typography>
        <Box>
        
        <Button
                        component={RouterLink}
                        to={`/generate-resume`}
                        size="small"
                        color="primary"
                      >
                        Generate New Resume
                      </Button>
        </Box>
        {/* Resumes */}
        <Card variant="outlined" sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Resumes
            </Typography>
            {data.resumes.length === 0 ? (
              <Typography variant="body1">No resumes found.</Typography>
            ) : (
              <List>
                {data.resumes.map((resume) => (
                  <ListItem key={resume.id} secondaryAction={
                    <Box>
                      <Button
                        component={RouterLink}
                        to={`/resume/${resume.id}`}
                        size="small"
                        color="primary"
                      >
                        Edit
                      </Button>
                      <Button
                        component={RouterLink}
                        to={`/optimize/${resume.id}`}
                        size="small"
                        color="secondary"
                      >
                        Optimize
                      </Button>
                      <Button
                        component={RouterLink}
                        to={`/preview/${resume.id}`}
                        size="small"
                        color="success"
                      >
                        Preview
                      </Button>
                    </Box>
                  }>
                    <ListItemText primary={resume.title} />
                  </ListItem>
                ))}
              </List>
            )}
          </CardContent>
        </Card>

        {/* Job Applications */}
        <Card variant="outlined">
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Job Applications
            </Typography>
            {data.applications.length === 0 ? (
              <Typography variant="body1">No applications found.</Typography>
            ) : (
              <List>
                {data.applications.map((app) => (
                  <ListItem key={app.id}>
                    <ListItemText
                      primary={`${app.job_title} - ${app.company_name}`}
                      secondary={app.status}
                    />
                  </ListItem>
                ))}
              </List>
            )}
          </CardContent>
        </Card>
      </Container>
  );
};

export default Dashboard;