import React from 'react';
import '../styles/AboutUs.css'; // Assuming you have a styles folder for CSS

const AboutUs = () => {
  return (
    <div className='back-main'>
    <div className="about-us-container">
      <section className="hero-section">
        <h1>About Theraconnect</h1>
        <p>
            At Theraconnect, we believe that mental health care should be accessible,
            personalized, and empowering. In a world where stress, anxiety, and 
            emotional struggles are common, we aim to bridge the gap between those seeking help and
            the professional therapists who can provide it. Our platform was created with a singular 
            purpose: to offer a seamless, secure, and supportive environment where individuals can find 
            the care they need, when they need it most.</p>
      </section>

      <section className="vision-section">
        <h2>Our Vision</h2>
        <p>
            Our vision is to redefine the way people approach mental health. 
            We aspire to break down the barriers that prevent people from seeking help—whether 
            it's the stigma attached to therapy, the lack of access to qualified professionals, 
            or the uncertainty about where to begin. By fostering a community where mental wellness 
            is prioritized, we hope to create a world where everyone feels supported and empowered to thrive.
        </p>
      </section>

      <section className="mission-section">
        <h2>Our Mission</h2>
        <p>
        Theraconnect’s mission is to provide an easy, affordable, and secure way for individuals 
        to access professional therapy services. We are committed to creating a platform that connects 
        users with licensed therapists tailored to their specific needs. Our approach combines cutting-edge 
        technology with human compassion, ensuring that every user feels seen, heard, and cared for.

        We envision a world where mental health care is not a luxury, but a fundamental right. 
        Through our platform, we aim to make this vision a reality by offering a space where therapists 
        and clients can build meaningful, healing relationships.
        </p>
      </section>

      <section className="what-we-offer-section">
        <h2>What We Offer</h2>
        <p>
        Theraconnect is designed to take the stress out of finding the right therapist. Here's how we do it:
            <ul>
                <li>
                    <span>Wide Network of Qualified Professionals: </span> 
                    We partner with licensed therapists across various specializations to ensure that our 
                    users find the right fit for their unique situations. Whether you are looking for help 
                    with anxiety, depression, stress management, trauma, or relationship issues, we have experts 
                    ready to guide you through your mental health journey.
                </li>
                <li>
                    <span>Personalized Matchmaking: </span> 
                    We understand that each person's mental health needs are different. Our platform takes into 
                    account your preferences and requirements to suggest therapists who are best suited to your goals and challenges.
                </li>
                <li>
                    <span>Secure and Confidential: </span> 
                    Your privacy is our priority. All communication and personal information shared on Theraconnect is securely encrypted,
                    ensuring that your sessions and data remain confidential.
                </li>
                <li>
                    <span>Convenience and Accessibility: </span> 
                    With Theraconnect, therapy is always within reach. You can book appointments, communicate with your therapist, 
                    and attend sessions from the comfort of your home, breaking down the geographical and time-related barriers that 
                    might have prevented you from seeking help in the past.
                </li>
                <li>
                    <span>Flexible Booking Options: </span> 
                    Whether you prefer to meet in person or virtually, our platform offers multiple ways to connect with your therapist. 
                    You can choose the format that works best for you—whether it’s a video session, phone call, or face-to-face appointment.
                </li>
            </ul>
        </p>
      </section>
      
      <section className="our-values-section">
        <h2>Our Values</h2>
        <p>
        At Theraconnect, we are driven by a set of core values that shape everything we do:
            <ol>
                <li>
                    <span>Compassion: </span> 
                    We believe that mental health care should be rooted in empathy. Every individual who comes to Theraconnect is treated with respect, understanding, and kindness.
                </li>
                <li>
                    <span>Integrity: </span> 
                    Trust is the foundation of any therapeutic relationship. We uphold the highest standards of professionalism, privacy, and ethical practice in our platform and services.
                </li>
                <li>
                    <span>Inclusivity: </span> 
                    We are committed to creating a space that is welcoming to all individuals, regardless of their background, gender, sexual orientation, or socioeconomic status. Mental health care should be a right, not a privilege.
                </li>
                <li>
                    <span>Innovation: </span> 
                    By leveraging technology, we continually work to improve the user experience and make mental health services more accessible, efficient, and effective for everyone.
                </li>
            </ol>
        </p>
      </section>

      <section className="meet-the-team-section">
        <h2>Meet the Team</h2>
        <p>
            Theraconnect is powered by a diverse group of passionate individuals who are dedicated to advancing 
            mental health care. Our team includes mental health professionals, technology experts, and advocates 
            who are committed to making a difference in the lives of others. Together, we bring years of experience in 
            mental health, healthcare technology, and client services, ensuring that our platform is both user-friendly 
            and clinically effective.
        </p>
      </section>

      <section className="why-us-section">
        <h2>Why Choose Theraconnect?</h2>
        <ul>
            <li>
                <span>Trusted by Professionals: </span>
                Our therapists are not only licensed but also carefully vetted to ensure they 
                meet the highest standards of care. Each therapist undergoes a thorough background 
                check and credential verification, giving you peace of mind that you're in capable hands.
            </li>
            <li>
                <span>A Holistic Approach: </span>
                We believe that mental health is deeply interconnected with overall well-being. That’s why 
                we encourage a holistic approach to care, providing resources and support for your emotional, mental, and physical well-being.
            </li>
            <li>
                <span>Commitment to Ongoing Improvement: </span>
                The world of mental health is constantly evolving, and so are we. At Theraconnect, we are 
                committed to staying at the forefront of industry developments and continuously improving 
                our platform based on feedback from our users and therapists.
            </li>
        </ul>
      </section>

      <section className="services-section">
        <h2>What We Offer</h2>
        <ul>
          <li>Access to a wide network of licensed therapists</li>
          <li>Secure online booking for therapy sessions</li>
          <li>Personalized recommendations based on your needs</li>
        </ul>
      </section>

      <section className="community-section">
        <h2>Join Our Community</h2>
        <p>
        By choosing Theraconnect, you are joining a community of individuals who are committed to 
        taking control of their mental health. Whether you are seeking support for yourself or looking to 
        help others as a therapist, we welcome you to explore all that Theraconnect has to offer. 
        Together, we can create a world where mental health care is accessible to all, and no 
        one has to navigate their challenges alone.
        </p>
      </section>
    </div>
    </div>
  );
};

export default AboutUs;
