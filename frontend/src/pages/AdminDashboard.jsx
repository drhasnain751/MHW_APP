import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { API_BASE } from '../apiConfig';
import './Dashboard.css'; // Reusing dashboard styles

function AdminDashboard() {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');

  // Protect route
  if (!user || user.role !== 'admin') {
    return <Navigate to="/dashboard" />;
  }

  const fetchStats = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/admin/stats`);
      if (res.ok) {
        setStats(await res.json());
      } else {
        setError('Failed to fetch admin stats');
      }
    } catch (err) {
      setError('Network error loading analytics');
    }
  };


  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="dashboard-layout fadeIn">
      <aside className="dashboard-sidebar">
        <div className="sidebar-profile">
          <div className="avatar" style={{ backgroundColor: '#c62828' }}>
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="profile-info">
            <h4>{user?.name}</h4>
            <span className="role-badge" style={{backgroundColor: '#ffebee', color: '#c62828'}}>{user?.role}</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <button className="nav-item active">Platform Analytics</button>
          <button className="nav-item">Manage Users</button>
          <button className="nav-item">System Settings</button>
        </nav>

        <div className="sidebar-footer">
          <button onClick={logout} className="logout-btn">Log out</button>
        </div>
      </aside>

      <main className="dashboard-main">
        <header className="dashboard-header">
          <h2>Administrator Portal</h2>
          <p>Supervise platform health and engagement metrics.</p>
        </header>

        <div className="dashboard-content">
          {error && <div style={{color: 'red', marginBottom: '1rem'}}>{error}</div>}
          
          {stats ? (
            <div className="overview-grid">
              <div className="stat-card" style={{borderTop: '4px solid #2196f3'}}>
                <h3>Total Authenticated Users</h3>
                <div className="stat-value text-blue">{stats.totalUsers}</div>
              </div>
              <div className="stat-card" style={{borderTop: '4px solid #009688'}}>
                <h3>Verified Therapists</h3>
                <div className="stat-value text-teal">{stats.totalTherapists}</div>
              </div>
              <div className="stat-card" style={{borderTop: '4px solid #ff9800'}}>
                <h3>Total Mood Logs Recorded</h3>
                <div className="stat-value" style={{color: '#ff9800'}}>{stats.totalMoodLogs}</div>
              </div>
              <div className="stat-card" style={{borderTop: '4px solid #9c27b0'}}>
                <h3>Total Therapy Sessions</h3>
                <div className="stat-value" style={{color: '#9c27b0'}}>{stats.totalSessions}</div>
              </div>
              <div className="stat-card" style={{borderTop: '4px solid #4caf50'}}>
                <h3>Completed Sessions</h3>
                <div className="stat-value" style={{color: '#4caf50'}}>{stats.completedSessions}</div>
              </div>
            </div>
          ) : (
            <p>Loading analytics...</p>
          )}

          <div className="feature-section" style={{marginTop: '2rem'}}>
            <h3>Recent System Activity</h3>
            <div style={{backgroundColor: '#fff', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)'}}>
              <p style={{color: '#777'}}>Detailed system logs will appear here in future updates.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default AdminDashboard;
