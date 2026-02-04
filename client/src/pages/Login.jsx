import React from 'react';
import { Calendar } from 'lucide-react';
import { API_URL } from '../App';

const Login = () => {
  const handleGoogleLogin = () => {
    window.location.href = `${API_URL}/auth/google`;
  };

  return (
    <div className="login-container fade-in">
      <div className="login-card glass">
        <Calendar size={48} className="login-logo" />
        <h1>Admin Portal</h1>
        <p>Sign in with your Google account to manage events and view dashboard.</p>

        <button onClick={handleGoogleLogin} className="google-btn">
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" />
          Continue with Google
        </button>

        <div style={{ marginTop: '1.5rem', fontSize: '0.875rem' }}>
          <p style={{ color: 'var(--text-muted)' }}>
            Trouble with Google? <a href={`${API_URL}/auth/dev-login`} style={{ color: 'var(--primary)', fontWeight: '600' }}>Use Dev Bypass</a>
          </p>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
        .login-container {
          height: 80vh;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .login-card {
          padding: 3rem;
          border-radius: 24px;
          text-align: center;
          max-width: 400px;
          width: 100%;
        }
        .login-logo {
          color: var(--primary);
          margin-bottom: 1.5rem;
        }
        .login-card h1 { margin-bottom: 0.5rem; }
        .login-card p { color: var(--text-muted); margin-bottom: 2rem; }
        .google-btn {
          width: 100%;
          background: white;
          color: #1f2937;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          padding: 0.75rem;
          border-radius: 8px;
          font-weight: 600;
          transition: background 0.2s;
        }
        .google-btn:hover {
          background: #f3f4f6;
        }
        .google-btn img { width: 20px; }
      `}} />
    </div>
  );
};

export default Login;
