import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import DoctorCard from '../components/DoctorCard';
import { Calendar, ShieldCheck, Clock, Users, ArrowRight, Search, HeartPulse, Award, Sparkles } from 'lucide-react';

const HomePage = () => {
  const [featuredDoctors, setFeaturedDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const data = await api.get('/doctors');
        setFeaturedDoctors(data.slice(0, 3));
      } catch (err) {
        console.error('Failed to load featured doctors:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/doctors?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div>
      {/* HERO SECTION */}
      <section className="hero-section">
        <div className="container hero-grid">
          <div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                backgroundColor: '#ccfbf1',
                color: '#0f766e',
                padding: '0.35rem 0.85rem',
                borderRadius: '30px',
                fontSize: '0.85rem',
                fontWeight: '700',
                marginBottom: '1.25rem'
              }}
            >
              <Sparkles size={16} /> Next-Gen Healthcare Platform
            </div>

            <h1 className="hero-title">
              Your Health, Our <span>Priority</span>
            </h1>

            <p className="hero-subtitle">
              Connect with top-rated medical specialists, schedule instant appointments, and manage your personal healthcare journey effortlessly.
            </p>

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
              <Link to="/doctors" className="btn btn-primary btn-lg">
                <Search size={18} /> Find a Doctor
              </Link>

              <Link to="/book" className="btn btn-secondary btn-lg">
                <Calendar size={18} /> Book Appointment
              </Link>
            </div>

            {/* QUICK SEARCH BAR */}
            <form onSubmit={handleSearchSubmit} style={{ maxWidth: '520px' }}>
              <div style={{ display: 'flex', gap: '0.5rem', background: 'white', padding: '0.4rem', borderRadius: '14px', border: '1px solid #cbd5e1', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                <input
                  type="text"
                  placeholder="Search doctor by name or specialization..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ border: 'none', outline: 'none', padding: '0.5rem 1rem', flex: 1, fontSize: '0.95rem' }}
                />
                <button type="submit" className="btn btn-primary" style={{ padding: '0.6rem 1.25rem' }}>
                  Search
                </button>
              </div>
            </form>

            <div className="hero-stats">
              <div className="stat-item">
                <h4>50+</h4>
                <p>Expert Doctors</p>
              </div>
              <div className="stat-item">
                <h4>15k+</h4>
                <p>Happy Patients</p>
              </div>
              <div className="stat-item">
                <h4>99.4%</h4>
                <p>Satisfaction</p>
              </div>
            </div>
          </div>

          <div className="hero-image-card">
            <div style={{ background: 'linear-gradient(135deg, #0f766e, #0284c7)', borderRadius: '20px', padding: '2.5rem 2rem', color: 'white', textShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>
              <div style={{ width: '54px', height: '54px', background: 'rgba(255,255,255,0.2)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                <HeartPulse size={30} />
              </div>
              <h3 style={{ fontSize: '1.6rem', fontWeight: '800', marginBottom: '0.75rem', lineHeight: '1.2' }}>
                Comprehensive Medical Care at Your Fingertips
              </h3>
              <p style={{ opacity: 0.9, fontSize: '0.95rem', marginBottom: '1.5rem' }}>
                Book consultations with certified cardiologists, dermatologists, pediatricians, and general medicine physicians in just a few clicks.
              </p>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <span style={{ background: 'rgba(255,255,255,0.25)', padding: '0.25rem 0.65rem', borderRadius: '15px', fontSize: '0.78rem', fontWeight: '600' }}>Cardiology</span>
                <span style={{ background: 'rgba(255,255,255,0.25)', padding: '0.25rem 0.65rem', borderRadius: '15px', fontSize: '0.78rem', fontWeight: '600' }}>Dermatology</span>
                <span style={{ background: 'rgba(255,255,255,0.25)', padding: '0.25rem 0.65rem', borderRadius: '15px', fontSize: '0.78rem', fontWeight: '600' }}>Pediatrics</span>
                <span style={{ background: 'rgba(255,255,255,0.25)', padding: '0.25rem 0.65rem', borderRadius: '15px', fontSize: '0.78rem', fontWeight: '600' }}>Orthopedics</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE CAREPULSE */}
      <section style={{ padding: '4rem 0', background: 'white', borderBottom: '1px solid #e2e8f0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '650px', margin: '0 auto 3rem' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: '800', color: '#0f172a', marginBottom: '0.75rem' }}>
              Why Patients Trust CarePulse
            </h2>
            <p style={{ color: '#64748b', fontSize: '1rem' }}>
              Modern healthcare design focused on convenience, reliability, and top-quality medical consultation.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '2rem' }}>
            <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
              <div style={{ width: '56px', height: '56px', background: '#ccfbf1', color: '#0d9488', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
                <Award size={28} />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '0.5rem' }}>Verified Specialists</h3>
              <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
                All listed doctors are board-certified experts with years of clinical clinical experience.
              </p>
            </div>

            <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
              <div style={{ width: '56px', height: '56px', background: '#e0f2fe', color: '#0284c7', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
                <Clock size={28} />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '0.5rem' }}>Zero Wait Booking</h3>
              <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
                Choose exact available date and time slots that fit your daily schedule seamlessly.
              </p>
            </div>

            <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
              <div style={{ width: '56px', height: '56px', background: '#f3e8ff', color: '#9333ea', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
                <ShieldCheck size={28} />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '0.5rem' }}>Secure Records</h3>
              <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
                Encrypted JWT authentication ensures your patient data and appointments remain strictly confidential.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED DOCTORS */}
      <section style={{ padding: '4rem 0' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem' }}>
            <div>
              <h2 style={{ fontSize: '2rem', fontWeight: '800', color: '#0f172a', marginBottom: '0.5rem' }}>
                Meet Our Top Doctors
              </h2>
              <p style={{ color: '#64748b', fontSize: '0.95rem' }}>
                Experienced medical specialists available for consultation.
              </p>
            </div>
            <Link to="/doctors" className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              View All Doctors <ArrowRight size={16} />
            </Link>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#0d9488', fontWeight: '600' }}>
              Loading top doctors...
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
              {featuredDoctors.map((doctor) => (
                <DoctorCard key={doctor._id} doctor={doctor} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
