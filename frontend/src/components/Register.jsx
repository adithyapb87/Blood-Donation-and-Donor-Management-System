import React, { useState } from "react";
import { Typography, TextField, Button, Snackbar, Alert, Box, Paper } from "@mui/material";
import axios from "axios";

const Register = () => {
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

  const inputHandler = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  const handleCloseAlert = () => {
    setAlertState({ ...alertState, open: false });
  };

  const validateForm = () => {
    let tempErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10}$/;

    if (!inputs.ename.trim()) tempErrors.ename = "Name is required.";
    
    if (!inputs.email.trim()) {
      tempErrors.email = "Email is required.";
    } else if (!emailRegex.test(inputs.email)) {
      tempErrors.email = "Please enter a valid email address.";
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
      tempErrors.age = "Donor must be between 18 and 65 years old.";
    }

    const weightNum = parseFloat(inputs.weight);
    if (!inputs.weight) {
      tempErrors.weight = "Weight is required.";
    } else if (isNaN(weightNum) || weightNum < 45) {
      tempErrors.weight = "Donor weight must be at least 45 kg.";
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const submitHandler = () => {
    if (!validateForm()) {
      setAlertState({
        open: true,
        message: "Please fix the validation errors before submitting.",
        severity: "warning"
      });
      return;
    }

    axios.post("http://localhost:3002/add", inputs)
      .then((res) => {
        setAlertState({
          open: true,
          message: res.data || "Registered successfully!",
          severity: "success"
        });

        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("userEmail", inputs.email);
        localStorage.setItem("userRole", "donor");

        setInputs({ ename: "", email: "", bloodGroup: "", location: "", phone: "", age: "", weight: "", status: "" });
        
        setTimeout(() => {
          window.location.href = "/profile";
        }, 1500);
      })
      .catch((err) => {
        if (err.response) {
          setAlertState({
            open: true,
            message: err.response.data.message || "Server error occurred.",
            severity: "error"
          });
        } else {
          setAlertState({
            open: true,
            message: "Network Error: Cannot contact the backend server.",
            severity: "error"
          });
        }
      });
  };

  return (
    <Box sx={{ 
      minHeight: '90vh', 
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      py: 6,
      px: 2,
      /* Updated from image graphic to a solid plain Wine Red background color */
      backgroundColor: '#722F37'
    }}>
      
      <Paper 
        elevation={8} 
        sx={{ 
          maxWidth: 480, 
          width: "100%", 
          p: 4, 
          borderRadius: 4, 
          bgcolor: "#ffffff", // Pure solid white for high contrast layout readability
          boxShadow: "0px 12px 40px rgba(0,0,0,0.3)",
          "& input": { 
            backgroundColor: "transparent !important", 
            color: "#333333 !important",
            padding: "8px 4px !important", 
            margin: "0px !important",
            height: "1.4em !important",
            boxShadow: "none !important",
            border: "none !important"
          },
          "& .MuiOutlinedInput-root": {
            backgroundColor: "#ffffff",
            borderRadius: "6px"
          }
        }}
      >
        <Typography 
          variant="h4" 
          sx={{ 
            color: "#722F37", 
            fontFamily: "'Poppins', sans-serif", 
            fontWeight: 800,
            textAlign: "center",
            mb: 1
          }}
        >
          Donor Registration
        </Typography>
        
        <Typography variant="body2" color="text.secondary" sx={{ textAlign: "center", mb: 4 }}>
          Join our network and help save lives in your community.
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          <TextField 
            label="Full Name" name="ename" value={inputs.ename} onChange={inputHandler} 
            error={!!errors.ename} helperText={errors.ename} fullWidth variant="outlined"
          /> 
          
          <TextField 
            label="Email Address" name="email" value={inputs.email} onChange={inputHandler} 
            error={!!errors.email} helperText={errors.email} fullWidth variant="outlined"
          /> 

          <TextField 
            label="Blood Group (e.g., O+, A-)" name="bloodGroup" value={inputs.bloodGroup} onChange={inputHandler} 
            error={!!errors.bloodGroup} helperText={errors.bloodGroup} fullWidth variant="outlined"
          /> 
          
          <TextField 
            label="Current Location" name="location" value={inputs.location} onChange={inputHandler} 
            error={!!errors.location} helperText={errors.location} fullWidth variant="outlined"
          /> 
          
          <TextField 
            label="Phone Number" name="phone" value={inputs.phone} onChange={inputHandler} 
            error={!!errors.phone} helperText={errors.phone} fullWidth variant="outlined"
            inputProps={{ maxLength: 10 }}
          /> 

          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField 
              label="Age" name="age" type="number" value={inputs.age} onChange={inputHandler} 
              error={!!errors.age} helperText={errors.age} fullWidth variant="outlined"
            /> 
            
            <TextField 
              label="Weight (kg)" name="weight" type="number" value={inputs.weight} onChange={inputHandler} 
              error={!!errors.weight} helperText={errors.weight} fullWidth variant="outlined"
            /> 
          </Box>

          <TextField 
            label="Availability Status" name="status" value={inputs.status} onChange={inputHandler} 
            placeholder="e.g. Available, Busy" fullWidth variant="outlined"
          /> 
          
          <Button 
            variant="contained" 
            onClick={submitHandler} 
            sx={{ 
              mt: 1.5, 
              py: 1.6, 
              fontWeight: 'bold', 
              fontSize: '1rem',
              bgcolor: '#722F37',
              color: '#ffffff',
              letterSpacing: '0.5px',
              '&:hover': { bgcolor: '#5a242a' }
            }}
          >
            Submit Registration
          </Button> 
        </Box>
      </Paper>

      <Snackbar 
        open={alertState.open} 
        autoHideDuration={6000} 
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseAlert} severity={alertState.severity} sx={{ width: '100%' }}>
          {alertState.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Register;