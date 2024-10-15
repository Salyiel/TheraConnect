from flask import Flask, request, jsonify
from app import db, app, mail
from models import User, OTP, PendingVerification
from flask_mail import Message
from flask_bcrypt import Bcrypt
from datetime import datetime, timedelta, timezone
from sqlalchemy.exc import IntegrityError
import random
import string
import jwt
import os

bcrypt = Bcrypt(app)
SECRET_KEY = os.getenv('SECRET_KEY')

# Dictionary to temporarily store user data until email verification
pending_users = {}

# Helper function to generate a random verification code
def generate_verification_code(length=6):
    return ''.join(random.choices(string.ascii_uppercase + string.digits, k=length))

def send_verification_email(email, verification_code):
    msg = Message('Email Verification Code',
                  recipients=[email],
                  sender='noreply@tc.com')  # Set sender here
    msg.body = f"""
    Hello,

    Your verification code is: {verification_code}

    Please note:
    - The code is valid for 10 minutes.
    - Do not share this OTP with anyone.
    - If you did not request this, please ignore this email.

    Best regards,
    The Theraconnect Team
    """
    try:
        mail.send(msg)
    except Exception as e:
        print(f"Failed to send email: {e}")


def send_otp_email(email, otp):
    expiry_time = "10 minutes"  # Adjust this if the expiry time changes
    msg = Message(
        'Your OTP Code from Theraconnect',
        recipients=[email],
        sender='noreply@tc.com'  # Set sender here
    )
    msg.body = f"""
    Hello,

    Your One-Time Password (OTP) is: {otp}.

    Please note:
    - The OTP is valid for {expiry_time}.
    - Do not share this OTP with anyone.
    - If you did not request this, please ignore this email.

    Best regards,
    The Theraconnect Team
    """

    try:
        mail.send(msg)
    except Exception as e:
        print(f"Failed to send OTP email: {e}")  # Log the error appropriately


@app.route('/api/register', methods=['POST', 'OPTIONS'])
def register():
    if request.method == 'OPTIONS':
        return '', 200  # Return 200 OK for preflight requests

    data = request.get_json()

    if data is None:
        return jsonify({'error': 'Invalid JSON format!'}), 400

    # Extracting and validating data
    name = data.get('name').title()
    gender = data.get('gender')
    dob = data.get('dob')
    location = data.get('location')
    phone = data.get('phone')
    email = data.get('email').lower()
    password = data.get('password')
    confirm_password = data.get('confirm_password')
    role = data.get('role')

    print(password)

    # Validate input
    if not all([name, gender, dob, location, phone, email, password, confirm_password]):
        return jsonify({'error': 'All fields are required!'}), 400

    # Check if the passwords match
    if password != confirm_password:
        return jsonify({'error': 'Passwords do not match!'}), 400

    # Generate a verification code
    verification_code = generate_verification_code()

    # Check for existing pending verification record
    existing_record = PendingVerification.query.filter_by(email=email).first()

    if existing_record:
        # Update the existing record
        existing_record.name = name
        existing_record.gender = gender
        existing_record.dob = datetime.strptime(dob, '%Y-%m-%d')  # Convert string to date
        existing_record.location = location
        existing_record.phone = phone
        existing_record.verification_code = verification_code
        existing_record.password = password
        existing_record.role = role
        existing_record.expires_at = datetime.utcnow() + timedelta(hours=1)  # Reset expiry time
    else:
        # Create a new record if none exists
        pending_verification = PendingVerification(
            name=name,
            email=email,
            verification_code=verification_code,
            dob=datetime.strptime(dob, '%Y-%m-%d'),  # Convert string to date
            gender=gender,
            location=location,
            phone=phone,
            password=password,
            role=role,
            expires_at=datetime.utcnow() + timedelta(hours=1)  # Set expiry as needed
        )
        db.session.add(pending_verification)

    try:
        db.session.commit()
    except IntegrityError:
        db.session.rollback()
        return jsonify({'error': 'An error occurred while registering. Please try again.'}), 500

    # Send verification email
    send_verification_email(email, verification_code)

    return jsonify({'message': 'Verification code sent to your email!'}), 200



@app.route('/api/verify', methods=['POST', 'OPTIONS'])
def verify_code():
    if request.method == 'OPTIONS':
        return '', 200  # Return 200 OK for preflight requests

    data = request.get_json()

    if data is None:
        return jsonify({'error': 'Invalid JSON format!'}), 400

    email = data.get('email').lower()
    verification_code = data.get('verification_code')


    if not all([email, verification_code]):
        return jsonify({'error': 'Email and verification code are required!'}), 400

    # Retrieve the pending verification record
    pending_verification = PendingVerification.query.filter_by(email=email, verification_code=verification_code).first()

    if not pending_verification:
        return jsonify({'error': 'Invalid verification code or email!'}), 400

    # Check if the verification code is expired
    if pending_verification.expires_at < datetime.utcnow():
        return jsonify({'error': 'Verification code has expired!'}), 400

    # Create a new user in the User model
    new_user = User(
        name=pending_verification.name,
        email=pending_verification.email,
        gender=pending_verification.gender,
        dob=pending_verification.dob,
        location=pending_verification.location,
        phone=pending_verification.phone,
        password=pending_verification.password,  # Use a hashed password; adjust as needed
        role=pending_verification.role  # Default role, you might adjust this based on your logic
    )

    # Store the new user in the database
    db.session.add(new_user)
    db.session.delete(pending_verification)  # Optionally remove the pending verification record
    db.session.commit()

    return jsonify({'message': 'Registration successful! You can now log in.'}), 200


