// src/components/Templates/Templates.js

import React, { useEffect, useState } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Tooltip,
  Box,
  Card,
  CardMedia,
  CardContent,
  CardActions,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  Visibility as VisibilityIcon,
  Upload as UploadIcon,
} from '@mui/icons-material';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from '../../services/api';

const Templates = () => {
  const [templates, setTemplates] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadTexFile, setUploadTexFile] = useState(null);
  const [uploadImageFile, setUploadImageFile] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [currentEditTemplate, setCurrentEditTemplate] = useState(null);
  const [editContent, setEditContent] = useState('');
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [templateToDelete, setTemplateToDelete] = useState(null);
  const [generateLoading, setGenerateLoading] = useState(false);
  const [emailMap, setEmailMap] = useState({}); // To store email inputs per template

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const response = await api.get('/api/templates');
      setTemplates(response.data);
    } catch (error) {
      console.error('Error fetching templates:', error);
      toast.error('Failed to fetch templates.');
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!uploadTexFile) {
      toast.error('Please select a .tex file to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('template', uploadTexFile);
    if (uploadImageFile) {
      formData.append('preview', uploadImageFile);
    }

    setUploading(true);
    try {
      const response = await api.post('/api/templates/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success(response.data.message);
      setUploadTexFile(null);
      setUploadImageFile(null);
      fetchTemplates();
    } catch (error) {
      console.error('Error uploading template:', error);
      const errorMsg = error.response?.data?.error || 'Failed to upload template.';
      toast.error(errorMsg);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!templateToDelete) return;

    try {
      await api.delete(`/api/templates/${encodeURIComponent(templateToDelete)}`);
      toast.success('Template deleted successfully.');
      setDeleteConfirmOpen(false);
      setTemplateToDelete(null);
      fetchTemplates();
    } catch (error) {
      console.error('Error deleting template:', error);
      const errorMsg = error.response?.data?.error || 'Failed to delete template.';
      toast.error(errorMsg);
    }
  };

  const handleEdit = async () => {
    if (!currentEditTemplate) return;

    try {
      const response = await api.get(`/api/templates/${encodeURIComponent(currentEditTemplate)}/content`);
      setEditContent(response.data.content);
      setEditDialogOpen(true);
    } catch (error) {
      console.error('Error fetching template content:', error);
      const errorMsg = error.response?.data?.error || 'Failed to fetch template content.';
      toast.error(errorMsg);
    }
  };

  const handleEditSave = async () => {
    try {
      await api.put(
        `/api/templates/${encodeURIComponent(currentEditTemplate)}/content`,
        { content: editContent },
        { headers: { 'Content-Type': 'application/json' } }
      );
      toast.success('Template updated successfully.');
      setEditDialogOpen(false);
      setCurrentEditTemplate(null);
      setEditContent('');
      fetchTemplates();
    } catch (error) {
      console.error('Error updating template:', error);
      const errorMsg = error.response?.data?.error || 'Failed to update template.';
      toast.error(errorMsg);
    }
  };

  const handleGenerateResume = async (templateName) => {
    const email = emailMap[templateName];
    if (!email) {
      toast.error('Please enter an email address.');
      return;
    }

    setGenerateLoading(true);
    try {
      const response = await api.post(
        '/api/generate-resume',
        { template: templateName, email },
        { responseType: 'blob' }
      );

      // Create a blob from the response
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);

      // Open the PDF in a new window/tab
      window.open(url, '_blank');

      // Optionally revoke the URL after some time to free memory
      setTimeout(() => URL.revokeObjectURL(url), 10000);

      toast.success('Resume generated successfully.');
    } catch (error) {
      console.error('Error generating resume:', error);
      const errorMsg = error.response?.data?.error || 'Failed to generate resume.';
      toast.error(errorMsg);
    } finally {
      setGenerateLoading(false);
    }
  };

  const handleView = (previewUrl) => {
    if (previewUrl) {
      window.open(previewUrl, '_blank');
    } else {
      toast.info('No preview available for this template.');
    }
  };

  const handleEmailChange = (templateName, value) => {
    setEmailMap((prev) => ({ ...prev, [templateName]: value }));
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <ToastContainer />
      {/* Upload New Template Section */}
      <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Upload New Template
        </Typography>
        <form onSubmit={handleUpload}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={5}>
              <Button
                variant="contained"
                component="label"
                startIcon={<UploadIcon />}
                fullWidth
              >
                Upload .tex File
                <input
                  type="file"
                  accept=".tex"
                  hidden
                  onChange={(e) => setUploadTexFile(e.target.files[0])}
                />
              </Button>
              {uploadTexFile && (
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Selected File: {uploadTexFile.name}
                </Typography>
              )}
            </Grid>
            <Grid item xs={12} sm={5}>
              <Button
                variant="contained"
                component="label"
                startIcon={<UploadIcon />}
                fullWidth
              >
                Upload Preview Image (Optional)
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={(e) => setUploadImageFile(e.target.files[0])}
                />
              </Button>
              {uploadImageFile && (
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Selected Image: {uploadImageFile.name}
                </Typography>
              )}
            </Grid>
            <Grid item xs={12} sm={2}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                disabled={uploading}
              >
                {uploading ? 'Uploading...' : 'Upload'}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>

      {/* Available Templates Section */}
      <Typography variant="h6" gutterBottom>
        Available Templates
      </Typography>
      <Grid container spacing={3}>
        {templates.map((template) => (
          <Grid item xs={12} sm={6} md={4} key={template.filename}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              {/* Template Image */}
              <CardMedia
                component="img"
                height="140"
                image={template.preview_url || '/placeholder-image.png'}
                alt={template.filename}
              />
              {/* Template Details */}
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h6" component="div">
                  {template.filename}
                </Typography>
                <TextField
                  label="Email"
                  variant="outlined"
                  fullWidth
                  size="small"
                  value={emailMap[template.filename] || ''}
                  onChange={(e) =>
                    handleEmailChange(template.filename, e.target.value)
                  }
                />
              </CardContent>
              {/* Action Buttons */}
              <CardActions sx={{ justifyContent: 'space-between', padding: 2 }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleGenerateResume(template.filename)}
                  disabled={generateLoading}
                  fullWidth
                  sx={{ mr: 1 }}
                >
                  {generateLoading ? 'Generating...' : 'Generate Resume'}
                </Button>
                <Box>
                  <Tooltip title="View Preview">
                    <IconButton
                      color="primary"
                      onClick={() => handleView(template.preview_url)}
                    >
                      <VisibilityIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Edit Template">
                    <IconButton
                      color="secondary"
                      onClick={() => {
                        setCurrentEditTemplate(template.filename);
                        handleEdit();
                      }}
                    >
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete Template">
                    <IconButton
                      color="error"
                      onClick={() => {
                        setTemplateToDelete(template.filename);
                        setDeleteConfirmOpen(true);
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Edit Template Dialog */}
      <Dialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>Edit Template: {currentEditTemplate}</DialogTitle>
        <DialogContent>
          <TextField
            label="Template Content"
            multiline
            rows={20}
            variant="outlined"
            fullWidth
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleEditSave} color="primary" variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete the template "
            <strong>{templateToDelete}</strong>"? This action cannot be
            undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)} color="secondary">
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Templates;
