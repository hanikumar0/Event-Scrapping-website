import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../App';
import { Search, Filter, CheckCircle, AlertCircle, Clock, Download, X, Users } from 'lucide-react';

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
            case 'new': return <span className="tag new"><Clock size={12} /> New</span>;
            case 'updated': return <span className="tag updated"><AlertCircle size={12} /> Updated</span>;
            case 'inactive': return <span className="tag inactive"><X size={12} /> Inactive</span>;
            case 'imported': return <span className="tag imported"><CheckCircle size={12} /> Imported</span>;
            default: return null;
        }
    };

    return (
        <div className="dashboard-layout">
            <div className="dashboard-main">
                <div className="stats-row">
                    <div className="stat-card glass">
                        <div className="stat-icon scraped"><Clock size={20} /></div>
                        <div className="stat-info">
                            <span className="stat-value">{stats.recentlyScraped}</span>
                            <span className="stat-label">Scraped (24h)</span>
                        </div>
                    </div>
                    <div className="stat-card glass">
                        <div className="stat-icon new"><AlertCircle size={20} /></div>
                        <div className="stat-info">
                            <span className="stat-value">{stats.newEvents}</span>
                            <span className="stat-label">Pending Review</span>
                        </div>
                    </div>
                    <div className="stat-card glass">
                        <div className="stat-icon leads"><Users size={20} /></div>
                        <div className="stat-info">
                            <span className="stat-value">{stats.totalLeads}</span>
                            <span className="stat-label">Total Leads</span>
                        </div>
                    </div>
                    <div className="stat-card glass">
                        <div className="stat-icon imported"><CheckCircle size={20} /></div>
                        <div className="stat-info">
                            <span className="stat-value">{stats.importedEvents}</span>
                            <span className="stat-label">Imported</span>
                        </div>
                    </div>
                </div>

                <header className="dashboard-header">
                    <h2>Event Pipeline</h2>
                    <div className="filter-bar">
                        <div className="search-input">
                            <Search size={18} />
                            <input
                                type="text"
                                placeholder="Search title, venue..."
                                value={filters.search}
                                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                            />
                        </div>
                        <select
                            value={filters.city}
                            onChange={(e) => setFilters({ ...filters, city: e.target.value })}
                            className="filter-select"
                        >
                            <option value="Sydney">Sydney</option>
                            <option value="Melbourne">Melbourne</option>
                        </select>
                        <select
                            value={filters.status}
                            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                            className="filter-select"
                        >
                            <option value="">All Status</option>
                            <option value="new">New</option>
                            <option value="updated">Updated</option>
                            <option value="imported">Imported</option>
                            <option value="inactive">Inactive</option>
                        </select>
                        <div className="date-filters">
                            <input
                                type="date"
                                className="filter-date"
                                value={filters.dateStart}
                                onChange={(e) => setFilters({ ...filters, dateStart: e.target.value })}
                            />
                            <span>to</span>
                            <input
                                type="date"
                                className="filter-date"
                                value={filters.dateEnd}
                                onChange={(e) => setFilters({ ...filters, dateEnd: e.target.value })}
                            />
                        </div>
                    </div>
                </header>

                <div className="table-container glass">
                    <table className="events-table">
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Source</th>
                                <th>Status</th>
                                <th>Actions</th>
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
                                    <td>{event.sourceName}</td>
                                    <td>{getStatusTag(event.status)}</td>
                                    <td>
                                        {event.status !== 'imported' && (
                                            <button className="import-btn" onClick={(e) => { e.stopPropagation(); handleImport(event._id); }}>
                                                <Download size={14} /> Import
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <aside className={`preview-panel glass ${selectedEvent ? 'open' : ''}`}>
                {selectedEvent ? (
                    <div className="preview-content">
                        <button className="close-preview" onClick={() => setSelectedEvent(null)}>
                            <X size={20} />
                        </button>
                        <img src={selectedEvent.imageUrl || '/placeholder.jpg'} alt="" />
                        <h3>{selectedEvent.title}</h3>
                        <div className="preview-meta">
                            <p><strong>URL:</strong> <a href={selectedEvent.originalUrl} target="_blank">{selectedEvent.originalUrl}</a></p>
                            <p><strong>Venue:</strong> {selectedEvent.venueName}</p>
                            <p><strong>Description:</strong> {selectedEvent.description || 'No description available'}</p>
                            {selectedEvent.status === 'imported' && (
                                <div className="import-info">
                                    <p><strong>Imported At:</strong> {new Date(selectedEvent.importedAt).toLocaleString()}</p>
                                    <p><strong>Notes:</strong> {selectedEvent.importNotes}</p>
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="preview-empty">
                        <p>Select an event to see details</p>
                    </div>
                )}
            </aside>

            <style dangerouslySetInnerHTML={{
                __html: `
        .dashboard-layout {
          display: flex;
          gap: 20px;
          height: calc(100vh - 100px);
          padding: 0 20px 20px;
        }
        .dashboard-main {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 20px;
          overflow: hidden;
        }
        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .filter-bar {
          display: flex;
          gap: 15px;
        }
        .search-input {
          display: flex;
          align-items: center;
          gap: 10px;
          background: rgba(255,255,255,0.05);
          border: 1px solid var(--border);
          padding: 0.5rem 1rem;
          border-radius: 8px;
        }
        .search-input input {
          background: none;
          border: none;
          color: white;
          width: 200px;
        }
        .filter-select {
          background: var(--bg-card);
          color: white;
          border: 1px solid var(--border);
          padding: 0.5rem;
          border-radius: 8px;
        }
        .table-container {
          flex: 1;
          overflow-y: auto;
          border-radius: 12px;
        }
        .events-table {
          width: 100%;
          border-collapse: collapse;
        }
        .events-table th, .events-table td {
          padding: 1rem;
          text-align: left;
          border-bottom: 1px solid var(--border);
        }
        .events-table tr { cursor: pointer; transition: background 0.2s; }
        .events-table tr:hover { background: rgba(255,255,255,0.05); }
        .events-table tr.active { background: rgba(99, 102, 241, 0.1); }
        .title-cell { font-weight: 500; }
        
        .tag {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 2px 8px;
          border-radius: 4px;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
        }
        .tag.new { background: #3b82f6; color: white; }
        .tag.updated { background: #f59e0b; color: white; }
        .tag.inactive { background: #6b7280; color: white; }
        .tag.imported { background: #10b981; color: white; }

        .import-btn {
          background: var(--primary);
          color: white;
          padding: 4px 12px;
          border-radius: 4px;
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 0.8rem;
        }

        .date-filters {
          display: flex;
          align-items: center;
          gap: 10px;
          color: var(--text-muted);
          font-size: 0.875rem;
        }
        .filter-date {
          background: var(--bg-card);
          color: white;
          border: 1px solid var(--border);
          padding: 0.4rem;
          border-radius: 8px;
          font-size: 0.8rem;
        }

        .preview-panel {
          width: 400px;
          border-radius: 12px;
          overflow-y: auto;
          position: relative;
        }
        .preview-empty {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100%;
          color: var(--text-muted);
        }
        .preview-content {
          padding: 1.5rem;
        }
        .close-preview {
          position: absolute;
          top: 15px;
          right: 15px;
          background: none;
          color: var(--text-muted);
        }
        .preview-content img {
          width: 100%;
          height: 200px;
          object-fit: cover;
          border-radius: 8px;
          margin-bottom: 1.5rem;
        }
        .preview-meta {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          font-size: 0.9rem;
        }
        .preview-meta a { color: var(--primary); word-break: break-all; }
        .import-info {
          margin-top: 1rem;
          padding: 1rem;
          background: rgba(16, 185, 129, 0.1);
          border-radius: 8px;
          border: 1px solid rgba(16, 185, 129, 0.2);
        }
        .stats-row {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
          margin-bottom: 20px;
        }
        .stat-card {
          padding: 1.5rem;
          display: flex;
          align-items: center;
          gap: 15px;
          border-radius: 16px;
        }
        .stat-icon {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .stat-icon.scraped { background: rgba(99, 102, 241, 0.1); color: #6366f1; }
        .stat-icon.new { background: rgba(245, 158, 11, 0.1); color: #f59e0b; }
        .stat-icon.leads { background: rgba(236, 72, 153, 0.1); color: #ec4899; }
        .stat-icon.imported { background: rgba(16, 185, 129, 0.1); color: #10b981; }
        .stat-info { display: flex; flex-direction: column; }
        .stat-value { font-size: 1.5rem; font-weight: 800; line-height: 1; margin-bottom: 4px; }
        .stat-label { font-size: 0.75rem; color: var(--text-muted); font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }
      `}} />
        </div>
    );
};

export default Dashboard;
