from models import User, Therapist, Appointment, Specialization
from flask import jsonify

# General serializer function to convert models into JSON format
def serialize(model_instance):
    return jsonify(model_instance.to_dict())