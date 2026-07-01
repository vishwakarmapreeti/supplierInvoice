import "@/styles/footer.css";
import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Linkedin,
  Twitter,
} from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">

        <div className="footer-content">

          {/* Company */}
          <div className="footer-section">
            <div className="footer-logo-wrapper">
              <h3 className="footer-logo">
                Supplier Invoice Portal
              </h3>

              <p className="footer-description">
                Simplify supplier invoice submission with secure document
                upload, AI-powered data extraction, and faster invoice
                processing.
              </p>
            </div>
          </div>

          {/* Navigation */}
          <div className="footer-section">
            <h4 className="footer-section-title">
              Quick Links
            </h4>

            <ul className="footer-links">
              <li>
                <a href="/">Dashboard</a>
              </li>

              <li>
                <a href="/uploadDoc">
                  Submit Invoice
                </a>
              </li>

              <li>
                <a href="/result">
                  Invoice History
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="footer-section">
            <h4 className="footer-section-title">
              Contact
            </h4>

            <div className="footer-contact">
              <div className="contact-item">
                <Mail size={16} />
                <a href="mailto:procurement@company.com">
                  procurement@company.com
                </a>
              </div>

              <div className="contact-item">
                <Phone size={16} />
                <a href="tel:+911234567890">
                  +91 12345 67890
                </a>
              </div>

              <div className="contact-item">
                <MapPin size={16} />
                <span>
                  Procurement Department, India
                </span>
              </div>
            </div>
          </div>

          {/* Social */}
          <div className="footer-section">
            <h4 className="footer-section-title">
              Follow Us
            </h4>

            <div className="footer-socials">
              <a
                href="#"
                aria-label="LinkedIn"
                className="social-link"
              >
                <Linkedin size={20} />
              </a>

              <a
                href="#"
                aria-label="Twitter"
                className="social-link"
              >
                <Twitter size={20} />
              </a>

              <a
                href="#"
                aria-label="Facebook"
                className="social-link"
              >
                <Facebook size={20} />
              </a>
            </div>
          </div>

        </div>

        <div className="footer-bottom">
          <div className="footer-divider"></div>

          <div className="footer-bottom-content">
            <p className="footer-copyright">
              © {currentYear} Supplier Invoice Portal. All rights reserved.
            </p>

            <div className="footer-legal">
              <a href="#privacy">
                Privacy Policy
              </a>

              <a href="#terms">
                Terms & Conditions
              </a>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
}