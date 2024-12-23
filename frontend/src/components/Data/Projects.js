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

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [newProj, setNewProj] = useState({
    project_name: "",
    description: [""], // Initialize as array for multiple descriptions
    technologies_used: [""], // Initialize as array for multiple technologies
    link: "",
    demo_link: "",
    start_date: "",
    end_date: "",
  });
  const [editingIndex, setEditingIndex] = useState(null); // Using index as identifier
  const [editedProj, setEditedProj] = useState({});
  const [isAddOpen, setIsAddOpen] = useState(false); // Controls visibility of Add Form
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success", // 'success' | 'error' | 'warning' | 'info'
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = () => {
    api
      .get("/api/projects")
      .then((response) => setProjects(response.data))
      .catch((error) => {
        console.error(error);
        setSnackbar({
          open: true,
          message: "Failed to fetch projects.",
          severity: "error",
        });
      });
  };

  // Handle changes in the Add Project form
  const handleChangeNewProj = (e) => {
    setNewProj({ ...newProj, [e.target.name]: e.target.value });
  };

  // Handle changes in array fields in the Add Project form
  const handleChangeNewProjArray = (field, index, value) => {
    const updatedArray = [...newProj[field]];
    updatedArray[index] = value;
    setNewProj({ ...newProj, [field]: updatedArray });
  };

  // Add a new item to an array field in the Add Project form
  const handleAddNewProjArrayItem = (field) => {
    setNewProj({ ...newProj, [field]: [...newProj[field], ""] });
  };

  // Remove an item from an array field in the Add Project form
  const handleRemoveNewProjArrayItem = (field, index) => {
    const updatedArray = newProj[field].filter((_, i) => i !== index);
    setNewProj({ ...newProj, [field]: updatedArray });
  };

  const handleAddProject = () => {
    // Basic validation
    if (
      !newProj.project_name ||
      newProj.description.some((desc) => desc.trim() === "") ||
      newProj.technologies_used.some((tech) => tech.trim() === "") ||
      !newProj.start_date
    ) {
      setSnackbar({
        open: true,
        message:
          "Please fill in the required fields: Project Name, at least one Description, at least one Technology, and Start Date.",
        severity: "warning",
      });
      return;
    }

    api
      .post("/api/projects", newProj)
      .then((response) => {
        setProjects([...projects, response.data]);
        setNewProj({
          project_name: "",
          description: [""],
          technologies_used: [""],
          link: "",
          demo_link: "",
          start_date: "",
          end_date: "",
        });
        setIsAddOpen(false);
        setSnackbar({
          open: true,
          message: "Project added successfully!",
          severity: "success",
        });
      })
      .catch((error) => {
        console.error(error);
        setSnackbar({
          open: true,
          message: "Failed to add project. Please try again.",
          severity: "error",
        });
      });
  };

  const handleEditClick = (index) => {
    setEditingIndex(index);
    setEditedProj({ ...projects[index] });
  };

  // Handle changes in the Edit Project form
  const handleChangeEditProj = (e) => {
    setEditedProj({ ...editedProj, [e.target.name]: e.target.value });
  };

  // Handle changes in array fields in the Edit Project form
  const handleChangeEditProjArray = (field, index, value) => {
    const updatedArray = [...editedProj[field]];
    updatedArray[index] = value;
    setEditedProj({ ...editedProj, [field]: updatedArray });
  };

  // Add a new item to an array field in the Edit Project form
  const handleAddEditProjArrayItem = (field) => {
    setEditedProj({ ...editedProj, [field]: [...editedProj[field], ""] });
  };

  // Remove an item from an array field in the Edit Project form
  const handleRemoveEditProjArrayItem = (field, index) => {
    const updatedArray = editedProj[field].filter((_, i) => i !== index);
    setEditedProj({ ...editedProj, [field]: updatedArray });
  };

  const handleSaveEdit = (index) => {
    // Basic validation
    if (
      !editedProj.project_name ||
      editedProj.description.some((desc) => desc.trim() === "") ||
      editedProj.technologies_used.some((tech) => tech.trim() === "") ||
      !editedProj.start_date
    ) {
      setSnackbar({
        open: true,
        message:
          "Please fill in the required fields: Project Name, at least one Description, at least one Technology, and Start Date.",
        severity: "warning",
      });
      return;
    }

    api
      .put(`/api/projects/${index}`, editedProj)
      .then((response) => {
        const updatedProjects = [...projects];
        updatedProjects[index] = response.data;
        setProjects(updatedProjects);
        setEditingIndex(null);
        setEditedProj({});
        setSnackbar({
          open: true,
          message: "Project updated successfully!",
          severity: "success",
        });
      })
      .catch((error) => {
        console.error(error);
        setSnackbar({
          open: true,
          message: "Failed to update project. Please try again.",
          severity: "error",
        });
      });
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setEditedProj({});
  };

  const handleDelete = (index) => {
    if (!window.confirm("Are you sure you want to delete this project?")) {
      return;
    }

    api
      .delete(`/api/projects/${index}`)
      .then(() => {
        const updatedProjects = projects.filter((_, i) => i !== index);
        setProjects(updatedProjects);
        setSnackbar({
          open: true,
          message: "Project deleted successfully!",
          severity: "success",
        });
      })
      .catch((error) => {
        console.error(error);
        setSnackbar({
          open: true,
          message: "Failed to delete project. Please try again.",
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
        Projects
      </Typography>

      {/* List of Projects */}
      {projects.map((proj, index) => (
        <Accordion key={index}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">
              {proj.project_name}{" "}
              {proj.start_date && (
                <Typography
                  variant="subtitle2"
                  component="span"
                  sx={{ marginLeft: 1 }}
                >
                  ({proj.start_date} - {proj.end_date || "Present"})
                </Typography>
              )}
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
                  name="project_name"
                  label="Project Name"
                  value={editedProj.project_name}
                  onChange={handleChangeEditProj}
                  required
                  fullWidth
                />
                {/* Description as Array */}
                <Box>
                  <Typography variant="subtitle1" gutterBottom>
                    Description
                  </Typography>
                  <Stack spacing={2}>
                    {editedProj.description.map((desc, idx) => (
                      <Box
                        key={idx}
                        sx={{ display: "flex", alignItems: "center" }}
                      >
                        <TextField
                          value={desc}
                          onChange={(e) =>
                            handleChangeEditProjArray(
                              "description",
                              idx,
                              e.target.value
                            )
                          }
                          label={`Description ${idx + 1}`}
                          fullWidth
                        />
                        <IconButton
                          color="error"
                          onClick={() =>
                            handleRemoveEditProjArrayItem("description", idx)
                          }
                          aria-label="remove description"
                          disabled={editedProj.description.length === 1}
                        >
                          <RemoveIcon />
                        </IconButton>
                      </Box>
                    ))}
                  </Stack>
                  <Button
                    variant="text"
                    startIcon={<AddIcon />}
                    onClick={() => handleAddEditProjArrayItem("description")}
                    sx={{ mt: 1 }}
                  >
                    Add Description
                  </Button>
                </Box>

                {/* Technologies Used as Array */}
                <Box>
                  <Typography variant="subtitle1" gutterBottom>
                    Technologies Used
                  </Typography>
                  <Stack spacing={2}>
                    {editedProj.technologies_used.map((tech, idx) => (
                      <Box
                        key={idx}
                        sx={{ display: "flex", alignItems: "center" }}
                      >
                        <TextField
                          value={tech}
                          onChange={(e) =>
                            handleChangeEditProjArray(
                              "technologies_used",
                              idx,
                              e.target.value
                            )
                          }
                          label={`Technology ${idx + 1}`}
                          fullWidth
                        />
                        <IconButton
                          color="error"
                          onClick={() =>
                            handleRemoveEditProjArrayItem(
                              "technologies_used",
                              idx
                            )
                          }
                          aria-label="remove technology"
                          disabled={editedProj.technologies_used.length === 1}
                        >
                          <RemoveIcon />
                        </IconButton>
                      </Box>
                    ))}
                  </Stack>
                  <Button
                    variant="text"
                    startIcon={<AddIcon />}
                    onClick={() =>
                      handleAddEditProjArrayItem("technologies_used")
                    }
                    sx={{ mt: 1 }}
                  >
                    Add Technology
                  </Button>
                </Box>

                <TextField
                  name="link"
                  label="Link"
                  value={editedProj.link}
                  onChange={handleChangeEditProj}
                  type="url"
                  fullWidth
                />
                <TextField
                  name="demo_link"
                  label="Demo Link"
                  value={editedProj.demo_link}
                  onChange={handleChangeEditProj}
                  type="url"
                  fullWidth
                />
                <TextField
                  name="start_date"
                  label="Start Date"
                  value={editedProj.start_date}
                  onChange={handleChangeEditProj}
                  type="text"
                  placeholder="e.g., January 2020"
                  required
                  fullWidth
                />
                <TextField
                  name="end_date"
                  label="End Date"
                  value={editedProj.end_date}
                  onChange={handleChangeEditProj}
                  type="text"
                  placeholder="e.g., December 2023 or Present"
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
                  <strong>Description:</strong>
                </Typography>
                <ul>
                  {proj.description.map((desc, idx) => (
                    <li key={idx}>{desc}</li>
                  ))}
                </ul>

                <Typography>
                  <strong>Technologies Used:</strong>
                </Typography>
                <ul>
                  {proj.technologies_used.map((tech, idx) => (
                    <li key={idx}>{tech}</li>
                  ))}
                </ul>

                {proj.link && (
                  <Typography>
                    <strong>Link:</strong>{" "}
                    <a
                      href={proj.link}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {proj.link}
                    </a>
                  </Typography>
                )}
                {proj.demo_link && (
                  <Typography>
                    <strong>Demo Link:</strong>{" "}
                    <a
                      href={proj.demo_link}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {proj.demo_link}
                    </a>
                  </Typography>
                )}
                <Typography>
                  <strong>Start Date:</strong> {proj.start_date}
                </Typography>
                <Typography>
                  <strong>End Date:</strong> {proj.end_date}
                </Typography>
                <Box sx={{ display: "flex", gap: 1, marginTop: 2 }}>
                  <IconButton
                    color="primary"
                    onClick={() => handleEditClick(index)}
                    aria-label="edit project"
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDelete(index)}
                    aria-label="delete project"
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </Box>
            )}
          </AccordionDetails>

          <Box sx={{ display: "flex", gap: 2, marginTop: 2 }}>
            <IconButton
              color="primary"
              onClick={toggleAddForm}
              aria-label="add project"
              size="large"
            >
              <AddIcon fontSize="inherit" />
            </IconButton>
          </Box>

          {/* Add New Project Form */}
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
                  Add New Project
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
                  name="project_name"
                  value={newProj.project_name}
                  onChange={handleChangeNewProj}
                  label="Project Name"
                  required
                  fullWidth
                />

                {/* Description as Array */}
                <Box>
                  <Typography variant="subtitle1" gutterBottom>
                    Description
                  </Typography>
                  <Stack spacing={2}>
                    {newProj.description.map((desc, index) => (
                      <Box
                        key={index}
                        sx={{ display: "flex", alignItems: "center" }}
                      >
                        <TextField
                          value={desc}
                          onChange={(e) =>
                            handleChangeNewProjArray(
                              "description",
                              index,
                              e.target.value
                            )
                          }
                          label={`Description ${index + 1}`}
                          fullWidth
                        />
                        <IconButton
                          color="error"
                          onClick={() =>
                            handleRemoveNewProjArrayItem("description", index)
                          }
                          aria-label="remove description"
                          disabled={newProj.description.length === 1}
                        >
                          <RemoveIcon />
                        </IconButton>
                      </Box>
                    ))}
                  </Stack>
                  <Button
                    variant="text"
                    startIcon={<AddIcon />}
                    onClick={() => handleAddNewProjArrayItem("description")}
                    sx={{ mt: 1 }}
                  >
                    Add Description
                  </Button>
                </Box>

                {/* Technologies Used as Array */}
                <Box>
                  <Typography variant="subtitle1" gutterBottom>
                    Technologies Used
                  </Typography>
                  <Stack spacing={2}>
                    {newProj.technologies_used.map((tech, index) => (
                      <Box
                        key={index}
                        sx={{ display: "flex", alignItems: "center" }}
                      >
                        <TextField
                          value={tech}
                          onChange={(e) =>
                            handleChangeNewProjArray(
                              "technologies_used",
                              index,
                              e.target.value
                            )
                          }
                          label={`Technology ${index + 1}`}
                          fullWidth
                        />
                        <IconButton
                          color="error"
                          onClick={() =>
                            handleRemoveNewProjArrayItem(
                              "technologies_used",
                              index
                            )
                          }
                          aria-label="remove technology"
                          disabled={newProj.technologies_used.length === 1}
                        >
                          <RemoveIcon />
                        </IconButton>
                      </Box>
                    ))}
                  </Stack>
                  <Button
                    variant="text"
                    startIcon={<AddIcon />}
                    onClick={() =>
                      handleAddNewProjArrayItem("technologies_used")
                    }
                    sx={{ mt: 1 }}
                  >
                    Add Technology
                  </Button>
                </Box>

                <TextField
                  name="link"
                  value={newProj.link}
                  onChange={handleChangeNewProj}
                  label="Link"
                  type="url"
                  fullWidth
                />
                <TextField
                  name="demo_link"
                  value={newProj.demo_link}
                  onChange={handleChangeNewProj}
                  label="Demo Link"
                  type="url"
                  fullWidth
                />
                <TextField
                  name="start_date"
                  value={newProj.start_date}
                  onChange={handleChangeNewProj}
                  label="Start Date"
                  type="text"
                  placeholder="e.g., January 2020"
                  required
                  fullWidth
                />
                <TextField
                  name="end_date"
                  value={newProj.end_date}
                  onChange={handleChangeNewProj}
                  label="End Date"
                  type="text"
                  placeholder="e.g., December 2023 or Present"
                  fullWidth
                />
                <Box sx={{ display: "flex", gap: 2, marginTop: 2 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<SaveIcon />}
                    onClick={handleAddProject}
                  >
                    Add Project
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
        </Accordion>
      ))}
    </Box>
  );
};

export default Projects;
