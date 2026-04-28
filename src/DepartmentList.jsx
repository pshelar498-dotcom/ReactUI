import React, { useEffect, useRef, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { confirmDialog } from 'primereact/confirmdialog';
import { Toast } from "primereact/toast";
import { Accordion, AccordionTab } from "primereact/accordion";
import { Password } from "primereact/password";
import { Sidebar } from "primereact/sidebar";
import { useNavigate } from "react-router-dom";
function DepartmentList() {
  const toast = useRef(null);

     const navigate = useNavigate();
     const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };
       const [sidebarVisible, setSidebarVisible] = useState(false);
    //  // LOGIN STATE
    //   const [isLogin, setIsLogin] = useState(false);
    //   const [loginData, setLoginData] = useState({
    //     username: "",
    //     password: ""
    //   });
    //  Department State
  const [departments, setDepartments] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isEdit, setIsEdit] = useState(false);
   const [searchText, setSearchText] = useState("");
  

  const [newDepartment, setNewDepartment] = useState({
    departmentId: 0,
    departmentName: "",
    isActive: true
  });
      const API_URL = "https://localhost:7175/api/Department";

  const getToken = () => {
    return localStorage.getItem("token");
  };

  const authHeader = () => {
    return {
      Authorization: `Bearer ${getToken()}`,
      "Content-Type": "application/json"
    };
  };

  const handleUnauthorized = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  // const handleLogout = () => {
  //   localStorage.removeItem("token");
  //   navigate("/");
  // };

  useEffect(() => {
    const token = getToken();

    if (!token) {
      navigate("/");
      return;
    }

    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const res = await fetch("https://localhost:7175/api/Department", {
        method: "GET",
        headers: authHeader()
      });

      if (res.status === 401) {
        handleUnauthorized();
        return;
      }

      const data = await res.json();
      setDepartments(data);
    } catch (error) {
      console.log(error);
    }
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
  // const fetchDepartments = () => {
  //   fetch("https://localhost:7175/api/Department")
  //     .then((res) => res.json())
  //     .then((data) => setDepartments(data))
  //     .catch((err) => console.error(err));
  // };

  useEffect(() => {
  const token = localStorage.getItem("token");

  if (!token) {
    navigate("/");
    return;
  }

  fetchDepartments();
}, [navigate]);

  // INPUT CHANGE
  const handleChange = (e) => {
    const { name, value } = e.target;

    setNewDepartment({
      ...newDepartment,
      [name]: name === "isActive" ? value === "true" : value
    });
  };

  // RESET
  const resetForm = () => {
    setNewDepartment({
      departmentId: 0,
      departmentName: "",
      isActive: true
    });

    setIsEdit(false);
    setActiveIndex(1);
  };
     const createDepartment = async () => {
  const token = localStorage.getItem("token");

  if (!token) {
    navigate("/");
    return;
  }

  try {
    const res = await fetch("https://localhost:7175/api/Department", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(newDepartment)
    });

    if (res.status === 401) {
      localStorage.removeItem("token");
      navigate("/");
      return;
    }

    if (!res.ok) {
      throw new Error("Add failed");
    }

    fetchDepartments();
    resetForm();

    toast.current.show({
      severity: "success",
      summary: "Success",
      detail: "Department Added",
      life: 3000
    });

  } catch (err) {
    console.error(err);

    toast.current.show({
      severity: "error",
      summary: "Error",
      detail: "Unable to add department",
      life: 3000
    });
  }
};

