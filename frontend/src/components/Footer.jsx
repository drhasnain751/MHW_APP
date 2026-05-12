import { Link } from 'react-router-dom';
import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3>Mental Health & Wellness</h3>
          <p>A calming place to find peace of mind. Your journey to better mental health starts here.</p>
        </div>
        <div className="footer-section">
          <h4>Platform</h4>
          <Link to="/">Home</Link>
          <Link to="/about">About Us</Link>
          <Link to="/services">Services</Link>
          <Link to="/contact">Contact</Link>
        </div>
        <div className="footer-section">
          <h4>Legal</h4>
          <Link to="/">Privacy Policy</Link>
          <Link to="/">Terms of Service</Link>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Mental Health & Wellness. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
