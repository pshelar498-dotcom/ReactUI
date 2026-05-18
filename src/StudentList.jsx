import React, { useEffect, useRef, useState, useContext } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { confirmDialog, ConfirmDialog } from "primereact/confirmdialog";
import { Toast } from "primereact/toast";
import { Sidebar } from "primereact/sidebar";
import { Accordion, AccordionTab } from "primereact/accordion";
import { useNavigate } from "react-router-dom";
import "primeicons/primeicons.css";
import API_CONFIG from "./api";
import { ThemeContext } from "./Context/ThemeContext";

function StudentList() {
  const toast = useRef(null);
  const navigate = useNavigate();

  const { darkMode, setDarkMode } = useContext(ThemeContext);

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const isAdmin = role === "Admin";

  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [newStudent, setNewStudent] = useState({
    studentId: 0,
    firstName: "",
    lastName: "",
    age: "",
    class: "",
    phoneNumber: "",
    isActive: true,
  });

  // ─── THEME TOKENS ───────────────────────────────────────────────
  const t = {
    pageBg:      darkMode ? "#0a0f1e"  : "#f1f5f9",
    cardBg:      darkMode ? "#0f172a"  : "#ffffff",
    cardBorder:  darkMode ? "#1e293b"  : "#e2e8f0",
    inputBg:     darkMode ? "#1e293b"  : "#f8fafc",
    inputBorder: darkMode ? "#334155"  : "#cbd5e1",
    textPrimary: darkMode ? "#f8fafc"  : "#0f172a",
    textMuted:   darkMode ? "#94a3b8"  : "#64748b",
    sidebarBg:   darkMode ? "#0a0f1e"  : "#ffffff",
  };

  // ─── INJECT GLOBAL CSS FOR PRIMEREACT OVERRIDES ─────────────────
  useEffect(() => {
    const styleId = "stu-dark-override";
    let el = document.getElementById(styleId);
    if (!el) {
      el = document.createElement("style");
      el.id = styleId;
      document.head.appendChild(el);
    }

    if (darkMode) {
      el.textContent = `
        /* ── Accordion header ── */
        .stu-page .p-accordion .p-accordion-header .p-accordion-header-link {
          background: #1e293b !important;
          color: #f8fafc !important;
          border: 1px solid #334155 !important;
          border-radius: 12px !important;
          font-weight: 600 !important;
          transition: background 0.2s !important;
        }
        .stu-page .p-accordion .p-accordion-header:not(.p-disabled).p-highlight .p-accordion-header-link {
          background: #1e3a5f !important;
          color: #93c5fd !important;
          border-color: #3b82f6 !important;
        }
        .stu-page .p-accordion .p-accordion-header .p-accordion-header-link:focus {
          box-shadow: 0 0 0 2px #3b82f6 !important;
        }
        .stu-page .p-accordion .p-accordion-header .p-accordion-toggle-icon {
          color: #94a3b8 !important;
        }

        /* ── Accordion content ── */
        .stu-page .p-accordion .p-accordion-content {
          background: #0f172a !important;
          color: #f8fafc !important;
          border: 1px solid #1e293b !important;
          border-top: none !important;
          border-radius: 0 0 12px 12px !important;
        }

        /* ── DataTable header ── */
        .stu-page .p-datatable .p-datatable-thead > tr > th {
          background: #0a0f1e !important;
          color: #94a3b8 !important;
          border: 1px solid #1e293b !important;
          font-size: 13px !important;
          letter-spacing: 0.05em !important;
          text-transform: uppercase !important;
        }

        /* ── DataTable rows ── */
        .stu-page .p-datatable .p-datatable-tbody > tr {
          background: #0f172a !important;
          color: #e2e8f0 !important;
          border-bottom: 1px solid #1e293b !important;
          transition: background 0.15s !important;
        }
        .stu-page .p-datatable .p-datatable-tbody > tr:nth-child(even) {
          background: #111827 !important;
        }
        .stu-page .p-datatable .p-datatable-tbody > tr:hover {
          background: #1e293b !important;
        }
        .stu-page .p-datatable .p-datatable-tbody > tr > td {
          border: 1px solid #1e293b !important;
          color: #e2e8f0 !important;
        }
        .stu-page .p-datatable .p-datatable-wrapper {
          border-radius: 14px !important;
          overflow: hidden !important;
        }

        /* ── Paginator ── */
        .stu-page .p-paginator {
          background: #0f172a !important;
          color: #94a3b8 !important;
          border: 1px solid #1e293b !important;
          border-top: none !important;
        }
        .stu-page .p-paginator .p-paginator-element {
          color: #94a3b8 !important;
          background: transparent !important;
          border-radius: 8px !important;
        }
        .stu-page .p-paginator .p-paginator-element:hover {
          background: #1e293b !important;
          color: #f8fafc !important;
        }
        .stu-page .p-paginator .p-highlight,
        .stu-page .p-paginator .p-paginator-pages .p-paginator-page.p-highlight {
          background: #1d4ed8 !important;
          color: #ffffff !important;
        }

        /* ── InputText ── */
        .stu-page .p-inputtext {
          background: #1e293b !important;
          color: #f8fafc !important;
          border: 1px solid #334155 !important;
        }
        .stu-page .p-inputtext::placeholder {
          color: #64748b !important;
        }
        .stu-page .p-inputtext:focus {
          border-color: #3b82f6 !important;
          box-shadow: 0 0 0 2px rgba(59,130,246,0.25) !important;
        }

        /* ── Sidebar ── */
        .stu-page-sidebar .p-sidebar {
          background: #0a0f1e !important;
          color: #f8fafc !important;
          border-right: 1px solid #1e293b !important;
        }
        .stu-page-sidebar .p-sidebar .p-sidebar-close {
          color: #94a3b8 !important;
        }
        .stu-page-sidebar .p-sidebar .p-sidebar-close:hover {
          background: #1e293b !important;
        }

        /* ── Confirm Dialog ── */
        .p-confirm-dialog {
          background: #0f172a !important;
          color: #f8fafc !important;
          border: 1px solid #334155 !important;
        }
        .p-confirm-dialog .p-dialog-header {
          background: #0f172a !important;
          color: #f8fafc !important;
          border-bottom: 1px solid #334155 !important;
        }
        .p-confirm-dialog .p-dialog-content {
          background: #0f172a !important;
          color: #cbd5e1 !important;
        }
        .p-confirm-dialog .p-dialog-footer {
          background: #0f172a !important;
          border-top: 1px solid #334155 !important;
        }
      `;
    } else {
      el.textContent = `
        /* ── Accordion header ── */
        .stu-page .p-accordion .p-accordion-header .p-accordion-header-link {
          background: #f8fafc !important;
          color: #0f172a !important;
          border: 1px solid #e2e8f0 !important;
          border-radius: 12px !important;
          font-weight: 600 !important;
        }
        .stu-page .p-accordion .p-accordion-header:not(.p-disabled).p-highlight .p-accordion-header-link {
          background: #eff6ff !important;
          color: #1d4ed8 !important;
          border-color: #bfdbfe !important;
        }

        /* ── Accordion content ── */
        .stu-page .p-accordion .p-accordion-content {
          background: #ffffff !important;
          color: #0f172a !important;
          border: 1px solid #e2e8f0 !important;
          border-top: none !important;
          border-radius: 0 0 12px 12px !important;
        }

        /* ── DataTable header ── */
        .stu-page .p-datatable .p-datatable-thead > tr > th {
          background: #1e293b !important;
          color: #e2e8f0 !important;
          border: 1px solid #334155 !important;
          font-size: 13px !important;
          text-transform: uppercase !important;
          letter-spacing: 0.05em !important;
        }

        /* ── DataTable rows ── */
        .stu-page .p-datatable .p-datatable-tbody > tr {
          background: #ffffff !important;
          color: #1e293b !important;
          border-bottom: 1px solid #e2e8f0 !important;
        }
        .stu-page .p-datatable .p-datatable-tbody > tr:nth-child(even) {
          background: #f8fafc !important;
        }
        .stu-page .p-datatable .p-datatable-tbody > tr:hover {
          background: #eff6ff !important;
        }
        .stu-page .p-datatable .p-datatable-tbody > tr > td {
          border: 1px solid #e2e8f0 !important;
          color: #1e293b !important;
        }
        .stu-page .p-datatable .p-datatable-wrapper {
          border-radius: 14px !important;
          overflow: hidden !important;
        }

        /* ── Paginator ── */
        .stu-page .p-paginator {
          background: #f8fafc !important;
          color: #64748b !important;
          border: 1px solid #e2e8f0 !important;
          border-top: none !important;
        }
        .stu-page .p-paginator .p-paginator-element {
          color: #64748b !important;
          border-radius: 8px !important;
        }
        .stu-page .p-paginator .p-highlight,
        .stu-page .p-paginator .p-paginator-pages .p-paginator-page.p-highlight {
          background: #1d4ed8 !important;
          color: #ffffff !important;
        }

        /* ── InputText ── */
        .stu-page .p-inputtext {
          background: #f8fafc !important;
          color: #0f172a !important;
          border: 1px solid #cbd5e1 !important;
        }
        .stu-page .p-inputtext:focus {
          border-color: #3b82f6 !important;
          box-shadow: 0 0 0 2px rgba(59,130,246,0.2) !important;
        }
      `;
    }
  }, [darkMode]);

  // ─── API HELPERS ─────────────────────────────────────────────────
  const authHeader = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/");
  };

  const checkUnauthorized = (res) => {
    if (res.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      navigate("/");
      return true;
    }
    return false;
  };

  const fetchStudents = async () => {
    try {
      const res = await fetch(API_CONFIG.STUDENT_URL, { method: "GET", headers: authHeader });
      if (checkUnauthorized(res)) return;
      const data = await res.json();
      setStudents(data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => {
    if (!token) { navigate("/"); return; }
    fetchStudents();
  }, []);

  // ─── FORM HANDLERS ───────────────────────────────────────────────
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewStudent({ ...newStudent, [name]: type === "checkbox" ? checked : value });
  };

  const resetForm = () => {
    setNewStudent({ studentId: 0, firstName: "", lastName: "", age: "", class: "", phoneNumber: "", isActive: true });
    setIsEdit(false);
    setActiveIndex(0);
  };

  // ─── CRUD ────────────────────────────────────────────────────────
  const createStudent = async () => {
    try {
      const res = await fetch(API_CONFIG.STUDENT_URL, {
        method: "POST", headers: authHeader,
        body: JSON.stringify({ ...newStudent, studentId: Number(newStudent.studentId) }),
      });
      if (checkUnauthorized(res)) return;
      fetchStudents(); resetForm();
      toast.current.show({ severity: "success", summary: "Success", detail: "Student Added", life: 3000 });
    } catch (err) { console.error(err); }
  };

  const updateStudent = async () => {
    try {
      const res = await fetch(API_CONFIG.STUDENT_URL, { method: "PUT", headers: authHeader, body: JSON.stringify(newStudent) });
      if (checkUnauthorized(res)) return;
      fetchStudents(); resetForm();
      toast.current.show({ severity: "success", summary: "Updated", detail: "Student Updated", life: 3000 });
    } catch (err) { console.error(err); }
  };

  const editStudent = (stu) => {
    setNewStudent(stu);
    setIsEdit(true);
    setActiveIndex(0);
  };

  const deleteStudent = async (id) => {
    try {
      const res = await fetch(`${API_CONFIG.STUDENT_URL}/${id}`, {
        method: "DELETE", headers: { Authorization: `Bearer ${token}` },
      });
      if (checkUnauthorized(res)) return;
      fetchStudents();
      toast.current.show({ severity: "warn", summary: "Deleted", detail: "Student Deleted", life: 3000 });
    } catch (err) { console.error(err); }
  };

  const confirmDelete = (id) => {
    confirmDialog({
      message: "Are you sure you want to delete?",
      header: "Delete Confirmation",
      icon: "pi pi-exclamation-triangle",
      accept: async () => await deleteStudent(id),
    });
  };

  const filteredStudents = students.filter((stu) =>
    Object.values(stu).join(" ").toLowerCase().includes(search.toLowerCase())
  );

  // ─── SHARED STYLES ───────────────────────────────────────────────
  const card = {
    background: t.cardBg,
    border: `1px solid ${t.cardBorder}`,
    borderRadius: "18px",
    transition: "background 0.3s, border-color 0.3s",
  };

  const inputStyle = {
    background: t.inputBg,
    color: t.textPrimary,
    border: `1px solid ${t.inputBorder}`,
    borderRadius: "10px",
    padding: "12px",
    transition: "background 0.3s, color 0.3s",
  };

  const btn = (bg) => ({
    background: bg,
    border: "none",
    borderRadius: "12px",
  });

  // ─── STATUS BADGE ─────────────────────────────────────────────────
  const statusBody = (row) => (
    <span style={{
      display: "inline-block",
      padding: "4px 14px",
      borderRadius: "999px",
      fontSize: "12px",
      fontWeight: 600,
      background: row.isActive ? "rgba(34,197,94,0.15)" : "rgba(239,68,68,0.12)",
      color: row.isActive ? "#22c55e" : "#f87171",
    }}>
      {row.isActive ? "Active" : "Inactive"}
    </span>
  );

  // ─── ACTION BODY ─────────────────────────────────────────────────
  const actionBody = (row) => (
    <div style={{ display: "flex", gap: "8px" }}>
      <Button
        icon="pi pi-pencil"
        onClick={() => editStudent(row)}
        style={{ ...btn("#f59e0b"), width: 42, height: 42 }}
        tooltip="Edit" tooltipOptions={{ position: "top" }}
      />
      <Button
        icon="pi pi-trash"
        onClick={() => confirmDelete(row.studentId)}
        style={{ ...btn("#ef4444"), width: 42, height: 42 }}
        tooltip="Delete" tooltipOptions={{ position: "top" }}
      />
    </div>
  );

  // ─── RENDER ──────────────────────────────────────────────────────
  return (
    <div
      className="stu-page"
      style={{
        minHeight: "100vh",
        background: darkMode
          ? "linear-gradient(160deg,#020617 0%,#0a0f1e 50%,#0f172a 100%)"
          : "#f1f5f9",
        padding: "24px",
        transition: "background 0.3s",
      }}
    >
      <Toast ref={toast} />
      <ConfirmDialog />

      {/* ── SIDEBAR ── */}
      <div className="stu-page-sidebar">
        <Sidebar
          visible={sidebarVisible}
          position="left"
          onHide={() => setSidebarVisible(false)}
          style={{ width: 280, background: t.sidebarBg, color: t.textPrimary, borderRight: `1px solid ${t.cardBorder}` }}
        >
          <div style={{ padding: "8px 0 20px" }}>
            <h2 style={{ color: t.textPrimary, marginBottom: 20, fontSize: 20, fontWeight: 700 }}>
              ☰ &nbsp;Menu
            </h2>

            {[
              { label: "Employee",   icon: "pi pi-users",    path: "/employee",   bg: "#2563eb" },
              { label: "Student",    icon: "pi pi-book",     path: "/student",    bg: "#7c3aed" },
              { label: "Department", icon: "pi pi-building", path: "/department", bg: "#0d9488" },
            ].map((item) => (
              <Button
                key={item.label}
                label={item.label}
                icon={item.icon}
                onClick={() => navigate(item.path)}
                style={{ ...btn(item.bg), width: "100%", marginBottom: 10, justifyContent: "flex-start" }}
              />
            ))}

            <div style={{ margin: "12px 0", borderTop: `1px solid ${t.cardBorder}` }} />

            <Button
              label={darkMode ? "Light Mode" : "Dark Mode"}
              icon={darkMode ? "pi pi-sun" : "pi pi-moon"}
              onClick={() => setDarkMode(!darkMode)}
              style={{
                ...btn(darkMode ? "#d97706" : "#1e293b"),
                width: "100%",
                marginBottom: 10,
                justifyContent: "flex-start",
              }}
            />

            <Button
              label="Logout"
              icon="pi pi-sign-out"
              onClick={handleLogout}
              style={{ ...btn("#dc2626"), width: "100%", justifyContent: "flex-start" }}
            />
          </div>
        </Sidebar>
      </div>

      {/* ── HEADER ── */}
      <div style={{ ...card, padding: "18px 24px", marginBottom: 24, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <Button
            icon="pi pi-bars"
            onClick={() => setSidebarVisible(true)}
            style={btn("#2563eb")}
          />
          <div>
            <h2 style={{ margin: 0, color: t.textPrimary, fontSize: 20, fontWeight: 700 }}>
              Student Management
            </h2>
            <small style={{ color: t.textMuted }}>Logged in as: {role}</small>
          </div>
        </div>

        <Button
          icon={darkMode ? "pi pi-sun" : "pi pi-moon"}
          label={darkMode ? "Light" : "Dark"}
          onClick={() => setDarkMode(!darkMode)}
          style={{ ...btn(darkMode ? "#d97706" : "#334155"), fontSize: 13 }}
        />
      </div>

      {/* ── ACCORDION ── */}
      <div style={{ ...card, padding: 12 }}>
        <Accordion
          activeIndex={activeIndex}
          onTabChange={(e) => setActiveIndex(e.index)}
        >
          {/* FORM TAB */}
          {isAdmin && (
            <AccordionTab header="🎓  Student Form">
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 14 }}>
                {["studentId", "firstName", "lastName", "age", "class", "phoneNumber"].map((field) => (
                  <InputText
                    key={field}
                    name={field}
                    placeholder={field.replace(/([A-Z])/g, " $1").trim()}
                    value={newStudent[field]}
                    onChange={handleChange}
                    disabled={field === "studentId" && isEdit}
                    style={inputStyle}
                  />
                ))}
              </div>

              <div style={{ marginTop: 16, color: t.textPrimary, display: "flex", alignItems: "center", gap: 8 }}>
                <input
                  type="checkbox"
                  name="isActive"
                  checked={newStudent.isActive}
                  onChange={handleChange}
                  style={{ width: 16, height: 16, accentColor: "#3b82f6", cursor: "pointer" }}
                />
                <span style={{ fontSize: 14 }}>Active</span>
              </div>

              <div style={{ marginTop: 18, display: "flex", gap: 10, flexWrap: "wrap" }}>
                {isEdit ? (
                  <>
                    <Button label="Update" icon="pi pi-check" onClick={updateStudent} style={btn("#16a34a")} />
                    <Button label="Cancel" icon="pi pi-times" onClick={resetForm}      style={btn("#f59e0b")} />
                  </>
                ) : (
                  <Button label="Add Student" icon="pi pi-plus" onClick={createStudent} style={btn("#2563eb")} />
                )}
              </div>
            </AccordionTab>
          )}

          {/* LIST TAB */}
          <AccordionTab header="📋  Student List">
            <div style={{ marginBottom: 16 }}>
              <InputText
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search student..."
                style={{ ...inputStyle, width: 300, borderRadius: 14 }}
              />
            </div>

            <DataTable
              value={filteredStudents}
              paginator
              rows={5}
              responsiveLayout="scroll"
              emptyMessage={<span style={{ color: t.textMuted }}>No students found.</span>}
            >
              <Column field="studentId"   header="ID"         style={{ width: 70 }} />
              <Column field="firstName"   header="First Name" />
              <Column field="lastName"    header="Last Name"  />
              <Column field="age"         header="Age"        style={{ width: 80 }} />
              <Column field="class"       header="Class"      />
              <Column field="phoneNumber" header="Phone"      />
              <Column field="isActive"    header="Status"     body={statusBody} />
              {isAdmin && (
                <Column header="Action" body={actionBody} style={{ width: 120 }} />
              )}
            </DataTable>
          </AccordionTab>
        </Accordion>
      </div>
    </div>
  );
}

