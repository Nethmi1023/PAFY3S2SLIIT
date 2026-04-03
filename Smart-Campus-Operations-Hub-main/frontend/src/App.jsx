import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import Header from './components/Header';
import Login from './pages/Login';
import Register from './pages/Register';
import ResourceList from './pages/ResourceList';
import ResourceForm from './components/ResourceForm';
import ResourceDetails from './pages/ResourceDetails';
import MyBookings from './pages/MyBookings';
import AdminBookings from './pages/AdminBookings';
import CreateBooking from './pages/CreateBooking';
import AdminDashboard from './pages/AdminDashboard';
import { authAPI } from './services/api';
import { NotificationProvider } from './context/NotificationContext';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  if (!authAPI.isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && !authAPI.isAdmin()) {
    return <Navigate to="/resources" replace />;
  }

  return children;
};

/**
 * Main App Component - Routes and Layout
 */
function App() {
  const AppContent = () => {
    const location = useLocation();
    const hideHeader = location.pathname.startsWith('/resources') ||
      location.pathname.startsWith('/bookings') ||
      location.pathname.startsWith('/dashboard');

    return (
      <div className="d-flex flex-column min-vh-100">
        {!hideHeader && <Header />}
        <main className="flex-grow-1">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/resources" element={<ProtectedRoute><ResourceList /></ProtectedRoute>} />
            <Route path="/resources/add" element={<ProtectedRoute adminOnly><ResourceForm /></ProtectedRoute>} />
            <Route path="/resources/edit/:id" element={<ProtectedRoute adminOnly><ResourceForm /></ProtectedRoute>} />
            <Route path="/resources/:id" element={<ProtectedRoute><ResourceDetails /></ProtectedRoute>} />
            <Route path="/bookings/create/:resourceId" element={<ProtectedRoute><CreateBooking /></ProtectedRoute>} />
            <Route path="/bookings/my" element={<ProtectedRoute><MyBookings /></ProtectedRoute>} />
            <Route path="/bookings/admin" element={<ProtectedRoute adminOnly><AdminBookings /></ProtectedRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />
            <Route path="/" element={<Navigate to="/resources" replace />} />
            <Route path="*" element={<Navigate to="/resources" replace />} />
          </Routes>
        </main>
      </div>
    );
  };

  return (
    <NotificationProvider>
      <Router>
        <AppContent />
        <ToastContainer
          position="bottom-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </Router>
    </NotificationProvider>
  );
}

export default App;
