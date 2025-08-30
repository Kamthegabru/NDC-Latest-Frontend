import React, { useContext, useEffect, useState } from "react";
import {
  Card,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Box,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Chip,
  OutlinedInput,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Grid,
  Paper,
  Avatar,
  Stack,
  Alert,
  Snackbar,
  InputAdornment,
  CardContent,
  useMediaQuery,
  CircularProgress,
  IconButton,
  Tooltip
} from "@mui/material";
import { useTheme, alpha } from "@mui/material/styles";
import {
  Business as BusinessIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Apartment as ApartmentIcon,
  Code as CodeIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Add as AddIcon
} from "@mui/icons-material";

import AgencyContext from "../../../Context/Admin/Agency/AgencyContext";
import axios from "axios";
import { toast } from "react-toastify";

const API_URL = process.env.REACT_APP_API_URL;
const normalizePhoneNumber = require("../../Utils/normalizePhone");

// Field configurations
const fieldConfig = {
  basic: {
    title: "Agency Information",
    icon: <ApartmentIcon />,
    color: "#1976d2",
    fields: {
      agencyName: { label: "Agency Name", icon: <ApartmentIcon />, required: true },
      agencyCode: { label: "Agency Code", icon: <CodeIcon /> },
    }
  },
  contact: {
    title: "Contact Details",
    icon: <PhoneIcon />,
    color: "#2e7d32",
    fields: {
      agencyEmail: { label: "Email", icon: <EmailIcon />, type: "email" },
      agencyContactNumber: { label: "Phone", icon: <PhoneIcon />, type: "tel" },
    }
  }
};

