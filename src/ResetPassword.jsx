import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const token = new URLSearchParams(location.search).get("token");

  // ❌ Invalid token check
  if (!token) {
    return (
      <div style={styles.center}>
        <div style={styles.card}>
          <h3 style={{ color: "red" }}>Invalid or missing token</h3>
        </div>
      </div>
    );
  }

  const handleReset = async () => {
    if (!password) {
      setMessage("Please enter a new password");
      return;
    }

    if (password.length < 6) {
      setMessage("Password must be at least 6 characters");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("https://localhost:7175/api/Users/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          token: token,
          newPassword: password
        })
      });

      const data = await res.text();

      if (!res.ok) {
        setMessage("❌ " + data);
      } else {
        setMessage("✅ Password changed successfully! Redirecting...");

        // ✅ FIXED REDIRECT HERE
        setTimeout(() => {
          navigate("/"); // 🔥 change this if your login route is different
        }, 2000);
      }

    } catch (err) {
      setMessage("❌ Error resetting password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.center}>
      <div style={styles.card}>
        <h2 style={styles.title}>Reset Password</h2>

        <div style={styles.inputGroup}>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Enter new password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
          />

          <span
            style={styles.toggle}
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? "Hide" : "Show"}
          </span>
        </div>

        <button
          onClick={handleReset}
          disabled={loading}
          style={{
            ...styles.button,
            opacity: loading ? 0.7 : 1
          }}
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>

        {message && (
          <p
            style={{
              marginTop: "15px",
              color: message.includes("❌") ? "red" : "green"
            }}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;

const styles = {
  center: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    background: "linear-gradient(135deg, #667eea, #764ba2)"
  },
  card: {
    background: "#fff",
    padding: "40px",
    borderRadius: "12px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
    width: "350px",
    textAlign: "center"
  },
  title: {
    marginBottom: "20px",
    color: "#333"
  },
  inputGroup: {
    position: "relative",
    marginBottom: "20px"
  },
  input: {
    width: "100%",
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    outline: "none"
  },
  toggle: {
    position: "absolute",
    right: "10px",
    top: "50%",
    transform: "translateY(-50%)",
    cursor: "pointer",
    fontSize: "12px"
  },
  button: {
    width: "100%",
    padding: "12px",
    background: "#667eea",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    cursor: "pointer"
  }
};

// import React, { useState } from "react";
// import { useLocation } from "react-router-dom";

// const ResetPassword = () => {
//   const [password, setPassword] = useState("");
//   const [message, setMessage] = useState("");
//   const [loading, setLoading] = useState(false);

//   const location = useLocation();
//   const token = new URLSearchParams(location.search).get("token");

//   if (!token) {
//     return <h3>Invalid or missing token</h3>;
//   }

//   const handleReset = async () => {
//     if (!password) {
//       setMessage("Please enter a new password");
//       return;
//     }

//     try {
//       setLoading(true);

//       const res = await fetch("https://localhost:7175/api/Users/reset-password", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json"
//         },
//         body: JSON.stringify({
//           token: token,
//           newPassword: password
//         })
//       });

//       const data = await res.text();

//       if (!res.ok) {
//         setMessage("Error: " + data);
//       } else {
//         setMessage("✅ " + data);
//       }

//     } catch (err) {
//       setMessage("Error resetting password");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div style={{ padding: "40px" }}>
//       <h2>Reset Password</h2>

//       <input
//         type="password"
//         placeholder="Enter new password"
//         value={password}
//         onChange={(e) => setPassword(e.target.value)}
//       />

//       <br /><br />

//       <button onClick={handleReset} disabled={loading}>
//         {loading ? "Resetting..." : "Reset Password"}
//       </button>

//       <p>{message}</p>
//     </div>
//   );
// };

// export default ResetPassword;