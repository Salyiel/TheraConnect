from flask import Blueprint, request, jsonify, session
from models import User
from app import db
from flask_jwt_extended import create_access_token, create_refresh_token, jwt_required, get_jwt_identity
from otp_service import send_otp, verify_otp
from werkzeug.security import generate_password_hash, check_password_hash

auth = Blueprint('auth', __name__)

@auth.route('/register', methods=['POST'])
def register():
    data = request.json
    if User.query.filter_by(email=data['email']).first():
        return jsonify({"error": "User already exists"}), 400
    
    new_user = User(
        name=data['name'],
        email=data['email'],
        phone=data['phone'],
        position=data['position']
    )
    new_user.password = generate_password_hash(data['password'], method='sha256')
    db.session.add(new_user)
    db.session.commit()
    return jsonify(new_user.to_dict()), 201

@auth.route('/login', methods=['POST'])
def login():
    data = request.json
    user = User.query.filter_by(email=data['email']).first()

    if not user or not check_password_hash(user.password, data['password']):
        return jsonify({"error": "Invalid credentials"}), 401

    # Send OTP to user's phone
    otp = send_otp(user.phone)
    session['otp'] = otp  # Store the OTP in session for later verification
    session['user_id'] = user.id

    return jsonify({"message": "OTP sent. Please verify."}), 200

@auth.route('/verify-otp', methods=['POST'])
def verify_otp_route():
    data = request.json
    session_otp = session.get('otp')
    session_user_id = session.get('user_id')

    if verify_otp(data['otp'], session_otp):
        user = User.query.get(session_user_id)
        access_token = create_access_token(identity={'id': user.id, 'otp_verified': True})
        refresh_token = create_refresh_token(identity=user.id)
        
        # Clear session after OTP verification
        session.pop('otp', None)
        session.pop('user_id', None)

        return jsonify({
            'access_token': access_token,
            'refresh_token': refresh_token,
            'user': user.to_dict()
        }), 200

    return jsonify({"error": "Invalid OTP"}), 400

# Protected route example
@auth.route('/protected', methods=['GET'])
@jwt_required()
def protected():
    current_user = get_jwt_identity()

    if not current_user.get('otp_verified'):
        return jsonify({"error": "OTP verification required"}), 403

    return jsonify({"message": "Access to protected resource granted"}), 200