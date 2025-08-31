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
  useMediaQuery,
  Paper,
  LinearProgress
} from "@mui/material";
import { useTheme, alpha } from "@mui/material/styles";

// Icons
import AddIcon from "@mui/icons-material/Add";
import ReceiptIcon from "@mui/icons-material/Receipt";
import NumbersIcon from "@mui/icons-material/Numbers";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CloseIcon from "@mui/icons-material/Close";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import ImageIcon from "@mui/icons-material/Image";

import CustomerContext from "../../../../Context/Admin/Customer/CustomerContext";
import InvoiceContext from "../../../../Context/Admin/Customer/Invoice/InvoiceContext";

function AddInvoice() {
  const { currentId, getSingleUserData } = useContext(CustomerContext);
  const { addInvoice } = useContext(InvoiceContext);

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [uploadProgress, setUploadProgress] = useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [invoiceData, setInvoiceData] = useState({
    invoiceNumber: "",
    amount: "",
    date: "",
    file: null,
  });

  const handleClickOpen = () => {
    setOpen(true);
    setErrors({});
    setInvoiceData({
      invoiceNumber: "",
      amount: "",
      date: "",
      file: null,
    });
  };

  const handleClose = () => {
    setOpen(false);
    setErrors({});
    setUploadProgress(0);
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!invoiceData.invoiceNumber.trim()) newErrors.invoiceNumber = "Invoice number is required";
    if (!invoiceData.amount) {
      newErrors.amount = "Amount is required";
    } else if (parseFloat(invoiceData.amount) <= 0) {
      newErrors.amount = "Amount must be greater than 0";
    }
    if (!invoiceData.date) newErrors.date = "Invoice date is required";
    
    if (invoiceData.file) {
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
      if (!allowedTypes.includes(invoiceData.file.type)) {
        newErrors.file = "Only PDF, JPG, JPEG, and PNG files are allowed";
      }
      if (invoiceData.file.size > 10 * 1024 * 1024) { // 10MB limit
        newErrors.file = "File size must be less than 10MB";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInvoiceData({ ...invoiceData, [name]: value });
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setInvoiceData({ ...invoiceData, file });
    
    if (errors.file) {
      setErrors(prev => ({ ...prev, file: "" }));
    }
  };

  const handleSave = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    setUploadProgress(20);
    
    try {
      const formData = new FormData();
      formData.append("invoiceNumber", invoiceData.invoiceNumber);
      formData.append("amount", invoiceData.amount);
      formData.append("date", invoiceData.date);
      if (invoiceData.file) formData.append("file", invoiceData.file);
      formData.append("currentId", currentId);
      
      setUploadProgress(60);
      await addInvoice(formData);
      setUploadProgress(100);
      
      getSingleUserData(currentId);
      handleClose();
    } catch (error) {
      console.error("Error adding invoice:", error);
      setErrors({ submit: "Failed to add invoice. Please try again." });
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

  const getFileIcon = (file) => {
    if (!file) return <AttachFileIcon />;
    if (file.type === 'application/pdf') return <PictureAsPdfIcon />;
    if (file.type.startsWith('image/')) return <ImageIcon />;
    return <AttachFileIcon />;
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <>
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={handleClickOpen}
        sx={{
          bgcolor: 'primary.main',
          color: 'white',
          borderRadius: 2,
          px: 3,
          py: 1.5,
          fontWeight: 600,
          textTransform: 'none',
          boxShadow: theme.shadows[3],
          '&:hover': {
            bgcolor: 'primary.dark',
            transform: 'translateY(-1px)',
            boxShadow: theme.shadows[4],
          },
          '&:active': {
            transform: 'translateY(0)',
          },
          transition: 'all 0.2s ease',
        }}
      >
        Add Invoice
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
              <ReceiptIcon />
              Add New Invoice
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9, mt: 0.5 }}>
              Create and manage your invoices
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
          {loading && (
            <Box sx={{ width: '100%', mb: 2 }}>
              <LinearProgress variant="determinate" value={uploadProgress} sx={{ borderRadius: 1 }} />
              <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
                Processing... {uploadProgress}%
              </Typography>
            </Box>
          )}

          <Grid container spacing={3} sx={{ mt: 0 }}>
            {/* Invoice Information Section */}
            <Grid item xs={12}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'primary.main', mb: 1 }}>
                  Invoice Information
                </Typography>
                <Divider />
              </Box>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Invoice Number"
                name="invoiceNumber"
                value={invoiceData.invoiceNumber}
                onChange={handleChange}
                error={!!errors.invoiceNumber}
                helperText={errors.invoiceNumber || "Enter unique invoice number"}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <NumbersIcon color="action" />
                    </InputAdornment>
                  ),
                }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Amount"
                name="amount"
                type="number"
                value={invoiceData.amount}
                onChange={handleChange}
                error={!!errors.amount}
                helperText={errors.amount}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AttachMoneyIcon color="action" />
                    </InputAdornment>
                  ),
                }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Invoice Date"
                name="date"
                type="date"
                value={invoiceData.date}
                onChange={handleChange}
                error={!!errors.date}
                helperText={errors.date}
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

            {/* File Upload Section */}
            <Grid item xs={12}>
              <Box sx={{ mt: 2, mb: 2 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'primary.main', mb: 1 }}>
                  Invoice Document (Optional)
                </Typography>
                <Divider />
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Paper
                variant="outlined"
                sx={{
                  p: 3,
                  textAlign: 'center',
                  borderRadius: 2,
                  borderStyle: 'dashed',
                  bgcolor: invoiceData.file ? alpha(theme.palette.success.main, 0.05) : alpha(theme.palette.primary.main, 0.02),
                  borderColor: invoiceData.file ? 'success.main' : 'primary.main',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    bgcolor: alpha(theme.palette.primary.main, 0.08),
                  }
                }}
                onClick={() => document.getElementById('invoice-file-input').click()}
              >
                <input
                  id="invoice-file-input"
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                />
                
                <Stack spacing={2} alignItems="center">
                  {invoiceData.file ? (
                    <>
                      {getFileIcon(invoiceData.file)}
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                          {invoiceData.file.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {formatFileSize(invoiceData.file.size)}
                        </Typography>
                      </Box>
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<CloudUploadIcon />}
                        sx={{ borderRadius: 2 }}
                      >
                        Change File
                      </Button>
                    </>
                  ) : (
                    <>
                      <CloudUploadIcon sx={{ fontSize: 48, color: 'primary.main', opacity: 0.7 }} />
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                          Upload Invoice Document
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          Click to browse or drag and drop your file here
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Supported formats: PDF, JPG, JPEG, PNG (Max 10MB)
                        </Typography>
                      </Box>
                    </>
                  )}
                </Stack>
              </Paper>
              
              {errors.file && (
                <Typography variant="caption" color="error" sx={{ mt: 1, display: 'block' }}>
                  {errors.file}
                </Typography>
              )}
            </Grid>
          </Grid>

          {(Object.keys(errors).length > 0 && !errors.file) || errors.submit && (
            <Alert 
              severity="error" 
              sx={{ mt: 3, borderRadius: 2 }}
              icon={false}
            >
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {errors.submit || "Please fix the errors above to continue"}
              </Typography>
            </Alert>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Stack direction="row" spacing={2} width="100%">
            <Button 
              onClick={handleClose}
              variant="outlined"
              disabled={loading}
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
                bgcolor: 'primary.main',
                '&:hover': { bgcolor: 'primary.dark' }
              }}
            >
              {loading ? 'Adding Invoice...' : 'Add Invoice'}
            </Button>
          </Stack>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default AddInvoice;