import React, { useState, useEffect } from "react";
import api from "../../services/api";
import { Button, TextField } from "@mui/material";

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [newProj, setNewProj] = useState({
    project_name: "",
    description: "",
    technologies_used: "",
    link: "",
    demo_link: "",
    start_date: "",
    end_date: "",
  });

  useEffect(() => {
    api
      .get("/api/projects")
      .then((response) => setProjects(response.data))
      .catch((error) => console.error(error));
  }, []);

  const handleChange = (e) => {
    setNewProj({ ...newProj, [e.target.name]: e.target.value });
  };

  const handleAdd = () => {
    api
      .post("/api/projects", newProj)
      .then((response) => setProjects([...projects, response.data]))
      .catch((error) => console.error(error));
  };

  return (
    <div>
      <h2>Projects</h2>
      {projects.map((proj, index) => (
        <div key={index}>
          <h3>{proj.project_name}</h3>
          {/* Display other fields */}
        </div>
      ))}
      <h3>Add New Project</h3>
      <TextField
        name="project_name"
        value={newProj.project_name}
        onChange={handleChange}
        label="Project Name"
      />
      <TextField
        name="description"
        value={newProj.description}
        onChange={handleChange}
        label="Description"
      />
      <TextField
        name="technologies_used"
        value={newProj.technologies_used}
        onChange={handleChange}
        label="Technologies Used"
      />
      <TextField
        name="link"
        value={newProj.link}
        onChange={handleChange}
        label="Link"
      />
      <TextField
        name="demo_link"
        value={newProj.demo_link}
        onChange={handleChange}
        label="Demo Link"
      />
      <TextField
        name="start_date"
        value={newProj.start_date}
        onChange={handleChange}
        label="Start Date"
      />
      <TextField
        name="end_date"
        value={newProj.end_date}
        onChange={handleChange}
        label="End Date"
      />
      <Button variant="contained" color="primary" onClick={handleAdd}>
        Add Project
      </Button>
    </div>
  );
};

export default Projects;
