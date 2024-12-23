// src/components/Data/Profile.js
import React, { useEffect, useState } from "react";
import { Box, TextField, Button, Typography } from "@mui/material";
import { toast } from "react-toastify";
import api from "../../services/api";

const Profile = () => {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    linkedin: "",
    github: "",
  });

  useEffect(() => {
    // Fetch existing profile data
    api
      .get("/api/profile")
      .then((response) => setProfile(response.data))
      .catch((error) =>
        toast.error(error.response.data.message || "Error fetching profile")
      );
  }, []);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleUpdate = () => {
    api
      .put("/api/profile", profile)
      .then((response) => {
        setProfile(response.data);
        toast.success("Profile updated successfully");
      })
      .catch((error) =>
        toast.error(error.response.data.message || "Error updating profile")
      );
  };

  return (
    <Box p={4}>
      <Typography variant="h5" gutterBottom>
        Profile
      </Typography>

      <Box component="form" noValidate autoComplete="off">
        <TextField
          label="Name"
          name="name"
          value={profile.name}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Email"
          name="email"
          value={profile.email}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Phone"
          name="phone"
          value={profile.phone}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="LinkedIn"
          name="linkedin"
          value={profile.linkedin}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="GitHub"
          name="github"
          value={profile.github}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <Box mt={2}>
          <Button variant="contained" color="primary" onClick={handleUpdate}>
            Update Profile
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default Profile;
