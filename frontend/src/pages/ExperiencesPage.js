// frontend/pages/ExperiencesPage.js
import React from 'react';
import Experiences from '../components/Data/Experiences';
import ReservedCharactersInfo from '../components/Misc/ReservedCharactersInfo';

const ExperiencesPage = () => {
  return (
    <div>
      <h1>Experiences</h1>
      <ReservedCharactersInfo />
      <Experiences />
    </div>
  );
};

export default ExperiencesPage;

