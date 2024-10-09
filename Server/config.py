import os
from datetime import timedelta

# Base configuration
class Config:
    """Base config class with default settings"""
    SECRET_KEY = os.environ.get("SECRET_KEY", "supersecretkey")
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_SECRET_KEY = os.environ.get("JWT_SECRET_KEY", "jwt-secret-string")  # JWT for secure API
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=1)  # 
    DEBUG = False
    TESTING = False