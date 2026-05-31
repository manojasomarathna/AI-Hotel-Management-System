import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const links = [
  { to: "/dashboard", label: "📊 Dashboard" },
  { to: "/employees", label: "👥 Employees" },
  { to: "/inventory", label: "📦 Inventory" },
  { to: "/bookings", label: "🛏️ Bookings" },
  { to: "/invoices", label: "🧾 Invoices" },
  { to: "/ai-chat", label: "🤖 AI Assistant" },
  { to: "/ai-prediction", label: "📈 AI Prediction" },
];

export default function Sidebar() {
  const { user, logout } = useAuth();

  return (
    <div style={styles.sidebar}>
      <div style={styles.logo}>🏨 HotelAI</div>
      <p style={styles.userInfo}>{user?.name} <span style={styles.role}>({user?.role})</span></p>
      <nav>
        {links.map((l) => (
          <NavLink key={l.to} to={l.to} style={({ isActive }) => ({ ...styles.link, ...(isActive ? styles.active : {}) })}>
            {l.label}
          </NavLink>
        ))}
      </nav>
      <button style={styles.logout} onClick={logout}>🚪 Logout</button>
    </div>
  );
}

const styles = {
  sidebar: { width: "220px", background: "#1a1a2e", color: "#fff", height: "100vh", display: "flex", flexDirection: "column", padding: "20px", position: "fixed" },
  logo: { fontSize: "20px", fontWeight: "bold", marginBottom: "8px" },
  userInfo: { fontSize: "13px", color: "#aaa", marginBottom: "24px" },
  role: { color: "#4f46e5" },
  link: { display: "block", padding: "10px 12px", color: "#ccc", textDecoration: "none", borderRadius: "8px", marginBottom: "4px", fontSize: "14px" },
  active: { background: "#4f46e5", color: "#fff" },
  logout: { marginTop: "auto", padding: "10px", background: "transparent", color: "#ef4444", border: "1px solid #ef4444", borderRadius: "8px", cursor: "pointer" },
};
