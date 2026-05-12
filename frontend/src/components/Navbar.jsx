import { Link } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          Serenity
        </Link>
        <div className="navbar-links">
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
          <Link to="/services">Services</Link>
          <Link to="/contact">Contact</Link>
        </div>
        <div className="navbar-auth">
          <Link to="/login" className="btn-secondary">Log In</Link>
          <Link to="/signup" className="btn-primary">Sign Up</Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
