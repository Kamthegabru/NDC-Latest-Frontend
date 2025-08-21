import React, { useState, useContext, useEffect } from "react";
import {
  Box, Card, CardContent, Typography, IconButton,
  Modal, TextField, Button, Grid, Divider, useMediaQuery, CircularProgress
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useTheme } from "@mui/material/styles";
import CustomerContext from "../../../Context/Agency/Customer/CustomerContext";

const PaymentInformation = () => {
  const { userDetails, updatePaymentInformation } = useContext(CustomerContext);
  const [open, setOpen] = useState(false);
  const [paymentInfo, setPaymentInfo] = useState({});
  const [tempPaymentInfo, setTempPaymentInfo] = useState({});
  const [loading, setLoading] = useState(true);
  const [showAccountNumber, setShowAccountNumber] = useState(false);
  const [showCreditCardNumber, setShowCreditCardNumber] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    if (userDetails?.paymentData) {
      setPaymentInfo(userDetails.paymentData);
      setTempPaymentInfo(userDetails.paymentData);
      setLoading(false);
    }
  }, [userDetails]);

  const handleOpen = () => {
    setTempPaymentInfo({ ...paymentInfo });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Allow only digits except for accountName and accountType
    if (name !== "accountName" && name !== "accountType") {
      const digitsOnly = value.replace(/\D/g, "");
      setTempPaymentInfo(prev => ({ ...prev, [name]: digitsOnly }));
    } else {
      setTempPaymentInfo(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleUpdate = async () => {
    await updatePaymentInformation(tempPaymentInfo);
    setOpen(false);
  };

  const maskValue = (value, visible) => {
    if (!value) return "N/A";
    if (visible) return value;
    const len = value.length;
    return "*".repeat(len - 4) + value.slice(-4);
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: "100px", px: 2 }}>
      <Card sx={{ width: isMobile ? "100%" : 600, p: 3, position: "relative", borderRadius: 3, boxShadow: 3 }}>
        <IconButton onClick={handleOpen} sx={{ position: "absolute", top: 15, right: 15, color: "primary.main" }}>
          <EditIcon />
        </IconButton>
        <CardContent>
          <Typography variant="h5" sx={{ mb: 3, fontWeight: "bold", color: "primary.main" }}>
            Payment Information
          </Typography>
          <Grid container spacing={2}>
            {[
              { label: "Credit Card Number", key: "creditCardNumber", sensitive: true, toggle: showCreditCardNumber, setToggle: setShowCreditCardNumber },
              { label: "3-Digit CVV", key: "cvv" },
              { label: "Expiry Date Month", key: "expMonth" },
              { label: "Expiry Date Year", key: "expYear" },
              { label: "Billing Zip Code", key: "billingZip" },
              { label: "Account Number", key: "accountNumber", color: "#7B4F24", sensitive: true, toggle: showAccountNumber, setToggle: setShowAccountNumber },
              { label: "Routing Number", key: "routingNumber", color: "#7B4F24" },
              { label: "Account Name", key: "accountName", color: "#7B4F24" },
              { label: "Account Type", key: "accountType", color: "#7B4F24" }
            ].map(({ label, key, color, sensitive, toggle, setToggle }) => (
              <Grid item xs={12} sm={6} key={key}>
                <Typography variant="subtitle2" sx={{ fontWeight: "bold", color: color || "text.secondary" }}>
                  {label}:
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Typography variant="body1" sx={{ color: "#003366", fontWeight: 700, flexGrow: 1 }}>
                    {sensitive ? maskValue(paymentInfo[key], toggle) : paymentInfo[key] || "N/A"}
                  </Typography>
                  {sensitive && (
                    <IconButton onClick={() => setToggle(prev => !prev)} size="small">
                      {toggle ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                    </IconButton>
                  )}
                </Box>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>

      {/* Edit Modal */}
      <Modal open={open} onClose={handleClose}>
        <Box sx={{ width: isMobile ? "90%" : 500, bgcolor: "background.paper", p: 4, m: "auto", mt: 10, borderRadius: 3, boxShadow: 5 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold", color: "primary.main" }}>Edit Payment Information</Typography>
          <Divider sx={{ mb: 3 }} />
          <Grid container spacing={2}>
            {Object.entries(tempPaymentInfo).map(([key, value]) => (
              <Grid item xs={12} sm={6} key={key}>
                <TextField
                  fullWidth
                  size="small"
                  label={key.replace(/([A-Z])/g, " $1").trim()}
                  name={key}
                  value={value || ""}
                  onChange={handleChange}
                  variant="outlined"
                  inputProps={{
                    inputMode: key !== "accountName" && key !== "accountType" ? "numeric" : "text"
                  }}
                />
              </Grid>
            ))}
          </Grid>
          <Box sx={{ mt: 4, display: "flex", justifyContent: "flex-end", gap: 2 }}>
            <Button onClick={handleClose} variant="outlined">Cancel</Button>
            <Button onClick={handleUpdate} variant="contained">Update</Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default PaymentInformation;
