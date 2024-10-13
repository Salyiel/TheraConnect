from twilio.rest import Client
from flask import current_app
import random
from twilio.base.exceptions import TwilioRestException

# Send OTP using Twilio
def send_otp(phone_number):
    client = Client(current_app.config['TWILIO_ACCOUNT_SID'], current_app.config['TWILIO_AUTH_TOKEN'])
    
    otp = str(random.randint(100000, 999999))  # Generate 6-digit OTP
    
    try:
        message = client.messages.create(
            body=f"Your OTP code is {otp}",
            from_=current_app.config['TWILIO_PHONE_NUMBER'],
            to=phone_number
        )
        return otp  # Store OTP for later validation
    except TwilioRestException as e:
        print(f'Error sending OTP: {e}')
        return None  # Return None if OTP sending fails

# Verify OTP
def verify_otp(input_otp, actual_otp):
    return input_otp == actual_otp