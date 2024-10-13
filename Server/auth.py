from flask import Blueprint, request, jsonify, session
from models import User
from app import db
from flask_jwt_extended import create_access_token, create_refresh_token, jwt_required, get_jwt_identity
from otp_service import send_otp, verify_otp  # import the otp_service
from werkzeug.security import generate_password_hash, check_password_hash
import random

auth = Blueprint('auth', __name__)

# Send OTP function
def send_otp(phone_number):
    otp_code = str(random.randint(100000, 999999))  # 6-digit OTP code
    body = f"Your OTP code is {otp_code}"
    
    # Send the OTP via SMS
    send_sms(phone_number, body)
    
    return otp_code

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

    # Send OTP after registration
    otp = send_otp(new_user.phone)
    session['otp'] = otp  # Store OTP in session for later verification
    session['user_id'] = new_user.id

    return jsonify({"message": "User registered. OTP sent for verification."}), 201

@auth.route('/login', methods=['POST'])
def login():
    data = request.json
    user = User.query.filter_by(email=data['email']).first()

    if not user or not check_password_hash(user.password, data['password']):
        return jsonify({"error": "Invalid credentials"}), 401

    # Send OTP to user's phone
    otp = send_otp(user.phone)
    session['otp'] = otp  # Store OTP in session for later verification
    session['user_id'] = user.id

    return jsonify({"message": "OTP sent. Please verify."}), 200