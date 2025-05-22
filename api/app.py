
from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
import os
from routes.printing import printing_bp

load_dotenv()

app = Flask(__name__)
CORS(app)

app.register_blueprint(printing_bp, url_prefix='/impressao')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
