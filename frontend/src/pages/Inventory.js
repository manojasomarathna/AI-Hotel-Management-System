import { useEffect, useState } from "react";
import api from "../services/api";

const empty = { name: "", category: "", quantity: 0, unit: "", low_stock_threshold: 10, supplier: "", unit_price: 0 };

export default function Inventory() {
  const [items, setItems] = useState([]);
  const [lowStock, setLowStock] = useState([]);
  const [form, setForm] = useState(empty);
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [tab, setTab] = useState("all");

  const load = () => {
    api.get("/inventory/").then((r) => setItems(r.data));
    api.get("/inventory/low-stock").then((r) => setLowStock(r.data));
  };
  useEffect(() => { load(); }, []);

  const save = async (e) => {
    e.preventDefault();
    if (editId) await api.put(`/inventory/${editId}`, form);
    else await api.post("/inventory/", form);
    setForm(empty); setEditId(null); setShowForm(false); load();
  };

  const remove = async (id) => { await api.delete(`/inventory/${id}`); load(); };

  const displayed = tab === "low" ? lowStock : items;

  return (
    <div style={s.page}>
      <div style={s.header}>
        <h2>📦 Inventory</h2>
        <button style={s.btn} onClick={() => { setShowForm(!showForm); setForm(empty); setEditId(null); }}>
          {showForm ? "Cancel" : "+ Add Item"}
        </button>
      </div>

      {/* Tabs */}
      <div style={s.tabs}>
        <button style={{ ...s.tab, ...(tab === "all" ? s.activeTab : {}) }} onClick={() => setTab("all")}>
          All Items ({items.length})
        </button>
        <button style={{ ...s.tab, ...(tab === "low" ? s.activeTab : {}), ...(lowStock.length > 0 ? { color: "#ef4444" } : {}) }} onClick={() => setTab("low")}>
          ⚠️ Low Stock ({lowStock.length})
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <form onSubmit={save} style={s.form}>
          <div style={s.formGrid}>
            {[["name", "Name*"], ["category", "Category"], ["unit", "Unit"], ["supplier", "Supplier"]].map(([f, p]) => (
              <input key={f} style={s.input} placeholder={p} value={form[f]}
                onChange={(e) => setForm({ ...form, [f]: e.target.value })} required={f === "name"} />
            ))}
            {[["quantity", "Quantity"], ["low_stock_threshold", "Low Stock Alert At"], ["unit_price", "Unit Price"]].map(([f, p]) => (
              <input key={f} style={s.input} type="number" placeholder={p} value={form[f]}
                onChange={(e) => setForm({ ...form, [f]: e.target.value })} />
            ))}
          </div>
          <button style={s.btn} type="submit">{editId ? "Update" : "Save"}</button>
        </form>
      )}

      {/* Table */}
      <div style={s.tableWrap}>
        <table style={s.table}>
          <thead>
            <tr>{["Name", "Category", "Quantity", "Unit", "Supplier", "Unit Price", "Status", "Actions"].map((h) => <th key={h} style={s.th}>{h}</th>)}</tr>
          </thead>
          <tbody>
            {displayed.map((item) => {
              const isLow = item.quantity <= item.low_stock_threshold;
              return (
                <tr key={item.id} style={{ ...s.tr, ...(isLow ? { background: "#fff5f5" } : {}) }}>
                  <td style={s.td}>{item.name}</td>
                  <td style={s.td}>{item.category}</td>
                  <td style={s.td}><strong>{item.quantity}</strong></td>
                  <td style={s.td}>{item.unit}</td>
                  <td style={s.td}>{item.supplier}</td>
                  <td style={s.td}>${item.unit_price}</td>
                  <td style={s.td}>
                    <span style={{ ...s.badge, background: isLow ? "#fee2e2" : "#d1fae5", color: isLow ? "#ef4444" : "#10b981" }}>
                      {isLow ? "⚠️ Low" : "✅ OK"}
                    </span>
                  </td>
                  <td style={s.td}>
                    <button style={s.editBtn} onClick={() => { setForm(item); setEditId(item.id); setShowForm(true); }}>Edit</button>
                    <button style={s.delBtn} onClick={() => remove(item.id)}>Delete</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {displayed.length === 0 && <p style={s.empty}>{tab === "low" ? "No low stock items 🎉" : "No items found."}</p>}
      </div>
    </div>
  );
}

const s = {
  page: { padding: "24px" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" },
  btn: { padding: "10px 20px", background: "#4f46e5", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer" },
  tabs: { display: "flex", gap: "8px", marginBottom: "20px" },
  tab: { padding: "8px 20px", border: "1px solid #ddd", borderRadius: "8px", cursor: "pointer", background: "#fff" },
  activeTab: { background: "#4f46e5", color: "#fff", border: "1px solid #4f46e5" },
  form: { background: "#fff", padding: "20px", borderRadius: "10px", marginBottom: "20px", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" },
  formGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "12px" },
  input: { padding: "10px", border: "1px solid #ddd", borderRadius: "8px", fontSize: "14px" },
  tableWrap: { background: "#fff", borderRadius: "10px", boxShadow: "0 2px 8px rgba(0,0,0,0.08)", overflow: "hidden" },
  table: { width: "100%", borderCollapse: "collapse" },
  th: { padding: "12px 16px", background: "#f8f9fa", textAlign: "left", fontSize: "13px", color: "#666", borderBottom: "1px solid #eee" },
  tr: { borderBottom: "1px solid #f0f0f0" },
  td: { padding: "12px 16px", fontSize: "14px" },
  badge: { padding: "4px 10px", borderRadius: "20px", fontSize: "12px", fontWeight: "600" },
  editBtn: { padding: "6px 12px", background: "#4f46e5", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer", marginRight: "6px", fontSize: "12px" },
  delBtn: { padding: "6px 12px", background: "#ef4444", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "12px" },
  empty: { padding: "24px", textAlign: "center", color: "#999" },
};
