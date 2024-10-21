import os

class Config:
    SECRET_KEY = os.getenv('SECRET_KEY', '55qZfsUsfB4e70DgoGQ5ESFfzUWBQwN')
    SQLALCHEMY_DATABASE_URI = 'sqlite:///theraconnect.db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY', '55qZfsUsfB4e70DgoGQ5ESFfzUWBQwN')

    # Flask-Mail Configuration
    MAIL_SERVER = 'smtp.gmail.com'  # Gmail SMTP server
    MAIL_PORT = 587  # Port for TLS
    MAIL_USE_TLS = True  # Use TLS
    MAIL_USE_SSL = False  # Do not use SSL
    MAIL_USERNAME = os.getenv('MAIL_USERNAME')  # Your Gmail address
    MAIL_PASSWORD = os.getenv('MAIL_PASSWORD')  # Your Gmail password or app password
    MAIL_DEFAULT_SENDER = os.getenv('MAIL_USERNAME')  # Default sender email
