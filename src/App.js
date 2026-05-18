// import React from "react";
// import EmployeeList from "./EmployeeList";
// import DepartmentList from "./DepartmentList";
// import StudentList from "./StudentList";

// import { ConfirmDialog } from 'primereact/confirmdialog';
// // import './style.css';
// function App() {
//   return (
//     <div>
//       <ConfirmDialog/>
//       <EmployeeList />
//       <DepartmentList></DepartmentList>
//        <StudentList></StudentList>
    
//     </div>
//   );
// }

// export default App;

import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

import EmployeeList from "./EmployeeList";
import DepartmentList from "./DepartmentList";
import StudentList from "./StudentList";

import { ConfirmDialog } from "primereact/confirmdialog";
import Login from "./Login";
import ResetPassword from "./ResetPassword";
// import Roles from "./Roles";

function App() {
  return (
    <BrowserRouter>
      <div>
        <ConfirmDialog />

        {/* <nav style={{ marginBottom: "20px" }}>
          <Link to="/employee" style={{ marginRight: "15px" }}>
            Employee
          </Link>

          <Link to="/department" style={{ marginRight: "15px" }}>
            Department
          </Link>

          <Link to="/student">
            Student
          </Link>
        </nav> */}

        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/employee" element={<EmployeeList />} />
          <Route path="/department" element={<DepartmentList />} />
          <Route path="/student" element={<StudentList />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          {/* <Route
            path="/roles"
            element={<Roles />} */}
          /
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;