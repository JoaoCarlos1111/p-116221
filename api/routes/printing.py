
from flask import Blueprint, jsonify, request
from services.auth import require_api_key
from services.printing import get_pending_cases, mark_cases_as_printed

printing_bp = Blueprint('printing', __name__)

@printing_bp.route('/casos', methods=['GET'])
@require_api_key
def get_cases():
    status = request.args.get('status')
    if status == 'em_fila':
        cases = get_pending_cases()
        return jsonify(cases)
    return jsonify({"error": "Status inválido"}), 400

@printing_bp.route('/marcar-como-impresso', methods=['POST'])
@require_api_key
def mark_printed():
    data = request.get_json()
    if not data or 'ids' not in data:
        return jsonify({"error": "IDs não fornecidos"}), 400
    
    mark_cases_as_printed(data['ids'])
    return jsonify({"message": "Casos atualizados com sucesso"})
