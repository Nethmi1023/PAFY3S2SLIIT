import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { authAPI } from '../services/api';

const registerStyles = String.raw`
* {
  box-sizing: border-box;
}

.auth-container {
  position: relative;
  width: 100%;
  min-height: 100vh;
  background: #f5f7fa;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  overflow: hidden;
}

.auth-wrapper {
  display: flex;
  width: 100%;
  min-height: 100vh;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
}

.auth-left {
  flex: 1;
  background: linear-gradient(135deg, #0052cc 0%, #0066ff 50%, #0080ff 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 40px;
  position: relative;
  overflow: hidden;
  color: white;
}

.auth-left-content {
  position: relative;
  z-index: 2;
  max-width: 400px;
  text-align: center;
  animation: fadeInUp 0.8s ease-out;
}

.auth-logo {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-bottom: 40px;
}

.logo-circle {
  width: 50px;
  height: 50px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  border: 2px solid rgba(255, 255, 255, 0.3);
}

.logo-text {
  font-size: 18px;
  font-weight: 700;
  letter-spacing: 1px;
}

.auth-welcome {
  margin-bottom: 40px;
}

.welcome-title {
  font-size: 48px;
  font-weight: 700;
  line-height: 1.2;
  margin: 0 0 20px 0;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.welcome-description {
  font-size: 16px;
  line-height: 1.6;
  opacity: 0.95;
  margin: 0;
}

.demo-box {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  padding: 16px 20px;
  margin: 30px 0;
}

.demo-label {
  font-size: 12px;
  opacity: 0.8;
  margin: 0 0 8px 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.demo-cred {
  font-size: 14px;
  margin: 0;
  font-weight: 600;
}

.view-more-btn {
  background: rgba(255, 255, 255, 0.2);
  border: 2px solid rgba(255, 255, 255, 0.5);
  color: white;
  padding: 12px 30px;
  border-radius: 25px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.view-more-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  border-color: rgba(255, 255, 255, 0.8);
  transform: translateY(-2px);
}

.shapes {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  pointer-events: none;
  z-index: 1;
}

.shape {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
}

.shape1 {
  width: 150px;
  height: 150px;
  top: 10%;
  right: 10%;
  animation: float 6s ease-in-out infinite;
}

.shape2 {
  width: 200px;
  height: 200px;
  bottom: 20%;
  left: 5%;
  animation: float 8s ease-in-out infinite reverse;
}

.shape3 {
  width: 100px;
  height: 100px;
  top: 50%;
  left: 20%;
  animation: float 7s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(20px); }
}

.auth-right {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
  background: white;
  animation: fadeInRight 0.8s ease-out;
}

.auth-card {
  width: 100%;
  max-width: 380px;
}

.auth-error {
  background-color: #fee;
  border-left: 4px solid #dc3545;
  padding: 12px 15px;
  border-radius: 8px;
  margin-bottom: 20px;
  color: #721c24;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 10px;
  animation: slideDown 0.3s ease-out;
}

.error-icon {
  font-weight: bold;
  font-size: 16px;
}

.form-title {
  font-size: 28px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 30px 0;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 25px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-label {
  font-size: 13px;
  font-weight: 600;
  color: #333;
}

.form-input {
  padding: 12px 15px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 14px;
  color: #333;
  transition: all 0.3s ease;
  background: #fafafa;
}

.form-input::placeholder {
  color: #999;
}

.form-input:focus {
  outline: none;
  border-color: #0066ff;
  background: white;
  box-shadow: 0 0 0 3px rgba(0, 102, 255, 0.1);
}

.register-button {
  background: linear-gradient(135deg, #0066ff 0%, #0052cc 100%);
  color: white;
  border: none;
  padding: 14px 20px;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 10px;
}

.register-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 102, 255, 0.3);
}

.register-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.button-spinner {
  display: inline-block;
  width: 14px;
  height: 14px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

.signin-section {
  text-align: center;
  padding-top: 20px;
  border-top: 1px solid #e0e0e0;
}

.signin-text {
  font-size: 14px;
  color: #666;
  margin: 0 0 12px 0;
}

.signin-button {
  display: inline-block;
  background: linear-gradient(135deg, #0066ff 0%, #0052cc 100%);
  color: white;
  padding: 12px 30px;
  border-radius: 8px;
  text-decoration: none;
  font-size: 15px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.signin-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 102, 255, 0.3);
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes fadeInRight {
  from { opacity: 0; transform: translateX(30px); }
  to { opacity: 1; transform: translateX(0); }
}

@keyframes slideDown {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@media (max-width: 768px) {
  .auth-wrapper {
    flex-direction: column;
  }

  .auth-left {
    display: none;
  }

  .auth-right {
    min-height: 100vh;
    padding: 40px 20px;
  }

  .auth-card {
    max-width: 100%;
  }

  .form-title {
    font-size: 24px;
  }

  .form-input {
    font-size: 16px;
  }
}

@media (max-width: 480px) {
  .auth-right {
    padding: 30px 20px;
    justify-content: flex-start;
    padding-top: 60px;
  }

  .form-title {
    font-size: 22px;
  }

  .register-button,
  .signin-button {
    padding: 12px 15px;
    font-size: 14px;
  }
}
`;

/**
 * Modern Register Page - Split layout matching Login design
 */
const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const email = formData.username.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email || !formData.password || !formData.confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address (e.g., faslur@example.com)');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      await authAPI.register(email, formData.password);
      toast.success('Registration successful! You can now log in.');
      navigate('/login');
    } catch (err) {
      if (!err.response) {
        setError('Cannot connect to backend. Make sure API is running.');
      } else if (err.response.status === 409) {
        setError('User already exists');
      } else {
        setError('Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <style>{registerStyles}</style>
      <div className="auth-wrapper">
        <div className="auth-left">
          <div className="auth-left-content">
            <div className="auth-logo">
              <div className="logo-circle">🏛️</div>
              <span className="logo-text">FACILITIES</span>
            </div>

            <div className="auth-welcome">
              <h1 className="welcome-title">Join our<br />community!</h1>
              <p className="welcome-description">
                Create an account to access and manage university facilities and resources
              </p>
            </div>

            <div className="demo-box">
              <p className="demo-label">Why Join?</p>
              <p className="demo-cred">
                Manage resources, book facilities, and collaborate with your team
              </p>
            </div>

            <button className="view-more-btn">Learn More</button>
          </div>

          <div className="shapes">
            <div className="shape shape1"></div>
            <div className="shape shape2"></div>
            <div className="shape shape3"></div>
          </div>
        </div>

        <div className="auth-right">
          <div className="auth-card">
            {error && (
              <div className="auth-error">
                <span className="error-icon">✕</span>
                {error}
              </div>
            )}

            <h2 className="form-title">Create Account</h2>

            <form onSubmit={handleSubmit} className="auth-form">
              <div className="form-group">
                <label className="form-label">Email address</label>
                <input
                  type="email"
                  name="username"
                  placeholder="name@email.com"
                  value={formData.username}
                  onChange={handleChange}
                  className="form-input"
                  autoFocus
                />
              </div>

              <div className="form-group">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  name="password"
                  placeholder="••••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="••••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>

              <button type="submit" className="register-button" disabled={loading}>
                {loading ? (
                  <>
                    <span className="button-spinner"></span>
                    Creating Account...
                  </>
                ) : (
                  'Create Account'
                )}
              </button>
            </form>

            <div className="signin-section">
              <p className="signin-text">Already have an account?</p>
              <Link to="/login" className="signin-button">
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
