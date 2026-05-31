import React, { useState, useEffect } from "react";
import { Typography, TextField, Button, Box, Paper, Snackbar, Alert, CircularProgress } from "@mui/material";
import axios from "axios";

const Profile = ({ onLogout }) => {
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [donorId, setDonorId] = useState("");
  const [inputs, setInputs] = useState({
    ename: "",
    email: "",
    bloodGroup: "",
    location: "",
    phone: "",
    age: "",
    weight: "",
    status: ""
  });

  const [errors, setErrors] = useState({});
  const [alertState, setAlertState] = useState({
    open: false,
    message: "",
    severity: "success"
  });

  // Fetch the logged-in user's profile information based on their session email
  useEffect(() => {
    const userEmail = localStorage.getItem("userEmail");
    if (!userEmail) {
      setAlertState({
        open: true,
        message: "No active session found. Redirecting to login...",
        severity: "error"
      });
      setTimeout(() => { window.location.href = "/login"; }, 2000);
      return;
    }

    axios.get(`http://localhost:3002/profile-details/${userEmail}`)
      .then((res) => {
        if (res.data) {
          setDonorId(res.data._id);
          setInputs({
            ename: res.data.ename || "",
            email: res.data.email || "",
            bloodGroup: res.data.bloodGroup || "",
            location: res.data.location || "",
            phone: res.data.phone || "",
            age: res.data.age || "",
            weight: res.data.weight || "",
            status: res.data.status || ""
          });
        }
        setLoading(false);
      })
      .catch((err) => {
        setAlertState({
          open: true,
          message: "Failed to load donor profile details.",
          severity: "error"
        });
        setLoading(false);
      });
  }, []);

  const inputHandler = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  const handleCloseAlert = () => {
    setAlertState({ ...alertState, open: false });
  };

  // Form check rules before updating information on backend database definitions
  const validateForm = () => {
    let tempErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10}$/;

    if (!inputs.ename.trim()) tempErrors.ename = "Name is required.";
    if (!inputs.email.trim()) {
      tempErrors.email = "Email is required.";
    } else if (!emailRegex.test(inputs.email)) {
      tempErrors.email = "Invalid email address format.";
    }
    if (!inputs.bloodGroup.trim()) tempErrors.bloodGroup = "Blood group is required.";
    if (!inputs.location.trim()) tempErrors.location = "Location is required.";
    if (!inputs.phone.trim()) {
      tempErrors.phone = "Phone number is required.";
    } else if (!phoneRegex.test(inputs.phone)) {
      tempErrors.phone = "Phone number must be exactly 10 digits.";
    }

    const ageNum = parseInt(inputs.age, 10);
    if (!inputs.age) {
      tempErrors.age = "Age is required.";
    } else if (isNaN(ageNum) || ageNum < 18 || ageNum > 65) {
      tempErrors.age = "Age must be between 18 and 65.";
    }

    const weightNum = parseFloat(inputs.weight);
    if (!inputs.weight) {
      tempErrors.weight = "Weight is required.";
    } else if (isNaN(weightNum) || weightNum < 45) {
      tempErrors.weight = "Weight must be at least 45 kg.";
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  // Triggers update pipeline mapping down into MongoDB collection entries
  const saveHandler = () => {
    if (!validateForm()) return;

    axios.put(`http://localhost:3002/update-profile/${donorId}`, inputs)
      .then((res) => {
        setAlertState({
          open: true,
          message: "Profile information updated successfully!",
          severity: "success"
        });
        // If the email was changed, update local storage session tracker parameters
        localStorage.setItem("userEmail", inputs.email);
        setIsEditing(false);
      })
      .catch((err) => {
        setAlertState({
          open: true,
          message: err.response?.data?.message || "Failed to update profile changes.",
          severity: "error"
        });
      });
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <CircularProgress sx={{ color: '#722F37' }} />
      </Box>
    );
  }

  return (
    <Box sx={{ 
      minHeight: '90vh', 
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      py: 6,
      px: 2,
      backgroundColor: '#722F37' // Plain Wine Red Background canvas frame setup
    }}>
      <Paper 
        elevation={8} 
        sx={{ 
          maxWidth: 500, 
          width: "100%", 
          p: 4, 
          borderRadius: 4, 
          bgcolor: "#ffffff",
          boxShadow: "0px 12px 40px rgba(0,0,0,0.3)",
          "& input": { 
            backgroundColor: "transparent !important", 
            color: "#333333 !important",
            padding: "8px 4px !important", 
            margin: "0px !important",
            height: "1.4em !important",
            boxShadow: "none !important",
            border: "none !important"
          }
        }}
      >
        <Typography 
          variant="h4" 
          sx={{ color: "#722F37", fontFamily: "'Poppins', sans-serif", fontWeight: 800, textAlign: "center", mb: 1 }}
        >
          My Donor Profile
        </Typography>
        
        <Typography variant="body2" color="text.secondary" sx={{ textAlign: "center", mb: 4 }}>
          {isEditing ? "Modify your details below and hit save." : "View or manage your account configuration."}
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.2 }}>
          <TextField 
            label="Full Name" name="ename" value={inputs.ename} onChange={inputHandler} 
            disabled={!isEditing} error={!!errors.ename} helperText={errors.ename} fullWidth variant="outlined"
          /> 
          
          <TextField 
            label="Email Address" name="email" value={inputs.email} onChange={inputHandler} 
            disabled={!isEditing} error={!!errors.email} helperText={errors.email} fullWidth variant="outlined"
          /> 

          <TextField 
            label="Blood Group" name="bloodGroup" value={inputs.bloodGroup} onChange={inputHandler} 
            disabled={!isEditing} error={!!errors.bloodGroup} helperText={errors.bloodGroup} fullWidth variant="outlined"
          /> 
          
          <TextField 
            label="Current Location" name="location" value={inputs.location} onChange={inputHandler} 
            disabled={!isEditing} error={!!errors.location} helperText={errors.location} fullWidth variant="outlined"
          /> 
          
          <TextField 
            label="Phone Number" name="phone" value={inputs.phone} onChange={inputHandler} 
            disabled={!isEditing} error={!!errors.phone} helperText={errors.phone} fullWidth variant="outlined"
            inputProps={{ maxLength: 10 }}
          /> 

          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField 
              label="Age" name="age" type="number" value={inputs.age} onChange={inputHandler} 
              disabled={!isEditing} error={!!errors.age} helperText={errors.age} fullWidth variant="outlined"
            /> 
            
            <TextField 
              label="Weight (kg)" name="weight" type="number" value={inputs.weight} onChange={inputHandler} 
              disabled={!isEditing} error={!!errors.weight} helperText={errors.weight} fullWidth variant="outlined"
            /> 
          </Box>

          <TextField 
            label="Availability Status" name="status" value={inputs.status} onChange={inputHandler} 
            disabled={!isEditing} placeholder="e.g. Available, Busy" fullWidth variant="outlined"
          /> 
          
          <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
            {isEditing ? (
              <>
                <Button 
                  variant="contained" onClick={saveHandler} fullWidth
                  sx={{ py: 1.4, fontWeight: 'bold', bgcolor: '#2e7d32', '&:hover': { bgcolor: '#1b5e20' } }}
                >
                  Save Changes
                </Button>
                <Button 
                  variant="outlined" onClick={() => setIsEditing(false)} fullWidth
                  sx={{ py: 1.4, fontWeight: 'bold', color: '#333333', borderColor: '#ccc', '&:hover': { borderColor: '#999' } }}
                >
                  Cancel
                </Button>
              </>
            ) : (
              <>
                <Button 
                  variant="contained" onClick={() => setIsEditing(true)} fullWidth
                  sx={{ py: 1.4, fontWeight: 'bold', bgcolor: '#722F37', '&:hover': { bgcolor: '#5a242a' } }}
                >
                  Edit Profile
                </Button>
                <Button 
                  variant="contained" onClick={onLogout} fullWidth
                  sx={{ py: 1.4, fontWeight: 'bold', bgcolor: '#333333', '&:hover': { bgcolor: '#111111' } }}
                >
                  Logout
                </Button>
              </>
            )}
          </Box> 
        </Box>
      </Paper>

      <Snackbar 
        open={alertState.open} autoHideDuration={6000} onClose={handleCloseAlert}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseAlert} severity={alertState.severity} sx={{ width: '100%' }}>
          {alertState.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Profile;