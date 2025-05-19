import React from 'react';
import { Instagram, Facebook, Twitter, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="footer-brand">
          <h2 className="footer-logo">BELLUCCI</h2>
          <p className="footer-tagline">
            Discover your next favorite look. Tailored. Effortless. Timeless.
          </p>
        </div>

        <div className="footer-links">
          <div>
            <h4 className="footer-title">Explore</h4>
            <ul>
              <li><button className="footer-link">Women</button></li>
              <li><button className="footer-link">Men</button></li>
              <li><button className="footer-link">Beauty</button></li>
              <li><button className="footer-link">Decor</button></li>
            </ul>
          </div>
          <div>
            <h4 className="footer-title">Company</h4>
            <ul>
              <li><button className="footer-link">About Us</button></li>
              <li><button className="footer-link">Collections</button></li>
              <li><button className="footer-link">Gift Ideas</button></li>
              <li><button className="footer-link">Contact</button></li>
            </ul>
          </div>
          <div>
            <h4 className="footer-title">Support</h4>
            <ul>
              <li><button className="footer-link">FAQs</button></li>
              <li><button className="footer-link">Shipping</button></li>
              <li><button className="footer-link">Returns</button></li>
              <li><button className="footer-link">Terms & Conditions</button></li>
            </ul>
          </div>
        </div>

        <div className="footer-social">
          <h4 className="footer-title">Follow Us</h4>
          <div className="social-icons">
            <a href="https://instagram.com" aria-label="Instagram"><Instagram size={20} /></a>
            <a href="https://facebook.com" aria-label="Facebook"><Facebook size={20} /></a>
            <a href="https://twitter.com" aria-label="Twitter"><Twitter size={20} /></a>
            <a href="mailto:contact@bellucci.com" aria-label="Email"><Mail size={20} /></a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} Bellucci. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;