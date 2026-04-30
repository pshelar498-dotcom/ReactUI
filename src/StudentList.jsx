


import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import "primeicons/primeicons.css";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { confirmDialog, ConfirmDialog } from "primereact/confirmdialog";
import { Toast } from "primereact/toast";
import React, { useEffect, useRef, useState } from "react";
import { Password } from "primereact/password";
import { Sidebar } from "primereact/sidebar";
import { useNavigate } from "react-router-dom";
import { Accordion, AccordionTab } from "primereact/accordion";
import API_CONFIG from "./api";   // ✅ add this
function StudentList() {
  const toast = useRef(null);
const navigate = useNavigate();
const token = localStorage.getItem("token");
const handleLogout = () => {
  localStorage.removeItem("token");
  navigate("/");
};
  // LOGIN STATE
  // const [isLogin, setIsLogin] = useState(false);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  // const [loginData, setLoginData] = useState({
  //   username: "",
  //   password: ""
  // });

  // STUDENT STATE
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [isEdit, setIsEdit] = useState(false);

    const [activeIndex, setActiveIndex] = useState(1);
// const [deleteId, setDeleteId] = useState(null);
// const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [newStudent, setNewStudent] = useState({
    studentId: 0,
    firstName: "",
    lastName: "",
    age: "",
    class: "",
    phoneNumber: "",
    isActive: true
  });
  //     const handleLogout = () => {
  //   localStorage.removeItem("token");
  //   navigate("/");
  // };
    const API_URL = API_CONFIG.STUDENT_URL;
  // COMMON HEADER
  const authHeader = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`
  };

  // GET ALL
  const fetchStudents = async () => {
    try {
      const res = await fetch(API_CONFIG.STUDENT_URL, {
        method: "GET",
        headers: authHeader
      });

      if (res.status === 401) {
        localStorage.removeItem("token");
        navigate("/");
        return;
      }

      const data = await res.json();
      setStudents(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (!token) {
      navigate("/");
      return;
    }

    fetchStudents();
  }, []);

  // INPUT
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setNewStudent({
      ...newStudent,
      [name]: type === "checkbox" ? checked : value
    });
  };

  //    // LOGIN FUNCTION
  // const handleLogin = () => {
  //   if (
  //     loginData.username === "admin" &&
  //     loginData.password === "12345"
  //   ) {
  //     setIsLogin(true);

  //     toast.current.show({
  //       severity: "success",
  //       summary: "Success",
  //       detail: "Login Successful",
  //       life: 3000
  //     });
  //   } else {
  //     toast.current.show({
  //       severity: "error",
  //       summary: "Error",
  //       detail: "Invalid Username or Password",
  //       life: 3000
  //     });
  //   }
  // };

  // // LOGOUT
  // const handleLogout = () => {
  //   setIsLogin(false);
  //   setLoginData({
  //     username: "",
  //     password: ""
  //   });
  // };
  // GET ALL
//   const fetchStudents = () => {
//     fetch("https://localhost:7175/api/Student")
//       .then((res) => res.json())
//       .then((data) => setStudents(data))
//       .catch((err) => console.error(err));
//   };

//  useEffect(() => {
//   const token = localStorage.getItem("token");

//   if (!token) {
//     navigate("/");
//     return;
//   }

//   fetchStudents();
// } [navigate];


//   // HANDLE INPUT
//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;

//     setNewStudent({
//       ...newStudent,
//       [name]: type === "checkbox" ? checked : value
//     });
//   };

  // RESET
  const resetForm = () => {
    setNewStudent({
      studentId: 0,
      firstName: "",
      lastName: "",
      age: "",
      class: "",
      phoneNumber: "",
      isActive: true
    });

    setIsEdit(false);
  };
     // ADD
  const createStudent = async () => {
    try {
      const res = await fetch(API_CONFIG.STUDENT_URL, {
        method: "POST",
        headers: authHeader,
        body: JSON.stringify({
          ...newStudent,
          studentId: Number(newStudent.studentId)
        })
      });

      if (res.status === 401) {
        localStorage.removeItem("token");
        navigate("/");
        return;
      }

      fetchStudents();
      resetForm();
      setActiveIndex(1);
    } catch (err) {
      console.error(err);
    }
  };
  // // ADD
  // const createStudent = () => {
  //   fetch("https://localhost:7175/api/Student", {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json"
  //     },
  //     body: JSON.stringify({
  //       ...newStudent,
  //       studentId: Number(newStudent.studentId)
  //     })
  //   })
  //     .then(() => {
  //       fetchStudents();
  //       resetForm();
  //       setActiveIndex(1);   // Open Student List tab automatically
  //     })
  //     .catch((err) => console.error(err));
  // };

  // EDIT
  const editStudent = (stu) => {
  setNewStudent(stu);
  setIsEdit(true);
  setActiveIndex(0);   // Open Student Form tab
};
    // UPDATE
  const updateStudent = async () => {
    try {
      const res = await fetch(API_CONFIG.STUDENT_URL, {
        method: "PUT",
        headers: authHeader,
        body: JSON.stringify(newStudent)
      });

      if (res.status === 401) {
        localStorage.removeItem("token");
        navigate("/");
        return;
      }

      fetchStudents();
      resetForm();
      setActiveIndex(1);
    } catch (err) {
      console.error(err);
    }
  };
       // DELETE
  const deleteStudent = async (id) => {
    try {
      const res = await fetch(`${API_CONFIG.STUDENT_URL}/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (res.status === 401) {
        localStorage.removeItem("token");
        navigate("/");
        return;
      }

      fetchStudents();

      toast.current.show({
        severity: "warn",
        summary: "Deleted",
        detail: "Student Deleted",
        life: 3000
      });
    } catch (err) {
      console.error(err);
    }
  };

  // // UPDATE
  // const updateStudent = () => {
  //   fetch("https://localhost:7175/api/Student", {
  //     method: "PUT",
  //     headers: {
  //       "Content-Type": "application/json"
  //     },
  //     body: JSON.stringify(newStudent)
  //   })
  //     .then(() => {
  //       fetchStudents();
  //       resetForm();
  //       setActiveIndex(1);   // Open Student List tab automatically
  //     })
  //     .catch((err) => console.error(err));
  // };

