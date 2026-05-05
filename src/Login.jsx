// import React, { useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import "primereact/resources/themes/lara-light-cyan/theme.css";
import "primeicons/primeicons.css";

import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Toast } from "primereact/toast";
import { Divider } from "primereact/divider";
import React, { useRef, useState, useEffect } from "react";
import API_CONFIG from "./api";

function Login() {
  const toast = useRef(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const token = searchParams.get("token");

  const [showRegister, setShowRegister] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(!!token);

  const [loading, setLoading] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");

  const [loginData, setLoginData] = useState({
    email: "",
    password: ""
  });

  const [registerData, setRegisterData] = useState({
    userName: "",
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    password: ""
  });

  const [resetData, setResetData] = useState({
    newPassword: "",
    confirmPassword: ""
  });

  const inputStyle = {
    width: "100%",
    marginBottom: "14px",
    height: "46px",
    borderRadius: "12px"
  };

  const clearRegisterForm = () => {
    setRegisterData({
      userName: "",
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      password: ""
    });
  };

  // =============================
  // LOGIN
  // =============================
  const handleLogin = async () => {
    try {
      setLoading(true);

      const res = await fetch(API_CONFIG.AUTH_LOGIN_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": API_CONFIG.API_KEY
        },
        body: JSON.stringify(loginData)
      });

      if (!res.ok) throw new Error();

      const data = await res.json();
      localStorage.setItem("token", data.token);

      toast.current.show({
        severity: "success",
        summary: "Success",
        detail: "Login Successful",
        life: 3000
      });

      navigate("/employee");
    } catch {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Invalid Login",
        life: 3000
      });
    } finally {
      setLoading(false);
    }
  };

  // =============================
  // REGISTER
  // =============================
  const handleRegister = async () => {
    try {
      setLoading(true);

      const res = await fetch(API_CONFIG.USERS_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": API_CONFIG.API_KEY
        },
        body: JSON.stringify(registerData)
      });

      if (!res.ok) throw new Error();

      toast.current.show({
        severity: "success",
        summary: "Success",
        detail: "Registration Successful",
        life: 3000
      });

      clearRegisterForm();
      setShowRegister(false);
    } catch {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Registration Failed",
        life: 3000
      });
    } finally {
      setLoading(false);
    }
  };

  // =============================
  // FORGOT PASSWORD
  // =============================
 const handleForgotPassword = async () => {
  try {
    setLoading(true);

    const res = await fetch(API_CONFIG.FORGOT_PASSWORD_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: forgotEmail
      })
    });

    const text = await res.text();

    console.log("API RESPONSE:", text); // 👈 DEBUG

    if (!res.ok) throw new Error(text);

    toast.current.show({
      severity: "success",
      summary: "Success",
      detail: text,
      life: 3000
    });

  } catch (err) {
    console.error("ERROR:", err); // 👈 DEBUG

    toast.current.show({
      severity: "error",
      summary: "Error",
      detail: err.message,
      life: 4000
    });
  } finally {
    setLoading(false);
  }
};

  // =============================
  // RESET PASSWORD
  // =============================
  const handleResetPassword = async () => {
    try {
      if (resetData.newPassword !== resetData.confirmPassword) {
        toast.current.show({
          severity: "warn",
          summary: "Warning",
          detail: "Passwords do not match",
          life: 3000
        });
        return;
      }

      setLoading(true);

      const res = await fetch(API_CONFIG.RESET_PASSWORD_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": API_CONFIG.API_KEY
        },
        body: JSON.stringify({
          token: token,
          newPassword: resetData.newPassword
        })
      });

      if (!res.ok) throw new Error();

      toast.current.show({
        severity: "success",
        summary: "Success",
        detail: "Password changed successfully",
        life: 3000
      });

      setResetData({
        newPassword: "",
        confirmPassword: ""
      });

      setShowResetPassword(false);
      navigate("/");
    } catch {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Password reset failed",
        life: 3000
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg,#0ea5e9 0%, #2563eb 45%, #7c3aed 100%)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px"
      }}
    >
      <Toast ref={toast} />

      <Card
        style={{
          width: "430px",
          borderRadius: "26px",
          padding: "10px",
          border: "1px solid rgba(255,255,255,.25)",
          boxShadow: "0 25px 60px rgba(0,0,0,.22)",
          backdropFilter: "blur(12px)",
          background: "rgba(255,255,255,.95)"
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <h2>
            {showResetPassword
              ? "Reset Password"
              : showForgotPassword
              ? "Forgot Password"
              : showRegister
              ? "Create Account"
              : "Welcome Back"}
          </h2>
        </div>

        {/* RESET PASSWORD */}
        {showResetPassword ? (
          <>
            <Password
              placeholder="New Password"
              feedback={false}
              toggleMask
              value={resetData.newPassword}
              onChange={(e) =>
                setResetData({
                  ...resetData,
                  newPassword: e.target.value
                })
              }
              style={{ width: "100%", marginBottom: "14px" }}
              inputStyle={inputStyle}
            />

            <Password
              placeholder="Confirm Password"
              feedback={false}
              toggleMask
              value={resetData.confirmPassword}
              onChange={(e) =>
                setResetData({
                  ...resetData,
                  confirmPassword: e.target.value
                })
              }
              style={{ width: "100%", marginBottom: "14px" }}
              inputStyle={inputStyle}
            />

            <Button
              label={loading ? "Updating..." : "Reset Password"}
              icon="pi pi-check"
              onClick={handleResetPassword}
              style={{ width: "100%", marginBottom: "10px" }}
            />
          </>
        ) : showForgotPassword ? (
          <>
            <InputText
              placeholder="Enter your registered email"
              value={forgotEmail}
              onChange={(e) => setForgotEmail(e.target.value)}
              style={inputStyle}
            />

            <Button
              label={loading ? "Sending..." : "Send Reset Link"}
              icon="pi pi-envelope"
              onClick={handleForgotPassword}
              style={{
                width: "100%",
                marginBottom: "10px"
              }}
            />

            <Button
              label="Back To Login"
              icon="pi pi-arrow-left"
              onClick={() => setShowForgotPassword(false)}
              className="p-button-secondary"
              style={{ width: "100%" }}
            />
          </>
        ) : !showRegister ? (
          <>
            <InputText
              placeholder="Email Address"
              value={loginData.email}
              onChange={(e) =>
                setLoginData({
                  ...loginData,
                  email: e.target.value
                })
              }
              style={inputStyle}
            />

            <Password
              placeholder="Password"
              feedback={false}
              toggleMask
              value={loginData.password}
              onChange={(e) =>
                setLoginData({
                  ...loginData,
                  password: e.target.value
                })
              }
              style={{ width: "100%", marginBottom: "16px" }}
              inputStyle={inputStyle}
            />

            <Button
              label={loading ? "Please Wait..." : "Login"}
              icon="pi pi-sign-in"
              onClick={handleLogin}
              style={{ width: "100%", marginBottom: "10px" }}
            />

            <Button
              label="Forgot Password?"
              icon="pi pi-key"
              className="p-button-text"
              onClick={() => setShowForgotPassword(true)}
              style={{ width: "100%", marginBottom: "10px" }}
            />

            <Divider align="center">OR</Divider>

            <Button
              label="Create New Account"
              icon="pi pi-user-plus"
              onClick={() => setShowRegister(true)}
              style={{ width: "100%" }}
            />
          </>
        ) : (
          <>
            <InputText
              placeholder="User Name"
              value={registerData.userName}
              onChange={(e) =>
                setRegisterData({
                  ...registerData,
                  userName: e.target.value
                })
              }
              style={inputStyle}
            />

            <InputText
              placeholder="First Name"
              value={registerData.firstName}
              onChange={(e) =>
                setRegisterData({
                  ...registerData,
                  firstName: e.target.value
                })
              }
              style={inputStyle}
            />

            <InputText
              placeholder="Last Name"
              value={registerData.lastName}
              onChange={(e) =>
                setRegisterData({
                  ...registerData,
                  lastName: e.target.value
                })
              }
              style={inputStyle}
            />

            <InputText
              placeholder="Email"
              value={registerData.email}
              onChange={(e) =>
                setRegisterData({
                  ...registerData,
                  email: e.target.value
                })
              }
              style={inputStyle}
            />

            <InputText
              placeholder="Phone Number"
              value={registerData.phoneNumber}
              onChange={(e) =>
                setRegisterData({
                  ...registerData,
                  phoneNumber: e.target.value
                })
              }
              style={inputStyle}
            />

            <Password
              placeholder="Password"
              feedback={false}
              toggleMask
              value={registerData.password}
              onChange={(e) =>
                setRegisterData({
                  ...registerData,
                  password: e.target.value
                })
              }
              style={{ width: "100%", marginBottom: "16px" }}
              inputStyle={inputStyle}
            />

            <Button
              label="Register"
              icon="pi pi-check"
              onClick={handleRegister}
              style={{ width: "100%", marginBottom: "10px" }}
            />

            <Button
              label="Clear Form"
              icon="pi pi-refresh"
              onClick={clearRegisterForm}
              style={{ width: "100%", marginBottom: "10px" }}
            />

            <Button
              label="Back To Login"
              icon="pi pi-arrow-left"
              onClick={() => setShowRegister(false)}
              style={{ width: "100%" }}
            />
          </>
        )}
      </Card>
    </div>
  );
}

