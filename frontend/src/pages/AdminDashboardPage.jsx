import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import DoctorCard from '../components/DoctorCard';
import DoctorModal from '../components/DoctorModal';
import Alert from '../components/Alert';
import { Users, Calendar, Plus, RefreshCw, Trash2, Edit, CheckCircle, Clock, ShieldCheck, Search } from 'lucide-react';

const AdminDashboardPage = () => {
  const [activeTab, setActiveTab] = useState('appointments'); // 'appointments' | 'doctors'
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDoctorForEdit, setSelectedDoctorForEdit] = useState(null);

  // Search/Filter state inside Admin dashboard
  const [aptSearch, setAptSearch] = useState('');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError('');
      const [docsData, aptsData] = await Promise.all([
        api.get('/doctors'),
        api.get('/appointments')
      ]);
      setDoctors(docsData);
      setAppointments(aptsData);
    } catch (err) {
      setError(err.message || 'Failed to load admin dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateDoctorClick = () => {
    setSelectedDoctorForEdit(null);
    setIsModalOpen(true);
  };

  const handleEditDoctorClick = (doctor) => {
    setSelectedDoctorForEdit(doctor);
    setIsModalOpen(true);
  };

  const handleDeleteDoctor = async (doctorId) => {
    if (!window.confirm('Are you sure you want to delete this doctor? Associated appointments will also be removed.')) return;
    try {
      setError('');
      await api.delete(`/doctors/${doctorId}`);
      setSuccess('Doctor removed successfully.');
      loadDashboardData();
    } catch (err) {
      setError(err.message || 'Failed to delete doctor.');
    }
  };

  const handleSaveDoctor = async (formData) => {
    if (selectedDoctorForEdit) {
      await api.put(`/doctors/${selectedDoctorForEdit._id}`, formData);
      setSuccess('Doctor profile updated successfully.');
    } else {
      await api.post('/doctors', formData);
      setSuccess('New doctor added successfully.');
    }
    loadDashboardData();
  };

  const handleStatusChange = async (appointmentId, newStatus) => {
    try {
      setError('');
      await api.put(`/appointments/${appointmentId}`, { status: newStatus });
      setSuccess(`Appointment status updated to ${newStatus}.`);
      loadDashboardData();
    } catch (err) {
      setError(err.message || 'Failed to update appointment status.');
    }
  };

  const handleDeleteAppointment = async (appointmentId) => {
    if (!window.confirm('Are you sure you want to cancel/delete this appointment?')) return;
    try {
      setError('');
      await api.delete(`/appointments/${appointmentId}`);
      setSuccess('Appointment cancelled.');
      loadDashboardData();
    } catch (err) {
      setError(err.message || 'Failed to cancel appointment.');
    }
  };

  const filteredAppointments = appointments.filter((apt) => {
    if (!aptSearch.trim()) return true;
    const query = aptSearch.toLowerCase();
    const patientName = apt.userId?.name?.toLowerCase() || '';
    const doctorName = apt.doctorId?.name?.toLowerCase() || '';
    const status = apt.status?.toLowerCase() || '';
    return patientName.includes(query) || doctorName.includes(query) || status.includes(query);
  });

  // Calculate statistics
  const totalDoctors = doctors.length;
  const totalAppointments = appointments.length;
  const pendingAppointments = appointments.filter((a) => a.status === 'Pending').length;
  const confirmedAppointments = appointments.filter((a) => a.status === 'Confirmed').length;

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: '800', color: '#0f172a' }}>Admin Portal</h1>
            <span className="admin-badge">System Administrator</span>
          </div>
          <p style={{ color: '#64748b', fontSize: '0.95rem' }}>
            Manage doctors list, oversee patient appointments, and update status
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button onClick={loadDashboardData} className="btn btn-secondary btn-sm" title="Refresh dashboard data">
            <RefreshCw size={16} /> Refresh
          </button>
          <button onClick={handleCreateDoctorClick} className="btn btn-primary btn-sm">
            <Plus size={16} /> Add New Doctor
          </button>
        </div>
      </div>

      <Alert type="error" message={error} onClose={() => setError('')} />
      <Alert type="success" message={success} onClose={() => setSuccess('')} />

      {/* STATS OVERVIEW */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ color: '#64748b', fontSize: '0.82rem', fontWeight: '700', textTransform: 'uppercase', marginBottom: '0.3rem' }}>
            Total Doctors
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#0f172a' }}>{totalDoctors}</div>
        </div>

        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ color: '#64748b', fontSize: '0.82rem', fontWeight: '700', textTransform: 'uppercase', marginBottom: '0.3rem' }}>
            Total Appointments
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#0d9488' }}>{totalAppointments}</div>
        </div>

        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ color: '#64748b', fontSize: '0.82rem', fontWeight: '700', textTransform: 'uppercase', marginBottom: '0.3rem' }}>
            Confirmed Bookings
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#047857' }}>{confirmedAppointments}</div>
        </div>

        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ color: '#64748b', fontSize: '0.82rem', fontWeight: '700', textTransform: 'uppercase', marginBottom: '0.3rem' }}>
            Pending Review
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#b45309' }}>{pendingAppointments}</div>
        </div>
      </div>

      {/* TAB NAVIGATION */}
      <div style={{ display: 'flex', gap: '1rem', borderBottom: '2px solid #e2e8f0', marginBottom: '2rem' }}>
        <button
          onClick={() => setActiveTab('appointments')}
          style={{
            padding: '0.75rem 1.25rem',
            fontWeight: '700',
            fontSize: '0.95rem',
            border: 'none',
            background: 'none',
            cursor: 'pointer',
            color: activeTab === 'appointments' ? '#0d9488' : '#64748b',
            borderBottom: activeTab === 'appointments' ? '3px solid #0d9488' : 'none',
            marginBottom: '-2px'
          }}
        >
          <Calendar size={16} style={{ display: 'inline', marginRight: '6px' }} />
          Appointments ({appointments.length})
        </button>

        <button
          onClick={() => setActiveTab('doctors')}
          style={{
            padding: '0.75rem 1.25rem',
            fontWeight: '700',
            fontSize: '0.95rem',
            border: 'none',
            background: 'none',
            cursor: 'pointer',
            color: activeTab === 'doctors' ? '#0d9488' : '#64748b',
            borderBottom: activeTab === 'doctors' ? '3px solid #0d9488' : 'none',
            marginBottom: '-2px'
          }}
        >
          <Users size={16} style={{ display: 'inline', marginRight: '6px' }} />
          Doctors Roster ({doctors.length})
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: '#0d9488', fontWeight: '600' }}>
          Loading dashboard content...
        </div>
      ) : activeTab === 'appointments' ? (
        <div>
          {/* APPOINTMENTS TAB */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ position: 'relative', width: '320px' }}>
              <Search size={18} color="#94a3b8" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                className="form-input"
                style={{ paddingLeft: '2.75rem', fontSize: '0.88rem' }}
                placeholder="Search patient, doctor, status..."
                value={aptSearch}
                onChange={(e) => setAptSearch(e.target.value)}
              />
            </div>
            <div style={{ fontSize: '0.85rem', color: '#64748b' }}>
              Showing {filteredAppointments.length} of {appointments.length} appointments
            </div>
          </div>

          <div className="card" style={{ padding: '0', overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#475569', fontWeight: '700' }}>
                  <th style={{ padding: '1rem 1.25rem' }}>Patient</th>
                  <th style={{ padding: '1rem 1.25rem' }}>Doctor</th>
                  <th style={{ padding: '1rem 1.25rem' }}>Date & Slot</th>
                  <th style={{ padding: '1rem 1.25rem' }}>Status</th>
                  <th style={{ padding: '1rem 1.25rem' }}>Manage Status</th>
                  <th style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAppointments.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
                      No appointments matching filter.
                    </td>
                  </tr>
                ) : (
                  filteredAppointments.map((apt) => {
                    const patient = apt.userId || { name: 'Patient Deleted', email: 'N/A' };
                    const doctor = apt.doctorId || { name: 'Doctor Removed', specialization: 'N/A' };

                    return (
                      <tr key={apt._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '1rem 1.25rem' }}>
                          <div style={{ fontWeight: '700', color: '#0f172a' }}>{patient.name}</div>
                          <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{patient.email}</div>
                        </td>

                        <td style={{ padding: '1rem 1.25rem' }}>
                          <div style={{ fontWeight: '600', color: '#0f172a' }}>{doctor.name}</div>
                          <div style={{ fontSize: '0.78rem', color: '#0d9488' }}>{doctor.specialization}</div>
                        </td>

                        <td style={{ padding: '1rem 1.25rem' }}>
                          <div style={{ fontWeight: '600' }}>{apt.appointmentDate}</div>
                          <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{apt.appointmentTime}</div>
                        </td>

                        <td style={{ padding: '1rem 1.25rem' }}>
                          <span className={`status-badge status-${apt.status ? apt.status.toLowerCase() : 'pending'}`}>
                            {apt.status}
                          </span>
                        </td>

                        <td style={{ padding: '1rem 1.25rem' }}>
                          <select
                            className="form-select"
                            style={{ padding: '0.3rem 0.6rem', fontSize: '0.82rem', width: 'auto' }}
                            value={apt.status}
                            onChange={(e) => handleStatusChange(apt._id, e.target.value)}
                          >
                            <option value="Confirmed">Confirmed</option>
                            <option value="Pending">Pending</option>
                            <option value="Completed">Completed</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>

                        <td style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>
                          <button
                            onClick={() => handleDeleteAppointment(apt._id)}
                            className="btn btn-secondary btn-sm"
                            style={{ color: '#b91c1c', borderColor: '#fecaca', padding: '0.3rem 0.6rem' }}
                            title="Cancel/delete appointment"
                          >
                            <Trash2 size={14} /> Cancel
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* DOCTORS TAB */
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#0f172a' }}>
              Doctors Directory ({doctors.length})
            </h3>
            <button onClick={handleCreateDoctorClick} className="btn btn-primary btn-sm">
              <Plus size={16} /> Add Doctor
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
            {doctors.map((doc) => (
              <DoctorCard
                key={doc._id}
                doctor={doc}
                isAdmin={true}
                onEdit={handleEditDoctorClick}
                onDelete={handleDeleteDoctor}
              />
            ))}
          </div>
        </div>
      )}

      {/* DOCTOR CREATE/EDIT MODAL */}
      <DoctorModal
        doctor={selectedDoctorForEdit}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveDoctor}
      />
    </div>
  );
};

export default AdminDashboardPage;
