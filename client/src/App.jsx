import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import axios from 'axios';

axios.defaults.withCredentials = true;
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      console.log('Checking authentication at:', `${API_URL}/auth/me`);
      const res = await axios.get(`${API_URL}/auth/me`);
      console.log('User authenticated:', res.data);
      setUser(res.data);
    } catch (err) {
      console.error('Authentication check failed:', err.response?.status || err.message);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading-screen">Loading...</div>;

  return (
    <Router>
      <div className="app">
        <Navbar user={user} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
          <Route
            path="/dashboard"
            element={user ? <Dashboard user={user} /> : <Navigate to="/login" />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
export { API_URL };
