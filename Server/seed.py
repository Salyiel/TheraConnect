from app import db
from models import User, Therapist, Specialization, Appointment
from datetime import datetime, timedelta
from werkzeug.security import generate_password_hash
import random

def seed_users():
    users = [
        User(
            name='John Doe',
            email='john@example.com',
            phone='5551234567',
            position='Client',
            password_hash=generate_password_hash('password123', method='sha256')
        ),
        User(
            name='Jane Smith',
            email='jane@example.com',
            phone='5559876543',
            position='Client',
            password_hash=generate_password_hash('mypassword', method='sha256')
        ),
        User(
            name='Alice Johnson',
            email='alice@example.com',
            phone='5551112222',
            position='Client',
            password_hash=generate_password_hash('alice2023', method='sha256')
        )
    ]
    db.session.bulk_save_objects(users)
    db.session.commit()
    print("Seeded users")

def seed_therapists():
    therapists = [
        Therapist(
            name='Dr. Emily Carter',
            email='emily.carter@example.com',
            phone='5557654321',
            specialization='Cognitive Behavioral Therapy',
            license_number='CBT12345',
            created_at=datetime.utcnow()
        ),
        Therapist(
            name='Dr. Robert Brown',
            email='robert.brown@example.com',
            phone='5553334444',
            specialization='Marriage Counseling',
            license_number='MC98765',
            created_at=datetime.utcnow()
        )
    ]
    db.session.bulk_save_objects(therapists)
    db.session.commit()
    print("Seeded therapists")

def seed_specializations():
    specializations = [
        Specialization(
            name='Cognitive Behavioral Therapy',
            therapist_id=1  # Assigning to Dr. Emily Carter
        ),
        Specialization(
            name='Marriage Counseling',
            therapist_id=2  # Assigning to Dr. Robert Brown
        ),
    ]
    db.session.bulk_save_objects(specializations)
    db.session.commit()
    print("Seeded specializations")

def seed_appointments():
    today = datetime.utcnow()
    appointments = [
        Appointment(
            date=today + timedelta(days=1),
            status='pending',
            user_id=1,  # John Doe
            therapist_id=1  # Dr. Emily Carter
        ),
        Appointment(
            date=today + timedelta(days=2),
            status='confirmed',
            user_id=2,  # Jane Smith
            therapist_id=2  # Dr. Robert Brown
        ),
        Appointment(
            date=today + timedelta(days=3),
            status='completed',
            user_id=3,  # Alice Johnson
            therapist_id=1  # Dr. Emily Carter
        )
    ]
    db.session.bulk_save_objects(appointments)
    db.session.commit()
    print("Seeded appointments")

def seed_data():
    seed_users()
    seed_therapists()
    seed_specializations()
    seed_appointments()

if __name__ == '__main__':
    # Run the seed functions
    seed_data()