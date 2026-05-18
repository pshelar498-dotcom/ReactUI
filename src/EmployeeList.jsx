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

function EmployeeList() {
  const toast = useRef(null);
  const navigate = useNavigate();

  const { darkMode, setDarkMode } = useContext(ThemeContext);

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const isAdmin = role === "Admin";

  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isEdit, setIsEdit] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [newEmployee, setNewEmployee] = useState({
    id: 0,
    firstName: "",
    lastName: "",
    departmentId: "",
    salary: "",
    phoneNumber: "",
    isActive: true,
  });

  // ─── THEME TOKENS ───────────────────────────────────────────────
  const t = {
    pageBg:        darkMode ? "#0a0f1e"  : "#f1f5f9",
    cardBg:        darkMode ? "#0f172a"  : "#ffffff",
    cardBorder:    darkMode ? "#1e293b"  : "#e2e8f0",
    inputBg:       darkMode ? "#1e293b"  : "#f8fafc",
    inputBorder:   darkMode ? "#334155"  : "#cbd5e1",
    textPrimary:   darkMode ? "#f8fafc"  : "#0f172a",
    textMuted:     darkMode ? "#94a3b8"  : "#64748b",
    sidebarBg:     darkMode ? "#0a0f1e"  : "#ffffff",
  };

  // ─── INJECT GLOBAL CSS FOR PRIMEREACT OVERRIDES ─────────────────
  useEffect(() => {
    const styleId = "emp-dark-override";
    let el = document.getElementById(styleId);
    if (!el) {
      el = document.createElement("style");
      el.id = styleId;
      document.head.appendChild(el);
    }

    if (darkMode) {
      el.textContent = `
        /* ── Accordion header ── */
        .emp-page .p-accordion .p-accordion-header .p-accordion-header-link {
          background: #1e293b !important;
          color: #f8fafc !important;
          border: 1px solid #334155 !important;
          border-radius: 12px !important;
          font-weight: 600 !important;
          transition: background 0.2s !important;
        }
        .emp-page .p-accordion .p-accordion-header:not(.p-disabled).p-highlight .p-accordion-header-link {
          background: #1e3a5f !important;
          color: #93c5fd !important;
          border-color: #3b82f6 !important;
        }
        .emp-page .p-accordion .p-accordion-header .p-accordion-header-link:focus {
          box-shadow: 0 0 0 2px #3b82f6 !important;
        }
        .emp-page .p-accordion .p-accordion-header .p-accordion-toggle-icon {
          color: #94a3b8 !important;
        }

        /* ── Accordion content ── */
        .emp-page .p-accordion .p-accordion-content {
          background: #0f172a !important;
          color: #f8fafc !important;
          border: 1px solid #1e293b !important;
          border-top: none !important;
          border-radius: 0 0 12px 12px !important;
        }

        /* ── DataTable header ── */
        .emp-page .p-datatable .p-datatable-thead > tr > th {
          background: #0a0f1e !important;
          color: #94a3b8 !important;
          border: 1px solid #1e293b !important;
          font-size: 13px !important;
          letter-spacing: 0.05em !important;
          text-transform: uppercase !important;
        }

        /* ── DataTable rows ── */
        .emp-page .p-datatable .p-datatable-tbody > tr {
          background: #0f172a !important;
          color: #e2e8f0 !important;
          border-bottom: 1px solid #1e293b !important;
          transition: background 0.15s !important;
        }
        .emp-page .p-datatable .p-datatable-tbody > tr:nth-child(even) {
          background: #111827 !important;
        }
        .emp-page .p-datatable .p-datatable-tbody > tr:hover {
          background: #1e293b !important;
        }
        .emp-page .p-datatable .p-datatable-tbody > tr > td {
          border: 1px solid #1e293b !important;
          color: #e2e8f0 !important;
        }
        .emp-page .p-datatable .p-datatable-wrapper {
          border-radius: 14px !important;
          overflow: hidden !important;
        }

        /* ── Paginator ── */
        .emp-page .p-paginator {
          background: #0f172a !important;
          color: #94a3b8 !important;
          border: 1px solid #1e293b !important;
          border-top: none !important;
        }
        .emp-page .p-paginator .p-paginator-element {
          color: #94a3b8 !important;
          background: transparent !important;
          border-radius: 8px !important;
        }
        .emp-page .p-paginator .p-paginator-element:hover {
          background: #1e293b !important;
          color: #f8fafc !important;
        }
        .emp-page .p-paginator .p-highlight,
        .emp-page .p-paginator .p-paginator-pages .p-paginator-page.p-highlight {
          background: #1d4ed8 !important;
          color: #ffffff !important;
        }

        /* ── InputText ── */
        .emp-page .p-inputtext {
          background: #1e293b !important;
          color: #f8fafc !important;
          border: 1px solid #334155 !important;
        }
        .emp-page .p-inputtext::placeholder {
          color: #64748b !important;
        }
        .emp-page .p-inputtext:focus {
          border-color: #3b82f6 !important;
          box-shadow: 0 0 0 2px rgba(59,130,246,0.25) !important;
        }

        /* ── Sidebar ── */
        .emp-page-sidebar .p-sidebar {
          background: #0a0f1e !important;
          color: #f8fafc !important;
          border-right: 1px solid #1e293b !important;
        }
        .emp-page-sidebar .p-sidebar .p-sidebar-close {
          color: #94a3b8 !important;
        }
        .emp-page-sidebar .p-sidebar .p-sidebar-close:hover {
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
        .emp-page .p-accordion .p-accordion-header .p-accordion-header-link {
          background: #f8fafc !important;
          color: #0f172a !important;
          border: 1px solid #e2e8f0 !important;
          border-radius: 12px !important;
          font-weight: 600 !important;
        }
        .emp-page .p-accordion .p-accordion-header:not(.p-disabled).p-highlight .p-accordion-header-link {
          background: #eff6ff !important;
          color: #1d4ed8 !important;
          border-color: #bfdbfe !important;
        }

        /* ── Accordion content ── */
        .emp-page .p-accordion .p-accordion-content {
          background: #ffffff !important;
          color: #0f172a !important;
          border: 1px solid #e2e8f0 !important;
          border-top: none !important;
          border-radius: 0 0 12px 12px !important;
        }

        /* ── DataTable header ── */
        .emp-page .p-datatable .p-datatable-thead > tr > th {
          background: #1e293b !important;
          color: #e2e8f0 !important;
          border: 1px solid #334155 !important;
          font-size: 13px !important;
          text-transform: uppercase !important;
          letter-spacing: 0.05em !important;
        }

        /* ── DataTable rows ── */
        .emp-page .p-datatable .p-datatable-tbody > tr {
          background: #ffffff !important;
          color: #1e293b !important;
          border-bottom: 1px solid #e2e8f0 !important;
        }
        .emp-page .p-datatable .p-datatable-tbody > tr:nth-child(even) {
          background: #f8fafc !important;
        }
        .emp-page .p-datatable .p-datatable-tbody > tr:hover {
          background: #eff6ff !important;
        }
        .emp-page .p-datatable .p-datatable-tbody > tr > td {
          border: 1px solid #e2e8f0 !important;
          color: #1e293b !important;
        }
        .emp-page .p-datatable .p-datatable-wrapper {
          border-radius: 14px !important;
          overflow: hidden !important;
        }

        /* ── Paginator ── */
        .emp-page .p-paginator {
          background: #f8fafc !important;
          color: #64748b !important;
          border: 1px solid #e2e8f0 !important;
          border-top: none !important;
        }
        .emp-page .p-paginator .p-paginator-element {
          color: #64748b !important;
          border-radius: 8px !important;
        }
        .emp-page .p-paginator .p-highlight,
        .emp-page .p-paginator .p-paginator-pages .p-paginator-page.p-highlight {
          background: #1d4ed8 !important;
          color: #ffffff !important;
        }

        /* ── InputText ── */
        .emp-page .p-inputtext {
          background: #f8fafc !important;
          color: #0f172a !important;
          border: 1px solid #cbd5e1 !important;
        }
        .emp-page .p-inputtext:focus {
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

  const fetchEmployees = async () => {
    try {
      const res = await fetch(API_CONFIG.EMPLOYEE_URL, { method: "GET", headers: authHeader });
      if (checkUnauthorized(res)) return;
      const data = await res.json();
      setEmployees(data);
    } catch (err) { console.error(err); }
  };

  const fetchDepartments = async () => {
    try {
      const res = await fetch(API_CONFIG.DEPARTMENT_URL, { method: "GET", headers: authHeader });
      if (checkUnauthorized(res)) return;
      const data = await res.json();
      setDepartments(data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => {
    if (!token) { navigate("/"); return; }
    fetchEmployees();
    fetchDepartments();
  }, []);

  // ─── FORM HANDLERS ───────────────────────────────────────────────
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewEmployee({ ...newEmployee, [name]: value });
  };

  const resetForm = () => {
    setNewEmployee({ id: 0, firstName: "", lastName: "", departmentId: "", salary: "", phoneNumber: "", isActive: true });
    setIsEdit(false);
  };

  // ─── CRUD ────────────────────────────────────────────────────────
  const createEmployee = async () => {
    try {
      const res = await fetch(API_CONFIG.EMPLOYEE_URL, { method: "POST", headers: authHeader, body: JSON.stringify(newEmployee) });
      if (checkUnauthorized(res)) return;
      fetchEmployees(); resetForm();
      toast.current.show({ severity: "success", summary: "Success", detail: "Employee Added", life: 3000 });
    } catch (err) { console.error(err); }
  };

  const updateEmployee = async () => {
    try {
      const res = await fetch(`${API_CONFIG.EMPLOYEE_URL}?Id=${newEmployee.id}`, { method: "PUT", headers: authHeader, body: JSON.stringify(newEmployee) });
      if (checkUnauthorized(res)) return;
      fetchEmployees(); resetForm();
      toast.current.show({ severity: "success", summary: "Updated", detail: "Employee Updated", life: 3000 });
    } catch (err) { console.error(err); }
  };

  const editEmployee = (emp) => {
    setNewEmployee(emp);
    setIsEdit(true);
    setActiveIndex(0);
  };

  const deleteEmployee = async (id) => {
    try {
      const res = await fetch(`${API_CONFIG.EMPLOYEE_URL}?Id=${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
      if (checkUnauthorized(res)) return;
      fetchEmployees();
      toast.current.show({ severity: "warn", summary: "Deleted", detail: "Employee Deleted", life: 3000 });
    } catch (err) { console.error(err); }
  };

  const confirmDelete = (id) => {
    confirmDialog({
      message: "Are you sure you want to delete?",
      header: "Delete Confirmation",
      icon: "pi pi-exclamation-triangle",
      accept: () => deleteEmployee(id),
    });
  };

  const filteredEmployees = employees.filter((emp) =>
    `${emp.firstName} ${emp.lastName} ${emp.departmentName} ${emp.phoneNumber}`
      .toLowerCase()
      .includes(searchText.toLowerCase())
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

  const selectStyle = {
    ...inputStyle,
    height: "46px",
  };

  const btn = (bg) => ({
    background: bg,
    border: "none",
    borderRadius: "12px",
  });

  // ─── ACTION BODY ─────────────────────────────────────────────────
  const actionBody = (rowData) => (
    <div style={{ display: "flex", gap: "8px" }}>
      <Button
        icon="pi pi-pencil"
        onClick={() => editEmployee(rowData)}
        style={{ ...btn("#f59e0b"), width: 42, height: 42 }}
        tooltip="Edit" tooltipOptions={{ position: "top" }}
      />
      <Button
        icon="pi pi-trash"
        onClick={() => confirmDelete(rowData.id)}
        style={{ ...btn("#ef4444"), width: 42, height: 42 }}
        tooltip="Delete" tooltipOptions={{ position: "top" }}
      />
    </div>
  );

  // ─── RENDER ──────────────────────────────────────────────────────
  return (
    <div
      className="emp-page"
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
      <div className="emp-page-sidebar">
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
              Employee Management
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
            <AccordionTab header="👤  Employee Form">
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 14 }}>
                <InputText
                  name="firstName"
                  placeholder="First Name"
                  value={newEmployee.firstName}
                  onChange={handleChange}
                  style={inputStyle}
                />
                <InputText
                  name="lastName"
                  placeholder="Last Name"
                  value={newEmployee.lastName}
                  onChange={handleChange}
                  style={inputStyle}
                />
                <select
                  value={newEmployee.departmentId}
                  onChange={(e) =>
                    setNewEmployee({ ...newEmployee, departmentId: parseInt(e.target.value) })
                  }
                  style={selectStyle}
                >
                  <option value="">Select Department</option>
                  {departments.map((dept) => (
                    <option key={dept.departmentId} value={dept.departmentId}>
                      {dept.departmentName}
                    </option>
                  ))}
                </select>
                <InputText
                  name="salary"
                  placeholder="Salary"
                  value={newEmployee.salary}
                  onChange={handleChange}
                  style={inputStyle}
                />
                <InputText
                  name="phoneNumber"
                  placeholder="Phone Number"
                  value={newEmployee.phoneNumber}
                  onChange={handleChange}
                  style={inputStyle}
                />
              </div>

              <div style={{ marginTop: 18, display: "flex", gap: 10 }}>
                {isEdit ? (
                  <>
                    <Button label="Update" icon="pi pi-check" onClick={updateEmployee} style={btn("#16a34a")} />
                    <Button label="Cancel" icon="pi pi-times" onClick={resetForm}       style={btn("#ef4444")} />
                  </>
                ) : (
                  <Button label="Add Employee" icon="pi pi-plus" onClick={createEmployee} style={btn("#2563eb")} />
                )}
              </div>
            </AccordionTab>
          )}

          {/* LIST TAB */}
          <AccordionTab header="👥  Employee List">
            <div style={{ marginBottom: 16 }}>
              <InputText
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="Search employee..."
                style={{ ...inputStyle, width: 300, borderRadius: 14 }}
              />
            </div>

            <DataTable
              value={filteredEmployees}
              paginator
              rows={5}
              responsiveLayout="scroll"
              emptyMessage={
                <span style={{ color: t.textMuted }}>No employees found.</span>
              }
            >
              <Column field="id"             header="ID"           style={{ width: 70 }} />
              <Column field="firstName"      header="First Name"   />
              <Column field="lastName"       header="Last Name"    />
              <Column field="departmentName" header="Department"   />
              <Column field="salary"         header="Salary"       />
              <Column field="phoneNumber"    header="Phone Number" />
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

