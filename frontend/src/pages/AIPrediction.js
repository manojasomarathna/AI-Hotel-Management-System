import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import api from "../services/api";

export default function AIPrediction() {
  const [prediction, setPrediction] = useState("");
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(false);

  const getPrediction = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/ai/sales-prediction");
      setPrediction(data.prediction);
      if (data.historical_data) {
        const parsed = data.historical_data.split("\n").map((line) => {
          const [month, val] = line.split(": $");
          return { month, sales: parseFloat(val) || 0 };
        });
        setChartData(parsed);
      }
    } catch {
      setPrediction("Error fetching prediction. Check your OpenAI API key.");
    }
    setLoading(false);
  };

  return (
    <div style={s.page}>
      <h2>📈 AI Sales Prediction</h2>
      <p style={s.subtitle}>AI analyzes your last 6 months of sales and predicts next month's revenue.</p>

      <button style={s.btn} onClick={getPrediction} disabled={loading}>
        {loading ? "⏳ Analyzing..." : "🤖 Generate Prediction"}
      </button>

      {chartData.length > 0 && (
        <div style={s.chartBox}>
          <h3 style={{ marginBottom: "16px" }}>📊 Historical Sales (Last 6 Months)</h3>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip formatter={(v) => [`$${v}`, "Sales"]} />
              <Line type="monotone" dataKey="sales" stroke="#4f46e5" strokeWidth={2} dot={{ fill: "#4f46e5", r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {prediction && (
        <div style={s.predBox}>
          <h3 style={{ marginBottom: "12px" }}>🤖 AI Prediction</h3>
          <p style={s.predText}>{prediction}</p>
        </div>
      )}

      {!prediction && !loading && (
        <div style={s.emptyBox}>
          <p style={{ fontSize: "48px" }}>📊</p>
          <p style={{ color: "#999" }}>Click the button above to generate an AI sales prediction</p>
        </div>
      )}
    </div>
  );
}

const s = {
  page: { padding: "24px", maxWidth: "900px" },
  subtitle: { color: "#666", marginBottom: "20px", fontSize: "14px" },
  btn: { padding: "12px 28px", background: "#4f46e5", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "15px", marginBottom: "24px" },
  chartBox: { background: "#fff", padding: "24px", borderRadius: "10px", boxShadow: "0 2px 8px rgba(0,0,0,0.08)", marginBottom: "20px" },
  predBox: { background: "#fff", padding: "24px", borderRadius: "10px", boxShadow: "0 2px 8px rgba(0,0,0,0.08)", borderLeft: "4px solid #4f46e5" },
  predText: { lineHeight: "1.8", color: "#333", fontSize: "15px" },
  emptyBox: { background: "#fff", padding: "60px", borderRadius: "10px", textAlign: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" },
};
