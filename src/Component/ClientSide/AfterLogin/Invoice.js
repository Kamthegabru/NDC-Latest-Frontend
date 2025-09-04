import React, { useContext, useEffect, useState } from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, IconButton, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Typography, CircularProgress,
  Card, CardContent, Avatar, Chip, Stack, Grid,
  Alert, Divider, Tooltip, Zoom,
  Paper, Box, useMediaQuery
} from "@mui/material";
import { useTheme, alpha } from "@mui/material/styles";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DownloadIcon from "@mui/icons-material/Download";
import ReceiptIcon from "@mui/icons-material/Receipt";
import CloseIcon from "@mui/icons-material/Close";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import ImageIcon from "@mui/icons-material/Image";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import PendingIcon from "@mui/icons-material/Pending";
import HomeContext from "../../../Context/ClientSide/AfterLogin/Home/HomeContext";

function Invoice() {
  const { userData } = useContext(HomeContext);

  const [loading, setLoading] = useState(true);
  const [invoices, setInvoices] = useState([]);
  const [openModal, setOpenModal] = useState(null);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    if (userData?.invoices) {
      setInvoices(userData.invoices);
      setLoading(false);
    } else if (userData && !userData.invoices) {
      // If userData exists but no invoices, stop loading
      setLoading(false);
    }
  }, [userData]);

  const handleOpen = (type, invoice) => {
    setSelectedInvoice(invoice);
    setOpenModal(type);
  };

  const handleClose = () => {
    setOpenModal(null);
    setSelectedInvoice(null);
  };

  const handleDownload = (invoice) => {
    if (!invoice?.file || !invoice?.mimeType) {
      alert("No file available for download");
      return;
    }

    try {
      const link = document.createElement("a");
      link.href = `data:${invoice.mimeType};base64,${invoice.file?.data || invoice.file}`;
      link.download = `${invoice.invoiceNumber || "invoice"}.${invoice.mimeType.includes('pdf') ? 'pdf' : 'jpg'}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Download error:", error);
      alert("Failed to download file");
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    try {
      return new Date(dateStr).toLocaleDateString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit"
      });
    } catch (error) {
      return "—";
    }
  };

  const formatCurrency = (amount) => {
    if (!amount) return "$0.00";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD"
    }).format(parseFloat(amount));
  };

  const getStatusChip = (status) => {
    switch (status?.toLowerCase()) {
      case "paid":
        return (
          <Chip
            size="small"
            label="Paid"
            color="success"
            icon={<CheckCircleIcon />}
            sx={{ fontSize: '0.75rem' }}
          />
        );
      case "unpaid":
        return (
          <Chip
            size="small"
            label="Unpaid"
            color="error"
            icon={<ErrorIcon />}
            sx={{ fontSize: '0.75rem' }}
          />
        );
      case "pending":
      default:
        return (
          <Chip
            size="small"
            label="Pending"
            color="warning"
            icon={<PendingIcon />}
            sx={{ fontSize: '0.75rem' }}
          />
        );
    }
  };

  const getFileIcon = (mimeType) => {
    if (!mimeType) return <ReceiptIcon />;
    if (mimeType === 'application/pdf') return <PictureAsPdfIcon />;
    if (mimeType.startsWith('image/')) return <ImageIcon />;
    return <ReceiptIcon />;
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
          Loading invoices...
        </Typography>
      </Box>
    );
  }

  if (!invoices || invoices.length === 0) {
    return (
      <Card sx={{ borderRadius: 3, border: '1px dashed', borderColor: 'divider' }}>
        <CardContent sx={{ textAlign: 'center', py: 6 }}>
          <Avatar sx={{ width: 64, height: 64, mx: 'auto', mb: 2, bgcolor: alpha(theme.palette.primary.main, 0.1) }}>
            <ReceiptIcon sx={{ fontSize: 32, color: 'primary.main' }} />
          </Avatar>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No Invoices Found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Invoices will appear here when available
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
              <TableCell sx={{ color: 'primary.main', fontWeight: 700, fontSize: '0.875rem' }}>Invoice</TableCell>
              {!isMobile && <TableCell sx={{ color: 'primary.main', fontWeight: 700, fontSize: '0.875rem' }}>Amount</TableCell>}
              {!isMobile && <TableCell sx={{ color: 'primary.main', fontWeight: 700, fontSize: '0.875rem' }}>Date</TableCell>}
              <TableCell sx={{ color: 'primary.main', fontWeight: 700, fontSize: '0.875rem' }}>Status</TableCell>
              <TableCell sx={{ color: 'primary.main', fontWeight: 700, fontSize: '0.875rem', textAlign: 'center' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {invoices.map((invoice, index) => {
              if (!invoice) return null;
              
              return (
                <TableRow 
                  key={invoice._id || index}
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
                        {getFileIcon(invoice.mimeType)}
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600, lineHeight: 1.2 }}>
                          {invoice.invoiceNumber || "Untitled Invoice"}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Invoice Document
                        </Typography>
                      </Box>
                    </Stack>
                  </TableCell>
                  {!isMobile && (
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: 'success.main' }}>
                        {formatCurrency(invoice.amount)}
                      </Typography>
                    </TableCell>
                  )}
                  {!isMobile && (
                    <TableCell>
                      <Typography variant="body2">
                        {formatDate(invoice.date)}
                      </Typography>
                    </TableCell>
                  )}
                  <TableCell>
                    {getStatusChip(invoice.status)}
                  </TableCell>
                  <TableCell align="center">
                    <Stack direction="row" spacing={0.5} justifyContent="center">
                      <Tooltip title="View Details" TransitionComponent={Zoom}>
                        <IconButton 
                          size="small"
                          onClick={() => handleOpen("view", invoice)}
                          sx={{ bgcolor: alpha(theme.palette.info.main, 0.1), '&:hover': { bgcolor: alpha(theme.palette.info.main, 0.2) } }}
                        >
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      {invoice.file && (
                        <Tooltip title="Download" TransitionComponent={Zoom}>
                          <IconButton 
                            size="small"
                            onClick={() => handleDownload(invoice)}
                            sx={{ bgcolor: alpha(theme.palette.success.main, 0.1), '&:hover': { bgcolor: alpha(theme.palette.success.main, 0.2) } }}
                          >
                            <DownloadIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
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
              <ReceiptIcon />
              Invoice Details
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9, mt: 0.5 }}>
              {selectedInvoice?.invoiceNumber}
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
                      {getStatusChip(selectedInvoice?.status)}
                    </Box>
                    
                    <Divider />
                    
                    <Box>
                      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                        Invoice Number
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {selectedInvoice?.invoiceNumber || "—"}
                      </Typography>
                    </Box>
                    
                    <Box>
                      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                        Amount
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: 700, color: 'success.main' }}>
                        {formatCurrency(selectedInvoice?.amount)}
                      </Typography>
                    </Box>
                    
                    <Box>
                      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                        Invoice Date
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {formatDate(selectedInvoice?.date)}
                      </Typography>
                    </Box>

                    {selectedInvoice?.file && (
                      <Button
                        variant="contained"
                        startIcon={<DownloadIcon />}
                        onClick={() => handleDownload(selectedInvoice)}
                        fullWidth
                        sx={{ mt: 2 }}
                      >
                        Download Invoice
                      </Button>
                    )}
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={8}>
              {selectedInvoice?.file && selectedInvoice?.mimeType ? (
                <Box sx={{ height: 600, border: 1, borderColor: 'divider', borderRadius: 2, overflow: 'hidden' }}>
                  {selectedInvoice.mimeType.startsWith("image/") ? (
                    <img
                      src={`data:${selectedInvoice.mimeType};base64,${selectedInvoice.file?.data || selectedInvoice.file}`}
                      alt="Invoice"
                      style={{ width: "100%", height: "100%", objectFit: "contain", borderRadius: 8 }}
                    />
                  ) : selectedInvoice.mimeType === "application/pdf" ? (
                    <iframe
                      src={`data:${selectedInvoice.mimeType};base64,${selectedInvoice.file?.data || selectedInvoice.file}`}
                      title="Invoice PDF"
                      style={{ width: "100%", height: "100%", border: 'none' }}
                    />
                  ) : (
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', bgcolor: 'grey.100' }}>
                      <Typography color="text.secondary">
                        Preview not available for this file type
                      </Typography>
                    </Box>
                  )}
                </Box>
              ) : (
                <Box sx={{ height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'grey.50', borderRadius: 2, border: '1px dashed', borderColor: 'divider' }}>
                  <Typography color="text.secondary">
                    No file attached to this invoice
                  </Typography>
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

export default Invoice;