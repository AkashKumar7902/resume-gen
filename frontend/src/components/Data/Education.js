import React, { useState, useEffect } from "react";
import api from "../../services/api";
import { Button, TextField } from "@mui/material";

const Education = () => {
  const [education, setEducation] = useState([]);
  const [newEdu, setNewEdu] = useState({
    degree: "",
    institution: "",
    start_date: "",
    end_date: "",
    description: "",
  });

  useEffect(() => {
    api
      .get("/api/education")
      .then((response) => setEducation(response.data))
      .catch((error) => console.error(error));
  }, []);

  const handleChange = (e) => {
    setNewEdu({ ...newEdu, [e.target.name]: e.target.value });
  };

  const handleAdd = () => {
    api
      .post("/api/education", newEdu)
      .then((response) => setEducation([...education, response.data]))
      .catch((error) => console.error(error));
  };

  return (
    <div>
      <h2>Education</h2>
      {education.map((edu, index) => (
        <div key={index}>
          <h3>
            {edu.degree} at {edu.institution}
          </h3>
          {/* Display other fields */}
        </div>
      ))}
      <h3>Add New Education</h3>
      <TextField
        name="degree"
        value={newEdu.degree}
        onChange={handleChange}
        label="Degree"
      />
      <TextField
        name="institution"
        value={newEdu.institution}
        onChange={handleChange}
        label="Institution"
      />
      <TextField
        name="start_date"
        value={newEdu.start_date}
        onChange={handleChange}
        label="Start Date"
      />
      <TextField
        name="end_date"
        value={newEdu.end_date}
        onChange={handleChange}
        label="End Date"
      />
      <TextField
        name="description"
        value={newEdu.description}
        onChange={handleChange}
        label="Description"
      />
      <Button variant="contained" color="primary" onClick={handleAdd}>
        Add Education
      </Button>
    </div>
  );
};

export default Education;
