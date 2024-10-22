from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

app = Flask(__name__)

CORS(app)


# Database configuration
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///therapy.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# Models
class Therapist(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    license_number = db.Column(db.String(100), unique=True, nullable=False)
    approved = db.Column(db.Boolean, default=False)

class Client(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)

class Resource(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    link = db.Column(db.String(500), nullable=False)

class Announcement(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    message = db.Column(db.Text, nullable=False)
    recipient = db.Column(db.String(50), nullable=False)

# Routes
@app.route('/')
def home():
    return "Welcome to the Admin Dashboard!"

# Create a new therapist
@app.route('/therapists', methods=['POST'])
def create_therapist():
    data = request.get_json()  # Get the data from the request body
    new_therapist = Therapist(name=data['name'], license_number=data['license_number'])
    db.session.add(new_therapist)
    db.session.commit()
    return jsonify({'message': 'Therapist added successfully'}), 201

# Get all therapists
@app.route('/therapists', methods=['GET'])
def get_therapists():
    therapists = Therapist.query.all()  # Fetch all therapists from the database
    return jsonify([{'id': t.id, 'name': t.name, 'license_number': t.license_number, 'approved': t.approved} for t in therapists])

# Approve a therapist
@app.route('/therapists/<int:id>/approve', methods=['PATCH'])
def approve_therapist(id):
    therapist = Therapist.query.get_or_404(id)
    therapist.approved = True
    db.session.commit()
    return jsonify({'message': f'Therapist {therapist.name} approved successfully'})

# Disapprove a therapist (added endpoint)
@app.route('/therapists/<int:id>/disapprove', methods=['PATCH'])
def disapprove_therapist(id):
    therapist = Therapist.query.get_or_404(id)
    therapist.approved = False
    db.session.commit()
    return jsonify({'message': f'Therapist {therapist.name} disapproved successfully'})

# Delete a therapist
@app.route('/therapists/<int:id>', methods=['DELETE'])
def delete_therapist(id):
    therapist = Therapist.query.get_or_404(id)
    db.session.delete(therapist)
    db.session.commit()
    return jsonify({'message': f'Therapist {therapist.name} deleted successfully'})

# This will create the database and tables
with app.app_context():
    db.create_all()


# Create a new client
@app.route('/clients', methods=['POST'])
def create_client():
    data = request.get_json()  # Get data from the request body
    new_client = Client(name=data['name'], email=data['email'])
    db.session.add(new_client)
    db.session.commit()
    return jsonify({'message': 'Client added successfully'}), 201

# Get all clients
@app.route('/clients', methods=['GET'])
def get_clients():
    clients = Client.query.all()  # Fetch all clients from the database
    return jsonify([{'id': c.id, 'name': c.name, 'email': c.email} for c in clients])

# Delete a client
@app.route('/clients/<int:id>', methods=['DELETE'])
def delete_client(id):
    client = Client.query.get_or_404(id)
    db.session.delete(client)
    db.session.commit()
    return jsonify({'message': f'Client {client.name} deleted successfully'})

# Create a new resource
@app.route('/resources', methods=['POST'])
def create_resource():
    data = request.get_json()
    new_resource = Resource(title=data['title'], link=data['link'])
    db.session.add(new_resource)
    db.session.commit()
    return jsonify({'message': 'Resource added successfully'}), 201

# Get all resources
@app.route('/resources', methods=['GET'])
def get_resources():
    resources = Resource.query.all()
    return jsonify([{'id': r.id, 'title': r.title, 'link': r.link} for r in resources])

# Delete a resource
@app.route('/resources/<int:id>', methods=['DELETE'])
def delete_resource(id):
    resource = Resource.query.get_or_404(id)
    db.session.delete(resource)
    db.session.commit()
    return jsonify({'message': f'Resource {resource.title} deleted successfully'})

# Create a new announcement
@app.route('/announcements', methods=['POST'])
def create_announcement():
    data = request.get_json()
    new_announcement = Announcement(message=data['message'], recipient=data['recipient'])
    db.session.add(new_announcement)
    db.session.commit()
    return jsonify({'message': 'Announcement sent successfully'}), 201

# Get all announcements
@app.route('/announcements', methods=['GET'])
def get_announcements():
    announcements = Announcement.query.all()
    return jsonify([{'id': a.id, 'message': a.message, 'recipient': a.recipient} for a in announcements])

if __name__ == '_main_':
    app.run(debug=True)