# data_routes.py

from flask import Blueprint, request, jsonify
from utils.data_handler import DataHandler

data_bp = Blueprint('data_bp', __name__)
data_handler = DataHandler()

# Profile Routes
@data_bp.route('/api/profile', methods=['GET', 'PUT'])
def profile():
    if request.method == 'GET':
        profile_data = data_handler.get_profile()
        return jsonify(profile_data), 200
    elif request.method == 'PUT':
        profile_data = request.json
        updated_profile = data_handler.update_profile(profile_data)
        return jsonify(updated_profile), 200

# Experiences Routes
@data_bp.route('/api/experiences', methods=['GET', 'POST'])
def experiences():
    if request.method == 'GET':
        experiences_data = data_handler.get_experiences()
        return jsonify(experiences_data), 200
    elif request.method == 'POST':
        experience = request.json
        new_experience = data_handler.add_experience(experience)
        return jsonify(new_experience), 201

@data_bp.route('/api/experiences/<int:index>', methods=['PUT', 'DELETE'])
def experience_detail(index):
    if request.method == 'PUT':
        experience = request.json
        try:
            updated_experience = data_handler.update_experience(index, experience)
            return jsonify(updated_experience), 200
        except IndexError as e:
            return jsonify({"error": str(e)}), 404
    elif request.method == 'DELETE':
        try:
            removed_experience = data_handler.delete_experience(index)
            return jsonify({"message": "Experience deleted.", "removed": removed_experience}), 200
        except IndexError as e:
            return jsonify({"error": str(e)}), 404

# Education Routes
@data_bp.route('/api/education', methods=['GET', 'POST'])
def education():
    if request.method == 'GET':
        education_data = data_handler.get_education()
        return jsonify(education_data), 200
    elif request.method == 'POST':
        education_item = request.json
        new_education = data_handler.add_education(education_item)
        return jsonify(new_education), 201

@data_bp.route('/api/education/<int:index>', methods=['PUT', 'DELETE'])
def education_detail(index):
    if request.method == 'PUT':
        education_item = request.json
        try:
            updated_education = data_handler.update_education(index, education_item)
            return jsonify(updated_education), 200
        except IndexError as e:
            return jsonify({"error": str(e)}), 404
    elif request.method == 'DELETE':
        try:
            removed_education = data_handler.delete_education(index)
            return jsonify({"message": "Education deleted.", "removed": removed_education}), 200
        except IndexError as e:
            return jsonify({"error": str(e)}), 404

# Projects Routes
@data_bp.route('/api/projects', methods=['GET', 'POST'])
def projects():
    if request.method == 'GET':
        projects_data = data_handler.get_projects()
        return jsonify(projects_data), 200
    elif request.method == 'POST':
        project = request.json
        new_project = data_handler.add_project(project)
        return jsonify(new_project), 201

@data_bp.route('/api/projects/<int:index>', methods=['PUT', 'DELETE'])
def project_detail(index):
    if request.method == 'PUT':
        project = request.json
        try:
            updated_project = data_handler.update_project(index, project)
            return jsonify(updated_project), 200
        except IndexError as e:
            return jsonify({"error": str(e)}), 404
    elif request.method == 'DELETE':
        try:
            removed_project = data_handler.delete_project(index)
            return jsonify({"message": "Project deleted.", "removed": removed_project}), 200
        except IndexError as e:
            return jsonify({"error": str(e)}), 404

# Skills Routes
@data_bp.route('/api/skills', methods=['GET', 'POST'])
def skills():
    if request.method == 'GET':
        skills_data = data_handler.get_skills()
        return jsonify(skills_data), 200
    elif request.method == 'POST':
        skill = request.json
        new_skill = data_handler.add_skill(skill)
        return jsonify(new_skill), 201

@data_bp.route('/api/skills/<int:index>', methods=['PUT', 'DELETE'])
def skill_detail(index):
    if request.method == 'PUT':
        skill = request.json
        try:
            updated_skill = data_handler.update_skill(index, skill)
            return jsonify(updated_skill), 200
        except IndexError as e:
            return jsonify({"error": str(e)}), 404
    elif request.method == 'DELETE':
        try:
            removed_skill = data_handler.delete_skill(index)
            return jsonify({"message": "Skill deleted.", "removed": removed_skill}), 200
        except IndexError as e:
            return jsonify({"error": str(e)}), 404

# Achievements Routes
@data_bp.route('/api/achievements', methods=['GET', 'POST'])
def achievements():
    if request.method == 'GET':
        achievements_data = data_handler.get_achievements()
        return jsonify(achievements_data), 200
    elif request.method == 'POST':
        achievement = request.json
        new_achievement = data_handler.add_achievement(achievement)
        return jsonify(new_achievement), 201

@data_bp.route('/api/achievements/<int:index>', methods=['PUT', 'DELETE'])
def achievement_detail(index):
    if request.method == 'PUT':
        achievement = request.json
        try:
            updated_achievement = data_handler.update_achievement(index, achievement)
            return jsonify(updated_achievement), 200
        except IndexError as e:
            return jsonify({"error": str(e)}), 404
    elif request.method == 'DELETE':
        try:
            removed_achievement = data_handler.delete_achievement(index)
            return jsonify({"message": "Achievement deleted.", "removed": removed_achievement}), 200
        except IndexError as e:
            return jsonify({"error": str(e)}), 404