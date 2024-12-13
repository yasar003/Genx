import React from "react";
import "./Footer.css"; // Import your custom styles here

const Footer = () => {
  return (
    <footer className="footer bg-dark text-light py-4">
      <div className="container">
        <div className="row">
          {/* Column 1: Company Info */}
          <div className="col-md-4">
            <h5>About Us</h5>
            <p>
              GENX is your one-stop shop for the latest and trendiest products.
              We pride ourselves on providing high-quality items with the best
              customer service.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div className="col-md-4">
            <h5>Quick Links</h5>
            <ul className="list-unstyled">
              <li>
                <a href="/about" className="text-light">
                  About Us
                </a>
              </li>
              <li>
                <a href="/contact" className="text-light">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="/categories" className="text-light">
                  Categories
                </a>
              </li>
              <li>
                <a href="/cart" className="text-light">
                  Cart
                </a>
              </li>
              <li>
                <a href="/login" className="text-light">
                  Login
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Social Media & Contact */}
          <div className="col-md-4">
            <h5>Follow Us</h5>
            <ul className="list-unstyled social-icons">
              <li>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-light"
                >
                  <i className="fa fa-facebook"></i> Facebook
                </a>
              </li>
              <li>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-light"
                >
                  <i className="fa fa-instagram"></i> Instagram
                </a>
              </li>
              <li>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-light"
                >
                  <i className="fa fa-twitter"></i> Twitter
                </a>
              </li>
            </ul>
            <h5>Contact Us</h5>
            <p>Email: genxking123@gmail.com</p>
            <p>Phone: +123 456 7890</p>
          </div>
        </div>
        <div className="text-center mt-4">
          <p>&copy; 2024 GENX. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
