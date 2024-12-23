# backend/routes/template_routes.py

from flask import Blueprint, request, jsonify
from werkzeug.utils import secure_filename
from utils.template_manager import TemplateManager

template_bp = Blueprint('template_bp', __name__)
template_manager = TemplateManager()

@template_bp.route('/api/templates', methods=['GET'])
def list_templates():
    templates = template_manager.list_templates()
    return jsonify(templates), 200

@template_bp.route('/api/templates/upload', methods=['POST'])
def upload_template():
    if 'template' not in request.files:
        return jsonify({"error": "No file part in the request."}), 400

    file = request.files['template']
    if file.filename == '':
        return jsonify({"error": "No selected file."}), 400

    try:
        filename = template_manager.upload_template(file)
        return jsonify({"message": "Template uploaded successfully.", "filename": filename}), 201
    except ValueError as e:
        return jsonify({"error": str(e)}), 400

@template_bp.route('/api/templates/<filename>', methods=['DELETE'])
def delete_template(filename):
    try:
        template_manager.delete_template(filename)
        return jsonify({"message": "Template deleted successfully."}), 200
    except FileNotFoundError as e:
        return jsonify({"error": str(e)}), 404

@template_bp.route('/api/templates/select', methods=['POST'])
def select_template():
    data = request.json
    filename = data.get('filename')
    if not filename:
        return jsonify({"error": "Filename is required."}), 400

    try:
        template_manager.select_template(filename)
        return jsonify({"message": f"Template '{filename}' selected."}), 200
    except FileNotFoundError as e:
        return jsonify({"error": str(e)}), 404
