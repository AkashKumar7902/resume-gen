# backend/app.py

from flask import Flask, jsonify
from flask_cors import CORS
from routes.data_routes import data_bp
from routes.template_routes import template_bp
from routes.resume_routes import resume_bp
from routes.drive_routes import drive_bp
import os

def create_app():
    app = Flask(__name__)
    app.config.from_object('config.Config')

    # Enable CORS
    CORS(app)

    # Register Blueprints
    app.register_blueprint(data_bp)
    app.register_blueprint(template_bp)
    app.register_blueprint(resume_bp)
    app.register_blueprint(drive_bp)

    # Health Check Route
    @app.route('/api/health', methods=['GET'])
    def health_check():
        return jsonify({"status": "OK"}), 200

    return app

if __name__ == '__main__':
    app = create_app()
    # Ensure necessary directories exist
    os.makedirs('data', exist_ok=True)
    os.makedirs('templates', exist_ok=True)
    os.makedirs('generated_pdfs', exist_ok=True)
    app.run(host='0.0.0.0', port=5000, debug=True)
