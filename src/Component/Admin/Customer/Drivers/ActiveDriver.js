import React, { useState, useContext, useEffect } from "react";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  IconButton, Menu, MenuItem, Paper, Dialog, DialogTitle, DialogContent,
  DialogActions, Button, Typography, Box, TextField, useMediaQuery,
  Card, CardContent, Avatar, Chip, Stack, Grid, InputAdornment,
  Alert, Divider, ListItemIcon, ListItemText, Tooltip, Zoom, FormControl,
  InputLabel, Select
} from "@mui/material";
import { useTheme, alpha } from "@mui/material/styles";

// Icons
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import BadgeIcon from "@mui/icons-material/Badge";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import WarningIcon from "@mui/icons-material/Warning";
import CloseIcon from "@mui/icons-material/Close";
import BusinessIcon from "@mui/icons-material/Business";

import CustomerContext from "../../../../Context/Admin/Customer/CustomerContext";
import DriverContext from "../../../../Context/Admin/Customer/Driver/DriverContext";
import axios from "axios";

const normalizePhoneNumber = require("../../../Utils/normalizePhone");
const API_URL = process.env.REACT_APP_API_URL;

// Utility function to format date as MM/DD/YYYY
const formatDate = (dateStr) => {
  if (!dateStr) return "—";
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(date);
};