const confirmAdd = () => {
  confirmDialog({
    message: "Are you sure you want to add department?",
    header: "Confirmation",
    icon: "pi pi-check-circle",
    accept: () => createDepartment()
  });
};
  // ADD
  // const createDepartment = () => {
  //   fetch("https://localhost:7175/api/Department", {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json"
  //     },
  //     body: JSON.stringify(newDepartment)
  //   })
  //     .then(() => {
  //       fetchDepartments();
  //       resetForm();

  //       toast.current.show({
  //         severity: "success",
  //         summary: "Success",
  //         detail: "Department Added",
  //         life: 3000
  //       });
  //     })
  //     .catch((err) => console.error(err));
  // };

  // const confirmAdd = () => {
  //   confirmDialog({
  //     message: "Are you sure you want to add department?",
  //     header: "Confirmation",
  //     icon: "pi pi-check-circle",
  //     accept: () => createDepartment()
  //   });
  // };

  // DELETE
    const deleteDepartment = async (id) => {
  const token = localStorage.getItem("token");

  try {
    const res = await fetch(
      `https://localhost:7175/api/Department?id=${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    if (res.status === 401) {
      localStorage.removeItem("token");
      navigate("/");
      return;
    }

    if (!res.ok) {
      throw new Error("Delete failed");
    }

    fetchDepartments();

    toast.current.show({
      severity: "success",
      summary: "Deleted",
      detail: "Department Deleted Successfully",
      life: 3000
    });
  } catch (error) {
    console.log(error);
  }
};

  const confirmDelete = (id) => {
    confirmDialog({
      message: "Are you sure you want to delete?",
      header: "Delete Confirmation",
      icon: "pi pi-exclamation-triangle",
      accept: () => deleteDepartment(id)
    });
  };
  // const deleteDepartment = (id) => {
  // fetch(`https://localhost:7175/api/Department?id=${id}`, {
  //   method: "DELETE"
  // })
  //     .then(() => {
  //       fetchDepartments();

  //       toast.current.show({
  //         severity: "warn",
  //         summary: "Deleted",
  //         detail: "Department Deleted",
  //         life: 3000
  //       });
  //     })
  //     .catch((err) => console.error(err));
  // };

  // const confirmDelete = (id) => {
  //   confirmDialog({
  //     message: "Are you sure you want to delete?",
  //     header: "Delete Confirmation",
  //     icon: "pi pi-exclamation-triangle",
  //     accept: () => deleteDepartment(id)
  //   });
  // };

  // // EDIT
  // const editDepartment = (dept) => {
  //   setNewDepartment({
  //     departmentId: dept.departmentId,
  //     departmentName: dept.departmentName,
  //     isActive: dept.isActive
  //   });

  //   setIsEdit(true);
  //   setActiveIndex(0);
  // };

  // // UPDATE
  // const updateDepartment = () => {
  //   fetch("https://localhost:7175/api/Department", {
  //     method: "PUT",
  //     headers: {
  //       "Content-Type": "application/json"
  //     },
  //     body: JSON.stringify(newDepartment)
  //   })
  //     .then((res) => {
  //       if (!res.ok) throw new Error("Update failed");
  //       return res.text();
  //     })
  //     .then(() => {
  //       fetchDepartments();
  //       resetForm();

  //       toast.current.show({
  //         severity: "success",
  //         summary: "Updated",
  //         detail: "Department Updated",
  //         life: 3000
  //       });
  //     })
  //     .catch((err) => console.error(err));
  // };
         // EDIT
const editDepartment = async (dept) => {
  const token = localStorage.getItem("token");

  if (!token) {
    navigate("/");
    return;
  }

  try {
    const res = await fetch(
      `https://localhost:7175/api/Department/${dept.departmentId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      }
    );

    if (res.status === 401) {
      localStorage.removeItem("token");
      navigate("/");
      return;
    }

    if (!res.ok) {
      throw new Error("Failed to load department");
    }

    const data = await res.json();

    setNewDepartment({
      departmentId: data.departmentId,
      departmentName: data.departmentName,
      isActive: data.isActive
    });

    setIsEdit(true);
    setActiveIndex(0);

  } catch (err) {
    console.error(err);
  }
};

// UPDATE
const updateDepartment = async () => {
  const token = localStorage.getItem("token");

  if (!token) {
    navigate("/");
    return;
  }

  try {
    const res = await fetch("https://localhost:7175/api/Department", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(newDepartment)
    });

    if (res.status === 401) {
      localStorage.removeItem("token");
      navigate("/");
      return;
    }

    if (!res.ok) {
      throw new Error("Update failed");
    }

    fetchDepartments();
    resetForm();

    toast.current.show({
      severity: "success",
      summary: "Updated",
      detail: "Department Updated",
      life: 3000
    });

  } catch (err) {
    console.error(err);

    toast.current.show({
      severity: "error",
      summary: "Error",
      detail: "Unable to update department",
      life: 3000
    });
  }
};
      // SEARCH FILTER
  const filteredDepartments = departments.filter((dept) =>
    dept.departmentName
      .toLowerCase()
      .includes(searchText.toLowerCase())
  );
   const validateAndAdd = () => {
  if (newDepartment.departmentName.trim() === "") {
    toast.current.show({
      severity: "warn",
      summary: "Validation",
      detail: "Please enter Department Name",
      life: 3000
    });
    return;
  }

  createDepartment();
};
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
            Department Management
          </h2>
          <small style={{ color: "#64748b" }}>
            Manage department records easily
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
        <AccordionTab header="Department Form">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))",
              gap: "15px",
              marginTop: "15px"
            }}
          >
            <InputText
              name="departmentName"
              placeholder="Department Name"
              value={newDepartment.departmentName}
              onChange={handleChange}
            />

            <select
              name="isActive"
              value={newDepartment.isActive}
              onChange={handleChange}
              style={{
                height: "42px",
                borderRadius: "10px",
                border: "1px solid #cbd5e1",
                padding: "8px"
              }}
            >
              <option value={true}>Active</option>
              <option value={false}>Inactive</option>
            </select>
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
                  onClick={updateDepartment}
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
                label="Add Department"
                icon="pi pi-plus"
                onClick={validateAndAdd}
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
        <AccordionTab header="Department List">
          <div style={{ marginBottom: "15px", marginTop: "10px" }}>
            <InputText
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Search department..."
              style={{
                width: "300px",
                borderRadius: "12px"
              }}
            />
          </div>

          <DataTable
            value={filteredDepartments}
            paginator
            rows={5}
            stripedRows
            showGridlines
            responsiveLayout="scroll"
          >
            <Column field="departmentId" header="ID" />
            <Column field="departmentName" header="Department Name" />

            <Column
              field="isActive"
              header="Status"
              body={(rowData) =>
                rowData.isActive ? "Active" : "Inactive"
              }
            />

            <Column
              header="Action"
              body={(rowData) => (
                <div style={{ display: "flex", gap: "8px" }}>
                  <Button
                    icon="pi pi-pencil"
                    onClick={() => editDepartment(rowData)}
                    style={{
                      background: "#f59e0b",
                      border: "none",
                      borderRadius: "10px"
                    }}
                  />

                  <Button
                    icon="pi pi-trash"
                    onClick={() =>
                      confirmDelete(rowData.departmentId)
                    }
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

export default DepartmentList;