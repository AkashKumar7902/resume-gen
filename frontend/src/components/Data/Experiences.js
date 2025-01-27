import React, { useState, useEffect } from "react";
import api from "../../services/api";
import {
  Button,
  TextField,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  IconButton,
  Box,
  Collapse,
  Stack,
  Snackbar,
  Alert,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import RemoveIcon from "@mui/icons-material/Remove";

const Experiences = () => {
  const [experiences, setExperiences] = useState([]);
  const [newExp, setNewExp] = useState({
    job_title: "",
    company: "",
    start_date: "",
    end_date: "",
    description: [""], // Initialize with one empty string
    tech_stack: [""], // Initialize with one empty string
    link: "",
    certificate: "",
  });
  const [editingIndex, setEditingIndex] = useState(null); // Using index
  const [editedExp, setEditedExp] = useState({});
  const [isAddOpen, setIsAddOpen] = useState(false); // State to control Add Form visibility
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success", // 'success' | 'error' | 'warning' | 'info'
  });

  useEffect(() => {
    fetchExperiences();
  }, []);

  const fetchExperiences = () => {
    api
      .get("/api/experiences")
      .then((response) => setExperiences(response.data))
      .catch((error) => console.error(error));
  };

  // Handle changes in the Add Experience form
  const handleChangeNewExp = (e) => {
    setNewExp({ ...newExp, [e.target.name]: e.target.value });
  };

  // Handle changes in array fields in the Add Experience form
  const handleChangeNewExpArray = (field, index, value) => {
    const updatedArray = [...newExp[field]];
    updatedArray[index] = value;
    setNewExp({ ...newExp, [field]: updatedArray });
  };

  // Add a new item to an array field in the Add Experience form
  const handleAddNewExpArrayItem = (field) => {
    setNewExp({ ...newExp, [field]: [...newExp[field], ""] });
  };

  // Remove an item from an array field in the Add Experience form
  const handleRemoveNewExpArrayItem = (field, index) => {
    const updatedArray = newExp[field].filter((_, i) => i !== index);
    setNewExp({ ...newExp, [field]: updatedArray });
  };

  const handleAdd = () => {
    // Basic validation (optional but recommended)
    if (!newExp.job_title || !newExp.company || !newExp.start_date) {
      setSnackbar({
        open: true,
        message: "Please fill in the required fields: Job Title, Company, and Start Date.",
        severity: "warning",
      });
      return;
    }

    api
      .post("/api/experiences", newExp)
      .then((response) => {
        setExperiences([...experiences, response.data]);
        setNewExp({
          job_title: "",
          company: "",
          start_date: "",
          end_date: "",
          description: [""],
          tech_stack: [""],
          link: "",
          certificate: "",
        });
        setIsAddOpen(false); // Close the add form after adding
        setSnackbar({
          open: true,
          message: "Experience added successfully!",
          severity: "success",
        });
      })
      .catch((error) => {
        console.error(error);
        setSnackbar({
          open: true,
          message: "Failed to add experience. Please try again.",
          severity: "error",
        });
      });
  };

  const handleEditClick = (index) => {
    setEditingIndex(index);
    setEditedExp({ ...experiences[index] });
  };

  // Handle changes in the Edit Experience form
  const handleChangeEditExp = (e) => {
    setEditedExp({ ...editedExp, [e.target.name]: e.target.value });
  };

  // Handle changes in array fields in the Edit Experience form
  const handleChangeEditExpArray = (field, index, value) => {
    const updatedArray = [...editedExp[field]];
    updatedArray[index] = value;
    setEditedExp({ ...editedExp, [field]: updatedArray });
  };

  // Add a new item to an array field in the Edit Experience form
  const handleAddEditExpArrayItem = (field) => {
    setEditedExp({ ...editedExp, [field]: [...editedExp[field], ""] });
  };

  // Remove an item from an array field in the Edit Experience form
  const handleRemoveEditExpArrayItem = (field, index) => {
    const updatedArray = editedExp[field].filter((_, i) => i !== index);
    setEditedExp({ ...editedExp, [field]: updatedArray });
  };

  const handleSaveEdit = (index) => {
    // Basic validation (optional but recommended)
    if (!editedExp.job_title || !editedExp.company || !editedExp.start_date) {
      setSnackbar({
        open: true,
        message: "Please fill in the required fields: Job Title, Company, and Start Date.",
        severity: "warning",
      });
      return;
    }

    api
      .put(`/api/experiences/${index}`, editedExp)
      .then((response) => {
        const updatedExperiences = [...experiences];
        updatedExperiences[index] = response.data;
        setExperiences(updatedExperiences);
        setEditingIndex(null);
        setEditedExp({});
        setSnackbar({
          open: true,
          message: "Experience updated successfully!",
          severity: "success",
        });
      })
      .catch((error) => {
        console.error(error);
        setSnackbar({
          open: true,
          message: "Failed to update experience. Please try again.",
          severity: "error",
        });
      });
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setEditedExp({});
  };

  const handleDelete = (index) => {
    if (!window.confirm("Are you sure you want to delete this experience?")) {
      return;
    }

    api
      .delete(`/api/experiences/${index}`)
      .then(() => {
        const updatedExperiences = experiences.filter((_, i) => i !== index);
        setExperiences(updatedExperiences);
        setSnackbar({
          open: true,
          message: "Experience deleted successfully!",
          severity: "success",
        });
      })
      .catch((error) => {
        console.error(error);
        setSnackbar({
          open: true,
          message: "Failed to delete experience. Please try again.",
          severity: "error",
        });
      });
  };

  const toggleAddForm = () => {
    setIsAddOpen(!isAddOpen);
  };

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom>
        Experiences
      </Typography>

      {/* List of Experiences */}
      {experiences.map((exp, index) => (
        <Accordion key={index}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">
              {exp.job_title} at {exp.company}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            {editingIndex === index ? (
              <Box
                component="form"
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                }}
                noValidate
                autoComplete="off"
              >
                <TextField
                  name="job_title"
                  label="Job Title"
                  value={editedExp.job_title}
                  onChange={handleChangeEditExp}
                  required
                  fullWidth
                />
                <TextField
                  name="company"
                  label="Company"
                  value={editedExp.company}
                  onChange={handleChangeEditExp}
                  required
                  fullWidth
                />
                {/* Changed from type="date" to type="text" */}
                <TextField
                  name="start_date"
                  label="Start Date"
                  value={editedExp.start_date}
                  onChange={handleChangeEditExp}
                  required
                  fullWidth
                  placeholder="e.g., January 2020"
                />
                {/* Changed from type="date" to type="text" */}
                <TextField
                  name="end_date"
                  label="End Date"
                  value={editedExp.end_date}
                  onChange={handleChangeEditExp}
                  fullWidth
                  placeholder="e.g., December 2023 or Present"
                />

                {/* Description as Array */}
                <Box>
                  <Typography variant="subtitle1" gutterBottom>
                    Description
                  </Typography>
                  <Stack spacing={2}>
                    {editedExp.description.map((desc, idx) => (
                      <Box key={idx} sx={{ display: "flex", alignItems: "center" }}>
                        <TextField
                          value={desc}
                          onChange={(e) =>
                            handleChangeEditExpArray("description", idx, e.target.value)
                          }
                          label={`Description ${idx + 1}`}
                          fullWidth
                        />
                        <IconButton
                          color="error"
                          onClick={() => handleRemoveEditExpArrayItem("description", idx)}
                          aria-label="remove description"
                          disabled={editedExp.description.length === 1}
                        >
                          <RemoveIcon />
                        </IconButton>
                      </Box>
                    ))}
                  </Stack>
                  <Button
                    variant="text"
                    startIcon={<AddIcon />}
                    onClick={() => handleAddEditExpArrayItem("description")}
                    sx={{ mt: 1 }}
                  >
                    Add Description
                  </Button>
                </Box>

                {/* Tech Stack as Array */}
                <Box>
                  <Typography variant="subtitle1" gutterBottom>
                    Tech Stack
                  </Typography>
                  <Stack spacing={2}>
                    {editedExp.tech_stack.map((tech, idx) => (
                      <Box key={idx} sx={{ display: "flex", alignItems: "center" }}>
                        <TextField
                          value={tech}
                          onChange={(e) =>
                            handleChangeEditExpArray("tech_stack", idx, e.target.value)
                          }
                          label={`Technology ${idx + 1}`}
                          fullWidth
                        />
                        <IconButton
                          color="error"
                          onClick={() => handleRemoveEditExpArrayItem("tech_stack", idx)}
                          aria-label="remove technology"
                          disabled={editedExp.tech_stack.length === 1}
                        >
                          <RemoveIcon />
                        </IconButton>
                      </Box>
                    ))}
                  </Stack>
                  <Button
                    variant="text"
                    startIcon={<AddIcon />}
                    onClick={() => handleAddEditExpArrayItem("tech_stack")}
                    sx={{ mt: 1 }}
                  >
                    Add Technology
                  </Button>
                </Box>

                <TextField
                  name="link"
                  label="Link"
                  value={editedExp.link}
                  onChange={handleChangeEditExp}
                  type="url"
                  fullWidth
                />
                <TextField
                  name="certificate"
                  label="Certificate"
                  value={editedExp.certificate}
                  onChange={handleChangeEditExp}
                  fullWidth
                />
                <Box sx={{ display: "flex", gap: 2 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<SaveIcon />}
                    onClick={() => handleSaveEdit(index)}
                  >
                    Save
                  </Button>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={handleCancelEdit}
                  >
                    Cancel
                  </Button>
                </Box>
              </Box>
            ) : (
              <Box>
                <Typography>
                  <strong>Start Date:</strong> {exp.start_date}
                </Typography>
                <Typography>
                  <strong>End Date:</strong> {exp.end_date}
                </Typography>

                {/* Display Description Array */}
                <Box>
                  <Typography variant="subtitle1">
                    <strong>Description:</strong>
                  </Typography>
                  <ul>
                    {exp.description.map((desc, idx) => (
                      <li key={idx}>{desc}</li>
                    ))}
                  </ul>
                </Box>

                {/* Display Tech Stack Array */}
                <Box>
                  <Typography variant="subtitle1">
                    <strong>Tech Stack:</strong>
                  </Typography>
                  <ul>
                    {exp.tech_stack.map((tech, idx) => (
                      <li key={idx}>{tech}</li>
                    ))}
                  </ul>
                </Box>

                <Typography>
                  <strong>Link:</strong>{" "}
                  <a
                    href={exp.link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {exp.link}
                  </a>
                </Typography>
                <Typography>
                  <strong>Certificate:</strong> {exp.certificate}
                </Typography>
                <Box sx={{ display: "flex", gap: 1, marginTop: 2 }}>
                  <IconButton
                    color="primary"
                    onClick={() => handleEditClick(index)}
                    aria-label="edit experience"
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDelete(index)}
                    aria-label="delete experience"
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </Box>
            )}
          </AccordionDetails>
        </Accordion>
      ))}

      {/* Plus Button to Add New Experience */}
      <Box sx={{ display: "flex", justifyContent: "center", marginTop: 2 }}>
        <IconButton
          color="primary"
          onClick={toggleAddForm}
          aria-label="add experience"
          size="large"
        >
          <AddIcon fontSize="inherit" />
        </IconButton>
      </Box>

      {/* Add New Experience Form */}
      <Collapse in={isAddOpen}>
        <Box
          sx={{
            marginTop: 4,
            padding: 3,
            border: "1px solid #ccc",
            borderRadius: 2,
            boxShadow: 1,
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="h5" gutterBottom>
              Add New Experience
            </Typography>
            <IconButton onClick={toggleAddForm} aria-label="close add form">
              <CloseIcon />
            </IconButton>
          </Box>
          <Box
            component="form"
            sx={{ display: "flex", flexDirection: "column", gap: 2 }}
            noValidate
            autoComplete="off"
          >
            <TextField
              name="job_title"
              value={newExp.job_title}
              onChange={handleChangeNewExp}
              label="Job Title"
              required
              fullWidth
            />
            <TextField
              name="company"
              value={newExp.company}
              onChange={handleChangeNewExp}
              label="Company"
              required
              fullWidth
            />
            <TextField
              name="start_date"
              value={newExp.start_date}
              onChange={handleChangeNewExp}
              label="Start Date"
              type="text" // Changed to text
              placeholder="e.g., January 2020"
              required
              fullWidth
            />
            <TextField
              name="end_date"
              value={newExp.end_date}
              onChange={handleChangeNewExp}
              label="End Date"
              type="text" // Changed to text
              placeholder="e.g., December 2023 or Present"
              fullWidth
            />

            {/* Description as Array */}
            <Box>
              <Typography variant="subtitle1" gutterBottom>
                Description
              </Typography>
              <Stack spacing={2}>
                {newExp.description.map((desc, index) => (
                  <Box key={index} sx={{ display: "flex", alignItems: "center" }}>
                    <TextField
                      value={desc}
                      onChange={(e) =>
                        handleChangeNewExpArray("description", index, e.target.value)
                      }
                      label={`Description ${index + 1}`}
                      fullWidth
                    />
                    <IconButton
                      color="error"
                      onClick={() => handleRemoveNewExpArrayItem("description", index)}
                      aria-label="remove description"
                      disabled={newExp.description.length === 1}
                    >
                      <RemoveIcon />
                    </IconButton>
                  </Box>
                ))}
              </Stack>
              <Button
                variant="text"
                startIcon={<AddIcon />}
                onClick={() => handleAddNewExpArrayItem("description")}
                sx={{ mt: 1 }}
              >
                Add Description
              </Button>
            </Box>

            {/* Tech Stack as Array */}
            <Box>
              <Typography variant="subtitle1" gutterBottom>
                Tech Stack
              </Typography>
              <Stack spacing={2}>
                {newExp.tech_stack.map((tech, index) => (
                  <Box key={index} sx={{ display: "flex", alignItems: "center" }}>
                    <TextField
                      value={tech}
                      onChange={(e) =>
                        handleChangeNewExpArray("tech_stack", index, e.target.value)
                      }
                      label={`Technology ${index + 1}`}
                      fullWidth
                    />
                    <IconButton
                      color="error"
                      onClick={() => handleRemoveNewExpArrayItem("tech_stack", index)}
                      aria-label="remove technology"
                      disabled={newExp.tech_stack.length === 1}
                    >
                      <RemoveIcon />
                    </IconButton>
                  </Box>
                ))}
              </Stack>
              <Button
                variant="text"
                startIcon={<AddIcon />}
                onClick={() => handleAddNewExpArrayItem("tech_stack")}
                sx={{ mt: 1 }}
              >
                Add Technology
              </Button>
            </Box>

            <TextField
              name="link"
              value={newExp.link}
              onChange={handleChangeNewExp}
              label="Link"
              type="url"
              fullWidth
            />
            <TextField
              name="certificate"
              value={newExp.certificate}
              onChange={handleChangeNewExp}
              label="Certificate"
              fullWidth
            />
            <Box sx={{ display: "flex", gap: 2, marginTop: 2 }}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<SaveIcon />}
                onClick={handleAdd}
              >
                Add Experience
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                onClick={toggleAddForm}
                startIcon={<CloseIcon />}
              >
                Cancel
              </Button>
            </Box>
          </Box>
        </Box>
      </Collapse>

      {/* Snackbar for User Feedback */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Experiences;
