// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import ExperiencesPage from './pages/ExperiencesPage';
import EducationPage from './pages/EducationPage';
import ProjectsPage from './pages/ProjectsPage';
import SkillsPage from './pages/SkillsPage';
import AchievementsPage from './pages/AchievementsPage';
import TemplatesPage from './pages/TemplatesPage';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <Router>
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar />
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/experiences" element={<ExperiencesPage />} />
        <Route path="/education" element={<EducationPage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/skills" element={<SkillsPage />} />
        <Route path="/achievements" element={<AchievementsPage />} />
        <Route path="/templates" element={<TemplatesPage />} />
      </Routes>
    </Router>
  );
}

export default App;
