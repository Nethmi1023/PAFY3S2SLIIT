import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Spinner } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { authAPI, resourceAPI, bookingAPI } from '../services/api';
import BrandLogo from '../components/BrandLogo';

const dashStyles = String.raw`
.rm-page {
  min-height: 100vh;
  display: grid;
  grid-template-columns: 285px 1fr;
  background: #f2f4f8;
  color: #101828;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}
.rm-sidebar {
  background: radial-gradient(circle at 10% 0%, #1e376f 0%, #152d5d 30%, #0f2349 60%, #0b1b3b 100%);
  color: #e9efff;
  border-right: 1px solid rgba(255,255,255,0.1);
  padding: 14px 12px;
}
.rm-brand {
  height: 66px;
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 600;
  padding: 0 8px;
  border-bottom: 1px solid rgba(255,255,255,0.14);
  margin-bottom: 16px;
}
.rm-nav { display: flex; flex-direction: column; gap: 6px; }
.rm-nav-item {
  border: none; background: transparent; color: #d7e2ff;
  font-size: 16px; text-align: left; padding: 11px 14px;
  border-radius: 8px; display: flex; align-items: center; gap: 12px; cursor: pointer;
}
.rm-nav-item span { width: 26px; text-align: center; opacity: 0.95; }
.rm-nav-item-active { background: linear-gradient(90deg,#2f5bb3,#315fae); color:#fff; }
.rm-main { display: flex; flex-direction: column; }
.rm-topbar {
  min-height: 82px; background: #f8f9fc;
  border-bottom: 1px solid #d9dee8;
  display: flex; align-items: center; justify-content: space-between; padding: 0 30px;
}
.rm-topbar h1 { margin:0; font-size:24px; font-weight:600; color:#1d2433; }
.rm-user-menu { display:flex; align-items:center; gap:12px; font-size:16px; color:#2b3444; }
.rm-logout-btn {
  border:1px solid #d4d9e2; border-radius:6px; background:#fff;
  color:#2b3444; font-size:14px; padding:6px 10px; cursor:pointer;
}
.rm-content { padding: 22px 30px; }
.dash-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 18px;
  margin-bottom: 28px;
}
.dash-stat-card {
  background: #fff;
  border: 1px solid #dce2ec;
  border-radius: 10px;
  padding: 22px 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.dash-stat-label { font-size: 13px; color: #67758d; font-weight: 500; }
.dash-stat-value { font-size: 32px; font-weight: 700; color: #1d2433; }
.dash-stat-sub { font-size: 12px; color: #8a97ab; }
.dash-stat-card.blue .dash-stat-value { color: #2f5cad; }
.dash-stat-card.green .dash-stat-value { color: #237d3b; }
.dash-stat-card.orange .dash-stat-value { color: #b85c00; }
.dash-stat-card.purple .dash-stat-value { color: #4d3ab0; }
.dash-bottom { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
.dash-section {
  background: #fff;
  border: 1px solid #dce2ec;
  border-radius: 10px;
  overflow: hidden;
}
.dash-section-header {
  padding: 16px 20px;
  border-bottom: 1px solid #e8edf5;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.dash-section-header h5 { margin: 0; font-size: 16px; font-weight: 600; color: #1d2433; }
.dash-view-all {
  font-size: 13px; color: #2f5cad; background: none;
  border: none; cursor: pointer; font-weight: 500;
}
.dash-table { width: 100%; border-collapse: collapse; }
.dash-table th, .dash-table td {
  padding: 12px 16px; font-size: 14px;
  border-bottom: 1px solid #eef1f7; color: #253041;
}
.dash-table th { font-weight: 600; background: #f7f9fc; color: #67758d; font-size: 12px; text-transform: uppercase; }
.dash-table tr:last-child td { border-bottom: none; }
.dash-badge {
  display: inline-block; padding: 3px 9px;
  border-radius: 5px; font-size: 12px; font-weight: 600;
}
.badge-pending { background: #fff3cd; color: #856404; }
.badge-confirmed { background: #d7f3df; color: #237d3b; }
.badge-cancelled { background: #eceff6; color: #55627a; }
.badge-completed { background: #cff4fc; color: #0c5460; }
.badge-available { background: #d7f3df; color: #237d3b; }
.badge-unavailable { background: #eceff6; color: #55627a; }
.badge-maintenance { background: #fff3cd; color: #856404; }
.dash-empty { text-align: center; padding: 24px; color: #8a97ab; font-size: 14px; }
@media (max-width: 1100px) {
  .rm-page { grid-template-columns: 1fr; }
  .rm-sidebar { display: none; }
  .dash-stats { grid-template-columns: 1fr 1fr; }
  .dash-bottom { grid-template-columns: 1fr; }
}
`;