export default EmployeeList;


// import { DataTable } from "primereact/datatable";
// import { Column } from "primereact/column";
// import "primereact/resources/themes/lara-light-cyan/theme.css";
// import "primeicons/primeicons.css";

// import { Button } from "primereact/button";
// import { InputText } from "primereact/inputtext";
// import { confirmDialog } from "primereact/confirmdialog";
// import { Toast } from "primereact/toast";
// import { Accordion, AccordionTab } from "primereact/accordion";

// import React, { useEffect, useRef, useState } from "react";

// import { Sidebar } from "primereact/sidebar";
// import { useNavigate } from "react-router-dom";

// import API_CONFIG from "./api";

// function EmployeeList() {

//   const toast = useRef(null);

//   const navigate = useNavigate();

//   // TOKEN + ROLE
//   const token = localStorage.getItem("token");
//   const role = localStorage.getItem("role");

//   // ROLE CHECK
//   const isAdmin = role === "Admin";
//   const isSuperUser = role === "SuperUser";
//   const isUser = role === "User";

//   // LOGOUT
//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("role");

//     navigate("/");
//   };

//   const [sidebarVisible, setSidebarVisible] = useState(false);
//   const [darkMode, setDarkMode] = useState(
//   localStorage.getItem("theme") === "dark"
// );

