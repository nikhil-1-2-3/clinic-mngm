import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../services/api';
import DoctorCard from '../components/DoctorCard';
import { Search, Filter, Stethoscope, RefreshCw } from 'lucide-react';

const SPECIALIZATIONS = [
  'All',
  'Cardiology',
  'Dermatology',
  'Pediatrics',
  'Orthopedics',
  'Neurology',
  'General Medicine'
];

const DoctorsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  const currentSpecialization = searchParams.get('specialization') || 'All';
  const searchQuery = searchParams.get('search') || '';

  const [searchInput, setSearchInput] = useState(searchQuery);

  useEffect(() => {
    fetchDoctors();
  }, [searchParams]);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      let queryPath = '/doctors';
      const params = new URLSearchParams();
      if (currentSpecialization && currentSpecialization !== 'All') {
        params.append('specialization', currentSpecialization);
      }
      if (searchQuery) {
        params.append('search', searchQuery);
      }
      if (params.toString()) {
        queryPath += `?${params.toString()}`;
      }

      const data = await api.get(queryPath);
      setDoctors(data);
    } catch (err) {
      console.error('Error fetching doctors:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSpecializationChange = (spec) => {
    const newParams = new URLSearchParams(searchParams);
    if (spec === 'All') {
      newParams.delete('specialization');
    } else {
      newParams.set('specialization', spec);
    }
    setSearchParams(newParams);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const newParams = new URLSearchParams(searchParams);
    if (searchInput.trim()) {
      newParams.set('search', searchInput.trim());
    } else {
      newParams.delete('search');
    }
    setSearchParams(newParams);
  };

  const handleResetFilters = () => {
    setSearchInput('');
    setSearchParams({});
  };

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem' }}>
      <div style={{ marginBottom: '2.5rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2.2rem', fontWeight: '800', color: '#0f172a', marginBottom: '0.5rem' }}>
          Find Your Healthcare Specialist
        </h1>
        <p style={{ color: '#64748b', fontSize: '1rem', maxWidth: '600px', margin: '0 auto' }}>
          Browse available doctors, view specializations, and schedule your appointment online.
        </p>
      </div>

      {/* SEARCH AND FILTER BAR */}
      <div className="card" style={{ marginBottom: '2.5rem', padding: '1.5rem' }}>
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div style={{ flex: 1, minWidth: '260px', position: 'relative' }}>
            <Search size={18} color="#94a3b8" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              className="form-input"
              style={{ paddingLeft: '2.75rem' }}
              placeholder="Search doctor by name, specialty, or condition..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Search
          </button>
          {(currentSpecialization !== 'All' || searchQuery) && (
            <button type="button" onClick={handleResetFilters} className="btn btn-secondary" title="Reset filters">
              <RefreshCw size={16} /> Reset
            </button>
          )}
        </form>

        {/* SPECIALIZATION PILLS */}
        <div>
          <div style={{ fontSize: '0.8rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', marginBottom: '0.6rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Filter size={14} /> Filter by Specialization:
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {SPECIALIZATIONS.map((spec) => {
              const selected = currentSpecialization === spec;
              return (
                <button
                  key={spec}
                  onClick={() => handleSpecializationChange(spec)}
                  style={{
                    padding: '0.4rem 1rem',
                    borderRadius: '30px',
                    fontSize: '0.85rem',
                    fontWeight: '600',
                    border: '1px solid',
                    borderColor: selected ? '#0d9488' : '#e2e8f0',
                    backgroundColor: selected ? '#0d9488' : 'white',
                    color: selected ? 'white' : '#475569',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  {spec}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* DOCTORS GRID */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: '#0d9488', fontWeight: '600' }}>
          Searching specialists...
        </div>
      ) : doctors.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3.5rem 2rem' }}>
          <div style={{ width: '60px', height: '60px', background: '#f1f5f9', color: '#94a3b8', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
            <Stethoscope size={30} />
          </div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#0f172a', marginBottom: '0.5rem' }}>
            No Doctors Found
          </h3>
          <p style={{ color: '#64748b', fontSize: '0.95rem', maxWidth: '400px', margin: '0 auto 1.5rem' }}>
            We couldn't find any doctors matching your current filters. Try selecting a different specialization or resetting your search.
          </p>
          <button onClick={handleResetFilters} className="btn btn-primary">
            View All Doctors
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
          {doctors.map((doc) => (
            <DoctorCard key={doc._id} doctor={doc} />
          ))}
        </div>
      )}
    </div>
  );
};

export default DoctorsPage;
