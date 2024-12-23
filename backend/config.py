# backend/config.py

import os

class Config:
    # General Configurations
    SECRET_KEY = os.environ.get('SECRET_KEY', 'your_default_secret_key')
    DEBUG = os.environ.get('DEBUG', True)

    # File Paths
    PROFILE_PATH = os.path.join(os.getcwd(), 'data', 'profile.json')
    TEMPLATES_DIR = os.path.join(os.getcwd(), 'templates')
    GENERATED_PDF_DIR = os.path.join(os.getcwd(), 'generated_pdfs')

    # LaTeX Compiler Settings
    LATEX_COMPILER = 'pdflatex'  # or 'xelatex'

    # Google Drive API Settings
    GOOGLE_DRIVE_SCOPES = ['https://www.googleapis.com/auth/drive.file']
    GOOGLE_DRIVE_TOKEN = os.path.join(os.getcwd(), 'token.json')
    GOOGLE_DRIVE_CREDENTIALS = os.path.join(os.getcwd(), 'credentials.json')
