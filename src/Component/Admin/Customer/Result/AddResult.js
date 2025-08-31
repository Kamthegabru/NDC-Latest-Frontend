import React, { useContext, useState, useEffect } from "react";
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Box,
  Grid,
  InputAdornment,
  Alert,
  Divider,
  Stack,
  IconButton,
  useMediaQuery,
  Paper,
  LinearProgress,
  Avatar,
  Chip
} from "@mui/material";
import { useTheme, alpha } from "@mui/material/styles";

// Icons
import AddIcon from "@mui/icons-material/Add";
import AssessmentIcon from "@mui/icons-material/Assessment";
import PersonIcon from "@mui/icons-material/Person";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import ScienceIcon from "@mui/icons-material/Science";
import NumbersIcon from "@mui/icons-material/Numbers";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CloseIcon from "@mui/icons-material/Close";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import ImageIcon from "@mui/icons-material/Image";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import PendingIcon from "@mui/icons-material/Pending";

import CustomerContext from "../../../../Context/Admin/Customer/CustomerContext";
import ResultContext from "../../../../Context/Admin/Customer/Result/ResultContext";

function AddResult() {
  const { currentId, getSingleUserData, userDetails } = useContext(CustomerContext);
  const { addResult } = useContext(ResultContext);

  const [open, setOpen] = useState(false);
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [uploadProgress, setUploadProgress] = useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [resultData, setResultData] = useState({
    driverId: "",
    date: "",
    testType: "",
    caseNumber: "",
    file: null,
    status: "Pending",
  });

  useEffect(() => {
    if (userDetails?.drivers) {
      const filteredDrivers = userDetails.drivers.filter(
        (driver) => driver.isActive && !driver.isDeleted
      );
      setDrivers(filteredDrivers);
    }
  }, [userDetails]);

  const handleClickOpen = () => {
    setOpen(true);
    setErrors({});
    setResultData({
      driverId: "",
      date: "",
      testType: "",
      caseNumber: "",
      file: null,
      status: "Pending",
    });
  };

  const handleClose = () => {
    setOpen(false);
    setErrors({});
    setUploadProgress(0);
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!resultData.driverId) newErrors.driverId = "Driver selection is required";
    if (!resultData.date) newErrors.date = "Test date is required";
    if (!resultData.testType.trim()) newErrors.testType = "Test type is required";
    if (!resultData.caseNumber.trim()) newErrors.caseNumber = "Case number is required";
    
    if (resultData.file) {
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
      if (!allowedTypes.includes(resultData.file.type)) {
        newErrors.file = "Only PDF, JPG, JPEG, and PNG files are allowed";
      }
      if (resultData.file.size > 10 * 1024 * 1024) { // 10MB limit
        newErrors.file = "File size must be less than 10MB";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setResultData((prev) => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setResultData((prev) => ({ ...prev, file }));
    
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
      formData.append("driverId", resultData.driverId);
      formData.append("date", resultData.date);
      formData.append("testType", resultData.testType);
      formData.append("caseNumber", resultData.caseNumber);
      formData.append("file", resultData.file);
      formData.append("status", resultData.status);
      formData.append("currentId", currentId);
      
      setUploadProgress(60);
      await addResult(formData);
      setUploadProgress(100);
      
      getSingleUserData(currentId);
      handleClose();
    } catch (error) {
      console.error("Error adding result:", error);
      setErrors({ submit: "Failed to add result. Please try again." });
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

  const getStatusChip = (status) => {
    switch (status) {
      case "Positive":
        return <Chip size="small" label="Positive" color="error" icon={<ErrorIcon />} />;
      case "Negative":
        return <Chip size="small" label="Negative" color="success" icon={<CheckCircleIcon />} />;
      case "Pending":
      default:
        return <Chip size="small" label="Pending" color="warning" icon={<PendingIcon />} />;
    }
  };

  const getDriverName = (driverId) => {
    const driver = drivers.find(d => d._id === driverId);
    return driver ? `${driver.first_name} ${driver.last_name}` : "";
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
        Add Result
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
              <AssessmentIcon />
              Add New Result
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9, mt: 0.5 }}>
              Create and manage test results
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
            {/* Driver Selection Section */}
            <Grid item xs={12}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'primary.main', mb: 1 }}>
                  Driver Selection
                </Typography>
                <Divider />
              </Box>
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth error={!!errors.driverId}>
                <InputLabel>Select Driver</InputLabel>
                <Select
                  value={resultData.driverId}
                  name="driverId"
                  onChange={handleChange}
                  label="Select Driver"
                  startAdornment={
                    <InputAdornment position="start">
                      <PersonIcon />
                    </InputAdornment>
                  }
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                >
                  {drivers.map((driver) => (
                    <MenuItem key={driver._id} value={driver._id}>
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Avatar sx={{ width: 32, height: 32, bgcolor: theme.palette.primary.main, fontSize: '0.75rem' }}>
                          {driver.first_name?.charAt(0)}{driver.last_name?.charAt(0)}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {driver.first_name} {driver.last_name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            License: {driver.government_id}
                          </Typography>
                        </Box>
                      </Stack>
                    </MenuItem>
                  ))}
                </Select>
                {errors.driverId && (
                  <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
                    {errors.driverId}
                  </Typography>
                )}
              </FormControl>
            </Grid>

            {/* Test Information Section */}
            <Grid item xs={12}>
              <Box sx={{ mt: 2, mb: 2 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'primary.main', mb: 1 }}>
                  Test Information
                </Typography>
                <Divider />
              </Box>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Test Date"
                name="date"
                type="date"
                value={resultData.date}
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

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Test Type"
                name="testType"
                value={resultData.testType}
                onChange={handleChange}
                error={!!errors.testType}
                helperText={errors.testType || "e.g., Drug Test, Alcohol Test"}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <ScienceIcon color="action" />
                    </InputAdornment>
                  ),
                }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Case Number"
                name="caseNumber"
                value={resultData.caseNumber}
                onChange={handleChange}
                error={!!errors.caseNumber}
                helperText={errors.caseNumber}
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
              <FormControl fullWidth>
                <InputLabel>Result Status</InputLabel>
                <Select
                  value={resultData.status}
                  name="status"
                  onChange={handleChange}
                  label="Result Status"
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                >
                  <MenuItem value="Pending">
                    <Stack direction="row" spacing={1} alignItems="center">
                      <PendingIcon color="warning" />
                      <Typography>Pending</Typography>
                    </Stack>
                  </MenuItem>
                  <MenuItem value="Positive">
                    <Stack direction="row" spacing={1} alignItems="center">
                      <ErrorIcon color="error" />
                      <Typography>Positive</Typography>
                    </Stack>
                  </MenuItem>
                  <MenuItem value="Negative">
                    <Stack direction="row" spacing={1} alignItems="center">
                      <CheckCircleIcon color="success" />
                      <Typography>Negative</Typography>
                    </Stack>
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* File Upload Section */}
            <Grid item xs={12}>
              <Box sx={{ mt: 2, mb: 2 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'primary.main', mb: 1 }}>
                  Result Document (Optional)
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
                  bgcolor: resultData.file ? alpha(theme.palette.success.main, 0.05) : alpha(theme.palette.primary.main, 0.02),
                  borderColor: resultData.file ? 'success.main' : 'primary.main',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    bgcolor: alpha(theme.palette.primary.main, 0.08),
                  }
                }}
                onClick={() => document.getElementById('result-file-input').click()}
              >
                <input
                  id="result-file-input"
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                />
                
                <Stack spacing={2} alignItems="center">
                  {resultData.file ? (
                    <>
                      {getFileIcon(resultData.file)}
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                          {resultData.file.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {formatFileSize(resultData.file.size)}
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
                          Upload Result Document
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

            {/* Preview Section */}
            {resultData.driverId && resultData.status && (
              <Grid item xs={12}>
                <Box sx={{ mt: 2, mb: 2 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'primary.main', mb: 1 }}>
                    Result Preview
                  </Typography>
                  <Divider />
                </Box>
                <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="caption" color="text.secondary">Driver</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {getDriverName(resultData.driverId)}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="caption" color="text.secondary">Status</Typography>
                      <Box sx={{ mt: 0.5 }}>
                        {getStatusChip(resultData.status)}
                      </Box>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>
            )}
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
              {loading ? 'Adding Result...' : 'Add Result'}
            </Button>
          </Stack>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default AddResult;