import React from 'react';
import { Navbar, Nav, Container, Dropdown } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import { toast } from 'react-toastify';
import NotificationPanel from './NotificationPanel';
import BrandLogo from './BrandLogo';

/**
 * Navigation Header Component
 */
const Header = () => {
  const navigate = useNavigate();
  const isAuthenticated = authAPI.isAuthenticated();
  const profile = authAPI.getProfile();
  const isAdmin = authAPI.isAdmin();

  const handleLogout = () => {
    authAPI.logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <Navbar bg="dark" expand="lg" sticky="top">
      <Container>
        <Navbar.Brand href="/resources" className="fw-bold d-flex align-items-center">
          <BrandLogo compact />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            {isAuthenticated && (
              <>
                <Nav.Link href="/resources">Resources</Nav.Link>
                {isAdmin && <Nav.Link href="/resources/add">Add Resource</Nav.Link>}
                <Nav.Link href="/bookings/my">My Bookings</Nav.Link>
                {isAdmin && <Nav.Link href="/bookings/admin">Manage Bookings</Nav.Link>}
                <Nav.Item className="d-flex align-items-center mx-2">
                  <NotificationPanel />
                </Nav.Item>
                <Dropdown>
                  <Dropdown.Toggle variant="link" id="dropdown-basic">
                    {profile?.username || 'Account'}
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.ItemText>
                      Role: {profile?.roles?.join(', ') || 'USER'}
                    </Dropdown.ItemText>
                    <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </>
            )}
            {!isAuthenticated && (
              <Nav.Link href="/login">Login</Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
