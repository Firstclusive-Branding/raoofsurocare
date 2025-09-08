import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/AdminLogin.css";

const base_url = import.meta.env.VITE_PUBLIC_API_URL;

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("admin-auth") === "true";
    if (isLoggedIn) {
      navigate("/admin/dashboard");
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${base_url}/api/auth/signin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        setError(data.message || "Invalid credentials. Please try again.");
      } else {
        // Save token or auth flag
        localStorage.setItem("admin-auth", "true");
        if (data.token) {
          localStorage.setItem("admin-token", data.token);
        }
        navigate("/admin/dashboard");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
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
              placeholder="Enter your email"
              required
            />
          </label>
          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </label>
          {error && <p className="error">{error}</p>}
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </section>
  );
}