export default Login;




// import React, { useRef, useState } from "react";
// import { useNavigate } from "react-router-dom";

// import "primereact/resources/themes/lara-light-cyan/theme.css";
// import "primeicons/primeicons.css";

// import { Card } from "primereact/card";
// import { Button } from "primereact/button";
// import { InputText } from "primereact/inputtext";
// import { Password } from "primereact/password";
// import { Toast } from "primereact/toast";
// import { Divider } from "primereact/divider";

// import API_CONFIG from "./api";   // ✅ add this

// function Login() {
//   const toast = useRef(null);
//   const navigate = useNavigate();

//   const [showRegister, setShowRegister] = useState(false);
//   const [loading, setLoading] = useState(false);

//   const [loginData, setLoginData] = useState({
//     email: "",
//     password: ""
//   });

//   const [registerData, setRegisterData] = useState({
//     userName: "",
//     firstName: "",
//     lastName: "",
//     email: "",
//     phoneNumber: "",
//     password: ""
//   });

//   const inputStyle = {
//     width: "100%",
//     marginBottom: "14px",
//     height: "46px",
//     borderRadius: "12px"
//   };

//   const clearRegisterForm = () => {
//     setRegisterData({
//       userName: "",
//       firstName: "",
//       lastName: "",
//       email: "",
//       phoneNumber: "",
//       password: ""
//     });
//   };

