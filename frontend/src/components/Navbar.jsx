import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Stethoscope, Calendar, UserCheck, LogOut, LayoutDashboard, Menu, X, ShieldAlert } from 'lucide-react';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="container nav-container">
        <Link to="/" className="brand-logo">
          <div className="brand-icon">
            <Stethoscope size={22} />
          </div>
          <div className="brand-text">
            Care<span>Pulse</span>
          </div>
        </Link>

        <ul className={`nav-links ${mobileMenuOpen ? 'mobile-open' : ''}`}>
          <li>
            <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>
              Home
            </Link>
          </li>
          <li>
            <Link to="/doctors" className={`nav-link ${isActive('/doctors') ? 'active' : ''}`}>
              Doctors
            </Link>
          </li>

          {user && (
            <>
              <li>
                <Link to="/book" className={`nav-link ${isActive('/book') ? 'active' : ''}`}>
                  Book Appointment
                </Link>
              </li>
              <li>
                <Link to="/my-appointments" className={`nav-link ${isActive('/my-appointments') ? 'active' : ''}`}>
                  My Appointments
                </Link>
              </li>
            </>
          )}

          {isAdmin && (
            <li>
              <Link to="/admin" className={`nav-link ${isActive('/admin') ? 'active' : ''}`}>
                <span className="admin-badge">Admin</span>
              </Link>
            </li>
          )}

          {user ? (
            <li className="user-profile-item" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div className="user-profile-pill">
                <div className="user-avatar">{user.name.charAt(0).toUpperCase()}</div>
                <span>{user.name.split(' ')[0]}</span>
              </div>
              <button onClick={handleLogout} className="btn btn-secondary btn-sm" title="Log out">
                <LogOut size={16} /> Logout
              </button>
            </li>
          ) : (
            <li style={{ display: 'flex', gap: '0.75rem' }}>
              <Link to="/login" className="btn btn-secondary btn-sm">
                Log In
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Get Started
              </Link>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