//   // EMPLOYEE STATE
//   const [employees, setEmployees] = useState([]);
//   // DEPARTMENTS
//   const [departments, setDepartments] = useState([]);

//   const [activeIndex, setActiveIndex] = useState(0);

//   const [isEdit, setIsEdit] = useState(false);

//   const [searchText, setSearchText] = useState("");
//   const [newEmployee, setNewEmployee] = useState({
//   id: 0,
//   firstName: "",
//   lastName: "",
//   // departmentId:"",
//   departmentName: "",
//   salary: "",
//   phoneNumber: "",
//   isActive: true
// });

//   // const [newEmployee, setNewEmployee] = useState({
//   //   id: 0,
//   //   firstName: "",
//   //   lastName: "",
//   //   departmentId: "",
//   //   salary: "",
//   //   phoneNumber: "",
//   //   isActive: true
//   // });

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

//   // GET EMPLOYEES
//   const fetchEmployees = async () => {

//     try {

//       const res = await fetch(
//         API_CONFIG.EMPLOYEE_URL,
//         {
//           method: "GET",
//           headers: authHeader
//         }
//       );

//       if (checkUnauthorized(res)) return;

//       const data = await res.json();

//       setEmployees(data);

//     } catch (err) {

//       console.error(err);

//     }
//   };
//        // GET DEPARTMENTS
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

