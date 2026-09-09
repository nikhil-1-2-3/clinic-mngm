import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Alert from '../components/Alert';
import { Calendar, Clock, User, Stethoscope, CheckCircle2, FileText, ArrowLeft, DollarSign } from 'lucide-react';

const BookingPage = () => {
  const { doctorId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [doctors, setDoctors] = useState([]);
  const [selectedDoctorId, setSelectedDoctorId] = useState(doctorId || '');
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  // Tomorrow as default date string
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const defaultDateStr = tomorrow.toISOString().split('T')[0];

  const [appointmentDate, setAppointmentDate] = useState(defaultDateStr);
  const [appointmentTime, setAppointmentTime] = useState('');
  const [notes, setNotes] = useState('');

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState(null);

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const data = await api.get('/doctors');
      setDoctors(data);

      if (doctorId) {
        const matched = data.find((d) => d._id === doctorId);
        if (matched) {
          setSelectedDoctor(matched);
          if (matched.availableSlots && matched.availableSlots.length > 0) {
            setAppointmentTime(matched.availableSlots[0]);
          }
        }
      } else if (data.length > 0) {
        setSelectedDoctorId(data[0]._id);
        setSelectedDoctor(data[0]);
        if (data[0].availableSlots && data[0].availableSlots.length > 0) {
          setAppointmentTime(data[0].availableSlots[0]);
        }
      }
    } catch (err) {
      setError('Failed to load doctors for booking.');
    } finally {
      setLoading(false);
    }
  };

  const handleDoctorChange = (id) => {
    setSelectedDoctorId(id);
    const matched = doctors.find((d) => d._id === id);
    setSelectedDoctor(matched || null);
    if (matched && matched.availableSlots && matched.availableSlots.length > 0) {
      setAppointmentTime(matched.availableSlots[0]);
    } else {
      setAppointmentTime('');
    }
  };

  const getDayName = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString + 'T00:00:00');
    return date.toLocaleDateString('en-US', { weekday: 'long' });
  };

  const currentDayName = getDayName(appointmentDate);
  const isDoctorAvailableOnDay = selectedDoctor && selectedDoctor.availableDays
    ? selectedDoctor.availableDays.includes(currentDayName)
    : true;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!selectedDoctorId) {
      setError('Please select a doctor.');
      return;
    }
    if (!appointmentDate) {
      setError('Please select an appointment date.');
      return;
    }
    if (!appointmentTime) {
      setError('Please select an available time slot.');
      return;
    }
    if (!isDoctorAvailableOnDay) {
      setError(`Dr. ${selectedDoctor.name} is not available on ${currentDayName}s. Please choose an available day (${selectedDoctor.availableDays.join(', ')}).`);
      return;
    }

    try {
      setSubmitting(true);
      const newBooking = await api.post('/appointments', {
        doctorId: selectedDoctorId,
        appointmentDate,
        appointmentTime,
        notes
      });
      setBookingSuccess(newBooking);
    } catch (err) {
      setError(err.message || 'Failed to complete appointment booking.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '5rem', color: '#0d9488', fontWeight: '600' }}>
        Preparing appointment scheduler...
      </div>
    );
  }

  if (bookingSuccess) {
    return (
      <div className="container" style={{ padding: '3.5rem 1.5rem', display: 'flex', justifyContent: 'center' }}>
        <div className="card" style={{ maxWidth: '580px', width: '100%', textAlign: 'center', padding: '3rem 2rem' }}>
          <div
            style={{
              width: '64px',
              height: '64px',
              background: '#ecfdf5',
              color: '#047857',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem'
            }}
          >
            <CheckCircle2 size={38} />
          </div>

          <h2 style={{ fontSize: '1.8rem', fontWeight: '800', color: '#0f172a', marginBottom: '0.5rem' }}>
            Appointment Confirmed!
          </h2>
          <p style={{ color: '#64748b', fontSize: '1rem', marginBottom: '2rem' }}>
            Your consultation slot has been successfully booked with CarePulse Clinic.
          </p>

          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '1.25rem', textAlign: 'left', marginBottom: '2rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.9rem' }}>
              <div>
                <span style={{ color: '#64748b', display: 'block', fontSize: '0.8rem' }}>Doctor</span>
                <strong style={{ color: '#0f172a' }}>{selectedDoctor?.name}</strong>
              </div>
              <div>
                <span style={{ color: '#64748b', display: 'block', fontSize: '0.8rem' }}>Specialization</span>
                <strong style={{ color: '#0d9488' }}>{selectedDoctor?.specialization}</strong>
              </div>
              <div>
                <span style={{ color: '#64748b', display: 'block', fontSize: '0.8rem' }}>Date & Day</span>
                <strong style={{ color: '#0f172a' }}>{bookingSuccess.appointmentDate} ({getDayName(bookingSuccess.appointmentDate)})</strong>
              </div>
              <div>
                <span style={{ color: '#64748b', display: 'block', fontSize: '0.8rem' }}>Time Slot</span>
                <strong style={{ color: '#0f172a' }}>{bookingSuccess.appointmentTime}</strong>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <Link to="/my-appointments" className="btn btn-primary">
              View My Appointments
            </Link>
            <Link to="/doctors" className="btn btn-secondary">
              Book Another
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem', maxWidth: '850px' }}>
      <button onClick={() => navigate(-1)} className="btn btn-secondary btn-sm" style={{ marginBottom: '1.5rem' }}>
        <ArrowLeft size={16} /> Back
      </button>

      <div className="card" style={{ padding: '2.5rem' }}>
        <div style={{ marginBottom: '2rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '1.25rem' }}>
          <h1 style={{ fontSize: '1.8rem', fontWeight: '800', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Calendar size={26} color="#0d9488" /> Schedule Consultation
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.95rem', marginTop: '0.3rem' }}>
            Fill in the details below to book an appointment with your chosen specialist.
          </p>
        </div>

        <Alert type="error" message={error} onClose={() => setError('')} />

        <form onSubmit={handleSubmit}>
          {/* STEP 1: SELECT DOCTOR */}
          <div className="form-group">
            <label className="form-label">1. Select Doctor *</label>
            <div style={{ position: 'relative' }}>
              <Stethoscope size={18} color="#94a3b8" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', zIndex: 1 }} />
              <select
                className="form-select"
                style={{ paddingLeft: '2.75rem' }}
                value={selectedDoctorId}
                onChange={(e) => handleDoctorChange(e.target.value)}
                required
              >
                <option value="" disabled>-- Choose a Doctor --</option>
                {doctors.map((doc) => (
                  <option key={doc._id} value={doc._id}>
                    {doc.name} — {doc.specialization} ({doc.experience} yrs exp)
                  </option>
                ))}
              </select>
            </div>
          </div>

          {selectedDoctor && (
            <div style={{ background: '#f0fdfa', border: '1px solid #ccfbf1', borderRadius: '12px', padding: '1rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h4 style={{ fontSize: '1rem', fontWeight: '700', color: '#0f766e' }}>{selectedDoctor.name}</h4>
                <p style={{ fontSize: '0.85rem', color: '#134e4a' }}>Specialist in {selectedDoctor.specialization}</p>
                <div style={{ fontSize: '0.8rem', color: '#0f766e', marginTop: '0.25rem' }}>
                  Available: <strong>{selectedDoctor.availableDays ? selectedDoctor.availableDays.join(', ') : 'All Week'}</strong>
                </div>
              </div>
              <div style={{ fontSize: '1.1rem', fontWeight: '800', color: '#0f766e' }}>
                ${selectedDoctor.consultationFee || 75}
              </div>
            </div>
          )}

          {/* STEP 2: SELECT DATE */}
          <div className="form-group">
            <label className="form-label">2. Appointment Date *</label>
            <input
              type="date"
              className="form-input"
              min={new Date().toISOString().split('T')[0]}
              value={appointmentDate}
              onChange={(e) => setAppointmentDate(e.target.value)}
              required
            />
            {appointmentDate && (
              <div style={{ fontSize: '0.82rem', marginTop: '0.4rem', color: isDoctorAvailableOnDay ? '#047857' : '#b91c1c', fontWeight: '600' }}>
                Selected Day: {currentDayName} {isDoctorAvailableOnDay ? '✓ Doctor Available' : '⚠️ Doctor Not Scheduled on this day'}
              </div>
            )}
          </div>

          {/* STEP 3: SELECT TIME SLOT */}
          <div className="form-group">
            <label className="form-label">3. Select Time Slot *</label>
            {selectedDoctor && selectedDoctor.availableSlots && selectedDoctor.availableSlots.length > 0 ? (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {selectedDoctor.availableSlots.map((slot) => {
                  const selected = appointmentTime === slot;
                  return (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setAppointmentTime(slot)}
                      style={{
                        padding: '0.5rem 1rem',
                        borderRadius: '10px',
                        fontSize: '0.88rem',
                        fontWeight: '600',
                        border: '1px solid',
                        borderColor: selected ? '#0d9488' : '#e2e8f0',
                        backgroundColor: selected ? '#0d9488' : 'white',
                        color: selected ? 'white' : '#334155',
                        cursor: 'pointer',
                        transition: 'all 0.15s'
                      }}
                    >
                      <Clock size={14} style={{ display: 'inline', marginRight: '4px' }} />
                      {slot}
                    </button>
                  );
                })}
              </div>
            ) : (
              <input
                type="text"
                className="form-input"
                placeholder="e.g. 10:00 AM"
                value={appointmentTime}
                onChange={(e) => setAppointmentTime(e.target.value)}
                required
              />
            )}
          </div>

          {/* STEP 4: NOTES */}
          <div className="form-group">
            <label className="form-label">4. Reason for Visit / Medical Notes (Optional)</label>
            <textarea
              rows="3"
              className="form-textarea"
              placeholder="Describe your symptoms, health concerns, or any previous condition..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={submitting || !isDoctorAvailableOnDay}
            className="btn btn-primary btn-lg"
            style={{ width: '100%', marginTop: '1rem' }}
          >
            {submitting ? 'Confirming Booking...' : 'Confirm Appointment'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default BookingPage;
