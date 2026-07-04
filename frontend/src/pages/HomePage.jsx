import { useState } from 'react';
import { Link } from 'react-router-dom';
import { medicalCategories } from '../data/medicalCategories.js';

const HomePage = ({ user }) => {
  const [openCategory, setOpenCategory] = useState(null);
  const featured = medicalCategories.slice(0, 6);

  return (
    <main>
      <section className="home-hero">
        <div className="home-hero-content">
          <p className="eyebrow">Online Hospital Management</p>
          <h1>Trusted care, simple appointments, verified patient access.</h1>
          <p>Patients can register with OTP verification, choose a department, and book appointments. Doctors and admins can review, approve, reject, and complete requests.</p>
          <div className="hero-actions">
            <Link className="btn" to={user ? '/dashboard' : '/login'}>{user ? 'Open dashboard' : 'Login or signup'}</Link>
            <a className="btn ghost" href="#departments">View departments</a>
          </div>
        </div>
      </section>

      <section className="container home-band">
        <div className="section-heading">
          <p className="eyebrow">Hospital workflow</p>
          <h2>Built for patients, doctors, and admins</h2>
        </div>
        <div className="metric-grid">
          <div className="metric-card"><span className="badge">Patient</span><strong>OTP</strong><p>Patient accounts verify email before login and appointment booking.</p></div>
          <div className="metric-card"><span className="badge">Doctor</span><strong>Care</strong><p>Doctors see assigned requests and approve, reject, or complete appointments.</p></div>
          <div className="metric-card"><span className="badge">Admin</span><strong>Control</strong><p>Admin manages doctors, patients, categories, and appointment status.</p></div>
        </div>
      </section>

      <section className="container" id="departments">
        <div className="section-heading inline-heading">
          <div>
            <p className="eyebrow">Departments</p>
            <h2>Medical categories and doctor information</h2>
          </div>
          <span className="helper-text">Click a department to show details.</span>
        </div>

        <div className="category-grid">
          {medicalCategories.map((category) => {
            const isOpen = openCategory === category.name;
            return (
              <article className={`category-card ${isOpen ? 'expanded' : ''}`} key={category.name}>
                <button className="category-summary" onClick={() => setOpenCategory(isOpen ? null : category.name)}>
                  <span>
                    <strong>{category.name}</strong>
                    <small>{category.subtitle}</small>
                  </span>
                  <span className="expand-icon">{isOpen ? '-' : '+'}</span>
                </button>
                {isOpen && (
                  <div className="category-details">
                    <p>{category.summary}</p>
                    <div>
                      <h3>Illnesses</h3>
                      <div className="badge-row">{category.illnesses.map((item) => <span className="badge" key={item}>{item}</span>)}</div>
                    </div>
                    <div>
                      <h3>Symptoms</h3>
                      <p>{category.symptoms.join(', ')}</p>
                    </div>
                    <div className="doctor-strip">
                      <span className="doctor-avatar">{category.doctor.name.split(' ').slice(-1)[0][0]}</span>
                      <div>
                        <strong>{category.doctor.name}</strong>
                        <small>{category.doctor.title} - {category.doctor.experience} - {category.doctor.room}</small>
                      </div>
                    </div>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </section>

      <section className="container home-band">
        <div className="section-heading">
          <p className="eyebrow">Popular care areas</p>
          <h2>Quick department preview</h2>
        </div>
        <div className="card-grid">
          {featured.map((category) => (
            <div className="card" key={category.name}>
              <span className="badge">{category.subtitle}</span>
              <h3>{category.name}</h3>
              <p>{category.illnesses.slice(0, 3).join(', ')}</p>
              <small>{category.doctor.name} - {category.doctor.title}</small>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
};

export default HomePage;