export default StudentList;

// import React, { useEffect, useRef, useState } from "react";

// import { DataTable } from "primereact/datatable";
// import { Column } from "primereact/column";

// import "primereact/resources/themes/lara-light-cyan/theme.css";
// import "primeicons/primeicons.css";

// import { Button } from "primereact/button";
// import { InputText } from "primereact/inputtext";

// import {
//   confirmDialog,
//   ConfirmDialog
// } from "primereact/confirmdialog";

// import { Toast } from "primereact/toast";

// import { Sidebar } from "primereact/sidebar";

// import { Accordion, AccordionTab } from "primereact/accordion";

// import { useNavigate } from "react-router-dom";

// import API_CONFIG from "./api";

// function StudentList() {

//   const toast = useRef(null);

//   const navigate = useNavigate();

//   // TOKEN + ROLE
//   const token = localStorage.getItem("token");
//   const role = localStorage.getItem("role");

//   // ROLE CHECK
//   const isAdmin = role === "Admin";
//   const isSuperUser = role === "SuperUser";
//   const isUser = role === "User";

//   // SIDEBAR
//   const [sidebarVisible, setSidebarVisible] = useState(false);

//   // STUDENT STATE
//   const [students, setStudents] = useState([]);

//   const [search, setSearch] = useState("");

