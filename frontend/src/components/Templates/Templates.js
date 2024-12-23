// src/components/Templates/Templates.js
import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import { Download, Delete } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../services/api";

const Templates = () => {
  const [templates, setTemplates] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = () => {
    api
      .get("/api/templates")
      .then((response) => setTemplates(response.data))
      .catch((error) =>
        toast.error(error.response.data.message || "Error fetching templates")
      );
  };

  const handleDownload = (filename) => {
    api
      .get(`/api/templates/${filename}`, { responseType: "blob" })
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", filename);
        document.body.appendChild(link);
        link.click();
        link.remove();
        toast.success("Template downloaded successfully");
      })
      .catch((error) =>
        toast.error(error.response.data.message || "Error downloading template")
      );
  };

  const handleDelete = (filename) => {
    setSelectedTemplate(filename);
    setOpen(true);
  };

  const confirmDelete = () => {
    api
      .delete(`/api/templates/${selectedTemplate}`)
      .then(() => {
        toast.success("Template deleted successfully");
        fetchTemplates();
      })
      .catch((error) =>
        toast.error(error.response.data.message || "Error deleting template")
      )
      .finally(() => setOpen(false));
  };

  const handleTemplateClick = (filename) => {
    // Redirect to the data page, possibly with template selection
    navigate("/profile", { state: { template: filename } });
  };

  const handleDownloadResume = () => {
    api
      .post("/api/generate-resume", { templateName: selectedTemplate })
      .then((response) => {
        const url = window.URL.createObjectURL(
          new Blob([response.data], { type: "application/pdf" })
        );
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "resume.pdf");
        document.body.appendChild(link);
        link.click();
        link.remove();
        toast.success("Resume generated successfully");
      })
      .catch((error) =>
        toast.error(error.response.data.message || "Error generating resume")
      );
  };

  return (
    <Box p={4}>
      <Typography variant="h5" gutterBottom>
        Templates
      </Typography>
      <Box mt={2}>
        <Button
          variant="contained"
          color="secondary"
          onClick={handleDownloadResume}
        >
          Download Resume
        </Button>
      </Box>
      <Button variant="contained" color="primary" component="label">
        Upload New Template
        <input
          type="file"
          hidden
          accept=".tex"
          onChange={(e) => {
            const file = e.target.files[0];
            if (file) {
              const formData = new FormData();
              formData.append("file", file);
              api
                .post("/api/templates/upload", formData)
                .then(() => {
                  toast.success("Template uploaded successfully");
                  fetchTemplates();
                })
                .catch((error) =>
                  toast.error(
                    error.response.data.message || "Error uploading template"
                  )
                );
            }
          }}
        />
      </Button>
      <List>
        {templates.map((template) => (
          <ListItem
            button
            key={template}
            onClick={() => handleTemplateClick(template)}
          >
            <ListItemText primary={template} />
            <ListItemSecondaryAction>
              <IconButton
                edge="end"
                aria-label="download"
                onClick={() => handleDownload(template)}
              >
                <Download />
              </IconButton>
              <IconButton
                edge="end"
                aria-label="delete"
                onClick={() => handleDelete(template)}
              >
                <Delete />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>

      {/* Delete Confirmation Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Delete Template</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the template "{selectedTemplate}"?
            This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={confirmDelete} color="secondary" disabled>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Templates;
