# backend/utils/template_manager.py

import os
from werkzeug.utils import secure_filename
from config import Config

class TemplateManager:
    def __init__(self):
        self.templates_dir = Config.TEMPLATES_DIR
        self.previews_dir = Config.PREVIEWS_DIR  # Existing Previews Directory
        if not os.path.exists(self.templates_dir):
            os.makedirs(self.templates_dir)
        if not os.path.exists(self.previews_dir):
            os.makedirs(self.previews_dir)
        self.selected_template_file = os.path.join(self.templates_dir, 'selected_template.txt')

    def allowed_file(self, filename, allowed_extensions):
        if isinstance(allowed_extensions, tuple):
            return '.' in filename and filename.lower().endswith(allowed_extensions)
        return '.' in filename and filename.lower().endswith(allowed_extensions)

    def upload_template(self, tex_file, image_file):
        # Validate and save the .tex file
        if tex_file and self.allowed_file(tex_file.filename, '.tex'):
            tex_filename = secure_filename(tex_file.filename)
            tex_path = os.path.join(self.templates_dir, tex_filename)
            tex_file.save(tex_path)
        else:
            raise ValueError("Invalid LaTeX file type. Only .tex files are allowed.")

        # Validate and save the image preview
        if image_file and self.allowed_file(image_file.filename, ('.png', '.jpg', '.jpeg', '.gif')):
            image_filename = secure_filename(image_file.filename)
            image_path = os.path.join(self.previews_dir, image_filename)
            image_file.save(image_path)
        else:
            raise ValueError("Invalid image file type. Allowed types are .png, .jpg, .jpeg, .gif.")

        # Associate the preview with the template using a naming convention
        base_name = os.path.splitext(tex_filename)[0]
        associated_image_name = f"{base_name}_preview{os.path.splitext(image_filename)[1]}"
        associated_image_path = os.path.join(self.previews_dir, associated_image_name)
        os.rename(image_path, associated_image_path)

        return tex_filename, associated_image_name

    def list_templates(self):
        templates = [f for f in os.listdir(self.templates_dir) if f.endswith('.tex')]
        template_list = []
        for tex in templates:
            base_name = os.path.splitext(tex)[0]
            # Search for associated preview image
            preview = None
            for ext in ['.png', '.jpg', '.jpeg', '.gif']:
                preview_filename = f"{base_name}_preview{ext}"
                preview_path = os.path.join(self.previews_dir, preview_filename)
                if os.path.exists(preview_path):
                    preview = preview_filename
                    break
            template_list.append({
                'filename': tex,
                'preview': preview
            })
        return template_list

    def delete_template(self, filename):
        tex_path = os.path.join(self.templates_dir, filename)
        if os.path.exists(tex_path):
            os.remove(tex_path)
            # Also remove associated preview
            base_name = os.path.splitext(filename)[0]
            for ext in ['.png', '.jpg', '.jpeg', '.gif']:
                preview_filename = f"{base_name}_preview{ext}"
                preview_path = os.path.join(self.previews_dir, preview_filename)
                if os.path.exists(preview_path):
                    os.remove(preview_path)
            return True
        else:
            raise FileNotFoundError("Template file does not exist.")

    def select_template(self, filename):
        if filename not in [t['filename'] for t in self.list_templates()]:
            raise FileNotFoundError("Template file does not exist.")
        with open(self.selected_template_file, 'w') as f:
            f.write(filename)

    def get_selected_template(self):
        if os.path.exists(self.selected_template_file):
            with open(self.selected_template_file, 'r') as f:
                return f.read().strip()
        else:
            return None

    # **New Methods for Editing Templates**

    def get_template_content(self, filename):
        if not self.allowed_file(filename, '.tex'):
            raise ValueError("Invalid file type. Only .tex files can be retrieved.")
        tex_path = os.path.join(self.templates_dir, filename)
        if not os.path.exists(tex_path):
            raise FileNotFoundError("Template file does not exist.")
        with open(tex_path, 'r', encoding='utf-8') as f:
            content = f.read()
        return content

    def update_template_content(self, filename, new_content):
        if not self.allowed_file(filename, '.tex'):
            raise ValueError("Invalid file type. Only .tex files can be updated.")
        tex_path = os.path.join(self.templates_dir, filename)
        if not os.path.exists(tex_path):
            raise FileNotFoundError("Template file does not exist.")
        with open(tex_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        return True
