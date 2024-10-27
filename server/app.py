from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from flask_mail import Mail
from flask_socketio import SocketIO  # Import SocketIO
from config import Config
from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()

# Initialize Flask app
app = Flask(__name__)

# Configure the app with settings from Config
app.config.from_object(Config)

# Enable CORS
CORS(app, origins=["https://theraconnect-oepw.onrender.com"])

# Initialize SQLAlchemy and Flask-Migrate
db = SQLAlchemy(app)
migrate = Migrate(app, db)

# Initialize Bcrypt for password hashing
bcrypt = Bcrypt(app)

# Initialize Flask-Mail
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = os.getenv('MAIL_USERNAME')  # Replace with your email
app.config['MAIL_PASSWORD'] = os.getenv('MAIL_PASSWORD')  # Replace with your email password
app.config['MAIL_DEFAULT_SENDER'] = 'noreply@tc.com'  # Set default sender
os.getenv('ADMIN_EMAIL_ADMIN')

mail = Mail(app)

# Initialize SocketIO
socketio = SocketIO(app)

@app.route('/')
def index():
    print("server is running")
    return "WELCOME TO THERACONNECT"

# Import routes after initializing the app
from routes import *

# Socket.IO event example
@socketio.on('sendMessage')
def handle_send_message(data):
    # Broadcast the message to all connected clients
    socketio.emit('newMessage', data)

# Run the application on port 5000
if __name__ == '__main__':
    socketio.run(app, debug=True)  # Use socketio.run instead of app.run
