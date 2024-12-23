# backend/routes/template_routes.py

from flask import Blueprint, request, jsonify, send_from_directory
from werkzeug.utils import secure_filename
from utils.template_manager import TemplateManager
from config import Config

template_bp = Blueprint('template_bp', __name__)
template_manager = TemplateManager()

@template_bp.route('/api/templates', methods=['GET'])
def list_templates():
    templates = template_manager.list_templates()
    # Include the URL for the preview image if it exists
    for template in templates:
        if template['preview']:
            template['preview_url'] = f"/api/templates/previews/{template['preview']}"
        else:
            template['preview_url'] = None
    return jsonify(templates), 200

@template_bp.route('/api/templates/upload', methods=['POST'])
def upload_template():
    if 'template' not in request.files:
        return jsonify({"error": "No template file part in the request."}), 400
    if 'preview' not in request.files:
        return jsonify({"error": "No preview image part in the request."}), 400

    tex_file = request.files['template']
    image_file = request.files['preview']

    if tex_file.filename == '':
        return jsonify({"error": "No selected template file."}), 400
    if image_file.filename == '':
        return jsonify({"error": "No selected preview image."}), 400

    try:
        tex_filename, preview_filename = template_manager.upload_template(tex_file, image_file)
        preview_url = f"/api/templates/previews/{preview_filename}"
        return jsonify({
            "message": "Template and preview uploaded successfully.",
            "filename": tex_filename,
            "preview_url": preview_url
        }), 201
    except ValueError as e:
        return jsonify({"error": str(e)}), 400

@template_bp.route('/api/templates/<filename>', methods=['DELETE'])
def delete_template(filename):
    try:
        template_manager.delete_template(filename)
        return jsonify({"message": "Template and its preview deleted successfully."}), 200
    except FileNotFoundError as e:
        return jsonify({"error": str(e)}), 404

# New Route to Serve Preview Images
@template_bp.route('/api/templates/previews/<filename>', methods=['GET'])
def get_preview(filename):
    return send_from_directory(template_manager.previews_dir, filename)

@template_bp.route('/api/templates/<filename>/content', methods=['GET'])
def get_template_content(filename):
    try:
        content = template_manager.get_template_content(filename)
        return jsonify({"filename": filename, "content": content}), 200
    except ValueError as ve:
        return jsonify({"error": str(ve)}), 400
    except FileNotFoundError as fe:
        return jsonify({"error": str(fe)}), 404

@template_bp.route('/api/templates/<filename>/content', methods=['PUT'])
def update_template_content(filename):
    if not request.is_json:
        return jsonify({"error": "Request must be in JSON format."}), 400

    data = request.get_json()
    new_content = data.get('content')
    if new_content is None:
        return jsonify({"error": "New content is required."}), 400

    try:
        template_manager.update_template_content(filename, new_content)
        return jsonify({"message": f"Template '{filename}' updated successfully."}), 200
    except ValueError as ve:
        return jsonify({"error": str(ve)}), 400
    except FileNotFoundError as fe:
        return jsonify({"error": str(fe)}), 404
