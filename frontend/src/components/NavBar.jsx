import { Container, Nav, Navbar } from "react-bootstrap";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";

const NavBar = () => {
  const { user, logoutUser } = useContext(AuthContext);
  return (
    <Navbar bg="dark" className="mb-4" style={{ height: "3.75rem" }}>
      <Container>
        <Nav>
          <Link to="/" className="nav-link text-white">
            Chat
          </Link>
        </Nav>
        <span className="text-warning">
          {user ? "Logged in as " + user.name : null}
        </span>
        
          {user ? (
            <Link to="/" className="nav-link text-white" onClick={logoutUser}>
              Logout
            </Link>
          ) : (
            <Nav>
              <Link to="/login" className="nav-link text-white">Login</Link>
              <Link to="/register" className="nav-link text-white">Register</Link>
            </Nav>
          )}
        
      </Container>
    </Navbar>
  );
};

export default NavBar;
