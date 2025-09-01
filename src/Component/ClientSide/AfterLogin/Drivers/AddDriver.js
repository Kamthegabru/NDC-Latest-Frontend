import React, { useContext, useState } from "react";
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  Box,
  Grid,
  InputAdornment,
  Alert,
  Divider,
  Stack,
  IconButton,
  useMediaQuery
} from "@mui/material";
import { useTheme, alpha } from "@mui/material/styles";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import BadgeIcon from "@mui/icons-material/Badge";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import CloseIcon from "@mui/icons-material/Close";

import HomeContext from "../../../../Context/ClientSide/AfterLogin/Home/HomeContext";

function AddDriver() {
  const { updateUserData, AddDriver } = useContext(HomeContext);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [driverData, setDriverData] = useState({
    firstName: "",
    lastName: "",
    license: "",
    dob: "",
    email: "",
    phone: ""
  });

  const handleClickOpen = () => {
    setOpen(true);
    setErrors({});
    setDriverData({
      firstName: "",
      lastName: "",
      license: "",
      dob: "",
      email: "",
      phone: ""
    });
  };

  const handleClose = () => {
    setOpen(false);
    setErrors({});
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!driverData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!driverData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!driverData.license.trim()) newErrors.license = "License number is required";
    if (!driverData.dob) newErrors.dob = "Date of birth is required";
    if (!driverData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(driverData.email)) {
      newErrors.email = "Email is invalid";
    }
    if (!driverData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(driverData.phone.replace(/\D/g, ''))) {
      newErrors.phone = "Phone number must be 10 digits";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Format phone number
    if (name === "phone") {
      const phoneValue = value.replace(/\D/g, '').slice(0, 10);
      setDriverData((prev) => ({ ...prev, [name]: phoneValue }));
    } else {
      setDriverData((prev) => ({ ...prev, [name]: value }));
    }
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleSave = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      // Convert to match your existing API format
      const formattedData = {
        name: `${driverData.firstName} ${driverData.lastName}`,
        license: driverData.license,
        dob: driverData.dob,
        email: driverData.email,
        phone: driverData.phone
      };
      
      await AddDriver(formattedData);
      await updateUserData();
      handleClose();
    } catch (error) {
      console.error("Error adding driver:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatPhoneDisplay = (phone) => {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 10) {
      return `(${cleaned.slice(0,3)}) ${cleaned.slice(3,6)}-${cleaned.slice(6)}`;
    }
    return phone;
  };

  return (
    <>
      <Button
        variant="contained"
        startIcon={<PersonAddIcon />}
        onClick={handleClickOpen}
        sx={{
          bgcolor: 'success.main',
          color: 'white',
          borderRadius: 2,
          px: 3,
          py: 1.5,
          fontWeight: 600,
          textTransform: 'none',
          boxShadow: theme.shadows[3],
          '&:hover': {
            bgcolor: 'success.dark',
            transform: 'translateY(-1px)',
            boxShadow: theme.shadows[4],
          },
          '&:active': {
            transform: 'translateY(0)',
          },
          transition: 'all 0.2s ease',
        }}
      >
        Add Employee
      </Button>

      <Dialog 
        open={open} 
        onClose={handleClose}
        maxWidth="md"
        fullWidth
        fullScreen={isMobile}
        PaperProps={{
          sx: {
            borderRadius: isMobile ? 0 : 3,
            minHeight: isMobile ? '100vh' : 'auto'
          }
        }}
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
            <Typography variant="h5" sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
              <PersonAddIcon />
              Add New Employee
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9, mt: 0.5 }}>
              Enter employee details below
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
          <Grid container spacing={3} sx={{ mt: 0 }}>
            {/* Personal Information Section */}
            <Grid item xs={12}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'primary.main', mb: 1 }}>
                  Personal Information
                </Typography>
                <Divider />
              </Box>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="First Name"
                name="firstName"
                value={driverData.firstName}
                onChange={handleChange}
                error={!!errors.firstName}
                helperText={errors.firstName}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon color="action" />
                    </InputAdornment>
                  ),
                }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Last Name"
                name="lastName"
                value={driverData.lastName}
                onChange={handleChange}
                error={!!errors.lastName}
                helperText={errors.lastName}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon color="action" />
                    </InputAdornment>
                  ),
                }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="License Number"
                name="license"
                value={driverData.license}
                onChange={handleChange}
                error={!!errors.license}
                helperText={errors.license}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <BadgeIcon color="action" />
                    </InputAdornment>
                  ),
                }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Date of Birth"
                name="dob"
                type="date"
                value={driverData.dob}
                onChange={handleChange}
                error={!!errors.dob}
                helperText={errors.dob}
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <CalendarTodayIcon color="action" />
                    </InputAdornment>
                  ),
                }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
            </Grid>

            {/* Contact Information Section */}
            <Grid item xs={12}>
              <Box sx={{ mt: 2, mb: 2 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'primary.main', mb: 1 }}>
                  Contact Information
                </Typography>
                <Divider />
              </Box>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email Address"
                name="email"
                type="email"
                value={driverData.email}
                onChange={handleChange}
                error={!!errors.email}
                helperText={errors.email}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon color="action" />
                    </InputAdornment>
                  ),
                }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Phone Number"
                name="phone"
                value={formatPhoneDisplay(driverData.phone)}
                onChange={handleChange}
                error={!!errors.phone}
                helperText={errors.phone}
                placeholder="(555) 123-4567"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PhoneIcon color="action" />
                    </InputAdornment>
                  ),
                }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
            </Grid>
          </Grid>

          {Object.keys(errors).length > 0 && (
            <Alert 
              severity="error" 
              sx={{ mt: 3, borderRadius: 2 }}
              icon={false}
            >
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                Please fix the errors above to continue
              </Typography>
            </Alert>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Stack direction="row" spacing={2} width="100%">
            <Button 
              onClick={handleClose}
              variant="outlined"
              sx={{ 
                flex: 1,
                borderRadius: 2,
                py: 1.5,
                textTransform: 'none',
                fontWeight: 600
              }}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSave}
              variant="contained"
              disabled={loading}
              sx={{ 
                flex: 1,
                borderRadius: 2,
                py: 1.5,
                textTransform: 'none',
                fontWeight: 600,
                bgcolor: 'success.main',
                '&:hover': { bgcolor: 'success.dark' }
              }}
            >
              {loading ? 'Adding...' : 'Add Employee'}
            </Button>
          </Stack>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default AddDriver;