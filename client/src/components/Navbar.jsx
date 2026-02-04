import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, LogOut } from 'lucide-react';
import { API_URL } from '../App';

const Navbar = ({ user }) => {
  return (
    <nav className="navbar glass">
      <div className="container nav-content">
        <Link to="/" className="logo">
          <Calendar size={28} className="logo-icon" />
          <span>SydEvents</span>
        </Link>

        <div className="nav-links">
          <Link to="/" className="nav-link">Explore</Link>
          {user ? (
            <div className="user-profile">
              <Link to="/dashboard" className="nav-link">Admin Console</Link>
              <img src={user.avatar} alt={user.displayName} className="user-avatar" />
              <a href={`${API_URL}/auth/logout`} className="logout-btn" title="Logout">
                <LogOut size={20} />
              </a>
            </div>
          ) : (
            <Link to="/login" className="login-pill">Admin Access</Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
