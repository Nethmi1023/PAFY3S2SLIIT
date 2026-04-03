import React, { useEffect, useState, useCallback } from 'react';
import { Spinner } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { authAPI, bookingAPI, resourceAPI } from '../services/api';
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

/* Two-column layout */
.cb-layout {
  display: grid;
  grid-template-columns: 500px 1fr;
  gap: 24px;
  align-items: start;
}

/* Booking form card */
.cb-card {
  background: #fff; border: 1px solid #dce2ec;
  border-radius: 10px; overflow: hidden;
}
.cb-card-header {
  background: #2f5cad; color: #fff;
  padding: 16px 22px; font-size: 17px; font-weight: 600;
}
.cb-card-body { padding: 24px 22px; }
.cb-resource-info {
  background: #f2f4f8; border-radius: 8px;
  padding: 14px 16px; margin-bottom: 22px;
}
.cb-resource-info strong { font-size: 16px; color: #1d2433; }
.cb-resource-info p { margin: 4px 0 0; font-size: 13px; color: #67758d; }
.cb-form-group { margin-bottom: 18px; }
.cb-label { display:block; font-size:13px; font-weight:600; color:#333; margin-bottom:6px; }
.cb-label .req { color: #dc3545; }
.cb-input {
  width: 100%; padding: 10px 12px;
  border: 1px solid #ccd3df; border-radius: 6px;
  font-size: 14px; background: #fff;
}
.cb-input:focus { outline: none; border-color: #2f5cad; box-shadow: 0 0 0 3px rgba(47,92,173,0.1); }
.cb-actions { display: flex; gap: 12px; margin-top: 8px; }
.cb-submit-btn {
  background: #2f5cad; border: none; border-radius: 8px;
  color: #fff; font-size: 15px; font-weight: 600;
  padding: 10px 24px; cursor: pointer;
}
.cb-submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }
.cb-back-btn {
  background: #fff; border: 1px solid #ccd3df; border-radius: 8px;
  color: #2b3444; font-size: 15px; padding: 10px 20px; cursor: pointer;
}

/* Existing bookings panel */
.cb-bookings-panel {
  background: #fff; border: 1px solid #dce2ec;
  border-radius: 10px; overflow: hidden;
}
.cb-bookings-header {
  padding: 16px 20px;
  border-bottom: 1px solid #e8edf5;
  display: flex; justify-content: space-between; align-items: center;
}
.cb-bookings-header h5 { margin:0; font-size:16px; font-weight:600; color:#1d2433; }
.cb-bookings-count {
  background: #e8edf5; color: #2f5cad;
  font-size: 12px; font-weight: 700;
  padding: 3px 9px; border-radius: 12px;
}
.cb-bk-table { width:100%; border-collapse:collapse; }
.cb-bk-table th, .cb-bk-table td {
  padding: 12px 16px; font-size: 13px;
  border-bottom: 1px solid #eef1f7; color: #253041; vertical-align: middle;
}
.cb-bk-table th { font-weight:600; background:#f7f9fc; font-size:12px; color:#67758d; text-transform:uppercase; }
.cb-bk-table tr:last-child td { border-bottom:none; }
.cb-badge { display:inline-block; padding:3px 9px; border-radius:5px; font-size:12px; font-weight:600; }
.badge-pending  { background:#fff3cd; color:#856404; }
.badge-confirmed{ background:#d7f3df; color:#237d3b; }
.badge-cancelled{ background:#eceff6; color:#55627a; }
.badge-completed{ background:#cff4fc; color:#0c5460; }
.cb-cancel-btn {
  border:1px solid #dc3545; border-radius:5px; background:#fff;
  color:#dc3545; font-size:12px; padding:4px 10px; cursor:pointer;
}
.cb-cancel-btn:hover { background:#dc3545; color:#fff; }
.cb-empty { text-align:center; padding:30px; color:#8a97ab; font-size:14px; }

@media (max-width:1200px) {
  .cb-layout { grid-template-columns: 1fr; }
}
@media (max-width:1100px) {
  .rm-page { grid-template-columns:1fr; }
  .rm-sidebar { display:none; }
}
`;

const badgeClass = (s) => {
  const m = { PENDING:'badge-pending', CONFIRMED:'badge-confirmed', CANCELLED:'badge-cancelled', COMPLETED:'badge-completed' };
  return `cb-badge ${m[s] || ''}`;
};

const CreateBooking = () => {
  const { resourceId } = useParams();
  const navigate = useNavigate();
  const profile = authAPI.getProfile();

  const [resource, setResource] = useState(null);
  const [loadingResource, setLoadingResource] = useState(true);
  const [myBookings, setMyBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ bookingDate: '', startTime: '', endTime: '', purpose: '' });

  // Load resource info
  useEffect(() => {
    resourceAPI.getResourceById(resourceId)
      .then((res) => setResource(res.data))
      .catch(() => toast.error('Resource not found'))
      .finally(() => setLoadingResource(false));
  }, [resourceId]);

  // Load existing bookings for this resource by current user
  const loadBookings = useCallback(async () => {
    setLoadingBookings(true);
    try {
      const res = await bookingAPI.getMyBookings();
      // filter to show bookings for this resource first, then others
      const all = res.data || [];
      const forThis = all.filter((b) => b.resourceId === resourceId);
      const others = all.filter((b) => b.resourceId !== resourceId);
      setMyBookings([...forThis, ...others]);
    } catch {
      // silently fail - bookings list is secondary
    } finally {
      setLoadingBookings(false);
    }
  }, [resourceId]);

  useEffect(() => { loadBookings(); }, [loadBookings]);

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.bookingDate || !form.startTime || !form.endTime) {
      toast.error('Please fill all required fields'); return;
    }
    setSubmitting(true);
    try {
      await bookingAPI.createBooking({ resourceId, ...form });
      toast.success('Booking created successfully');
      setForm({ bookingDate: '', startTime: '', endTime: '', purpose: '' });
      loadBookings(); // refresh list
    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking failed');
    } finally { setSubmitting(false); }
  };

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this booking?')) return;
    try {
      await bookingAPI.cancelBooking(id);
      toast.success('Booking cancelled');
      loadBookings();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Cancel failed');
    }
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
          <h1>Book a Resource</h1>
          <div className="rm-user-menu">
            <span>{profile?.username}</span>
            <button className="rm-logout-btn" onClick={handleLogout}>Logout</button>
          </div>
        </header>

        <div className="rm-content">
          {loadingResource ? (
            <div className="text-center mt-5"><Spinner animation="border" /></div>
          ) : (
            <div className="cb-layout">

              {/* Left - Booking Form */}
              <div className="cb-card">
                <div className="cb-card-header">New Booking</div>
                <div className="cb-card-body">
                  {resource && (
                    <div className="cb-resource-info">
                      <strong>{resource.name}</strong>
                      <p>
                        {resource.location} &nbsp;|&nbsp; Capacity: {resource.capacity}
                        {resource.availableFrom && ` | Available: ${resource.availableFrom} – ${resource.availableTo}`}
                      </p>
                    </div>
                  )}
                  <form onSubmit={handleSubmit}>
                    <div className="cb-form-group">
                      <label className="cb-label">Booking Date <span className="req">*</span></label>
                      <input className="cb-input" type="date" name="bookingDate"
                        value={form.bookingDate} onChange={handleChange}
                        min={new Date().toISOString().split('T')[0]} required />
                    </div>
                    <div className="cb-form-group">
                      <label className="cb-label">Start Time <span className="req">*</span></label>
                      <input className="cb-input" type="time" name="startTime"
                        value={form.startTime} onChange={handleChange} required />
                    </div>
                    <div className="cb-form-group">
                      <label className="cb-label">End Time <span className="req">*</span></label>
                      <input className="cb-input" type="time" name="endTime"
                        value={form.endTime} onChange={handleChange} required />
                    </div>
                    <div className="cb-form-group">
                      <label className="cb-label">Purpose</label>
                      <input className="cb-input" type="text" name="purpose"
                        placeholder="e.g. Lecture, Meeting, Workshop"
                        value={form.purpose} onChange={handleChange} />
                    </div>
                    <div className="cb-actions">
                      <button type="submit" className="cb-submit-btn" disabled={submitting}>
                        {submitting ? <Spinner size="sm" animation="border" /> : 'Confirm Booking'}
                      </button>
                      <button type="button" className="cb-back-btn" onClick={() => navigate(-1)}>Back</button>
                    </div>
                  </form>
                </div>
              </div>

              {/* Right - My Bookings list */}
              <div className="cb-bookings-panel">
                <div className="cb-bookings-header">
                  <h5>My Bookings</h5>
                  <span className="cb-bookings-count">{myBookings.length}</span>
                </div>
                {loadingBookings ? (
                  <div className="cb-empty"><Spinner animation="border" size="sm" /></div>
                ) : myBookings.length === 0 ? (
                  <div className="cb-empty">No bookings yet.</div>
                ) : (
                  <table className="cb-bk-table">
                    <thead>
                      <tr><th>Resource</th><th>Date</th><th>Time</th><th>Status</th><th></th></tr>
                    </thead>
                    <tbody>
                      {myBookings.map((b) => (
                        <tr key={b.id} style={{ background: b.resourceId === resourceId ? '#f0f5ff' : 'transparent' }}>
                          <td>{b.resourceName}</td>
                          <td>{b.bookingDate}</td>
                          <td style={{ whiteSpace: 'nowrap' }}>{b.startTime} – {b.endTime}</td>
                          <td><span className={badgeClass(b.status)}>{b.status}</span></td>
                          <td>
                            {(b.status === 'PENDING' || b.status === 'CONFIRMED') && (
                              <button className="cb-cancel-btn" onClick={() => handleCancel(b.id)}>Cancel</button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>

            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default CreateBooking;
