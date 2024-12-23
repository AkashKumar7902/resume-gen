# backend/routes/resume_routes.py

from flask import Blueprint, jsonify, send_file
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
    selected_template = template_manager.get_selected_template()
    if not selected_template:
        return jsonify({"error": "No template selected."}), 400

    # Load the template
    env = Environment(
        loader=FileSystemLoader(template_manager.templates_dir),
        autoescape=select_autoescape(['tex'])
    )
    try:
        template = env.get_template(selected_template)
    except Exception as e:
        return jsonify({"error": f"Error loading template: {str(e)}"}), 500

    # Get data
    profile = data_handler.get_profile()
    experiences = data_handler.get_experiences()
    education = data_handler.get_education()  # Implement get_education in DataHandler
    projects = data_handler.get_projects()    # Implement get_projects in DataHandler
    skills = data_handler.get_skills()        # Implement get_skills in DataHandler
    achievements = data_handler.get_achievements()  # Implement get_achievements in DataHandler

    data = {
        "profile": profile,
        "experiences": experiences,
        "education": education,
        "projects": projects,
        "skills": skills,
        "achievements": achievements
    }

    try:
        # Render LaTeX content
        rendered_tex = template.render(data)

        # Compile LaTeX to PDF
        output_filename = "generated_resume"
        pdf_path = latex_compiler.compile_latex(rendered_tex, output_filename)

        # Send PDF for download
        return send_file(pdf_path, as_attachment=True, attachment_filename="resume.pdf")
    except RuntimeError as e:
        return jsonify({"error": str(e)}), 500
    except Exception as e:
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500
