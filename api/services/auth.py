
from functools import wraps
from flask import request, jsonify
import os

def require_api_key(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return jsonify({"error": "API key não fornecida"}), 401
        
        api_key = auth_header.split(' ')[1]
        if api_key != os.getenv('API_KEY'):
            return jsonify({"error": "API key inválida"}), 401
            
        return f(*args, **kwargs)
    return decorated_function
