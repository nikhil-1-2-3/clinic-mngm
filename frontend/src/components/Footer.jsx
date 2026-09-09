import React from 'react';
import { Link } from 'react-router-dom';
import { Stethoscope, Heart, Clock, MapPin, Phone } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <div className="footer-brand" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Stethoscope size={24} color="#14b8a6" />
              <span>CarePulse Clinic</span>
            </div>
            <p style={{ fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: '300px' }}>
              Providing world-class medical expertise, easy online appointment scheduling, and compassionate patient care.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.85rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <MapPin size={16} color="#14b8a6" /> 124 Medical Plaza, Healthcare City
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Phone size={16} color="#14b8a6" /> +1 (800) 555-CARE (2273)
              </div>
            </div>
          </div>

          <div>
            <h4 className="footer-title">Quick Links</h4>
            <ul className="footer-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/doctors">Find Doctors</Link></li>
              <li><Link to="/book">Book Appointment</Link></li>
              <li><Link to="/login">Patient Portal</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="footer-title">Specialities</h4>
            <ul className="footer-links">
              <li><Link to="/doctors?specialization=Cardiology">Cardiology</Link></li>
              <li><Link to="/doctors?specialization=Dermatology">Dermatology</Link></li>
              <li><Link to="/doctors?specialization=Pediatrics">Pediatrics</Link></li>
              <li><Link to="/doctors?specialization=Orthopedics">Orthopedics</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="footer-title">Clinic Hours</h4>
            <div style={{ fontSize: '0.85rem', lineHeight: '1.8' }}>
              <p><strong>Mon - Fri:</strong> 8:00 AM - 8:00 PM</p>
              <p><strong>Saturday:</strong> 9:00 AM - 5:00 PM</p>
              <p><strong>Sunday:</strong> Emergency Only</p>
              <p style={{ marginTop: '0.75rem', color: '#14b8a6', fontWeight: '600' }}>
                24/7 Virtual Desk
              </p>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} CarePulse Healthcare. All rights reserved. Built for modern clinical care.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