//   // DELETE
//  const deleteStudent = async (id) => {
//   try {
//     await fetch(`https://localhost:7175/api/Student/${id}`, {
//       method: "DELETE"
//     });

//     fetchStudents();

//     toast.current.show({
//       severity: "warn",
//       summary: "Deleted",
//       detail: "Student Deleted",
//       life: 3000
//     });
//   } catch (err) {
//     console.error(err);
//   }
// };

// const confirmDelete = (id) => {
//   confirmDialog({
//     message: "Are you sure you want to delete?",
//     header: "Delete Confirmation",
//     icon: "pi pi-exclamation-triangle",
//     acceptLabel: "Yes",
//     rejectLabel: "No",
//     accept:  () => {
//        deleteStudent(id);
{     }
  
  //    // YES CLICK
  // const acceptDelete = async () => {
  //   await deleteStudent(deleteId);
  //   setShowDeleteDialog(false);
  // };

  // // NO CLICK
  // const rejectDelete = () => {
  //   setShowDeleteDialog(false);
  // };  
  // SEARCH FILTER
  const filteredStudents = students.filter((stu) =>
    Object.values(stu)
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase())
  );
      // LOGIN PAGE
  
 return (
  <div
    style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg,#e0f2fe,#eef2ff,#f8fafc)",
      padding: "25px"
    }}
  >
    <Toast ref={toast} />
    <ConfirmDialog />

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

          {/* <div>
            <h2 style={{ margin: 0, color: "#0f172a" }}>
              Student Management
            </h2>
            <small style={{ color: "#64748b" }}>
              Manage student records easily
            </small>
          </div> */}
      </div>
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
        {/* FORM */}
        <AccordionTab header="Student Form">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
              gap: "15px",
              marginTop: "15px"
            }}
          >
            <InputText
              name="studentId"
              placeholder="Student ID"
              value={newStudent.studentId}
              onChange={handleChange}
              disabled={isEdit}
            />

            <InputText
              name="firstName"
              placeholder="First Name"
              value={newStudent.firstName}
              onChange={handleChange}
            />

            <InputText
              name="lastName"
              placeholder="Last Name"
              value={newStudent.lastName}
              onChange={handleChange}
            />

            <InputText
              name="age"
              placeholder="Age"
              value={newStudent.age}
              onChange={handleChange}
            />

            <InputText
              name="class"
              placeholder="Class"
              value={newStudent.class}
              onChange={handleChange}
            />

            <InputText
              name="phoneNumber"
              placeholder="Phone Number"
              value={newStudent.phoneNumber}
              onChange={handleChange}
            />
          </div>

          <div style={{ marginTop: "15px" }}>
            <label>
              <input
                type="checkbox"
                name="isActive"
                checked={newStudent.isActive}
                onChange={handleChange}
                style={{ marginRight: "8px" }}
              />
              Active
            </label>
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
                  onClick={updateStudent}
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
                label="Add Student"
                icon="pi pi-plus"
                onClick={createStudent}
                style={{
                  borderRadius: "12px",
                  background: "#2563eb",
                  border: "none"
                }}
              />
            )}
          </div>
        </AccordionTab>

        {/* LIST */}
        <AccordionTab header="Student List">
          <div style={{ marginBottom: "15px", marginTop: "10px" }}>
            <InputText
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search student..."
              style={{
                width: "300px",
                borderRadius: "12px"
              }}
            />
          </div>

          <DataTable
            value={filteredStudents}
            paginator
            rows={5}
            stripedRows
            showGridlines
            responsiveLayout="scroll"
          >
            <Column field="studentId" header="ID" />
            <Column field="firstName" header="First Name" />
            <Column field="lastName" header="Last Name" />
            <Column field="age" header="Age" />
            <Column field="class" header="Class" />
            <Column field="phoneNumber" header="Phone" />

            <Column
              field="isActive"
              header="Status"
              body={(row) =>
                row.isActive ? "Active" : "Inactive"
              }
            />

            <Column
              header="Action"
              body={(row) => (
                <div style={{ display: "flex", gap: "8px" }}>
                  <Button
                    icon="pi pi-pencil"
                    onClick={() => editStudent(row)}
                    style={{
                      background: "#f59e0b",
                      border: "none",
                      borderRadius: "10px"
                    }}
                  />

                  <Button
                    icon="pi pi-trash"
                    onClick={() => deleteStudent(row.studentId)}
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

export default StudentList;