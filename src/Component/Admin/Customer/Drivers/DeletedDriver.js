import React, { useState, useEffect, useContext } from "react";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton,
  Menu, MenuItem, Paper, Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Typography, Box, useMediaQuery, Card, CardContent, Avatar,
  Chip, Stack, Grid, ListItemIcon, ListItemText, Tooltip, Zoom, Divider,
  Alert
} from "@mui/material";
import { useTheme, alpha } from "@mui/material/styles";

// Icons
import MoreVertIcon from "@mui/icons-material/MoreVert";
import VisibilityIcon from "@mui/icons-material/Visibility";
import PersonOffIcon from "@mui/icons-material/PersonOff";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import CloseIcon from "@mui/icons-material/Close";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import BadgeIcon from "@mui/icons-material/Badge";
import CakeIcon from "@mui/icons-material/Cake";
import PersonIcon from "@mui/icons-material/Person";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import WarningIcon from "@mui/icons-material/Warning";

import CustomerContext from "../../../../Context/Admin/Customer/CustomerContext";
import DriverContext from "../../../../Context/Admin/Customer/Driver/DriverContext";
const normalizePhoneNumber = require("../../../Utils/normalizePhone");

function DeletedDriver() {
  const { userDetails, currentId, getSingleUserData } = useContext(CustomerContext);
  const { permanentlyDeleteDriver } = useContext(DriverContext);
  const [drivers, setDrivers] = useState([]);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [viewOpen, setViewOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const theme = useTheme();
  const isTablet = useMediaQuery("(max-width:1200px)");
  const isMobile = useMediaQuery("(max-width:600px)");

  useEffect(() => {
    if (userDetails?.drivers) {
      const deletedDrivers = userDetails.drivers.filter(driver => driver.isDeleted);
      setDrivers(deletedDrivers);
    }
  }, [userDetails]);

  const handleMenuOpen = (event, driver) => {
    setMenuAnchor(event.currentTarget);
    setSelectedDriver(driver);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
  };

  const handleViewOpen = () => {
    setViewOpen(true);
    handleMenuClose();
  };

  const handleDeleteOpen = () => {
    setDeleteOpen(true);
    handleMenuClose();
  };

  const handleDeleteDriver = async () => {
    setLoading(true);
    try {
      await permanentlyDeleteDriver(selectedDriver);
      await getSingleUserData(currentId);
      setDeleteOpen(false);
    } catch (error) {
      console.error("Error permanently deleting driver:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "—";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit"
    });
  };

  const getInitials = (firstName, lastName) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
  };

  const getDaysSinceDeletion = (deletionDate) => {
    if (!deletionDate) return null;
    const today = new Date();
    const deleted = new Date(deletionDate);
    const diffTime = Math.abs(today - deleted);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getTimeAgoText = (deletionDate) => {
    const days = getDaysSinceDeletion(deletionDate);
    if (days === null) return "";
    if (days === 0) return "Today";
    if (days === 1) return "Yesterday";
    if (days < 30) return `${days} days ago`;
    if (days < 365) return `${Math.floor(days / 30)} months ago`;
    return `${Math.floor(days / 365)} years ago`;
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
          <Avatar sx={{ width: 64, height: 64, mx: 'auto', mb: 2, bgcolor: alpha(theme.palette.error.main, 0.1) }}>
            <PersonOffIcon sx={{ fontSize: 32, color: 'error.main' }} />
          </Avatar>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No Deleted Employees
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Deleted employees will appear here
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
            <TableRow sx={{ bgcolor: alpha(theme.palette.error.main, 0.1) }}>
              <TableCell sx={{ color: 'error.main', fontWeight: 700, fontSize: '0.875rem' }}>#</TableCell>
              <TableCell sx={{ color: 'error.main', fontWeight: 700, fontSize: '0.875rem' }}>Employee</TableCell>
              {!isMobile && <TableCell sx={{ color: 'error.main', fontWeight: 700, fontSize: '0.875rem' }}>Email</TableCell>}
              {!isTablet && <TableCell sx={{ color: 'error.main', fontWeight: 700, fontSize: '0.875rem' }}>License #</TableCell>}
              {!isTablet && <TableCell sx={{ color: 'error.main', fontWeight: 700, fontSize: '0.875rem' }}>DOB</TableCell>}
              {!isTablet && <TableCell sx={{ color: 'error.main', fontWeight: 700, fontSize: '0.875rem' }}>Phone</TableCell>}
              {!isMobile && <TableCell sx={{ color: 'error.main', fontWeight: 700, fontSize: '0.875rem' }}>Deleted</TableCell>}
              <TableCell sx={{ color: 'error.main', fontWeight: 700, fontSize: '0.875rem', textAlign: 'center' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {drivers.map((driver, index) => {
              const daysSinceDeletion = getDaysSinceDeletion(driver.deletionDate);
              
              return (
                <TableRow 
                  key={index} 
                  hover 
                  sx={{ 
                    '&:hover': { 
                      bgcolor: alpha(theme.palette.error.main, 0.04) 
                    },
                    opacity: 0.8
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
                          bgcolor: theme.palette.error.main,
                          fontSize: '0.875rem',
                          fontWeight: 600
                        }}
                      >
                        {getInitials(driver.first_name, driver.last_name)}
                      </Avatar>
                      <Box>
                        <Typography 
                          variant="subtitle2" 
                          sx={{ 
                            fontWeight: 600, 
                            lineHeight: 1.2,
                            textDecoration: 'line-through',
                            color: 'text.secondary'
                          }}
                        >
                          {driver.first_name} {driver.last_name}
                        </Typography>
                        <Chip
                          size="small"
                          label="Deleted"
                          color="error"
                          sx={{ height: 20, fontSize: '0.75rem', mt: 0.5 }}
                          icon={<DeleteForeverIcon sx={{ fontSize: '0.75rem !important' }} />}
                        />
                      </Box>
                    </Stack>
                  </TableCell>
                  {!isMobile && (
                    <TableCell>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        {driver.email}
                      </Typography>
                    </TableCell>
                  )}
                  {!isTablet && (
                    <TableCell>
                      <Typography variant="body2" sx={{ fontFamily: 'monospace', color: 'text.secondary' }}>
                        {formatLicenseNumber(driver.government_id)}
                      </Typography>
                    </TableCell>
                  )}
                  {!isTablet && (
                    <TableCell>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        {formatDate(driver.dob)}
                      </Typography>
                    </TableCell>
                  )}
                  {!isTablet && (
                    <TableCell>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        {normalizePhoneNumber(driver.phone)}
                      </Typography>
                    </TableCell>
                  )}
                  {!isMobile && (
                    <TableCell>
                      <Stack spacing={0.5}>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                          {formatDate(driver.deletionDate)}
                        </Typography>
                        {daysSinceDeletion !== null && (
                          <Typography variant="caption" sx={{ color: 'error.main', fontWeight: 500 }}>
                            {getTimeAgoText(driver.deletionDate)}
                          </Typography>
                        )}
                      </Stack>
                    </TableCell>
                  )}
                  <TableCell align="center">
                    <Tooltip title="Actions" TransitionComponent={Zoom}>
                      <IconButton 
                        onClick={(event) => handleMenuOpen(event, driver)}
                        sx={{ 
                          bgcolor: alpha(theme.palette.error.main, 0.1),
                          '&:hover': { bgcolor: alpha(theme.palette.error.main, 0.2) }
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
                      <MenuItem onClick={handleViewOpen} sx={{ py: 1.5 }}>
                        <ListItemIcon><VisibilityIcon color="info" /></ListItemIcon>
                        <ListItemText primary="View Details" />
                      </MenuItem>
                      <Divider />
                      <MenuItem onClick={handleDeleteOpen} sx={{ py: 1.5, color: 'error.main' }}>
                        <ListItemIcon><DeleteForeverIcon color="error" /></ListItemIcon>
                        <ListItemText primary="Permanently Delete" />
                      </MenuItem>
                    </Menu>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

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
            background: `linear-gradient(135deg, ${theme.palette.error.main} 0%, ${theme.palette.error.dark} 100%)`,
            color: 'white',
            position: 'relative'
          }}
        >
          <Box sx={{ p: 3, pr: 6 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
              <PersonOffIcon />
              Deleted Employee Details
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9, mt: 0.5 }}>
              Complete information for deleted employee
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
                      width: 80, 
                      height: 80, 
                      bgcolor: theme.palette.error.main,
                      fontSize: '1.75rem',
                      fontWeight: 600,
                      border: `3px solid ${alpha(theme.palette.error.main, 0.1)}`
                    }}
                  >
                    {getInitials(selectedDriver?.first_name, selectedDriver?.last_name)}
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Typography 
                      variant="h4" 
                      sx={{ 
                        fontWeight: 700, 
                        mb: 1,
                        textDecoration: 'line-through',
                        color: 'text.secondary'
                      }}
                    >
                      {selectedDriver?.first_name} {selectedDriver?.last_name}
                    </Typography>
                    <Stack direction="row" spacing={1} flexWrap="wrap">
                      <Chip
                        label="Deleted Employee"
                        color="error"
                        icon={<DeleteForeverIcon />}
                        sx={{ fontWeight: 600, fontSize: '0.875rem' }}
                      />
                      <Chip
                        label={getTimeAgoText(selectedDriver?.deletionDate)}
                        variant="outlined"
                        color="error"
                        icon={<AccessTimeIcon />}
                        sx={{ fontWeight: 500, fontSize: '0.875rem' }}
                      />
                    </Stack>
                  </Box>
                </Stack>

                <Divider />

                {/* Personal Information */}
                <Box>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: 'primary.main', display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PersonIcon />
                    Personal Information
                  </Typography>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <Stack spacing={1}>
                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500, textTransform: 'uppercase', letterSpacing: 0.5, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <EmailIcon sx={{ fontSize: '1rem' }} />
                          Email Address
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 600, color: 'text.primary' }}>
                          {selectedDriver?.email || "—"}
                        </Typography>
                      </Stack>
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                      <Stack spacing={1}>
                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500, textTransform: 'uppercase', letterSpacing: 0.5, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <PhoneIcon sx={{ fontSize: '1rem' }} />
                          Phone Number
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 600, color: 'text.primary' }}>
                          {normalizePhoneNumber(selectedDriver?.phone) || "—"}
                        </Typography>
                      </Stack>
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                      <Stack spacing={1}>
                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500, textTransform: 'uppercase', letterSpacing: 0.5, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <BadgeIcon sx={{ fontSize: '1rem' }} />
                          License Number
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 600, fontFamily: 'monospace', color: 'text.primary' }}>
                          {selectedDriver?.government_id || "—"}
                        </Typography>
                      </Stack>
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                      <Stack spacing={1}>
                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500, textTransform: 'uppercase', letterSpacing: 0.5, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <CakeIcon sx={{ fontSize: '1rem' }} />
                          Date of Birth
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 600, color: 'text.primary' }}>
                          {formatDate(selectedDriver?.dob)}
                        </Typography>
                      </Stack>
                    </Grid>
                  </Grid>
                </Box>

                <Divider />

                {/* Employment History */}
                <Box>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: 'primary.main', display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CalendarTodayIcon />
                    Employment History
                  </Typography>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <Stack spacing={1}>
                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                          Creation Date
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 600, color: 'text.primary' }}>
                          {formatDate(selectedDriver?.creationDate)}
                        </Typography>
                      </Stack>
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                      <Stack spacing={1}>
                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                          Created By
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 600, color: 'text.primary' }}>
                          {selectedDriver?.createdBy || "—"}
                        </Typography>
                      </Stack>
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                      <Stack spacing={1}>
                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                          Deleted By
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 600, color: 'text.primary' }}>
                          {selectedDriver?.deletedBy || "—"}
                        </Typography>
                      </Stack>
                    </Grid>
                  </Grid>
                </Box>

                {/* Deletion Information */}
                <Box sx={{ bgcolor: alpha(theme.palette.error.main, 0.05), p: 3, borderRadius: 2, border: `1px solid ${alpha(theme.palette.error.main, 0.2)}` }}>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: 'error.main', display: 'flex', alignItems: 'center', gap: 1 }}>
                    <DeleteForeverIcon />
                    Deletion Information
                  </Typography>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <Stack spacing={1}>
                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                          Deletion Date
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 600, color: 'text.primary' }}>
                          {formatDate(selectedDriver?.deletionDate)}
                        </Typography>
                      </Stack>
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                      <Stack spacing={1}>
                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                          Time Since Deletion
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 600, color: 'error.main' }}>
                          {getTimeAgoText(selectedDriver?.deletionDate)} ({getDaysSinceDeletion(selectedDriver?.deletionDate) || 0} days)
                        </Typography>
                      </Stack>
                    </Grid>
                  </Grid>
                </Box>
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

      {/* Permanent Delete Confirmation Modal */}
      <Dialog 
        open={deleteOpen} 
        onClose={() => setDeleteOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ pb: 2 }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar sx={{ bgcolor: 'error.light', color: 'error.dark' }}>
              <WarningIcon />
            </Avatar>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>Permanently Delete Employee</Typography>
              <Typography variant="body2" color="text.secondary">This action cannot be undone</Typography>
            </Box>
          </Stack>
        </DialogTitle>
        
        <DialogContent>
          <Alert severity="error" sx={{ borderRadius: 2, mb: 2 }}>
            <Typography variant="body1" sx={{ fontWeight: 600, mb: 1 }}>
              ⚠️ PERMANENT DELETION WARNING
            </Typography>
            <Typography variant="body2">
              You are about to permanently delete <strong>{selectedDriver?.first_name} {selectedDriver?.last_name}</strong> 
              from the system. This will completely remove all their data and cannot be recovered.
            </Typography>
          </Alert>
          
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            This action will:
          </Typography>
          <Box component="ul" sx={{ mt: 1, pl: 2 }}>
            <Typography component="li" variant="body2" color="text.secondary">Remove all employee records permanently</Typography>
            <Typography component="li" variant="body2" color="text.secondary">Delete associated data and history</Typography>
            <Typography component="li" variant="body2" color="text.secondary">Cannot be undone or recovered</Typography>
          </Box>
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
              {loading ? 'Deleting...' : 'Permanently Delete'}
            </Button>
          </Stack>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default DeletedDriver;