import React from 'react';
import Profile from '../components/Data/Profile';
import ReservedCharactersInfo from '../components/Misc/ReservedCharactersInfo';

const ProfilePage = () => {
  return (
    <div>
      <h1>Profile</h1>
      <ReservedCharactersInfo />
      <Profile />
    </div>
  );
};

export default ProfilePage;