//   const [isEdit, setIsEdit] = useState(false);

//   const [activeIndex, setActiveIndex] = useState(0);

//   const [newStudent, setNewStudent] = useState({
//     studentId: 0,
//     firstName: "",
//     lastName: "",
//     age: "",
//     class: "",
//     phoneNumber: "",
//     isActive: true
//   });

//   // LOGOUT
//   const handleLogout = () => {

//     localStorage.removeItem("token");
//     localStorage.removeItem("role");

//     navigate("/");
//   };

//   // AUTH HEADER
//   const authHeader = {
//     "Content-Type": "application/json",
//     Authorization: `Bearer ${token}`
//   };

//   // UNAUTHORIZED
//   const checkUnauthorized = (res) => {

//     if (res.status === 401) {

//       localStorage.removeItem("token");
//       localStorage.removeItem("role");

//       navigate("/");

//       return true;
//     }

//     return false;
//   };

//   // FETCH STUDENTS
//   const fetchStudents = async () => {

//     try {

//       const res = await fetch(
//         API_CONFIG.STUDENT_URL,
//         {
//           method: "GET",
//           headers: authHeader
//         }
//       );

//       if (checkUnauthorized(res)) return;

//       const data = await res.json();

//       setStudents(data);

//     } catch (err) {

//       console.error(err);

