import { motion } from "framer-motion";
import {
  FaUserMd,
  FaCalendarCheck,
  FaPhoneAlt,
  FaStar,
  FaHospital,
  FaStethoscope,
} from "react-icons/fa";
import "../styles/Hero.css";

export default function Hero() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0.1 },
    },
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 22 },
    show: { opacity: 1, y: 0, transition: { duration: 0.55 } },
  };

  const float = (delay = 0) => ({
    hidden: { opacity: 0, y: 16, scale: 0.96 },
    show: {
      opacity: 1,
      y: [16, -6, 0],
      scale: 1,
      transition: { duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] },
    },
  });

  const pulse = {
    animate: {
      boxShadow: [
        "0 0 0 0 rgba(19,164,221,0.45)",
        "0 0 0 12px rgba(19,164,221,0)",
      ],
      transition: { duration: 1.75, repeat: Infinity, repeatType: "loop" },
    },
  };

  return (
    <section className="hero-root">
      <motion.div
        className="hero-container"
        variants={container}
        initial="hidden"
        animate="show"
      >
        <div className="hero-left">
          <motion.span className="hero-badge" variants={fadeUp}>
            <FaHospital aria-hidden /> Dr. Raoof’s Urocare
          </motion.span>

          <motion.h1 className="hero-title" variants={fadeUp}>
            Book Your Urology Appointment Online
          </motion.h1>

          <motion.p className="hero-sub" variants={fadeUp}>
            Consult <strong>Dr. Khizar Raoof</strong> for kidney stones,
            prostate issues, and urinary concerns. Choose your preferred date &
            time and confirm your visit in a few clicks—fast, secure, and
            patient-first.
          </motion.p>

          <motion.div className="hero-ctas" variants={fadeUp}>
            <a className="hero-btn hero-btn--primary" href="#appointment">
              <FaCalendarCheck />
              Book Appointment
            </a>
            <a className="hero-btn hero-btn--ghost" href="tel:+919966035500">
              <FaPhoneAlt />
              +91 99660 35500
            </a>
          </motion.div>

          <motion.ul className="hero-stats" variants={container}>
            <motion.li variants={fadeUp}>
              <span className="hero-stat-icon">
                <FaUserMd />
              </span>
              <div className="hero-stat-content">
                <strong>Experienced Urologist</strong>
                <small>MBBS • MS • MCh (Urology)</small>
              </div>
            </motion.li>
            <motion.li variants={fadeUp}>
              <span className="hero-stat-icon">
                <FaStethoscope />
              </span>
              <div className="hero-stat-content">
                <strong>Kidney Stone & Prostate Care</strong>
                <small>Laser & minimally invasive options</small>
              </div>
            </motion.li>
            <motion.li variants={fadeUp}>
              <span className="hero-stat-icon">
                <FaStar />
              </span>
              <div className="hero-stat-content">
                <strong>Patient-First Approach</strong>
                <small>Clear guidance & follow-up</small>
              </div>
            </motion.li>
          </motion.ul>
        </div>

        <div className="hero-right">
          <motion.div className="hero-figure" variants={float(0.1)}>
            <img
              src="/assets/hero/urocare-illustration.png"
              alt="Urology care illustration"
              className="hero-illustration"
            />

            <motion.div
              className="hero-float hero-pill-1"
              variants={float(0.25)}
            >
              <FaStethoscope />
            </motion.div>
            <motion.div
              className="hero-float hero-pill-2"
              variants={float(0.35)}
            >
              <FaUserMd />
            </motion.div>
            <motion.div
              className="hero-float hero-pill-3"
              variants={float(0.45)}
            >
              <FaCalendarCheck />
            </motion.div>

            <motion.span className="hero-pulse" {...pulse} />
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
