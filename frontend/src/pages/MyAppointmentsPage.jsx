import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import Alert from '../components/Alert';
import { Calendar, Clock, Stethoscope, Phone, AlertTriangle, CheckCircle2, XCircle, Plus } from 'lucide-react';

const MyAppointmentsPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const [cancellingId, setCancellingId] = useState(null);

  useEffect(() => {
    fetchMyBookings();
  }, []);

  const fetchMyBookings = async () => {
    try {
      setLoading(true);
      const data = await api.get('/appointments/my-bookings');
      setAppointments(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch your appointments.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelClick = async (appointmentId) => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) return;

    try {
      setCancellingId(appointmentId);
      setError('');
      await api.delete(`/appointments/${appointmentId}`);
      setSuccess('Appointment cancelled successfully.');
      fetchMyBookings();
    } catch (err) {
      setError(err.message || 'Failed to cancel appointment.');
    } finally {
      setCancellingId(null);
    }
  };

  const filteredAppointments = appointments.filter((apt) => {
    if (statusFilter === 'All') return true;
    return apt.status === statusFilter;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Confirmed':
        return <span className="status-badge status-confirmed">✓ Confirmed</span>;
      case 'Pending':
        return <span className="status-badge status-pending">⏳ Pending</span>;
      case 'Completed':
        return <span className="status-badge status-completed">★ Completed</span>;
      case 'Cancelled':
        return <span className="status-badge status-cancelled">✕ Cancelled</span>;
      default:
        return <span className="status-badge status-pending">{status}</span>;
    }
  };

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: '800', color: '#0f172a' }}>My Personal Appointments</h1>
          <p style={{ color: '#64748b', fontSize: '0.95rem' }}>
            Manage and view your scheduled doctor consultations
          </p>
        </div>
        <Link to="/book" className="btn btn-primary">
          <Plus size={18} /> Book New Appointment
        </Link>
      </div>

      <Alert type="error" message={error} onClose={() => setError('')} />
      <Alert type="success" message={success} onClose={() => setSuccess('')} />

      {/* FILTER PILLS */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        {['All', 'Confirmed', 'Pending', 'Completed', 'Cancelled'].map((status) => {
          const selected = statusFilter === status;
          return (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              style={{
                padding: '0.4rem 1rem',
                borderRadius: '30px',
                fontSize: '0.85rem',
                fontWeight: '600',
                border: '1px solid',
                borderColor: selected ? '#0d9488' : '#e2e8f0',
                backgroundColor: selected ? '#0d9488' : 'white',
                color: selected ? 'white' : '#475569',
                cursor: 'pointer'
              }}
            >
              {status}
            </button>
          );
        })}
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: '#0d9488', fontWeight: '600' }}>
          Loading your bookings...
        </div>
      ) : filteredAppointments.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3.5rem 2rem' }}>
          <div style={{ width: '60px', height: '60px', background: '#f1f5f9', color: '#94a3b8', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
            <Calendar size={30} />
          </div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#0f172a', marginBottom: '0.5rem' }}>
            No Appointments Found
          </h3>
          <p style={{ color: '#64748b', fontSize: '0.95rem', maxWidth: '400px', margin: '0 auto 1.5rem' }}>
            {statusFilter === 'All'
              ? "You haven't booked any doctor appointments yet."
              : `You have no appointments with status "${statusFilter}".`}
          </p>
          <Link to="/book" className="btn btn-primary">
            Schedule Appointment
          </Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.5rem' }}>
          {filteredAppointments.map((apt) => {
            const doctor = apt.doctorId || { name: 'Unknown Doctor', specialization: 'Specialist' };
            const isCancelled = apt.status === 'Cancelled';
            const isCompleted = apt.status === 'Completed';

            return (
              <div key={apt._id} className="card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div
                      style={{
                        width: '46px',
                        height: '46px',
                        borderRadius: '12px',
                        background: 'linear-gradient(135deg, #0d9488, #0284c7)',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: '700',
                        fontSize: '1.1rem'
                      }}
                    >
                      {doctor.name ? doctor.name.replace('Dr. ', '').charAt(0) : 'D'}
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: '#0f172a' }}>{doctor.name}</h3>
                      <span style={{ fontSize: '0.8rem', color: '#0d9488', fontWeight: '600' }}>
                        {doctor.specialization}
                      </span>
                    </div>
                  </div>
                  {getStatusBadge(apt.status)}
                </div>

                <div style={{ background: '#f8fafc', borderRadius: '10px', padding: '0.85rem', marginBottom: '1rem', fontSize: '0.88rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem', color: '#334155' }}>
                    <Calendar size={16} color="#0d9488" />
                    <span><strong>Date:</strong> {apt.appointmentDate}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#334155' }}>
                    <Clock size={16} color="#0d9488" />
                    <span><strong>Time Slot:</strong> {apt.appointmentTime}</span>
                  </div>
                </div>

                {apt.notes && (
                  <div style={{ fontSize: '0.85rem', color: '#475569', marginBottom: '1rem', fontStyle: 'italic', background: '#fffbeb', padding: '0.6rem 0.8rem', borderRadius: '8px' }}>
                    "<strong>Notes:</strong> {apt.notes}"
                  </div>
                )}

                <div style={{ marginTop: 'auto', paddingTop: '0.75rem', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                    Booked on {new Date(apt.createdAt).toLocaleDateString()}
                  </div>

                  {!isCancelled && !isCompleted && (
                    <button
                      onClick={() => handleCancelClick(apt._id)}
                      disabled={cancellingId === apt._id}
                      className="btn btn-secondary btn-sm"
                      style={{ color: '#b91c1c', borderColor: '#fecaca' }}
                    >
                      {cancellingId === apt._id ? 'Cancelling...' : 'Cancel Booking'}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyAppointmentsPage;
