import React, { useState, useContext, useEffect } from "react";
import {
  Box, Card, CardContent, Typography, IconButton,
  Modal, TextField, Button, Grid, Divider, useMediaQuery, CircularProgress,
  MenuItem, Select, InputLabel, FormControl, InputAdornment
} from "@mui/material";
import { Visibility, VisibilityOff, Edit as EditIcon } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import CustomerContext from "../../../Context/Admin/Customer/CustomerContext";

const PaymentInformation = () => {
  const { userDetails, updatePaymentInformation } = useContext(CustomerContext);
  const [open, setOpen] = useState(false);
  const [paymentInfo, setPaymentInfo] = useState({});
  const [tempPaymentInfo, setTempPaymentInfo] = useState({});
  const [loading, setLoading] = useState(true);

  const [showCard, setShowCard] = useState(false);
  const [showAccount, setShowAccount] = useState(false);

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
    setTempPaymentInfo({ ...tempPaymentInfo, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    await updatePaymentInformation(tempPaymentInfo);
    setOpen(false);
  };

  const renderMasked = (value, show) => {
    if (!value) return "N/A";
    if (show) return value;
    return "*".repeat(value.length - 4) + value.slice(-4);
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: "40px", px: 2 }}>
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
              { label: "Credit Card Number", key: "creditCardNumber" },
              { label: "3-Digit CVV", key: "cvv" },
              { label: "Expiry Date Month", key: "expMonth" },
              { label: "Expiry Date Year", key: "expYear" },
              { label: "Billing Zip Code", key: "billingZip" },
              { label: "Account Number", key: "accountNumber", color: "#7B4F24" },
              { label: "Routing Number", key: "routingNumber", color: "#7B4F24" },
              { label: "Account Name", key: "accountName", color: "#7B4F24" },
              { label: "Account Type", key: "accountType", color: "#7B4F24" }
            ].map(({ label, key, color }) => (
              <Grid item xs={12} sm={6} key={key}>
                <Typography variant="subtitle2" sx={{ fontWeight: "bold", color: color || "text.secondary" }}>
                  {label}:
                </Typography>
                <Box display="flex" alignItems="center">
                  <Typography variant="body1" sx={{ color: "#003366", fontWeight: 700, mr: 1 }}>
                    {(key === "creditCardNumber")
                      ? renderMasked(paymentInfo[key], showCard)
                      : (key === "accountNumber")
                      ? renderMasked(paymentInfo[key], showAccount)
                      : paymentInfo[key] || "N/A"}
                  </Typography>
                  {(key === "creditCardNumber" || key === "accountNumber") && (
                    <IconButton
                      size="small"
                      onClick={() => {
                        key === "creditCardNumber"
                          ? setShowCard(!showCard)
                          : setShowAccount(!showAccount);
                      }}
                    >
                      {((key === "creditCardNumber" && showCard) ||
                        (key === "accountNumber" && showAccount)) ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
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
                {key === "accountType" ? (
                  <FormControl fullWidth size="small">
                    <InputLabel id="account-type-label">Account Type</InputLabel>
                    <Select
                      labelId="account-type-label"
                      name="accountType"
                      value={value || ""}
                      onChange={handleChange}
                      label="Account Type"
                    >
                      {["Checking", "Saving", "Consumer", "Business"].map((option) => (
                        <MenuItem key={option} value={option}>{option}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                ) : (
                  <TextField
  fullWidth
  size="small"
  label={key.replace(/([A-Z])/g, " $1").trim()}
  name={key}
  value={value || ""}
  onChange={(e) => {
    const newValue = e.target.value;
    // Allow only digits if the key is not accountName or accountType
    if (["accountName", "accountType"].includes(key) || /^\d*$/.test(newValue)) {
      setTempPaymentInfo({ ...tempPaymentInfo, [key]: newValue });
    }
  }}
  variant="outlined"
  type={["creditCardNumber", "accountNumber"].includes(key)
    ? (key === "creditCardNumber" && showCard) || (key === "accountNumber" && showAccount)
      ? "text"
      : "password"
    : "text"}
  inputProps={
    ["accountName", "accountType"].includes(key)
      ? {}
      : { inputMode: "numeric", pattern: "[0-9]*" }
  }
  InputProps={
    ["creditCardNumber", "accountNumber"].includes(key)
      ? {
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={() =>
                  key === "creditCardNumber"
                    ? setShowCard(!showCard)
                    : setShowAccount(!showAccount)
                }
                edge="end"
              >
                {(key === "creditCardNumber" && showCard) ||
                (key === "accountNumber" && showAccount)
                  ? <VisibilityOff />
                  : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }
      : undefined
  }
/>

                )}
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
