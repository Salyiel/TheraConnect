import os
from twilio.rest import Client
from twilio.base.exceptions import TwilioException
from flask import current_app

def send_sms(to, body):
    # Twilio credentials
    account_sid = current_app.config['TWILIO_ACCOUNT_SID']
    auth_token = current_app.config['TWILIO_AUTH_TOKEN']
    twilio_phone_number = current_app.config['TWILIO_PHONE_NUMBER']
    
    try:
        # Create a Twilio client
        client = Client(account_sid, auth_token)
        
        # Send SMS
        message = client.messages.create(
            body=body,
            from_=twilio_phone_number,
            to=to
        )
        
        return message.sid
    except TwilioException as e:
        # Handle specific Twilio errors
        current_app.logger.error(f"Twilio error: {str(e)}")
        return None  # or raise an error, or return a specific error message
    except Exception as e:
        # Handle other exceptions
        current_app.logger.error(f"Error sending SMS: {str(e)}")
        return None  # or raise an error, or return a specific error message