@app.route('/api/resend_verification', methods=['POST'])
def resend_verification():
    data = request.get_json()
    email = data.get('email').lower()

    # Check if the email exists in pending_verification
    pending_verification = PendingVerification.query.filter_by(email=email).first()
    
    if not pending_verification:
        return jsonify({'error': 'No pending registration for this email!'}), 400

    # Regenerate verification code
    pending_verification.verification_code = generate_verification_code()
    pending_verification.expires_at = datetime.utcnow() + timedelta(hours=1)  # Reset expiry time

    # Send the new verification code via email
    send_verification_email(email, pending_verification.verification_code)

    db.session.commit()

    return jsonify({'message': 'Verification code resent successfully!'}), 200


@app.route('/api/login', methods=['POST', 'OPTIONS'])
def login():
    if request.method == 'OPTIONS':
        return '', 200  # Handle preflight requests
    
    data = request.get_json()

    if data is None:
        return jsonify({'error': 'Invalid JSON format!'}), 400

    email = data.get('email').lower()
    password = data.get('password')

    # Check if the user exists and verify the password
    user = User.query.filter_by(email=email).first()
    if user is None or not user.check_password(password):  # Use the check_password method
        return jsonify({'error': 'Invalid email or password!'}), 400

    # Generate a random OTP
    otp = str(random.randint(100000, 999999))
    expires_at = datetime.now(timezone.utc) + timedelta(minutes=5)  # OTP valid for 5 minutes

    # Save OTP to the database
    otp_entry = OTP(email=email, otp=otp, expires_at=expires_at)
    db.session.add(otp_entry)
    db.session.commit()

    send_otp_email(email, otp)

    return jsonify({'message': 'OTP sent to your email!', 'role': user.role}), 200



@app.route('/api/verify-otp', methods=['POST'])
def verify_otp():
    data = request.get_json()

    if data is None:
        return jsonify({'error': 'Invalid JSON format!'}), 400

    email = data.get('email').lower()
    otp = data.get('otp')

    # Check for OTP in the database
    otp_entry = OTP.query.filter_by(email=email, otp=otp).first()

    if otp_entry is None or otp_entry.is_expired():
        return jsonify({'error': 'Invalid or expired OTP!'}), 400

    # If OTP is valid, generate a token
    user = User.query.filter_by(email=email).first()
    db.session.delete(otp_entry)  # Optional: Remove the OTP entry after verification
    db.session.commit()

    token = jwt.encode({
        'sub': user.id,  # User ID as subject
        'role': user.role,
        'exp': datetime.utcnow() + timedelta(hours=1)  # Token expiration time
    }, SECRET_KEY, algorithm='HS256')

    return jsonify({'message': 'OTP verified successfully!', 'token': token}), 200


@app.route('/api/profile', methods=['GET', 'OPTIONS'])
def get_user_profile():
    if request.method == 'OPTIONS':
        return '', 200  # Return 200 OK for preflight requests
    
    token = request.headers.get('Authorization')  # Get token from Authorization header
    if not token:
        return jsonify({'error': 'Token is missing!'}), 401

    try:
        # Remove 'Bearer ' from the token
        token = token.split(" ")[1]
        decoded = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])  # Decode the token
        user_id = decoded['sub']  # Get the user ID from the token

        user = User.query.get(user_id)  # Use get() to find user by ID

        if not user:
            return jsonify({'error': 'User not found!'}), 404

        # Calculate profile completeness based on provided fields
        total_fields = 6  # Total number of fields we want to check
        completed_fields = sum(
            bool(getattr(user, field)) for field in ['name', 'gender', 'dob', 'location', 'phone', 'email']
        )
        profile_completion = int((completed_fields / total_fields) * 100)

        # Prepare the response data
        user_data = {
            'name': user.name,
            'gender': user.gender,
            'dob': user.dob.strftime('%Y-%m-%d') if user.dob else None,
            'location': user.location,
            'phone': user.phone,
            'email': user.email,
            'role': user.role
        }

        return jsonify({'user': user_data, 'profileCompletion': profile_completion}), 200

    except jwt.ExpiredSignatureError:
        return jsonify({'error': 'Token has expired!'}), 401
    except jwt.InvalidTokenError:
        return jsonify({'error': 'Invalid token!'}), 401


