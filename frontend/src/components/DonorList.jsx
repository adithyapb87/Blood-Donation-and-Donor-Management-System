import React, { useEffect, useState } from "react";
import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Button, TextField, Paper, Snackbar, Alert, Box, Typography, Chip } from "@mui/material";
import axios from "axios"; 

const DonorList = () => {
  const [donors, setDonors] = useState([]);
  const [filter, setFilter] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [userRole, setUserRole] = useState("");
  const [currentUserEmail, setCurrentUserEmail] = useState("");
  const [alertState, setAlertState] = useState({ open: false, message: "", severity: "success" });

  useEffect(() => {
    const role = localStorage.getItem("userRole");
    const email = localStorage.getItem("userEmail");
    
    setUserRole(role);
    setIsAdmin(role === "admin");
    setCurrentUserEmail(email ? email.toLowerCase() : "");

    fetchDonors();
  }, []);

  const fetchDonors = () => {
    axios.get("http://localhost:3002/view")
      .then((res) => { setDonors(res.data); })
      .catch((err) => { console.log("Error loading donor profiles:", err); });
  };

  const deleDonor = (id) => {
    if (window.confirm("Are you sure you want to delete this donor permanently?")) {
      axios.delete(`http://localhost:3002/delete/${id}`)
        .then(() => {
          setAlertState({ open: true, message: "Record deleted successfully.", severity: "success" });
          fetchDonors();
        })
        .catch((err) => console.log(err));
    }
  };

  const sendEmailRequest = (donor) => {
    axios.post("http://localhost:3002/send-request-email", {
      email: donor.email,
      ename: donor.ename,
      bloodGroup: donor.bloodGroup
    })
    .then(() => {
      setAlertState({ open: true, message: `Request email sent to ${donor.ename}!`, severity: "success" });
    })
    .catch((err) => {
      console.log(err);
      setAlertState({ open: true, message: "Failed to send email request alert.", severity: "error" });
    });
  };

  return (
    <Box sx={{ minHeight: "90vh", bgcolor: "#fffafa", py: 6 }}>
      <Box sx={{ maxWidth: "1100px", margin: "0 auto", px: 2 }}>
        
        <Typography 
          variant="h3" 
          sx={{ color: "#722F37", fontFamily: "'Poppins', sans-serif", fontWeight: 900, mb: 1, textAlign: "center", textTransform: "uppercase" }}
        >
          View Donors and Status
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ textAlign: "center", mb: 4, fontWeight: 300 }}>
          {isAdmin ? "Administrative Dashboard: Total System Control Monitoring" : "Real-time list of live blood donors in your area."}
        </Typography>

        <TextField 
          label="Search by Blood Group or Location..." 
          variant="outlined"
          fullWidth
          onChange={(e) => setFilter(e.target.value)} 
          sx={{ 
            bgcolor: 'white', 
            borderRadius: 2, 
            mb: 4,
            boxShadow: "0px 4px 20px rgba(0,0,0,0.05)"
          }}
        />

        <TableContainer component={Paper} elevation={4} sx={{ borderRadius: 3, overflow: "hidden" }}>
          <Table>
            <TableHead sx={{ bgcolor: "#722F37" }}>
              <TableRow>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>Name</TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>Blood Group</TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>Location</TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>Phone Number</TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>Status</TableCell>
                {isAdmin && <TableCell sx={{ color: "white", fontWeight: "bold", textAlign: "center" }}>Actions</TableCell>}
              </TableRow>
            </TableHead>
            <TableBody>
              {donors.map((val, i) => {
                const matchesBloodGroup = val.bloodGroup && val.bloodGroup.toLowerCase().includes(filter.toLowerCase());
                const matchesLocation = val.location && val.location.toLowerCase().includes(filter.toLowerCase());

                if (filter === "" || matchesBloodGroup || matchesLocation) {
                  const isOwnProfile = val.email && val.email.toLowerCase() === currentUserEmail;

                  return (
                    <TableRow key={val._id || i} sx={{ '&:nth-of-type(odd)': { bgcolor: '#fcfafb' } }}>
                      <TableCell sx={{ fontWeight: 600, color: "#333" }}>{val.ename}</TableCell>
                      
                      <TableCell sx={{ color: 'red', fontWeight: 'bold', fontSize: '1rem' }}>
                        {val.bloodGroup}
                      </TableCell>
                      
                      <TableCell color="text.secondary">{val.location}</TableCell>
                      
                      {/* FIXED PRIVACY LABELS BASED ON YOUR REQUEST */}
                      <TableCell>
                        {(() => {
                          if (isAdmin) {
                            return val.phone; // Admin sees everything
                          }
                          if (userRole === "donor") {
                            // Particular logged in user sees their own, others show as Private
                            return isOwnProfile ? val.phone : "🔒 Private"; 
                          }
                          // If completely logged out (visitor view)
                          return "🔒 Log in to view"; 
                        })()}
                      </TableCell>

                      <TableCell>
                        <Chip 
                          label={val.status || "Available"} 
                          color={(val.status?.toLowerCase() === "busy" || val.status?.toLowerCase() === "not available") ? "default" : "success"}
                          variant="outlined"
                          sx={{ fontWeight: "bold" }}
                        />
                      </TableCell>
                      
                      {isAdmin && (
                        <TableCell sx={{ textAlign: "center" }}>
                          <Button 
                            variant="contained" 
                            color="primary" 
                            size="small"
                            onClick={() => sendEmailRequest(val)} 
                            sx={{ mr: 1, fontWeight: "bold", bgcolor: "#1A365D", '&:hover': { bgcolor: "#0F2340" } }}
                          >
                            Email
                          </Button>
                          <Button 
                            variant="contained" 
                            color="error" 
                            size="small"
                            onClick={() => deleDonor(val._id)}
                            sx={{ bgcolor: "#d32f2f", fontWeight: "bold", '&:hover': { bgcolor: "#9a0007" } }}
                          >
                            Delete
                          </Button>
                        </TableCell>
                      )}
                    </TableRow>
                  );
                }
                return null;
              })}
            </TableBody>
          </Table>
        </TableContainer>

        <Snackbar 
          open={alertState.open} 
          autoHideDuration={3000} 
          onClose={() => setAlertState({ ...alertState, open: false })} 
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert severity={alertState.severity} sx={{ width: '100%' }}>{alertState.message}</Alert>
        </Snackbar>
      </Box>
    </Box>
  );
};

export default DonorList;