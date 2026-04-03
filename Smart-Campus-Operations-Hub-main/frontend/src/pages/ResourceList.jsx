import React, { useEffect, useMemo, useState } from 'react';
import { Button, Form, Modal, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { authAPI, resourceAPI } from '../services/api';
import { useNotifications } from '../context/NotificationContext';
import BrandLogo from '../components/BrandLogo';

const resourceListStyles = String.raw`
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
  border-right: 1px solid rgba(255, 255, 255, 0.1);
  padding: 14px 12px;
}

.rm-brand {
  height: 66px;
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 600;
  padding: 0 8px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.14);
  margin-bottom: 16px;
}

.rm-nav {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.rm-nav-item {
  border: none;
  background: transparent;
  color: #d7e2ff;
  font-size: 16px;
  text-align: left;
  padding: 11px 14px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.rm-nav-item span {
  width: 26px;
  text-align: center;
  opacity: 0.95;
}

.rm-nav-item-active {
  background: linear-gradient(90deg, #2f5bb3, #315fae);
  color: #fff;
}

.rm-main {
  display: flex;
  flex-direction: column;
}

.rm-topbar {
  min-height: 82px;
  background: #f8f9fc;
  border-bottom: 1px solid #d9dee8;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 30px;
}

.rm-topbar h1 {
  margin: 0;
  font-size: 24px;
  font-weight: 600;
  color: #1d2433;
}

.rm-user-menu {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 16px;
  color: #2b3444;
}

.rm-logout-btn {
  border: 1px solid #d4d9e2;
  border-radius: 6px;
  background: #fff;
  color: #2b3444;
  font-size: 14px;
  padding: 6px 10px;
}

.rm-content {
  padding: 22px 30px;
}

.rm-actions-bar {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 16px;
}

.rm-add-btn.btn.btn-primary {
  background: #2f5cad;
  border-color: #2f5cad;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  padding: 8px 18px;
}

.rm-filter-card {
  background: #fff;
  border: 1px solid #dce2ec;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 18px;
}

.rm-filter-row {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 120px;
  gap: 12px;
}

.rm-search-input,
.rm-select,
.rm-search-btn,
.rm-reset-btn {
  border: 1px solid #ccd3df;
  border-radius: 6px;
  min-height: 44px;
  font-size: 15px;
}

.rm-search-input,
.rm-select {
  padding: 10px 12px;
  background: #fff;
}

.rm-search-btn {
  background: #f5f7fb;
  color: #2a3342;
}

.rm-reset-btn {
  margin-top: 10px;
  min-height: 38px;
  background: #f5f7fb;
  color: #2a3342;
  padding: 0 14px;
}

.rm-table-meta {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 14px;
  margin-bottom: 12px;
  color: #4c586c;
}

.rm-pager {
  display: flex;
  gap: 8px;
}

.rm-pager button {
  min-height: 34px;
  padding: 0 16px;
  border-radius: 6px;
  border: 1px solid #cfd6e1;
  background: #fff;
  color: #2a3342;
}

.rm-pager button:disabled {
  opacity: 0.5;
}

.rm-table-card {
  background: #fff;
  border: 1px solid #dce2ec;
  border-radius: 8px;
  overflow: hidden;
}

.rm-table {
  width: 100%;
  border-collapse: collapse;
}

.rm-table thead {
  background: #f2f4f8;
}

.rm-table th,
.rm-table td {
  padding: 14px 14px;
  border-bottom: 1px solid #e0e6ef;
  font-size: 15px;
  color: #253041;
  vertical-align: middle;
}

.rm-table th {
  font-size: 16px;
  font-weight: 600;
}

.rm-name {
  font-size: 20px;
  font-weight: 500;
  color: #1f2938;
}

.rm-thumb {
  width: 72px;
  height: 72px;
  border-radius: 8px;
  object-fit: cover;
  background: #e9edf4;
}

.rm-thumb-empty {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  color: #66758e;
}

.rm-status-badge {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
}

.rm-status-available {
  background: #d7f3df;
  color: #237d3b;
}

.rm-status-other {
  background: #eceff6;
  color: #55627a;
}

.rm-type-badge {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
}

.rm-type-lab {
  background: #dceeff;
  color: #0e5cab;
}

.rm-type-hall {
  background: #e7e5ff;
  color: #4d3ab0;
}

.rm-type-room {
  background: #e9edf4;
  color: #45556f;
}

.rm-type-equipment {
  background: #fff3d6;
  color: #8b5d05;
}

.rm-action-buttons {
  display: flex;
  gap: 8px;
}

.rm-action-buttons button {
  border: 1px solid #c8d0df;
  border-radius: 6px;
  background: #f3f6fc;
  color: #2a3342;
  font-size: 14px;
  padding: 6px 12px;
}

.rm-action-buttons .rm-view-btn {
  background: #2f5cad;
  border-color: #2f5cad;
  color: #ffffff;
}

.rm-action-buttons .rm-edit-btn {
  background: #f4c542;
  border-color: #e6b72f;
  color: #3d2b00;
}

.rm-action-buttons .rm-delete-btn {
  background: #dc3545;
  border-color: #dc3545;
  color: #ffffff;
}

.rm-empty,
.rm-loading-wrap {
  text-align: center;
  padding: 36px;
  color: #64748b;
}

@media (max-width: 1100px) {
  .rm-page {
    grid-template-columns: 1fr;
  }

  .rm-sidebar {
    display: none;
  }

  .rm-filter-row {
    grid-template-columns: 1fr;
  }

  .rm-topbar h1 {
    font-size: 28px;
  }
}
`;

const ResourceList = () => {
  const navigate = useNavigate();
  const isAdmin = authAPI.isAdmin();
  const profile = authAPI.getProfile();
  const { addNotification } = useNotifications();

  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [pageSize] = useState(10);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteResourceId, setDeleteResourceId] = useState(null);

  const resourceTypes = ['LAB', 'HALL', 'ROOM', 'EQUIPMENT'];
  const resourceStatuses = ['AVAILABLE', 'UNAVAILABLE', 'MAINTENANCE'];

  useEffect(() => {
    fetchResources();
  }, [currentPage, pageSize, searchKeyword, filterType, filterStatus]);

  const fetchResources = async () => {
    setLoading(true);
    try {
      let response;

      if (searchKeyword) {
        response = await resourceAPI.searchResources(searchKeyword, currentPage, pageSize);
      } else if (filterType && filterStatus) {
        response = await resourceAPI.filterByTypeAndCapacity(filterType, 0, currentPage, pageSize);
      } else if (filterType) {
        response = await resourceAPI.filterByType(filterType, currentPage, pageSize);
      } else if (filterStatus) {
        response = await resourceAPI.filterByStatus(filterStatus, currentPage, pageSize);
      } else {
        response = await resourceAPI.getAllResources(currentPage, pageSize);
      }

      const payload = response.data;
      const list = payload.content || payload || [];
      setResources(list);
      setTotalPages(payload.totalPages || 1);
      setTotalElements(payload.totalElements || list.length);
    } catch (error) {
      toast.error('Failed to load resources');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(0);
    setSearchKeyword(searchInput.trim());
  };

  const handleResetFilters = () => {
    setSearchInput('');
    setSearchKeyword('');
    setFilterType('');
    setFilterStatus('');
    setCurrentPage(0);
  };

  const handleAddResource = () => navigate('/resources/add');
  const handleViewResource = (id) => {
    if (!id) {
      toast.error('Invalid resource ID');
      return;
    }
    navigate(`/resources/${id}`);
  };
  const handleEditResource = (id) => {
    if (!id) {
      toast.error('Invalid resource ID');
      return;
    }
    navigate(`/resources/edit/${id}`);
  };

  const handleDeleteClick = (id) => {
    setDeleteResourceId(id);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await resourceAPI.deleteResource(deleteResourceId);
      addNotification('Resource deleted successfully!', 'success');
      setShowDeleteModal(false);
      setDeleteResourceId(null);
      fetchResources();
    } catch (error) {
      toast.error('Failed to delete resource');
      addNotification('Failed to delete resource', 'error');
      console.error(error);
    }
  };

  const handleLogout = () => {
    authAPI.logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const userLabel = useMemo(() => profile?.username || 'Account', [profile]);

  const getResourceImageSrc = (resource) => {
    const value = (resource?.imageUrl || '').trim();
    if (!value) {
      return null;
    }

    if (value.startsWith('data:image') || value.startsWith('http://') || value.startsWith('https://')) {
      return value;
    }

    return `data:image/jpeg;base64,${value}`;
  };

  const from = totalElements === 0 ? 0 : currentPage * pageSize + 1;
  const to = totalElements === 0 ? 0 : Math.min((currentPage + 1) * pageSize, totalElements);

  return (
    <div className="rm-page">
      <style>{resourceListStyles}</style>
      <aside className="rm-sidebar">
        <div className="rm-brand">
          <BrandLogo />
        </div>

        <nav className="rm-nav">
          {isAdmin && (
            <button type="button" className="rm-nav-item" onClick={() => navigate('/dashboard')}>
              <span>⌂</span> Dashboard
            </button>
          )}
          <button type="button" className="rm-nav-item rm-nav-item-active">
            <span>▣</span> Resources
          </button>
          {isAdmin && (
            <button type="button" className="rm-nav-item" onClick={() => navigate('/bookings/admin')}>
              <span>▤</span> Manage Bookings
            </button>
          )}
          <button type="button" className="rm-nav-item" onClick={() => navigate('/bookings/my')}>
            <span>◉</span> My Bookings
          </button>
        </nav>
      </aside>

      <section className="rm-main">
        <header className="rm-topbar">
          <h1>Facilities Resource Management</h1>
          <div className="rm-user-menu">
            <span>{userLabel}</span>
            <button type="button" onClick={handleLogout} className="rm-logout-btn">
              Logout
            </button>
          </div>
        </header>

        <div className="rm-content">
          <div className="rm-actions-bar">
            {isAdmin && (
              <Button className="rm-add-btn" onClick={handleAddResource}>
                + Add Resource
              </Button>
            )}
          </div>

          <div className="rm-filter-card">
            <form className="rm-filter-row" onSubmit={handleSearchSubmit}>
              <input
                className="rm-search-input"
                placeholder="Search by name or location..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />

              <Form.Select
                className="rm-select"
                value={filterType}
                onChange={(e) => {
                  setFilterType(e.target.value);
                  setCurrentPage(0);
                }}
              >
                <option value="">All Types</option>
                {resourceTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </Form.Select>

              <Form.Select
                className="rm-select"
                value={filterStatus}
                onChange={(e) => {
                  setFilterStatus(e.target.value);
                  setCurrentPage(0);
                }}
              >
                <option value="">All Status</option>
                {resourceStatuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </Form.Select>

              <button type="submit" className="rm-search-btn">
                Search
              </button>
            </form>

            <button type="button" className="rm-reset-btn" onClick={handleResetFilters}>
              Reset Filters
            </button>
          </div>

          <div className="rm-table-meta">
            <span>{from}-{to} of {totalElements}</span>
            <div className="rm-pager">
              <button type="button" disabled={currentPage === 0} onClick={() => setCurrentPage((prev) => prev - 1)}>
                Previous
              </button>
              <button
                type="button"
                disabled={currentPage >= totalPages - 1 || totalPages <= 1}
                onClick={() => setCurrentPage((prev) => prev + 1)}
              >
                Next
              </button>
            </div>
          </div>

          <div className="rm-table-card">
            {loading ? (
              <div className="rm-loading-wrap">
                <Spinner animation="border" role="status" />
              </div>
            ) : (
              <table className="rm-table">
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Name</th>
                    <th>Type</th>
                    <th>Capacity</th>
                    <th>Location</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {resources.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="rm-empty">
                        No resources found
                      </td>
                    </tr>
                  ) : (
                    resources.map((resource) => {
                      const resourceId = resource.id || resource._id;
                      const imgSrc = getResourceImageSrc(resource);
                      return (
                        <tr key={resourceId || `${resource.name}-${resource.location}`}>
                          <td>
                            {imgSrc ? (
                              <img className="rm-thumb" src={imgSrc} alt={resource.name} />
                            ) : (
                              <div className="rm-thumb rm-thumb-empty">No Image</div>
                            )}
                          </td>
                          <td className="rm-name">{resource.name}</td>
                          <td>
                            <span
                              className={`rm-type-badge rm-type-${(resource.type || '').toLowerCase()}`}
                            >
                              {resource.type}
                            </span>
                          </td>
                          <td>{resource.capacity}</td>
                          <td>{resource.location}</td>
                          <td>
                            <span
                              className={`rm-status-badge ${
                                resource.status === 'AVAILABLE' ? 'rm-status-available' : 'rm-status-other'
                              }`}
                            >
                              {resource.status}
                            </span>
                          </td>
                          <td>
                            <div className="rm-action-buttons">
                              <button type="button" className="rm-view-btn" onClick={() => handleViewResource(resourceId)}>
                                View
                              </button>
                              {isAdmin && (
                                <>
                                <button type="button" className="rm-edit-btn" onClick={() => handleEditResource(resourceId)}>
                                  Edit
                                </button>
                                <button type="button" className="rm-delete-btn" onClick={() => handleDeleteClick(resourceId)}>
                                  Delete
                                </button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </section>

      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this resource? This action cannot be undone.</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteConfirm}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ResourceList;
