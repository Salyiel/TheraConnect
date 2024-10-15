from app import db
from flask_bcrypt import generate_password_hash, check_password_hash
from datetime import datetime,timedelta

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    gender = db.Column(db.String(10), nullable=False)  # e.g., "Male", "Female", "Other"
    dob = db.Column(db.Date, nullable=False)  # Store as a date
    location = db.Column(db.String(100), nullable=True)
    phone = db.Column(db.String(15), nullable=False)  # Adjust length as needed
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)  # Changed to password_hash
    role = db.Column(db.String(20), nullable=False)  # 'client' or 'therapist'

    def __init__(self, name, gender, dob, location, phone, email, password, role):
        self.name = name
        self.gender = gender
        self.dob = datetime.strptime(dob, '%Y-%m-%d') if isinstance(dob, str) else dob
        self.location = location
        self.phone = phone
        self.email = email
        self.password_hash = generate_password_hash(password).decode('utf-8')
        self.role = role

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def __repr__(self):
        return f'<User {self.email}>'
    

class PendingVerification(db.Model):
    name = db.Column(db.String(50), nullable=False)
    gender = db.Column(db.String(10), nullable=False)
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), nullable=False)
    dob = db.Column(db.Date, nullable=False)
    phone = db.Column(db.String(15), nullable=False)
    location = db.Column(db.String(100), nullable=False)
    password = db.Column(db.String(128), nullable=False)
    role = db.Column(db.String(20), nullable=False)
    verification_code = db.Column(db.String(6), nullable=False)
    expires_at = db.Column(db.DateTime, nullable=False)

    def __init__(self, name, email, verification_code, dob, gender, location, phone, password, role, expires_at):
        self.name = name
        self.email = email
        self.verification_code = verification_code
        self.dob = dob
        self.gender = gender
        self.location = location
        self.phone = phone
        self.password = password
        self.role = role
        self.expires_at = expires_at
    

class OTP(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), nullable=False)
    otp = db.Column(db.String(6), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    expires_at = db.Column(db.DateTime, nullable=False)

    def is_expired(self):
        return datetime.utcnow() > self.expires_at



