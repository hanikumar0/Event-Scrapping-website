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
      }, 2000);
    } catch (err) {
      console.error('Subscription error:', err);
      const errorMsg = err.response?.data?.msg || 'Could not process request. Please try again.';
      setFormError(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="container fade-in page-transition" style={{ paddingBottom: '5rem' }}>
      {/* Mesh Background circles */}
      <div className="mesh-bg">
        <div className="mesh-circle" style={{ width: '600px', height: '600px', background: 'rgba(99, 102, 241, 0.15)', top: '-200px', left: '-200px' }}></div>
        <div className="mesh-circle" style={{ width: '500px', height: '500px', background: 'rgba(168, 85, 247, 0.15)', bottom: '-100px', right: '-100px', animationDelay: '-5s' }}></div>
      </div>

      <header className="hero-section">
        <div className="hero-badge">Live in Sydney</div>
        <h1>Experience the Best <span>Happenings</span></h1>
        <p>Your premium gateway to the city's most exclusive and exciting events. Handpicked for the discerning attendee.</p>
      </header>

      {loading ? (
        <div className="grid">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="event-card glass" style={{ height: '450px' }}>
              <div className="skeleton" style={{ height: '220px', borderRadius: '0' }}></div>
              <div style={{ padding: '2rem' }}>
                <div className="skeleton" style={{ height: '24px', width: '80%', marginBottom: '1rem' }}></div>
                <div className="skeleton" style={{ height: '16px', width: '40%', marginBottom: '0.5rem' }}></div>
                <div className="skeleton" style={{ height: '16px', width: '60%', marginBottom: '1.5rem' }}></div>
                <div className="skeleton" style={{ height: '48px', width: '100%', borderRadius: '16px' }}></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid">
          {events.map((event, idx) => (
            <div key={event._id} className="event-card glass fade-in" style={{ animationDelay: `${idx * 0.1}s` }}>
              <div className="card-image">
                <img src={event.imageUrl || 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=800&q=80'} alt={event.title} />
                <span className={`source-tag ${event.sourceName?.toLowerCase().replace(/\s/g, '-')}`}>
                  {event.sourceName}
                </span>
              </div>
              <div className="card-body">
                <h3>{event.title}</h3>
                <div className="meta-info">
                  <div className="meta-item">
                    <CalIcon size={14} className="icon-purple" />
                    <span>{event.date ? new Date(event.date).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' }) : 'Upcoming'}</span>
                  </div>
                  <div className="meta-item">
                    <MapPin size={14} className="icon-pink" />
                    <span>{event.venueName || 'Sydney Area'}</span>
                  </div>
                </div>
                <p className="summary">{event.description?.substring(0, 100) || 'Discover a world of excitement and wonder at this upcoming Sydney event. Join fellow enthusiasts for an unforgettable experience.'}...</p>
                <button className="btn-premium ticket-btn" onClick={() => handleTicketClick(event)}>
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
          <div className="modal-content glass modalanim">
            {success ? (
              <div className="success-view">
                <CheckCircle size={64} className="success-icon" style={{ color: '#10b981' }} />
                <h2>You're All Set!</h2>
                <p>We've sent the details to <strong>{email}</strong>.</p>
                <p style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: '#64748b' }}>Check your inbox. Redirecting you to the booking page...</p>
                <div className="loader" style={{ margin: '1.5rem auto 0', width: '32px', height: '32px' }}></div>
              </div>
            ) : (
              <>
                <button className="close-btn" onClick={() => setModalEvent(null)}>
                  <X size={24} />
                </button>
                <div className="modal-header">
                  <div className="icon-circle">
                    <Ticket size={32} className="icon-purple" />
                  </div>
                  <h2>Secure Your Spot</h2>
                  <p>Request a secure ticket link for <strong>{modalEvent.title}</strong></p>
                </div>
                <form onSubmit={handleSubscribe}>
                  <div className="form-group">
                    <label>Email Address</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. yourname@gmail.com"
                      required
                      autoFocus
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
                      I agree to the privacy policy and consent to ticket processing.
                    </label>
                  </div>
                  {formError && <div className="form-error-msg">{formError}</div>}
                  <div className="modal-actions">
                    <button type="submit" className="btn-premium submit-btn" disabled={submitting}>
                      {submitting ? (
                        <>
                          <div className="loader" style={{ width: '18px', height: '18px', borderWidth: '2px' }}></div>
                          Processing...
                        </>
                      ) : (
                        <>
                          Get Ticket Link
                          <ExternalLink size={16} />
                        </>
                      )}
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
        .hero-section { text-align: center; padding: 6rem 1rem 4rem; position: relative; }
        .hero-badge { display: inline-block; padding: 0.5rem 1.25rem; background: rgba(99, 102, 241, 0.1); border: 1px solid var(--primary); border-radius: 100px; color: var(--primary); font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 2rem; }
        .hero-section h1 { font-size: clamp(2.5rem, 8vw, 4.5rem); font-weight: 800; line-height: 1.1; margin-bottom: 1.5rem; }
        .hero-section h1 span { background: linear-gradient(135deg, var(--primary), var(--accent)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .hero-section p { color: #94a3b8; font-size: 1.25rem; max-width: 650px; margin: 0 auto; line-height: 1.6; }
        
        .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: 3rem; padding: 2rem 0; }
        
        .event-card { border-radius: 32px; overflow: hidden; transition: var(--transition); border: 1px solid var(--glass-border); position: relative; }
        .event-card:hover { transform: translateY(-12px); border-color: rgba(99, 102, 241, 0.5); box-shadow: 0 40px 80px -20px rgba(0,0,0,0.6); }
        
        .card-image { position: relative; height: 240px; overflow: hidden; }
        .card-image img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.8s cubic-bezier(0.2, 0.8, 0.2, 1); }
        .event-card:hover .card-image img { transform: scale(1.1); }
        
        .source-tag { position: absolute; top: 1.5rem; right: 1.5rem; padding: 0.5rem 1rem; border-radius: 14px; font-size: 0.7rem; font-weight: 800; text-transform: uppercase; color: white; border: 1px solid rgba(255,255,255,0.2); backdrop-filter: blur(12px); box-shadow: 0 8px 16px rgba(0,0,0,0.3); z-index: 2; }
        .source-tag.city-of-sydney { background: linear-gradient(135deg, #3b82f6, #2563eb); }
        .source-tag.eventbrite-sydney { background: linear-gradient(135deg, #f97316, #ea580c); }
        
        .card-body { padding: 2.25rem; }
        .card-body h3 { font-size: 1.5rem; font-weight: 800; margin-bottom: 1.25rem; line-height: 1.2; height: 3.6rem; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; color: #fff; }
        
        .meta-info { display: flex; flex-direction: column; gap: 0.85rem; margin-bottom: 1.75rem; }
        .meta-item { display: flex; align-items: center; gap: 0.85rem; color: #94a3b8; font-size: 0.95rem; font-weight: 500; }
        .icon-purple { color: var(--primary); }
        .icon-pink { color: var(--accent); }
        
        .summary { color: #64748b; font-size: 0.95rem; line-height: 1.7; margin-bottom: 2rem; height: 4.8rem; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
        
        .modal-overlay { position: fixed; inset: 0; background: rgba(3, 4, 6, 0.85); backdrop-filter: blur(20px); display: flex; align-items: center; justify-content: center; z-index: 2000; padding: 1.5rem; }
        .modal-content { width: 100%; max-width: 500px; padding: 3.5rem; border-radius: 40px; position: relative; animation: slideUp 0.5s cubic-bezier(0.19, 1, 0.22, 1); }
        
        .close-btn { position: absolute; top: 1.5rem; right: 1.5rem; background: rgba(255,255,255,0.05); color: white; border: none; width: 48px; height: 48px; border-radius: 50%; display: flex; align-items: center; justify-content: center; transition: var(--transition); }
        .close-btn:hover { background: var(--accent); transform: rotate(90deg); }
        
        .modal-header { text-align: center; margin-bottom: 2.5rem; }
        .icon-circle { width: 80px; height: 80px; background: rgba(99, 102, 241, 0.1); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.5rem; }
        .modal-header h2 { font-size: 2.25rem; font-weight: 800; margin-bottom: 0.75rem; color: #fff; }
        .modal-header p { color: #94a3b8; line-height: 1.6; }
        
        .form-group { margin-bottom: 1.5rem; }
        .form-group label { display: block; font-size: 0.9rem; font-weight: 600; margin-bottom: 0.75rem; color: #cbd5e1; }
        .form-group input[type="email"] { background: rgba(255,255,255,0.03); border: 2px solid rgba(255,255,255,0.08); padding: 1.25rem; border-radius: 18px; color: white; width: 100%; transition: var(--transition); font-size: 1.1rem; }
        .form-group input[type="email"]:focus { border-color: var(--primary); background: rgba(255,255,255,0.07); box-shadow: 0 0 0 4px var(--primary-glow); }
        
        .form-group.checkbox { display: flex; align-items: flex-start; gap: 1rem; margin: 2rem 0; cursor: pointer; }
        .custom-checkbox { position: relative; width: 24px; height: 24px; flex-shrink: 0; }
        .checkbox-box { position: absolute; inset: 0; background: rgba(255,255,255,0.05); border: 2px solid rgba(255,255,255,0.1); border-radius: 8px; transition: var(--transition); }
        .custom-checkbox input:checked ~ .checkbox-box { background: var(--primary); border-color: var(--primary); }
        .checkbox-box:after { content: ""; position: absolute; display: none; left: 8px; top: 4px; width: 4px; height: 9px; border: solid white; border-width: 0 2px 2px 0; transform: rotate(45deg); }
        .custom-checkbox input:checked ~ .checkbox-box:after { display: block; }
        .consent-text { font-size: 0.85rem; color: #94a3b8; line-height: 1.5; }
        
        .form-error-msg { background: rgba(244, 63, 94, 0.1); border: 1px solid rgba(244, 63, 94, 0.2); color: var(--accent); padding: 1rem; border-radius: 14px; font-size: 0.9rem; font-weight: 600; margin-bottom: 1.5rem; text-align: center; }
        
        .loader { border: 3px solid rgba(255,255,255,0.1); border-top: 3px solid #fff; border-radius: 50%; animation: spin 0.8s linear infinite; }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
      `}} />
    </main>
  );
};


export default Home;
