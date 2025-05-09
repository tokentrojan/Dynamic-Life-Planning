import { NavLink, useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';

function AppNavbar() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
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
            <NavLink className="nav-link" to="/completed">Completed Tasks</NavLink>
            <NavLink className="nav-link" to="/create">Create Task</NavLink>

          </Nav>

          <Nav>
            <button
              onClick={handleLogout}
              className="btn btn-link nav-link"
              style={{ padding: 0 }}
            >
              Logout
            </button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default AppNavbar;