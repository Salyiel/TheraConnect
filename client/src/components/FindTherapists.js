import React from "react";
import "../styles/FindTherapists.css";

const FindTherapists = () => {
  return (
    <div className="therapists-container">
      {/* Navigation Bar */}
      <header className="navbar">
        <div className="logo">
          <span className="thera">Thera</span><span className="connect">connect</span>
        </div>
        <nav>
          <a href=".">About</a>
          <a href=".">Services</a>
          <a href=".">Mental Health Resources</a>
          <a href="." className="highlight-button">How it works</a>
        </nav>
      </header>

      {/* Filters */}
      <h1>Find Therapists Online</h1>
      <div className="filters-container">
        <div className="filter-box">
          <button><i className="fa fa-bars"></i></button>
          <input type="text" placeholder="Filter by Specialty" />
          <button><i className="fa fa-search"></i></button>
        </div>
        <div className="filter-box">
          <button><i className="fa fa-bars"></i></button>
          <input type="text" placeholder="by Location" />
          <button><i className="fa fa-search"></i></button>
        </div>
        <div className="filter-box">
          <button><i className="fa fa-bars"></i></button>
          <input type="text" placeholder="by Availability" />
          <button><i className="fa fa-search"></i></button>
        </div>
      </div>

      {/* Therapists Cards */}
      <div className="therapists-grid">
        <div className="therapist-card">
          <div className="therapist-image"></div>
          <h3>Ms Walls Ada Mphil, PhD</h3>
          <p className="qualification">Licensed Psychologist</p>
          <p>Over 15 years experience as a Clinical psychologist.</p>
          <p className="location">Nairobi, Kenya</p>
          <a href="." className="profile-link">see full profile</a>
        </div>
        <div className="therapist-card">
          <div className="therapist-image"></div>
          <h3>Name</h3>
          <p className="qualification">Qualification</p>
          <p>Short Description</p>
          <p className="location">City, Country</p>
          <a href="." className="profile-link">see full profile</a>
        </div>
        <div className="therapist-card">
          <div className="therapist-image"></div>
          <h3>Name</h3>
          <p className="qualification">Qualification</p>
          <p>Short Description</p>
          <p className="location">City, Country</p>
          <a href="." className="profile-link">see full profile</a>
        </div>
      </div>

      {/* Pagination */}
      <div className="pagination">
        <a href=".">← Previous</a>
        <span className="current-page">1</span>
        <a href=".">2</a>
        <a href=".">3</a>
        <span>...</span>
        <a href=".">67</a>
        <a href=".">Next →</a>
      </div>

      {/* Footer Disclaimer */}
      <footer className="disclaimer">
        <p>Information provided on this platform is intended for general informational purposes only and is not a substitute for professional medical advice.</p>
      </footer>
    </div>
  );
};

export default FindTherapists;
