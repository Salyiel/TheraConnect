import os
import binascii
from datetime import timedelta

class Config:
    """Base configuration."""
    
    # use a predefined JWT secret key
    JWT_SECRET_KEY = binascii.hexlify(os.urandom(32)).decode()

    # General Flask Configurations
    SECRET_KEY = os.getenv('SECRET_KEY', 'your_fallback_secret_key')  # fallback for general Flask secret key
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL', 'sqlite:///theraconnect.db')
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # JWT Configuration
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(minutes=30)  # Tokens expire after 30 minutes
    JWT_REFRESH_TOKEN_EXPIRES = timedelta(days=30)  # Refresh tokens expire after 30 days

    # Environment
    DEBUG = os.getenv('FLASK_DEBUG', True)
    ENV = os.getenv('FLASK_ENV', 'development')

    # Twilio Configuration
    TWILIO_ACCOUNT_SID = os.getenv('TWILIO_ACCOUNT_SID', 'your_twilio_account_sid')
    TWILIO_AUTH_TOKEN = os.getenv('TWILIO_AUTH_TOKEN', 'your_twilio_auth_token')
    TWILIO_PHONE_NUMBER = os.getenv('TWILIO_PHONE_NUMBER', 'your_twilio_phone_number')

    # Additional configurations can go here...

class DevelopmentConfig(Config):
    """Development-specific configuration."""
    DEBUG = True

class ProductionConfig(Config):
    """Production-specific configuration."""
    DEBUG = False
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL', 'postgresql://username:password@localhost/theraconnect_prod')

config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'default': DevelopmentConfig
}