//     fetchEmployees();
//      fetchDepartments();

//   }, []);

//   // INPUT CHANGE
//   const handleChange = (e) => {

//     const { name, value } = e.target;

//     setNewEmployee({
//       ...newEmployee,
//       [name]: value
//     });
//   };
//    // RESET FORM
// const resetForm = () => {

//   setNewEmployee({
//     id: 0,
//     firstName: "",
//     lastName: "",
//     // departmentId:"",
//     // departmentName: "",
//     salary: "",
//     phoneNumber: "",
//     isActive: true
//   });

//   setIsEdit(false);

//   setActiveIndex(0);
// };
//   // // RESET FORM
//   // const resetForm = () => {

//   //   setNewEmployee({
//   //     id: 0,
//   //     firstName: "",
//   //     lastName: "",
//   //     departmentId: "",
//   //     salary: "",
//   //     phoneNumber: "",
//   //     isActive: true
//   //   });

//   //   setIsEdit(false);

//   //   setActiveIndex(0);
//   // };

//   // CREATE
//   const createEmployee = async () => {

//     try {

//       const res = await fetch(
//         API_CONFIG.EMPLOYEE_URL,
//         {
//           method: "POST",
//           headers: authHeader,
//           body: JSON.stringify(newEmployee)
//         }
//       );

//       if (checkUnauthorized(res)) return;

//       if (!res.ok) {
//         throw new Error("Add failed");
//       }

//       fetchEmployees();

//       resetForm();

//       toast.current.show({
//         severity: "success",
//         summary: "Success",
//         detail: "Employee Added",
//         life: 3000
//       });

//     } catch (err) {

//       console.error(err);

//     }
//   };

//   // EDIT
//   const editEmployee = (emp) => {

//     setNewEmployee(emp);

//     setIsEdit(true);

