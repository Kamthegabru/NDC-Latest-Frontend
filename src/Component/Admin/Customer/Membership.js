import React, { useState, useContext, useEffect } from "react";
import {
  Box, Card, CardContent, Typography, IconButton, Dialog,
  TextField, Button, Grid, Divider, useMediaQuery, CircularProgress,
  Chip, Avatar, Stack, DialogTitle, DialogContent, DialogActions,
  Paper, Alert, InputAdornment, Tooltip, Zoom
} from "@mui/material";
import { MenuItem, FormControl, InputLabel, Select } from "@mui/material";
import { 
  Edit as EditIcon,
  Close as CloseIcon,
  Business as BusinessIcon,
  CalendarToday as CalendarTodayIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Pending as PendingIcon,
  Inventory as InventoryIcon, // Fixed: Using Inventory instead of Package
  Assignment as AssignmentIcon,
  LocationOn as LocationOnIcon,
  Badge as BadgeIcon,
  AccessTime as AccessTimeIcon
} from "@mui/icons-material";
import { useTheme, alpha } from "@mui/material/styles";
import CustomerContext from "../../../Context/Admin/Customer/CustomerContext";

// Enhanced Label + Value UI block
const DetailItem = ({ label, value, icon, color = "primary" }) => (
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
    <Typography 
      variant="body1" 
      sx={{ 
        fontWeight: 600,
        color: color === "primary" ? 'text.primary' : `${color}.main`
      }}
    >
      {value || "—"}
    </Typography>
  </Stack>
);

const StatusChip = ({ status }) => {
  const getStatusProps = (status) => {
    const statusLower = status?.toLowerCase();
    switch (statusLower) {
      case "active":
        return { color: "success", icon: <CheckCircleIcon /> };
      case "pending":
        return { color: "warning", icon: <PendingIcon /> };
      case "inactive":
        return { color: "error", icon: <ErrorIcon /> };
      default:
        return { color: "default", icon: null };
    }
  };

  const props = getStatusProps(status);
  return (
    <Chip
      label={status || "N/A"}
      color={props.color}
      icon={props.icon}
      sx={{ fontWeight: 600, borderRadius: 2 }}
      size="small"
    />
  );
};

