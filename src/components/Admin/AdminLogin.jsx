import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/AdminLogin.css";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("admin-auth") === "true";
    if (isLoggedIn) {
      navigate("/admin/dashboard");
    }
  }, [navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email === "admin@urocare.com" && password === "1234") {
      localStorage.setItem("admin-auth", "true");
      navigate("/admin/dashboard");
    } else {
      setError("Invalid credentials. Please try again.");
    }
  };

  return (
    <section className="admin-login-root">
      <div className="admin-login-card">
        <h1>Admin Login</h1>
        <form onSubmit={handleSubmit}>
          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@urocare.com"
              required
            />
          </label>
          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </label>
          {error && <p className="error">{error}</p>}
          <button type="submit" className="btn-primary">
            Login
          </button>
        </form>
      </div>
    </section>
  );
}
