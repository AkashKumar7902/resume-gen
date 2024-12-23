import React, { useState, useEffect } from "react";
import api from "../../services/api";
import { Button, TextField } from "@mui/material";

const Skills = () => {
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState({
    skill_type: "",
    skill_names: "",
  });

  useEffect(() => {
    api
      .get("/api/skills")
      .then((response) => setSkills(response.data))
      .catch((error) => console.error(error));
  }, []);

  const handleChange = (e) => {
    setNewSkill({ ...newSkill, [e.target.name]: e.target.value });
  };

  const handleAdd = () => {
    api
      .post("/api/skills", newSkill)
      .then((response) => setSkills([...skills, response.data]))
      .catch((error) => console.error(error));
  };

  return (
    <div>
      <h2>Skills</h2>
      {skills.map((skill, index) => (
        <div key={index}>
          <h3>{skill.skill_type}</h3>
          <p>{skill.skill_names.join(", ")}</p>
        </div>
      ))}
      <h3>Add New Skill</h3>
      <TextField
        name="skill_type"
        value={newSkill.skill_type}
        onChange={handleChange}
        label="Skill Type"
      />
      <TextField
        name="skill_names"
        value={newSkill.skill_names}
        onChange={handleChange}
        label="Skill Names"
      />
      <Button variant="contained" color="primary" onClick={handleAdd}>
        Add Skill
      </Button>
    </div>
  );
};

export default Skills;
