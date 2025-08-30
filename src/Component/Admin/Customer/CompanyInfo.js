import React, { useContext, useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  IconButton,
  TextField,
  Button,
  Grid,
  useMediaQuery,
  CircularProgress,
  MenuItem,
  Paper,
  Avatar,
  InputAdornment,
  Stack,
  Alert,
  Snackbar,
  Divider,
} from "@mui/material";
import { useTheme, alpha } from "@mui/material/styles";

// Icons
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import BusinessIcon from "@mui/icons-material/Business";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import GroupsIcon from "@mui/icons-material/Groups";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import HomeWorkIcon from "@mui/icons-material/HomeWork";
import MapIcon from "@mui/icons-material/Map";
import MarkunreadMailboxIcon from "@mui/icons-material/MarkunreadMailbox";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

import CustomerContext from "../../../Context/Admin/Customer/CustomerContext";

const normalizePhoneNumber = require("../../Utils/normalizePhone");

// Field configurations
const fieldConfig = {
  basic: {
    title: "Basic Information",
    icon: <BusinessIcon />,
    color: "#1976d2",
    fields: {
      companyName: { label: "Company Name", icon: <BusinessIcon />, required: true },
      usdot: { label: "USDOT", icon: <LocalShippingIcon />, type: "number" },
      employees: { label: "Employees", icon: <GroupsIcon />, type: "number" },
    }
  },
  contact: {
    title: "Contact Details",
    icon: <PhoneIcon />,
    color: "#2e7d32",
    fields: {
      contactNumber: { label: "Phone", icon: <PhoneIcon />, type: "tel" },
      email: { label: "Email", icon: <EmailIcon />, type: "email" },
    }
  },
  address: {
    title: "Address Information",
    icon: <LocationOnIcon />,
    color: "#ed6c02",
    fields: {
      address: { label: "Street Address", icon: <HomeWorkIcon /> },
      suite: { label: "Suite", icon: <HomeWorkIcon />, type: "number" },
      city: { label: "City", icon: <LocationOnIcon /> },
      state: { label: "State", icon: <MapIcon />, type: "select" },
      zip: { label: "ZIP", icon: <MarkunreadMailboxIcon />, type: "number" },
    }
  }
};

// US States
const states = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado",
  "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii", "Idaho",
  "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana",
  "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi",
  "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey",
  "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio",
  "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina",
  "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Virginia",
  "Washington", "West Virginia", "Wisconsin", "Wyoming"
];