//     }
//   };

//   // PAGE LOAD
//   useEffect(() => {

//     if (!token) {

//       navigate("/");
//       return;
//     }

//     fetchStudents();

//   }, []);

//   // HANDLE CHANGE
//   const handleChange = (e) => {

//     const { name, value, type, checked } = e.target;

//     setNewStudent({
//       ...newStudent,
//       [name]: type === "checkbox"
//         ? checked
//         : value
//     });
//   };

//   // RESET FORM
//   const resetForm = () => {

//     setNewStudent({
//       studentId: 0,
//       firstName: "",
//       lastName: "",
//       age: "",
//       class: "",
//       phoneNumber: "",
//       isActive: true
//     });

//     setIsEdit(false);

//     setActiveIndex(1);
//   };

//   // CREATE
//   const createStudent = async () => {

//     try {

//       const res = await fetch(
//         API_CONFIG.STUDENT_URL,
//         {
//           method: "POST",
//           headers: authHeader,
//           body: JSON.stringify({
//             ...newStudent,
//             studentId: Number(newStudent.studentId)
//           })
//         }
//       );

//       if (checkUnauthorized(res)) return;

//       if (!res.ok) {

//         throw new Error("Add failed");
//       }

//       fetchStudents();

//       resetForm();

//       toast.current.show({
//         severity: "success",
//         summary: "Success",
//         detail: "Student Added",
//         life: 3000
//       });

//     } catch (err) {

//       console.error(err);

//       toast.current.show({
//         severity: "error",
//         summary: "Error",
//         detail: "Unable to add student",
//         life: 3000
//       });
//     }
//   };

//   // EDIT
//   const editStudent = (stu) => {

//     setNewStudent(stu);

//     setIsEdit(true);

//     setActiveIndex(0);
//   };

//   // UPDATE
//   const updateStudent = async () => {

//     try {

//       const res = await fetch(
//         API_CONFIG.STUDENT_URL,
//         {
//           method: "PUT",
//           headers: authHeader,
//           body: JSON.stringify(newStudent)
//         }
//       );

//       if (checkUnauthorized(res)) return;

//       if (!res.ok) {

//         throw new Error("Update failed");
//       }

//       fetchStudents();

//       resetForm();

//       toast.current.show({
//         severity: "success",
//         summary: "Updated",
//         detail: "Student Updated",
//         life: 3000
//       });

//     } catch (err) {

//       console.error(err);

//       toast.current.show({
//         severity: "error",
//         summary: "Error",
//         detail: "Unable to update student",
//         life: 3000
//       });
//     }
//   };

//   // DELETE
//   const deleteStudent = async (id) => {

