import React from 'react';
import "../styles/Banned.css";

const Banned = () => {
  return (
    <div className='entire'>
        <div className="under-review-container">
            <h1>You Are Temporarily Banned</h1>
            <p>
                Your account has been temporarily banned due to a violation of our policies. It is currently under review. You will be informed when further action is taken.
            </p>
            <p>
                Please contact our support team if you believe this is a mistake or if you have any questions regarding your account status.
            </p>
            <p className="thank-you">Thank you for your understanding!</p>
        </div>
    </div>
  );
};

export default Banned;