function ActiveDriver() {
  const { userDetails, currentId, getSingleUserData } = useContext(CustomerContext);
  const { updateDriver, deleteDriver } = useContext(DriverContext);
  const [drivers, setDrivers] = useState([]);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [changeCompanyOpen, setChangeCompanyOpen] = useState(false);
  const [editedDriver, setEditedDriver] = useState(null);
  const [allCompanies, setAllCompanies] = useState([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  
  const theme = useTheme();
  const isTablet = useMediaQuery("(max-width:1200px)");
  const isMobile = useMediaQuery("(max-width:600px)");

  // Fetch companies on open modal
  const fetchCompanies = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/admin/allCompany`);
      const filtered = data?.data?.filter(c => c._id !== currentId);
      setAllCompanies(filtered || []);
    } catch (err) {
      setAllCompanies([]);
    }
  };

  useEffect(() => {
    if (userDetails?.drivers) {
      const activeDrivers = userDetails.drivers.filter(
        driver => !driver.isDeleted && driver.isActive === true
      );
      setDrivers(activeDrivers);
    }
  }, [userDetails]);

  const handleMenuOpen = (event, driver) => {
    setMenuAnchor(event.currentTarget);
    setSelectedDriver(driver);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
  };

  const handleEditOpen = () => {
    setEditedDriver({ ...selectedDriver });
    setEditOpen(true);
    setErrors({});
    handleMenuClose();
  };

  const handleDeleteOpen = () => {
    setDeleteOpen(true);
    handleMenuClose();
  };

  const handleViewOpen = () => {
    setViewOpen(true);
    handleMenuClose();
  };

  const handleChangeCompanyOpen = async () => {
    await fetchCompanies();
    setSelectedCompanyId("");
    setChangeCompanyOpen(true);
    handleMenuClose();
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (editedDriver.email && !/\S+@\S+\.\S+/.test(editedDriver.email)) {
      newErrors.email = "Please enter a valid email format";
    }
    if (!editedDriver.phone || !/^\d{10}$/.test(editedDriver.phone.replace(/\D/g, ''))) {
      newErrors.phone = "Valid 10-digit phone number is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    
    if (name === "phone") {
      const phoneValue = value.replace(/\D/g, '').slice(0, 10);
      setEditedDriver({ ...editedDriver, [name]: phoneValue });
    } else {
      setEditedDriver({ ...editedDriver, [name]: value });
    }
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleSaveEdit = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      await updateDriver(editedDriver, currentId);
      getSingleUserData(currentId);
      setEditOpen(false);
    } catch (error) {
      console.error("Error updating driver:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDriver = async () => {
    setLoading(true);
    try {
      await deleteDriver(selectedDriver, currentId);
      getSingleUserData(currentId);
      setDeleteOpen(false);
    } catch (error) {
      console.error("Error deleting driver:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChangeCompanySubmit = async () => {
    if (!selectedCompanyId) return;
    
    setLoading(true);
    try {
      await axios.post(`${API_URL}/admin/changeDriverCompany`, {
        driverId: selectedDriver._id,
        newCompanyId: selectedCompanyId,
      });
      getSingleUserData(currentId);
      setChangeCompanyOpen(false);
    } catch (error) {
      console.error("Error changing company:", error);
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (firstName, lastName) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
  };

  const formatPhoneDisplay = (phone) => {
    if (!phone) return phone;
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 10) {
      return `(${cleaned.slice(0,3)}) ${cleaned.slice(3,6)}-${cleaned.slice(6)}`;
    }
    return phone;
  };

  const formatLicenseNumber = (licenseNumber) => {
    if (!licenseNumber) return "—";
    const str = String(licenseNumber);
    if (str.length <= 4) return str;
    const last4 = str.slice(-4);
    const maskedPortion = '*'.repeat(Math.max(0, str.length - 4));
    return `${maskedPortion}${last4}`;
  };

  if (drivers.length === 0) {
    return (
      <Card sx={{ borderRadius: 3, border: '1px dashed', borderColor: 'divider' }}>
        <CardContent sx={{ textAlign: 'center', py: 6 }}>
          <Avatar sx={{ width: 64, height: 64, mx: 'auto', mb: 2, bgcolor: alpha(theme.palette.primary.main, 0.1) }}>
            <PersonIcon sx={{ fontSize: 32, color: 'primary.main' }} />
          </Avatar>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No Active Employees
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Click "Add Employee" to get started
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <TableContainer component={Paper} sx={{ borderRadius: 3, border: 1, borderColor: 'divider', overflowX: 'auto' }}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1) }}>
              <TableCell sx={{ color: 'primary.main', fontWeight: 700, fontSize: '0.875rem' }}>#</TableCell>
              <TableCell sx={{ color: 'primary.main', fontWeight: 700, fontSize: '0.875rem' }}>Employee</TableCell>
              {!isMobile && <TableCell sx={{ color: 'primary.main', fontWeight: 700, fontSize: '0.875rem' }}>Email</TableCell>}
              {!isTablet && <TableCell sx={{ color: 'primary.main', fontWeight: 700, fontSize: '0.875rem' }}>License #</TableCell>}
              {!isTablet && <TableCell sx={{ color: 'primary.main', fontWeight: 700, fontSize: '0.875rem' }}>DOB</TableCell>}
              {!isTablet && <TableCell sx={{ color: 'primary.main', fontWeight: 700, fontSize: '0.875rem' }}>Phone</TableCell>}
              {!isTablet && <TableCell sx={{ color: 'primary.main', fontWeight: 700, fontSize: '0.875rem' }}>Created By</TableCell>}
              <TableCell sx={{ color: 'primary.main', fontWeight: 700, fontSize: '0.875rem', textAlign: 'center' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {drivers.map((driver, index) => (
              <TableRow 
                key={index} 
                hover 
                sx={{ 
                  '&:hover': { 
                    bgcolor: alpha(theme.palette.primary.main, 0.04) 
                  } 
                }}
              >
                <TableCell>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.secondary' }}>
                    {index + 1}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar 
                      sx={{ 
                        width: 40, 
                        height: 40, 
                        bgcolor: theme.palette.primary.main,
                        fontSize: '0.875rem',
                        fontWeight: 600
                      }}
                    >
                      {getInitials(driver.first_name, driver.last_name)}
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, lineHeight: 1.2 }}>
                        {driver.first_name} {driver.last_name}
                      </Typography>
                      <Chip
                        size="small"
                        label="Active"
                        color="success"
                        sx={{ height: 20, fontSize: '0.75rem', mt: 0.5 }}
                        icon={<CheckCircleIcon sx={{ fontSize: '0.75rem !important' }} />}
                      />
                    </Box>
                  </Stack>
                </TableCell>
                {!isMobile && (
                  <TableCell>
                    <Typography variant="body2">{driver.email || "N/A"}</Typography>
                  </TableCell>
                )}
                {!isTablet && (
                  <TableCell>
                    <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                      {formatLicenseNumber(driver.government_id)}
                    </Typography>
                  </TableCell>
                )}
                {!isTablet && (
                  <TableCell>
                    <Typography variant="body2">{formatDate(driver.dob)}</Typography>
                  </TableCell>
                )}
                {!isTablet && (
                  <TableCell>
                    <Typography variant="body2">{normalizePhoneNumber(driver.phone) || "N/A"}</Typography>
                  </TableCell>
                )}
                {!isTablet && (
                  <TableCell>
                    <Typography variant="body2">{driver.createdBy}</Typography>
                  </TableCell>
                )}
                <TableCell align="center">
                  <Tooltip title="Actions" TransitionComponent={Zoom}>
                    <IconButton 
                      onClick={(event) => handleMenuOpen(event, driver)}
                      sx={{ 
                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                        '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.2) }
                      }}
                    >
                      <MoreVertIcon />
                    </IconButton>
                  </Tooltip>
                  <Menu 
                    anchorEl={menuAnchor} 
                    open={Boolean(menuAnchor)} 
                    onClose={handleMenuClose}
                    PaperProps={{
                      sx: {
                        borderRadius: 2,
                        mt: 1,
                        minWidth: 200
                      }
                    }}
                  >
                    <MenuItem onClick={handleEditOpen} sx={{ py: 1.5 }}>
                      <ListItemIcon><EditIcon color="primary" /></ListItemIcon>
                      <ListItemText primary="Edit" />
                    </MenuItem>
                    <MenuItem onClick={handleViewOpen} sx={{ py: 1.5 }}>
                      <ListItemIcon><VisibilityIcon color="info" /></ListItemIcon>
                      <ListItemText primary="View Details" />
                    </MenuItem>
                    <MenuItem onClick={handleChangeCompanyOpen} sx={{ py: 1.5 }}>
                      <ListItemIcon><SwapHorizIcon color="success" /></ListItemIcon>
                      <ListItemText primary="Change Company" />
                    </MenuItem>
                    <Divider />
                    <MenuItem onClick={handleDeleteOpen} sx={{ py: 1.5, color: 'error.main' }}>
                      <ListItemIcon><DeleteIcon color="error" /></ListItemIcon>
                      <ListItemText primary="Delete" />
                    </MenuItem>
                  </Menu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Edit Modal */}
      <Dialog 
        open={editOpen} 
        onClose={() => setEditOpen(false)}
        maxWidth="sm"
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
              Edit Employee
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9, mt: 0.5 }}>
              Update employee information
            </Typography>
          </Box>
          <IconButton
            onClick={() => setEditOpen(false)}
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
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="First Name"
                name="first_name"
                value={editedDriver?.first_name || ""}
                onChange={handleEditChange}
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
                name="last_name"
                value={editedDriver?.last_name || ""}
                onChange={handleEditChange}
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
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={editedDriver?.email || ""}
                onChange={handleEditChange}
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
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="License Number"
                name="government_id"
                value={editedDriver?.government_id || ""}
                onChange={handleEditChange}
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
                value={editedDriver?.dob?.split('T')[0] || ""}
                onChange={handleEditChange}
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
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Phone Number"
                name="phone"
                value={formatPhoneDisplay(editedDriver?.phone || "")}
                onChange={handleEditChange}
                error={!!errors.phone}
                helperText={errors.phone}
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
            <Alert severity="error" sx={{ mt: 3, borderRadius: 2 }}>
              Please fix the errors above to continue
            </Alert>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Stack direction="row" spacing={2} width="100%">
            <Button
              onClick={() => setEditOpen(false)}
              variant="outlined"
              sx={{ flex: 1, borderRadius: 2, py: 1.5, textTransform: 'none', fontWeight: 600 }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveEdit}
              variant="contained"
              disabled={loading}
              sx={{ flex: 1, borderRadius: 2, py: 1.5, textTransform: 'none', fontWeight: 600 }}
            >
              {loading ? 'Updating...' : 'Update Employee'}
            </Button>
          </Stack>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog 
        open={deleteOpen} 
        onClose={() => setDeleteOpen(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ pb: 2 }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar sx={{ bgcolor: 'error.light', color: 'error.dark' }}>
              <WarningIcon />
            </Avatar>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>Delete Employee</Typography>
              <Typography variant="body2" color="text.secondary">This action cannot be undone</Typography>
            </Box>
          </Stack>
        </DialogTitle>
        
        <DialogContent>
          <Alert severity="warning" sx={{ borderRadius: 2 }}>
            Are you sure you want to delete <strong>{selectedDriver?.first_name} {selectedDriver?.last_name}</strong>? 
            This will move them to the deleted employees section.
          </Alert>
        </DialogContent>
        
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Stack direction="row" spacing={2} width="100%">
            <Button
              onClick={() => setDeleteOpen(false)}
              variant="outlined"
              sx={{ flex: 1, borderRadius: 2, py: 1.5, textTransform: 'none', fontWeight: 600 }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeleteDriver}
              variant="contained"
              color="error"
              disabled={loading}
              sx={{ flex: 1, borderRadius: 2, py: 1.5, textTransform: 'none', fontWeight: 600 }}
            >
              {loading ? 'Deleting...' : 'Delete Employee'}
            </Button>
          </Stack>
        </DialogActions>
      </Dialog>

      {/* View Details Modal */}
      <Dialog 
        open={viewOpen} 
        onClose={() => setViewOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle
          sx={{
            p: 0,
            background: `linear-gradient(135deg, ${theme.palette.info.main} 0%, ${theme.palette.info.dark} 100%)`,
            color: 'white',
            position: 'relative'
          }}
        >
          <Box sx={{ p: 3, pr: 6 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
              <VisibilityIcon />
              Employee Details
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9, mt: 0.5 }}>
              Complete employee information
            </Typography>
          </Box>
          <IconButton
            onClick={() => setViewOpen(false)}
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

        <DialogContent sx={{ p: 0 }}>
          <Card elevation={0}>
            <CardContent sx={{ p: 3 }}>
              <Stack spacing={3}>
                {/* Employee Header */}
                <Stack direction="row" spacing={3} alignItems="center">
                  <Avatar 
                    sx={{ 
                      width: 64, 
                      height: 64, 
                      bgcolor: theme.palette.primary.main,
                      fontSize: '1.5rem',
                      fontWeight: 600
                    }}
                  >
                    {getInitials(selectedDriver?.first_name, selectedDriver?.last_name)}
                  </Avatar>
                  <Box>
                    <Typography variant="h5" sx={{ fontWeight: 600, mb: 0.5 }}>
                      {selectedDriver?.first_name} {selectedDriver?.last_name}
                    </Typography>
                    <Chip
                      label="Active Employee"
                      color="success"
                      icon={<CheckCircleIcon />}
                      sx={{ fontWeight: 500 }}
                    />
                  </Box>
                </Stack>

                <Divider />

                {/* Details Grid */}
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <Stack spacing={0.5}>
                      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                        Email Address
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {selectedDriver?.email}
                      </Typography>
                    </Stack>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Stack spacing={0.5}>
                      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                        Phone Number
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {normalizePhoneNumber(selectedDriver?.phone)}
                      </Typography>
                    </Stack>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Stack spacing={0.5}>
                      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                        License Number
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600, fontFamily: 'monospace' }}>
                        {selectedDriver?.government_id}
                      </Typography>
                    </Stack>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Stack spacing={0.5}>
                      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                        Date of Birth
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {formatDate(selectedDriver?.dob)}
                      </Typography>
                    </Stack>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Stack spacing={0.5}>
                      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                        Creation Date
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {formatDate(selectedDriver?.creationDate)}
                      </Typography>
                    </Stack>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Stack spacing={0.5}>
                      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                        Created By
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {selectedDriver?.createdBy || "—"}
                      </Typography>
                    </Stack>
                  </Grid>
                </Grid>
              </Stack>
            </CardContent>
          </Card>
        </DialogContent>

        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button
            onClick={() => setViewOpen(false)}
            variant="contained"
            fullWidth
            sx={{ borderRadius: 2, py: 1.5, textTransform: 'none', fontWeight: 600 }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Change Company Modal */}
      <Dialog 
        open={changeCompanyOpen} 
        onClose={() => setChangeCompanyOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle
          sx={{
            p: 0,
            background: `linear-gradient(135deg, ${theme.palette.success.main} 0%, ${theme.palette.success.dark} 100%)`,
            color: 'white',
            position: 'relative'
          }}
        >
          <Box sx={{ p: 3, pr: 6 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
              <SwapHorizIcon />
              Change Employee's Company
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9, mt: 0.5 }}>
              Transfer {selectedDriver?.first_name} {selectedDriver?.last_name} to a different company
            </Typography>
          </Box>
          <IconButton
            onClick={() => setChangeCompanyOpen(false)}
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
          <Box sx={{ mb: 3 }}>
            <Alert severity="info" sx={{ borderRadius: 2 }}>
              <Typography variant="body2">
                This will transfer the employee to the selected company. The employee will no longer appear in your company's roster.
              </Typography>
            </Alert>
          </Box>

          <FormControl fullWidth>
            <InputLabel>Select New Company</InputLabel>
            <Select
              label="Select New Company"
              value={selectedCompanyId}
              onChange={e => setSelectedCompanyId(e.target.value)}
              startAdornment={
                <InputAdornment position="start">
                  <BusinessIcon />
                </InputAdornment>
              }
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            >
              {allCompanies.map(company => (
                <MenuItem value={company._id} key={company._id}>
                  <Stack spacing={0.5}>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {company.companyName}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      ID: {company._id}
                    </Typography>
                  </Stack>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>

        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Stack direction="row" spacing={2} width="100%">
            <Button
              onClick={() => setChangeCompanyOpen(false)}
              variant="outlined"
              sx={{ flex: 1, borderRadius: 2, py: 1.5, textTransform: 'none', fontWeight: 600 }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleChangeCompanySubmit}
              variant="contained"
              color="success"
              disabled={!selectedCompanyId || loading}
              sx={{ flex: 1, borderRadius: 2, py: 1.5, textTransform: 'none', fontWeight: 600 }}
            >
              {loading ? 'Transferring...' : 'Change Company'}
            </Button>
          </Stack>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default ActiveDriver;
