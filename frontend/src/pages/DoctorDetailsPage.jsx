import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../services/api';
import { Award, Calendar, Clock, Phone, DollarSign, ArrowLeft, CheckCircle2, Stethoscope, ShieldCheck } from 'lucide-react';

const DoctorDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        setLoading(true);
        const data = await api.get(`/doctors/${id}`);
        setDoctor(data);
      } catch (err) {
        setError(err.message || 'Failed to load doctor profile.');
      } finally {
        setLoading(false);
      }
    };
    fetchDoctor();
  }, [id]);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '5rem', color: '#0d9488', fontWeight: '600' }}>
        Loading doctor profile...
      </div>
    );
  }

  if (error || !doctor) {
    return (
      <div className="container" style={{ padding: '3rem 1.5rem', textAlign: 'center' }}>
        <h2 style={{ color: '#0f172a', marginBottom: '1rem' }}>Doctor Profile Not Found</h2>
        <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>{error || "The requested doctor profile does not exist."}</p>
        <Link to="/doctors" className="btn btn-primary">
          <ArrowLeft size={16} /> Back to Doctors List
        </Link>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem' }}>
      <button onClick={() => navigate(-1)} className="btn btn-secondary btn-sm" style={{ marginBottom: '1.5rem' }}>
        <ArrowLeft size={16} /> Back
      </button>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
        <div>
          {/* PROFILE HEADER CARD */}
          <div className="card" style={{ padding: '2.5rem', marginBottom: '2rem' }}>
            <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
              <div
                style={{
                  width: '90px',
                  height: '90px',
                  borderRadius: '24px',
                  background: 'linear-gradient(135deg, #0d9488, #0284c7)',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '2.2rem',
                  fontWeight: '800',
                  boxShadow: '0 8px 20px rgba(13, 148, 136, 0.25)'
                }}
              >
                {doctor.name.replace('Dr. ', '').charAt(0)}
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.4rem', flexWrap: 'wrap' }}>
                  <h1 style={{ fontSize: '1.8rem', fontWeight: '800', color: '#0f172a' }}>{doctor.name}</h1>
                  <span
                    style={{
                      backgroundColor: '#e0f2fe',
                      color: '#0369a1',
                      padding: '0.25rem 0.75rem',
                      borderRadius: '20px',
                      fontSize: '0.82rem',
                      fontWeight: '700'
                    }}
                  >
                    {doctor.specialization}
                  </span>
                </div>

                <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', marginTop: '0.75rem', color: '#475569', fontSize: '0.9rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Award size={18} color="#0d9488" />
                    <span><strong>{doctor.experience} Years</strong> Clinical Experience</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <DollarSign size={18} color="#0d9488" />
                    <span><strong>${doctor.consultationFee || 75}</strong> per Consultation</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Phone size={18} color="#0d9488" />
                    <span>{doctor.contact || '+1 (555) 234-5678'}</span>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid #f1f5f9' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: '700', color: '#0f172a', marginBottom: '0.75rem' }}>
                Biography & Clinical Expertise
              </h3>
              <p style={{ color: '#475569', lineHeight: '1.7', fontSize: '0.98rem' }}>
                {doctor.bio || 'Dedicated healthcare specialist providing personalized clinical treatment and expert medical advice.'}
              </p>
            </div>
          </div>

          {/* SCHEDULE CARD */}
          <div className="card" style={{ padding: '2rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#0f172a', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Calendar size={20} color="#0d9488" /> Consultation Hours & Slots
            </h3>

            <div style={{ marginBottom: '1.5rem' }}>
              <h4 style={{ fontSize: '0.88rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', marginBottom: '0.6rem' }}>
                Available Days
              </h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {doctor.availableDays && doctor.availableDays.map((day, idx) => (
                  <span
                    key={idx}
                    style={{
                      padding: '0.4rem 0.85rem',
                      backgroundColor: '#f0fdfa',
                      color: '#0f766e',
                      border: '1px solid #ccfbf1',
                      borderRadius: '8px',
                      fontSize: '0.88rem',
                      fontWeight: '600'
                    }}
                  >
                    ✓ {day}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h4 style={{ fontSize: '0.88rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', marginBottom: '0.6rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Clock size={16} /> Daily Time Slots
              </h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {doctor.availableSlots && doctor.availableSlots.map((slot, idx) => (
                  <span
                    key={idx}
                    style={{
                      padding: '0.4rem 0.85rem',
                      backgroundColor: '#f8fafc',
                      color: '#334155',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      fontSize: '0.85rem',
                      fontWeight: '600'
                    }}
                  >
                    {slot}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* BOOKING ACTION SIDEBAR CARD */}
        <div>
          <div className="card" style={{ padding: '2rem', position: 'sticky', top: '90px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0f172a', marginBottom: '0.5rem' }}>
              Book an Appointment
            </h3>
            <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              Reserve your slot directly with {doctor.name}
            </p>

            <div style={{ background: '#f8fafc', borderRadius: '12px', padding: '1rem', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ color: '#64748b' }}>Consultation Fee:</span>
                <span style={{ fontWeight: '700', color: '#0f172a' }}>${doctor.consultationFee || 75}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ color: '#64748b' }}>Speciality:</span>
                <span style={{ fontWeight: '600', color: '#0d9488' }}>{doctor.specialization}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>Confirmation:</span>
                <span style={{ fontWeight: '600', color: '#047857' }}>Instant</span>
              </div>
            </div>

            <button
              onClick={() => navigate(`/book/${doctor._id}`)}
              className="btn btn-primary btn-lg"
              style={{ width: '100%', marginBottom: '1rem' }}
            >
              Proceed to Booking
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: '#64748b', justifyContent: 'center' }}>
              <ShieldCheck size={16} color="#0d9488" /> 100% Guaranteed Confidential Consultation
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDetailsPage;