//     setActiveIndex(0);
//   };

//   // UPDATE
//   const updateEmployee = async () => {

//     try {

//       const res = await fetch(
//         `${API_CONFIG.EMPLOYEE_URL}?Id=${newEmployee.id}`,
//         {
//           method: "PUT",
//           headers: authHeader,
//           body: JSON.stringify(newEmployee)
//         }
//       );

//       if (checkUnauthorized(res)) return;

//       if (!res.ok) {
//         throw new Error("Update failed");
//       }

//       fetchEmployees();

//       resetForm();

//       toast.current.show({
//         severity: "success",
//         summary: "Updated",
//         detail: "Employee Updated",
//         life: 3000
//       });

//     } catch (err) {

//       console.error(err);

//     }
//   };

//   // DELETE
//   const deleteEmployee = async (id) => {

//     try {

//       const res = await fetch(
//         `${API_CONFIG.EMPLOYEE_URL}?Id=${id}`,
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

//       fetchEmployees();

//       toast.current.show({
//         severity: "warn",
//         summary: "Deleted",
//         detail: "Employee Deleted",
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
//       accept: () => deleteEmployee(id)
//     });
//   };

//   // SEARCH
//   const filteredEmployees = employees.filter((emp) =>
//     `${emp.firstName || ""} 
//      ${emp.lastName || ""} 
//      ${emp.departmentId || ""} 
//      ${emp.phoneNumber || ""}`
//       .toLowerCase()
//       .includes(searchText.toLowerCase())
//   );
//   const bgColor = darkMode
//   ? "#0f172a"
//   : "#f8fafc";

// const cardBg = darkMode
//   ? "#1e293b"
//   : "#ffffff";

// const textColor = darkMode
//   ? "#ffffff"
//   : "#0f172a";

// const subTextColor = darkMode
//   ? "#cbd5e1"
//   : "#64748b";

// const inputBg = darkMode
//   ? "#334155"
//   : "#ffffff";

// const borderColor = darkMode
//   ? "#475569"
//   : "#ced4da";

//   return (

//     <div
//       style={{
//         minHeight: "100vh",
//         background: darkMode
//   ? "linear-gradient(135deg,#020617,#0f172a,#1e293b)"
//   : "linear-gradient(135deg,#e0f2fe,#eef2ff,#f8fafc)",
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
//               Employee Management
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
//          background: cardBg,
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

//             <AccordionTab header="Employee Form">

//               <div
//                 style={{
//                   display: "grid",
//                   gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
//                   gap: "15px",
//                   marginTop: "15px"
//                 }}
//               >

//                 <InputText
//                   name="firstName"
//                   placeholder="First Name"
//                   value={newEmployee.firstName}
//                   onChange={handleChange}
//                 />

//                 <InputText
//                   name="lastName"
//                   placeholder="Last Name"
//                   value={newEmployee.lastName}
//                   onChange={handleChange}
//                 />

//                {/* DEPARTMENT DROPDOWN */}
// <select
//   value={newEmployee.departmentId}
//   onChange={(e) =>
//     setNewEmployee({
//       ...newEmployee,
//       departmentId: parseInt(e.target.value)
//     })
//   }
//   style={{
//     padding: "10px",
//     borderRadius: "8px",
//     border: "1px solid #ced4da"
//   }}
// >
//   <option value="">
//     Select Department
//   </option>

//   {departments.map((dept) => (
//     <option
//       key={dept.departmentId}
//       value={dept.departmentId}
//     >
//       {dept.departmentName}
//     </option>
//   ))}
// </select>
//                 {/* <select
//                   value={newEmployee.departmentId}
//                   onChange={(e) => {

//                     const selectedId = e.target.value;

//                     const selectedDepartment = departments.find(
//                       (d) =>
//                         d.departmentId.toString() === selectedId
//                     );

//                     setNewEmployee({
//                       ...newEmployee,
//                       departmentId: selectedId,
//                       departmentName:
//                         selectedDepartment?.departmentName || ""
//                     });
//                   }}
//                   style={{
//                     padding: "10px",
//                     borderRadius: "8px",
//                     border: "1px solid #ced4da"
//                   }}
//                 >

//                   <option value="">
//                     Select Department ID
//                   </option>

//                   {departments.map((dept) => (

//                     <option
//                       key={dept.departmentId}
//                       value={dept.departmentId}
//                     >
//                       {dept.departmentId}
//                     </option>

//                   ))}

//                 </select> */}


//                 <InputText
//                   name="salary"
//                   placeholder="Salary"
//                   value={newEmployee.salary}
//                   onChange={handleChange}
//                 />

//                 <InputText
//                   name="phoneNumber"
//                   placeholder="Phone Number"
//                   value={newEmployee.phoneNumber}
//                   onChange={handleChange}
//                 />

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
//                       onClick={updateEmployee}
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
//                     label="Add Employee"
//                     icon="pi pi-plus"
//                     onClick={createEmployee}
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

