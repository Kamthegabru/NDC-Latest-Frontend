import React, { useState, useContext, useEffect } from "react";
import {
  Box, Card, CardContent, Typography, IconButton, Dialog,
  TextField, Button, Grid, Divider, useMediaQuery, CircularProgress,
  DialogTitle, DialogContent, DialogActions, Stack, Avatar, Paper,
  InputAdornment, Tooltip, Zoom, Alert
} from "@mui/material";
import {
  Edit as EditIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Close as CloseIcon,
  CreditCard as CreditCardIcon,
  AccountBalance as AccountBalanceIcon,
  Payment as PaymentIcon,
  Security as SecurityIcon,
  CalendarToday as CalendarTodayIcon,
  LocationOn as LocationOnIcon,
  AccountBox as AccountBoxIcon
} from "@mui/icons-material";
import { useTheme, alpha } from "@mui/material/styles";
import CustomerContext from "../../../Context/Agency/Customer/CustomerContext";

// Enhanced detail item component
const DetailItem = ({ label, value, icon, color = "primary", sensitive = false, visible = false, onToggleVisibility }) => {
  const theme = useTheme();
  
  // Get the actual color value from the theme
  const getColorValue = (colorName) => {
    switch (colorName) {
      case 'primary':
        return theme.palette.primary.main;
      case 'secondary':
        return theme.palette.secondary.main;
      default:
        return theme.palette.primary.main;
    }
  };

  const colorValue = getColorValue(color);

  return (
    <Stack spacing={1}>
      <Typography 
        variant="caption" 
        color="text.secondary" 
        sx={{ 
          fontWeight: 600, 
          textTransform: 'uppercase', 
          letterSpacing: 0.5,
          display: 'flex',
          alignItems: 'center',
          gap: 0.5
        }}
      >
        {icon}
        {label}
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography 
          variant="body1" 
          sx={{ 
            fontWeight: 600,
            color: color === "primary" ? 'text.primary' : `${color}.main`,
            fontFamily: sensitive ? 'monospace' : 'inherit',
            flex: 1
          }}
        >
          {value || "—"}
        </Typography>
        {sensitive && value && value !== "—" && (
          <Tooltip title={visible ? "Hide" : "Show"} TransitionComponent={Zoom}>
            <IconButton 
              onClick={onToggleVisibility} 
              size="small"
              sx={{ 
                bgcolor: alpha(colorValue, 0.1),
                '&:hover': { bgcolor: alpha(colorValue, 0.2) }
              }}
            >
              {visible ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
            </IconButton>
          </Tooltip>
        )}
      </Box>
    </Stack>
  );
};

const PaymentInformation = () => {
  const { userDetails, updatePaymentInformation } = useContext(CustomerContext);
  const [open, setOpen] = useState(false);
  const [paymentInfo, setPaymentInfo] = useState({});
  const [tempPaymentInfo, setTempPaymentInfo] = useState({});
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [showAccountNumber, setShowAccountNumber] = useState(false);
  const [showCreditCardNumber, setShowCreditCardNumber] = useState(false);
  const [showCVV, setShowCVV] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    if (userDetails?.paymentData) {
      setPaymentInfo(userDetails.paymentData);
      setTempPaymentInfo(userDetails.paymentData);
      setLoading(false);
    } else if (userDetails && !userDetails.paymentData) {
      // If userDetails exists but no payment data, stop loading
      setLoading(false);
    }
  }, [userDetails]);

  const handleOpen = () => {
    setTempPaymentInfo({ ...paymentInfo });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    // Reset temp data on close
    setTempPaymentInfo({ ...paymentInfo });
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
    setUpdating(true);
    try {
      await updatePaymentInformation(tempPaymentInfo);
      setOpen(false);
    } catch (error) {
      console.error("Error updating payment information:", error);
    } finally {
      setUpdating(false);
    }
  };

  const maskValue = (value, visible) => {
    if (!value) return "—";
    if (visible) return value;
    const len = value.toString().length;
    return "*".repeat(Math.max(0, len - 4)) + value.toString().slice(-4);
  };

  const formatCardNumber = (value) => {
    if (!value) return "—";
    // Format as XXXX XXXX XXXX XXXX for display
    return value.toString().replace(/(\d{4})(?=\d)/g, '$1 ');
  };

  const getFieldIcon = (key) => {
    switch (key) {
      case 'creditCardNumber':
        return <CreditCardIcon fontSize="small" />;
      case 'cvv':
        return <SecurityIcon fontSize="small" />;
      case 'expMonth':
      case 'expYear':
        return <CalendarTodayIcon fontSize="small" />;
      case 'billingZip':
        return <LocationOnIcon fontSize="small" />;
      case 'accountNumber':
      case 'routingNumber':
        return <AccountBalanceIcon fontSize="small" />;
      case 'accountName':
      case 'accountType':
        return <AccountBoxIcon fontSize="small" />;
      default:
        return <PaymentIcon fontSize="small" />;
    }
  };

  const getFieldLabel = (key) => {
    const labels = {
      creditCardNumber: 'Credit Card Number',
      cvv: 'CVV (3-Digit)',
      expMonth: 'Expiry Month',
      expYear: 'Expiry Year',
      billingZip: 'Billing Zip Code',
      accountNumber: 'Account Number',
      routingNumber: 'Routing Number',
      accountName: 'Account Name',
      accountType: 'Account Type'
    };
    return labels[key] || key.replace(/([A-Z])/g, ' $1').trim();
  };

  if (loading) {
    return (
      <Box sx={{ 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center", 
        height: "50vh",
        flexDirection: 'column',
        gap: 2
      }}>
        <CircularProgress size={48} />
        <Typography variant="body2" color="text.secondary">
          Loading payment information...
        </Typography>
      </Box>
    );
  }

  if (!paymentInfo || Object.keys(paymentInfo).length === 0) {
    return (
      <Box sx={{ p: { xs: 2, md: 3 } }}>
        <Card sx={{ 
          borderRadius: 3, 
          border: '1px dashed', 
          borderColor: 'divider',
          maxWidth: 600,
          mx: 'auto',
          mt: 4
        }}>
          <CardContent sx={{ textAlign: 'center', py: 6 }}>
            <Avatar sx={{ 
              width: 64, 
              height: 64, 
              mx: 'auto', 
              mb: 2, 
              bgcolor: alpha(theme.palette.primary.main, 0.1) 
            }}>
              <PaymentIcon sx={{ fontSize: 32, color: 'primary.main' }} />
            </Avatar>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No Payment Information
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Payment details will appear here once configured
            </Typography>
          </CardContent>
        </Card>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      <Card sx={{ 
        maxWidth: 800, 
        mx: 'auto',
        borderRadius: 3, 
        border: 1, 
        borderColor: 'divider',
        position: "relative",
        overflow: 'hidden',
        mt: 4
      }}>
        {/* Header with gradient background */}
        <Box sx={{
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
          color: 'white',
          p: 3,
          position: 'relative'
        }}>
          <Typography variant="h5" sx={{ 
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            mb: 0.5
          }}>
            <PaymentIcon />
            Payment Information
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.9 }}>
            Secure payment methods and billing details
          </Typography>
          
          <Tooltip title="Edit Payment Information" TransitionComponent={Zoom}>
            <IconButton 
              onClick={handleOpen} 
              sx={{ 
                position: "absolute", 
                top: 16, 
                right: 16, 
                color: "white",
                bgcolor: alpha(theme.palette.common.white, 0.1),
                '&:hover': { bgcolor: alpha(theme.palette.common.white, 0.2) }
              }}
            >
              <EditIcon />
            </IconButton>
          </Tooltip>
        </Box>

        <CardContent sx={{ p: 3 }}>
          <Grid container spacing={3}>
            {/* Credit Card Section */}
            <Grid item xs={12}>
              <Paper sx={{ 
                p: 3, 
                bgcolor: 'grey.50', 
                border: 1, 
                borderColor: 'divider',
                borderRadius: 2 
              }}>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontWeight: 600, 
                    mb: 2,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    color: 'primary.main'
                  }}
                >
                  <CreditCardIcon />
                  Credit Card Details
                </Typography>
                
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <DetailItem
                      label="Card Number"
                      value={maskValue(formatCardNumber(paymentInfo.creditCardNumber), showCreditCardNumber)}
                      icon={<CreditCardIcon fontSize="small" />}
                      sensitive={true}
                      visible={showCreditCardNumber}
                      onToggleVisibility={() => setShowCreditCardNumber(!showCreditCardNumber)}
                    />
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <DetailItem
                      label="CVV"
                      value={maskValue(paymentInfo.cvv, showCVV)}
                      icon={<SecurityIcon fontSize="small" />}
                      sensitive={true}
                      visible={showCVV}
                      onToggleVisibility={() => setShowCVV(!showCVV)}
                    />
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <DetailItem
                      label="Billing Zip"
                      value={paymentInfo.billingZip}
                      icon={<LocationOnIcon fontSize="small" />}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <DetailItem
                      label="Expiry Month"
                      value={paymentInfo.expMonth ? String(paymentInfo.expMonth).padStart(2, '0') : "—"}
                      icon={<CalendarTodayIcon fontSize="small" />}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <DetailItem
                      label="Expiry Year"
                      value={paymentInfo.expYear}
                      icon={<CalendarTodayIcon fontSize="small" />}
                    />
                  </Grid>
                </Grid>
              </Paper>
            </Grid>

            {/* Bank Account Section */}
            <Grid item xs={12}>
              <Paper sx={{ 
                p: 3, 
                border: 1, 
                borderColor: 'divider',
                borderRadius: 2 
              }}>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontWeight: 600, 
                    mb: 2,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    color: 'secondary.main'
                  }}
                >
                  <AccountBalanceIcon />
                  Bank Account Details
                </Typography>
                
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <DetailItem
                      label="Account Number"
                      value={maskValue(paymentInfo.accountNumber, showAccountNumber)}
                      icon={<AccountBalanceIcon fontSize="small" />}
                      color="secondary"
                      sensitive={true}
                      visible={showAccountNumber}
                      onToggleVisibility={() => setShowAccountNumber(!showAccountNumber)}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <DetailItem
                      label="Routing Number"
                      value={paymentInfo.routingNumber}
                      icon={<AccountBalanceIcon fontSize="small" />}
                      color="secondary"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <DetailItem
                      label="Account Name"
                      value={paymentInfo.accountName}
                      icon={<AccountBoxIcon fontSize="small" />}
                      color="secondary"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <DetailItem
                      label="Account Type"
                      value={paymentInfo.accountType}
                      icon={<AccountBoxIcon fontSize="small" />}
                      color="secondary"
                    />
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Enhanced Edit Modal */}
      <Dialog 
        open={open} 
        onClose={handleClose}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle
          sx={{
            p: 0,
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
            color: 'white',
            position: 'relative'
          }}
        >
          <Box sx={{ p: 3, pr: 6 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
              <EditIcon />
              Edit Payment Information
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9, mt: 0.5 }}>
              Update your payment methods and billing details
            </Typography>
          </Box>
          <IconButton
            onClick={handleClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: 'white',
              '&:hover': { bgcolor: alpha(theme.palette.common.white, 0.1) }
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ p: 3 }}>
          <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
            <Typography variant="body2">
              All payment information is encrypted and securely stored. Only the last 4 digits are displayed for security.
            </Typography>
          </Alert>

          <Grid container spacing={3} sx={{ mt: 0 }}>
            {/* Credit Card Section */}
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: 'primary.main' }}>
                Credit Card Information
              </Typography>
            </Grid>

            {['creditCardNumber', 'cvv', 'expMonth', 'expYear', 'billingZip'].map((key) => (
              <Grid item xs={12} sm={key === 'creditCardNumber' ? 12 : 6} md={key === 'creditCardNumber' ? 8 : 4} key={key}>
                <TextField
                  fullWidth
                  label={getFieldLabel(key)}
                  name={key}
                  value={tempPaymentInfo[key] || ""}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        {getFieldIcon(key)}
                      </InputAdornment>
                    ),
                  }}
                  inputProps={{
                    inputMode: key !== "accountName" && key !== "accountType" ? "numeric" : "text",
                    maxLength: key === 'creditCardNumber' ? 16 : key === 'cvv' ? 3 : key === 'expMonth' ? 2 : key === 'expYear' ? 4 : key === 'billingZip' ? 5 : undefined
                  }}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
              </Grid>
            ))}

            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: 'secondary.main' }}>
                Bank Account Information
              </Typography>
            </Grid>

            {['accountNumber', 'routingNumber', 'accountName', 'accountType'].map((key) => (
              <Grid item xs={12} sm={6} key={key}>
                <TextField
                  fullWidth
                  label={getFieldLabel(key)}
                  name={key}
                  value={tempPaymentInfo[key] || ""}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        {getFieldIcon(key)}
                      </InputAdornment>
                    ),
                  }}
                  inputProps={{
                    inputMode: key !== "accountName" && key !== "accountType" ? "numeric" : "text",
                    maxLength: key === 'routingNumber' ? 9 : undefined
                  }}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
              </Grid>
            ))}
          </Grid>
        </DialogContent>

        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Stack direction="row" spacing={2} width="100%">
            <Button
              onClick={handleClose}
              variant="outlined"
              sx={{ flex: 1, borderRadius: 2, py: 1.5, textTransform: 'none', fontWeight: 600 }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdate}
              variant="contained"
              disabled={updating}
              sx={{ flex: 1, borderRadius: 2, py: 1.5, textTransform: 'none', fontWeight: 600 }}
            >
              {updating ? 'Updating...' : 'Update Payment Info'}
            </Button>
          </Stack>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PaymentInformation;