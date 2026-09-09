import React, { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';
import Alert from './Alert';

const ALL_DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const DEFAULT_SLOTS = [
  '08:30 AM', '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM',
  '01:30 PM', '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM'
];

const DoctorModal = ({ doctor, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    specialization: 'General Medicine',
    experience: 5,
    availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    availableSlots: ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM'],
    bio: '',
    contact: '',
    consultationFee: 75
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (doctor) {
      setFormData({
        name: doctor.name || '',
        specialization: doctor.specialization || 'General Medicine',
        experience: doctor.experience !== undefined ? doctor.experience : 5,
        availableDays: doctor.availableDays || ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        availableSlots: doctor.availableSlots || ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM'],
        bio: doctor.bio || '',
        contact: doctor.contact || '',
        consultationFee: doctor.consultationFee !== undefined ? doctor.consultationFee : 75
      });
    } else {
      setFormData({
        name: '',
        specialization: 'General Medicine',
        experience: 5,
        availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        availableSlots: ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM'],
        bio: '',
        contact: '',
        consultationFee: 75
      });
    }
    setError('');
  }, [doctor, isOpen]);

  if (!isOpen) return null;

  const toggleDay = (day) => {
    setFormData((prev) => {
      const days = prev.availableDays.includes(day)
        ? prev.availableDays.filter((d) => d !== day)
        : [...prev.availableDays, day];
      return { ...prev, availableDays: days };
    });
  };

  const toggleSlot = (slot) => {
    setFormData((prev) => {
      const slots = prev.availableSlots.includes(slot)
        ? prev.availableSlots.filter((s) => s !== slot)
        : [...prev.availableSlots, slot];
      return { ...prev, availableSlots: slots };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.specialization.trim()) {
      setError('Doctor name and specialization are required.');
      return;
    }
    if (formData.availableDays.length === 0) {
      setError('Please select at least one available day.');
      return;
    }
    if (formData.availableSlots.length === 0) {
      setError('Please select at least one available time slot.');
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      await onSave(formData);
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to save doctor details');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2 className="modal-title">{doctor ? 'Edit Doctor Profile' : 'Add New Doctor'}</h2>
          <button onClick={onClose} className="close-btn">&times;</button>
        </div>

        <Alert type="error" message={error} onClose={() => setError('')} />

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Doctor Name *</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Dr. Alexander Hayes"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Specialization *</label>
              <select
                className="form-select"
                value={formData.specialization}
                onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
              >
                <option value="Cardiology">Cardiology</option>
                <option value="Dermatology">Dermatology</option>
                <option value="Pediatrics">Pediatrics</option>
                <option value="Orthopedics">Orthopedics</option>
                <option value="Neurology">Neurology</option>
                <option value="General Medicine">General Medicine</option>
                <option value="Ophthalmology">Ophthalmology</option>
                <option value="Psychiatry">Psychiatry</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Experience (Years) *</label>
              <input
                type="number"
                min="0"
                className="form-input"
                value={formData.experience}
                onChange={(e) => setFormData({ ...formData, experience: parseInt(e.target.value) || 0 })}
                required
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Contact Phone</label>
              <input
                type="text"
                className="form-input"
                placeholder="+1 (555) 000-0000"
                value={formData.contact}
                onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Consultation Fee ($)</label>
              <input
                type="number"
                min="0"
                className="form-input"
                value={formData.consultationFee}
                onChange={(e) => setFormData({ ...formData, consultationFee: parseInt(e.target.value) || 0 })}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Available Days *</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
              {ALL_DAYS.map((day) => {
                const selected = formData.availableDays.includes(day);
                return (
                  <button
                    key={day}
                    type="button"
                    onClick={() => toggleDay(day)}
                    style={{
                      padding: '0.35rem 0.75rem',
                      borderRadius: '20px',
                      fontSize: '0.8rem',
                      fontWeight: '600',
                      border: '1px solid',
                      borderColor: selected ? '#0d9488' : '#cbd5e1',
                      backgroundColor: selected ? '#0d9488' : '#f8fafc',
                      color: selected ? 'white' : '#475569',
                      cursor: 'pointer'
                    }}
                  >
                    {day} {selected && '✓'}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Available Slots *</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', maxHeight: '120px', overflowY: 'auto' }}>
              {DEFAULT_SLOTS.map((slot) => {
                const selected = formData.availableSlots.includes(slot);
                return (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => toggleSlot(slot)}
                    style={{
                      padding: '0.3rem 0.65rem',
                      borderRadius: '6px',
                      fontSize: '0.78rem',
                      fontWeight: '600',
                      border: '1px solid',
                      borderColor: selected ? '#0284c7' : '#e2e8f0',
                      backgroundColor: selected ? '#e0f2fe' : 'white',
                      color: selected ? '#0369a1' : '#334155',
                      cursor: 'pointer'
                    }}
                  >
                    {slot}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Doctor Bio</label>
            <textarea
              rows="3"
              className="form-textarea"
              placeholder="Short bio, qualifications, and patient care philosophy..."
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            ></textarea>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={submitting} className="btn btn-primary">
              {submitting ? 'Saving...' : doctor ? 'Update Doctor' : 'Create Doctor'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DoctorModal;
