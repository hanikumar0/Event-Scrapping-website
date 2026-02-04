import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, LayoutDashboard, LogOut, User } from 'lucide-react';
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
            <>
              <Link to="/dashboard" className="nav-link">Dashboard</Link>
              <div className="user-profile">
                <img src={user.avatar} alt={user.displayName} className="user-avatar" />
                <a href={`${API_URL}/auth/logout`} className="logout-btn">
                  <LogOut size={18} />
                </a>
              </div>
            </>
          ) : (
            <Link to="/login" className="login-pill">Admin Login</Link>
          )}
        </div>
      </div>
      <style dangerouslySetInnerHTML={{
        __html: `
        .navbar {
          position: sticky;
          top: 0;
          z-index: 1000;
          padding: 1rem 0;
          margin-bottom: 2rem;
        }
        .nav-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .logo {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-size: 1.5rem;
          font-weight: 700;
          background: linear-gradient(to right, #6366f1, #f43f5e);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .logo-icon {
          color: var(--primary);
        }
        .nav-links {
          display: flex;
          align-items: center;
          gap: 2rem;
        }
        .nav-link {
          color: var(--text-muted);
          font-weight: 500;
          transition: color 0.3s;
        }
        .nav-link:hover {
          color: var(--text-main);
        }
        .login-pill {
          background: var(--primary);
          padding: 0.5rem 1.25rem;
          border-radius: 9999px;
          color: white;
          font-weight: 600;
          transition: transform 0.2s;
        }
        .login-pill:hover {
          transform: translateY(-2px);
        }
        .user-profile {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        .user-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          border: 2px solid var(--primary);
        }
        .logout-btn {
          color: var(--text-muted);
        }
        .logout-btn:hover {
          color: var(--accent);
        }
      `}} />
    </nav>
  );
};

export default Navbar;
