import "../styles/Policies.css";

export default function Policies() {
  return (
    <section className="pp-root">
      <div className="pp-inner">
        <h1 className="pp-title">Privacy Policy</h1>
        <p className="pp-intro">
          At Dr. Raoof’s Urocare, we are committed to protecting your privacy.
          This policy outlines how we collect, use, and safeguard your personal
          information when you use our website and services.
        </p>

        <h2>1. Information We Collect</h2>
        <p>
          We may collect personal information such as your name, contact
          details, appointment preferences, and payment details when you book an
          appointment or interact with our site. We may also collect
          non-identifiable information such as browser type, device, and usage
          statistics.
        </p>

        <h2>2. How We Use Your Information</h2>
        <ul>
          <li>To confirm and manage your appointment bookings.</li>
          <li>
            To provide you with medical consultation and related services.
          </li>
          <li>To process secure payments via third-party providers.</li>
          <li>To communicate updates, reminders, or important notices.</li>
          <li>To improve our website, services, and user experience.</li>
        </ul>

        <h2>3. Data Security</h2>
        <p>
          We use industry-standard safeguards to protect your data. Sensitive
          details such as payment information are processed securely via trusted
          third-party payment gateways (e.g., Razorpay). However, no online
          system can guarantee 100% security.
        </p>

        <h2>4. Sharing of Information</h2>
        <p>
          We do not sell or rent your personal information. Data may be shared
          only with:
        </p>
        <ul>
          <li>
            Medical staff and authorized personnel for providing healthcare
            services.
          </li>
          <li>Payment providers to process transactions securely.</li>
          <li>
            Legal authorities if required to comply with applicable law or
            regulations.
          </li>
        </ul>

        <h2>5. Cookies & Tracking</h2>
        <p>
          Our website may use cookies and similar technologies to enhance user
          experience, track analytics, and improve performance. You can control
          cookie preferences in your browser settings.
        </p>

        <h2>6. Your Rights</h2>
        <p>You have the right to:</p>
        <ul>
          <li>Access and request a copy of your personal data.</li>
          <li>Request corrections to any inaccurate information.</li>
          <li>
            Withdraw consent for non-essential communication or data usage.
          </li>
          <li>Request deletion of your data where applicable.</li>
        </ul>

        <h2>7. Third-Party Links</h2>
        <p>
          Our website may contain links to external websites. We are not
          responsible for the privacy practices or content of those third-party
          sites.
        </p>

        <h2>8. Changes to this Policy</h2>
        <p>
          We may update this Privacy Policy from time to time to reflect changes
          in our practices or for legal compliance. Updates will be posted on
          this page with a revised “last updated” date.
        </p>

        <h2>9. Contact Us</h2>
        <p>
          If you have any questions or concerns about this Privacy Policy,
          please contact us at:{" "}
          <a href="mailto:hey@drkhizarraoof.com">hey@drkhizarraoof.com</a> or
          call us at <a href="tel:+919966035500">+91 99660 35500</a>.
        </p>

        <p className="pp-updated">Last Updated: {new Date().toDateString()}</p>
      </div>
    </section>
  );
}
