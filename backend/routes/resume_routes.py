# backend/routes/resume_routes.py

from flask import Blueprint, jsonify, send_file, request
from utils.data_handler import DataHandler
from utils.template_manager import TemplateManager
from utils.latex_compiler import LaTeXCompiler
from jinja2 import Environment, FileSystemLoader, select_autoescape
import os

resume_bp = Blueprint('resume_bp', __name__)
data_handler = DataHandler()
template_manager = TemplateManager()
latex_compiler = LaTeXCompiler()

@resume_bp.route('/api/generate-resume', methods=['POST'])
def generate_resume():
    # Parse JSON request data
    if not request.is_json:
        return jsonify({"error": "Request must be in JSON format."}), 400

    data = request.get_json()
    selected_template = data.get('template')
    email = data.get('email')

    if not selected_template:
        return jsonify({"error": "Template name is required."}), 400

    if not email:
        return jsonify({"error": "Email is required."}), 400

    # Validate template existence
    available_templates = [t['filename'] for t in template_manager.list_templates()]
    if selected_template not in available_templates:
        return jsonify({"error": "Selected template does not exist."}), 400

    # Load the template
    env = Environment(
        loader=FileSystemLoader(template_manager.templates_dir),
        autoescape=select_autoescape(['tex'])
    )
    try:
        template = env.get_template(selected_template)
    except Exception as e:
        print("err")
        return jsonify({"error": f"Error loading template: {str(e)}"}), 500

    # Get data
    profile = data_handler.get_profile()
    experiences = data_handler.get_experiences()
    education = data_handler.get_education()      # Ensure these methods are implemented
    projects = data_handler.get_projects()        # Ensure these methods are implemented
    skills = data_handler.get_skills()            # Ensure these methods are implemented
    achievements = data_handler.get_achievements()  # Ensure these methods are implemented

    # Update the profile email with the one from the request
    profile['email'] = email

    data_dict = {
        "profile": profile,
        "experiences": experiences,
        "education": education,
        "projects": projects,
        "skills": skills,
        "achievements": achievements
    }

    try:
        # Render LaTeX content
        rendered_tex = template.render(data_dict)

        # Compile LaTeX to PDF
        output_filename = f"generated_resume_{profile['name'].replace(' ', '_')}"
        pdf_path = latex_compiler.compile_latex(rendered_tex, output_filename)

        # Send PDF for download
        return send_file(pdf_path, as_attachment=True, attachment_filename="resume.pdf")
    except RuntimeError as e:
        return jsonify({"error": str(e)}), 500
    except Exception as e:
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500
