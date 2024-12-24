// frontend/pages/SkillsPage.js
import React from 'react';
import Skills from '../components/Data/Skills';
import ReservedCharactersInfo from '../components/Misc/ReservedCharactersInfo';

const SkillsPage = () => {
  return (
    <div>
      <h1>Skills</h1>
      <ReservedCharactersInfo />
      <Skills />
    </div>
  );
};

export default SkillsPage;

