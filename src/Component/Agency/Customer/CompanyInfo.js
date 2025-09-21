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
import PersonIcon from "@mui/icons-material/Person"; // ✅ NEW

import CustomerContext from "../../../Context/Agency/Customer/CustomerContext";

const normalizePhoneNumber = require("../../Utils/normalizePhone");

// All US States
const stateOptions = [
  { label: "Alabama", value: "AL" }, { label: "Alaska", value: "AK" },
  { label: "Arizona", value: "AZ" }, { label: "Arkansas", value: "AR" },
  { label: "California", value: "CA" }, { label: "Colorado", value: "CO" },
  { label: "Connecticut", value: "CT" }, { label: "Delaware", value: "DE" },
  { label: "Florida", value: "FL" }, { label: "Georgia", value: "GA" },
  { label: "Hawaii", value: "HI" }, { label: "Idaho", value: "ID" },
  { label: "Illinois", value: "IL" }, { label: "Indiana", value: "IN" },
  { label: "Iowa", value: "IA" }, { label: "Kansas", value: "KS" },
  { label: "Kentucky", value: "KY" }, { label: "Louisiana", value: "LA" },
  { label: "Maine", value: "ME" }, { label: "Maryland", value: "MD" },
  { label: "Massachusetts", value: "MA" }, { label: "Michigan", value: "MI" },
  { label: "Minnesota", value: "MN" }, { label: "Mississippi", value: "MS" },
  { label: "Missouri", value: "MO" }, { label: "Montana", value: "MT" },
  { label: "Nebraska", value: "NE" }, { label: "Nevada", value: "NV" },
  { label: "New Hampshire", value: "NH" }, { label: "New Jersey", value: "NJ" },
  { label: "New Mexico", value: "NM" }, { label: "New York", value: "NY" },
  { label: "North Carolina", value: "NC" }, { label: "North Dakota", value: "ND" },
  { label: "Ohio", value: "OH" }, { label: "Oklahoma", value: "OK" },
  { label: "Oregon", value: "OR" }, { label: "Pennsylvania", value: "PA" },
  { label: "Rhode Island", value: "RI" }, { label: "South Carolina", value: "SC" },
  { label: "South Dakota", value: "SD" }, { label: "Tennessee", value: "TN" },
  { label: "Texas", value: "TX" }, { label: "Utah", value: "UT" },
  { label: "Vermont", value: "VT" }, { label: "Virginia", value: "VA" },
  { label: "Washington", value: "WA" }, { label: "West Virginia", value: "WV" },
  { label: "Wisconsin", value: "WI" }, { label: "Wyoming", value: "WY" },
];

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
      firstName: { label: "First Name", icon: <PersonIcon /> },   // ✅ NEW
      lastName: { label: "Last Name", icon: <PersonIcon /> },     // ✅ NEW
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

// Format label with custom USDOT logic
const formatLabel = (key) => {
  if (key.toLowerCase() === "usdot") return "USDOT";
  const label = key.replace(/([A-Z])/g, " $1").trim();
  const [first, ...rest] = label.split(" ");
  return [first.charAt(0).toUpperCase() + first.slice(1), ...rest].join(" ");
};

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
      // ✅ Merge company info + contactInfoData from API
      const company = userDetails.companyInfoData || {};
      const contact = userDetails.contactInfoData || {};
      const merged = {
        ...company,
        firstName: contact.firstName ?? company.firstName ?? "",
        lastName: contact.lastName ?? company.lastName ?? "",
        email: contact.email ?? company.email ?? "",
        contactNumber: contact.phone ?? company.contactNumber ?? "",
      };
      setCompanyInfoData(merged);
      setTempData(merged);
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
    // Validation for numeric fields
    const numericFields = ["zip", "usdot", "suite", "employees"];
    const isContactField = field === "contactNumber";

    if ((numericFields.includes(field) || isContactField) && !/^\d*$/.test(value)) return;
    if (isContactField && value.length > 10) return;

    setTempData({ ...tempData, [field]: value });
  };

  const formatDisplayValue = (key, value) => {
    if (!value) return "—";
    if (key === "contactNumber") return normalizePhoneNumber(value);
    if (key === "state") {
      return stateOptions.find((s) => s.value === value)?.label || value;
    }
    if (key === "usdot") return String(value).toUpperCase();
    return value;
  };

  const isEmailValid = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

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
                  anchorOrigin: { vertical: 'bottom', horizontal: 'left' },
                  transformOrigin: { vertical: 'top', horizontal: 'left' },
                  PaperProps: { style: { maxHeight: 250 } },
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
              {stateOptions.map((state) => (
                <MenuItem key={state.value} value={state.value}>
                  {state.label}
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
              error={
                (fieldKey === "email" && tempData[fieldKey] && !isEmailValid(tempData[fieldKey])) ||
                (fieldKey === "contactNumber" && tempData[fieldKey] && tempData[fieldKey].length > 0 && tempData[fieldKey].length !== 10)
              }
              helperText={
                fieldKey === "email" && tempData[fieldKey] && !isEmailValid(tempData[fieldKey])
                  ? "Enter a valid email address"
                  : fieldKey === "contactNumber" && tempData[fieldKey] && tempData[fieldKey].length > 0 && tempData[fieldKey].length !== 10
                    ? "Contact number must be exactly 10 digits"
                    : ""
              }
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

  // For fields not in the config (fallback for existing fields)
  const renderLegacyField = (fieldKey, value) => {
    return (
      <Box key={fieldKey} sx={{ mb: 1.5 }}>
        {isEditMode ? (
          <TextField
            fullWidth
            size="small"
            label={formatLabel(fieldKey)}
            value={tempData[fieldKey] || ""}
            onChange={(e) => handleFieldChange(fieldKey, e.target.value)}
            variant="outlined"
            type={["zip", "usdot", "suite", "employees"].includes(fieldKey) ? "number" : fieldKey === "contactNumber" ? "tel" : "text"}
          />
        ) : (
          <Stack spacing={0.5}>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>
              {formatLabel(fieldKey)}
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {formatDisplayValue(fieldKey, value)}
            </Typography>
          </Stack>
        )}
      </Box>
    );
  };

  // Get all field keys from config
  const configuredFields = new Set();
  Object.values(fieldConfig).forEach(section => {
    Object.keys(section.fields).forEach(field => configuredFields.add(field));
  });

  // Find any fields that aren't in the config
  const legacyFields = Object.keys(companyInfoData).filter(key => !configuredFields.has(key));

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
          <Stack spacing={2}>
            {/* Address Information */}
            <Card sx={{ borderRadius: 2 }}>
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

            {/* Legacy Fields (if any) */}
            {legacyFields.length > 0 && (
              <Card sx={{ borderRadius: 2 }}>
                <Box sx={{ p: 1.5, borderBottom: 1, borderColor: 'divider', bgcolor: alpha('#9c27b0', 0.05) }}>
                  <Typography variant="subtitle2" fontWeight={600} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <BusinessIcon />
                    Additional Information
                  </Typography>
                </Box>
                <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                  {legacyFields.map(fieldKey =>
                    renderLegacyField(fieldKey, companyInfoData[fieldKey])
                  )}
                </CardContent>
              </Card>
            )}
          </Stack>
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
