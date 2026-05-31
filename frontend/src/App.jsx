import { useState, useEffect } from 'react'
import './App.css'
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { createTheme, ThemeProvider, CssBaseline, Box, Typography, Button, Container, Stack } from '@mui/material';

import Navbar from "./components/Navbar"; 
import Register from "./components/Register";         
import DonorList from "./components/DonorList"; // Updated to DonorList
import Login from "./components/Login"; 
import Profile from "./components/Profile"; 

const bloodTheme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#722F37', dark: '#5a242a', light: '#8b3d45' },
    background: { default: '#fffafa', paper: '#ffffff' },
  },
  typography: { 
    fontFamily: '"Poppins", "Roboto", sans-serif',
    h2: { fontWeight: 800 }
  },
});

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn") === "true";
    setIsAuthenticated(loggedIn);
  }, []);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };
  
  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userRole"); 
    setIsAuthenticated(false);
    window.location.href = "/";
  };

  return (
    <ThemeProvider theme={bloodTheme}>
      <CssBaseline />
      <BrowserRouter>
        <Navbar isAuthenticated={isAuthenticated} onLogout={handleLogout} />
        <Routes>
          {/* Main Home Landing View */}
          <Route path='/' element={
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, height: '80vh', width: '100%', overflow: 'hidden', bgcolor: '#ffffff' }}>
              <Box sx={{ flex: { xs: '1 1 auto', md: 1.2 }, display: 'flex', alignItems: 'center', p: { xs: 4, md: 8 }, textAlign: 'left', bgcolor: '#fffafa' }}>
                <Container maxWidth="sm" sx={{ m: 0, p: 0 }}>
                  <Typography variant="overline" sx={{ letterSpacing: 3, color: '#722F37', fontWeight: 800, display: 'block', mb: 1 }}>
                    GIVE THE GIFT OF LIFE
                  </Typography>
                  <Typography variant="h3" sx={{ fontWeight: 900, color: '#333333', lineHeight: 1.2, mb: 3, textTransform: 'uppercase', fontSize: { xs: '2rem', md: '2.8rem' } }}>
                    Donate Your Blood <br/> and Inspire <br/> Others to Donate.
                  </Typography>
                  <Typography variant="h6" sx={{ fontStyle: 'italic', mb: 5, color: '#555555', fontWeight: 400, borderLeft: '4px solid #722F37', pl: 2 }}>
                    "A single drop of your blood can be a drop of life for someone else."
                  </Typography>
                  <Stack direction="row" spacing={2}>
                    <Button component={Link} to="/a" variant="contained" sx={{ bgcolor: '#722F37', color: 'white', px: 5, py: 2, fontWeight: 'bold', boxShadow: '0px 4px 12px rgba(114, 47, 55, 0.3)', '&:hover': { bgcolor: '#5a242a' } }}>
                      JOIN WITH US →
                    </Button>
                  </Stack>
                </Container>
              </Box>
              <Box sx={{ flex: { xs: 'none', md: 0.8 }, height: { xs: '300px', md: '100%' }, position: 'relative', background: 'linear-gradient(rgba(114, 47, 55, 0.15), rgba(114, 47, 55, 0.15)), url("https://img.freepik.com/premium-photo/blood-donation-process-hospital-setting_1287512-114767.jpg?w=996")', backgroundSize: 'cover', backgroundPosition: 'center center' }} />
            </Box>
          } />
          
          {/* Updated dynamic route to pointing to the DonorList layout component */}
          <Route path='/donor-list' element={<DonorList />} />
          <Route path='/a' element={<Register />} />
          <Route path='/login' element={<Login onLoginSuccess={handleLoginSuccess} />} />
          <Route path='/profile' element={<Profile onLogout={handleLogout} />} /> 
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App;

