import React from "react";
import instagram from "../assets/instagram.svg";
import whatsapp from "../assets/whatsapp.svg";


const Footer = () => {
  return (
    <div className="footer">
      <h4 className="footer-title">Contact</h4>
      <div className="footer-grid">
        <div className="footer-card phone">
          <p className="footer-label">Phone</p>
          <p className="footer-value">+49 30 915-88492</p>
        </div>
        <div className="footer-card socials">
          <p className="footer-label">Socials</p>
          <div className="footer-socials">
            <a href="https://www.instagram.com/kreal_l_" className="footer-social-link">
              <img src={instagram} alt="Instagram" className="footer-social-icon" />
            </a>
            <a href="https://www.whatsapp.com/" className="footer-social-link">
              <img src={whatsapp} alt="WhatsApp" className="footer-social-icon" />
            </a>
          </div>
        </div>
        <div className="footer-card address">
          <p className="footer-label">Address</p>
          <p className="footer-value">Wallstraße 9-13, 10179 Berlin, Deutschland</p>
        </div>
        <div className="footer-card working-hours">
          <p className="footer-label">Working Hours</p>
          <p className="footer-value">24 hours a day</p>
        </div>
        <div className="footer-map">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2436.7980541597695!2d13.411708115915275!3d52.51418307981239!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47a851c9e098c6d1%3A0x421b1f5741d50a0!2sWallstra%C3%9Fe%209-13%2C%2010179%20Berlin%2C%20Germany!5e0!3m2!1sen!2sus!4v1641229612815!5m2!1sen!2sus"
            width="100%"
            height="350"
            title="Google Maps Location"
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default Footer;