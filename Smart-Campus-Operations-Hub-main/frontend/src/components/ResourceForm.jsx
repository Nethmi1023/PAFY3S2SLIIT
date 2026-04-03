import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Form, Button, Spinner, Alert } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { authAPI, resourceAPI } from '../services/api';
import { validateResource } from '../utils/helpers';
import { useNotifications } from '../context/NotificationContext';
import BrandLogo from './BrandLogo';

const resourceFormStyles = String.raw`
.rf-page {
  min-height: 100vh;
  display: grid;
  grid-template-columns: 285px 1fr;
  background: #f2f4f8;
  color: #101828;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.rf-page-loading {
  grid-template-columns: 1fr;
  place-items: center;
}

.rf-sidebar {
  background: radial-gradient(circle at 10% 0%, #1e376f 0%, #152d5d 30%, #0f2349 60%, #0b1b3b 100%);
  color: #e9efff;
  border-right: 1px solid rgba(255, 255, 255, 0.1);
  padding: 14px 12px;
}

.rf-brand {
  height: 66px;
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 600;
  padding: 0 8px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.14);
  margin-bottom: 16px;
}

.rf-nav {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.rf-nav-item {
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

.rf-nav-item span {
  width: 26px;
  text-align: center;
  opacity: 0.95;
}

.rf-nav-item-active {
  background: linear-gradient(90deg, #2f5bb3, #315fae);
  color: #fff;
}

.rf-main {
  display: flex;
  flex-direction: column;
}

.rf-topbar {
  min-height: 82px;
  background: #f8f9fc;
  border-bottom: 1px solid #d9dee8;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 30px;
}

.rf-topbar h1 {
  margin: 0;
  font-size: 24px;
  font-weight: 600;
  color: #1d2433;
}

.rf-user-menu {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 16px;
  color: #2b3444;
}

.rf-logout-btn {
  border: 1px solid #d4d9e2;
  border-radius: 6px;
  background: #fff;
  color: #2b3444;
  font-size: 14px;
  padding: 6px 10px;
}

.rf-content {
  padding: 22px 30px 30px;
}

.rf-page-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
}

.rf-page-title-meta {
  color: #5b667a;
  font-size: 14px;
}

.rf-shell {
  display: grid;
  grid-template-columns: 1.5fr 0.8fr;
  gap: 18px;
}

.rf-form-panel,
.rf-preview-card {
  background: #fff;
  border: 1px solid #dce2ec;
  border-radius: 10px;
  box-shadow: 0 8px 18px rgba(16, 24, 40, 0.04);
}

.rf-form-panel {
  padding: 22px;
}

.rf-grid-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}

.rf-field {
  margin-bottom: 16px;
}

.rf-field label {
  font-weight: 600;
  color: #2b3444;
  margin-bottom: 6px;
}

.rf-field .form-control,
.rf-field .form-select {
  border-color: #ccd3df;
  min-height: 44px;
  border-radius: 8px;
}

.rf-field textarea.form-control {
  min-height: 110px;
}

.rf-days {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 18px;
  padding-top: 4px;
}

.rf-day-item {
  margin-right: 0;
}

.rf-actions {
  display: flex;
  gap: 10px;
  margin-top: 22px;
}

.rf-submit-btn.btn.btn-primary {
  background: #2f5cad;
  border-color: #2f5cad;
  border-radius: 8px;
  padding: 10px 18px;
  font-weight: 600;
}

.rf-preview-panel {
  align-self: start;
}

.rf-preview-card {
  overflow: hidden;
}

.rf-preview-label {
  padding: 14px 18px;
  border-bottom: 1px solid #e6ebf2;
  background: #f8f9fc;
  color: #1d2433;
  font-weight: 600;
}

.rf-preview-image-wrap {
  min-height: 220px;
  background: #eef3fa;
}

.rf-preview-image {
  width: 100%;
  height: 100%;
  min-height: 220px;
  object-fit: cover;
  display: block;
}

.rf-preview-empty {
  min-height: 220px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #68778f;
  font-weight: 600;
}

.rf-preview-meta {
  padding: 16px 18px 18px;
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
}

.rf-preview-meta div {
  display: flex;
  flex-direction: column;
  gap: 4px;
  background: #f7f9fc;
  border: 1px solid #e1e7f1;
  border-radius: 8px;
  padding: 10px 12px;
}

.rf-preview-meta span {
  font-size: 12px;
  color: #67758d;
}

.rf-preview-meta strong {
  font-size: 15px;
  color: #223046;
}

@media (max-width: 1100px) {
  .rf-page {
    grid-template-columns: 1fr;
  }

  .rf-sidebar {
    display: none;
  }

  .rf-shell {
    grid-template-columns: 1fr;
  }

  .rf-topbar h1 {
    font-size: 28px;
  }

  .rf-grid-2 {
    grid-template-columns: 1fr;
  }

  .rf-page-actions {
    flex-direction: column;
    align-items: flex-start;
  }
}
`;

const ResourceForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;
  const { addNotification } = useNotifications();
  const profile = authAPI.getProfile();

  const [loading, setLoading] = useState(isEditMode);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [imageError, setImageError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    category: '',
    description: '',
    capacity: '',
    location: '',
    availableFrom: '',
    availableTo: '',
    availableDays: [],
    status: 'AVAILABLE',
    imageUrl: '',
  });

  const resourceTypes = ['LAB', 'HALL', 'ROOM', 'EQUIPMENT'];
  const resourceStatuses = ['AVAILABLE', 'UNAVAILABLE', 'MAINTENANCE'];
  const daysOfWeek = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];
  const maxImageSizeBytes = 2 * 1024 * 1024;

  useEffect(() => {
    if (!isEditMode) {
      setLoading(false);
      return;
    }

    const loadResource = async () => {
      try {
        const response = await resourceAPI.getResourceById(id);
        const resource = response.data;
        setFormData({
          name: resource.name || '',
          type: resource.type || '',
          category: resource.category || '',
          description: resource.description || '',
          capacity: resource.capacity || '',
          location: resource.location || '',
          availableFrom: resource.availableFrom || '',
          availableTo: resource.availableTo || '',
          availableDays: resource.availableDays || [],
          status: resource.status || 'AVAILABLE',
          imageUrl: resource.imageUrl || '',
        });
      } catch (error) {
        toast.error('Failed to load resource');
        navigate('/resources');
      } finally {
        setLoading(false);
      }
    };

    loadResource();
  }, [id, isEditMode, navigate]);

  const handleLogout = () => {
    authAPI.logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleDayChange = (day) => {
    setFormData((prev) => ({
      ...prev,
      availableDays: prev.availableDays.includes(day)
        ? prev.availableDays.filter((item) => item !== day)
        : [...prev.availableDays, day],
    }));
  };

  const handleImageSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setImageError('Please select a valid image file');
      return;
    }

    if (file.size > maxImageSizeBytes) {
      setImageError('Image must be 2MB or smaller');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setFormData((prev) => ({
        ...prev,
        imageUrl: reader.result,
      }));
      setImageError('');
    };
    reader.onerror = () => setImageError('Failed to read image file');
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setFormData((prev) => ({
      ...prev,
      imageUrl: '',
    }));
    setImageError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateResource(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error('Please fix the validation errors');
      addNotification('Validation errors found', 'warning');
      return;
    }

    setSubmitting(true);
    try {
      if (isEditMode) {
        await resourceAPI.updateResource(id, formData);
        toast.success('Resource updated successfully!');
        addNotification('Resource updated successfully!', 'success');
      } else {
        await resourceAPI.createResource(formData);
        toast.success('Resource created successfully!');
        addNotification('Resource created successfully!', 'success');
      }
      navigate('/resources');
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Failed to save resource';
      toast.error(errorMsg);
      addNotification(errorMsg, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const imagePreview = formData.imageUrl || '';

  if (loading) {
    return (
      <div className="rf-page rf-page-loading">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  return (
    <div className="rf-page">
      <style>{resourceFormStyles}</style>
      <aside className="rf-sidebar">
        <div className="rf-brand">
          <BrandLogo />
        </div>

        <nav className="rf-nav">
          <button type="button" className="rf-nav-item" onClick={() => navigate('/resources')}>
            <span>⌂</span> Dashboard
          </button>
          <button type="button" className="rf-nav-item rf-nav-item-active" onClick={() => navigate('/resources')}>
            <span>▣</span> Resources
          </button>
          <button type="button" className="rf-nav-item">
            <span>▤</span> Bookings
          </button>
          <button type="button" className="rf-nav-item">
            <span>◌</span> Issues
          </button>
          <button type="button" className="rf-nav-item">
            <span>◉</span> Users
          </button>
        </nav>
      </aside>

      <section className="rf-main">
        <header className="rf-topbar">
          <h1>{isEditMode ? 'Edit Resource' : 'Add Resource'}</h1>
          <div className="rf-user-menu">
            <span>{profile?.username || 'Account'}</span>
            <button type="button" onClick={handleLogout} className="rf-logout-btn">
              Logout
            </button>
          </div>
        </header>

        <div className="rf-content">
          <div className="rf-page-actions">
            <Button variant="secondary" onClick={() => navigate('/resources')}>
              Back to Resources
            </Button>
            <div className="rf-page-title-meta">
              {isEditMode ? 'Update an existing resource' : 'Create a new university resource'}
            </div>
          </div>

          <div className="rf-shell">
            <div className="rf-form-panel">
              <Form onSubmit={handleSubmit}>
                <div className="rf-grid-2">
                  <Form.Group className="rf-field">
                    <Form.Label>Resource Name *</Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      isInvalid={!!errors.name}
                      placeholder="Enter resource name"
                    />
                    <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="rf-field">
                    <Form.Label>Type *</Form.Label>
                    <Form.Select
                      name="type"
                      value={formData.type}
                      onChange={handleChange}
                      isInvalid={!!errors.type}
                    >
                      <option value="">Select Type</option>
                      {resourceTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">{errors.type}</Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="rf-field">
                    <Form.Label>Capacity *</Form.Label>
                    <Form.Control
                      type="number"
                      name="capacity"
                      value={formData.capacity}
                      onChange={handleChange}
                      isInvalid={!!errors.capacity}
                      placeholder="Enter capacity"
                    />
                    <Form.Control.Feedback type="invalid">{errors.capacity}</Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="rf-field">
                    <Form.Label>Status</Form.Label>
                    <Form.Select name="status" value={formData.status} onChange={handleChange}>
                      {resourceStatuses.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </div>

                <div className="rf-grid-2">
                  <Form.Group className="rf-field">
                    <Form.Label>Category</Form.Label>
                    <Form.Control
                      type="text"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      placeholder="Enter category"
                    />
                  </Form.Group>

                  <Form.Group className="rf-field">
                    <Form.Label>Location</Form.Label>
                    <Form.Control
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      placeholder="Enter location (e.g., Building A, Floor 2)"
                    />
                  </Form.Group>
                </div>

                <Form.Group className="rf-field">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Enter resource description"
                  />
                </Form.Group>

                <div className="rf-grid-2">
                  <Form.Group className="rf-field">
                    <Form.Label>Available From (HH:mm)</Form.Label>
                    <Form.Control
                      type="time"
                      name="availableFrom"
                      value={formData.availableFrom}
                      onChange={handleChange}
                    />
                  </Form.Group>

                  <Form.Group className="rf-field">
                    <Form.Label>Available To (HH:mm)</Form.Label>
                    <Form.Control
                      type="time"
                      name="availableTo"
                      value={formData.availableTo}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </div>

                <Form.Group className="rf-field">
                  <Form.Label>Available Days</Form.Label>
                  <div className="rf-days">
                    {daysOfWeek.map((day) => (
                      <Form.Check
                        key={day}
                        inline
                        type="checkbox"
                        id={`day-${day}`}
                        label={day}
                        checked={formData.availableDays.includes(day)}
                        onChange={() => handleDayChange(day)}
                        className="rf-day-item"
                      />
                    ))}
                  </div>
                </Form.Group>

                <Form.Group className="rf-field">
                  <Form.Label>Image</Form.Label>
                  <Form.Control type="file" accept="image/*" onChange={handleImageSelect} />
                  <Form.Text className="text-muted">Select an image from your device (max 2MB).</Form.Text>
                  {imageError && (
                    <Alert variant="danger" className="mt-2 mb-0 py-2">
                      {imageError}
                    </Alert>
                  )}
                </Form.Group>

                <div className="rf-actions">
                  <Button variant="primary" type="submit" disabled={submitting} className="rf-submit-btn">
                    {submitting ? (
                      <>
                        <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />
                        Saving...
                      </>
                    ) : isEditMode ? (
                      'Update Resource'
                    ) : (
                      'Create Resource'
                    )}
                  </Button>
                  <Button variant="secondary" onClick={() => navigate('/resources')} disabled={submitting}>
                    Cancel
                  </Button>
                </div>
              </Form>
            </div>

            <div className="rf-preview-panel">
              <div className="rf-preview-card">
                <div className="rf-preview-label">Preview</div>
                <div className="rf-preview-image-wrap">
                  {imagePreview ? (
                    <img src={imagePreview} alt="Resource preview" className="rf-preview-image" />
                  ) : (
                    <div className="rf-preview-empty">No Image Selected</div>
                  )}
                </div>
                <div className="rf-preview-meta">
                  <div>
                    <span>Name</span>
                    <strong>{formData.name || 'Resource name'}</strong>
                  </div>
                  <div>
                    <span>Type</span>
                    <strong>{formData.type || 'Select type'}</strong>
                  </div>
                  <div>
                    <span>Status</span>
                    <strong>{formData.status}</strong>
                  </div>
                  <div>
                    <span>Location</span>
                    <strong>{formData.location || 'Location'}</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ResourceForm;
