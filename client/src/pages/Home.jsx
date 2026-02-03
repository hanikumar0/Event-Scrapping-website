import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../App';
import { MapPin, Calendar as CalIcon, ExternalLink, Ticket, X, CheckCircle } from 'lucide-react';

const Home = () => {
  const [events, setEvents] = useState([]);
  const [modalEvent, setModalEvent] = useState(null);
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await axios.get(`${API_URL}/events`);
      // Show only active events
      setEvents(res.data.filter(e => e.status !== 'inactive'));
    } catch (err) {
      console.error('Error fetching events:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleTicketClick = (event) => {
    setModalEvent(event);
    setConsent(false);
    setSuccess(false);
    setFormError('');
  };

  const handleSubscribe = async (e) => {
    e.preventDefault();
    setFormError('');
    if (!email) return;
    if (!consent) {
      setFormError('Please accept the terms to continue');
      return;
    }

    setSubmitting(true);
    try {
      await axios.post(`${API_URL}/subscribers`, {
        email,
        consent,
        eventId: modalEvent._id
      });
      setSuccess(true);
      setTimeout(() => {
        window.location.href = modalEvent.originalUrl;
      }, 1500);
    } catch (err) {
      console.error('Subscription error:', err);
      alert('Could not process request. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="container fade-in">
      <header className="hero-section">
        <div className="hero-badge">Live in Sydney</div>
        <h1>Experience the Best <span>Happenings</span></h1>
        <p>Your premium gateway to the city's most exclusive and exciting events.</p>
      </header>

      {loading ? (
        <div className="loader-container">
          <div className="loader"></div>
          <p>Fetching Sydney's Best Events...</p>
        </div>
      ) : (
        <div className="grid">
          {events.map(event => (
            <div key={event._id} className="event-card glass">
              <div className="card-image">
                <img src={event.imageUrl || 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=800&q=80'} alt={event.title} />
                <span className={`source-tag ${event.sourceName.toLowerCase().replace(/\s/g, '-')}`}>
                  {event.sourceName}
                </span>
              </div>
              <div className="card-body">
                <h3>{event.title}</h3>
                <div className="meta-info">
                  <div className="meta-item">
                    <CalIcon size={14} />
                    <span>{event.date ? new Date(event.date).toLocaleDateString() : 'Upcoming'}</span>
                  </div>
                  <div className="meta-item">
                    <MapPin size={14} />
                    <span>{event.venueName || 'Sydney Area'}</span>
                  </div>
                </div>
                <p className="summary">{event.description?.substring(0, 100) || 'Discover a world of excitement and wonder at this upcoming Sydney event. Join fellow enthusiasts for an unforgettable experience.'}...</p>
                <button className="ticket-btn" onClick={() => handleTicketClick(event)}>
                  <Ticket size={18} />
                  GET TICKETS
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {modalEvent && (
        <div className="modal-overlay">
          <div className="modal-content glass">
            {success ? (
              <div className="success-view">
                <CheckCircle size={64} className="success-icon" />
                <h2>You're All Set!</h2>
                <p>We're redirecting you to the ticket page for <strong>{modalEvent.title}</strong></p>
              </div>
            ) : (
              <>
                <button className="close-btn" onClick={() => setModalEvent(null)}>
                  <X size={24} />
                </button>
                <div className="modal-header">
                  <h2>Secure Your Spot</h2>
                  <p>Enter your email to proceed to <strong>{modalEvent.sourceName}</strong></p>
                </div>
                <form onSubmit={handleSubscribe}>
                  <div className="form-group">
                    <label>Email Address</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@luxury.com"
                      required
                    />
                  </div>
                  <div className="form-group checkbox" onClick={() => setConsent(!consent)}>
                    <div className="custom-checkbox">
                      <input
                        type="checkbox"
                        id="consent"
                        checked={consent}
                        onChange={(e) => setConsent(e.target.checked)}
                        onClick={(e) => e.stopPropagation()}
                      />
                      <div className="checkbox-box"></div>
                    </div>
                    <label htmlFor="consent" className="consent-text" onClick={(e) => e.stopPropagation()}>
                      I agree to receive updates and consent to ticket processing.
                    </label>
                  </div>
                  {formError && <p className="form-error-msg">{formError}</p>}
                  <div className="modal-actions">
                    <button type="submit" className="submit-btn" disabled={submitting}>
                      {submitting ? 'Authenticating...' : 'Get Tickets'}
                      {!submitting && <ExternalLink size={16} />}
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{
        __html: `
        :root {
            --primary: #6366f1;
            --primary-glow: rgba(99, 102, 241, 0.4);
            --accent: #f43f5e;
            --bg-dark: #0f172a;
            --glass-bg: rgba(30, 41, 59, 0.7);
            --glass-border: rgba(255, 255, 255, 0.1);
        }

        .hero-section { text-align: center; padding: 6rem 1rem; position: relative; }
        .hero-badge { display: inline-block; padding: 0.5rem 1.25rem; background: rgba(99, 102, 241, 0.1); border: 1px solid var(--primary); border-radius: 100px; color: var(--primary); font-size: 0.8rem; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 2rem; }
        .hero-section h1 { font-size: clamp(2.5rem, 8vw, 4.5rem); font-weight: 800; line-height: 1.1; margin-bottom: 1.5rem; }
        .hero-section h1 span { background: linear-gradient(135deg, var(--primary), var(--accent)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .hero-section p { color: #94a3b8; font-size: 1.25rem; max-width: 600px; margin: 0 auto; line-height: 1.6; }
        
        .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 2.5rem; padding: 2rem 0; }
        
        .event-card { border-radius: 24px; overflow: hidden; transition: all 0.4s cubic-bezier(0.2, 0.8, 0.2, 1); border: 1px solid var(--glass-border); position: relative; }
        .event-card::before { content: ''; position: absolute; inset: 0; background: radial-gradient(circle at top right, rgba(99, 102, 241, 0.1), transparent); opacity: 0; transition: opacity 0.4s; }
        .event-card:hover { transform: translateY(-12px); border-color: rgba(99, 102, 241, 0.5); box-shadow: 0 30px 60px -12px rgba(0,0,0,0.5); }
        .event-card:hover::before { opacity: 1; }
        
        .card-image { position: relative; height: 220px; }
        .card-image img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.6s; }
        .event-card:hover .card-image img { transform: scale(1.1); }
        
        .source-tag { position: absolute; top: 1.25rem; right: 1.25rem; padding: 0.5rem 1rem; border-radius: 12px; font-size: 0.7rem; font-weight: 700; text-transform: uppercase; color: white; border: 1px solid rgba(255,255,255,0.2); backdrop-filter: blur(12px); box-shadow: 0 4px 12px rgba(0,0,0,0.2); }
        .source-tag.city-of-sydney { background: rgba(59, 130, 246, 0.6); }
        .source-tag.eventbrite-sydney { background: rgba(249, 115, 22, 0.6); }
        
        .card-body { padding: 2rem; position: relative; }
        .card-body h3 { font-size: 1.4rem; font-weight: 700; margin-bottom: 1rem; line-height: 1.3; height: 3.6rem; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
        
        .meta-info { display: flex; flex-direction: column; gap: 0.75rem; margin-bottom: 1.5rem; }
        .meta-item { display: flex; align-items: center; gap: 0.85rem; color: #94a3b8; font-size: 0.9rem; }
        
        .summary { color: #64748b; font-size: 0.95rem; line-height: 1.6; margin-bottom: 1.75rem; height: 4.5rem; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
        
        .ticket-btn { width: 100%; padding: 1.1rem; background: var(--primary); color: white; border-radius: 16px; font-weight: 700; font-size: 1rem; display: flex; align-items: center; justify-content: center; gap: 0.75rem; transition: all 0.3s; border: none; cursor: pointer; box-shadow: 0 10px 20px -5px var(--primary-glow); }
        .ticket-btn:hover { background: #4f46e5; transform: scale(1.02); box-shadow: 0 15px 30px -5px var(--primary-glow); }
        
        .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.9); backdrop-filter: blur(15px); display: flex; align-items: center; justify-content: center; z-index: 2000; padding: 1.5rem; animation: fadeIn 0.3s; }
        .modal-content { width: 100%; max-width: 480px; padding: 3rem; border-radius: 32px; background: #0f172a; border: 1px solid rgba(255,255,255,0.1); position: relative; box-shadow: 0 0 50px rgba(0,0,0,0.5); }
        .modalanim { animation: slideUp 0.4s cubic-bezier(0.4, 0, 0.2, 1); }
        
        .close-btn { position: absolute; top: 1.5rem; right: 1.5rem; background: rgba(255,255,255,0.05); color: white; border: none; cursor: pointer; width: 44px; height: 44px; border-radius: 50%; display: flex; align-items: center; justify-content: center; transition: all 0.3s; }
        .close-btn:hover { background: var(--accent); transform: rotate(90deg); }
        
        .modal-header { text-align: center; margin-bottom: 2.5rem; }
        .modal-header h2 { font-size: 2rem; font-weight: 800; margin-bottom: 1rem; }
        .modal-header p { color: #94a3b8; line-height: 1.5; }
        
        .form-group { margin-bottom: 1.75rem; }
        .form-group label { display: block; font-size: 0.9rem; font-weight: 600; margin-bottom: 0.75rem; color: #cbd5e1; }
        .form-group input[type="email"] { background: rgba(255,255,255,0.03); border: 2px solid rgba(255,255,255,0.05); padding: 1.1rem; border-radius: 16px; color: white; width: 100%; transition: all 0.3s; font-size: 1rem; }
        .form-group input[type="email"]:focus { border-color: var(--primary); outline: none; background: rgba(255,255,255,0.06); box-shadow: 0 0 0 4px var(--primary-glow); }
        
        .form-group.checkbox { display: flex; align-items: center; gap: 1rem; margin: 2rem 0; cursor: pointer; }
        .custom-checkbox { position: relative; width: 20px; height: 20px; }
        .custom-checkbox input { position: absolute; opacity: 0; cursor: pointer; height: 0; width: 0; }
        .checkbox-box { position: absolute; top: 0; left: 0; height: 20px; width: 20px; background-color: rgba(255,255,255,0.05); border: 2px solid rgba(255,255,255,0.1); border-radius: 6px; transition: all 0.3s; }
        .custom-checkbox:hover input ~ .checkbox-box { border-color: var(--primary); }
        .custom-checkbox input:checked ~ .checkbox-box { background-color: var(--primary); border-color: var(--primary); }
        .checkbox-box:after { content: ""; position: absolute; display: none; left: 6px; top: 2px; width: 4px; height: 8px; border: solid white; border-width: 0 2px 2px 0; transform: rotate(45deg); }
        .custom-checkbox input:checked ~ .checkbox-box:after { display: block; }
        .consent-text { font-size: 0.875rem; color: #94a3b8; user-select: none; flex: 1; }
        .form-error-msg { color: var(--accent); font-size: 0.85rem; font-weight: 600; margin-top: -1rem; margin-bottom: 1.5rem; text-align: center; animation: shake 0.4s; }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        
        .submit-btn { width: 100%; padding: 1.25rem; background: var(--primary); color: white; border-radius: 18px; display: flex; align-items: center; justify-content: center; gap: 0.75rem; font-weight: 700; font-size: 1.1rem; transition: all 0.3s; cursor: pointer; border: none; }
        .submit-btn:hover { background: #4f46e5; transform: scale(1.02); }
        .submit-btn:disabled { opacity: 0.7; cursor: wait; }
        
        .success-view { text-align: center; padding: 2rem 0; }
        .success-icon { color: #10b981; margin-bottom: 2rem; animation: scaleUp 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
        .success-view h2 { font-size: 2.25rem; margin-bottom: 1rem; }
        .success-view p { color: #94a3b8; font-size: 1.1rem; }

        .loader-container { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 400px; gap: 2rem; }
        .loader { width: 48px; height: 48px; border: 4px solid var(--glass-border); border-top-color: var(--primary); border-radius: 50%; animation: spin 1s linear infinite; }
        
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes scaleUp { from { opacity: 0; transform: scale(0.5); } to { opacity: 1; transform: scale(1); } }
      `}} />
    </main>
  );
};

export default Home;
