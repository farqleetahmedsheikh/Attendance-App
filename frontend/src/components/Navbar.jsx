import { Link, useLocation } from "react-router-dom";
import logo from "../assets/logo.jpeg"; // Uncomment this and make sure the image exists
import "./Navbar.css";

const Navbar = () => {
  const location = useLocation();

  return (
    <nav className="navbar">
      <div className="logo-section">
        <img src={logo} alt="App Logo" className="logo" />
        <span className="app-name">student attendance system</span>
      </div>
      <ul className="nav-links">
        <li>
          <Link to="/" className={location.pathname === "/" ? "active" : ""}>
            Home
          </Link>
        </li>
        <li>
          <Link to="/contact" className={location.pathname === "/contact" ? "active" : ""}>
            Contact
          </Link>
        </li>
        <li>
          <Link to="/login" className="login-button">
            Login
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
