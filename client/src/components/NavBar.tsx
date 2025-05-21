import { NavLink, useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container, NavDropdown, Modal, Button } from 'react-bootstrap';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { useState } from 'react';

function AppNavbar() {
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const handleConfirmLogout = async () => {
    try {
      await signOut(auth);
      setShowLogoutModal(false);
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleCancelLogout = () => {
    setShowLogoutModal(false);
  };

  return (
    <>
      <Navbar bg="light" expand="lg" style={{ backgroundColor: '#e0e0e0' }}>
        <Container>
          <Navbar.Brand href="/planner">
            <img
              src="/dlp.png"
              alt="App Logo"
              height="30"
              className="d-inline-block align-top"
            />
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="navbar-nav" />
          <Navbar.Collapse id="navbar-nav">
            {/* Left-Side of the NavBar */}
            <Nav className="me-auto">
              <NavLink className="nav-link" to="/planner">Planner</NavLink>
              <NavLink className="nav-link" to="/tasks">Tasks</NavLink>
            </Nav>
            {/* Right-Side of NavBar */}
            <Nav className="ms-auto">
              <NavDropdown title="Account" id="account-dropdown" align="end">
                <NavDropdown.Item onClick={handleLogoutClick}>Logout</NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Logout Confirmation Modal */}
      <Modal show={showLogoutModal} onHide={handleCancelLogout} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Logout</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to logout?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCancelLogout}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleConfirmLogout}>
            Logout
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default AppNavbar;