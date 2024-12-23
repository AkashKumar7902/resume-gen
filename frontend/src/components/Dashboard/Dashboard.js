// src/components/Dashboard/Dashboard.js
import React from 'react';
import { Grid, Button, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();

  const sections = [
    { name: 'Profile', path: '/profile' },
    { name: 'Experiences', path: '/experiences' },
    { name: 'Education', path: '/education' },
    { name: 'Projects', path: '/projects' },
    { name: 'Skills', path: '/skills' },
    { name: 'Achievements', path: '/achievements' },
    { name: 'Templates', path: '/templates' },
  ];

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Grid container spacing={3}>
        {sections.map((section) => (
          <Grid item xs={12} sm={6} md={4} key={section.name}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={() => navigate(section.path)}
            >
              {section.name}
            </Button>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Dashboard;