const MembershipInformation = () => {
  const { userDetails, updateMembershipInformation } = useContext(CustomerContext);
  const [open, setOpen] = useState(false);
  const [membershipInfo, setMembershipInfo] = useState({});
  const [tempMembershipInfo, setTempMembershipInfo] = useState({});
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    try {
      const date = new Date(dateStr);
      if (isNaN(date)) return "—";
      return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: '2-digit'
      }).format(date);
    } catch (error) {
      return "—";
    }
  };

  useEffect(() => {
    if (userDetails?.Membership) {
      const mem = userDetails.Membership;
      setMembershipInfo(mem);
      setTempMembershipInfo({
        ...mem,
        planStartDate: mem.planStartDate?.slice(0, 10) || "",
        planEndDate: mem.planEndDate?.slice(0, 10) || "",
        package: mem.package?.map(p => p.package_name) || [],
        order_reason: mem.order_reason?.map(r => r.order_reason_name) || [],
      });
      setLoading(false);
    } else if (userDetails && !userDetails.Membership) {
      // If userDetails exists but no membership, stop loading
      setLoading(false);
    }
  }, [userDetails]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    // Reset temp data on close
    if (membershipInfo && Object.keys(membershipInfo).length > 0) {
      setTempMembershipInfo({
        ...membershipInfo,
        planStartDate: membershipInfo.planStartDate?.slice(0, 10) || "",
        planEndDate: membershipInfo.planEndDate?.slice(0, 10) || "",
        package: membershipInfo.package?.map(p => p.package_name) || [],
        order_reason: membershipInfo.order_reason?.map(r => r.order_reason_name) || [],
      });
    }
  };

  const handleChange = (e) => {
    setTempMembershipInfo({ ...tempMembershipInfo, [e.target.name]: e.target.value });
  };

  const handleRemoveItem = (field, item) => {
    setTempMembershipInfo(prev => ({
      ...prev,
      [field]: prev[field].filter(val => val !== item)
    }));
  };

  const handleUpdate = async () => {
    setUpdating(true);
    try {
      const formattedInfo = {
        ...tempMembershipInfo,
        package: tempMembershipInfo.package.map(name => ({ package_name: name })),
        order_reason: tempMembershipInfo.order_reason.map(name => ({ order_reason_name: name })),
      };
      await updateMembershipInformation(formattedInfo);
      setOpen(false);
    } catch (error) {
      console.error("Error updating membership:", error);
    } finally {
      setUpdating(false);
    }
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
          Loading membership information...
        </Typography>
      </Box>
    );
  }

  if (!membershipInfo || Object.keys(membershipInfo).length === 0) {
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
              <BusinessIcon sx={{ fontSize: 32, color: 'primary.main' }} />
            </Avatar>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No Membership Information
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Membership details will appear here once configured
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
        overflow: 'hidden'
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
            <BusinessIcon />
            Membership Information
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.9 }}>
            Current plan details and configuration
          </Typography>
          
          <Tooltip title="Edit Membership" TransitionComponent={Zoom}>
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
            {/* Plan Overview Section */}
            <Grid item xs={12}>
              <Paper sx={{ 
                p: 3, 
                bgcolor: 'grey.50', 
                border: 1, 
                borderColor: 'divider',
                borderRadius: 2 
              }}>
                <Stack direction="row" spacing={3} alignItems="center" sx={{ mb: 3 }}>
                  <Avatar sx={{ 
                    width: 56, 
                    height: 56, 
                    bgcolor: 'primary.main',
                    fontSize: '1.5rem'
                  }}>
                    {membershipInfo.planName?.charAt(0)?.toUpperCase() || 'M'}
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                      {membershipInfo.planName || "Current Plan"}
                    </Typography>
                    <StatusChip status={membershipInfo.planStatus} />
                  </Box>
                </Stack>
                
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6} md={3}>
                    <DetailItem
                      label="Join Date"
                      value={formatDate(membershipInfo.planStartDate)}
                      icon={<CalendarTodayIcon fontSize="small" />}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <DetailItem
                      label="Renewal Date"
                      value={formatDate(membershipInfo.planEndDate)}
                      icon={<AccessTimeIcon fontSize="small" />}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <DetailItem
                      label="Organization ID"
                      value={membershipInfo.orgId}
                      icon={<BadgeIcon fontSize="small" />}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <DetailItem
                      label="Location Code"
                      value={membershipInfo.locationCode}
                      icon={<LocationOnIcon fontSize="small" />}
                    />
                  </Grid>
                </Grid>
              </Paper>
            </Grid>

            {/* Packages Section */}
            <Grid item xs={12} md={6}>
              <Card elevation={0} sx={{ border: 1, borderColor: 'divider', borderRadius: 2, height: '100%' }}>
                <CardContent sx={{ p: 3 }}>
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
                    <InventoryIcon />
                    Packages
                  </Typography>
                  
                  {membershipInfo.package?.length > 0 ? (
                    <Stack spacing={1}>
                      {membershipInfo.package.map((pkg, index) => (
                        <Chip
                          key={index}
                          label={pkg.package_name}
                          variant="outlined"
                          sx={{ 
                            borderColor: 'primary.main',
                            color: 'primary.main',
                            fontWeight: 600,
                            justifyContent: 'flex-start',
                            '& .MuiChip-label': { px: 2 }
                          }}
                        />
                      ))}
                    </Stack>
                  ) : (
                    <Box sx={{ 
                      textAlign: 'center', 
                      py: 4,
                      color: 'text.secondary'
                    }}>
                      <InventoryIcon sx={{ fontSize: 48, mb: 1, opacity: 0.3 }} />
                      <Typography variant="body2">
                        No packages configured
                      </Typography>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>

            {/* Order Reasons Section */}
            <Grid item xs={12} md={6}>
              <Card elevation={0} sx={{ border: 1, borderColor: 'divider', borderRadius: 2, height: '100%' }}>
                <CardContent sx={{ p: 3 }}>
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
                    <AssignmentIcon />
                    Order Reasons
                  </Typography>
                  
                  {membershipInfo.order_reason?.length > 0 ? (
                    <Stack spacing={1}>
                      {membershipInfo.order_reason.map((reason, index) => (
                        <Chip
                          key={index}
                          label={reason.order_reason_name}
                          variant="outlined"
                          sx={{ 
                            borderColor: 'secondary.main',
                            color: 'secondary.main',
                            fontWeight: 600,
                            justifyContent: 'flex-start',
                            '& .MuiChip-label': { px: 2 }
                          }}
                        />
                      ))}
                    </Stack>
                  ) : (
                    <Box sx={{ 
                      textAlign: 'center', 
                      py: 4,
                      color: 'text.secondary'
                    }}>
                      <AssignmentIcon sx={{ fontSize: 48, mb: 1, opacity: 0.3 }} />
                      <Typography variant="body2">
                        No order reasons configured
                      </Typography>
                    </Box>
                  )}
                </CardContent>
              </Card>
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
              Edit Membership Information
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9, mt: 0.5 }}>
              Update membership details and configuration
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
            {/* Basic Information */}
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: 'primary.main' }}>
                Plan Details
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField 
                name="selectedPlan" 
                fullWidth 
                label="Current Plan" 
                value={tempMembershipInfo.selectedPlan || ""} 
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <BusinessIcon color="action" />
                    </InputAdornment>
                  ),
                }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select 
                  name="planStatus" 
                  value={tempMembershipInfo.planStatus || ""} 
                  onChange={handleChange} 
                  label="Status"
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                >
                  <MenuItem value="Active">
                    <Stack direction="row" spacing={1} alignItems="center">
                      <CheckCircleIcon color="success" />
                      <Typography>Active</Typography>
                    </Stack>
                  </MenuItem>
                  <MenuItem value="Inactive">
                    <Stack direction="row" spacing={1} alignItems="center">
                      <ErrorIcon color="error" />
                      <Typography>Inactive</Typography>
                    </Stack>
                  </MenuItem>
                  <MenuItem value="Pending">
                    <Stack direction="row" spacing={1} alignItems="center">
                      <PendingIcon color="warning" />
                      <Typography>Pending</Typography>
                    </Stack>
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField 
                name="planStartDate" 
                type="date" 
                fullWidth 
                label="Join Date" 
                value={tempMembershipInfo.planStartDate || ""} 
                onChange={handleChange} 
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
                name="planEndDate"
                type="date"
                fullWidth
                label="Renewal Date"
                value={tempMembershipInfo.planEndDate || ""}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                inputProps={{
                  min: tempMembershipInfo.planStartDate || undefined,
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AccessTimeIcon color="action" />
                    </InputAdornment>
                  ),
                }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField 
                name="orgId" 
                fullWidth 
                label="Organization ID" 
                value={tempMembershipInfo.orgId || ""} 
                onChange={handleChange}
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
                name="locationCode" 
                fullWidth 
                label="Location Code" 
                value={tempMembershipInfo.locationCode || ""} 
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LocationOnIcon color="action" />
                    </InputAdornment>
                  ),
                }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
            </Grid>

            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: 'primary.main' }}>
                Package Configuration
              </Typography>
            </Grid>

            {/* Selected Packages Display */}
            {tempMembershipInfo.package?.length > 0 && (
              <Grid item xs={12}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: 'text.secondary' }}>
                  Selected Packages:
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                  {tempMembershipInfo.package.map((item, i) => (
                    <Chip 
                      key={i} 
                      label={item} 
                      onDelete={() => handleRemoveItem("package", item)}
                      color="primary"
                      sx={{ fontWeight: 500 }}
                    />
                  ))}
                </Box>
              </Grid>
            )}

            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Add Packages</InputLabel>
                <Select
                  multiple
                  name="package"
                  label="Add Packages"
                  value={tempMembershipInfo.package || []}
                  onChange={(e) => setTempMembershipInfo({ ...tempMembershipInfo, package: e.target.value })}
                  renderValue={(selected) => `${selected.length} packages selected`}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                >
                  {[
                    "NDCDEMO",
                    "10 PANEL URINE",
                    "5 PANEL URINE DOT LIKE",
                    "7 PANEL URINE",
                    "9 PANEL URINE",
                    "DOT BAT",
                    "DOT PANEL",
                    "DOT PANEL + DOT BAT",
                    "DOT PHYSICAL"
                  ].map(pkg => (
                    <MenuItem key={pkg} value={pkg}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <InventoryIcon fontSize="small" />
                        <Typography>{pkg}</Typography>
                      </Stack>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: 'secondary.main' }}>
                Order Reasons Configuration
              </Typography>
            </Grid>

            {/* Selected Reasons Display */}
            {tempMembershipInfo.order_reason?.length > 0 && (
              <Grid item xs={12}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: 'text.secondary' }}>
                  Selected Reasons:
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                  {tempMembershipInfo.order_reason.map((item, i) => (
                    <Chip 
                      key={i} 
                      label={item} 
                      onDelete={() => handleRemoveItem("order_reason", item)}
                      color="secondary"
                      sx={{ fontWeight: 500 }}
                    />
                  ))}
                </Box>
              </Grid>
            )}

            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Add Order Reasons</InputLabel>
                <Select
                  multiple
                  name="order_reason"
                  label="Add Order Reasons"
                  value={tempMembershipInfo.order_reason || []}
                  onChange={(e) => setTempMembershipInfo({ ...tempMembershipInfo, order_reason: e.target.value })}
                  renderValue={(selected) => `${selected.length} reasons selected`}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                >
                  {[
                    "PRE-EMPLOYMENT", "RANDOM", "POST-ACCIDENT", "REASONABLE SUSPICION/CAUSE",
                    "FOLLOW-UP", "PERIODIC", "ANNUAL", "RETURN TO DUTY", "FITNESS FOR DUTY",
                    "JOB TRANSFER", "PROMOTION", "PRE-SITE ACCESS", "SWEEP", "COURT ORDERED",
                    "CONTRACTUAL", "PROBATION", "OTHER"
                  ].map(reason => (
                    <MenuItem key={reason} value={reason}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <AssignmentIcon fontSize="small" />
                        <Typography>{reason}</Typography>
                      </Stack>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
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
              {updating ? 'Updating...' : 'Update Membership'}
            </Button>
          </Stack>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MembershipInformation;