//           {/* EMPLOYEE LIST */}
//           <AccordionTab header="Employee List">

//             <div style={{ marginBottom: "15px", marginTop: "10px" }}>

//               <InputText
//                 value={searchText}
//                 onChange={(e) => setSearchText(e.target.value)}
//                 placeholder="Search employee..."
//                 style={{
//                   width: "300px",
//                   borderRadius: "12px"
//                 }}
//               />

//             </div>

//             <DataTable
//               value={filteredEmployees}
//               paginator
//               rows={5}
//               stripedRows
//               showGridlines
//               responsiveLayout="scroll"
//             >

//               <Column field="id" header="ID" />

//               <Column field="firstName" header="First Name" />

//               <Column field="lastName" header="Last Name" />

//               <Column field="departmentName" header="DepartmentName" />

//               <Column field="salary" header="Salary" />

//               <Column field="phoneNumber" header="Phone Number" />

//               {/* ADMIN ONLY ACTION */}
//               {isAdmin && (

//                 <Column
//                   header="Action"
//                   body={(rowData) => (
//                     <div style={{ display: "flex", gap: "8px" }}>

//                       <Button
//                         icon="pi pi-pencil"
//                         onClick={() => editEmployee(rowData)}
//                         style={{
//                           background: "#f59e0b",
//                           border: "none",
//                           borderRadius: "10px"
//                         }}
//                       />

//                       <Button
//                         icon="pi pi-trash"
//                         onClick={() => confirmDelete(rowData.id)}
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

// export default EmployeeList;





// import { DataTable } from "primereact/datatable";
// import { Column } from "primereact/column";
// import "primereact/resources/themes/lara-light-cyan/theme.css";
// import "primeicons/primeicons.css";
// import { Button } from "primereact/button";
// import { InputText } from "primereact/inputtext";
// import { confirmDialog, ConfirmDialog } from "primereact/confirmdialog";
// import { Toast } from "primereact/toast";
// import { Accordion, AccordionTab } from "primereact/accordion";
// import React, { useEffect, useRef, useState } from "react";
// import { Password } from "primereact/password";
// import { Sidebar } from "primereact/sidebar";
// import { useNavigate } from "react-router-dom";
// import API_CONFIG from "./api";   // ✅ add this
// function EmployeeList() {
//   const toast = useRef(null);
//    const navigate = useNavigate();
//    const token = localStorage.getItem("token");
//    const handleLogout = () => {
//     localStorage.removeItem("token");
//     navigate("/");
//   };
//   const [sidebarVisible, setSidebarVisible] = useState(false);
//   // LOGIN STATE
//   const [isLogin, setIsLogin] = useState(false);
//   const [loginData, setLoginData] = useState({
//     username: "",
//     password: ""
//   });
//   //  Employee State  
//   const [employees, setEmployees] = useState([]);
//   const [activeIndex, setActiveIndex] = useState(0);
//   const [isEdit, setIsEdit] = useState(false);
//   const [searchText, setSearchText] = useState("");
//   // NEW (only for popup close fix)
//   const [showDeleteDialog, setShowDeleteDialog] = useState(false);
//   const [deleteId, setDeleteId] = useState(null);



//   const [newEmployee, setNewEmployee] = useState({
//     id: 0,
//     firstName: "",
//     lastName: "",
//     departmentId: "",
//     salary: "",
//     phoneNumber: "",
//     isActive: true
//   });
//   // ✅ API URL from ENV
//   const API_URL = API_CONFIG.EMPLOYEE_URL;

//    const authHeader = {
//     "Content-Type": "application/json",
//     Authorization: `Bearer ${token}`
//   };

//   const checkUnauthorized = (res) => {
//     if (res.status === 401) {
//       localStorage.removeItem("token");
//       navigate("/");
//       return true;
//     }
//     return false;
//   };

//   // GET ALL
//   const fetchEmployees = async () => {
//     try {
//       const res = await fetch(  API_CONFIG.EMPLOYEE_URL, {
//         method: "GET",
//         headers: authHeader
//       });

//       if (checkUnauthorized(res)) return;

//       const data = await res.json();
//       setEmployees(data);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   useEffect(() => {
//     if (!token) {
//       navigate("/");
//       return;
//     }

//     fetchEmployees();
//   }, []);

//   // INPUT
//   const handleChange = (e) => {
//     const { name, value } = e.target;

//     setNewEmployee({
//       ...newEmployee,
//       [name]: value
//     });
//   };

// //   // LOGIN FUNCTION
 
