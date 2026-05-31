import { useEffect, useState } from "react";
import api from "../services/api";

const empty = { guest_name: "", booking_id: "", amount: 0, tax: 0 };

export default function Invoices() {
  const [invoices, setInvoices] = useState([]);
  const [form, setForm] = useState(empty);
  const [showForm, setShowForm] = useState(false);

  const load = () => api.get("/invoices/").then((r) => setInvoices(r.data));
  useEffect(() => { load(); }, []);

  const save = async (e) => {
    e.preventDefault();
    await api.post("/invoices/", { ...form, amount: Number(form.amount), tax: Number(form.tax), booking_id: form.booking_id || null });
    setForm(empty); setShowForm(false); load();
  };

  const markPaid = async (id) => { await api.put(`/invoices/${id}/pay`); load(); };

  const downloadPDF = (id) => {
    const token = localStorage.getItem("token");
    fetch(`http://localhost:8000/api/invoices/${id}/pdf`, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.blob())
      .then((blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url; a.download = `invoice-${id}.pdf`; a.click();
        URL.revokeObjectURL(url);
      });
  };

  const totalRevenue = invoices.filter((i) => i.status === "paid").reduce((sum, i) => sum + i.total, 0);
  const unpaidCount = invoices.filter((i) => i.status === "unpaid").length;

  return (
    <div style={s.page}>
      <div style={s.header}>
        <h2>🧾 Invoices</h2>
        <button style={s.btn} onClick={() => { setShowForm(!showForm); setForm(empty); }}>
          {showForm ? "Cancel" : "+ New Invoice"}
        </button>
      </div>

      {/* Summary Cards */}
      <div style={s.cards}>
        <div style={{ ...s.card, borderTop: "4px solid #10b981" }}>
          <p style={s.cardLabel}>Total Collected</p>
          <h3 style={{ color: "#10b981" }}>${totalRevenue.toFixed(2)}</h3>
        </div>
        <div style={{ ...s.card, borderTop: "4px solid #f59e0b" }}>
          <p style={s.cardLabel}>Unpaid Invoices</p>
          <h3 style={{ color: "#f59e0b" }}>{unpaidCount}</h3>
        </div>
        <div style={{ ...s.card, borderTop: "4px solid #4f46e5" }}>
          <p style={s.cardLabel}>Total Invoices</p>
          <h3 style={{ color: "#4f46e5" }}>{invoices.length}</h3>
        </div>
      </div>

      {/* Form */}
      {showForm && (
        <form onSubmit={save} style={s.form}>
          <div style={s.formGrid}>
            <input style={s.input} placeholder="Guest Name*" value={form.guest_name}
              onChange={(e) => setForm({ ...form, guest_name: e.target.value })} required />
            <input style={s.input} placeholder="Booking ID (optional)" value={form.booking_id}
              onChange={(e) => setForm({ ...form, booking_id: e.target.value })} />
            <input style={s.input} type="number" placeholder="Amount*" value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })} required />
            <input style={s.input} type="number" placeholder="Tax" value={form.tax}
              onChange={(e) => setForm({ ...form, tax: e.target.value })} />
          </div>
          <button style={s.btn} type="submit">Create Invoice</button>
        </form>
      )}

      {/* Table */}
      <div style={s.tableWrap}>
        <table style={s.table}>
          <thead>
            <tr>{["Invoice #", "Guest", "Amount", "Tax", "Total", "Status", "Actions"].map((h) => <th key={h} style={s.th}>{h}</th>)}</tr>
          </thead>
          <tbody>
            {invoices.map((inv) => (
              <tr key={inv.id} style={s.tr}>
                <td style={s.td}><strong>{inv.invoice_number}</strong></td>
                <td style={s.td}>{inv.guest_name}</td>
                <td style={s.td}>${inv.amount}</td>
                <td style={s.td}>${inv.tax}</td>
                <td style={s.td}><strong>${inv.total}</strong></td>
                <td style={s.td}>
                  <span style={{ ...s.badge, background: inv.status === "paid" ? "#d1fae5" : "#fef3c7", color: inv.status === "paid" ? "#059669" : "#d97706" }}>
                    {inv.status === "paid" ? "✅ Paid" : "⏳ Unpaid"}
                  </span>
                </td>
                <td style={s.td}>
                  {inv.status === "unpaid" && (
                    <button style={{ ...s.actionBtn, background: "#10b981" }} onClick={() => markPaid(inv.id)}>Mark Paid</button>
                  )}
                  <button style={{ ...s.actionBtn, background: "#4f46e5" }} onClick={() => downloadPDF(inv.id)}>📄 PDF</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {invoices.length === 0 && <p style={s.empty}>No invoices found.</p>}
      </div>
    </div>
  );
}

const s = {
  page: { padding: "24px" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" },
  btn: { padding: "10px 20px", background: "#4f46e5", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer" },
  cards: { display: "flex", gap: "16px", marginBottom: "20px" },
  card: { background: "#fff", padding: "20px", borderRadius: "10px", minWidth: "160px", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" },
  cardLabel: { color: "#666", fontSize: "13px", margin: 0 },
  form: { background: "#fff", padding: "20px", borderRadius: "10px", marginBottom: "20px", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" },
  formGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "12px" },
  input: { padding: "10px", border: "1px solid #ddd", borderRadius: "8px", fontSize: "14px" },
  tableWrap: { background: "#fff", borderRadius: "10px", boxShadow: "0 2px 8px rgba(0,0,0,0.08)", overflow: "hidden" },
  table: { width: "100%", borderCollapse: "collapse" },
  th: { padding: "12px 16px", background: "#f8f9fa", textAlign: "left", fontSize: "13px", color: "#666", borderBottom: "1px solid #eee" },
  tr: { borderBottom: "1px solid #f0f0f0" },
  td: { padding: "12px 16px", fontSize: "14px" },
  badge: { padding: "4px 10px", borderRadius: "20px", fontSize: "12px", fontWeight: "600" },
  actionBtn: { padding: "6px 12px", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer", marginRight: "6px", fontSize: "12px" },
  empty: { padding: "24px", textAlign: "center", color: "#999" },
};
