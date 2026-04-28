import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import "primeicons/primeicons.css";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { confirmDialog, ConfirmDialog } from "primereact/confirmdialog";
import { Toast } from "primereact/toast";
import { Accordion, AccordionTab } from "primereact/accordion";
import React, { useEffect, useRef, useState } from "react";
import { Password } from "primereact/password";
import { Sidebar } from "primereact/sidebar";
import { useNavigate } from "react-router-dom";
function EmployeeList() {
  const toast = useRef(null);
   const navigate = useNavigate();
   const token = localStorage.getItem("token");
   const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };
  const [sidebarVisible, setSidebarVisible] = useState(false);
  // LOGIN STATE
  const [isLogin, setIsLogin] = useState(false);
  const [loginData, setLoginData] = useState({
    username: "",
    password: ""
  });
  //  Employee State  
  const [employees, setEmployees] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isEdit, setIsEdit] = useState(false);
  const [searchText, setSearchText] = useState("");
  // NEW (only for popup close fix)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteId, setDeleteId] = useState(null);



  const [newEmployee, setNewEmployee] = useState({
    id: 0,
    firstName: "",
    lastName: "",
    departmentId: "",
    salary: "",
    phoneNumber: "",
    isActive: true
  });
   const authHeader = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`
  };

  const checkUnauthorized = (res) => {
    if (res.status === 401) {
      localStorage.removeItem("token");
      navigate("/");
      return true;
    }
    return false;
  };

  // GET ALL
  const fetchEmployees = async () => {
    try {
      const res = await fetch("https://localhost:7175/api/Employee", {
        method: "GET",
        headers: authHeader
      });

      if (checkUnauthorized(res)) return;

      const data = await res.json();
      setEmployees(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (!token) {
      navigate("/");
      return;
    }

    fetchEmployees();
  }, []);

  // INPUT
  const handleChange = (e) => {
    const { name, value } = e.target;

    setNewEmployee({
      ...newEmployee,
      [name]: value
    });
  };

//   // LOGIN FUNCTION
 
//   const handleLogin = () => {
//   fetch("https://localhost:7175/api/Auth/login", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json"
//     },
//     body: JSON.stringify(loginData)
//   })
//     .then((res) => {
//       if (!res.ok) {
//         throw new Error("Login Failed");
//       }
//       return res.json();
//     })
//     .then((data) => {
//       localStorage.setItem("token", data.token);
//       localStorage.setItem("username", loginData.username);

//       setIsLogin(true);
//       navigate("/employee");

//       toast.current.show({
//         severity: "success",
//         summary: "Success",
//         detail: "Login Successful",
//         life: 3000
//       });
//     })
//     .catch((err) => {
//       toast.current.show({
//         severity: "error",
//         summary: "Error",
//         detail: "Invalid Username or Password",
//         life: 3000
//       });

//       console.error(err);
//     });
// };
  // // LOGOUT
  // const handleLogout = () => {
  //   setIsLogin(false);
  //   setLoginData({
  //     username: "",
  //     password: ""
  //   });
  // };

//   // GET ALL
//   const fetchEmployees = () => {
//     fetch("https://localhost:7175/api/Employee")
//       .then((res) => res.json())
//       .then((data) => setEmployees(data))
//       .catch((err) => console.error(err));
//   };

//  useEffect(() => {
//   const token = localStorage.getItem("token");

//   if (!token) {
//     navigate("/");
//     return;
//   }

//   fetchEmployees();
// }, [navigate]);

//   // INPUT CHANGE
//   const handleChange = (e) => {
//     const { name, value } = e.target;

//     setNewEmployee({
//       ...newEmployee,
//       [name]: value
//     });
//   };

  // RESET
  const resetForm = () => {
    setNewEmployee({
      id: 0,
      firstName: "",
      lastName: "",
      departmentId: "",
      salary: "",
      phoneNumber: "",
      isActive: true
    });

    setIsEdit(false);
    setActiveIndex(1);
  };
     // ADD
  const createEmployee = async () => {
    try {
      const res = await fetch("https://localhost:7175/api/Employee", {
        method: "POST",
        headers: authHeader,
        body: JSON.stringify(newEmployee)
      });

      if (checkUnauthorized(res)) return;
      if (!res.ok) throw new Error("Add failed");

      fetchEmployees();
      resetForm();

      toast.current.show({
        severity: "success",
        summary: "Success",
        detail: "Employee Added",
        life: 3000
      });
    } catch (err) {
      console.error(err);
    }
  };

  // // ADD
  // const createEmployee = () => {
  //   fetch("https://localhost:7175/api/Employee", {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json"
  //     },
  //     body: JSON.stringify(newEmployee)
  //   })
  //     .then((res) => {
  //       if (!res.ok) throw new Error("Add failed");

  //       fetchEmployees();
  //       resetForm();

  //       toast.current.show({
  //         severity: "success",
  //         summary: "Success",
  //         detail: "Employee Added",
  //         life: 3000
  //       });
  //     })
  //     .catch((err) => console.error(err));
  // };

  // EDIT
  const editEmployee = (emp) => {
    setNewEmployee(emp);
    setIsEdit(true);
    setActiveIndex(0);
  };
     // UPDATE
  const updateEmployee = async () => {
    try {
      const res = await fetch(
        `https://localhost:7175/api/Employee?Id=${newEmployee.id}`,
        {
          method: "PUT",
          headers: authHeader,
          body: JSON.stringify(newEmployee)
        }
      );

      if (checkUnauthorized(res)) return;
      if (!res.ok) throw new Error("Update failed");

      fetchEmployees();
      resetForm();

      toast.current.show({
        severity: "success",
        summary: "Updated",
        detail: "Employee Updated",
        life: 3000
      });
    } catch (err) {
      console.error(err);
    }
  };
       // DELETE
  const deleteEmployee = async (id) => {
    try {
      const res = await fetch(
        `https://localhost:7175/api/Employee?Id=${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (checkUnauthorized(res)) return;
      if (!res.ok) throw new Error("Delete failed");

      fetchEmployees();

      toast.current.show({
        severity: "warn",
        summary: "Deleted",
        detail: "Employee Deleted",
        life: 3000
      });
    } catch (err) {
      console.error(err);
    }
  };
  // // UPDATE
  // const updateEmployee = () => {
  //   fetch(`https://localhost:7175/api/Employee?Id=${newEmployee.id}`, {
  //     method: "PUT",
  //     headers: {
  //       "Content-Type": "application/json"
  //     },
  //     body: JSON.stringify(newEmployee)
  //   })
  //     .then((res) => {
  //       if (!res.ok) throw new Error("Update failed");

  //       fetchEmployees();
  //       resetForm();

  //       toast.current.show({
  //         severity: "success",
  //         summary: "Updated",
  //         detail: "Employee Updated",
  //         life: 3000
  //       });
  //     })
  //     .catch((err) => console.error(err));
  // };

  // // DELETE
  // const deleteEmployee = async (id) => {
  //   try {
  //     const res = await fetch(
  //       `https://localhost:7175/api/Employee?Id=${id}`,
  //       {
  //         method: "DELETE"
  //       }
  //     );

  //     if (!res.ok) throw new Error("Delete failed");

  //     fetchEmployees();

  //     toast.current.show({
  //       severity: "warn",
  //       summary: "Deleted",
  //       detail: "Employee Deleted",
  //       life: 3000
  //     });
  //   } catch (err) {
  //     console.error(err);
  //   }
  // };

  // OPEN DELETE POPUP
  const confirmDelete = (id) => {
    confirmDialog({
      message: "Are you sure you want to delete?",
      header: "Delete Confirmation",
      icon: "pi pi-exclamation-triangle",
      accept: () => deleteEmployee(id)
    });
  };

  // YES CLICK
  const acceptDelete = async () => {
    await deleteEmployee(deleteId);
    setShowDeleteDialog(false);
  };

  // NO CLICK
  const rejectDelete = () => {
    setShowDeleteDialog(false);
  };

  // SEARCH FILTER
  const filteredEmployees = employees.filter((emp) =>
    `${emp.firstName || ""} ${emp.lastName || ""} ${emp.departmentId || ""} ${emp.phoneNumber || ""}`
      .toLowerCase()
      .includes(searchText.toLowerCase())
  );
  
 return (
  <div
    style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg,#e0f2fe,#eef2ff,#f8fafc)",
      padding: "25px"
    }}
  >
    <Toast ref={toast} />

    {/* Sidebar */}
    <Sidebar
      visible={sidebarVisible}
      position="left"
      onHide={() => setSidebarVisible(false)}
      style={{
        width: "280px",
        borderTopRightRadius: "20px",
        borderBottomRightRadius: "20px"
      }}
    >
      <h2 style={{ color: "#1e293b", marginBottom: "20px" }}>Menu</h2>

      <Button
        label="Employee"
        icon="pi pi-users"
        style={{
          width: "100%",
          marginBottom: "12px",
          borderRadius: "12px",
          background: "#3b82f6",
          border: "none"
        }}
        onClick={() => navigate("/employee")}
      />

      <Button
        label="Student"
        icon="pi pi-book"
        style={{
          width: "100%",
          marginBottom: "12px",
          borderRadius: "12px",
          background: "#8b5cf6",
          border: "none"
        }}
        onClick={() => navigate("/student")}
      />

      <Button
        label="Department"
        icon="pi pi-building"
        style={{
          width: "100%",
          marginBottom: "12px",
          borderRadius: "12px",
          background: "#14b8a6",
          border: "none"
        }}
        onClick={() => navigate("/department")}
      />

      <Button
        label="Logout"
        icon="pi pi-sign-out"
        style={{
          width: "100%",
          borderRadius: "12px",
          background: "#ef4444",
          border: "none"
        }}
        onClick={handleLogout}
      />
    </Sidebar>

    {/* Header */}
    <div
      style={{
        background: "#ffffff",
        padding: "18px 22px",
        borderRadius: "18px",
        boxShadow: "0 10px 25px rgba(0,0,0,.08)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "25px"
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <Button
          icon="pi pi-bars"
          onClick={() => setSidebarVisible(true)}
          style={{
            borderRadius: "12px",
            background: "#2563eb",
            border: "none"
          }}
        />

        <div>
          <h2 style={{ margin: 0, color: "#0f172a" }}>
            Employee Management
          </h2>
          <small style={{ color: "#64748b" }}>
            Manage employee records easily
          </small>
        </div>
      </div>

      {/* <Button
        label="Logout"
        icon="pi pi-sign-out"
        onClick={handleLogout}
        style={{
          borderRadius: "12px",
          background: "#ef4444",
          border: "none"
        }}
      /> */}
    </div>

    {/* Main Card */}
    <div
      style={{
        background: "#ffffff",
        borderRadius: "20px",
        padding: "20px",
        boxShadow: "0 12px 30px rgba(0,0,0,.08)"
      }}
    >
      <Accordion
        activeIndex={activeIndex}
        onTabChange={(e) => setActiveIndex(e.index)}
      >
        {/* Form */}
        <AccordionTab header="Employee Form">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
              gap: "15px",
              marginTop: "15px"
            }}
          >
            <InputText
              name="firstName"
              placeholder="First Name"
              value={newEmployee.firstName}
              onChange={handleChange}
            />

            <InputText
              name="lastName"
              placeholder="Last Name"
              value={newEmployee.lastName}
              onChange={handleChange}
            />

            <InputText
              name="departmentId"
              placeholder="Department ID"
              value={newEmployee.departmentId}
              onChange={handleChange}
            />

            <InputText
              name="salary"
              placeholder="Salary"
              value={newEmployee.salary}
              onChange={handleChange}
            />

            <InputText
              name="phoneNumber"
              placeholder="Phone Number"
              value={newEmployee.phoneNumber}
              onChange={handleChange}
            />
          </div>

          <div
            style={{
              marginTop: "18px",
              display: "flex",
              gap: "10px",
              flexWrap: "wrap"
            }}
          >
            {isEdit ? (
              <>
                <Button
                  label="Update"
                  icon="pi pi-check"
                  onClick={updateEmployee}
                  style={{
                    borderRadius: "12px",
                    background: "#16a34a",
                    border: "none"
                  }}
                />

                <Button
                  label="Cancel"
                  icon="pi pi-times"
                  onClick={resetForm}
                  style={{
                    borderRadius: "12px",
                    background: "#f59e0b",
                    border: "none"
                  }}
                />
              </>
            ) : (
              <Button
                label="Add Employee"
                icon="pi pi-plus"
                onClick={createEmployee}
                style={{
                  borderRadius: "12px",
                  background: "#2563eb",
                  border: "none"
                }}
              />
            )}
          </div>
        </AccordionTab>

        {/* List */}
        <AccordionTab header="Employee List">
          <div style={{ marginBottom: "15px", marginTop: "10px" }}>
            <InputText
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Search employee..."
              style={{
                width: "300px",
                borderRadius: "12px"
              }}
            />
          </div>

          <DataTable
            value={filteredEmployees}
            paginator
            rows={5}
            stripedRows
            showGridlines
            responsiveLayout="scroll"
          >
            <Column field="id" header="ID" />
            <Column field="firstName" header="First Name" />
            <Column field="lastName" header="Last Name" />
            <Column field="departmentId" header="Department ID" />
            <Column field="salary" header="Salary" />
            <Column field="phoneNumber" header="Phone Number" />

            <Column
              header="Action"
              body={(rowData) => (
                <div style={{ display: "flex", gap: "8px" }}>
                  <Button
                    icon="pi pi-pencil"
                    onClick={() => editEmployee(rowData)}
                    style={{
                      background: "#f59e0b",
                      border: "none",
                      borderRadius: "10px"
                    }}
                  />

                  <Button
                    icon="pi pi-trash"
                    onClick={() => confirmDelete(rowData.id)}
                    style={{
                      background: "#ef4444",
                      border: "none",
                      borderRadius: "10px"
                    }}
                  />
                </div>
              )}
            />
          </DataTable>
        </AccordionTab>
      </Accordion>
    </div>
  </div>
);
}

export default EmployeeList;