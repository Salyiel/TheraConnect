import React from 'react';
import "./ClientPage.css";

function ClientPage() {
  return (
    <div className="ClientPage">
      <header>
        <div className="header-content">
          <h2>
            Thera<span>connect</span>
          </h2>
          <nav>
            <button>Change therapist</button>
            <button>Log out</button>
          </nav>
        </div>
      </header>

      <main>
        <h1>Hi Tumaini..</h1>

        <section>
          <article className="SessionCard">
            <h3>My sessions</h3>
            <p>No Current session</p>
          </article>

          <article className="TherapistCard">
            <h3>My therapist</h3>
            <div className="therapist-info">
              <img
                loading="lazy"
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/0013e5a60ded0ca441ae634109dd8e8ecaf5fb05f73a19f2347ab2c4a64991a3?placeholderIfAbsent=true&apiKey=6580918b057948818913b37d5b0a12ce"
                alt="Therapist profile"
              />
              <div>
                <p>Mr. Allan Njoroge</p>
                <p>Masters in Social psychology</p>
                <p>7 years experience</p>
              </div>
            </div>
            <div className="contact-info">
              <p>Email:</p>
              <p>Phone:</p>
            </div>
          </article>

          <article className="NotesCard">
            <h3>My notes</h3>
            <img
              loading="lazy"
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/8776b8ce29ed8919492f99f9725cd14c468d518e51e0b15844123992d6f46dde?placeholderIfAbsent=true&apiKey=6580918b057948818913b37d5b0a12ce"
              alt="Notes"
            />
          </article>
        </section>

        <section>
          <article className="ResourcesCard">
            <h3>Downloaded resources</h3>
            <p>Access your downloaded resources here.</p>
          </article>

          <article className="AppointmentCard">
            <h3>Book appointment</h3>
            <p>Schedule an appointment now with your therapist</p>
          </article>

          <article className="SupportCard">
            <h3>Support</h3>
          </article>
        </section>
      </main>
    </div>
  );
}

export default ClientPage;