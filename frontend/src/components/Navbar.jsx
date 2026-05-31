import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { AppBar, Toolbar, Typography, Button, Stack } from "@mui/material";

const Navbar = ({ isAuthenticated, onLogout }) => {
  const navigate = useNavigate();
  const userRole = localStorage.getItem("userRole");

  return (
    <AppBar position="static" sx={{ bgcolor: "#722F37", padding: "5px 0" }}>
      <Toolbar sx={{ justifyContent: "space-between" }}>
        
        <Typography 
          variant="h6" 
          component={Link} 
          to="/" 
          sx={{ fontWeight: "bold", textDecoration: "none", color: "white", letterSpacing: 1 }}
        >
          BLOODSYSTEM
        </Typography>

        <Stack direction="row" spacing={3} alignItems="center">
          <Button component={Link} to="/" color="inherit">HOME</Button>
          <Button component={Link} to="/a" color="inherit">REGISTER</Button>
          
          {/* Linked to your newly defined unified list path */}
          <Button component={Link} to="/donor-list" color="inherit">
            VIEW DONORS AND STATUS
          </Button>

          {isAuthenticated && userRole !== "admin" && (
            <Button component={Link} to="/profile" color="inherit">MY PROFILE</Button>
          )}

          {isAuthenticated ? (
            <Button variant="outlined" color="inherit" onClick={onLogout} sx={{ border: "1px solid white" }}>
              LOGOUT
            </Button>
          ) : (
            <Button variant="outlined" color="inherit" component={Link} to="/login" sx={{ border: "1px solid white" }}>
              LOGIN
            </Button>
          )}
        </Stack>

      </Toolbar>
    </AppBar>
  );
};

export default Navbar;