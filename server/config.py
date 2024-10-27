import os

class Config:
    SECRET_KEY = os.getenv('SECRET_KEY', '55qZfsUsfB4e70DgoGQ5ESFfzUWBQwN')
    SQLALCHEMY_DATABASE_URI = 'sqlite:///theraconnect.db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY', '55qZfsUsfB4e70DgoGQ5ESFfzUWBQwN')

    # Flask-Mail Configuration
        
    MAIL_SERVER = 'smtp.gmail.com'           # Gmail SMTP server
    MAIL_PORT = 587                           # Port for TLS
    MAIL_USE_TLS = True                       # Use TLS for secure connection
    MAIL_USE_SSL = False                      # Do not use SSL (since we are using TLS)
    MAIL_USERNAME = os.getenv('MAIL_USERNAME') # Your Gmail address, securely stored in an environment variable
    MAIL_PASSWORD = os.getenv('MAIL_PASSWORD') # App password or regular password in environment variable
    MAIL_DEFAULT_SENDER = MAIL_USERNAME       # Set the default sender to the Gmail address

    # Optional additional settings (not required but useful):
    MAIL_MAX_EMAILS = 50                      # Limit on the number of emails that can be sent at once
    MAIL_SUPPRESS_SEND = False                # If True, suppress sending emails in development
    MAIL_ASCII_ATTACHMENTS = False            # If True, encode attachments in ASCII format