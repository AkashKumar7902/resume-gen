# backend/utils/template_manager.py

import os
from werkzeug.utils import secure_filename
from config import Config

class TemplateManager:
    def __init__(self):
        self.templates_dir = Config.TEMPLATES_DIR
        if not os.path.exists(self.templates_dir):
            os.makedirs(self.templates_dir)
        self.selected_template_file = os.path.join(self.templates_dir, 'selected_template.txt')

    def allowed_file(self, filename):
        return '.' in filename and filename.lower().endswith('.tex')

    def upload_template(self, file_storage):
        if file_storage and self.allowed_file(file_storage.filename):
            filename = secure_filename(file_storage.filename)
            file_path = os.path.join(self.templates_dir, filename)
            file_storage.save(file_path)
            return filename
        else:
            raise ValueError("Invalid file type. Only .tex files are allowed.")

    def list_templates(self):
        return [f for f in os.listdir(self.templates_dir) if f.endswith('.tex')]

    def delete_template(self, filename):
        file_path = os.path.join(self.templates_dir, filename)
        if os.path.exists(file_path):
            os.remove(file_path)
            return True
        else:
            raise FileNotFoundError("Template file does not exist.")

    def select_template(self, filename):
        if filename not in self.list_templates():
            raise FileNotFoundError("Template file does not exist.")
        with open(self.selected_template_file, 'w') as f:
            f.write(filename)

    def get_selected_template(self):
        if os.path.exists(self.selected_template_file):
            with open(self.selected_template_file, 'r') as f:
                return f.read().strip()
        else:
            return None
