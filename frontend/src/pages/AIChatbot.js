import { useState } from "react";
import api from "../services/api";

export default function AIChatbot() {
  const [messages, setMessages] = useState([
    { role: "ai", text: "👋 Hello! I'm your hotel AI assistant. Ask me anything about sales, bookings, or expenses!" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const send = async () => {
    if (!input.trim()) return;
    const userMsg = { role: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);
    try {
      const { data } = await api.post("/ai/chat", { message: input });
      setMessages((prev) => [...prev, { role: "ai", text: data.reply }]);
    } catch {
      setMessages((prev) => [...prev, { role: "ai", text: "Sorry, something went wrong." }]);
    }
    setLoading(false);
  };

  return (
    <div style={styles.page}>
      <h2>🤖 AI Assistant</h2>
      <div style={styles.chatBox}>
        {messages.map((m, i) => (
          <div key={i} style={{ ...styles.bubble, ...(m.role === "user" ? styles.userBubble : styles.aiBubble) }}>
            {m.text}
          </div>
        ))}
        {loading && <div style={styles.aiBubble}>Thinking...</div>}
      </div>
      <div style={styles.inputRow}>
        <input
          style={styles.input}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="Ask about sales, bookings, expenses..."
        />
        <button style={styles.btn} onClick={send}>Send</button>
      </div>
    </div>
  );
}

const styles = {
  page: { padding: "24px", maxWidth: "700px" },
  chatBox: { background: "#fff", borderRadius: "10px", padding: "20px", height: "400px", overflowY: "auto", boxShadow: "0 2px 8px rgba(0,0,0,0.08)", marginBottom: "16px", display: "flex", flexDirection: "column", gap: "12px" },
  bubble: { padding: "12px 16px", borderRadius: "12px", maxWidth: "80%", lineHeight: "1.5" },
  aiBubble: { background: "#f0f0ff", color: "#333", alignSelf: "flex-start" },
  userBubble: { background: "#4f46e5", color: "#fff", alignSelf: "flex-end" },
  inputRow: { display: "flex", gap: "12px" },
  input: { flex: 1, padding: "12px", border: "1px solid #ddd", borderRadius: "8px", fontSize: "14px" },
  btn: { padding: "12px 24px", background: "#4f46e5", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer" },
};
