import { NavLink } from 'react-router-dom';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase'; // adjust path if needed
import { useNavigate } from 'react-router-dom';

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
    <Navbar bg="light" expand="lg">
      <Container>
        <Navbar.Brand href="/planner">Dynamic Life Planning</Navbar.Brand>
        <Nav className="me-auto">
          <NavLink className="nav-link" to="/planner">Planner</NavLink>
          <NavLink className="nav-link" to="/sorted">Sorted Tasks</NavLink>
          <NavLink className="nav-link" to="/unsorted">Unsorted Tasks</NavLink>
          <button onClick={handleLogout} className="btn btn-link nav-link" style={{ padding: 0 }}>Logout </button>
        </Nav>
      </Container>
    </Navbar>
  );
}

export default AppNavbar;