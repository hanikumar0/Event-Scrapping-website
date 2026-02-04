import React from 'react';
import { Calendar, ShieldCheck } from 'lucide-react';
import { API_URL } from '../App';

const Login = () => {
  const handleGoogleLogin = () => {
    window.location.href = `${API_URL}/auth/google`;
  };

  return (
    <div className="login-container fade-in">
      {/* Mesh Background circles for login */}
      <div className="mesh-bg">
        <div className="mesh-circle" style={{ width: '400px', height: '400px', background: 'rgba(99, 102, 241, 0.2)', top: '10%', left: '20%' }}></div>
        <div className="mesh-circle" style={{ width: '300px', height: '300px', background: 'rgba(244, 63, 94, 0.1)', bottom: '10%', right: '20%', animationDelay: '-8s' }}></div>
      </div>

      <div className="login-card glass modalanim">
        <div className="icon-circle" style={{ width: '70px', height: '70px', background: 'rgba(99, 102, 241, 0.1)', margin: '0 auto 2rem' }}>
          <ShieldCheck size={40} className="icon-purple" />
        </div>
        <h1>Admin Portal</h1>
        <p>Access the SydEvents management console. Please verify your identity to continue.</p>

        <button onClick={handleGoogleLogin} className="google-btn">
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" />
          Continue with Google
        </button>

        <div className="dev-bypass">
          <p>
            System Administrator? <a href={`${API_URL}/auth/dev-login`}>Use Developer Bypass</a>
          </p>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
        .login-container {
          height: calc(100vh - 120px);
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }
        .login-card {
          padding: 4rem;
          border-radius: 40px;
          text-align: center;
          max-width: 450px;
          width: 90%;
          box-shadow: 0 40px 100px -20px rgba(0,0,0,0.5);
        }
        .login-card h1 { font-size: 2.25rem; font-weight: 800; margin-bottom: 1rem; color: #fff; }
        .login-card p { color: #94a3b8; margin-bottom: 2.5rem; line-height: 1.6; }
        
        .google-btn {
          width: 100%;
          background: #fff;
          color: #0f172a;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          padding: 1.1rem;
          border-radius: 18px;
          font-weight: 700;
          font-size: 1rem;
          transition: var(--transition);
          border: none;
          cursor: pointer;
          box-shadow: 0 10px 20px -5px rgba(0,0,0,0.2);
        }
        .google-btn:hover {
          transform: translateY(-4px);
          background: #f8fafc;
          box-shadow: 0 20px 40px -10px rgba(0,0,0,0.3);
        }
        .google-btn:active { transform: translateY(0); }
        .google-btn img { width: 22px; }

        .dev-bypass { margin-top: 2.5rem; padding-top: 2rem; border-top: 1px solid rgba(255,255,255,0.05); }
        .dev-bypass p { color: #64748b; font-size: 0.9rem; margin: 0; }
        .dev-bypass a { color: var(--primary); font-weight: 700; text-decoration: none; margin-left: 0.5rem; }
        .dev-bypass a:hover { text-decoration: underline; }
      `}} />
    </div>
  );
};

export default Login;
