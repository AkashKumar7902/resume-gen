// frontend/pages/ProjectsPage.js
import React from 'react';
import Projects from '../components/Data/Projects';
import ReservedCharactersInfo from '../components/Misc/ReservedCharactersInfo';

const ProjectsPage = () => {
  return (
    <div>
      <h1>Projects</h1>
      <ReservedCharactersInfo />
      <Projects />
    </div>
  );
};

export default ProjectsPage;
