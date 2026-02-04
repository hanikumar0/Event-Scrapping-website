import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../App';
import { Search, Filter, CheckCircle, AlertCircle, Clock, Download, X, Users, LayoutDashboard, Calendar as CalIcon, Globe, MapPin } from 'lucide-react';

const Dashboard = ({ user }) => {
    const [events, setEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [filters, setFilters] = useState({
        search: '',
        status: '',
        city: 'Sydney',
        dateStart: '',
        dateEnd: ''
    });
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalEvents: 0,
        recentlyScraped: 0,
        newEvents: 0,
        importedEvents: 0,
        totalLeads: 0
    });

    useEffect(() => {
        fetchDashboardEvents();
        fetchStats();
    }, [filters]);

    const fetchStats = async () => {
        try {
            const res = await axios.get(`${API_URL}/events/stats`);
            setStats(res.data);
        } catch (err) {
            console.error('Stats fetch error:', err);
        }
    };

    const fetchDashboardEvents = async () => {
        try {
            const res = await axios.get(`${API_URL}/events`, { params: filters });
            setEvents(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleImport = async (eventId) => {
        const notes = prompt('Any notes for this import?');
        try {
            const res = await axios.patch(`${API_URL}/events/${eventId}/import`, { notes });
            setEvents(events.map(e => e._id === eventId ? res.data : e));
            setSelectedEvent(res.data);
        } catch (err) {
            alert('Import failed');
        }
    };

    const getStatusTag = (status) => {
        switch (status) {
            case 'new': return <span className="premium-tag tag-new"><Clock size={12} /> New</span>;
            case 'updated': return <span className="premium-tag tag-updated"><AlertCircle size={12} /> Updated</span>;
            case 'inactive': return <span className="premium-tag tag-inactive"><X size={12} /> Inactive</span>;
            case 'imported': return <span className="premium-tag tag-imported"><CheckCircle size={12} /> Imported</span>;
            default: return null;
        }
    };

    return (
        <div className="dashboard-layout fade-in">
            <div className="mesh-bg">
                <div className="mesh-circle" style={{ width: '600px', height: '600px', background: 'rgba(99, 102, 241, 0.1)', top: '-10%', right: '10%' }}></div>
                <div className="mesh-circle" style={{ width: '400px', height: '400px', background: 'rgba(244, 63, 94, 0.05)', bottom: '5%', left: '5%', animationDelay: '-12s' }}></div>
            </div>

            <div className="dashboard-main">
                <div className="stats-header">
                    <div className="title-area">
                        <h1>Command Center</h1>
                        <p>Managing {stats.totalEvents} events across Sydney platform.</p>
                    </div>
                    <div className="stats-row">
                        <div className="stat-card glass">
                            <div className="stat-icon scraped"><Clock size={20} /></div>
                            <div className="stat-info">
                                <span className="stat-value">{stats.recentlyScraped}</span>
                                <span className="stat-label">Recently Scraped</span>
                            </div>
                        </div>
                        <div className="stat-card glass">
                            <div className="stat-icon leads"><Users size={20} /></div>
                            <div className="stat-info">
                                <span className="stat-value">{stats.totalLeads}</span>
                                <span className="stat-label">Subscriber Leads</span>
                            </div>
                        </div>
                        <div className="stat-card glass">
                            <div className="stat-icon imported"><CheckCircle size={20} /></div>
                            <div className="stat-info">
                                <span className="stat-value">{stats.importedEvents}</span>
                                <span className="stat-label">Total Imported</span>
                            </div>
                        </div>
                    </div>
                </div>

                <header className="dashboard-actions glass">
                    <div className="filter-bar">
                        <div className="search-input-premium">
                            <Search size={18} />
                            <input
                                type="text"
                                placeholder="Filter by title, venue..."
                                value={filters.search}
                                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                            />
                        </div>
                        <div className="select-wrapper">
                            <MapPin size={16} />
                            <select
                                value={filters.city}
                                onChange={(e) => setFilters({ ...filters, city: e.target.value })}
                                className="filter-select-premium"
                            >
                                <option value="Sydney">Sydney</option>
                                <option value="Melbourne">Melbourne</option>
                            </select>
                        </div>
                        <div className="select-wrapper">
                            <Filter size={16} />
                            <select
                                value={filters.status}
                                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                                className="filter-select-premium"
                            >
                                <option value="">All Status</option>
                                <option value="new">New Events</option>
                                <option value="imported">Imported</option>
                                <option value="inactive">Archived</option>
                            </select>
                        </div>
                        <div className="date-group glass">
                            <CalIcon size={16} />
                            <input
                                type="date"
                                className="filter-date-premium"
                                value={filters.dateStart}
                                onChange={(e) => setFilters({ ...filters, dateStart: e.target.value })}
                            />
                            <span>to</span>
                            <input
                                type="date"
                                className="filter-date-premium"
                                value={filters.dateEnd}
                                onChange={(e) => setFilters({ ...filters, dateEnd: e.target.value })}
                            />
                        </div>
                    </div>
                </header>

                <div className="table-container glass modalanim">
                    <table className="events-table-premium">
                        <thead>
                            <tr>
                                <th>Event Title</th>
                                <th>Platform</th>
                                <th>Status</th>
                                <th style={{ textAlign: 'right' }}>Management</th>
                            </tr>
                        </thead>
                        <tbody>
                            {events.map(event => (
                                <tr
                                    key={event._id}
                                    className={selectedEvent?._id === event._id ? 'active' : ''}
                                    onClick={() => setSelectedEvent(event)}
                                >
                                    <td className="title-cell">{event.title}</td>
                                    <td>
                                        <div className="source-pill">
                                            <Globe size={12} />
                                            {event.sourceName}
                                        </div>
                                    </td>
                                    <td>{getStatusTag(event.status)}</td>
                                    <td style={{ textAlign: 'right' }}>
                                        {event.status !== 'imported' ? (
                                            <button className="import-btn-premium" onClick={(e) => { e.stopPropagation(); handleImport(event._id); }}>
                                                <Download size={14} /> Import
                                            </button>
                                        ) : (
                                            <span className="imported-check"><CheckCircle size={16} /> Ready</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <aside className={`preview-panel-premium glass ${selectedEvent ? 'open' : ''}`}>
                {selectedEvent ? (
                    <div className="preview-content">
                        <button className="close-preview" onClick={() => setSelectedEvent(null)}>
                            <X size={20} />
                        </button>
                        <div className="preview-image-container">
                            <img src={selectedEvent.imageUrl || 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=800&q=80'} alt="" />
                            <div className="image-overlay"></div>
                        </div>
                        <div className="preview-body">
                            <h3>{selectedEvent.title}</h3>
                            <div className="preview-meta-grid">
                                <div className="meta-row">
                                    <Globe size={16} />
                                    <a href={selectedEvent.originalUrl} target="_blank" rel="noreferrer">Open Source Link</a>
                                </div>
                                <div className="meta-row">
                                    <MapPin size={16} />
                                    <span>{selectedEvent.venueName || 'Sydney Area'}</span>
                                </div>
                                <div className="meta-row">
                                    <CalIcon size={16} />
                                    <span>{selectedEvent.date ? new Date(selectedEvent.date).toLocaleString() : 'Date Pending'}</span>
                                </div>
                            </div>

                            <div className="preview-description">
                                <h4>Description</h4>
                                <p>{selectedEvent.description || 'No detailed description pulled from source yet.'}</p>
                            </div>

                            {selectedEvent.status === 'imported' && (
                                <div className="import-success-box">
                                    <div className="box-header">
                                        <CheckCircle size={16} />
                                        <span>Imported to Platform</span>
                                    </div>
                                    <div className="box-body">
                                        <p><strong>Notes:</strong> {selectedEvent.importNotes || 'No notes provided.'}</p>
                                        <p className="timestamp">{new Date(selectedEvent.importedAt).toLocaleString()}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="preview-empty">
                        <div className="icon-circle" style={{ marginBottom: '1.5rem', background: 'rgba(255,255,255,0.03)' }}>
                            <LayoutDashboard size={32} style={{ opacity: 0.3 }} />
                        </div>
                        <p>Select an event to prioritize or import</p>
                    </div>
                )}
            </aside>

            <style dangerouslySetInnerHTML={{
                __html: `
        .dashboard-layout { display: flex; gap: 2rem; height: calc(100vh - 120px); padding: 0 2rem 2rem; position: relative; }
        .dashboard-main { flex: 1; display: flex; flex-direction: column; gap: 2.5rem; overflow: hidden; }
        
        .stats-header { display: flex; justify-content: space-between; align-items: flex-end; }
        .title-area h1 { font-size: 2.5rem; font-weight: 800; margin-bottom: 0.5rem; background: linear-gradient(135deg, #fff, #94a3b8); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .title-area p { color: #64748b; font-weight: 500; }
        
        .stats-row { display: flex; gap: 1.5rem; }
        .stat-card { padding: 1.25rem 1.75rem; display: flex; align-items: center; gap: 1.25rem; border-radius: 20px; min-width: 200px; }
        .stat-icon { width: 44px; height: 44px; border-radius: 14px; display: flex; align-items: center; justify-content: center; }
        .stat-icon.scraped { background: rgba(99, 102, 241, 0.1); color: #6366f1; }
        .stat-icon.leads { background: rgba(244, 63, 94, 0.1); color: #f43f5e; }
        .stat-icon.imported { background: rgba(16, 185, 129, 0.1); color: #10b981; }
        .stat-value { font-size: 1.5rem; font-weight: 800; display: block; }
        .stat-label { font-size: 0.7rem; color: #64748b; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; }

        .dashboard-actions { padding: 1.25rem; border-radius: 24px; }
        .filter-bar { display: flex; gap: 1rem; align-items: center; }
        
        .search-input-premium { display: flex; align-items: center; gap: 0.75rem; background: rgba(255,255,255,0.03); border: 1px solid var(--glass-border); padding: 0.75rem 1.25rem; border-radius: 14px; flex: 1; }
        .search-input-premium input { background: none; border: none; color: white; width: 100%; font-size: 0.95rem; }
        .search-input-premium input:focus { outline: none; }
        .search-input-premium svg { color: #64748b; }

        .select-wrapper { position: relative; display: flex; align-items: center; gap: 0.75rem; background: rgba(255,255,255,0.03); border: 1px solid var(--glass-border); padding: 0.75rem 1rem; border-radius: 14px; }
        .select-wrapper svg { color: #64748b; }
        .filter-select-premium { background: none; border: none; color: white; font-size: 0.9rem; font-weight: 600; cursor: pointer; padding-right: 0.5rem; }
        .filter-select-premium:focus { outline: none; }
        
        .date-group { display: flex; align-items: center; gap: 0.75rem; padding: 0.75rem 1rem; border-radius: 14px; color: #64748b; font-size: 0.85rem; }
        .filter-date-premium { background: none; border: none; color: white; font-size: 0.85rem; cursor: pointer; }
        
        .table-container { flex: 1; overflow-y: auto; border-radius: 24px; }
        .events-table-premium { width: 100%; border-collapse: separate; border-spacing: 0; }
        .events-table-premium th { position: sticky; top: 0; background: #0f172a; padding: 1.25rem 1.5rem; text-align: left; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 1px; color: #64748b; border-bottom: 1px solid var(--glass-border); z-index: 10; }
        .events-table-premium td { padding: 1.25rem 1.5rem; border-bottom: 1px solid var(--glass-border); transition: var(--transition); }
        .events-table-premium tr { cursor: pointer; }
        .events-table-premium tr:hover td { background: rgba(255,255,255,0.02); }
        .events-table-premium tr.active td { background: rgba(99, 102, 241, 0.05); border-left: 2px solid var(--primary); }
        
        .title-cell { font-weight: 700; color: #f8fafc; font-size: 1rem; }
        .source-pill { display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.4rem 0.75rem; background: rgba(255,255,255,0.03); border: 1px solid var(--glass-border); border-radius: 10px; font-size: 0.8rem; font-weight: 500; color: #94a3b8; }
        
        .premium-tag { display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.4rem 0.8rem; border-radius: 10px; font-size: 0.75rem; font-weight: 800; text-transform: uppercase; }
        .tag-new { background: rgba(99, 102, 241, 0.1); color: var(--primary); }
        .tag-imported { background: rgba(16, 185, 129, 0.1); color: #10b981; }
        .tag-inactive { background: rgba(148, 163, 184, 0.1); color: #94a3b8; }
        
        .import-btn-premium { background: var(--primary); color: white; padding: 0.6rem 1rem; border-radius: 12px; display: flex; align-items: center; gap: 0.5rem; font-size: 0.85rem; font-weight: 700; border: none; cursor: pointer; transition: var(--transition); }
        .import-btn-premium:hover { transform: translateY(-2px); box-shadow: 0 4px 12px var(--primary-glow); }
        .imported-check { color: #10b981; font-weight: 700; display: flex; justify-content: flex-end; align-items: center; gap: 0.5rem; }

        .preview-panel-premium { width: 450px; border-radius: 32px; overflow-y: auto; transition: var(--transition); position: relative; }
        .preview-image-container { position: relative; height: 260px; overflow: hidden; border-radius: 24px; margin: 1.5rem; }
        .preview-image-container img { width: 100%; height: 100%; object-fit: cover; }
        .image-overlay { position: absolute; inset: 0; background: linear-gradient(to bottom, transparent 60%, rgba(15, 23, 42, 0.8)); }
        
        .preview-body { padding: 0 2rem 2rem; }
        .preview-body h3 { font-size: 1.75rem; font-weight: 800; line-height: 1.2; margin-bottom: 2rem; }
        .preview-meta-grid { display: flex; flex-direction: column; gap: 1rem; margin-bottom: 2.5rem; }
        .meta-row { display: flex; align-items: center; gap: 1rem; color: #94a3b8; font-weight: 500; font-size: 0.95rem; }
        .meta-row a { color: var(--primary); text-decoration: none; font-weight: 700; }
        
        .preview-description h4 { font-size: 0.9rem; text-transform: uppercase; letter-spacing: 1.5px; color: #64748b; margin-bottom: 1rem; }
        .preview-description p { color: #94a3b8; line-height: 1.7; font-size: 1rem; }
        
        .import-success-box { margin-top: 2.5rem; background: rgba(16, 185, 129, 0.05); border: 1px solid rgba(16, 185, 129, 0.1); border-radius: 20px; overflow: hidden; }
        .box-header { display: flex; align-items: center; gap: 0.75rem; padding: 1rem 1.5rem; background: rgba(16, 185, 129, 0.1); color: #10b981; font-weight: 800; font-size: 0.9rem; text-transform: uppercase; }
        .box-body { padding: 1.5rem; }
        .box-body p { margin-bottom: 0.5rem; color: #f8fafc; }
        .timestamp { font-size: 0.8rem; color: #64748b !important; }

        .preview-empty { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; color: #64748b; font-weight: 600; padding: 3rem; text-align: center; }
        .close-preview { position: absolute; top: 2rem; right: 2rem; background: rgba(255,255,255,0.05); color: white; border: none; width: 44px; height: 44px; border-radius: 50%; display: flex; align-items: center; justify-content: center; z-index: 100; transition: var(--transition); }
        .close-preview:hover { background: var(--accent); }
      `}} />
        </div>
    );
};

export default Dashboard;
