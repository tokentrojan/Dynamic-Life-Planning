import { NavLink, useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';
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
          {/* Left-Side of the NavBar */}
          <Nav className="me-auto">
            <NavLink className="nav-link" to="/planner">Planner</NavLink>
            <NavLink className="nav-link" to="/tasks">Tasks</NavLink> {/* Combined Sorted, Unsorted, Completed and Create Task Pages all in to one Task Page */}
            <NavLink className="nav-link" to="/create">CreateTask</NavLink> 
          </Nav>
            {/* Right-Side of NavBar */}
          <Nav className="ms-auto">
            <NavDropdown title="Account" id="account-dropdown" align="end"> {/*made an acoount dropdown to hold logout and future options */}
              <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default AppNavbar;