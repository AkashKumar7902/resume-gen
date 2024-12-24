// frontend/pages/AchievementsPage.js
import React from 'react';
import Achievements from '../components/Data/Achievements';
import ReservedCharactersInfo from '../components/Misc/ReservedCharactersInfo';

const AchievementsPage = () => {
  return (
    <div>
      <h1>Achievements</h1>
      <ReservedCharactersInfo />
      <Achievements />
    </div>
  );
};

export default AchievementsPage;