const AdminDashboard = () => {
  const navigate = useNavigate();
  const profile = authAPI.getProfile();
  const [stats, setStats] = useState({ total: 0, available: 0, pending: 0, confirmed: 0 });
  const [recentBookings, setRecentBookings] = useState([]);
  const [recentResources, setRecentResources] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [resRes, bookRes] = await Promise.all([
          resourceAPI.getAllResources(0, 100),
          bookingAPI.getAllBookings(),
        ]);
        const resources = resRes.data.content || [];
        const bookings = bookRes.data || [];
        setStats({
          total: resources.length,
          available: resources.filter((r) => r.status === 'AVAILABLE').length,
          pending: bookings.filter((b) => b.status === 'PENDING').length,
          confirmed: bookings.filter((b) => b.status === 'CONFIRMED').length,
        });
        setRecentBookings(bookings.slice(0, 5));
        setRecentResources(resources.slice(0, 5));
      } catch {
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleLogout = () => {
    authAPI.logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const badgeClass = (status) => {
    const map = {
      PENDING: 'badge-pending', CONFIRMED: 'badge-confirmed',
      CANCELLED: 'badge-cancelled', COMPLETED: 'badge-completed',
      AVAILABLE: 'badge-available', UNAVAILABLE: 'badge-unavailable',
      MAINTENANCE: 'badge-maintenance',
    };
    return `dash-badge ${map[status] || ''}`;
  };

  return (
    <div className="rm-page">
      <style>{dashStyles}</style>
      <aside className="rm-sidebar">
        <div className="rm-brand"><BrandLogo /></div>
        <nav className="rm-nav">
          <button className="rm-nav-item rm-nav-item-active" onClick={() => navigate('/dashboard')}>
            <span>⌂</span> Dashboard
          </button>
          <button className="rm-nav-item" onClick={() => navigate('/resources')}>
            <span>▣</span> Resources
          </button>
          <button className="rm-nav-item" onClick={() => navigate('/bookings/admin')}>
            <span>▤</span> Bookings
          </button>
          <button className="rm-nav-item" onClick={() => navigate('/bookings/my')}>
            <span>◉</span> My Bookings
          </button>
        </nav>
      </aside>

      <section className="rm-main">
        <header className="rm-topbar">
          <h1>Admin Dashboard</h1>
          <div className="rm-user-menu">
            <span>{profile?.username || 'Admin'}</span>
            <button className="rm-logout-btn" onClick={handleLogout}>Logout</button>
          </div>
        </header>

        <div className="rm-content">
          {loading ? (
            <div className="text-center mt-5"><Spinner animation="border" /></div>
          ) : (
            <>
              <div className="dash-stats">
                <div className="dash-stat-card blue">
                  <span className="dash-stat-label">Total Resources</span>
                  <span className="dash-stat-value">{stats.total}</span>
                  <span className="dash-stat-sub">All registered resources</span>
                </div>
                <div className="dash-stat-card green">
                  <span className="dash-stat-label">Available</span>
                  <span className="dash-stat-value">{stats.available}</span>
                  <span className="dash-stat-sub">Ready to book</span>
                </div>
                <div className="dash-stat-card orange">
                  <span className="dash-stat-label">Pending Bookings</span>
                  <span className="dash-stat-value">{stats.pending}</span>
                  <span className="dash-stat-sub">Awaiting confirmation</span>
                </div>
                <div className="dash-stat-card purple">
                  <span className="dash-stat-label">Confirmed Bookings</span>
                  <span className="dash-stat-value">{stats.confirmed}</span>
                  <span className="dash-stat-sub">Active bookings</span>
                </div>
              </div>

              <div className="dash-bottom">
                <div className="dash-section">
                  <div className="dash-section-header">
                    <h5>Recent Bookings</h5>
                    <button className="dash-view-all" onClick={() => navigate('/bookings/admin')}>View All</button>
                  </div>
                  {recentBookings.length === 0 ? (
                    <div className="dash-empty">No bookings yet</div>
                  ) : (
                    <table className="dash-table">
                      <thead>
                        <tr><th>User</th><th>Resource</th><th>Date</th><th>Status</th></tr>
                      </thead>
                      <tbody>
                        {recentBookings.map((b) => (
                          <tr key={b.id}>
                            <td>{b.bookedBy}</td>
                            <td>{b.resourceName}</td>
                            <td>{b.bookingDate}</td>
                            <td><span className={badgeClass(b.status)}>{b.status}</span></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>

                <div className="dash-section">
                  <div className="dash-section-header">
                    <h5>Resources Overview</h5>
                    <button className="dash-view-all" onClick={() => navigate('/resources')}>View All</button>
                  </div>
                  {recentResources.length === 0 ? (
                    <div className="dash-empty">No resources yet</div>
                  ) : (
                    <table className="dash-table">
                      <thead>
                        <tr><th>Name</th><th>Type</th><th>Capacity</th><th>Status</th></tr>
                      </thead>
                      <tbody>
                        {recentResources.map((r) => (
                          <tr key={r.id} style={{ cursor: 'pointer' }} onClick={() => navigate(`/resources/${r.id}`)}>
                            <td>{r.name}</td>
                            <td>{r.type}</td>
                            <td>{r.capacity}</td>
                            <td><span className={badgeClass(r.status)}>{r.status}</span></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;
