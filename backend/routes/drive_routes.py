# backend/routes/drive_routes.py

from flask import Blueprint, request, jsonify
from utils.template_manager import TemplateManager
from config import Config
import os
import pickle
from google.auth.transport.requests import Request
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from googleapiclient.http import MediaFileUpload

drive_bp = Blueprint('drive_bp', __name__)
template_manager = TemplateManager()

@drive_bp.route('/api/upload-to-drive', methods=['POST'])
def upload_to_drive():
    data = request.json
    template_name = data.get('template_name')
    template_path = data.get('template_path')
    profile_path = data.get('profile_path')

    if not all([template_name, template_path, profile_path]):
        return jsonify({"error": "All fields (template_name, template_path, profile_path) are required."}), 400

    # Authenticate with Google Drive
    creds = None
    if os.path.exists(Config.GOOGLE_DRIVE_TOKEN):
        with open(Config.GOOGLE_DRIVE_TOKEN, 'rb') as token:
            creds = pickle.load(token)
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            if not os.path.exists(Config.GOOGLE_DRIVE_CREDENTIALS):
                return jsonify({"error": "Google Drive credentials not found."}), 500
            flow = InstalledAppFlow.from_client_secrets_file(
                Config.GOOGLE_DRIVE_CREDENTIALS, Config.GOOGLE_DRIVE_SCOPES)
            creds = flow.run_local_server(port=0)
        with open(Config.GOOGLE_DRIVE_TOKEN, 'wb') as token:
            pickle.dump(creds, token)

    try:
        service = build('drive', 'v3', credentials=creds)

        # Function to upload or update a file
        def upload_or_update(filename, filepath):
            # Search for the file
            results = service.files().list(
                q=f"name='{filename}'",
                spaces='drive',
                fields='files(id, name)').execute()
            items = results.get('files', [])
            media = MediaFileUpload(filepath, resumable=True)
            if items:
                # File exists, update it
                file_id = items[0]['id']
                service.files().update(fileId=file_id, media_body=media).execute()
                return "updated"
            else:
                # File does not exist, create it
                service.files().create(
                    body={'name': filename, 'parents': ['ResumeGenerator']},  # Ensure 'ResumeGenerator' folder exists
                    media_body=media,
                    fields='id').execute()
                return "created"

        # Ensure 'ResumeGenerator' folder exists
        folder_id = None
        folder_results = service.files().list(
            q="mimeType='application/vnd.google-apps.folder' and name='ResumeGenerator'",
            spaces='drive',
            fields='files(id, name)').execute()
        folders = folder_results.get('files', [])
        if folders:
            folder_id = folders[0]['id']
        else:
            folder = service.files().create(
                body={'name': 'ResumeGenerator', 'mimeType': 'application/vnd.google-apps.folder'},
                fields='id').execute()
            folder_id = folder.get('id')

        # Upload or update template file
        template_full_path = os.path.join(template_manager.templates_dir, template_path)
        template_status = upload_or_update(template_name, template_full_path)

        # Upload or update profile.json
        profile_status = upload_or_update(os.path.basename(profile_path), profile_path)

        return jsonify({
            "message": "Files uploaded successfully.",
            "template": template_status,
            "profile": profile_status
        }), 200

    except Exception as e:
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500
