import { useEffect, useState } from "react";
import api from "../services/api";

const empty = { guest_name: "", guest_email: "", guest_phone: "", room_id: "", check_in: "", check_out: "" };

const statusColors = {
  confirmed: { bg: "#dbeafe", color: "#2563eb" },
  checked_in: { bg: "#d1fae5", color: "#059669" },
  checked_out: { bg: "#f3f4f6", color: "#6b7280" },
  cancelled: { bg: "#fee2e2", color: "#dc2626" },
};

export default function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [form, setForm] = useState(empty);
  const [showForm, setShowForm] = useState(false);

  const load = () => {
    api.get("/bookings/").then((r) => setBookings(r.data));
    api.get("/bookings/rooms").then((r) => setRooms(r.data));
  };
  useEffect(() => { load(); }, []);

  const save = async (e) => {
    e.preventDefault();
    await api.post("/bookings/", form);
    setForm(empty); setShowForm(false); load();
  };

  const updateStatus = async (id, status) => {
    await api.put(`/bookings/${id}/status?status=${status}`); load();
  };

  return (
    <div style={s.page}>
      <div style={s.header}>
        <h2>🛏️ Bookings</h2>
        <button style={s.btn} onClick={() => { setShowForm(!showForm); setForm(empty); }}>
          {showForm ? "Cancel" : "+ New Booking"}
        </button>
      </div>

      {/* Room Availability */}
      <div style={s.roomsBox}>
        <h4 style={{ marginBottom: "12px" }}>🏠 Room Availability</h4>
        <div style={s.roomGrid}>
          {rooms.map((r) => (
            <div key={r.id} style={{ ...s.roomCard, borderLeft: `4px solid ${r.is_available ? "#10b981" : "#ef4444"}` }}>
              <strong>{r.room_number}</strong>
              <p style={{ fontSize: "12px", color: "#666", margin: "4px 0" }}>{r.room_type} — ${r.price_per_night}/night</p>
              <span style={{ fontSize: "12px", color: r.is_available ? "#10b981" : "#ef4444" }}>
                {r.is_available ? "✅ Available" : "❌ Occupied"}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* New Booking Form */}
      {showForm && (
        <form onSubmit={save} style={s.form}>
          <div style={s.formGrid}>
            <input style={s.input} placeholder="Guest Name*" value={form.guest_name}
              onChange={(e) => setForm({ ...form, guest_name: e.target.value })} required />
            <input style={s.input} placeholder="Guest Email" value={form.guest_email}
              onChange={(e) => setForm({ ...form, guest_email: e.target.value })} />
            <input style={s.input} placeholder="Guest Phone" value={form.guest_phone}
              onChange={(e) => setForm({ ...form, guest_phone: e.target.value })} />
            <select style={s.input} value={form.room_id} onChange={(e) => setForm({ ...form, room_id: e.target.value })} required>
              <option value="">Select Room*</option>
              {rooms.filter((r) => r.is_available).map((r) => (
                <option key={r.id} value={r.id}>{r.room_number} — {r.room_type} (${r.price_per_night}/night)</option>
              ))}
            </select>
            <input style={s.input} type="datetime-local" placeholder="Check In" value={form.check_in}
              onChange={(e) => setForm({ ...form, check_in: e.target.value })} required />
            <input style={s.input} type="datetime-local" placeholder="Check Out" value={form.check_out}
              onChange={(e) => setForm({ ...form, check_out: e.target.value })} required />
          </div>
          <button style={s.btn} type="submit">Confirm Booking</button>
        </form>
      )}

      {/* Bookings Table */}
      <div style={s.tableWrap}>
        <table style={s.table}>
          <thead>
            <tr>{["Guest", "Email", "Phone", "Room", "Check In", "Check Out", "Status", "Actions"].map((h) => <th key={h} style={s.th}>{h}</th>)}</tr>
          </thead>
          <tbody>
            {bookings.map((b) => {
              const sc = statusColors[b.status] || statusColors.confirmed;
              return (
                <tr key={b.id} style={s.tr}>
                  <td style={s.td}><strong>{b.guest_name}</strong></td>
                  <td style={s.td}>{b.guest_email}</td>
                  <td style={s.td}>{b.guest_phone}</td>
                  <td style={s.td}>Room {b.room_id}</td>
                  <td style={s.td}>{b.check_in ? new Date(b.check_in).toLocaleDateString() : "-"}</td>
                  <td style={s.td}>{b.check_out ? new Date(b.check_out).toLocaleDateString() : "-"}</td>
                  <td style={s.td}>
                    <span style={{ ...s.badge, background: sc.bg, color: sc.color }}>{b.status}</span>
                  </td>
                  <td style={s.td}>
                    <select style={s.select} value={b.status} onChange={(e) => updateStatus(b.id, e.target.value)}>
                      <option value="confirmed">Confirmed</option>
                      <option value="checked_in">Check In</option>
                      <option value="checked_out">Check Out</option>
                      <option value="cancelled">Cancel</option>
                    </select>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {bookings.length === 0 && <p style={s.empty}>No bookings found.</p>}
      </div>
    </div>
  );
}

const s = {
  page: { padding: "24px" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" },
  btn: { padding: "10px 20px", background: "#4f46e5", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer" },
  roomsBox: { background: "#fff", padding: "20px", borderRadius: "10px", marginBottom: "20px", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" },
  roomGrid: { display: "flex", gap: "12px", flexWrap: "wrap" },
  roomCard: { padding: "12px 16px", background: "#f8f9fa", borderRadius: "8px", minWidth: "150px" },
  form: { background: "#fff", padding: "20px", borderRadius: "10px", marginBottom: "20px", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" },
  formGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "12px" },
  input: { padding: "10px", border: "1px solid #ddd", borderRadius: "8px", fontSize: "14px" },
  tableWrap: { background: "#fff", borderRadius: "10px", boxShadow: "0 2px 8px rgba(0,0,0,0.08)", overflow: "hidden" },
  table: { width: "100%", borderCollapse: "collapse" },
  th: { padding: "12px 16px", background: "#f8f9fa", textAlign: "left", fontSize: "13px", color: "#666", borderBottom: "1px solid #eee" },
  tr: { borderBottom: "1px solid #f0f0f0" },
  td: { padding: "12px 16px", fontSize: "14px" },
  badge: { padding: "4px 10px", borderRadius: "20px", fontSize: "12px", fontWeight: "600" },
  select: { padding: "6px 10px", border: "1px solid #ddd", borderRadius: "6px", fontSize: "12px", cursor: "pointer" },
  empty: { padding: "24px", textAlign: "center", color: "#999" },
};
