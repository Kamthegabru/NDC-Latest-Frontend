import React, { useContext, useState, useEffect } from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button,
  IconButton, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Typography, CircularProgress,
  Card, CardContent, Avatar, Chip, Stack, Grid,
  Alert, Divider, Tooltip, Zoom,
  Paper, Box, useMediaQuery
} from "@mui/material";
import { useTheme, alpha } from "@mui/material/styles";

// Icons
import VisibilityIcon from "@mui/icons-material/Visibility";
import DownloadIcon from "@mui/icons-material/Download";
import CertificateIcon from "@mui/icons-material/Verified";
import CloseIcon from "@mui/icons-material/Close";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import WarningIcon from "@mui/icons-material/Warning";

import CustomerContext from "../../../../Context/Agency/Customer/CustomerContext";

// Format date to MM/DD/YYYY
const formatDate = (dateStr) => {
  if (!dateStr) return "—";
  try {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit"
    }).format(date);
  } catch (error) {
    return "—";
  }
};

function DisplayCertificate() {
  const { userDetails } = useContext(CustomerContext);

  const [loading, setLoading] = useState(true);
  const [certificates, setCertificates] = useState([]);
  const [openModal, setOpenModal] = useState(null);
  const [selectedCert, setSelectedCert] = useState(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    if (userDetails?.certificates) {
      setCertificates(userDetails.certificates);
      setLoading(false);
    }
  }, [userDetails]);

  const handleOpen = (type, cert) => {
    setSelectedCert(cert);
    setOpenModal(type);
  };

  const handleClose = () => {
    setOpenModal(null);
    setSelectedCert(null);
  };

  const handleDownload = async (cert) => {
    try {
      const base64 = cert.certificateFile;
      if (!base64) {
        alert("No certificate file found");
        return;
      }

      const byteArray = Uint8Array.from(atob(base64), char => char.charCodeAt(0));
      const blob = new Blob([byteArray], { type: cert.mimeType || "application/pdf" });
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `${cert.description || "certificate"}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download error:", error);
    }
  };

  const isExpired = (expirationDate) => {
    if (!expirationDate) return false;
    try {
      return new Date(expirationDate) < new Date();
    } catch (error) {
      return false;
    }
  };

  const isExpiringSoon = (expirationDate) => {
    if (!expirationDate) return false;
    try {
      const expDate = new Date(expirationDate);
      const today = new Date();
      const daysUntilExpiry = Math.ceil((expDate - today) / (1000 * 60 * 60 * 24));
      return daysUntilExpiry <= 30 && daysUntilExpiry > 0;
    } catch (error) {
      return false;
    }
  };

  const getStatusChip = (cert) => {
    if (!cert || !cert.expirationDate) {
      return (
        <Chip
          size="small"
          label="Unknown"
          color="default"
          sx={{ fontSize: '0.75rem' }}
        />
      );
    }
    
    if (isExpired(cert.expirationDate)) {
      return (
        <Chip
          size="small"
          label="Expired"
          color="error"
          icon={<ErrorIcon />}
          sx={{ fontSize: '0.75rem' }}
        />
      );
    }
    if (isExpiringSoon(cert.expirationDate)) {
      return (
        <Chip
          size="small"
          label="Expiring Soon"
          color="warning"
          icon={<WarningIcon />}
          sx={{ fontSize: '0.75rem' }}
        />
      );
    }
    return (
      <Chip
        size="small"
        label="Valid"
        color="success"
        icon={<CheckCircleIcon />}
        sx={{ fontSize: '0.75rem' }}
      />
    );
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 300 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (certificates.length === 0) {
    return (
      <Card sx={{ borderRadius: 3, border: '1px dashed', borderColor: 'divider' }}>
        <CardContent sx={{ textAlign: 'center', py: 6 }}>
          <Avatar sx={{ width: 64, height: 64, mx: 'auto', mb: 2, bgcolor: alpha(theme.palette.primary.main, 0.1) }}>
            <CertificateIcon sx={{ fontSize: 32, color: 'primary.main' }} />
          </Avatar>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No Certificates Found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Add certificates to get started
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <TableContainer component={Paper} sx={{ borderRadius: 3, border: 1, borderColor: 'divider' }}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1) }}>
              <TableCell sx={{ color: 'primary.main', fontWeight: 700, fontSize: '0.875rem' }}>#</TableCell>
              <TableCell sx={{ color: 'primary.main', fontWeight: 700, fontSize: '0.875rem' }}>Certificate</TableCell>
              {!isMobile && <TableCell sx={{ color: 'primary.main', fontWeight: 700, fontSize: '0.875rem' }}>Issue Date</TableCell>}
              {!isMobile && <TableCell sx={{ color: 'primary.main', fontWeight: 700, fontSize: '0.875rem' }}>Expiration</TableCell>}
              <TableCell sx={{ color: 'primary.main', fontWeight: 700, fontSize: '0.875rem' }}>Status</TableCell>
              <TableCell sx={{ color: 'primary.main', fontWeight: 700, fontSize: '0.875rem', textAlign: 'center' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {certificates.map((cert, index) => {
              // Add safety check for cert object
              if (!cert) return null;
              
              return (
                <TableRow 
                  key={cert._id || index}
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
                        <PictureAsPdfIcon />
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600, lineHeight: 1.2 }}>
                          {cert.description || "Untitled Certificate"}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Certificate Document
                        </Typography>
                      </Box>
                    </Stack>
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
                  <TableCell>
                    {getStatusChip(cert)}
                  </TableCell>
                  <TableCell align="center">
                    <Stack direction="row" spacing={0.5} justifyContent="center">
                      <Tooltip title="View Details" TransitionComponent={Zoom}>
                        <IconButton 
                          size="small"
                          onClick={() => handleOpen("view", cert)}
                          sx={{ bgcolor: alpha(theme.palette.info.main, 0.1), '&:hover': { bgcolor: alpha(theme.palette.info.main, 0.2) } }}
                        >
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Download" TransitionComponent={Zoom}>
                        <IconButton 
                          size="small"
                          onClick={() => handleDownload(cert)}
                          sx={{ bgcolor: alpha(theme.palette.success.main, 0.1), '&:hover': { bgcolor: alpha(theme.palette.success.main, 0.2) } }}
                        >
                          <DownloadIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {/* View Modal */}
      <Dialog 
        open={openModal === "view"} 
        onClose={handleClose} 
        maxWidth="lg" 
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
              <CertificateIcon />
              Certificate Details
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9, mt: 0.5 }}>
              {selectedCert?.description || "Certificate Information"}
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
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Card elevation={0} sx={{ bgcolor: 'grey.50', border: 1, borderColor: 'divider' }}>
                <CardContent>
                  <Stack spacing={2}>
                    <Box textAlign="center">
                      {getStatusChip(selectedCert)}
                    </Box>
                    
                    <Divider />
                    
                    <Box>
                      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                        Description
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {selectedCert?.description || "—"}
                      </Typography>
                    </Box>
                    
                    <Box>
                      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                        Issue Date
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {formatDate(selectedCert?.issueDate)}
                      </Typography>
                    </Box>
                    
                    <Box>
                      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                        Expiration Date
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {formatDate(selectedCert?.expirationDate)}
                      </Typography>
                    </Box>

                    <Button
                      variant="contained"
                      startIcon={<DownloadIcon />}
                      onClick={() => handleDownload(selectedCert)}
                      fullWidth
                      sx={{ mt: 2 }}
                    >
                      Download Certificate
                    </Button>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={8}>
              {selectedCert?.certificateFile && (
                <Box sx={{ height: 600, border: 1, borderColor: 'divider', borderRadius: 2, overflow: 'hidden' }}>
                  <iframe
                    src={`data:${selectedCert.mimeType || "application/pdf"};base64,${selectedCert.certificateFile}`}
                    title="Certificate PDF"
                    style={{ width: "100%", height: "100%", border: 'none' }}
                  />
                </Box>
              )}
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button
            onClick={handleClose}
            variant="contained"
            fullWidth
            sx={{ borderRadius: 2, py: 1.5, textTransform: 'none', fontWeight: 600 }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default DisplayCertificate;