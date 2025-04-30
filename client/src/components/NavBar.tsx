import { NavLink } from 'react-router-dom';
import { Navbar, Nav, Container } from 'react-bootstrap';

function AppNavbar() {
  return (
    <Navbar bg="light" expand="lg">
      <Container>
        <Navbar.Brand href="/planner">Task Manager</Navbar.Brand>
        <Nav className="me-auto">
          <NavLink className="nav-link" to="/planner">Planner</NavLink>
          <NavLink className="nav-link" to="/sorted">Sorted Tasks</NavLink>
          <NavLink className="nav-link" to="/unsorted">Unsorted Tasks</NavLink>
        </Nav>
      </Container>
    </Navbar>
  );
}

export default AppNavbar;