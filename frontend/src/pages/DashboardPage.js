// frontend/pages/DashboardPage.js
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, Typography, Grid } from '@mui/material';

const DashboardPage = () => {
  return (
    <div>
      <h1>Dashboard</h1>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h5">Profile</Typography>
              <Link to="/profile">Manage Profile</Link>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h5">Experiences</Typography>
              <Link to="/experiences">Manage Experiences</Link>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h5">Education</Typography>
              <Link to="/education">Manage Education</Link>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h5">Projects</Typography>
              <Link to="/projects">Manage Projects</Link>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h5">Skills</Typography>
              <Link to="/skills">Manage Skills</Link>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h5">Achievements</Typography>
              <Link to="/achievements">Manage Achievements</Link>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h5">Templates</Typography>
              <Link to="/templates">Manage Templates</Link>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
};

export default DashboardPage;