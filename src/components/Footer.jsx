import React from "react";
import "../styles/Footer.css";

export default function Footer() {
  return (
    <footer className="footer-root">
      <div className="footer-inner">
        <p>
          © {new Date().getFullYear()} Dr. Raoof’s Urocare. All rights reserved.
        </p>
        <nav>
          <a href="/privacy">Privacy Policy</a>
        </nav>
      </div>
    </footer>
  );
}
