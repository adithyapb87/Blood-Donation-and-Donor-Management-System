import React, { useState } from "react";
import { Typography, TextField, Button, Snackbar, Alert, Box, Paper, ToggleButton, ToggleButtonGroup } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = ({ onLoginSuccess }) => {
  const [loginRole, setLoginRole] = useState("donor"); // 'donor' represents regular User
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [alertState, setAlertState] = useState({ open: false, message: "", severity: "success" });
  const navigate = useNavigate();

  const handleRoleChange = (event, newRole) => {
    if (newRole !== null) {
      setLoginRole(newRole);
      setEmail("");
      setPassword("");
      setErrors({});
    }
  };

  const handleCloseAlert = () => {
    setAlertState({ ...alertState, open: false });
  };

  const handleLogin = () => {
    let tempErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email.trim()) {
      tempErrors.email = "Email address is required.";
    } else if (!emailRegex.test(email)) {
      tempErrors.email = "Please enter a valid email address.";
    }

    // If Admin option is selected, make the password field mandatory
    if (loginRole === "admin" && !password.trim()) {
      tempErrors.password = "Password is required for Admin login.";
    }

    if (Object.keys(tempErrors).length > 0) {
      setErrors(tempErrors);
      return;
    }

    // Send email, password, and the active option chosen to backend
    axios.post("http://localhost:3002/login-check", { 
      email: email, 
      password: password, 
      role: loginRole 
    })
      .then((res) => {
        setAlertState({
          open: true,
          message: res.data.role === "admin" ? "Welcome back, Admin!" : "Welcome back!",
          severity: "success"
        });

        // Save session data inside the browser
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("userEmail", res.data.email);
        localStorage.setItem("userRole", res.data.role);

        // Update the global navbar state instantly
        onLoginSuccess();

        // Separate page routing logic based on chosen role
        setTimeout(() => {
          if (res.data.role === "admin") {
            navigate("/view-donors");
          } else {
            navigate("/profile");
          }
        }, 1200);
      })
      .catch((err) => {
        if (err.response) {
          setAlertState({
            open: true,
            message: err.response.data || "Login failed. Please verify credentials.",
            severity: "error"
          });
        } else {
          setAlertState({
            open: true,
            message: "Network Error: Server unreachable on port 3002.",
            severity: "error"
          });
        }
      });
  };

  return (
    <div style={{ padding: "0 20px", marginTop: "60px" }}>
      <Paper sx={{ maxWidth: 400, margin: "0 auto", p: 4, borderRadius: 2, boxShadow: 3, textAlign: "center" }}>
        <Typography variant="h5" sx={{ color: "#722F37", fontWeight: "bold", mb: 2 }}>
          Portal Authentication
        </Typography>

        {/* Dynamic Selection Toggle Options */}
        <ToggleButtonGroup
          value={loginRole}
          exclusive
          onChange={handleRoleChange}
          fullWidth
          sx={{ mb: 3, "& .Mui-selected": { bgcolor: "#722F37 !important", color: "white !important", fontWeight: "bold" } }}
        >
          <ToggleButton value="donor">User Login</ToggleButton>
          <ToggleButton value="admin">Admin Login</ToggleButton>
        </ToggleButtonGroup>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            label={loginRole === "admin" ? "Admin Email" : "Registered User Email"}
            variant="outlined"
            fullWidth
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (errors.email) setErrors({ ...errors, email: "" });
            }}
            error={!!errors.email}
            helperText={errors.email}
          />

          {/* Conditional Input Rendering: Password displays ONLY when Admin is active */}
          {loginRole === "admin" && (
            <TextField
              label="Admin Password"
              type="password"
              variant="outlined"
              fullWidth
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password) setErrors({ ...errors, password: "" });
              }}
              error={!!errors.password}
              helperText={errors.password}
            />
          )}

          <Button 
            variant="contained" 
            onClick={handleLogin}
            sx={{ 
              bgcolor: "#722F37", 
              py: 1.5, 
              fontWeight: "bold",
              "&:hover": { bgcolor: "#5a242a" } 
            }}
          >
            {loginRole === "admin" ? "Verify Admin" : "Access My Profile"}
          </Button>
        </Box>
      </Paper>

      <Snackbar 
        open={alertState.open} 
        autoHideDuration={4000} 
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={handleCloseAlert} severity={alertState.severity} sx={{ width: "100%" }}>
          {alertState.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Login;