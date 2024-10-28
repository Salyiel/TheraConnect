import React, { useState, useEffect } from 'react';
import { Link, useNavigate} from "react-router-dom";
import "../styles/FindTherapists.css";

const FindTherapists = () => {
  const [therapists, setTherapists] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  // Fetch therapists data from API
  useEffect(() => {
    const fetchTherapists = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_FLASK_API_URL}/api/therapists?page=${currentPage}`);
        const data = await response.json();
        setTherapists(data.therapists);
        setTotalPages(data.total_pages);
      } catch (error) {
        console.error("Error fetching therapists:", error);
      }
    };

    fetchTherapists();
  }, [currentPage]);

  // Handle pagination
  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('userId');
    sessionStorage.removeItem('userName');
    sessionStorage.removeItem('userEmail');
    sessionStorage.removeItem('therapist');
    sessionStorage.removeItem('role');
    navigate('/login');
  };

  return (
    <div className="therapists-container">
      {/* Navigation Bar */}
      <header className="navbar">
        <div className="logo">
          <span className="thera">Thera</span><span className="connect">connect</span>
        </div>
        <nav>
        {/* <button className="page">{therapistPage}</button> */}
            <button><Link to="/conversations">Messages</Link></button>
            <button><Link to="/profile">Profile</Link></button>
            <button><Link to="/about-us">About Us</Link></button>
            <button onClick={handleLogout}>Logout</button>
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
        {therapists.length > 0 ? (
          therapists.map(therapist => (
            <div key={therapist.id} className="therapist-card">
              <div className="therapist-image">
                <img src={therapist.image || "path/to/placeholder/image.jpg"} alt={`${therapist.name}`} />
              </div>
              <h3>Name: {therapist.name || "Name"}</h3>
              <p className="qualification">Qualification: {therapist.qualification || "Qualification"}</p>
              <p className="qualification">Years of Experience: {therapist.experience || "Short Description"}</p>
              <p className="qualification">Location: {therapist.location || "City, Country"}</p>
              <Link to={`/therapist-profile/${therapist.id}`} className="profile-link">see full profile</Link>
            </div>
          ))
        ) : (
          <p>No therapists found.</p>
        )}
      </div>

      {/* Pagination */}
      <div className="pagination">
        <button onClick={handlePrevious} disabled={currentPage === 1}>← Previous</button>
        <span className="current-page">{currentPage}</span>
        <button onClick={handleNext} disabled={currentPage === totalPages}>Next →</button>
      </div>

      {/* Footer Disclaimer */}
      <footer className="disclaimer">
        <p>Information provided on this platform is intended for general informational purposes only and is not a substitute for professional medical advice.</p>
      </footer>
    </div>
  );
};

export default FindTherapists;
