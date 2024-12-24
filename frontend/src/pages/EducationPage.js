// frontend/pages/EducationPage.js
import React from "react";
import Education from "../components/Data/Education";
import ReservedCharactersInfo from "../components/Misc/ReservedCharactersInfo";

const EducationPage = () => {
  return (
    <div>
      <h1>Education</h1>
      <ReservedCharactersInfo />
      <Education />
    </div>
  );
};

export default EducationPage;