//     try {

//       const res = await fetch(
//         `${API_CONFIG.STUDENT_URL}/${id}`,
//         {
//           method: "DELETE",
//           headers: {
//             Authorization: `Bearer ${token}`
//           }
//         }
//       );

//       if (checkUnauthorized(res)) return;

//       if (!res.ok) {

//         throw new Error("Delete failed");
//       }

//       fetchStudents();

//       toast.current.show({
//         severity: "warn",
//         summary: "Deleted",
//         detail: "Student Deleted",
//         life: 3000
//       });

//     } catch (err) {

//       console.error(err);

//     }
//   };

//   // DELETE CONFIRM
//  const confirmDelete = (id) => {

//   confirmDialog({
//     message: "Are you sure you want to delete?",
//     header: "Delete Confirmation",
//     icon: "pi pi-exclamation-triangle",

//     accept: async () => {

//       await deleteStudent(id);

//     }
//   });
//   };

//   // SEARCH FILTER
//   const filteredStudents = students.filter((stu) =>
//     Object.values(stu)
//       .join(" ")
//       .toLowerCase()
//       .includes(search.toLowerCase())
//   );

//   return (

//     <div
//       style={{
//         minHeight: "100vh",
//         background: "linear-gradient(135deg,#e0f2fe,#eef2ff,#f8fafc)",
//         padding: "25px"
//       }}
//     >

//       <Toast ref={toast} />

//       <ConfirmDialog />

//       {/* SIDEBAR */}
//       <Sidebar
//         visible={sidebarVisible}
//         position="left"
//         onHide={() => setSidebarVisible(false)}
//         style={{
//           width: "280px",
//           borderTopRightRadius: "20px",
//           borderBottomRightRadius: "20px"
//         }}
//       >

//         <h2 style={{ color: "#1e293b", marginBottom: "20px" }}>
//           Menu
//         </h2>

//         <Button
//           label="Employee"
//           icon="pi pi-users"
//           style={{
//             width: "100%",
//             marginBottom: "12px",
//             borderRadius: "12px",
//             background: "#3b82f6",
//             border: "none"
//           }}
//           onClick={() => navigate("/employee")}
//         />

//         <Button
//           label="Student"
//           icon="pi pi-book"
//           style={{
//             width: "100%",
//             marginBottom: "12px",
//             borderRadius: "12px",
//             background: "#8b5cf6",
//             border: "none"
//           }}
//           onClick={() => navigate("/student")}
//         />

//         <Button
//           label="Department"
//           icon="pi pi-building"
//           style={{
//             width: "100%",
//             marginBottom: "12px",
//             borderRadius: "12px",
//             background: "#14b8a6",
//             border: "none"
//           }}
//           onClick={() => navigate("/department")}
//         />

//         <Button
//           label="Logout"
//           icon="pi pi-sign-out"
//           style={{
//             width: "100%",
//             borderRadius: "12px",
//             background: "#ef4444",
//             border: "none"
//           }}
//           onClick={handleLogout}
//         />

//       </Sidebar>

//       {/* HEADER */}
//       <div
//         style={{
//           background: "#ffffff",
//           padding: "18px 22px",
//           borderRadius: "18px",
//           boxShadow: "0 10px 25px rgba(0,0,0,.08)",
//           display: "flex",
//           justifyContent: "space-between",
//           alignItems: "center",
//           marginBottom: "25px"
//         }}
//       >

//         <div
//           style={{
//             display: "flex",
//             alignItems: "center",
//             gap: "12px"
//           }}
//         >

//           <Button
//             icon="pi pi-bars"
//             onClick={() => setSidebarVisible(true)}
//             style={{
//               borderRadius: "12px",
//               background: "#2563eb",
//               border: "none"
//             }}
//           />

//           <div>

//             <h2 style={{ margin: 0, color: "#0f172a" }}>
//               Student Management
//             </h2>

//             <small style={{ color: "#64748b" }}>
//               Logged In Role : {role}
//             </small>

//           </div>

//         </div>

//       </div>

//       {/* MAIN CARD */}
//       <div
//         style={{
//           background: "#ffffff",
//           borderRadius: "20px",
//           padding: "20px",
//           boxShadow: "0 12px 30px rgba(0,0,0,.08)"
//         }}
//       >

//         <Accordion
//           activeIndex={activeIndex}
//           onTabChange={(e) => setActiveIndex(e.index)}
//         >

//           {/* ADMIN ONLY FORM */}
//           {isAdmin && (

//             <AccordionTab header="Student Form">

//               <div
//                 style={{
//                   display: "grid",
//                   gridTemplateColumns:
//                     "repeat(auto-fit,minmax(220px,1fr))",
//                   gap: "15px",
//                   marginTop: "15px"
//                 }}
//               >

//                 <InputText
//                   name="studentId"
//                   placeholder="Student ID"
//                   value={newStudent.studentId}
//                   onChange={handleChange}
//                   disabled={isEdit}
//                 />

//                 <InputText
//                   name="firstName"
//                   placeholder="First Name"
//                   value={newStudent.firstName}
//                   onChange={handleChange}
//                 />

//                 <InputText
//                   name="lastName"
//                   placeholder="Last Name"
//                   value={newStudent.lastName}
//                   onChange={handleChange}
//                 />

//                 <InputText
//                   name="age"
//                   placeholder="Age"
//                   value={newStudent.age}
//                   onChange={handleChange}
//                 />

//                 <InputText
//                   name="class"
//                   placeholder="Class"
//                   value={newStudent.class}
//                   onChange={handleChange}
//                 />

//                 <InputText
//                   name="phoneNumber"
//                   placeholder="Phone Number"
//                   value={newStudent.phoneNumber}
//                   onChange={handleChange}
//                 />

//               </div>

//               <div style={{ marginTop: "15px" }}>

//                 <label>

//                   <input
//                     type="checkbox"
//                     name="isActive"
//                     checked={newStudent.isActive}
//                     onChange={handleChange}
//                     style={{ marginRight: "8px" }}
//                   />

//                   Active

//                 </label>

//               </div>

//               <div
//                 style={{
//                   marginTop: "18px",
//                   display: "flex",
//                   gap: "10px",
//                   flexWrap: "wrap"
//                 }}
//               >

//                 {isEdit ? (
//                   <>

