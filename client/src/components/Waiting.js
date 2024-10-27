// TherapistUnderReview.js
import React from 'react';
import "../styles/Waiting.css";

const Waiting = () => {
  return (
    <div className='entire'>
        <div className="under-review-container">
            <h1>Application Under Review</h1>
            <p>
                Thank you for submitting your profile! Our team is currently reviewing your application to ensure all necessary requirements are met.
            </p>
            <p>
                Please check back later for updates. We’ll notify you once your profile is approved and ready to go!
            </p>
            <p className="thank-you">Thank you for your patience!</p>
        </div>
    </div>
  );
};

export default Waiting;
