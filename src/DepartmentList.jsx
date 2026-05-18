import React, { useEffect, useRef, useState, useContext } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { confirmDialog } from "primereact/confirmdialog";
import { Toast } from "primereact/toast";
import { Accordion, AccordionTab } from "primereact/accordion";
import { Sidebar } from "primereact/sidebar";
import { useNavigate } from "react-router-dom";
import "primeicons/primeicons.css";
import API_CONFIG from "./api";
import { ThemeContext } from "./Context/ThemeContext";

function DepartmentList() {
  const toast = useRef(null);
  const navigate = useNavigate();
  const { darkMode, setDarkMode } = useContext(ThemeContext);

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const isAdmin = role === "Admin";

  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [activeIndex, setActiveIndex] = useState(1);
  const [isEdit, setIsEdit] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [newDepartment, setNewDepartment] = useState({
    departmentId: 0,
    departmentName: "",
    isActive: true,
  });

  // ─── THEME TOKENS ──────────────────────────────────────────────
  const t = {
    pageBg:       darkMode ? "#0a0f1e"   : "#f1f5f9",
    cardBg:       darkMode ? "#0f172a"   : "#ffffff",
    cardBorder:   darkMode ? "#1e293b"   : "#e2e8f0",
    headerBg:     darkMode ? "#1e293b"   : "#f8fafc",
    headerBorder: darkMode ? "#334155"   : "#cbd5e1",
    inputBg:      darkMode ? "#1e293b"   : "#f8fafc",
    inputBorder:  darkMode ? "#334155"   : "#cbd5e1",
    textPrimary:  darkMode ? "#f8fafc"   : "#0f172a",
    textMuted:    darkMode ? "#94a3b8"   : "#64748b",
    tableHeader:  darkMode ? "#0f172a"   : "#1e293b",
    tableHeaderTx:darkMode ? "#94a3b8"   : "#e2e8f0",
    rowBg:        darkMode ? "#0f172a"   : "#ffffff",
    rowAltBg:     darkMode ? "#111827"   : "#f8fafc",
    rowBorder:    darkMode ? "#1e293b"   : "#e2e8f0",
    rowText:      darkMode ? "#e2e8f0"   : "#1e293b",
    sidebarBg:    darkMode ? "#0a0f1e"   : "#ffffff",
    paginatorBg:  darkMode ? "#0f172a"   : "#f8fafc",
    paginatorText:darkMode ? "#94a3b8"   : "#64748b",
  };

  // ─── INJECT GLOBAL CSS FOR PRIMEREACT OVERRIDES ─────────────────
  useEffect(() => {
    const styleId = "dept-dark-override";
    let el = document.getElementById(styleId);
    if (!el) {
      el = document.createElement("style");
      el.id = styleId;
      document.head.appendChild(el);
    }

    if (darkMode) {
      el.textContent = `
        /* ── Accordion header ── */
        .dept-page .p-accordion .p-accordion-header .p-accordion-header-link {
          background: #1e293b !important;
          color: #f8fafc !important;
          border: 1px solid #334155 !important;
          border-radius: 12px !important;
          font-weight: 600 !important;
          transition: background 0.2s !important;
        }
        .dept-page .p-accordion .p-accordion-header:not(.p-disabled).p-highlight .p-accordion-header-link {
          background: #1e3a5f !important;
          color: #93c5fd !important;
          border-color: #3b82f6 !important;
        }
        .dept-page .p-accordion .p-accordion-header .p-accordion-header-link:focus {
          box-shadow: 0 0 0 2px #3b82f6 !important;
        }
        .dept-page .p-accordion .p-accordion-header .p-accordion-toggle-icon {
          color: #94a3b8 !important;
        }

        /* ── Accordion content ── */
        .dept-page .p-accordion .p-accordion-content {
          background: #0f172a !important;
          color: #f8fafc !important;
          border: 1px solid #1e293b !important;
          border-top: none !important;
          border-radius: 0 0 12px 12px !important;
        }

        /* ── DataTable ── */
        .dept-page .p-datatable .p-datatable-thead > tr > th {
          background: #0a0f1e !important;
          color: #94a3b8 !important;
          border: 1px solid #1e293b !important;
          font-size: 13px !important;
          letter-spacing: 0.05em !important;
          text-transform: uppercase !important;
        }
        .dept-page .p-datatable .p-datatable-tbody > tr {
          background: #0f172a !important;
          color: #e2e8f0 !important;
          border-bottom: 1px solid #1e293b !important;
          transition: background 0.15s !important;
        }
        .dept-page .p-datatable .p-datatable-tbody > tr:nth-child(even) {
          background: #111827 !important;
        }
        .dept-page .p-datatable .p-datatable-tbody > tr:hover {
          background: #1e293b !important;
        }
        .dept-page .p-datatable .p-datatable-tbody > tr > td {
          border: 1px solid #1e293b !important;
          color: #e2e8f0 !important;
        }
        .dept-page .p-datatable .p-datatable-wrapper {
          border-radius: 14px !important;
          overflow: hidden !important;
        }

        /* ── Paginator ── */
        .dept-page .p-paginator {
          background: #0f172a !important;
          color: #94a3b8 !important;
          border: 1px solid #1e293b !important;
          border-top: none !important;
        }
        .dept-page .p-paginator .p-paginator-element {
          color: #94a3b8 !important;
          background: transparent !important;
          border-radius: 8px !important;
        }
        .dept-page .p-paginator .p-paginator-element:hover {
          background: #1e293b !important;
          color: #f8fafc !important;
        }
        .dept-page .p-paginator .p-highlight {
          background: #1d4ed8 !important;
          color: #ffffff !important;
        }
        .dept-page .p-paginator .p-paginator-pages .p-paginator-page.p-highlight {
          background: #1d4ed8 !important;
          color: #ffffff !important;
        }

        /* ── InputText ── */
        .dept-page .p-inputtext {
          background: #1e293b !important;
          color: #f8fafc !important;
          border: 1px solid #334155 !important;
        }
        .dept-page .p-inputtext::placeholder {
          color: #64748b !important;
        }
        .dept-page .p-inputtext:focus {
          border-color: #3b82f6 !important;
          box-shadow: 0 0 0 2px rgba(59,130,246,0.25) !important;
        }

        /* ── Sidebar ── */
        .dept-page-sidebar .p-sidebar {
          background: #0a0f1e !important;
          color: #f8fafc !important;
          border-right: 1px solid #1e293b !important;
        }
        .dept-page-sidebar .p-sidebar .p-sidebar-close {
          color: #94a3b8 !important;
        }
        .dept-page-sidebar .p-sidebar .p-sidebar-close:hover {
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
        .dept-page .p-accordion .p-accordion-header .p-accordion-header-link {
          background: #f8fafc !important;
          color: #0f172a !important;
          border: 1px solid #e2e8f0 !important;
          border-radius: 12px !important;
          font-weight: 600 !important;
        }
        .dept-page .p-accordion .p-accordion-header:not(.p-disabled).p-highlight .p-accordion-header-link {
          background: #eff6ff !important;
          color: #1d4ed8 !important;
          border-color: #bfdbfe !important;
        }
        .dept-page .p-accordion .p-accordion-content {
          background: #ffffff !important;
          color: #0f172a !important;
          border: 1px solid #e2e8f0 !important;
          border-top: none !important;
          border-radius: 0 0 12px 12px !important;
        }
        .dept-page .p-datatable .p-datatable-thead > tr > th {
          background: #1e293b !important;
          color: #e2e8f0 !important;
          border: 1px solid #334155 !important;
          font-size: 13px !important;
          text-transform: uppercase !important;
          letter-spacing: 0.05em !important;
        }
        .dept-page .p-datatable .p-datatable-tbody > tr {
          background: #ffffff !important;
          color: #1e293b !important;
          border-bottom: 1px solid #e2e8f0 !important;
        }
        .dept-page .p-datatable .p-datatable-tbody > tr:nth-child(even) {
          background: #f8fafc !important;
        }
        .dept-page .p-datatable .p-datatable-tbody > tr:hover {
          background: #eff6ff !important;
        }
        .dept-page .p-datatable .p-datatable-tbody > tr > td {
          border: 1px solid #e2e8f0 !important;
          color: #1e293b !important;
        }
        .dept-page .p-datatable .p-datatable-wrapper {
          border-radius: 14px !important;
          overflow: hidden !important;
        }
        .dept-page .p-paginator {
          background: #f8fafc !important;
          color: #64748b !important;
          border: 1px solid #e2e8f0 !important;
          border-top: none !important;
        }
        .dept-page .p-paginator .p-paginator-element {
          color: #64748b !important;
          border-radius: 8px !important;
        }
        .dept-page .p-paginator .p-highlight,
        .dept-page .p-paginator .p-paginator-pages .p-paginator-page.p-highlight {
          background: #1d4ed8 !important;
          color: #ffffff !important;
        }
        .dept-page .p-inputtext {
          background: #f8fafc !important;
          color: #0f172a !important;
          border: 1px solid #cbd5e1 !important;
        }
        .dept-page .p-inputtext:focus {
          border-color: #3b82f6 !important;
          box-shadow: 0 0 0 2px rgba(59,130,246,0.2) !important;
        }
      `;
    }
  }, [darkMode]);

  // ─── API HELPERS ────────────────────────────────────────────────
  const authHeader = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
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

  const fetchDepartments = async () => {
    try {
      const res = await fetch(API_CONFIG.DEPARTMENT_URL, {
        method: "GET",
        headers: authHeader,
      });
      if (checkUnauthorized(res)) return;
      const data = await res.json();
      setDepartments(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (!token) { navigate("/"); return; }
    fetchDepartments();
  }, []);

  // ─── FORM HANDLERS ───────────────────────────────────────────────
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewDepartment({
      ...newDepartment,
      [name]: name === "isActive" ? value === "true" : value,
    });
  };

  const resetForm = () => {
    setNewDepartment({ departmentId: 0, departmentName: "", isActive: true });
    setIsEdit(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/");
  };

  // ─── CRUD ────────────────────────────────────────────────────────
  const createDepartment = async () => {
    try {
      const res = await fetch(API_CONFIG.DEPARTMENT_URL, {
        method: "POST",
        headers: authHeader,
        body: JSON.stringify(newDepartment),
      });
      if (checkUnauthorized(res)) return;
      fetchDepartments(); resetForm();
      toast.current.show({ severity: "success", summary: "Success", detail: "Department Added", life: 3000 });
    } catch (err) { console.error(err); }
  };

  const updateDepartment = async () => {
    try {
      const res = await fetch(API_CONFIG.DEPARTMENT_URL, {
        method: "PUT",
        headers: authHeader,
        body: JSON.stringify(newDepartment),
      });
      if (checkUnauthorized(res)) return;
      fetchDepartments(); resetForm();
      toast.current.show({ severity: "success", summary: "Updated", detail: "Department Updated", life: 3000 });
    } catch (err) { console.error(err); }
  };

  const editDepartment = (dept) => {
    setNewDepartment({ departmentId: dept.departmentId, departmentName: dept.departmentName, isActive: dept.isActive });
    setIsEdit(true);
    setActiveIndex(0);
  };

  const deleteDepartment = async (id) => {
    try {
      const res = await fetch(`${API_CONFIG.DEPARTMENT_URL}?id=${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (checkUnauthorized(res)) return;
      fetchDepartments();
      toast.current.show({ severity: "warn", summary: "Deleted", detail: "Department Deleted", life: 3000 });
    } catch (err) { console.error(err); }
  };

  const confirmDelete = (id) => {
    confirmDialog({
      message: "Are you sure you want to delete?",
      header: "Delete Confirmation",
      icon: "pi pi-exclamation-triangle",
      accept: () => deleteDepartment(id),
    });
  };

  const filteredDepartments = departments.filter((d) =>
    d.departmentName?.toLowerCase().includes(searchText.toLowerCase())
  );

  // ─── SHARED STYLES ──────────────────────────────────────────────
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

  // ─── STATUS BADGE ────────────────────────────────────────────────
  const statusBody = (rowData) => (
    <span style={{
      display: "inline-block",
      padding: "4px 14px",
      borderRadius: "999px",
      fontSize: "12px",
      fontWeight: 600,
      background: rowData.isActive
        ? "rgba(34,197,94,0.15)"
        : "rgba(239,68,68,0.12)",
      color: rowData.isActive ? "#22c55e" : "#f87171",
    }}>
      {rowData.isActive ? "Active" : "Inactive"}
    </span>
  );

  // ─── ACTION BUTTONS ──────────────────────────────────────────────
  const actionBody = (rowData) => (
    <div style={{ display: "flex", gap: "8px" }}>
      <Button
        icon="pi pi-pencil"
        onClick={() => editDepartment(rowData)}
        style={{ ...btn("#f59e0b"), width: 42, height: 42 }}
        tooltip="Edit" tooltipOptions={{ position: "top" }}
      />
      <Button
        icon="pi pi-trash"
        onClick={() => confirmDelete(rowData.departmentId)}
        style={{ ...btn("#ef4444"), width: 42, height: 42 }}
        tooltip="Delete" tooltipOptions={{ position: "top" }}
      />
    </div>
  );

  // ─── RENDER ──────────────────────────────────────────────────────
  return (
    <div
      className="dept-page"
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

      {/* ── SIDEBAR ── */}
      <div className="dept-page-sidebar">
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
              Department Management
            </h2>
            <small style={{ color: t.textMuted }}>Logged in as: {role}</small>
          </div>
        </div>

        {/* Dark mode toggle in header too */}
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
            <AccordionTab header="📋  Department Form">
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 14 }}>
                <InputText
                  name="departmentName"
                  placeholder="Department Name"
                  value={newDepartment.departmentName}
                  onChange={handleChange}
                  style={inputStyle}
                />
                <select
                  name="isActive"
                  value={newDepartment.isActive}
                  onChange={handleChange}
                  style={{ ...inputStyle, height: 46 }}
                >
                  <option value={true}>Active</option>
                  <option value={false}>Inactive</option>
                </select>
              </div>

              <div style={{ marginTop: 18, display: "flex", gap: 10 }}>
                {isEdit ? (
                  <>
                    <Button label="Update" icon="pi pi-check" onClick={updateDepartment} style={btn("#16a34a")} />
                    <Button label="Cancel" icon="pi pi-times" onClick={resetForm}        style={btn("#ef4444")} />
                  </>
                ) : (
                  <Button label="Add Department" icon="pi pi-plus" onClick={createDepartment} style={btn("#2563eb")} />
                )}
              </div>
            </AccordionTab>
          )}

          {/* LIST TAB */}
          <AccordionTab header="🏢  Department List">
            <div style={{ marginBottom: 16 }}>
              <InputText
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="Search department..."
                style={{ ...inputStyle, width: 300, borderRadius: 14 }}
              />
            </div>

            <DataTable
              value={filteredDepartments}
              paginator
              rows={5}
              responsiveLayout="scroll"
              emptyMessage={
                <span style={{ color: t.textMuted }}>No departments found.</span>
              }
            >
              <Column field="departmentId"   header="ID"              style={{ width: 80 }} />
              <Column field="departmentName" header="Department Name" />
              <Column field="isActive"       header="Status"          body={statusBody} />
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

export default DepartmentList;

// import React, { useEffect, useRef, useState } from "react";

// import { DataTable } from "primereact/datatable";
// import { Column } from "primereact/column";

// import { Button } from "primereact/button";
// import { InputText } from "primereact/inputtext";

// import { confirmDialog } from "primereact/confirmdialog";
// import { Toast } from "primereact/toast";

// import { Accordion, AccordionTab } from "primereact/accordion";

// import { Sidebar } from "primereact/sidebar";

// import { useNavigate } from "react-router-dom";

// import "primereact/resources/themes/lara-light-cyan/theme.css";
// import "primeicons/primeicons.css";

// import API_CONFIG from "./api";

// function DepartmentList() {

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

//   // STATES
//   const [departments, setDepartments] = useState([]);

//   const [activeIndex, setActiveIndex] = useState(0);

//   const [isEdit, setIsEdit] = useState(false);

//   const [searchText, setSearchText] = useState("");

//   const [newDepartment, setNewDepartment] = useState({
//     departmentId: 0,
//     departmentName: "",
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

//   // FETCH DEPARTMENTS
//   const fetchDepartments = async () => {

//     try {

//       const res = await fetch(
//         API_CONFIG.DEPARTMENT_URL,
//         {
//           method: "GET",
//           headers: authHeader
//         }
//       );

//       if (checkUnauthorized(res)) return;

//       const data = await res.json();

//       setDepartments(data);

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

//     fetchDepartments();

//   }, []);

//   // HANDLE CHANGE
//   const handleChange = (e) => {

//     const { name, value } = e.target;

//     setNewDepartment({
//       ...newDepartment,
//       [name]:
//         name === "isActive"
//           ? value === "true"
//           : value
//     });
//   };

//   // RESET FORM
//   const resetForm = () => {

//     setNewDepartment({
//       departmentId: 0,
//       departmentName: "",
//       isActive: true
//     });

//     setIsEdit(false);

//     setActiveIndex(0);
//   };

//   // CREATE
//   const createDepartment = async () => {

//     try {

//       const res = await fetch(
//         API_CONFIG.DEPARTMENT_URL,
//         {
//           method: "POST",
//           headers: authHeader,
//           body: JSON.stringify(newDepartment)
//         }
//       );

//       if (checkUnauthorized(res)) return;

//       if (!res.ok) {

//         throw new Error("Add failed");
//       }

//       fetchDepartments();

//       resetForm();

//       toast.current.show({
//         severity: "success",
//         summary: "Success",
//         detail: "Department Added",
//         life: 3000
//       });

//     } catch (err) {

//       console.error(err);

//       toast.current.show({
//         severity: "error",
//         summary: "Error",
//         detail: "Unable to add department",
//         life: 3000
//       });
//     }
//   };

//   // VALIDATE
//   const validateAndAdd = () => {

//     if (newDepartment.departmentName.trim() === "") {

//       toast.current.show({
//         severity: "warn",
//         summary: "Validation",
//         detail: "Please enter Department Name",
//         life: 3000
//       });

//       return;
//     }

//     createDepartment();
//   };

//   // EDIT
//   const editDepartment = (dept) => {

//     setNewDepartment({
//       departmentId: dept.departmentId,
//       departmentName: dept.departmentName,
//       isActive: dept.isActive
//     });

//     setIsEdit(true);

//     setActiveIndex(0);
//   };

//   // UPDATE
//   const updateDepartment = async () => {

//     try {

//       const res = await fetch(
//         API_CONFIG.DEPARTMENT_URL,
//         {
//           method: "PUT",
//           headers: authHeader,
//           body: JSON.stringify(newDepartment)
//         }
//       );

//       if (checkUnauthorized(res)) return;

//       if (!res.ok) {

//         throw new Error("Update failed");
//       }

//       fetchDepartments();

//       resetForm();

//       toast.current.show({
//         severity: "success",
//         summary: "Updated",
//         detail: "Department Updated",
//         life: 3000
//       });

//     } catch (err) {

//       console.error(err);

//       toast.current.show({
//         severity: "error",
//         summary: "Error",
//         detail: "Unable to update department",
//         life: 3000
//       });
//     }
//   };

//   // DELETE
//   const deleteDepartment = async (id) => {

//     try {

//       const res = await fetch(
//         `${API_CONFIG.DEPARTMENT_URL}?id=${id}`,
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

//       fetchDepartments();

//       toast.current.show({
//         severity: "warn",
//         summary: "Deleted",
//         detail: "Department Deleted",
//         life: 3000
//       });

//     } catch (err) {

//       console.error(err);
//     }
//   };

//   // DELETE CONFIRM
//   const confirmDelete = (id) => {

//     confirmDialog({
//       message: "Are you sure you want to delete?",
//       header: "Delete Confirmation",
//       icon: "pi pi-exclamation-triangle",
//       accept: () => deleteDepartment(id)
//     });
//   };

//   // SEARCH FILTER
//   const filteredDepartments = departments.filter((dept) =>
//     `${dept.departmentName || ""}`
//       .toLowerCase()
//       .includes(searchText.toLowerCase())
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

//         <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>

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
//               Department Management
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

//             <AccordionTab header="Department Form">

//               <div
//                 style={{
//                   display: "grid",
//                   gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))",
//                   gap: "15px",
//                   marginTop: "15px"
//                 }}
//               >

//                 <InputText
//                   name="departmentName"
//                   placeholder="Department Name"
//                   value={newDepartment.departmentName}
//                   onChange={handleChange}
//                 />

//                 <select
//                   name="isActive"
//                   value={newDepartment.isActive}
//                   onChange={handleChange}
//                   style={{
//                     height: "42px",
//                     borderRadius: "10px",
//                     border: "1px solid #cbd5e1",
//                     padding: "8px"
//                   }}
//                 >

//                   <option value={true}>Active</option>

//                   <option value={false}>Inactive</option>

//                 </select>

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
//                       onClick={updateDepartment}
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
//                     label="Add Department"
//                     icon="pi pi-plus"
//                     onClick={validateAndAdd}
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

//           {/* DEPARTMENT LIST */}
//           <AccordionTab header="Department List">

//             <div style={{ marginBottom: "15px", marginTop: "10px" }}>

//               <InputText
//                 value={searchText}
//                 onChange={(e) => setSearchText(e.target.value)}
//                 placeholder="Search department..."
//                 style={{
//                   width: "300px",
//                   borderRadius: "12px"
//                 }}
//               />

//             </div>

//             <DataTable
//               value={filteredDepartments}
//               paginator
//               rows={5}
//               stripedRows
//               showGridlines
//               responsiveLayout="scroll"
//             >

//               <Column
//                 field="departmentId"
//                 header="ID"
//               />

//               <Column
//                 field="departmentName"
//                 header="Department Name"
//               />

//               <Column
//                 field="isActive"
//                 header="Status"
//                 body={(rowData) =>
//                   rowData.isActive
//                     ? "Active"
//                     : "Inactive"
//                 }
//               />

//               {/* ADMIN ONLY ACTION */}
//               {isAdmin && (

//                 <Column
//                   header="Action"
//                   body={(rowData) => (

//                     <div
//                       style={{
//                         display: "flex",
//                         gap: "8px"
//                       }}
//                     >

//                       <Button
//                         icon="pi pi-pencil"
//                         onClick={() => editDepartment(rowData)}
//                         style={{
//                           background: "#f59e0b",
//                           border: "none",
//                           borderRadius: "10px"
//                         }}
//                       />

//                       <Button
//                         icon="pi pi-trash"
//                         onClick={() =>
//                           confirmDelete(rowData.departmentId)
//                         }
//                         style={{
//                           background: "#ef4444",
//                           border: "none",
//                           borderRadius: "10px"
//                         }}
//                       />

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

// export default DepartmentList;



// import React, { useEffect, useRef, useState } from "react";
// import { DataTable } from "primereact/datatable";
// import { Column } from "primereact/column";
// import { Button } from "primereact/button";
// import { InputText } from "primereact/inputtext";
// import { confirmDialog } from 'primereact/confirmdialog';
// import { Toast } from "primereact/toast";
// import { Accordion, AccordionTab } from "primereact/accordion";
// import { Password } from "primereact/password";
// import { Sidebar } from "primereact/sidebar";
// import { useNavigate } from "react-router-dom";
// import API_CONFIG from "./api";   // ✅ add this
// function DepartmentList() {
//   const toast = useRef(null);

//      const navigate = useNavigate();
//      const handleLogout = () => {
//     localStorage.removeItem("token");
//     navigate("/");
//   };
//        const [sidebarVisible, setSidebarVisible] = useState(false);
//     //  // LOGIN STATE
//     //   const [isLogin, setIsLogin] = useState(false);
//     //   const [loginData, setLoginData] = useState({
//     //     username: "",
//     //     password: ""
//     //   });
//     //  Department State
//   const [departments, setDepartments] = useState([]);
//   const [activeIndex, setActiveIndex] = useState(0);
//   const [isEdit, setIsEdit] = useState(false);
//    const [searchText, setSearchText] = useState("");
  

//   const [newDepartment, setNewDepartment] = useState({
//     departmentId: 0,
//     departmentName: "",
//     isActive: true
//   });
//       const API_URL = API_CONFIG.DEPARTMENT_URL;

//   const getToken = () => {
//     return localStorage.getItem("token");
//   };

//   const authHeader = () => {
//     return {
//       Authorization: `Bearer ${getToken()}`,
//       "Content-Type": "application/json"
//     };
//   };

//   const handleUnauthorized = () => {
//     localStorage.removeItem("token");
//     navigate("/");
//   };

//   // const handleLogout = () => {
//   //   localStorage.removeItem("token");
//   //   navigate("/");
//   // };

//   useEffect(() => {
//     const token = getToken();

//     if (!token) {
//       navigate("/");
//       return;
//     }

//     fetchDepartments();
//   }, []);

//   const fetchDepartments = async () => {
//     try {
//       const res = await fetch(API_CONFIG.DEPARTMENT_URL, {
//         method: "GET",
//         headers: authHeader()
//       });

//       if (res.status === 401) {
//         handleUnauthorized();
//         return;
//       }

//       const data = await res.json();
//       setDepartments(data);
//     } catch (error) {
//       console.log(error);
//     }
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
//   // const fetchDepartments = () => {
//   //   fetch("https://localhost:7175/api/Department")
//   //     .then((res) => res.json())
//   //     .then((data) => setDepartments(data))
//   //     .catch((err) => console.error(err));
//   // };

//   useEffect(() => {
//   const token = localStorage.getItem("token");

//   if (!token) {
//     navigate("/");
//     return;
//   }

//   fetchDepartments();
// }, [navigate]);

//   // INPUT CHANGE
//   const handleChange = (e) => {
//     const { name, value } = e.target;

//     setNewDepartment({
//       ...newDepartment,
//       [name]: name === "isActive" ? value === "true" : value
//     });
//   };

//   // RESET
//   const resetForm = () => {
//     setNewDepartment({
//       departmentId: 0,
//       departmentName: "",
//       isActive: true
//     });

//     setIsEdit(false);
//     setActiveIndex(1);
//   };
//      const createDepartment = async () => {
//   const token = localStorage.getItem("token");

//   if (!token) {
//     navigate("/");
//     return;
//   }

//   try {
//     const res = await fetch(API_CONFIG.DEPARTMENT_URL, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`
//       },
//       body: JSON.stringify(newDepartment)
//     });

//     if (res.status === 401) {
//       localStorage.removeItem("token");
//       navigate("/");
//       return;
//     }

//     if (!res.ok) {
//       throw new Error("Add failed");
//     }

//     fetchDepartments();
//     resetForm();

//     toast.current.show({
//       severity: "success",
//       summary: "Success",
//       detail: "Department Added",
//       life: 3000
//     });

//   } catch (err) {
//     console.error(err);

//     toast.current.show({
//       severity: "error",
//       summary: "Error",
//       detail: "Unable to add department",
//       life: 3000
//     });
//   }
// };

// const confirmAdd = () => {
//   confirmDialog({
//     message: "Are you sure you want to add department?",
//     header: "Confirmation",
//     icon: "pi pi-check-circle",
//     accept: () => createDepartment()
//   });
// };
//   // ADD
//   // const createDepartment = () => {
//   //   fetch("https://localhost:7175/api/Department", {
//   //     method: "POST",
//   //     headers: {
//   //       "Content-Type": "application/json"
//   //     },
//   //     body: JSON.stringify(newDepartment)
//   //   })
//   //     .then(() => {
//   //       fetchDepartments();
//   //       resetForm();

//   //       toast.current.show({
//   //         severity: "success",
//   //         summary: "Success",
//   //         detail: "Department Added",
//   //         life: 3000
//   //       });
//   //     })
//   //     .catch((err) => console.error(err));
//   // };

//   // const confirmAdd = () => {
//   //   confirmDialog({
//   //     message: "Are you sure you want to add department?",
//   //     header: "Confirmation",
//   //     icon: "pi pi-check-circle",
//   //     accept: () => createDepartment()
//   //   });
//   // };

//   // DELETE
//     const deleteDepartment = async (id) => {
//   const token = localStorage.getItem("token");

//   try {
//     const res = await fetch
//     (`${API_CONFIG.DEPARTMENT_URL}?id=${id}`,
//       {
//         method: "DELETE",
//         headers: {
//           Authorization: `Bearer ${token}`
//         }
//       }
//     );

//     if (res.status === 401) {
//       localStorage.removeItem("token");
//       navigate("/");
//       return;
//     }

//     if (!res.ok) {
//       throw new Error("Delete failed");
//     }

//     fetchDepartments();

//     toast.current.show({
//       severity: "success",
//       summary: "Deleted",
//       detail: "Department Deleted Successfully",
//       life: 3000
//     });
//   } catch (error) {
//     console.log(error);
//   }
// };

//   const confirmDelete = (id) => {
//     confirmDialog({
//       message: "Are you sure you want to delete?",
//       header: "Delete Confirmation",
//       icon: "pi pi-exclamation-triangle",
//       accept: () => deleteDepartment(id)
//     });
//   };
//   // const deleteDepartment = (id) => {
//   // fetch(`https://localhost:7175/api/Department?id=${id}`, {
//   //   method: "DELETE"
//   // })
//   //     .then(() => {
//   //       fetchDepartments();

//   //       toast.current.show({
//   //         severity: "warn",
//   //         summary: "Deleted",
//   //         detail: "Department Deleted",
//   //         life: 3000
//   //       });
//   //     })
//   //     .catch((err) => console.error(err));
//   // };

//   // const confirmDelete = (id) => {
//   //   confirmDialog({
//   //     message: "Are you sure you want to delete?",
//   //     header: "Delete Confirmation",
//   //     icon: "pi pi-exclamation-triangle",
//   //     accept: () => deleteDepartment(id)
//   //   });
//   // };

//   // // EDIT
//   // const editDepartment = (dept) => {
//   //   setNewDepartment({
//   //     departmentId: dept.departmentId,
//   //     departmentName: dept.departmentName,
//   //     isActive: dept.isActive
//   //   });

//   //   setIsEdit(true);
//   //   setActiveIndex(0);
//   // };

//   // // UPDATE
//   // const updateDepartment = () => {
//   //   fetch("https://localhost:7175/api/Department", {
//   //     method: "PUT",
//   //     headers: {
//   //       "Content-Type": "application/json"
//   //     },
//   //     body: JSON.stringify(newDepartment)
//   //   })
//   //     .then((res) => {
//   //       if (!res.ok) throw new Error("Update failed");
//   //       return res.text();
//   //     })
//   //     .then(() => {
//   //       fetchDepartments();
//   //       resetForm();

//   //       toast.current.show({
//   //         severity: "success",
//   //         summary: "Updated",
//   //         detail: "Department Updated",
//   //         life: 3000
//   //       });
//   //     })
//   //     .catch((err) => console.error(err));
//   // };
//          // EDIT
// const editDepartment = async (dept) => {
//   const token = localStorage.getItem("token");

//   if (!token) {
//     navigate("/");
//     return;
//   }

//   try {
//     const res = await fetch(
//       `${API_CONFIG.DEPARTMENT_URL}/${dept.departmentId}`,
//       {
//         method: "GET",
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json"
//         }
//       }
//     );

//     if (res.status === 401) {
//       localStorage.removeItem("token");
//       navigate("/");
//       return;
//     }

//     if (!res.ok) {
//       throw new Error("Failed to load department");
//     }

//     const data = await res.json();

//     setNewDepartment({
//       departmentId: data.departmentId,
//       departmentName: data.departmentName,
//       isActive: data.isActive
//     });

//     setIsEdit(true);
//     setActiveIndex(0);

//   } catch (err) {
//     console.error(err);
//   }
// };

// // UPDATE
// const updateDepartment = async () => {
//   const token = localStorage.getItem("token");

//   if (!token) {
//     navigate("/");
//     return;
//   }

//   try {
//     const res = await fetch(API_CONFIG.DEPARTMENT_URL, {
//       method: "PUT",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`
//       },
//       body: JSON.stringify(newDepartment)
//     });

//     if (res.status === 401) {
//       localStorage.removeItem("token");
//       navigate("/");
//       return;
//     }

//     if (!res.ok) {
//       throw new Error("Update failed");
//     }

//     fetchDepartments();
//     resetForm();

//     toast.current.show({
//       severity: "success",
//       summary: "Updated",
//       detail: "Department Updated",
//       life: 3000
//     });

//   } catch (err) {
//     console.error(err);

//     toast.current.show({
//       severity: "error",
//       summary: "Error",
//       detail: "Unable to update department",
//       life: 3000
//     });
//   }
// };
//       // SEARCH FILTER
//   const filteredDepartments = departments.filter((dept) =>
//     dept.departmentName
//       .toLowerCase()
//       .includes(searchText.toLowerCase())
//   );
//    const validateAndAdd = () => {
//   if (newDepartment.departmentName.trim() === "") {
//     toast.current.show({
//       severity: "warn",
//       summary: "Validation",
//       detail: "Please enter Department Name",
//       life: 3000
//     });
//     return;
//   }

//   createDepartment();
// };
//  return (
//   <div
//     style={{
//       minHeight: "100vh",
//       background: "linear-gradient(135deg,#e0f2fe,#eef2ff,#f8fafc)",
//       padding: "25px"
//     }}
//   >
//     <Toast ref={toast} />

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

//         <div>
//           <h2 style={{ margin: 0, color: "#0f172a" }}>
//             Department Management
//           </h2>
//           <small style={{ color: "#64748b" }}>
//             Manage department records easily
//           </small>
//         </div>
//       </div>

//       {/* <Button
//         label="Logout"
//         icon="pi pi-sign-out"
//         onClick={handleLogout}
//         style={{
//           borderRadius: "12px",
//           background: "#ef4444",
//           border: "none"
//         }}
//       /> */}
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
//         {/* Form */}
//         <AccordionTab header="Department Form">
//           <div
//             style={{
//               display: "grid",
//               gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))",
//               gap: "15px",
//               marginTop: "15px"
//             }}
//           >
//             <InputText
//               name="departmentName"
//               placeholder="Department Name"
//               value={newDepartment.departmentName}
//               onChange={handleChange}
//             />

//             <select
//               name="isActive"
//               value={newDepartment.isActive}
//               onChange={handleChange}
//               style={{
//                 height: "42px",
//                 borderRadius: "10px",
//                 border: "1px solid #cbd5e1",
//                 padding: "8px"
//               }}
//             >
//               <option value={true}>Active</option>
//               <option value={false}>Inactive</option>
//             </select>
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
//                   onClick={updateDepartment}
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
//                 label="Add Department"
//                 icon="pi pi-plus"
//                 onClick={validateAndAdd}
//                 style={{
//                   borderRadius: "12px",
//                   background: "#2563eb",
//                   border: "none"
//                 }}
//               />
//             )}
//           </div>
//         </AccordionTab>

//         {/* List */}
//         <AccordionTab header="Department List">
//           <div style={{ marginBottom: "15px", marginTop: "10px" }}>
//             <InputText
//               value={searchText}
//               onChange={(e) => setSearchText(e.target.value)}
//               placeholder="Search department..."
//               style={{
//                 width: "300px",
//                 borderRadius: "12px"
//               }}
//             />
//           </div>

//           <DataTable
//             value={filteredDepartments}
//             paginator
//             rows={5}
//             stripedRows
//             showGridlines
//             responsiveLayout="scroll"
//           >
//             <Column field="departmentId" header="ID" />
//             <Column field="departmentName" header="Department Name" />

//             <Column
//               field="isActive"
//               header="Status"
//               body={(rowData) =>
//                 rowData.isActive ? "Active" : "Inactive"
//               }
//             />

//             <Column
//               header="Action"
//               body={(rowData) => (
//                 <div style={{ display: "flex", gap: "8px" }}>
//                   <Button
//                     icon="pi pi-pencil"
//                     onClick={() => editDepartment(rowData)}
//                     style={{
//                       background: "#f59e0b",
//                       border: "none",
//                       borderRadius: "10px"
//                     }}
//                   />

//                   <Button
//                     icon="pi pi-trash"
//                     onClick={() =>
//                       confirmDelete(rowData.departmentId)
//                     }
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

// export default DepartmentList;