// //   const handleLogin = () => {
// //   fetch("https://localhost:7175/api/Auth/login", {
// //     method: "POST",
// //     headers: {
// //       "Content-Type": "application/json"
// //     },
// //     body: JSON.stringify(loginData)
// //   })
// //     .then((res) => {
// //       if (!res.ok) {
// //         throw new Error("Login Failed");
// //       }
// //       return res.json();
// //     })
// //     .then((data) => {
// //       localStorage.setItem("token", data.token);
// //       localStorage.setItem("username", loginData.username);

// //       setIsLogin(true);
// //       navigate("/employee");

// //       toast.current.show({
// //         severity: "success",
// //         summary: "Success",
// //         detail: "Login Successful",
// //         life: 3000
// //       });
// //     })
// //     .catch((err) => {
// //       toast.current.show({
// //         severity: "error",
// //         summary: "Error",
// //         detail: "Invalid Username or Password",
// //         life: 3000
// //       });

// //       console.error(err);
// //     });
// // };
//   // // LOGOUT
//   // const handleLogout = () => {
//   //   setIsLogin(false);
//   //   setLoginData({
//   //     username: "",
//   //     password: ""
//   //   });
//   // };

// //   // GET ALL
// //   const fetchEmployees = () => {
// //     fetch("https://localhost:7175/api/Employee")
// //       .then((res) => res.json())
// //       .then((data) => setEmployees(data))
// //       .catch((err) => console.error(err));
// //   };

// //  useEffect(() => {
// //   const token = localStorage.getItem("token");

// //   if (!token) {
// //     navigate("/");
// //     return;
// //   }

// //   fetchEmployees();
// // }, [navigate]);

// //   // INPUT CHANGE
// //   const handleChange = (e) => {
// //     const { name, value } = e.target;

// //     setNewEmployee({
// //       ...newEmployee,
// //       [name]: value
// //     });
// //   };

//   // RESET
//   const resetForm = () => {
//     setNewEmployee({
//       id: 0,
//       firstName: "",
//       lastName: "",
//       departmentId: "",
//       salary: "",
//       phoneNumber: "",
//       isActive: true
//     });

//     setIsEdit(false);
//     setActiveIndex(1);
//   };
//      // ADD
//   const createEmployee = async () => {
//     try {
//       const res = await fetch(  API_CONFIG.EMPLOYEE_URL, {
//         method: "POST",
//         headers: authHeader,
//         body: JSON.stringify(newEmployee)
//       });

//       if (checkUnauthorized(res)) return;
//       if (!res.ok) throw new Error("Add failed");

//       fetchEmployees();
//       resetForm();

//       toast.current.show({
//         severity: "success",
//         summary: "Success",
//         detail: "Employee Added",
//         life: 3000
//       });
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   // // ADD
//   // const createEmployee = () => {
//   //   fetch("https://localhost:7175/api/Employee", {
//   //     method: "POST",
//   //     headers: {
//   //       "Content-Type": "application/json"
//   //     },
//   //     body: JSON.stringify(newEmployee)
//   //   })
//   //     .then((res) => {
//   //       if (!res.ok) throw new Error("Add failed");

//   //       fetchEmployees();
//   //       resetForm();

//   //       toast.current.show({
//   //         severity: "success",
//   //         summary: "Success",
//   //         detail: "Employee Added",
//   //         life: 3000
//   //       });
//   //     })
//   //     .catch((err) => console.error(err));
//   // };

//   // EDIT
//   const editEmployee = (emp) => {
//     setNewEmployee(emp);
//     setIsEdit(true);
//     setActiveIndex(0);
//   };
//      // UPDATE
//   const updateEmployee = async () => {
//     try {
//       const res = await fetch(
//         `${API_CONFIG.EMPLOYEE_URL}?Id=${newEmployee.id}`,
//         {
//           method: "PUT",
//           headers: authHeader,
//           body: JSON.stringify(newEmployee)
//         }
//       );

//       if (checkUnauthorized(res)) return;
//       if (!res.ok) throw new Error("Update failed");

//       fetchEmployees();
//       resetForm();

//       toast.current.show({
//         severity: "success",
//         summary: "Updated",
//         detail: "Employee Updated",
//         life: 3000
//       });
//     } catch (err) {
//       console.error(err);
//     }
//   };
//        // DELETE
//   const deleteEmployee = async (id) => {
//     try {
//       const res = await fetch(
//          `${API_CONFIG.EMPLOYEE_URL}?Id=${id}`,
//         {
//           method: "DELETE",
//           headers: {
//             Authorization: `Bearer ${token}`
//           }
//         }
//       );

//       if (checkUnauthorized(res)) return;
//       if (!res.ok) throw new Error("Delete failed");

//       fetchEmployees();

