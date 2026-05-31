import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import api from "../services/api";

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [aiSummary, setAiSummary] = useState("");

  useEffect(() => {
    api.get("/dashboard/summary").then((r) => setSummary(r.data));
    api.get("/dashboard/monthly-sales").then((r) => setChartData(r.data));
  }, []);

  const getAISummary = () => {
    api.get("/ai/report-summary").then((r) => setAiSummary(r.data.summary));
  };

  const cards = summary
    ? [
        { label: "Total Revenue", value: `$${summary.total_revenue}`, color: "#4f46e5" },
        { label: "Total Bookings", value: summary.total_bookings, color: "#10b981" },
        { label: "Total Expenses", value: `$${summary.total_expenses}`, color: "#ef4444" },
        { label: "Net Profit", value: `$${summary.net_profit}`, color: "#f59e0b" },
        { label: "Low Stock Alerts", value: summary.low_stock_alerts, color: "#6366f1" },
      ]
    : [];

  return (
    <div style={styles.page}>
      <h2>📊 Dashboard</h2>
      <div style={styles.cards}>
        {cards.map((c) => (
          <div key={c.label} style={{ ...styles.card, borderTop: `4px solid ${c.color}` }}>
            <p style={styles.cardLabel}>{c.label}</p>
            <h3 style={{ color: c.color }}>{c.value}</h3>
          </div>
        ))}
      </div>

      <div style={styles.chartBox}>
        <h3>Monthly Sales</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={chartData}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="total" fill="#4f46e5" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div style={styles.aiBox}>
        <button style={styles.aiBtn} onClick={getAISummary}>🤖 Get AI Report Summary</button>
        {aiSummary && <p style={styles.aiText}>{aiSummary}</p>}
      </div>
    </div>
  );
}

const styles = {
  page: { padding: "24px" },
  cards: { display: "flex", gap: "16px", flexWrap: "wrap", marginBottom: "24px" },
  card: { background: "#fff", padding: "20px", borderRadius: "10px", minWidth: "160px", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" },
  cardLabel: { color: "#666", fontSize: "13px", margin: 0 },
  chartBox: { background: "#fff", padding: "20px", borderRadius: "10px", boxShadow: "0 2px 8px rgba(0,0,0,0.08)", marginBottom: "24px" },
  aiBox: { background: "#fff", padding: "20px", borderRadius: "10px", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" },
  aiBtn: { padding: "10px 20px", background: "#4f46e5", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer" },
  aiText: { marginTop: "16px", lineHeight: "1.6", color: "#333" },
};
