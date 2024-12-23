# data_handler.py

import json
import os
from config import Config

class DataHandler:
    def __init__(self):
        self.profile_path = Config.PROFILE_PATH
        if not os.path.exists(self.profile_path):
            self._initialize_profile()

    def _initialize_profile(self):
        initial_data = {
            "profile": {
                "name": "",
                "email": "",
                "phone": "",
                "linkedin": "",
                "github": ""
            },
            "experiences": [],
            "education": [],
            "projects": [],
            "skills": [],
            "achievements": []
        }
        self._write_data(initial_data)

    def _read_data(self):
        with open(self.profile_path, 'r') as file:
            return json.load(file)

    def _write_data(self, data):
        with open(self.profile_path, 'w') as file:
            json.dump(data, file, indent=4)

    # Profile
    def get_profile(self):
        data = self._read_data()
        return data.get('profile', {})

    def update_profile(self, profile_data):
        data = self._read_data()
        data['profile'].update(profile_data)
        self._write_data(data)
        return data['profile']

    # Experiences
    def get_experiences(self):
        data = self._read_data()
        return data.get('experiences', [])

    def add_experience(self, experience):
        data = self._read_data()
        data['experiences'].append(experience)
        self._write_data(data)
        return experience

    def update_experience(self, index, experience):
        data = self._read_data()
        if 0 <= index < len(data['experiences']):
            data['experiences'][index] = experience
            self._write_data(data)
            return data['experiences'][index]
        else:
            raise IndexError("Experience index out of range.")

    def delete_experience(self, index):
        data = self._read_data()
        if 0 <= index < len(data['experiences']):
            removed = data['experiences'].pop(index)
            self._write_data(data)
            return removed
        else:
            raise IndexError("Experience index out of range.")

    # Education
    def get_education(self):
        data = self._read_data()
        return data.get('education', [])

    def add_education(self, education_item):
        data = self._read_data()
        data['education'].append(education_item)
        self._write_data(data)
        return education_item

    def update_education(self, index, education_item):
        data = self._read_data()
        if 0 <= index < len(data['education']):
            data['education'][index] = education_item
            self._write_data(data)
            return data['education'][index]
        else:
            raise IndexError("Education index out of range.")

    def delete_education(self, index):
        data = self._read_data()
        if 0 <= index < len(data['education']):
            removed = data['education'].pop(index)
            self._write_data(data)
            return removed
        else:
            raise IndexError("Education index out of range.")

    # Projects
    def get_projects(self):
        data = self._read_data()
        return data.get('projects', [])

    def add_project(self, project):
        data = self._read_data()
        data['projects'].append(project)
        self._write_data(data)
        return project

    def update_project(self, index, project):
        data = self._read_data()
        if 0 <= index < len(data['projects']):
            data['projects'][index] = project
            self._write_data(data)
            return data['projects'][index]
        else:
            raise IndexError("Project index out of range.")

    def delete_project(self, index):
        data = self._read_data()
        if 0 <= index < len(data['projects']):
            removed = data['projects'].pop(index)
            self._write_data(data)
            return removed
        else:
            raise IndexError("Project index out of range.")

    # Skills
    def get_skills(self):
        data = self._read_data()
        return data.get('skills', [])

    def add_skill(self, skill):
        data = self._read_data()
        data['skills'].append(skill)
        self._write_data(data)
        return skill

    def update_skill(self, index, skill):
        data = self._read_data()
        if 0 <= index < len(data['skills']):
            data['skills'][index] = skill
            self._write_data(data)
            return data['skills'][index]
        else:
            raise IndexError("Skill index out of range.")

    def delete_skill(self, index):
        data = self._read_data()
        if 0 <= index < len(data['skills']):
            removed = data['skills'].pop(index)
            self._write_data(data)
            return removed
        else:
            raise IndexError("Skill index out of range.")

    # Achievements
    def get_achievements(self):
        data = self._read_data()
        return data.get('achievements', [])

    def add_achievement(self, achievement):
        data = self._read_data()
        data['achievements'].append(achievement)
        self._write_data(data)
        return achievement

    def update_achievement(self, index, achievement):
        data = self._read_data()
        if 0 <= index < len(data['achievements']):
            data['achievements'][index] = achievement
            self._write_data(data)
            return data['achievements'][index]
        else:
            raise IndexError("Achievement index out of range.")

    def delete_achievement(self, index):
        data = self._read_data()
        if 0 <= index < len(data['achievements']):
            removed = data['achievements'].pop(index)
            self._write_data(data)
            return removed
        else:
            raise IndexError("Achievement index out of range.")