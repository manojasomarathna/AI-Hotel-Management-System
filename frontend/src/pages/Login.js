import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch {
      setError("Invalid email or password");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>🏨 Hotel Management</h2>
        <form onSubmit={handleSubmit}>
          <input style={styles.input} type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input style={styles.input} type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          {error && <p style={styles.error}>{error}</p>}
          <button style={styles.button} type="submit">Login</button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  container: { display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", background: "#f0f2f5" },
  card: { background: "#fff", padding: "40px", borderRadius: "12px", boxShadow: "0 4px 20px rgba(0,0,0,0.1)", width: "360px" },
  title: { textAlign: "center", marginBottom: "24px", color: "#1a1a2e" },
  input: { width: "100%", padding: "12px", marginBottom: "16px", border: "1px solid #ddd", borderRadius: "8px", fontSize: "14px", boxSizing: "border-box" },
  button: { width: "100%", padding: "12px", background: "#4f46e5", color: "#fff", border: "none", borderRadius: "8px", fontSize: "16px", cursor: "pointer" },
  error: { color: "red", fontSize: "13px", marginBottom: "12px" },
};
