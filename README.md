TheraConnect 🌐💙

Connecting Clients with Therapists & Psychologists for Better Mental Health

TheraConnect is a web-based platform designed to bridge the gap between therapists and clients, providing a comprehensive solution for online and in-person therapy session bookings. The platform enables clients to find and book licensed therapists, manage their appointments, and provide feedback on the services received. Therapists can register their services, manage their schedules, and view client feedback, fostering a professional and supportive environment.

Table of Contents

	•	Features
	•	For Clients
	•	For Therapists
	•	Additional Features
	•	Tech Stack
	•	Getting Started
	•	Installation and Setup
	•	Database Models
	•	Client-Side Routes
	•	API Endpoints
	•	User Stories
	•	Future Features
	•	Contributing
	•	License

Features ✨

For Clients

	•	📋 Browse & Search Therapists: Search for therapists based on specialties, location, or availability.
	•	🗓 Book Appointments: Schedule and manage therapy sessions seamlessly.
	•	🔐 Secure User Accounts: JWT-based authentication to keep user data safe.
	•	📅 View Appointment History: Track previous sessions and feedback.
	•	💬 Private Messaging: Communicate securely with therapists between sessions.
	•	📹 Virtual Sessions: Attend therapy sessions via video calls.
	•	📚 Self-Help Resources: Access guides and resources for mental health.

For Therapists

	•	👩‍⚕️ Profile Management: Create, update, and showcase therapist profiles with specializations and available slots.
	•	📅 Schedule Management: Manage and update work schedules.
	•	✉️ Client Communication: Securely message clients and send resources.
	•	📈 View Appointments: Access upcoming appointments to plan effectively.

Additional Features

	•	📱 Responsive Design: Adapted for both mobile and desktop views.
	•	🌍 Localization Support: Tailored to the Kenyan market with relevant timezone and currency settings.

Tech Stack 🛠️

Backend

	•	Python with Flask: A lightweight framework for creating the server-side application.
	•	Flask-SQLAlchemy: ORM for database models and schema management.
	•	Flask-Migrate: For database migrations.
	•	Flask-JWT-Extended: JWT-based authentication for user security.

Frontend

	•	React: For building a dynamic and interactive user interface.
	•	React Router: Client-side routing and navigation.
	•	Axios/Fetch API: For making API calls to the Flask backend.

Database

	•	SQLite3: Used for both local development and production.

Getting Started

To get a local copy of this project up and running, follow these steps:

Installation and Setup

	1.	Clone the repository:

git clone https://github.com/yourusername/TheraConnect.git
cd TheraConnect


	2.	Set up a virtual environment:

python -m venv venv
source venv/bin/activate  # On Windows use `venv\Scripts\activate`


	3.	Install the required packages:

pip install -r requirements.txt


	4.	Run the migrations:

flask db upgrade


	5.	Start the backend server:

flask run


	6.	Start the frontend server:

cd frontend  # Navigate to your frontend directory
npm install
npm start



Database Models

User Model

	•	id: Integer, primary key.
	•	email: String, unique.
	•	password: String.
	•	role: Enum (Client, Therapist).

Appointment Model

	•	id: Integer, primary key.
	•	client_id: Foreign key to User.
	•	therapist_id: Foreign key to User.
	•	date_time: DateTime.
	•	status: Enum (Pending, Confirmed, Cancelled).

Feedback Model

	•	id: Integer, primary key.
	•	appointment_id: Foreign key to Appointment.
	•	rating: Integer.
	•	comment: Text.

Client-Side Routes

	•	/: Home page, displaying therapist search.
	•	/login: Login page for clients and therapists.
	•	/signup: Signup page for clients and therapists.
	•	/appointments: View and manage appointments.
	•	/profile: Manage user profiles.

API Endpoints

Authentication

	•	POST /api/login: Login and obtain JWT token.
	•	POST /api/signup: Register a new user.

Therapists

	•	GET /api/therapists: Retrieve a list of therapists.
	•	POST /api/therapist: Create a new therapist profile.

Appointments

	•	POST /api/appointments: Book a new appointment.
	•	GET /api/appointments: Get user’s appointment history.

Feedback

	•	POST /api/feedback: Submit feedback for an appointment.

User Stories

	1.	As a User, I want to be able to create an account and log in, so that I can securely access the platform and manage my mental health information.
	2.	As a User, I want to search for therapists based on location, availability, and specialty, so that I can find a therapist who suits my specific needs.
	3.	As a User, I want to book an appointment online, so that I can easily schedule therapy sessions at a convenient time.
	4.	As a User, I want to have a secure space for private messaging, so that I can communicate with my therapist between sessions.
	5.	As a User, I want to attend my therapy sessions virtually through video calls, so that I can access therapy without the need to travel.
	6.	As a User, I want to read self-help resources and guides, so that I can learn more about mental health and find strategies to manage my condition.
	7.	As a Therapist, I want to set up my profile with details like my specialization, qualifications, and available slots, so that users can understand my expertise and book sessions accordingly.
	8.	As a Therapist, I want to view my upcoming appointments and manage my schedule, so that I can effectively plan my time.
	9.	As a Therapist, I want to be able to securely message my clients and send them resources, so that I can support them beyond our scheduled sessions.
	10.	As a Platform Admin, I want to review therapist applications and approve or reject profiles, so that I ensure that only licensed professionals are listed.
	11.	As a Platform Admin, I want to manage platform settings and view usage statistics, so that I can ensure smooth operation and make data-driven decisions.

Future Features

	•	Video Conferencing Integration: Enable smoother virtual therapy sessions.
	•	Advanced Search Filters: Improve therapist search capabilities.
	•	Mobile Application: Develop a mobile version of TheraConnect.

Contributing

Contributions are welcome! Please read the CONTRIBUTING.md for details on how to contribute to the project.

License

This project is licensed under the MIT License - see the LICENSE file for details.

Feel free to adjust any sections as needed or let me know if you need any more changes!