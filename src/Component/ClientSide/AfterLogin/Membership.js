import React, { useState, useContext, useEffect } from "react";
import {
  Box, Card, CardContent, Typography, IconButton, Grid, Chip,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Menu, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions, Button,
  useMediaQuery
} from "@mui/material";
import { MoreVert, Visibility, } from "@mui/icons-material";
import HomeContext from "../../../Context/ClientSide/AfterLogin/Home/HomeContext";

const formatDate = (dateStr) => {
  return dateStr ? new Date(dateStr).toLocaleDateString("en-US") : "N/A";
};

const LabelValue = ({ label, value }) => (
  <>
    <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: 'grey' }}>{label}</Typography>
    <Typography variant="body1" sx={{ fontWeight: 'bold', mb: 1 }}>{value || "N/A"}</Typography>
  </>
);

function Membership() {
  const [viewOpen, setViewOpen] = useState(false);
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuIndex, setMenuIndex] = useState(null);
  const isMobile = useMediaQuery("(max-width:500px)");
  const { userData } = useContext(HomeContext);
  const [membershipInfo, setMembershipInfo] = useState({});
  const [certificate, setCertificate] = useState([]);

  useEffect(() => {
    if (userData) {
      setMembershipInfo(userData.Membership || {});
      setCertificate(userData.certificates || []);
    }
  }, [userData]);

  const handleMenuClick = (event, index) => {
    setAnchorEl(event.currentTarget);
    setMenuIndex(index);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuIndex(null);
  };

  const handleViewOpen = (cert) => {
    setSelectedCertificate(cert);
    setViewOpen(true);
    handleMenuClose();
  };

  const handleViewClose = () => {
    setViewOpen(false);
    setSelectedCertificate(null);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", px: 2, mt: 8, gap: 4 }}>
      {/* Membership Information Card */}
      <Card sx={{ width: isMobile ? "100%" : 700, p: 3, position: "relative", borderRadius: 3, boxShadow: 3 }}>
        {/* <IconButton sx={{ position: "absolute", top: 15, right: 15, color: "primary.main" }}>
          <EditIcon />
        </IconButton> */}
        <CardContent>
          <Typography variant="h5" sx={{ mb: 3, fontWeight: "bold", color: "primary.main" }}>
            Membership Information
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <LabelValue label="Current Plan:" value={membershipInfo.planName} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <LabelValue label="Join Date:" value={formatDate(membershipInfo.planStartDate)} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <LabelValue label="Renewal Date:" value={formatDate(membershipInfo.planEndDate)} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: 'grey' }}>Status:</Typography>
              <Typography
                variant="body1"
                sx={{
                  fontWeight: 'bold',
                  color:
                    membershipInfo.planStatus === "Active" ? "green" :
                      membershipInfo.planStatus === "Pending" ? "orange" :
                        membershipInfo.planStatus === "Inactive" ? "red" :
                          "#003366"
                }}
              >
                {membershipInfo.planStatus || "N/A"}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <LabelValue label="OrgId:" value={membershipInfo.orgId} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <LabelValue label="Location Code:" value={membershipInfo.locationCode} />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: 'grey' }}>Packages:</Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1 }}>
                {membershipInfo.package?.length > 0 ? (
                  membershipInfo.package.map((pkg, index) => (
                    <Chip
                      key={index}
                      label={pkg.package_name}
                      variant="outlined"
                      sx={{ borderColor: '#003366', color: '#003366', fontWeight: 'bold' }}
                    />
                  ))
                ) : (
                  <Typography variant="body2" color="text.secondary">N/A</Typography>
                )}
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: 'grey' }}>Reason Names:</Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1 }}>
                {membershipInfo.order_reason?.length > 0 ? (
                  membershipInfo.order_reason.map((reason, index) => (
                    <Chip
                      key={index}
                      label={reason.order_reason_name}
                      variant="outlined"
                      sx={{ borderColor: '#003366', color: '#003366', fontWeight: 'bold' }}
                    />
                  ))
                ) : (
                  <Typography variant="body2" color="text.secondary">N/A</Typography>
                )}
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Certificates Table */}
      <Box sx={{ width: "100%" }}>
        <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ textAlign: "center" }}>
          Certificates
        </Typography>
        <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 3, overflowX: "auto" }}>
          <Table>
            <TableHead sx={{ backgroundColor: "#003366" }}>
              <TableRow>
                <TableCell sx={{ color: "white" }}>Sr</TableCell>
                <TableCell sx={{ color: "white" }}>Description</TableCell>
                {!isMobile && <TableCell sx={{ color: "white" }}>Issue Date</TableCell>}
                {!isMobile && <TableCell sx={{ color: "white" }}>Expiration Date</TableCell>}
                {!isMobile && <TableCell sx={{ color: "white" }} align="right">Actions</TableCell>}
              </TableRow>
            </TableHead>
            <TableBody>
              {certificate.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={isMobile ? 3 : 5} align="center">
                    <Typography variant="subtitle1" fontWeight="bold">
                      No certificate to show
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                certificate.map((cert, index) => (
                  <TableRow key={index}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{cert.description}</TableCell>
                    {!isMobile && (
                      <TableCell>
                        {cert.issueDate
                          ? new Date(cert.issueDate).toLocaleDateString("en-US")
                          : "N/A"}
                      </TableCell>
                    )}
                    {!isMobile && (
                      <TableCell>
                        {cert.expirationDate
                          ? new Date(cert.expirationDate).toLocaleDateString("en-US")
                          : "N/A"}
                      </TableCell>
                    )}
                    {!isMobile && (
                      <TableCell align="right">
                        <IconButton onClick={(e) => handleMenuClick(e, index)}>
                          <MoreVert />
                        </IconButton>
                        <Menu
                          anchorEl={anchorEl}
                          open={menuIndex === index}
                          onClose={handleMenuClose}
                        >
                          <MenuItem onClick={() => handleViewOpen(cert)}>
                            <Visibility fontSize="small" sx={{ mr: 1 }} /> View Details
                          </MenuItem>
                        </Menu>
                      </TableCell>
                    )}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* Certificate Modal */}
      <Dialog open={viewOpen} onClose={handleViewClose} maxWidth="sm" fullWidth>
        <DialogTitle>Certificate Details</DialogTitle>
        <DialogContent>
          <Typography gutterBottom><strong>Description:</strong> {selectedCertificate?.description}</Typography>
          <Typography gutterBottom>
            <strong>Issue Date:</strong>{" "}
            {selectedCertificate?.issueDate
              ? new Date(selectedCertificate.issueDate).toLocaleDateString("en-US")
              : "N/A"}
          </Typography>
          <Typography gutterBottom>
            <strong>Expiration Date:</strong>{" "}
            {selectedCertificate?.expirationDate
              ? new Date(selectedCertificate.expirationDate).toLocaleDateString("en-US")
              : "N/A"}
          </Typography>
          {selectedCertificate?.certificateFile && (
            <iframe
              src={`data:${selectedCertificate.mimeType || "application/pdf"};base64,${selectedCertificate.certificateFile}`}
              title="Certificate PDF"
              style={{ width: "100%", height: "500px", marginTop: "1rem", borderRadius: 8 }}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleViewClose} color="primary">Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Membership;