//                     <Button
//                       label="Update"
//                       icon="pi pi-check"
//                       onClick={updateStudent}
//                       style={{
//                         borderRadius: "12px",
//                         background: "#16a34a",
//                         border: "none"
//                       }}
//                     />

//                     <Button
//                       label="Cancel"
//                       icon="pi pi-times"
//                       onClick={resetForm}
//                       style={{
//                         borderRadius: "12px",
//                         background: "#f59e0b",
//                         border: "none"
//                       }}
//                     />

//                   </>
//                 ) : (

//                   <Button
//                     label="Add Student"
//                     icon="pi pi-plus"
//                     onClick={createStudent}
//                     style={{
//                       borderRadius: "12px",
//                       background: "#2563eb",
//                       border: "none"
//                     }}
//                   />

//                 )}

//               </div>

//             </AccordionTab>

//           )}

//           {/* STUDENT LIST */}
//           <AccordionTab header="Student List">

//             <div
//               style={{
//                 marginBottom: "15px",
//                 marginTop: "10px"
//               }}
//             >

//               <InputText
//                 value={search}
//                 onChange={(e) => setSearch(e.target.value)}
//                 placeholder="Search student..."
//                 style={{
//                   width: "300px",
//                   borderRadius: "12px"
//                 }}
//               />

//             </div>

//             <DataTable
//               value={filteredStudents}
//               paginator
//               rows={5}
//               stripedRows
//               showGridlines
//               responsiveLayout="scroll"
//             >

//               <Column field="studentId" header="ID" />

//               <Column field="firstName" header="First Name" />

//               <Column field="lastName" header="Last Name" />

//               <Column field="age" header="Age" />

//               <Column field="class" header="Class" />

//               <Column field="phoneNumber" header="Phone" />

//               <Column
//                 field="isActive"
//                 header="Status"
//                 body={(row) =>
//                   row.isActive
//                     ? "Active"
//                     : "Inactive"
//                 }
//               />

//               {/* ADMIN ONLY ACTION */}
//               {isAdmin && (

//                 <Column
//                   header="Action"
//                   body={(row) => (

//                     <div
//                       style={{
//                         display: "flex",
//                         gap: "8px"
//                       }}
//                     >

//                       <Button
//                         icon="pi pi-pencil"
//                         onClick={() => editStudent(row)}
//                         style={{
//                           background: "#f59e0b",
//                           border: "none",
//                           borderRadius: "10px"
//                         }}
//                       />

//                       <Button
//   icon="pi pi-trash"
//   onClick={() => confirmDelete(row.studentId)}
//   style={{
//     background: "#ef4444",
//     border: "none",
//     borderRadius: "10px"
//   }}
// />

//                     </div>
//                   )}
//                 />

//               )}

//             </DataTable>

//           </AccordionTab>

//         </Accordion>

//       </div>

//     </div>
//   );
// }

// export default StudentList;


// import { DataTable } from "primereact/datatable";
// import { Column } from "primereact/column";
// import "primereact/resources/themes/lara-light-cyan/theme.css";
// import "primeicons/primeicons.css";
// import { Button } from "primereact/button";
// import { InputText } from "primereact/inputtext";
// import { confirmDialog, ConfirmDialog } from "primereact/confirmdialog";
// import { Toast } from "primereact/toast";
// import React, { useEffect, useRef, useState } from "react";
// import { Password } from "primereact/password";
// import { Sidebar } from "primereact/sidebar";
// import { useNavigate } from "react-router-dom";
// import { Accordion, AccordionTab } from "primereact/accordion";
// import API_CONFIG from "./api";   // ✅ add this
// function StudentList() {
//   const toast = useRef(null);
// const navigate = useNavigate();
// const token = localStorage.getItem("token");
// const handleLogout = () => {
//   localStorage.removeItem("token");
//   navigate("/");
// };
//   // LOGIN STATE
//   // const [isLogin, setIsLogin] = useState(false);
//   const [sidebarVisible, setSidebarVisible] = useState(false);
//   // const [loginData, setLoginData] = useState({
//   //   username: "",
//   //   password: ""
//   // });

//   // STUDENT STATE
//   const [students, setStudents] = useState([]);
//   const [search, setSearch] = useState("");
//   const [isEdit, setIsEdit] = useState(false);

//     const [activeIndex, setActiveIndex] = useState(1);
// // const [deleteId, setDeleteId] = useState(null);
// // const [showDeleteDialog, setShowDeleteDialog] = useState(false);
//   const [newStudent, setNewStudent] = useState({
//     studentId: 0,
//     firstName: "",
//     lastName: "",
//     age: "",
//     class: "",
//     phoneNumber: "",
//     isActive: true
//   });
//   //     const handleLogout = () => {
//   //   localStorage.removeItem("token");
//   //   navigate("/");
//   // };
//     const API_URL = API_CONFIG.STUDENT_URL;
//   // COMMON HEADER
//   const authHeader = {
//     "Content-Type": "application/json",
//     Authorization: `Bearer ${token}`
//   };

//   // GET ALL
//   const fetchStudents = async () => {
//     try {
//       const res = await fetch(API_CONFIG.STUDENT_URL, {
//         method: "GET",
//         headers: authHeader
//       });

//       if (res.status === 401) {
//         localStorage.removeItem("token");
//         navigate("/");
//         return;
//       }

//       const data = await res.json();
//       setStudents(data);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   useEffect(() => {
//     if (!token) {
//       navigate("/");
//       return;
//     }

//     fetchStudents();
//   }, []);

//   // INPUT
//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;

//     setNewStudent({
//       ...newStudent,
//       [name]: type === "checkbox" ? checked : value
//     });
//   };

//   //    // LOGIN FUNCTION
//   // const handleLogin = () => {
//   //   if (
//   //     loginData.username === "admin" &&
//   //     loginData.password === "12345"
//   //   ) {
//   //     setIsLogin(true);

//   //     toast.current.show({
//   //       severity: "success",
//   //       summary: "Success",
//   //       detail: "Login Successful",
//   //       life: 3000
//   //     });
//   //   } else {
//   //     toast.current.show({
//   //       severity: "error",
//   //       summary: "Error",
//   //       detail: "Invalid Username or Password",
//   //       life: 3000
//   //     });
//   //   }
//   // };

