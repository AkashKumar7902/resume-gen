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

const Education = () => {
  const [education, setEducation] = useState([]);
  const [newEdu, setNewEdu] = useState({
    degree: "",
    institution: "",
    start_date: "",
    end_date: "",
    description: [""], // Initialize as array for multiple descriptions
  });
  const [editingIndex, setEditingIndex] = useState(null); // Using index as identifier
  const [editedEdu, setEditedEdu] = useState({});
  const [isAddOpen, setIsAddOpen] = useState(false); // Controls visibility of Add Form
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success", // 'success' | 'error' | 'warning' | 'info'
  });

  useEffect(() => {
    fetchEducation();
  }, []);

  const fetchEducation = () => {
    api
      .get("/api/education")
      .then((response) => setEducation(response.data))
      .catch((error) => {
        console.error(error);
        setSnackbar({
          open: true,
          message: "Failed to fetch education data.",
          severity: "error",
        });
      });
  };

  // Handle changes in the Add Education form
  const handleChangeNewEdu = (e) => {
    setNewEdu({ ...newEdu, [e.target.name]: e.target.value });
  };

  // Handle changes in array fields in the Add Education form
  const handleChangeNewEduArray = (field, index, value) => {
    const updatedArray = [...newEdu[field]];
    updatedArray[index] = value;
    setNewEdu({ ...newEdu, [field]: updatedArray });
  };

  // Add a new item to an array field in the Add Education form
  const handleAddNewEduArrayItem = (field) => {
    setNewEdu({ ...newEdu, [field]: [...newEdu[field], ""] });
  };

  // Remove an item from an array field in the Add Education form
  const handleRemoveNewEduArrayItem = (field, index) => {
    const updatedArray = newEdu[field].filter((_, i) => i !== index);
    setNewEdu({ ...newEdu, [field]: updatedArray });
  };

  const handleAddEducation = () => {
    // Basic validation
    if (
      !newEdu.degree ||
      !newEdu.institution ||
      !newEdu.start_date ||
      newEdu.description.some((desc) => desc.trim() === "")
    ) {
      setSnackbar({
        open: true,
        message:
          "Please fill in the required fields: Degree, Institution, Start Date, and at least one Description.",
        severity: "warning",
      });
      return;
    }

    api
      .post("/api/education", newEdu)
      .then((response) => {
        setEducation([...education, response.data]);
        setNewEdu({
          degree: "",
          institution: "",
          start_date: "",
          end_date: "",
          description: [""],
        });
        setIsAddOpen(false);
        setSnackbar({
          open: true,
          message: "Education added successfully!",
          severity: "success",
        });
      })
      .catch((error) => {
        console.error(error);
        setSnackbar({
          open: true,
          message: "Failed to add education. Please try again.",
          severity: "error",
        });
      });
  };

  const handleEditClick = (index) => {
    setEditingIndex(index);
    setEditedEdu({ ...education[index] });
  };

  // Handle changes in the Edit Education form
  const handleChangeEditEdu = (e) => {
    setEditedEdu({ ...editedEdu, [e.target.name]: e.target.value });
  };

  // Handle changes in array fields in the Edit Education form
  const handleChangeEditEduArray = (field, index, value) => {
    const updatedArray = [...editedEdu[field]];
    updatedArray[index] = value;
    setEditedEdu({ ...editedEdu, [field]: updatedArray });
  };

  // Add a new item to an array field in the Edit Education form
  const handleAddEditEduArrayItem = (field) => {
    setEditedEdu({ ...editedEdu, [field]: [...editedEdu[field], ""] });
  };

  // Remove an item from an array field in the Edit Education form
  const handleRemoveEditEduArrayItem = (field, index) => {
    const updatedArray = editedEdu[field].filter((_, i) => i !== index);
    setEditedEdu({ ...editedEdu, [field]: updatedArray });
  };

  const handleSaveEdit = (index) => {
    // Basic validation
    if (
      !editedEdu.degree ||
      !editedEdu.institution ||
      !editedEdu.start_date ||
      editedEdu.description.some((desc) => desc.trim() === "")
    ) {
      setSnackbar({
        open: true,
        message:
          "Please fill in the required fields: Degree, Institution, Start Date, and at least one Description.",
        severity: "warning",
      });
      return;
    }

    api
      .put(`/api/education/${index}`, editedEdu)
      .then((response) => {
        const updatedEducation = [...education];
        updatedEducation[index] = response.data;
        setEducation(updatedEducation);
        setEditingIndex(null);
        setEditedEdu({});
        setSnackbar({
          open: true,
          message: "Education updated successfully!",
          severity: "success",
        });
      })
      .catch((error) => {
        console.error(error);
        setSnackbar({
          open: true,
          message: "Failed to update education. Please try again.",
          severity: "error",
        });
      });
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setEditedEdu({});
  };

  const handleDelete = (index) => {
    if (!window.confirm("Are you sure you want to delete this education entry?")) {
      return;
    }

    api
      .delete(`/api/education/${index}`)
      .then(() => {
        const updatedEducation = education.filter((_, i) => i !== index);
        setEducation(updatedEducation);
        setSnackbar({
          open: true,
          message: "Education deleted successfully!",
          severity: "success",
        });
      })
      .catch((error) => {
        console.error(error);
        setSnackbar({
          open: true,
          message: "Failed to delete education. Please try again.",
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
        Education
      </Typography>

      {/* List of Education Entries */}
      {education.map((edu, index) => (
        <Accordion key={index} expanded>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">
              {edu.degree} at {edu.institution}{" "}
              {edu.start_date && (
                <Typography variant="subtitle2" component="span" sx={{ marginLeft: 1 }}>
                  ({edu.start_date} - {edu.end_date || "Present"})
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
                  name="degree"
                  label="Degree"
                  value={editedEdu.degree}
                  onChange={handleChangeEditEdu}
                  required
                  fullWidth
                />
                <TextField
                  name="institution"
                  label="Institution"
                  value={editedEdu.institution}
                  onChange={handleChangeEditEdu}
                  required
                  fullWidth
                />
                <TextField
                  name="start_date"
                  label="Start Date"
                  value={editedEdu.start_date}
                  onChange={handleChangeEditEdu}
                  type="text"
                  placeholder="e.g., September 2015"
                  required
                  fullWidth
                />
                <TextField
                  name="end_date"
                  label="End Date"
                  value={editedEdu.end_date}
                  onChange={handleChangeEditEdu}
                  type="text"
                  placeholder="e.g., June 2019 or Present"
                  fullWidth
                />

                {/* Description as Array */}
                <Box>
                  <Typography variant="subtitle1" gutterBottom>
                    Description
                  </Typography>
                  <Stack spacing={2}>
                    {editedEdu.description.map((desc, idx) => (
                      <Box key={idx} sx={{ display: "flex", alignItems: "center" }}>
                        <TextField
                          value={desc}
                          onChange={(e) =>
                            handleChangeEditEduArray("description", idx, e.target.value)
                          }
                          label={`Description ${idx + 1}`}
                          fullWidth
                        />
                        <IconButton
                          color="error"
                          onClick={() => handleRemoveEditEduArrayItem("description", idx)}
                          aria-label="remove description"
                          disabled={editedEdu.description.length === 1}
                        >
                          <RemoveIcon />
                        </IconButton>
                      </Box>
                    ))}
                  </Stack>
                  <Button
                    variant="text"
                    startIcon={<AddIcon />}
                    onClick={() => handleAddEditEduArrayItem("description")}
                    sx={{ mt: 1 }}
                  >
                    Add Description
                  </Button>
                </Box>

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
                  <strong>Degree:</strong> {edu.degree}
                </Typography>
                <Typography>
                  <strong>Institution:</strong> {edu.institution}
                </Typography>
                <Typography>
                  <strong>Start Date:</strong> {edu.start_date}
                </Typography>
                <Typography>
                  <strong>End Date:</strong> {edu.end_date || "Present"}
                </Typography>

                {/* Display Description Array */}
                <Box>
                  <Typography variant="subtitle1">
                    <strong>Description:</strong>
                  </Typography>
                  <ul>
                    {edu.description.map((desc, idx) => (
                      <li key={idx}>{desc}</li>
                    ))}
                  </ul>
                </Box>

                <Box sx={{ display: "flex", gap: 1, marginTop: 2 }}>
                  <IconButton
                    color="primary"
                    onClick={() => handleEditClick(index)}
                    aria-label="edit education"
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDelete(index)}
                    aria-label="delete education"
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </Box>
            )}
          </AccordionDetails>
        </Accordion>
      ))}

      {/* Plus Button to Add New Education */}
      <Box sx={{ display: "flex", justifyContent: "center", marginTop: 2 }}>
        <IconButton
          color="primary"
          onClick={toggleAddForm}
          aria-label="add education"
          size="large"
        >
          <AddIcon fontSize="inherit" />
        </IconButton>
      </Box>

      {/* Add New Education Form */}
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
              Add New Education
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
              name="degree"
              value={newEdu.degree}
              onChange={handleChangeNewEdu}
              label="Degree"
              required
              fullWidth
            />
            <TextField
              name="institution"
              value={newEdu.institution}
              onChange={handleChangeNewEdu}
              label="Institution"
              required
              fullWidth
            />
            <TextField
              name="start_date"
              value={newEdu.start_date}
              onChange={handleChangeNewEdu}
              label="Start Date"
              type="text"
              placeholder="e.g., September 2015"
              required
              fullWidth
            />
            <TextField
              name="end_date"
              value={newEdu.end_date}
              onChange={handleChangeNewEdu}
              label="End Date"
              type="text"
              placeholder="e.g., June 2019 or Present"
              fullWidth
            />

            {/* Description as Array */}
            <Box>
              <Typography variant="subtitle1" gutterBottom>
                Description
              </Typography>
              <Stack spacing={2}>
                {newEdu.description.map((desc, index) => (
                  <Box key={index} sx={{ display: "flex", alignItems: "center" }}>
                    <TextField
                      value={desc}
                      onChange={(e) =>
                        handleChangeNewEduArray("description", index, e.target.value)
                      }
                      label={`Description ${index + 1}`}
                      fullWidth
                    />
                    <IconButton
                      color="error"
                      onClick={() => handleRemoveNewEduArrayItem("description", index)}
                      aria-label="remove description"
                      disabled={newEdu.description.length === 1}
                    >
                      <RemoveIcon />
                    </IconButton>
                  </Box>
                ))}
              </Stack>
              <Button
                variant="text"
                startIcon={<AddIcon />}
                onClick={() => handleAddNewEduArrayItem("description")}
                sx={{ mt: 1 }}
              >
                Add Description
              </Button>
            </Box>

            <Box sx={{ display: "flex", gap: 2, marginTop: 2 }}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<SaveIcon />}
                onClick={handleAddEducation}
              >
                Add Education
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

export default Education;
