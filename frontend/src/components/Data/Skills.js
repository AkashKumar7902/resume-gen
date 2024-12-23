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

const Skills = () => {
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState({
    skill_type: "",
    skill_names: [""], // Initialize as array for multiple skill names
  });
  const [editingIndex, setEditingIndex] = useState(null); // Using index as identifier
  const [editedSkill, setEditedSkill] = useState({});
  const [isAddOpen, setIsAddOpen] = useState(false); // Controls visibility of Add Form
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success", // 'success' | 'error' | 'warning' | 'info'
  });

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = () => {
    api
      .get("/api/skills")
      .then((response) => setSkills(response.data))
      .catch((error) => {
        console.error(error);
        setSnackbar({
          open: true,
          message: "Failed to fetch skills.",
          severity: "error",
        });
      });
  };

  // Handle changes in the Add Skill form
  const handleChangeNewSkill = (e) => {
    setNewSkill({ ...newSkill, [e.target.name]: e.target.value });
  };

  // Handle changes in array fields in the Add Skill form
  const handleChangeNewSkillArray = (field, index, value) => {
    const updatedArray = [...newSkill[field]];
    updatedArray[index] = value;
    setNewSkill({ ...newSkill, [field]: updatedArray });
  };

  // Add a new item to an array field in the Add Skill form
  const handleAddNewSkillArrayItem = (field) => {
    setNewSkill({ ...newSkill, [field]: [...newSkill[field], ""] });
  };

  // Remove an item from an array field in the Add Skill form
  const handleRemoveNewSkillArrayItem = (field, index) => {
    const updatedArray = newSkill[field].filter((_, i) => i !== index);
    setNewSkill({ ...newSkill, [field]: updatedArray });
  };

  const handleAddSkill = () => {
    // Basic validation
    if (
      !newSkill.skill_type ||
      newSkill.skill_names.some((name) => name.trim() === "")
    ) {
      setSnackbar({
        open: true,
        message:
          "Please fill in the required fields: Skill Type and at least one Skill Name.",
        severity: "warning",
      });
      return;
    }

    api
      .post("/api/skills", newSkill)
      .then((response) => {
        setSkills([...skills, response.data]);
        setNewSkill({
          skill_type: "",
          skill_names: [""],
        });
        setIsAddOpen(false);
        setSnackbar({
          open: true,
          message: "Skill added successfully!",
          severity: "success",
        });
      })
      .catch((error) => {
        console.error(error);
        setSnackbar({
          open: true,
          message: "Failed to add skill. Please try again.",
          severity: "error",
        });
      });
  };

  const handleEditClick = (index) => {
    setEditingIndex(index);
    setEditedSkill({ ...skills[index] });
  };

  // Handle changes in the Edit Skill form
  const handleChangeEditSkill = (e) => {
    setEditedSkill({ ...editedSkill, [e.target.name]: e.target.value });
  };

  // Handle changes in array fields in the Edit Skill form
  const handleChangeEditSkillArray = (field, index, value) => {
    const updatedArray = [...editedSkill[field]];
    updatedArray[index] = value;
    setEditedSkill({ ...editedSkill, [field]: updatedArray });
  };

  // Add a new item to an array field in the Edit Skill form
  const handleAddEditSkillArrayItem = (field) => {
    setEditedSkill({ ...editedSkill, [field]: [...editedSkill[field], ""] });
  };

  // Remove an item from an array field in the Edit Skill form
  const handleRemoveEditSkillArrayItem = (field, index) => {
    const updatedArray = editedSkill[field].filter((_, i) => i !== index);
    setEditedSkill({ ...editedSkill, [field]: updatedArray });
  };

  const handleSaveEdit = (index) => {
    // Basic validation
    if (
      !editedSkill.skill_type ||
      editedSkill.skill_names.some((name) => name.trim() === "")
    ) {
      setSnackbar({
        open: true,
        message:
          "Please fill in the required fields: Skill Type and at least one Skill Name.",
        severity: "warning",
      });
      return;
    }

    api
      .put(`/api/skills/${index}`, editedSkill)
      .then((response) => {
        const updatedSkills = [...skills];
        updatedSkills[index] = response.data;
        setSkills(updatedSkills);
        setEditingIndex(null);
        setEditedSkill({});
        setSnackbar({
          open: true,
          message: "Skill updated successfully!",
          severity: "success",
        });
      })
      .catch((error) => {
        console.error(error);
        setSnackbar({
          open: true,
          message: "Failed to update skill. Please try again.",
          severity: "error",
        });
      });
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setEditedSkill({});
  };

  const handleDelete = (index) => {
    if (!window.confirm("Are you sure you want to delete this skill?")) {
      return;
    }

    api
      .delete(`/api/skills/${index}`)
      .then(() => {
        const updatedSkills = skills.filter((_, i) => i !== index);
        setSkills(updatedSkills);
        setSnackbar({
          open: true,
          message: "Skill deleted successfully!",
          severity: "success",
        });
      })
      .catch((error) => {
        console.error(error);
        setSnackbar({
          open: true,
          message: "Failed to delete skill. Please try again.",
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
        Skills
      </Typography>

      {/* List of Skills */}
      {skills.map((skill, index) => (
        <Accordion key={index} expanded>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">{skill.skill_type}</Typography>
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
                  name="skill_type"
                  label="Skill Type"
                  value={editedSkill.skill_type}
                  onChange={handleChangeEditSkill}
                  required
                  fullWidth
                />
                
                {/* Skill Names as Array */}
                <Box>
                  <Typography variant="subtitle1" gutterBottom>
                    Skill Names
                  </Typography>
                  <Stack spacing={2}>
                    {editedSkill.skill_names.map((name, idx) => (
                      <Box key={idx} sx={{ display: "flex", alignItems: "center" }}>
                        <TextField
                          value={name}
                          onChange={(e) =>
                            handleChangeEditSkillArray("skill_names", idx, e.target.value)
                          }
                          label={`Skill Name ${idx + 1}`}
                          fullWidth
                        />
                        <IconButton
                          color="error"
                          onClick={() => handleRemoveEditSkillArrayItem("skill_names", idx)}
                          aria-label="remove skill name"
                          disabled={editedSkill.skill_names.length === 1}
                        >
                          <RemoveIcon />
                        </IconButton>
                      </Box>
                    ))}
                  </Stack>
                  <Button
                    variant="text"
                    startIcon={<AddIcon />}
                    onClick={() => handleAddEditSkillArrayItem("skill_names")}
                    sx={{ mt: 1 }}
                  >
                    Add Skill Name
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
                  {skill.skill_names.join(", ")}
                </Typography>
                <Box sx={{ display: "flex", gap: 1, marginTop: 2 }}>
                  <IconButton
                    color="primary"
                    onClick={() => handleEditClick(index)}
                    aria-label="edit skill"
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDelete(index)}
                    aria-label="delete skill"
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </Box>
            )}
          </AccordionDetails>
        </Accordion>
      ))}

      {/* Plus Button to Add New Skill */}
      <Box sx={{ display: "flex", justifyContent: "center", marginTop: 2 }}>
        <IconButton
          color="primary"
          onClick={toggleAddForm}
          aria-label="add skill"
          size="large"
        >
          <AddIcon fontSize="inherit" />
        </IconButton>
      </Box>

      {/* Add New Skill Form */}
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
              Add New Skill
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
              name="skill_type"
              value={newSkill.skill_type}
              onChange={handleChangeNewSkill}
              label="Skill Type"
              required
              fullWidth
            />

            {/* Skill Names as Array */}
            <Box>
              <Typography variant="subtitle1" gutterBottom>
                Skill Names
              </Typography>
              <Stack spacing={2}>
                {newSkill.skill_names.map((name, index) => (
                  <Box key={index} sx={{ display: "flex", alignItems: "center" }}>
                    <TextField
                      value={name}
                      onChange={(e) =>
                        handleChangeNewSkillArray("skill_names", index, e.target.value)
                      }
                      label={`Skill Name ${index + 1}`}
                      fullWidth
                    />
                    <IconButton
                      color="error"
                      onClick={() => handleRemoveNewSkillArrayItem("skill_names", index)}
                      aria-label="remove skill name"
                      disabled={newSkill.skill_names.length === 1}
                    >
                      <RemoveIcon />
                    </IconButton>
                  </Box>
                ))}
              </Stack>
              <Button
                variant="text"
                startIcon={<AddIcon />}
                onClick={() => handleAddNewSkillArrayItem("skill_names")}
                sx={{ mt: 1 }}
              >
                Add Skill Name
              </Button>
            </Box>

            <Box sx={{ display: "flex", gap: 2, marginTop: 2 }}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<SaveIcon />}
                onClick={handleAddSkill}
              >
                Add Skill
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

export default Skills;