//       toast.current.show({
//         severity: "warn",
//         summary: "Deleted",
//         detail: "Employee Deleted",
//         life: 3000
//       });
//     } catch (err) {
//       console.error(err);
//     }
//   };
//   // // UPDATE
//   // const updateEmployee = () => {
//   //   fetch(`https://localhost:7175/api/Employee?Id=${newEmployee.id}`, {
//   //     method: "PUT",
//   //     headers: {
//   //       "Content-Type": "application/json"
//   //     },
//   //     body: JSON.stringify(newEmployee)
//   //   })
//   //     .then((res) => {
//   //       if (!res.ok) throw new Error("Update failed");

//   //       fetchEmployees();
//   //       resetForm();

//   //       toast.current.show({
//   //         severity: "success",
//   //         summary: "Updated",
//   //         detail: "Employee Updated",
//   //         life: 3000
//   //       });
//   //     })
//   //     .catch((err) => console.error(err));
//   // };

//   // // DELETE
//   // const deleteEmployee = async (id) => {
//   //   try {
//   //     const res = await fetch(
//   //       `https://localhost:7175/api/Employee?Id=${id}`,
//   //       {
//   //         method: "DELETE"
//   //       }
//   //     );

//   //     if (!res.ok) throw new Error("Delete failed");

//   //     fetchEmployees();

//   //     toast.current.show({
//   //       severity: "warn",
//   //       summary: "Deleted",
//   //       detail: "Employee Deleted",
//   //       life: 3000
//   //     });
//   //   } catch (err) {
//   //     console.error(err);
//   //   }
//   // };

//   // OPEN DELETE POPUP
//   const confirmDelete = (id) => {
//     confirmDialog({
//       message: "Are you sure you want to delete?",
//       header: "Delete Confirmation",
//       icon: "pi pi-exclamation-triangle",
//       accept: () => deleteEmployee(id)
//     });
//   };

//   // YES CLICK
//   const acceptDelete = async () => {
//     await deleteEmployee(deleteId);
//     setShowDeleteDialog(false);
//   };

//   // NO CLICK
//   const rejectDelete = () => {
//     setShowDeleteDialog(false);
//   };

//   // SEARCH FILTER
//   const filteredEmployees = employees.filter((emp) =>
//     `${emp.firstName || ""} ${emp.lastName || ""} ${emp.departmentId || ""} ${emp.phoneNumber || ""}`
//       .toLowerCase()
//       .includes(searchText.toLowerCase())
//   );
  
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
//             Employee Management
//           </h2>
//           <small style={{ color: "#64748b" }}>
//             Manage employee records easily
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
//         <AccordionTab header="Employee Form">
//           <div
//             style={{
//               display: "grid",
//               gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
//               gap: "15px",
//               marginTop: "15px"
//             }}
//           >
//             <InputText
//               name="firstName"
//               placeholder="First Name"
//               value={newEmployee.firstName}
//               onChange={handleChange}
//             />

//             <InputText
//               name="lastName"
//               placeholder="Last Name"
//               value={newEmployee.lastName}
//               onChange={handleChange}
//             />

//             <InputText
//               name="departmentId"
//               placeholder="Department ID"
//               value={newEmployee.departmentId}
//               onChange={handleChange}
//             />

//             <InputText
//               name="salary"
//               placeholder="Salary"
//               value={newEmployee.salary}
//               onChange={handleChange}
//             />

//             <InputText
//               name="phoneNumber"
//               placeholder="Phone Number"
//               value={newEmployee.phoneNumber}
//               onChange={handleChange}
//             />
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
//                   onClick={updateEmployee}
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
//                 label="Add Employee"
//                 icon="pi pi-plus"
//                 onClick={createEmployee}
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
//         <AccordionTab header="Employee List">
//           <div style={{ marginBottom: "15px", marginTop: "10px" }}>
//             <InputText
//               value={searchText}
//               onChange={(e) => setSearchText(e.target.value)}
//               placeholder="Search employee..."
//               style={{
//                 width: "300px",
//                 borderRadius: "12px"
//               }}
//             />
//           </div>

//           <DataTable
//             value={filteredEmployees}
//             paginator
//             rows={5}
//             stripedRows
//             showGridlines
//             responsiveLayout="scroll"
//           >
//             <Column field="id" header="ID" />
//             <Column field="firstName" header="First Name" />
//             <Column field="lastName" header="Last Name" />
//             <Column field="departmentId" header="Department ID" />
//             <Column field="salary" header="Salary" />
//             <Column field="phoneNumber" header="Phone Number" />

//             <Column
//               header="Action"
//               body={(rowData) => (
//                 <div style={{ display: "flex", gap: "8px" }}>
//                   <Button
//                     icon="pi pi-pencil"
//                     onClick={() => editEmployee(rowData)}
//                     style={{
//                       background: "#f59e0b",
//                       border: "none",
//                       borderRadius: "10px"
//                     }}
//                   />

//                   <Button
//                     icon="pi pi-trash"
//                     onClick={() => confirmDelete(rowData.id)}
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

// export default EmployeeList;