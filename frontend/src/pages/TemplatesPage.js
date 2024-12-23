// frontend/pages/TemplatesPage.js
import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Button, TextField, List, ListItem, ListItemText } from '@mui/material';

const TemplatesPage = () => {
  const [templates, setTemplates] = useState([]);
  const [newTemplate, setNewTemplate] = useState(null);

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = () => {
    api.get('/api/templates')
      .then(response => setTemplates(response.data))
      .catch(error => console.error(error));
  };

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('template', file);
      api.post('/api/templates', formData)
        .then(response => {
          fetchTemplates();
          alert('Template uploaded successfully');
        })
        .catch(error => console.error(error));
    }
  };

  const handleDelete = (templateId) => {
    api.delete(`/api/templates/${templateId}`)
      .then(response => {
        fetchTemplates();
        alert('Template deleted successfully');
      })
      .catch(error => console.error(error));
  };

  const handleSelect = (templateId) => {
    api.put(`/api/templates/select/${templateId}`)
      .then(response => alert('Template selected successfully'))
      .catch(error => console.error(error));
  };

  return (
    <div>
      <h1>Templates</h1>
      <input
        accept=".tex"
        style={{ display: 'none' }}
        id="upload-template"
        type="file"
        onChange={handleUpload}
      />
      <label htmlFor="upload-template">
        <Button variant="contained" color="primary" component="span">
          Upload Template
        </Button>
      </label>
      <List>
        {templates.map(template => (
          <ListItem key={template.id}>
            <ListItemText primary={template.name} />
            <Button variant="contained" color="secondary" onClick={() => handleDelete(template.id)}>
              Delete
            </Button>
            <Button variant="contained" color="primary" onClick={() => handleSelect(template.id)}>
              Select
            </Button>
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default TemplatesPage;