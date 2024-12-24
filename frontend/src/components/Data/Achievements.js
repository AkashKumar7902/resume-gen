import React, { useState, useEffect } from "react";
import api from "../../services/api";
import { Button, TextField } from "@mui/material";

const Achievement = () => {
  const [achievements, setAchievements] = useState([]);
  const [newAchievement, setNewAchievement] = useState("");

  useEffect(() => {
    api
      .get("/api/achievements")
      .then((response) => setAchievements(response.data))
      .catch((error) => console.error(error));
  }, []);

  const handleChange = (e) => {
    setNewAchievement(e.target.value);
  };

  const handleAdd = () => {
    api
      .post("/api/achievements", { achievement: newAchievement })
      .then((response) => setAchievements([...achievements, response.data]))
      .catch((error) => console.error(error));
  };

  return (
    <div>
      <h2>Achievements</h2>
      <ul>
        {achievements.map((ach, index) => (
          <li key={index}>{ach}</li>
        ))}
      </ul>
      <h3>Add New Achievement</h3>
      <TextField
        value={newAchievement}
        onChange={handleChange}
        label="Achievement"
        fullWidth
      />
      <Button variant="contained" color="primary" onClick={handleAdd}>
        Add Achievement
      </Button>
    </div>
  );
};

export default Achievement;
