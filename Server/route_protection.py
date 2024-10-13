from flask_jwt_extended import jwt_required, get_jwt_identity
from flask import jsonify
from functools import wraps

def otp_verified_required(fn):
    @wraps(fn)
    @jwt_required()
    def wrapper(*args, **kwargs):
        current_user = get_jwt_identity()
        
        # Check if the user has completed OTP verification
        if not current_user.get('otp_verified'):
            return jsonify({"error": "OTP verification required"}), 403

        return fn(*args, **kwargs)
    
    return wrapper