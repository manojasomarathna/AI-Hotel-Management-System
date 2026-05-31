import { useEffect, useState } from "react";
import api from "../services/api";

const empty = { name: "", email: "", phone: "", position: "", salary: 0 };

export default function Employees() {
  const [employees, setEmployees] = useState([]);
  const [form, setForm] = useState(empty);
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [tab, setTab] = useState("list"); // list | attendance | leave

  const load = () => api.get("/employees/").then((r) => setEmployees(r.data));
  useEffect(() => { load(); }, []);

  const save = async (e) => {
    e.preventDefault();
    if (editId) await api.put(`/employees/${editId}`, form);
    else await api.post("/employees/", form);
    setForm(empty); setEditId(null); setShowForm(false); load();
  };

  const remove = async (id) => {
    await api.delete(`/employees/${id}`); load();
  };

  const markAttendance = async (id, status) => {
    await api.post("/employees/attendance", { employee_id: id, status });
    alert(`Attendance marked: ${status}`);
  };

  return (
    <div style={s.page}>
      <div style={s.header}>
        <h2>👥 Employees</h2>
        <button style={s.btn} onClick={() => { setShowForm(!showForm); setForm(empty); setEditId(null); }}>
          {showForm ? "Cancel" : "+ Add Employee"}
        </button>
      </div>

      {/* Tabs */}
      <div style={s.tabs}>
        {["list", "attendance"].map((t) => (
          <button key={t} style={{ ...s.tab, ...(tab === t ? s.activeTab : {}) }} onClick={() => setTab(t)}>
            {t === "list" ? "👥 List" : "📋 Attendance"}
          </button>
        ))}
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <form onSubmit={save} style={s.form}>
          <div style={s.formGrid}>
            {["name", "email", "phone", "position"].map((f) => (
              <input key={f} style={s.input} placeholder={f.charAt(0).toUpperCase() + f.slice(1)}
                value={form[f]} onChange={(e) => setForm({ ...form, [f]: e.target.value })}
                required={f === "name"} />
            ))}
            <input style={s.input} type="number" placeholder="Salary"
              value={form.salary} onChange={(e) => setForm({ ...form, salary: e.target.value })} />
          </div>
          <button style={s.btn} type="submit">{editId ? "Update" : "Save"}</button>
        </form>
      )}

      {/* Employee List */}
      {tab === "list" && (
        <div style={s.tableWrap}>
          <table style={s.table}>
            <thead>
              <tr>{["Name", "Email", "Phone", "Position", "Salary", "Actions"].map((h) => <th key={h} style={s.th}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {employees.map((e) => (
                <tr key={e.id} style={s.tr}>
                  <td style={s.td}>{e.name}</td>
                  <td style={s.td}>{e.email}</td>
                  <td style={s.td}>{e.phone}</td>
                  <td style={s.td}>{e.position}</td>
                  <td style={s.td}>${e.salary}</td>
                  <td style={s.td}>
                    <button style={s.editBtn} onClick={() => { setForm(e); setEditId(e.id); setShowForm(true); }}>Edit</button>
                    <button style={s.delBtn} onClick={() => remove(e.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {employees.length === 0 && <p style={s.empty}>No employees found.</p>}
        </div>
      )}

      {/* Attendance Tab */}
      {tab === "attendance" && (
        <div style={s.tableWrap}>
          <table style={s.table}>
            <thead>
              <tr>{["Name", "Position", "Mark Attendance"].map((h) => <th key={h} style={s.th}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {employees.map((e) => (
                <tr key={e.id} style={s.tr}>
                  <td style={s.td}>{e.name}</td>
                  <td style={s.td}>{e.position}</td>
                  <td style={s.td}>
                    <button style={{ ...s.editBtn, background: "#10b981" }} onClick={() => markAttendance(e.id, "present")}>Present</button>
                    <button style={{ ...s.editBtn, background: "#f59e0b" }} onClick={() => markAttendance(e.id, "late")}>Late</button>
                    <button style={s.delBtn} onClick={() => markAttendance(e.id, "absent")}>Absent</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
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
  editBtn: { padding: "6px 12px", background: "#4f46e5", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer", marginRight: "6px", fontSize: "12px" },
  delBtn: { padding: "6px 12px", background: "#ef4444", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "12px" },
  empty: { padding: "24px", textAlign: "center", color: "#999" },
};