//   // // LOGOUT
//   // const handleLogout = () => {
//   //   setIsLogin(false);
//   //   setLoginData({
//   //     username: "",
//   //     password: ""
//   //   });
//   // };
//   // GET ALL
// //   const fetchStudents = () => {
// //     fetch("https://localhost:7175/api/Student")
// //       .then((res) => res.json())
// //       .then((data) => setStudents(data))
// //       .catch((err) => console.error(err));
// //   };

// //  useEffect(() => {
// //   const token = localStorage.getItem("token");

// //   if (!token) {
// //     navigate("/");
// //     return;
// //   }

// //   fetchStudents();
// // } [navigate];


// //   // HANDLE INPUT
// //   const handleChange = (e) => {
// //     const { name, value, type, checked } = e.target;

// //     setNewStudent({
// //       ...newStudent,
// //       [name]: type === "checkbox" ? checked : value
// //     });
// //   };

//   // RESET
//   const resetForm = () => {
//     setNewStudent({
//       studentId: 0,
//       firstName: "",
//       lastName: "",
//       age: "",
//       class: "",
//       phoneNumber: "",
//       isActive: true
//     });

//     setIsEdit(false);
//   };
//      // ADD
//   const createStudent = async () => {
//     try {
//       const res = await fetch(API_CONFIG.STUDENT_URL, {
//         method: "POST",
//         headers: authHeader,
//         body: JSON.stringify({
//           ...newStudent,
//           studentId: Number(newStudent.studentId)
//         })
//       });

//       if (res.status === 401) {
//         localStorage.removeItem("token");
//         navigate("/");
//         return;
//       }

//       fetchStudents();
//       resetForm();
//       setActiveIndex(1);
//     } catch (err) {
//       console.error(err);
//     }
//   };
//   // // ADD
//   // const createStudent = () => {
//   //   fetch("https://localhost:7175/api/Student", {
//   //     method: "POST",
//   //     headers: {
//   //       "Content-Type": "application/json"
//   //     },
//   //     body: JSON.stringify({
//   //       ...newStudent,
//   //       studentId: Number(newStudent.studentId)
//   //     })
//   //   })
//   //     .then(() => {
//   //       fetchStudents();
//   //       resetForm();
//   //       setActiveIndex(1);   // Open Student List tab automatically
//   //     })
//   //     .catch((err) => console.error(err));
//   // };

//   // EDIT
//   const editStudent = (stu) => {
//   setNewStudent(stu);
//   setIsEdit(true);
//   setActiveIndex(0);   // Open Student Form tab
// };
//     // UPDATE
//   const updateStudent = async () => {
//     try {
//       const res = await fetch(API_CONFIG.STUDENT_URL, {
//         method: "PUT",
//         headers: authHeader,
//         body: JSON.stringify(newStudent)
//       });

//       if (res.status === 401) {
//         localStorage.removeItem("token");
//         navigate("/");
//         return;
//       }

//       fetchStudents();
//       resetForm();
//       setActiveIndex(1);
//     } catch (err) {
//       console.error(err);
//     }
//   };
//        // DELETE
//   const deleteStudent = async (id) => {
//     try {
//       const res = await fetch(`${API_CONFIG.STUDENT_URL}/${id}`, {
//         method: "DELETE",
//         headers: {
//           Authorization: `Bearer ${token}`
//         }
//       });

//       if (res.status === 401) {
//         localStorage.removeItem("token");
//         navigate("/");
//         return;
//       }

//       fetchStudents();

//       toast.current.show({
//         severity: "warn",
//         summary: "Deleted",
//         detail: "Student Deleted",
//         life: 3000
//       });
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   // // UPDATE
//   // const updateStudent = () => {
//   //   fetch("https://localhost:7175/api/Student", {
//   //     method: "PUT",
//   //     headers: {
//   //       "Content-Type": "application/json"
//   //     },
//   //     body: JSON.stringify(newStudent)
//   //   })
//   //     .then(() => {
//   //       fetchStudents();
//   //       resetForm();
//   //       setActiveIndex(1);   // Open Student List tab automatically
//   //     })
//   //     .catch((err) => console.error(err));
//   // };

// //   // DELETE
// //  const deleteStudent = async (id) => {
// //   try {
// //     await fetch(`https://localhost:7175/api/Student/${id}`, {
// //       method: "DELETE"
// //     });

// //     fetchStudents();

// //     toast.current.show({
// //       severity: "warn",
// //       summary: "Deleted",
// //       detail: "Student Deleted",
// //       life: 3000
// //     });
// //   } catch (err) {
// //     console.error(err);
// //   }
// // };

// // const confirmDelete = (id) => {
// //   confirmDialog({
// //     message: "Are you sure you want to delete?",
// //     header: "Delete Confirmation",
// //     icon: "pi pi-exclamation-triangle",
// //     acceptLabel: "Yes",
// //     rejectLabel: "No",
// //     accept:  () => {
// //        deleteStudent(id);
// {     }
  
//   //    // YES CLICK
//   // const acceptDelete = async () => {
//   //   await deleteStudent(deleteId);
//   //   setShowDeleteDialog(false);
//   // };

//   // // NO CLICK
//   // const rejectDelete = () => {
//   //   setShowDeleteDialog(false);
//   // };  
//   // SEARCH FILTER
//   const filteredStudents = students.filter((stu) =>
//     Object.values(stu)
//       .join(" ")
//       .toLowerCase()
//       .includes(search.toLowerCase())
//   );
//       // LOGIN PAGE
  
//  return (
//   <div
//     style={{
//       minHeight: "100vh",
//       background: "linear-gradient(135deg,#e0f2fe,#eef2ff,#f8fafc)",
//       padding: "25px"
//     }}
//   >
//     <Toast ref={toast} />
//     <ConfirmDialog />

//     {/* Sidebar */}
//     <Sidebar
//       visible={sidebarVisible}
//       position="left"
//       onHide={() => setSidebarVisible(false)}
//       style={{
//         width: "280px",
//         borderTopRightRadius: "20px",
//         borderBottomRightRadius: "20px"
//       }}
//     >
//       <h2 style={{ color: "#1e293b", marginBottom: "20px" }}>Menu</h2>

//       <Button
//         label="Employee"
//         icon="pi pi-users"
//         style={{
//           width: "100%",
//           marginBottom: "12px",
//           borderRadius: "12px",
//           background: "#3b82f6",
//           border: "none"
//         }}
//         onClick={() => navigate("/employee")}
//       />

