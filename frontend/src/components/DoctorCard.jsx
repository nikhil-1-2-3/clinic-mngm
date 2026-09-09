import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Award, Calendar, Clock, Phone, DollarSign, Edit, Trash2 } from 'lucide-react';

const DoctorCard = ({ doctor, isAdmin = false, onEdit, onDelete }) => {
  const navigate = useNavigate();

  return (
    <div className="card card-hover" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', marginBottom: '1rem' }}>
        <div
          style={{
            width: '56px',
            height: '56px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #0d9488, #0284c7)',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.4rem',
            fontWeight: '700',
            flexShrink: 0
          }}
        >
          {doctor.name.replace('Dr. ', '').charAt(0)}
        </div>
        <div style={{ flex: 1 }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: '700', marginBottom: '0.2rem' }}>{doctor.name}</h3>
          <span
            style={{
              display: 'inline-block',
              padding: '0.2rem 0.6rem',
              backgroundColor: '#e0f2fe',
              color: '#0369a1',
              borderRadius: '20px',
              fontSize: '0.78rem',
              fontWeight: '700'
            }}
          >
            {doctor.specialization}
          </span>
        </div>
      </div>

      <p style={{ fontSize: '0.88rem', color: '#475569', marginBottom: '1.25rem', flex: 1, lineHeight: '1.5' }}>
        {doctor.bio ? doctor.bio : 'Dedicated healthcare specialist providing personalized clinical treatment and expert care.'}
      </p>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.8rem', marginBottom: '1.25rem', fontSize: '0.82rem', color: '#64748b' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <Award size={15} color="#0d9488" />
          <span><strong>{doctor.experience} yrs</strong> experience</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <DollarSign size={15} color="#0d9488" />
          <span><strong>${doctor.consultationFee || 75}</strong> fee</span>
        </div>
      </div>

      <div style={{ marginBottom: '1.25rem' }}>
        <div style={{ fontSize: '0.78rem', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <Calendar size={13} /> Available Days
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
          {doctor.availableDays && doctor.availableDays.map((day, idx) => (
            <span
              key={idx}
              style={{
                fontSize: '0.75rem',
                backgroundColor: '#f1f5f9',
                color: '#334155',
                padding: '0.15rem 0.5rem',
                borderRadius: '6px',
                fontWeight: '500'
              }}
            >
              {day.slice(0, 3)}
            </span>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto', paddingTop: '0.75rem', borderTop: '1px solid #f1f5f9' }}>
        {isAdmin ? (
          <>
            <button
              onClick={() => onEdit(doctor)}
              className="btn btn-secondary btn-sm"
              style={{ flex: 1 }}
            >
              <Edit size={14} /> Edit
            </button>
            <button
              onClick={() => onDelete(doctor._id)}
              className="btn btn-danger btn-sm"
              style={{ padding: '0.4rem 0.75rem' }}
              title="Delete doctor"
            >
              <Trash2 size={14} />
            </button>
          </>
        ) : (
          <>
            <Link
              to={`/doctors/${doctor._id}`}
              className="btn btn-secondary btn-sm"
              style={{ flex: 1 }}
            >
              View Profile
            </Link>
            <button
              onClick={() => navigate(`/book/${doctor._id}`)}
              className="btn btn-primary btn-sm"
              style={{ flex: 1 }}
            >
              Book Now
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default DoctorCard;
