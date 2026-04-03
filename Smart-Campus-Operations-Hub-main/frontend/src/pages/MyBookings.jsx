import React, { useEffect, useState } from 'react';
import { Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { authAPI, bookingAPI } from '../services/api';
import BrandLogo from '../components/BrandLogo';

const pageStyles = String.raw`
.rm-page {
  min-height: 100vh; display: grid;
  grid-template-columns: 285px 1fr;
  background: #f2f4f8; color: #101828;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}
.rm-sidebar {
  background: radial-gradient(circle at 10% 0%,#1e376f 0%,#152d5d 30%,#0f2349 60%,#0b1b3b 100%);
  color: #e9efff; border-right: 1px solid rgba(255,255,255,0.1); padding: 14px 12px;
}
.rm-brand {
  height: 66px; display: flex; align-items: center; gap: 10px;
  font-weight: 600; padding: 0 8px;
  border-bottom: 1px solid rgba(255,255,255,0.14); margin-bottom: 16px;
}
.rm-nav { display: flex; flex-direction: column; gap: 6px; }
.rm-nav-item {
  border: none; background: transparent; color: #d7e2ff; font-size: 16px;
  text-align: left; padding: 11px 14px; border-radius: 8px;
  display: flex; align-items: center; gap: 12px; cursor: pointer;
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
.bk-table-card {
  background: #fff; border: 1px solid #dce2ec;
  border-radius: 10px; overflow: hidden;
}
.bk-table { width: 100%; border-collapse: collapse; }
.bk-table th, .bk-table td {
  padding: 14px 16px; font-size: 14px;
  border-bottom: 1px solid #eef1f7; color: #253041; vertical-align: middle;
}
.bk-table th { font-weight: 600; background: #f2f4f8; font-size: 13px; color: #67758d; text-transform: uppercase; }
.bk-table tr:last-child td { border-bottom: none; }
.bk-badge {
  display: inline-block; padding: 4px 10px;
  border-radius: 6px; font-size: 12px; font-weight: 600;
}
.badge-pending { background: #fff3cd; color: #856404; }
.badge-confirmed { background: #d7f3df; color: #237d3b; }
.badge-cancelled { background: #eceff6; color: #55627a; }
.badge-completed { background: #cff4fc; color: #0c5460; }
.bk-cancel-btn {
  border: 1px solid #dc3545; border-radius: 6px; background: #fff;
  color: #dc3545; font-size: 13px; padding: 5px 12px; cursor: pointer;
}
.bk-cancel-btn:hover { background: #dc3545; color: #fff; }
.bk-empty { text-align: center; padding: 40px; color: #8a97ab; }
.bk-book-btn {
  background: #2f5cad; border: none; border-radius: 8px;
  color: #fff; font-size: 15px; font-weight: 600;
  padding: 9px 20px; cursor: pointer; margin-bottom: 20px;
}
@media (max-width: 1100px) {
  .rm-page { grid-template-columns: 1fr; }
  .rm-sidebar { display: none; }
}
`;

const badgeClass = (s) => {
  const m = { PENDING:'badge-pending', CONFIRMED:'badge-confirmed', CANCELLED:'badge-cancelled', COMPLETED:'badge-completed' };
  return `bk-badge ${m[s] || ''}`;
};

const MyBookings = () => {
  const navigate = useNavigate();
  const profile = authAPI.getProfile();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetch = async () => {
    try {
      const res = await bookingAPI.getMyBookings();
      setBookings(res.data);
    } catch { toast.error('Failed to load bookings'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetch(); }, []);

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this booking?')) return;
    try {
      await bookingAPI.cancelBooking(id);
      toast.success('Booking cancelled');
      fetch();
    } catch (err) { toast.error(err.response?.data?.message || 'Cancel failed'); }
  };

  const handleLogout = () => { authAPI.logout(); navigate('/login'); };

  return (
    <div className="rm-page">
      <style>{pageStyles}</style>
      <aside className="rm-sidebar">
        <div className="rm-brand"><BrandLogo /></div>
        <nav className="rm-nav">
          {authAPI.isAdmin() && (
            <button className="rm-nav-item" onClick={() => navigate('/dashboard')}><span>⌂</span> Dashboard</button>
          )}
          <button className="rm-nav-item" onClick={() => navigate('/resources')}><span>▣</span> Resources</button>
          {authAPI.isAdmin() && (
            <button className="rm-nav-item" onClick={() => navigate('/bookings/admin')}><span>▤</span> Manage Bookings</button>
          )}
          <button className="rm-nav-item rm-nav-item-active" onClick={() => navigate('/bookings/my')}><span>◉</span> My Bookings</button>
        </nav>
      </aside>

      <section className="rm-main">
        <header className="rm-topbar">
          <h1>My Bookings</h1>
          <div className="rm-user-menu">
            <span>{profile?.username}</span>
            <button className="rm-logout-btn" onClick={handleLogout}>Logout</button>
          </div>
        </header>

        <div className="rm-content">
          <button className="bk-book-btn" onClick={() => navigate('/resources')}>+ New Booking</button>

          <div className="bk-table-card">
            {loading ? (
              <div className="bk-empty"><Spinner animation="border" /></div>
            ) : bookings.length === 0 ? (
              <div className="bk-empty">No bookings found. Go to Resources to make a booking.</div>
            ) : (
              <table className="bk-table">
                <thead>
                  <tr><th>Resource</th><th>Date</th><th>Time</th><th>Purpose</th><th>Status</th><th>Action</th></tr>
                </thead>
                <tbody>
                  {bookings.map((b) => (
                    <tr key={b.id}>
                      <td>{b.resourceName}</td>
                      <td>{b.bookingDate}</td>
                      <td>{b.startTime} – {b.endTime}</td>
                      <td>{b.purpose || '–'}</td>
                      <td><span className={badgeClass(b.status)}>{b.status}</span></td>
                      <td>
                        {(b.status === 'PENDING' || b.status === 'CONFIRMED') && (
                          <button className="bk-cancel-btn" onClick={() => handleCancel(b.id)}>Cancel</button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default MyBookings;