const CompanyDetails = () => {
  const { agencyDetails, updateAgencyInformation } = useContext(AgencyContext);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState(null);
  const [unhandledCompanies, setUnhandledCompanies] = useState([]);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [contactNumberError, setContactNumberError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    if (agencyDetails) {
      setFormData({
        agencyName: agencyDetails.agencyName || "",
        agencyEmail: agencyDetails.agencyEmail || "",
        agencyContactNumber: agencyDetails.agencyContactNumber || "",
        agencyCode: agencyDetails.agencyCode || "",
        handledCompanies: agencyDetails.handledCompanies || [],
        _id: agencyDetails.id,
      });
      setLoading(false);
    }
  }, [agencyDetails]);

  const fetchUnhandledCompanies = async () => {
    try {
      const response = await axios.get(`${API_URL}/admin/getCompanyList`);
      setUnhandledCompanies(response.data.data || []);
    } catch (err) {
      console.error("Failed to fetch unhandled companies", err);
    }
  };

  const handleEditToggle = () => {
    setEditMode((prev) => !prev);
    if (!editMode) fetchUnhandledCompanies();
  };

  const handleChange = (field) => (event) => {
    const value = event.target.value;
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleHandledCompaniesChange = (event) => {
    const selectedIds = event.target.value;
    const updatedCompanies = selectedIds.map((id) => {
      const fromHandled = formData.handledCompanies.find((c) => c.userId === id);
      const fromUnhandled = unhandledCompanies.find((c) => c.userId === id);
      return fromHandled || fromUnhandled || { userId: id, companyName: "Unknown" };
    });

    setFormData((prev) => ({
      ...prev,
      handledCompanies: updatedCompanies,
    }));
  };

  const handleSave = () => {
    if (formData.agencyContactNumber.length !== 10) {
      setContactNumberError(true);
      return;
    }

    updateAgencyInformation(formData);
    setEditMode(false);
    setSnackbar({ open: true, message: "Agency information updated successfully!", severity: "success" });
  };

  const handleCancel = () => {
    if (agencyDetails) {
      setFormData({
        agencyName: agencyDetails.agencyName || "",
        agencyEmail: agencyDetails.agencyEmail || "",
        agencyContactNumber: agencyDetails.agencyContactNumber || "",
        agencyCode: agencyDetails.agencyCode || "",
        handledCompanies: agencyDetails.handledCompanies || [],
        _id: agencyDetails.id,
      });
    }
    setContactNumberError(false);
    setEditMode(false);
  };

  const handleDeleteClick = () => {
    setOpenDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await axios.post(`${API_URL}/admin/deleteAgency`, {
        data: { id: formData._id }
      });
      toast.success("Agency deleted successfully.");
    } catch (error) {
      console.error("Failed to delete agency", error);
      toast.error("Failed to delete agency.");
    } finally {
      setOpenDeleteDialog(false);
    }
  };

  const handleCancelDelete = () => {
    setOpenDeleteDialog(false);
  };

  const formatDisplayValue = (key, value) => {
    if (!value) return "—";
    if (key === "agencyContactNumber") return normalizePhoneNumber(value);
    if (key === "agencyCode") return String(value).toUpperCase();
    return value;
  };

  const renderField = (fieldKey, fieldInfo, value) => {
    return (
      <Box key={fieldKey} sx={{ mb: 1.5 }}>
        {editMode ? (
          <TextField
            fullWidth
            size="small"
            label={fieldInfo.label}
            value={formData[fieldKey] || ""}
            variant="outlined"
            type={fieldInfo.type || 'text'}
            error={fieldKey === 'agencyContactNumber' && contactNumberError}
            helperText={
              fieldKey === 'agencyContactNumber' && contactNumberError
                ? "Contact number must be exactly 10 digits."
                : ""
            }
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  {fieldInfo.icon}
                </InputAdornment>
              ),
            }}
            inputProps={
              fieldKey === 'agencyContactNumber' 
                ? {
                    maxLength: 10,
                    inputMode: "numeric",
                    pattern: "[0-9]*",
                  }
                : {}
            }
            onChange={(e) => {
              if (fieldKey === 'agencyContactNumber') {
                const value = e.target.value;
                if (/^\d{0,10}$/.test(value)) {
                  setFormData((prev) => ({
                    ...prev,
                    [fieldKey]: value,
                  }));
                  setContactNumberError(value.length > 0 && value.length !== 10);
                }
              } else {
                handleChange(fieldKey)(e);
              }
            }}
          />
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

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 300 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!formData) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 300 }}>
        <Typography>Loading agency details...</Typography>
      </Box>
    );
  }

  const allCompaniesMap = {};
  unhandledCompanies.forEach((c) => (allCompaniesMap[c.userId] = c));
  formData.handledCompanies.forEach((c) => (allCompaniesMap[c.userId] = c));

  const filteredCompanies = formData.handledCompanies.filter((company) =>
    company.companyName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box className="mt-20" sx={{ maxWidth: 900, mx: 'auto' }}>
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
              <ApartmentIcon />
            </Avatar>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Agency Overview
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.9 }}>
                Manage agency details and company assignments
              </Typography>
            </Box>
          </Stack>
          
          {!editMode ? (
            <Stack direction="row" spacing={1}>
              <Button
                variant="contained"
                startIcon={<EditIcon />}
                onClick={handleEditToggle}
                sx={{
                  bgcolor: 'white',
                  color: 'primary.main',
                  '&:hover': { bgcolor: alpha(theme.palette.common.white, 0.9) }
                }}
              >
                Edit
              </Button>
              <Tooltip title="Delete Agency">
                <IconButton
                  onClick={handleDeleteClick}
                  sx={{
                    color: 'white',
                    bgcolor: alpha(theme.palette.error.main, 0.2),
                    '&:hover': { bgcolor: alpha(theme.palette.error.main, 0.3) }
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            </Stack>
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
        {/* Agency Information Column */}
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
                  renderField(fieldKey, fieldInfo, formData[fieldKey])
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
                  renderField(fieldKey, fieldInfo, formData[fieldKey])
                )}
              </CardContent>
            </Card>
          </Stack>
        </Grid>

        {/* Handled Companies Column */}
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 2, height: '100%' }}>
            <Box sx={{ p: 1.5, borderBottom: 1, borderColor: 'divider', bgcolor: alpha('#ed6c02', 0.05) }}>
              <Typography variant="subtitle2" fontWeight={600} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <BusinessIcon />
                Handled Companies ({formData.handledCompanies.length})
              </Typography>
            </Box>
            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
              {/* Search Field - Only in view mode */}
              {!editMode && formData.handledCompanies.length > 0 && (
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Search companies..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ mb: 2 }}
                />
              )}

              {/* Companies List */}
              {formData.handledCompanies.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 3 }}>
                  <BusinessIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
                  <Typography color="text.secondary">
                    No companies assigned yet
                  </Typography>
                </Box>
              ) : (
                <List sx={{ maxHeight: 300, overflow: 'auto' }}>
                  {filteredCompanies.map((company, index) => (
                    <ListItem key={index} disablePadding sx={{ mb: 0.5 }}>
                      <Paper sx={{ width: '100%', p: 1, bgcolor: 'grey.50' }}>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <BusinessIcon sx={{ color: 'primary.main' }} />
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {company.companyName || "Unnamed Company"}
                          </Typography>
                        </Stack>
                      </Paper>
                    </ListItem>
                  ))}
                </List>
              )}

              {/* Add Companies - Only in edit mode */}
              {editMode && (
                <Box sx={{ mt: 2 }}>
                  <FormControl fullWidth>
                    <InputLabel>Add More Companies</InputLabel>
                    <Select
                      multiple
                      value={formData.handledCompanies.map((c) => c.userId)}
                      onChange={handleHandledCompaniesChange}
                      input={<OutlinedInput label="Add More Companies" />}
                      renderValue={(selected) => (
                        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                          {selected.map((id) => (
                            <Chip 
                              key={id} 
                              label={allCompaniesMap[id]?.companyName || id}
                              size="small"
                            />
                          ))}
                        </Box>
                      )}
                    >
                      {unhandledCompanies.map((company) => (
                        <MenuItem key={company.userId} value={company.userId}>
                          {company.companyName}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Delete Confirmation Dialog */}
      <Dialog 
        open={openDeleteDialog} 
        onClose={handleCancelDelete}
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <WarningIcon color="error" />
          Confirm Delete
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this agency? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleCancelDelete} variant="outlined">
            Cancel
          </Button>
          <Button 
            onClick={handleConfirmDelete} 
            color="error" 
            variant="contained"
            startIcon={<DeleteIcon />}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

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