import os
from twilio.rest import Client
from twilio.base.exceptions import TwilioException
from flask import current_app

def send_sms(to, body):
    try:
        # Twilio credentials from Flask configuration
        account_sid = current_app.config['TWILIO_ACCOUNT_SID']
        auth_token = current_app.config['TWILIO_AUTH_TOKEN']
        twilio_phone_number = current_app.config['TWILIO_PHONE_NUMBER']
        
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
        current_app.logger.error(f"Twilio error: {str(e)}")
        return None
    except Exception as e:
        current_app.logger.error(f"Error sending SMS: {str(e)}")
        return None