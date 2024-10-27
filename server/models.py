from app import db
from flask_bcrypt import generate_password_hash, check_password_hash
from datetime import datetime,timedelta

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    gender = db.Column(db.String(10), nullable=False)
    dob = db.Column(db.Date, nullable=False)
    location = db.Column(db.String(100), nullable=True)
    phone = db.Column(db.String(15), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    role = db.Column(db.String(20), nullable=False)
    is_verified = db.Column(db.Boolean, default=False)

    # Relationship for clients to their therapist
    therapist_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=True)
    therapist = db.relationship('User', remote_side=[id], backref='clients', lazy=True)

    def __init__(self, name, gender, dob, location, phone, email, password, role, is_verified):
        self.name = name
        self.gender = gender
        self.dob = datetime.strptime(dob, '%Y-%m-%d') if isinstance(dob, str) else dob
        self.location = location
        self.phone = phone
        self.email = email
        self.password_hash = generate_password_hash(password).decode('utf-8')
        self.role = role
        self.is_verified = is_verified

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def __repr__(self):
        return f'<User {self.email}>'
    
    notes = db.relationship('Note', backref='user', lazy=True)


class TherapistProfile(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    user = db.relationship('User', backref=db.backref('therapist_profile', uselist=False))

    # Therapist-specific fields
    image = db.Column(db.String(200), nullable=True)  # File path or URL of the image
    license_number = db.Column(db.String(200), nullable=True)  # Therapist's license number
    qualifications = db.Column(db.String(255), nullable=False)
    specialties = db.Column(db.String(255), nullable=True)
    experience_years = db.Column(db.Integer, nullable=False)
    availability = db.Column(db.String(50), nullable=True)
    consultation_fee = db.Column(db.Float, nullable=True)
    bio = db.Column(db.Text, nullable=True)
    languages = db.Column(db.String(100), nullable=True)
    location = db.Column(db.String(100), nullable=True)

    def __init__(self, user_id, image, license_number, qualifications, specialties, experience_years, availability, consultation_fee=None, bio=None, languages=None, location=None):
        self.user_id = user_id
        self.image = image
        self.license_number = license_number
        self.qualifications = qualifications
        self.specialties = specialties
        self.experience_years = experience_years
        self.availability = availability
        self.consultation_fee = consultation_fee
        self.bio = bio
        self.languages = languages
        self.location = location

    def __repr__(self):
        return f'<TherapistProfile {self.user.name}>'


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
    is_verified = db.Column(db.Boolean)


    def __init__(self, name, email, verification_code, dob, gender, location, phone, password, role, is_verified, expires_at):
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
        self.is_verified = is_verified
    

class OTP(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), nullable=False)
    otp = db.Column(db.String(6), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    expires_at = db.Column(db.DateTime, nullable=False)

    def is_expired(self):
        return datetime.utcnow() > self.expires_at
    

class EmailChangeVerification(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), nullable=False, unique=True)
    used_email = db.Column(db.String(120), nullable=False)
    verification_code = db.Column(db.String(6), nullable=False)
    expires_at = db.Column(db.DateTime, nullable=False)

    def __init__(self, email, used_email, verification_code, expires_at):
        self.email = email
        self.used_email = used_email
        self.verification_code = verification_code
        self.expires_at = expires_at


class Note(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    content = db.Column(db.Text, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)  # Foreign key to User table
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'content': self.content,
            'user_id': self.user_id,
            'created_at': self.created_at,
            'updated_at': self.updated_at
        }
    

class Booking(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    client_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    therapist_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    date = db.Column(db.Date, nullable=False)  # Store only the date
    time = db.Column(db.String(10), nullable=False)  # Store the time as a string (or use Time type)

    client = db.relationship('User', foreign_keys=[client_id], backref='bookings_as_client', lazy=True)
    therapist = db.relationship('User', foreign_keys=[therapist_id], backref='bookings_as_therapist', lazy=True)

    def __init__(self, client_id, therapist_id, appointment_date, appointment_time, status='pending'):
        self.client_id = client_id
        self.therapist_id = therapist_id
        self.date = appointment_date
        self.time = appointment_time  # Save the time

    def __repr__(self):
        return f'<Booking {self.id} - Client: {self.client_id}, Therapist: {self.therapist_id}, Date: {self.date}, Time: {self.time}>'
    


class Appointment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    client_name = db.Column(db.String(80), nullable=False)
    visit_type = db.Column(db.String(120), nullable=False)
    date = db.Column(db.Date, nullable=False)
    time = db.Column(db.String(50), nullable=False)
    status = db.Column(db.String(20), default="Pending")

    def to_dict(self):
        return {
            'id': self.id,
            'clientName': self.client_name,
            'visitType': self.visit_type,
            'date': self.date.strftime('%Y-%m-%d'),
            'time': self.time,
            'status': self.status
        }
    

    # *********************ADMIN PAGE*********************************

class Therapist(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    license_number = db.Column(db.String(100), unique=True, nullable=False)
    approved = db.Column(db.Boolean, default=False)

class Client(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)

# Resource Model (ensure this model exists in your application)
class Resource(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    topic = db.Column(db.String(100), nullable=True)
    url = db.Column(db.String(255), nullable=False)
    is_approved = db.Column(db.Boolean, default=False)
    added_by = db.Column(db.Integer, db.ForeignKey('user.id'))  # User who added the resource
    added_date = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f'<Resource {self.title}>'


class Announcement(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    message = db.Column(db.Text, nullable=False)
    recipient = db.Column(db.String(50), nullable=False)


# ****************THERAPIST PAGE*********************************************
