from datetime import datetime, timezone
from sqlalchemy import UniqueConstraint
from sqlalchemy.orm import validates
from sqlalchemy_serializer import SerializerMixin
from app import db
from werkzeug.security import generate_password_hash, check_password_hash

# Many-to-many relationship between User and Therapist
user_therapist_association = db.Table('user_therapist_association',
    db.Column('user_id', db.Integer, db.ForeignKey('user.id'), primary_key=True),
    db.Column('therapist_id', db.Integer, db.ForeignKey('therapist.id'), primary_key=True)
)

class User(db.Model, SerializerMixin):
    __tablename__ = 'user'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(200), nullable=False)
    phone = db.Column(db.String(20), nullable=False)
    position = db.Column(db.String(50), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    # Relationships
    appointments = db.relationship('Appointment', back_populates='user', lazy=True)
    therapists = db.relationship('Therapist', secondary=user_therapist_association, back_populates='users', lazy='dynamic')

    # Serializer fields
    serialize_rules = ('-password_hash', 'appointments', 'therapists')

    # Validations
    @validates('email')
    def validate_email(self, key, value):
        if not value or '@' not in value:
            raise ValueError("Invalid email address.")
        return value

    @validates('phone')
    def validate_phone(self, key, value):
        if len(value) < 10:
            raise ValueError("Phone number must be at least 10 digits.")
        return value

    # Password hashing
    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def __repr__(self):
        return f'<User {self.id}: {self.name} ({self.email})>'

class Therapist(db.Model, SerializerMixin):
    __tablename__ = 'therapist'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    phone = db.Column(db.String(20), nullable=False)
    specialization = db.Column(db.String(100), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    # Relationships
    appointments = db.relationship('Appointment', back_populates='therapist', lazy=True)
    users = db.relationship('User', secondary=user_therapist_association, back_populates='therapists', lazy='dynamic')
    specializations = db.relationship('Specialization', back_populates='therapist')

    serialize_rules = ('-appointments', '-users')

    def __repr__(self):
        return f'<Therapist {self.id}: {self.name} ({self.specialization})>'

class Appointment(db.Model, SerializerMixin):
    __tablename__ = 'appointment'
    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.DateTime, nullable=False)
    status = db.Column(db.String(50), default='pending')  # Default status is 'pending'
    
    # Foreign Keys
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    therapist_id = db.Column(db.Integer, db.ForeignKey('therapist.id'), nullable=False)

    # Relationships
    user = db.relationship('User', back_populates='appointments')
    therapist = db.relationship('Therapist', back_populates='appointments')

    def __repr__(self):
        return f'<Appointment {self.id}: {self.date} (Status: {self.status})>'

class Specialization(db.Model, SerializerMixin):
    __tablename__ = 'specialization'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)

    # Foreign Key to Therapist
    therapist_id = db.Column(db.Integer, db.ForeignKey('therapist.id'), nullable=False)

    therapist = db.relationship('Therapist', back_populates='specializations')

    def __repr__(self):
        return f'<Specialization {self.id}: {self.name}>'