from flask import Flask, request, jsonify
from app import db, app, mail
from models import User, OTP, PendingVerification, EmailChangeVerification, Note, TherapistProfile, Booking
from flask_mail import Message
from flask_bcrypt import Bcrypt
from datetime import datetime, timedelta, timezone
from sqlalchemy.exc import IntegrityError
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity, JWTManager
import random
import string
import jwt as pyjwt
import os

bcrypt = Bcrypt(app)
SECRET_KEY = os.getenv('SECRET_KEY')
jwt = JWTManager(app)


# Dictionary to temporarily store user data until email verification
pending_users = {}

# Helper function to generate a random verification code
def generate_verification_code(length=6):
    return ''.join(random.choices(string.ascii_uppercase + string.digits, k=length))

def send_verification_email(email, verification_code):
    msg = Message('Email Verification Code',
                  recipients=[email],
                  sender='noreply@tc.com') 
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
    expiry_time = "10 minutes" 
    msg = Message(
        'Your OTP Code from Theraconnect',
        recipients=[email],
        sender='noreply@tc.com'
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
        print(f"Failed to send OTP email: {e}")

def send_password_reset_email(email, otp):
    expiry_time = "10 minutes" 
    msg = Message(
        'Password Reset Request from Theraconnect',
        recipients=[email],
        sender='noreply@tc.com'
    )
    msg.body = f"""
    Hello,

    We received a request to reset your password for your account associated with this email address.

    Your One-Time Password (OTP) for resetting your password is: **{otp}**.

    Please note:
    - The OTP is valid for {expiry_time}.
    - Do not share this OTP with anyone.
    - If you did not request this, please ignore this email.

    To proceed with resetting your password, please enter the OTP on the website.

    Best regards,
    The Theraconnect Team
    """

    try:
        mail.send(msg)
    except Exception as e:
        print(f"Failed to send password reset email: {e}")


def send_password_change_email(email):
    msg = Message(
        'Your Password Has Been Changed - Theraconnect',
        recipients=[email],
        sender='noreply@tc.com'
    )
    msg.body = f"""
    Hello,

    This email is to confirm that the password for your Theraconnect account associated with {email} has been successfully changed.

    If you did not initiate this change, please contact our support team immediately to secure your account.

    Best regards,
    The Theraconnect Team
    """

    try:
        mail.send(msg)
    except Exception as e:
        print(f"Failed to send password change confirmation email: {e}")



# Helper function to generate a random verification code
def generate_verification_code(length=6):
    return ''.join(random.choices(string.ascii_uppercase + string.digits, k=length))

def request_email_change_verification(new_email,old_email):
    # Generate verification code
    verification_code = generate_verification_code()
    
    # Set expiration time for the code
    expires_at = datetime.utcnow() + timedelta(minutes=10)

    # Create a new EmailChangeVerification instance
    email_verification = EmailChangeVerification(
        email=new_email,
        used_email=old_email,
        verification_code=verification_code,
        expires_at=expires_at
    )

    # Save to the database
    try:
        db.session.add(email_verification)
        db.session.commit()
    except Exception as e:
        return jsonify({'error': 'Failed to store verification details. Please try again later.'}), 500

    # Send verification email
    msg = Message('Email Verification Code',
                  recipients=[new_email],
                  sender='noreply@tc.com') 
    msg.body = f"""
    Hello,

    Your verification code is: {verification_code}

    Please note:
    - The code is valid for 10 minutes.
    - Do not share this code with anyone.
    - If you did not request this, please ignore this email.

    Best regards,
    The Theraconnect Team
    """
    
    # Attempt to send the email
    try:
        mail.send(msg)
        return {'message': 'A verification code has been sent to your new email! Please check your inbox.'}
    except Exception as e:
        return jsonify({'error': 'Failed to send verification email. Please try again later.'}), 500


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
        existing_record.is_verified = False
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
            expires_at=datetime.utcnow() + timedelta(hours=1),  # Set expiry as needed
            is_verified=False
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
        role=pending_verification.role,  # Default role, you might adjust this based on your logic
        is_verified=False
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

    token = pyjwt.encode({
        'sub': user.id,  # User ID as subject
        'role': user.role,
        'exp': datetime.utcnow() + timedelta(hours=1)  # Token expiration time
    }, SECRET_KEY, algorithm='HS256')

    user_details = {

        'id': user.id,
        'name': user.name,
        'email': user.email,
        'therapist': user.therapist_id,
        'role': user.role
    }

    return jsonify({ 'message': 'OTP verified successfully!', 'token': token, 'user': user_details }), 200


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
        decoded = pyjwt.decode(token, SECRET_KEY, algorithms=["HS256"])  # Decode the token
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

    except pyjwt.ExpiredSignatureError:
        return jsonify({'error': 'Token has expired!'}), 401
    except pyjwt.InvalidTokenError:
        return jsonify({'error': 'Invalid token!'}), 401


@app.route('/api/profile', methods=['PUT', 'OPTIONS'])
def edit_user_profile():
    if request.method == 'OPTIONS':
        return '', 200  # Return 200 OK for preflight requests

    token = request.headers.get('Authorization')  # Get token from Authorization header
    if not token:
        return jsonify({'error': 'Token is missing!'}), 401

    try:
        # Remove 'Bearer ' from the token
        token = token.split(" ")[1]
        decoded = pyjwt.decode(token, SECRET_KEY, algorithms=["HS256"])  # Decode the token
        user_id = decoded['sub']  # Get the user ID from the token

        user = User.query.get(user_id)  # Use get() to find user by ID
        if not user:
            return jsonify({'error': 'User not found!'}), 404

        # Get the updated data from the request body
        data = request.get_json()
        if not data:
            return jsonify({'error': 'No data provided!'}), 400

        # Update user fields if they are provided
        for field in ['name', 'gender', 'dob', 'location', 'phone', 'email']:
            if field in data and data[field] is not None:
                setattr(user, field, data[field])  # Set the field value

        db.session.commit()  # Commit changes to the database

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

        return jsonify({'user': user_data, 'message': 'Profile updated successfully!'}), 200

    except pyjwt.ExpiredSignatureError:
        return jsonify({'error': 'Token has expired!'}), 401
    except pyjwt.InvalidTokenError:
        return jsonify({'error': 'Invalid token!'}), 401
    except Exception as e:
        return jsonify({'error': str(e)}), 500  # Return a generic error message for any other exceptions@app.route('/api/profile', methods=['PUT', 'OPTIONS'])
def edit_user_profile():
    if request.method == 'OPTIONS':
        return '', 200  # Return 200 OK for preflight requests

    token = request.headers.get('Authorization')  # Get token from Authorization header
    if not token:
        return jsonify({'error': 'Token is missing!'}), 401

    try:
        # Remove 'Bearer ' from the token
        token = token.split(" ")[1]
        decoded = pyjwt.decode(token, SECRET_KEY, algorithms=["HS256"])  # Decode the token
        user_id = decoded['sub']  # Get the user ID from the token

        user = User.query.get(user_id)  # Use get() to find user by ID
        if not user:
            return jsonify({'error': 'User not found!'}), 404

        # Get the updated data from the request body
        data = request.get_json()
        if not data:
            return jsonify({'error': 'No data provided!'}), 400

        # Update user fields if they are provided
        for field in ['name', 'gender', 'dob', 'location', 'phone', 'email']:
            if field in data and data[field] is not None:
                setattr(user, field, data[field])  # Set the field value

        db.session.commit()  # Commit changes to the database

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

        return jsonify({'user': user_data, 'message': 'Profile updated successfully!'}), 200

    except pyjwt.ExpiredSignatureError:
        return jsonify({'error': 'Token has expired!'}), 401
    except pyjwt.InvalidTokenError:
        return jsonify({'error': 'Invalid token!'}), 401
    except Exception as e:
        return jsonify({'error': str(e)}), 500  # Return a generic error message for any other exceptions
    

@app.route('/api/change-password', methods=['PUT', 'OPTIONS'])
def change_password():
    if request.method == 'OPTIONS':
        return '', 200  # Return 200 OK for preflight requests

    token = request.headers.get('Authorization')  # Get token from Authorization header
    if not token:
        return jsonify({'error': 'Token is missing!'}), 401

    try:
        # Remove 'Bearer ' from the token
        token = token.split(" ")[1]
        decoded = pyjwt.decode(token, SECRET_KEY, algorithms=["HS256"])  # Decode the token
        user_id = decoded['sub']  # Get the user ID from the token

        user = User.query.get(user_id)  # Use get() to find user by ID
        if not user:
            return jsonify({'error': 'User not found!'}), 404

        # Get the request data
        data = request.get_json()
        current_password = data.get('currentPassword')
        new_password = data.get('newPassword')

        if not current_password or not new_password:
            return jsonify({'error': 'Both current and new passwords are required!'}), 400

        # Check if the current password is correct
        if not bcrypt.check_password_hash(user.password_hash, current_password):
            return jsonify({'error': 'Current password is incorrect!'}), 403

        # Hash the new password and update it
        user.password_hash = bcrypt.generate_password_hash(new_password).decode('utf-8')

        db.session.commit()  # Commit changes to the database

        return jsonify({'message': 'Password changed successfully!'}), 200

    except pyjwt.ExpiredSignatureError:
        return jsonify({'error': 'Token has expired!'}), 401
    except pyjwt.InvalidTokenError:
        return jsonify({'error': 'Invalid token!'}), 401
    except Exception as e:
        return jsonify({'error': str(e)}), 500  # Return a generic error message for any other exceptions
    
@app.route('/api/request-otp', methods=['POST'])
def request_otp():
    data = request.get_json()

    if data is None:
        return jsonify({'error': 'Invalid JSON format!'}), 400

    email = data.get('email').lower()

    # Check if the user exists
    user = User.query.filter_by(email=email).first()
    if user is None:
        return jsonify({'error': 'Email not found!'}), 404

    # Generate a random OTP
    otp = str(random.randint(100000, 999999))
    expires_at = datetime.now(timezone.utc) + timedelta(minutes=10)  # OTP valid for 10 minutes

    # Save OTP to the database
    otp_entry = OTP(email=email, otp=otp, expires_at=expires_at)
    db.session.add(otp_entry)
    db.session.commit()

    # Send the password reset email with the OTP
    send_password_reset_email(email, otp)

    return jsonify({'message': 'OTP sent to your email!'}), 200

# Endpoint to verify the OTP for password reset
@app.route('/api/verify-password-otp', methods=['POST', 'OPTIONS'])
def verify_password_otp():
    if request.method == 'OPTIONS':
        return '', 200  # Handle preflight requests
    
    data = request.get_json()

    if data is None:
        print("No data received in request.")
        return jsonify({'error': 'Invalid JSON format!'}), 400

    email = data.get('email').lower()
    otp = data.get('otp')

    # Check for OTP in the database
    otp_entry = OTP.query.filter_by(email=email, otp=otp).first()
    if otp_entry is None:
        print("No matching OTP entry found.")
    elif otp_entry.is_expired():
        print("The OTP is expired.")
    
    if otp_entry is None or otp_entry.is_expired():
        return jsonify({'error': 'Invalid or expired OTP!'}), 400

    # Remove the OTP entry after verification
    db.session.delete(otp_entry)
    db.session.commit()

    # Generate a JWT token for the user
    user = User.query.filter_by(email=email).first()  # Fetch the user
    if user is None:
        return jsonify({'error': 'User not found!'}), 404

    token = create_access_token(identity=user.id)  # Create a token using the user's ID

    return jsonify({
        'message': 'OTP verified successfully! You can now reset your password.',
        'token': token  # Return the token
    }), 200


# Endpoint to reset the password
@app.route('/api/reset-password', methods=['PUT', 'OPTIONS'])
@jwt_required()
def reset_password():
    if request.method == 'OPTIONS':
        return '', 200  # Handle preflight requests

    current_user = get_jwt_identity()  # Get the user ID from the token

    data = request.get_json()
    if data is None:
        return jsonify({'error': 'Invalid JSON format!'}), 400

    new_password = data.get('newPassword')
    
    if not new_password:
        return jsonify({'error': 'Password must not be empty!'}), 400

    # Check if the user exists
    user = User.query.get(current_user)  # Fetch user by ID from token
    if user is None:
        return jsonify({'error': 'User not found!'}), 404

    # Set the new password
    user.password_hash = bcrypt.generate_password_hash(new_password).decode('utf-8')
    db.session.commit()  # Commit changes to the database

    # Send password change confirmation email
    send_password_change_email(user.email)

    return jsonify({'message': 'Password reset successfully!'}), 200


@app.route('/api/change-email', methods=['PUT', 'OPTIONS'])
def change_email():
    if request.method == 'OPTIONS':
        return '', 200  # Return 200 OK for preflight requests

    data = request.get_json()
    if data is None:
        return jsonify({'error': 'Invalid JSON format!'}), 400

    new_email = data.get('newEmail')
    current_password = data.get('currentPassword')
    old_email = data.get('oldEmail')  # Include old email for validation

    if not all([new_email, current_password, old_email]):
        return jsonify({'error': 'Old email, new email, and current password are required!'}), 400

    # Retrieve user from the database using the old email
    user = User.query.filter_by(email=old_email).first()

    # Verify the user's password
    if not user or not bcrypt.check_password_hash(user.password_hash, current_password):
        return jsonify({'error': 'Invalid password!'}), 401

    # Request email change verification
    response = request_email_change_verification(new_email, old_email)
    if isinstance(response, tuple):
        return response  # Return error response from the helper function

    return jsonify({'message': 'Verification code sent to your new email!'}), 200


@app.route('/api/verify-email-change', methods=['POST', 'OPTIONS'])
def verify_email_change():
    if request.method == 'OPTIONS':
        return '', 200  # Return 200 OK for preflight requests

    data = request.get_json()
    if data is None:
        return jsonify({'error': 'Invalid JSON format!'}), 400

    old_email = data.get('oldEmail')
    new_email = data.get('newEmail')
    verification_code = data.get('verification_code')  # Use verification_code instead of otp

    if not all([new_email, old_email, verification_code]):
        return jsonify({'error': 'New email and verification code are required!'}), 400

    # Replace PendingVerification with EmailChangeVerification
    email_verification = EmailChangeVerification.query.filter_by(email=new_email, used_email=old_email, verification_code=verification_code).first()

    if not email_verification:
        return jsonify({'error': 'Invalid verification code or email!'}), 400

    # Update the user's email
    user = User.query.filter_by(email=email_verification.used_email).first()  # Use the existing email
    user.email = new_email  # Update email
    db.session.delete(email_verification)  # Remove the pending verification record
    db.session.commit()

    return jsonify({'message': 'Email changed successfully!'}), 200



# endpoint to display all notes
@app.route('/api/notes', methods=['GET', 'OPTIONS'])
def get_notes():

    if request.method == 'OPTIONS':
        return '', 200  # Handle preflight requests
    
    user_id = request.args.get('userId')  # Get user ID from query params

    if not user_id:  # Check if user_id is None
        return jsonify({'message': 'User ID is required'}), 400

    notes = Note.query.filter_by(user_id=user_id).all()

    return jsonify([note.to_dict() for note in notes]), 200


# Create a new note
@app.route('/api/notes', methods=['POST', 'OPTIONS'])
def create_note():

    if request.method == 'OPTIONS':
        return '', 200  # Handle preflight requests
    
    print("creating new note from")

    user_id = request.args.get('userId')

    data = request.json
    user_id = data.get('userId')  # Get user ID from the request body
    title = data.get('title')
    content = data.get('content')

    if not user_id:
        return jsonify({"error": "User ID is required"}), 400

    if not title or not content:
        return jsonify({"error": "Title and content are required"}), 400

    new_note = Note(title=title, content=content, user_id=user_id)
    db.session.add(new_note)
    db.session.commit()

    return jsonify(new_note.to_dict()), 201


# Update an existing note
@app.route('/api/notes/<int:id>', methods=['PUT', 'OPTIONS'])
def update_note(id):

    if request.method == 'OPTIONS':
        return '', 200  # Handle preflight requests
    
    data = request.json
    user_id = data.get('userId')  # Get user ID from the request body
    note = Note.query.filter_by(id=id, user_id=user_id).first()

    if not note:
        return jsonify({"error": "Note not found"}), 404

    note.title = data.get('title', note.title)
    note.content = data.get('content', note.content)
    note.updated_at = datetime.utcnow()

    db.session.commit()

    return jsonify(note.to_dict()), 200


# Delete a note
@app.route('/api/notes/<int:id>', methods=['DELETE', 'OPTIONS'])
def delete_note(id):

    if request.method == 'OPTIONS':
        return '', 200  # Handle preflight requests
    
    user_id = request.args.get('userId')  # Get user ID from query params
    note = Note.query.filter_by(id=id, user_id=user_id).first()

    if not note:
        return jsonify({"error": "Note not found"}), 404

    db.session.delete(note)
    db.session.commit()

    return jsonify({"message": "Note deleted"}), 200


# Route to fetch therapists with pagination
@app.route('/api/therapists', methods=['GET'])
def get_therapists():
    page = request.args.get('page', 1, type=int)  # Get page number from query parameter, default is 1
    per_page = 3  # Display 3 therapists per page

    # Query only therapists from the User table (role = 'therapist')
    therapists = User.query.join(TherapistProfile).filter(User.role == 'therapist').paginate(page=page, per_page=per_page, error_out=False)

    # Prepare therapist data to send as JSON
    therapists_data = []
    for therapist in therapists.items:
        profile = therapist.therapist_profile
        therapists_data.append({
            'id': therapist.id,
            'name': therapist.name,
            'email': therapist.email,
            'location': therapist.location,
            'qualification': profile.qualifications,
            'experience': profile.experience_years,
            'license_number': profile.license_number,
            'image': profile.image  # Assuming this is a URL to the therapist's image
        })

    # Return the paginated data along with total pages for the frontend to handle pagination
    return jsonify({
        'therapists': therapists_data,
        'total_pages': therapists.pages,
        'current_page': therapists.page
    })

@app.route('/api/therapist/<int:id>', methods=['GET'])
def get_therapist(id):
    # Query for the therapist by ID
    therapist = User.query.join(TherapistProfile).filter(User.id == id, User.role == 'therapist').first()

    # If therapist is found, return the data
    if therapist:
        profile = therapist.therapist_profile
        therapist_data = {
            'id': therapist.id,
            'name': therapist.name,
            'email': therapist.email,
            'location': therapist.location,
            'qualification': profile.qualifications,
            'experience': profile.experience_years,
            'license_number': profile.license_number,
            'image': profile.image  # Assuming this is a URL to the therapist's image
        }
        return jsonify(therapist_data)
    else:
        return jsonify({'error': 'Therapist not found'}), 404


@app.route('/api/availability/<int:therapist_id>', methods=['GET'])
def get_availability(therapist_id):
    date_str = request.args.get('date')  # Get the date from query parameters
    if not date_str:
        return jsonify({'error': 'Date is required'}), 400

    # Parse the date string into a date object
    try:
        selected_date = datetime.strptime(date_str, '%Y-%m-%d').date()
    except ValueError:
        return jsonify({'error': 'Invalid date format, use YYYY-MM-DD'}), 400

    # Fetch the therapist's profile (this can be adjusted based on your model)
    therapist_profile = TherapistProfile.query.filter_by(user_id=therapist_id).first()
    if not therapist_profile:
        return jsonify({'error': 'Therapist not found'}), 404

    # Define available hours (adjust as necessary)
    working_hours = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00']

    # Fetch existing bookings for the therapist on the selected date
    existing_bookings = Booking.query.filter_by(therapist_id=therapist_id, date=selected_date).all()

    # Extract booked times
    booked_times = {booking.time for booking in existing_bookings}

    # Calculate available time slots
    available_slots = [time for time in working_hours if time not in booked_times]

    return jsonify({
        'therapist_id': therapist_id,
        'date': selected_date.strftime('%Y-%m-%d'),
        'available_slots': available_slots
    })



@app.route('/api/book', methods=['POST'])
def book_appointment():
    if request.method == 'OPTIONS':
        return '', 200  # Return 200 OK for preflight requests

    token = request.headers.get('Authorization')  # Get token from Authorization header
    if not token:
        return jsonify({'error': 'Token is missing!'}), 401

    try:
        # Remove 'Bearer ' from the token
        token = token.split(" ")[1]
        decoded = pyjwt.decode(token, SECRET_KEY, algorithms=["HS256"])  # Decode the token
        client_id = decoded['sub']  # Get the user ID from the token

        data = request.get_json()
        therapist_id = data.get('therapist_id')
        date_str = data.get('date')  # This should just be the date
        time_str = data.get('time')  # This should include the chosen time

        # Validate input
        if not therapist_id or not date_str or not time_str:
            return jsonify({'error': 'Therapist ID, date, and time are required.'}), 400

        # Parse the incoming date string into a datetime object
        try:
            appointment_date = datetime.fromisoformat(date_str).date()  # Ensure your date_str is in ISO format
        except ValueError:
            return jsonify({'error': 'Invalid date format. Please use ISO format (YYYY-MM-DD).'}), 400

        # Create a new booking instance
        new_booking = Booking(
            client_id=client_id,
            therapist_id=therapist_id,
            appointment_date=appointment_date,
            appointment_time=time_str  # Save the chosen time
        )

        # Add to the database
        db.session.add(new_booking)
        db.session.commit()
        return jsonify({'message': 'Booking confirmed!', 'booking_id': new_booking.id}), 201

    except pyjwt.ExpiredSignatureError:
        return jsonify({'error': 'Token has expired!'}), 401
    except pyjwt.InvalidTokenError:
        return jsonify({'error': 'Kindly Log In First!'}), 401
    except Exception as e:
        db.session.rollback()  # Roll back in case of error
        print("Error occurred:", e)  # Log the error for debugging
        return jsonify({'error': 'An error occurred while booking the appointment.'}), 500
    

@app.route('/api/appointments', methods=['GET'])
def get_appointments():
    client_id = request.args.get('client_id')
    
    if not client_id:
        return jsonify({'error': 'Client ID is required'}), 400
    
    try:
        # Fetch bookings for the specified client
        appointments = Booking.query.filter_by(client_id=client_id).all()
        
        # Format the appointments into a list of dictionaries
        appointments_list = [
            {
                'id': booking.id,
                'therapist_id': booking.therapist_id,
                'therapist_name': booking.therapist.name,
                'date': booking.date.strftime('%Y-%m-%d'),  # Format date as string
                'time': booking.time,
            }
            for booking in appointments
        ]
        
        return jsonify(appointments_list), 200
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/set-primary-therapist', methods=['POST'])
def set_primary_therapist():
    client_id = request.json.get('client_id')
    if not client_id:
        return jsonify({"error": "Client ID is required"}), 400
    therapist_id = request.json.get('therapist_id')
    if not client_id:
        return jsonify({"error": "Client ID is required"}), 400

    print('id: ', therapist_id)

    # Find the client by ID
    client = User.query.get(client_id)
    if client:
        # Set the therapist as the primary therapist
        client.therapist_id = therapist_id
        db.session.commit()  # Commit the changes to the database
        return jsonify({'message': 'Therapist set as primary successfully.'}), 200
    else:
        return jsonify({'error': 'Client not found.'}), 404


@app.route('/api/therapist/<int:user_id>', methods=['GET'])
def get_primary_therapist(user_id):
    try:
        # Query the User model to find the client associated with the provided user_id
        client = User.query.get(user_id)

        if not client:
            return jsonify({'error': 'Client not found'}), 404

        # Fetch the therapist based on therapist_id from the client record
        therapist = User.query.get(client.therapist_id)  # Fetch the therapist by ID

        print('therapist' , therapist)

        if not therapist:
            return jsonify({'message': 'No primary therapist assigned'}), 404

        # Fetch the therapist's profile for additional information
        therapist_profile = TherapistProfile.query.filter_by(user_id=therapist.id).first()

        therapist_data = {
            'id': therapist.id,
            'name': therapist.name,
            'email': therapist.email,
            'phone': therapist.phone,
            'qualifications': therapist_profile.qualifications if therapist_profile else None,
            'specialties': therapist_profile.specialties if therapist_profile else None,
            'experience_years': therapist_profile.experience_years if therapist_profile else None,
            'image': therapist_profile.image if therapist_profile else None,
            'bio': therapist_profile.bio if therapist_profile else None
        }

        return jsonify(therapist_data), 200

    except Exception as e:
        print("Error fetching primary therapist:", e)
        return jsonify({'error': 'An error occurred while fetching the therapist'}), 500