const CompanyDetails = () => {
  const { userDetails, updateCompanyInformation } = useContext(CustomerContext);
  const [companyInfoData, setCompanyInfoData] = useState({});
  const [tempData, setTempData] = useState({});
  const [isEditMode, setIsEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    if (userDetails) {
      setCompanyInfoData(userDetails.companyInfoData);
      setTempData(userDetails.companyInfoData);
      setLoading(false);
    }
  }, [userDetails]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 300 }}>
        <CircularProgress />
      </Box>
    );
  }

  const handleEdit = () => {
    setIsEditMode(true);
    setTempData({ ...companyInfoData });
  };

  const handleSave = () => {
    setCompanyInfoData(tempData);
    updateCompanyInformation(tempData);
    setIsEditMode(false);
    setSnackbar({ open: true, message: "Information updated successfully!", severity: "success" });
  };

  const handleCancel = () => {
    setIsEditMode(false);
    setTempData({ ...companyInfoData });
  };

  const handleFieldChange = (field, value) => {
    setTempData({ ...tempData, [field]: value });
  };

  const formatDisplayValue = (key, value) => {
    if (!value) return "—";
    if (key === "contactNumber") return normalizePhoneNumber(value);
    if (key === "usdot") return String(value).toUpperCase();
    return value;
  };

  const renderField = (fieldKey, fieldInfo, value) => {
    return (
      <Box key={fieldKey} sx={{ mb: 1.5 }}>
        {isEditMode ? (
          fieldInfo.type === 'select' ? (
            <TextField
              select
              fullWidth
              size="small"
              label={fieldInfo.label}
              value={tempData[fieldKey] || ""}
              onChange={(e) => handleFieldChange(fieldKey, e.target.value)}
              variant="outlined"
              SelectProps={{
                MenuProps: {
                  anchorOrigin: {
                    vertical: 'bottom',
                    horizontal: 'left',
                  },
                  transformOrigin: {
                    vertical: 'top',
                    horizontal: 'left',
                  },
                  PaperProps: {
                    style: {
                      maxHeight: 250,
                    },
                  },
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    {fieldInfo.icon}
                  </InputAdornment>
                ),
              }}
            >
              {states.map((state) => (
                <MenuItem key={state} value={state}>
                  {state}
                </MenuItem>
              ))}
            </TextField>
          ) : (
            <TextField
              fullWidth
              size="small"
              label={fieldInfo.label}
              value={tempData[fieldKey] || ""}
              onChange={(e) => handleFieldChange(fieldKey, e.target.value)}
              variant="outlined"
              type={fieldInfo.type || 'text'}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    {fieldInfo.icon}
                  </InputAdornment>
                ),
              }}
            />
          )
        ) : (
          <Stack spacing={0.5}>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>
              {fieldInfo.label}
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {formatDisplayValue(fieldKey, value)}
            </Typography>
          </Stack>
        )}
      </Box>
    );
  };

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto' }}>
      {/* Compact Header */}
      <Paper
        elevation={0}
        sx={{
          p: 2,
          mb: 2,
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
          borderRadius: 2,
          color: 'white',
        }}
      >
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar sx={{ width: 40, height: 40, bgcolor: alpha(theme.palette.common.white, 0.2) }}>
              <BusinessIcon />
            </Avatar>
            <Box>
            
              <Typography variant="caption" sx={{ opacity: 0.9 }}>
                Manage your company details
              </Typography>
            </Box>
          </Stack>
          
          {!isEditMode ? (
            <Button
              variant="contained"
              startIcon={<EditIcon />}
              onClick={handleEdit}
              sx={{
                bgcolor: 'white',
                color: 'primary.main',
                '&:hover': { bgcolor: alpha(theme.palette.common.white, 0.9) }
              }}
            >
              Edit
            </Button>
          ) : (
            <Stack direction="row" spacing={1}>
              <Button
                variant="contained"
                startIcon={<SaveIcon />}
                onClick={handleSave}
                sx={{
                  bgcolor: 'success.main',
                  '&:hover': { bgcolor: 'success.dark' }
                }}
              >
                Save
              </Button>
              <Button
                variant="outlined"
                startIcon={<CancelIcon />}
                onClick={handleCancel}
                sx={{
                  borderColor: 'white',
                  color: 'white',
                  '&:hover': { bgcolor: alpha(theme.palette.common.white, 0.1) }
                }}
              >
                Cancel
              </Button>
            </Stack>
          )}
        </Stack>
      </Paper>

      {/* Content Grid */}
      <Grid container spacing={2}>
        {/* Basic & Contact Column */}
        <Grid item xs={12} md={6}>
          <Stack spacing={2}>
            {/* Basic Information */}
            <Card sx={{ borderRadius: 2 }}>
              <Box sx={{ p: 1.5, borderBottom: 1, borderColor: 'divider', bgcolor: alpha(fieldConfig.basic.color, 0.05) }}>
                <Typography variant="subtitle2" fontWeight={600} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {fieldConfig.basic.icon}
                  {fieldConfig.basic.title}
                </Typography>
              </Box>
              <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                {Object.entries(fieldConfig.basic.fields).map(([fieldKey, fieldInfo]) =>
                  renderField(fieldKey, fieldInfo, companyInfoData[fieldKey])
                )}
              </CardContent>
            </Card>

            {/* Contact Details */}
            <Card sx={{ borderRadius: 2 }}>
              <Box sx={{ p: 1.5, borderBottom: 1, borderColor: 'divider', bgcolor: alpha(fieldConfig.contact.color, 0.05) }}>
                <Typography variant="subtitle2" fontWeight={600} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {fieldConfig.contact.icon}
                  {fieldConfig.contact.title}
                </Typography>
              </Box>
              <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                {Object.entries(fieldConfig.contact.fields).map(([fieldKey, fieldInfo]) =>
                  renderField(fieldKey, fieldInfo, companyInfoData[fieldKey])
                )}
              </CardContent>
            </Card>
          </Stack>
        </Grid>

        {/* Address Column */}
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 2, height: '100%' }}>
            <Box sx={{ p: 1.5, borderBottom: 1, borderColor: 'divider', bgcolor: alpha(fieldConfig.address.color, 0.05) }}>
              <Typography variant="subtitle2" fontWeight={600} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {fieldConfig.address.icon}
                {fieldConfig.address.title}
              </Typography>
            </Box>
            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
              {Object.entries(fieldConfig.address.fields).map(([fieldKey, fieldInfo]) =>
                renderField(fieldKey, fieldInfo, companyInfoData[fieldKey])
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
          icon={<CheckCircleIcon />}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CompanyDetails;