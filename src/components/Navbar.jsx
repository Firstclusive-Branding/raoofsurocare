import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaBars, FaTimes, FaCalendarCheck } from "react-icons/fa";
import "../styles/Navbar.css";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const navRef = useRef(null);

  const toggle = () => setOpen((o) => !o);
  const closeMenu = () => setOpen(false);

  useEffect(() => {
    function handleClickOutside(e) {
      if (navRef.current && !navRef.current.contains(e.target)) {
        closeMenu();
      }
    }

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  return (
    <header className="nav-root">
      <motion.nav
        ref={navRef}
        className="nav-inner"
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        aria-label="Primary"
      >
        <Link to="/" className="nav-brand" onClick={closeMenu}>
          <img
            className="nav-logo"
            src="/assets/navbar/logo.png"
            alt="Dr. Raoof’s Urocare logo"
          />
        </Link>

        <button
          className="nav-toggle"
          aria-expanded={open ? "true" : "false"}
          aria-controls="nav-menu"
          onClick={toggle}
        >
          {open ? <FaTimes aria-hidden /> : <FaBars aria-hidden />}
          <span className="nav-sr-only">Toggle menu</span>
        </button>

        <ul className="nav-list">
          <li>
            <Link to="https://drkhizarraoof.com/" onClick={closeMenu}>
              Dr. Khizar Raoof
            </Link>
          </li>
          <li>
            <Link to="https://drkhizarraoof.com/" onClick={closeMenu}>
              Dr. Raoof's Urocare
            </Link>
          </li>
        </ul>
        <div id="nav-menu" className={`nav-menu ${open ? "is-open" : ""}`}>
          <ul className="nav-list mobile">
            <li>
              <Link to="https://drkhizarraoof.com/" onClick={closeMenu}>
                Dr. Khizar Raoof
              </Link>
            </li>
            <li>
              <Link to="https://drkhizarraoof.com/" onClick={closeMenu}>
                Dr. Raoof's Urocare
              </Link>
            </li>
          </ul>

          <a
            href="#appointment"
            className="nav-btn nav-btn--primary"
            onClick={closeMenu}
          >
            <FaCalendarCheck aria-hidden />
            <span>Book Appointment</span>
          </a>
        </div>
      </motion.nav>
    </header>
  );
}