//       <Button
//         label="Student"
//         icon="pi pi-book"
//         style={{
//           width: "100%",
//           marginBottom: "12px",
//           borderRadius: "12px",
//           background: "#8b5cf6",
//           border: "none"
//         }}
//         onClick={() => navigate("/student")}
//       />

//       <Button
//         label="Department"
//         icon="pi pi-building"
//         style={{
//           width: "100%",
//           marginBottom: "12px",
//           borderRadius: "12px",
//           background: "#14b8a6",
//           border: "none"
//         }}
//         onClick={() => navigate("/department")}
//       />

//       <Button
//         label="Logout"
//         icon="pi pi-sign-out"
//         style={{
//           width: "100%",
//           borderRadius: "12px",
//           background: "#ef4444",
//           border: "none"
//         }}
//         onClick={handleLogout}
//       />
//     </Sidebar>

//     {/* Header */}
//     <div
//       style={{
//         background: "#ffffff",
//         padding: "18px 22px",
//         borderRadius: "18px",
//         boxShadow: "0 10px 25px rgba(0,0,0,.08)",
//         display: "flex",
//         justifyContent: "space-between",
//         alignItems: "center",
//         marginBottom: "25px"
//       }}
//     >
//       <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
//         <Button
//           icon="pi pi-bars"
//           onClick={() => setSidebarVisible(true)}
//           style={{
//             borderRadius: "12px",
//             background: "#2563eb",
//             border: "none"
//           }}
//         />

//           {/* <div>
//             <h2 style={{ margin: 0, color: "#0f172a" }}>
//               Student Management
//             </h2>
//             <small style={{ color: "#64748b" }}>
//               Manage student records easily
//             </small>
//           </div> */}
//       </div>
//     </div>

//     {/* Main Card */}
//     <div
//       style={{
//         background: "#ffffff",
//         borderRadius: "20px",
//         padding: "20px",
//         boxShadow: "0 12px 30px rgba(0,0,0,.08)"
//       }}
//     >
//       <Accordion
//         activeIndex={activeIndex}
//         onTabChange={(e) => setActiveIndex(e.index)}
//       >
//         {/* FORM */}
//         <AccordionTab header="Student Form">
//           <div
//             style={{
//               display: "grid",
//               gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
//               gap: "15px",
//               marginTop: "15px"
//             }}
//           >
//             <InputText
//               name="studentId"
//               placeholder="Student ID"
//               value={newStudent.studentId}
//               onChange={handleChange}
//               disabled={isEdit}
//             />

//             <InputText
//               name="firstName"
//               placeholder="First Name"
//               value={newStudent.firstName}
//               onChange={handleChange}
//             />

//             <InputText
//               name="lastName"
//               placeholder="Last Name"
//               value={newStudent.lastName}
//               onChange={handleChange}
//             />

//             <InputText
//               name="age"
//               placeholder="Age"
//               value={newStudent.age}
//               onChange={handleChange}
//             />

//             <InputText
//               name="class"
//               placeholder="Class"
//               value={newStudent.class}
//               onChange={handleChange}
//             />

//             <InputText
//               name="phoneNumber"
//               placeholder="Phone Number"
//               value={newStudent.phoneNumber}
//               onChange={handleChange}
//             />
//           </div>

//           <div style={{ marginTop: "15px" }}>
//             <label>
//               <input
//                 type="checkbox"
//                 name="isActive"
//                 checked={newStudent.isActive}
//                 onChange={handleChange}
//                 style={{ marginRight: "8px" }}
//               />
//               Active
//             </label>
//           </div>

//           <div
//             style={{
//               marginTop: "18px",
//               display: "flex",
//               gap: "10px",
//               flexWrap: "wrap"
//             }}
//           >
//             {isEdit ? (
//               <>
//                 <Button
//                   label="Update"
//                   icon="pi pi-check"
//                   onClick={updateStudent}
//                   style={{
//                     borderRadius: "12px",
//                     background: "#16a34a",
//                     border: "none"
//                   }}
//                 />

//                 <Button
//                   label="Cancel"
//                   icon="pi pi-times"
//                   onClick={resetForm}
//                   style={{
//                     borderRadius: "12px",
//                     background: "#f59e0b",
//                     border: "none"
//                   }}
//                 />
//               </>
//             ) : (
//               <Button
//                 label="Add Student"
//                 icon="pi pi-plus"
//                 onClick={createStudent}
//                 style={{
//                   borderRadius: "12px",
//                   background: "#2563eb",
//                   border: "none"
//                 }}
//               />
//             )}
//           </div>
//         </AccordionTab>

//         {/* LIST */}
//         <AccordionTab header="Student List">
//           <div style={{ marginBottom: "15px", marginTop: "10px" }}>
//             <InputText
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//               placeholder="Search student..."
//               style={{
//                 width: "300px",
//                 borderRadius: "12px"
//               }}
//             />
//           </div>

//           <DataTable
//             value={filteredStudents}
//             paginator
//             rows={5}
//             stripedRows
//             showGridlines
//             responsiveLayout="scroll"
//           >
//             <Column field="studentId" header="ID" />
//             <Column field="firstName" header="First Name" />
//             <Column field="lastName" header="Last Name" />
//             <Column field="age" header="Age" />
//             <Column field="class" header="Class" />
//             <Column field="phoneNumber" header="Phone" />

//             <Column
//               field="isActive"
//               header="Status"
//               body={(row) =>
//                 row.isActive ? "Active" : "Inactive"
//               }
//             />

//             <Column
//               header="Action"
//               body={(row) => (
//                 <div style={{ display: "flex", gap: "8px" }}>
//                   <Button
//                     icon="pi pi-pencil"
//                     onClick={() => editStudent(row)}
//                     style={{
//                       background: "#f59e0b",
//                       border: "none",
//                       borderRadius: "10px"
//                     }}
//                   />

//                   <Button
//                     icon="pi pi-trash"
//                     onClick={() => deleteStudent(row.studentId)}
//                     style={{
//                       background: "#ef4444",
//                       border: "none",
//                       borderRadius: "10px"
//                     }}
//                   />
//                 </div>
//               )}
//             />
//           </DataTable>
//         </AccordionTab>
//       </Accordion>
//     </div>
//   </div>
// );
// }

// export default StudentList;