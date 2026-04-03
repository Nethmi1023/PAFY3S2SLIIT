import React, { useState } from 'react';
import { Badge, Dropdown, DropdownButton, Alert } from 'react-bootstrap';
import { useNotifications } from '../context/NotificationContext';

const notificationPanelStyles = `
.notification-panel {
  display: flex;
  align-items: center;
}

.notification-button {
  position: relative;
}

.notification-button .btn {
  background-color: transparent;
  border: none;
  color: #333;
  font-size: 1.5rem;
  padding: 0.5rem 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.notification-button .btn:hover {
  color: #0d6efd;
}

.notification-badge {
  font-size: 0.7rem;
  margin-left: 0.3rem;
}

.notification-menu {
  min-width: 380px;
  max-height: 500px;
  display: flex;
  flex-direction: column;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.notification-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid #e9ecef;
  background-color: #f8f9fa;
}

.notification-title {
  font-weight: 600;
  color: #333;
  margin: 0;
}

.clear-btn {
  background: none;
  border: none;
  color: #0d6efd;
  cursor: pointer;
  font-size: 0.85rem;
  text-decoration: underline;
  padding: 0;
}

.clear-btn:hover {
  color: #0a58ca;
}

.notification-list {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

.notification-empty {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  color: #6c757d;
  text-align: center;
}

.notification-empty p {
  margin: 0;
  font-size: 0.95rem;
}

.notification-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px 16px;
  border-bottom: 1px solid #e9ecef;
  background-color: white;
  transition: background-color 0.2s;
}

.notification-item:hover {
  background-color: #f8f9fa;
}

.notification-item.notification-success {
  border-left: 3px solid #198754;
}

.notification-item.notification-error {
  border-left: 3px solid #dc3545;
}

.notification-item.notification-warning {
  border-left: 3px solid #ffc107;
}

.notification-item.notification-info {
  border-left: 3px solid #0d6efd;
}

.notification-content {
  flex: 1;
  min-width: 0;
}

.notification-header-item {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
}

.notification-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  font-weight: bold;
  font-size: 0.75rem;
  color: white;
}

.notification-icon.icon-success {
  background-color: #198754;
}

.notification-icon.icon-error {
  background-color: #dc3545;
}

.notification-icon.icon-warning {
  background-color: #ffc107;
  color: #333;
}

.notification-icon.icon-info {
  background-color: #0d6efd;
}

.notification-time {
  font-size: 0.8rem;
  color: #6c757d;
}

.notification-message {
  margin: 0;
  font-size: 0.9rem;
  color: #333;
  word-break: break-word;
}

.notification-close {
  background: none;
  border: none;
  color: #6c757d;
  cursor: pointer;
  font-size: 1rem;
  padding: 0;
  line-height: 1;
  margin-top: 2px;
}

.notification-close:hover {
  color: #333;
}

.notification-list::-webkit-scrollbar {
  width: 6px;
}

.notification-list::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.notification-list::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 3px;
}

.notification-list::-webkit-scrollbar-thumb:hover {
  background: #555;
}
`;

/**
 * Notification Panel Component
 * Displays recent notifications in a dropdown panel
 */
const NotificationPanel = () => {
  const { notifications, removeNotification, clearNotifications } =
    useNotifications();
  const [show, setShow] = useState(false);

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return '✓';
      case 'error':
        return '✕';
      case 'warning':
        return '⚠';
      case 'info':
        return 'ℹ';
      default:
        return '•';
    }
  };

  const getBadgeColor = (type) => {
    switch (type) {
      case 'success':
        return 'success';
      case 'error':
        return 'danger';
      case 'warning':
        return 'warning';
      case 'info':
        return 'info';
      default:
        return 'secondary';
    }
  };

  const formatTime = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);

    if (minutes < 1) return 'just now';
    if (minutes < 60) return `${minutes}m ago`;

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;

    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  return (
    <div className="notification-panel">
      <style>{notificationPanelStyles}</style>
      <DropdownButton
        id="notification-dropdown"
        title={
          <>
            <span>🔔</span>
            {notifications.length > 0 && (
              <Badge bg="danger" className="notification-badge">
                {notifications.length > 9 ? '9+' : notifications.length}
              </Badge>
            )}
          </>
        }
        className="notification-button"
        show={show}
        onToggle={() => setShow(!show)}
      >
        <div className="notification-menu">
          <div className="notification-header">
            <span className="notification-title">Notifications</span>
            {notifications.length > 0 && (
              <button
                onClick={() => {
                  clearNotifications();
                  setShow(false);
                }}
                className="clear-btn"
              >
                Clear All
              </button>
            )}
          </div>

          <div className="notification-list">
            {notifications.length === 0 ? (
              <div className="notification-empty">
                <p>No notifications yet</p>
              </div>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  className={`notification-item notification-${notif.type}`}
                >
                  <div className="notification-content">
                    <div className="notification-header-item">
                      <span className={`notification-icon icon-${notif.type}`}>
                        {getIcon(notif.type)}
                      </span>
                      <span className="notification-time">
                        {formatTime(notif.timestamp)}
                      </span>
                    </div>
                    <p className="notification-message">{notif.message}</p>
                  </div>
                  <button
                    onClick={() => removeNotification(notif.id)}
                    className="notification-close"
                  >
                    ✕
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </DropdownButton>
    </div>
  );
};

export default NotificationPanel;
