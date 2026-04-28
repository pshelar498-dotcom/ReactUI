import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import "primereact/resources/themes/lara-light-cyan/theme.css";
import "primeicons/primeicons.css";

import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Toast } from "primereact/toast";
import { Divider } from "primereact/divider";

function Login() {
  const toast = useRef(null);
  const navigate = useNavigate();

  const [showRegister, setShowRegister] = useState(false);
  const [loading, setLoading] = useState(false);

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

  const handleLogin = async () => {
    try {
      setLoading(true);

      const res = await fetch("https://localhost:7175/api/Auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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

  const handleRegister = async () => {
    try {
      setLoading(true);

      const res = await fetch("https://localhost:7175/api/Users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
          <div
            style={{
              width: "78px",
              height: "78px",
              margin: "0 auto",
              borderRadius: "50%",
              background:
                "linear-gradient(135deg,#06b6d4,#2563eb,#7c3aed)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 12px 30px rgba(37,99,235,.35)"
            }}
          >
            <i
              className="pi pi-user"
              style={{
                color: "#fff",
                fontSize: "2rem"
              }}
            ></i>
          </div>

          <h2
            style={{
              marginTop: "18px",
              marginBottom: "6px",
              fontSize: "28px",
              fontWeight: "700",
              color: "#111827"
            }}
          >
            {showRegister ? "Create Account" : "Welcome Back"}
          </h2>

          <p
            style={{
              margin: 0,
              color: "#6b7280",
              fontSize: "14px"
            }}
          >
            {showRegister
              ? "Register to continue"
              : "Login to your account"}
          </p>
        </div>

        {!showRegister ? (
          <>
            <span className="p-input-icon-left" style={{ width: "100%" }}>
              {/* <i className="pi pi-envelope" /> */}
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
            </span>
               <div style={{ width: "100%", marginBottom: "16px" }}>
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
                   style={{ width: "100%" }}
                    inputStyle={{
                   width: "100%",
                    height: "46px",
                   borderRadius: "12px"
                     }}
  />
                </div>
            {/* <Password
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
              inputStyle={{
                width: "100%",
                height: "46px",
                borderRadius: "12px"
              }}
            /> */}

            <Button
              label={loading ? "Please Wait..." : "Login"}
              icon="pi pi-sign-in"
              onClick={handleLogin}
              disabled={loading}
              style={{
                width: "100%",
                height: "48px",
                borderRadius: "14px",
                border: "none",
                fontWeight: "700",
                background:
                  "linear-gradient(90deg,#06b6d4,#2563eb)",
                boxShadow: "0 10px 25px rgba(37,99,235,.28)"
              }}
            />

            <Divider align="center">
              <span style={{ fontSize: "12px", color: "#94a3b8" }}>
                OR
              </span>
            </Divider>

            <Button
              label="Create New Account"
              icon="pi pi-user-plus"
              onClick={() => setShowRegister(true)}
              style={{
                width: "100%",
                height: "46px",
                borderRadius: "14px",
                border: "2px solid #22c55e",
                background: "transparent",
                color: "#16a34a",
                fontWeight: "700"
              }}
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
              inputStyle={{
                width: "100%",
                height: "46px",
                borderRadius: "12px"
              }}
            />

            <Button
              label="Register"
              icon="pi pi-check"
              onClick={handleRegister}
              disabled={loading}
              style={{
                width: "100%",
                height: "46px",
                marginBottom: "10px",
                borderRadius: "14px",
                border: "none",
                fontWeight: "700",
                background:
                  "linear-gradient(90deg,#22c55e,#15803d)"
              }}
            />

            <Button
              label="Clear Form"
              icon="pi pi-refresh"
              onClick={clearRegisterForm}
              style={{
                width: "100%",
                height: "46px",
                marginBottom: "10px",
                borderRadius: "14px",
                border: "none",
                background:
                  "linear-gradient(90deg,#f59e0b,#ea580c)",
                fontWeight: "700"
              }}
            />

            <Button
  label="Back To Login"
  icon="pi pi-arrow-left"
  onClick={() => setShowRegister(false)}
  style={{
    width: "100%",
    height: "46px",
    borderRadius: "14px",
    border: "none",
    fontWeight: "700",
    color: "#ffffff",
    background:
      "linear-gradient(90deg,#3b82f6,#2563eb)",
    boxShadow: "0 10px 20px rgba(59,130,246,.25)"
  }}
/>
          </>
        )}
      </Card>
    </div>
  );
}

export default Login;