//   // ✅ LOGIN CHANGED
//   const handleLogin = async () => {
//     try {
//       setLoading(true);

//       const res = await fetch(API_CONFIG.AUTH_LOGIN_URL, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           "x-api-key": API_CONFIG.API_KEY
//         },
//         body: JSON.stringify(loginData)
//       });

//       if (!res.ok) throw new Error();

//       const data = await res.json();

//       localStorage.setItem("token", data.token);

//       toast.current.show({
//         severity: "success",
//         summary: "Success",
//         detail: "Login Successful",
//         life: 3000
//       });

//       navigate("/employee");
//     } catch {
//       toast.current.show({
//         severity: "error",
//         summary: "Error",
//         detail: "Invalid Login",
//         life: 3000
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ✅ REGISTER CHANGED
//   const handleRegister = async () => {
//     try {
//       setLoading(true);

//       const res = await fetch(API_CONFIG.USERS_URL, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           "x-api-key": API_CONFIG.API_KEY
//         },
//         body: JSON.stringify(registerData)
//       });

//       if (!res.ok) throw new Error();

//       toast.current.show({
//         severity: "success",
//         summary: "Success",
//         detail: "Registration Successful",
//         life: 3000
//       });

//       clearRegisterForm();
//       setShowRegister(false);
//     } catch {
//       toast.current.show({
//         severity: "error",
//         summary: "Error",
//         detail: "Registration Failed",
//         life: 3000
//       });
//     } finally {
//       setLoading(false);
//     }
//   };