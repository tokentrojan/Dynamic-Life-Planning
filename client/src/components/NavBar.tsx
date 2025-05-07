import { NavLink, useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container, Modal, Button } from 'react-bootstrap';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { useState } from 'react';

function AppNavbar() {
  const navigate = useNavigate();
  // Add a state to control the confirmation dialog
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // This function will show the confirmation dialog
  const handleLogoutClick = () => {
    setShowLogoutConfirm(true);
  };

  // This function will close the dialog without logging out
  const handleCancel = () => {
    setShowLogoutConfirm(false);
  };

  // This function will actually log the user out
  const handleLogoutConfirm = async () => {
    try {
      await signOut(auth);
      setShowLogoutConfirm(false);
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
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
            <Nav className="me-auto">
              <NavLink className="nav-link" to="/planner">Planner</NavLink>
              <NavLink className="nav-link" to="/sorted">Sorted Tasks</NavLink>
              <NavLink className="nav-link" to="/unsorted">Unsorted Tasks</NavLink>
              <NavLink className="nav-link" to="/create">Create Task</NavLink>
            </Nav>

            <Nav>
              <button
                onClick={handleLogoutClick}
                className="btn btn-link nav-link"
                style={{ padding: 0 }}
              >
                Logout
              </button>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Logout Confirmation Modal */}
      <Modal show={showLogoutConfirm} onHide={handleCancel}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Logout</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to log out?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCancel}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleLogoutConfirm}>
            Yes, Log Out
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default AppNavbar;