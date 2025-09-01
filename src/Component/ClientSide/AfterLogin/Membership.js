import React, { useState, useContext, useEffect } from "react";
import {
  Box, Card, CardContent, Typography, Grid, useMediaQuery, CircularProgress,
  Chip, Avatar, Stack, Paper, Divider, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, IconButton, Menu, MenuItem,
  Dialog, DialogTitle, DialogContent, DialogActions, Button
} from "@mui/material";
import { 
  Business as BusinessIcon,
  CalendarToday as CalendarTodayIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Pending as PendingIcon,
  Inventory as InventoryIcon,
  Assignment as AssignmentIcon,
  LocationOn as LocationOnIcon,
  Badge as BadgeIcon,
  AccessTime as AccessTimeIcon,
  Description as DescriptionIcon,
  MoreVert as MoreVertIcon,
  Visibility as VisibilityIcon
} from "@mui/icons-material";
import { useTheme, alpha } from "@mui/material/styles";
import HomeContext from "../../../Context/ClientSide/AfterLogin/Home/HomeContext";

// Enhanced detail item component
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

// Status chip component
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

const Membership = () => {
  const { userData } = useContext(HomeContext);
  const [membershipInfo, setMembershipInfo] = useState({});
  const [certificate, setCertificate] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewOpen, setViewOpen] = useState(false);
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuIndex, setMenuIndex] = useState(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    if (userData) {
      setMembershipInfo(userData.Membership || {});
      setCertificate(userData.certificates || []);
      setLoading(false);
    }
  }, [userData]);

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return "—";
      return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: '2-digit'
      }).format(date);
    } catch (error) {
      return "—";
    }
  };

  const handleMenuClick = (event, index) => {
    setAnchorEl(event.currentTarget);
    setMenuIndex(index);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuIndex(null);
  };

  const handleViewOpen = (cert) => {
    setSelectedCertificate(cert);
    setViewOpen(true);
    handleMenuClose();
  };

  const handleViewClose = () => {
    setViewOpen(false);
    setSelectedCertificate(null);
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
      {/* Membership Information Card */}
      <Card sx={{ 
        maxWidth: 800, 
        mx: 'auto',
        borderRadius: 3, 
        border: 1, 
        borderColor: 'divider',
        overflow: 'hidden',
        mb: 4
      }}>
        {/* Header with gradient background */}
        <Box sx={{
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
          color: 'white',
          p: 3
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
            Your current plan details and configuration
          </Typography>
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
                      label="Expiry Date"
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
              <Card elevation={0} sx={{ 
                border: 1, 
                borderColor: 'divider', 
                borderRadius: 2, 
                height: '100%' 
              }}>
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
              <Card elevation={0} sx={{ 
                border: 1, 
                borderColor: 'divider', 
                borderRadius: 2, 
                height: '100%' 
              }}>
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

      {/* Certificates Section */}
      <Card sx={{ 
        maxWidth: 800, 
        mx: 'auto',
        borderRadius: 3, 
        border: 1, 
        borderColor: 'divider',
        overflow: 'hidden'
      }}>
        {/* Certificates Header */}
        <Box sx={{
          background: `linear-gradient(135deg, ${theme.palette.secondary.main} 0%, ${theme.palette.secondary.dark} 100%)`,
          color: 'white',
          p: 3
        }}>
          <Typography variant="h5" sx={{ 
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            mb: 0.5
          }}>
            <DescriptionIcon />
            Certificates
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.9 }}>
            Your certification documents and details
          </Typography>
        </Box>

        <CardContent sx={{ p: 0 }}>
          {certificate.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 6 }}>
              <Avatar sx={{ 
                width: 64, 
                height: 64, 
                mx: 'auto', 
                mb: 2, 
                bgcolor: alpha(theme.palette.secondary.main, 0.1) 
              }}>
                <DescriptionIcon sx={{ fontSize: 32, color: 'secondary.main' }} />
              </Avatar>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No Certificates
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Certificates will appear here when available
              </Typography>
            </Box>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: alpha(theme.palette.secondary.main, 0.1) }}>
                    <TableCell sx={{ color: 'secondary.main', fontWeight: 700, fontSize: '0.875rem' }}>#</TableCell>
                    <TableCell sx={{ color: 'secondary.main', fontWeight: 700, fontSize: '0.875rem' }}>Description</TableCell>
                    {!isMobile && <TableCell sx={{ color: 'secondary.main', fontWeight: 700, fontSize: '0.875rem' }}>Issue Date</TableCell>}
                    {!isMobile && <TableCell sx={{ color: 'secondary.main', fontWeight: 700, fontSize: '0.875rem' }}>Expiration Date</TableCell>}
                    <TableCell sx={{ color: 'secondary.main', fontWeight: 700, fontSize: '0.875rem', textAlign: 'center' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {certificate.map((cert, index) => (
                    <TableRow 
                      key={index}
                      hover
                      sx={{ 
                        '&:hover': { 
                          bgcolor: alpha(theme.palette.secondary.main, 0.04) 
                        } 
                      }}
                    >
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.secondary' }}>
                          {index + 1}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                          {cert.description || "—"}
                        </Typography>
                      </TableCell>
                      {!isMobile && (
                        <TableCell>
                          <Typography variant="body2">
                            {formatDate(cert.issueDate)}
                          </Typography>
                        </TableCell>
                      )}
                      {!isMobile && (
                        <TableCell>
                          <Typography variant="body2">
                            {formatDate(cert.expirationDate)}
                          </Typography>
                        </TableCell>
                      )}
                      <TableCell align="center">
                        <IconButton 
                          onClick={(e) => handleMenuClick(e, index)}
                          sx={{ 
                            bgcolor: alpha(theme.palette.secondary.main, 0.1),
                            '&:hover': { bgcolor: alpha(theme.palette.secondary.main, 0.2) }
                          }}
                        >
                          <MoreVertIcon />
                        </IconButton>
                        <Menu
                          anchorEl={anchorEl}
                          open={menuIndex === index}
                          onClose={handleMenuClose}
                          PaperProps={{
                            sx: {
                              borderRadius: 2,
                              mt: 1,
                              minWidth: 180
                            }
                          }}
                        >
                          <MenuItem onClick={() => handleViewOpen(cert)} sx={{ py: 1.5 }}>
                            <VisibilityIcon sx={{ mr: 2, color: 'info.main' }} />
                            View Details
                          </MenuItem>
                        </Menu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>

      {/* Certificate Modal */}
      <Dialog 
        open={viewOpen} 
        onClose={handleViewClose} 
        maxWidth="md" 
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle
          sx={{
            background: `linear-gradient(135deg, ${theme.palette.secondary.main} 0%, ${theme.palette.secondary.dark} 100%)`,
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}
        >
          <DescriptionIcon />
          Certificate Details
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <DetailItem
                label="Description"
                value={selectedCertificate?.description}
                icon={<DescriptionIcon fontSize="small" />}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <DetailItem
                label="Issue Date"
                value={formatDate(selectedCertificate?.issueDate)}
                icon={<CalendarTodayIcon fontSize="small" />}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <DetailItem
                label="Expiration Date"
                value={formatDate(selectedCertificate?.expirationDate)}
                icon={<AccessTimeIcon fontSize="small" />}
              />
            </Grid>
          </Grid>
          
          {selectedCertificate?.certificateFile && (
            <Box sx={{ mt: 3 }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Certificate Document
              </Typography>
              <iframe
                src={`data:${selectedCertificate.mimeType || "application/pdf"};base64,${selectedCertificate.certificateFile}`}
                title="Certificate PDF"
                style={{ 
                  width: "100%", 
                  height: "500px", 
                  border: "1px solid #e0e0e0", 
                  borderRadius: 8 
                }}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button 
            onClick={handleViewClose} 
            variant="contained"
            fullWidth
            sx={{ borderRadius: 2, py: 1.5, textTransform: 'none', fontWeight: 600 }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Membership;