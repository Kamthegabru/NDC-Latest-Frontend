import React, { useContext, useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  CircularProgress,
  MenuItem,
  TextField,
  Box,
  Card,
  CardContent,
  Avatar,
  Chip,
  Stack,
  Grid,
  InputAdornment,
  Alert,
  Divider,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Zoom,
  Paper,
  useMediaQuery,
  FormControl,
  InputLabel,
  Select
} from "@mui/material";
import { useTheme, alpha } from "@mui/material/styles";

// Icons
import VisibilityIcon from "@mui/icons-material/Visibility";
import DownloadIcon from "@mui/icons-material/Download";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AssessmentIcon from "@mui/icons-material/Assessment";
import PersonIcon from "@mui/icons-material/Person";
import ScienceIcon from "@mui/icons-material/Science";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import CloseIcon from "@mui/icons-material/Close";
import WarningIcon from "@mui/icons-material/Warning";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import ImageIcon from "@mui/icons-material/Image";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import PendingIcon from "@mui/icons-material/Pending";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import FolderIcon from "@mui/icons-material/Folder";

import CustomerContext from "../../../../Context/Admin/Customer/CustomerContext";
import ResultContext from "../../../../Context/Admin/Customer/Result/ResultContext";

function DisplayResult() {
  const { currentId, userDetails, getSingleUserData } = useContext(CustomerContext);
  const { updateResult, deleteResult } = useContext(ResultContext);

  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState([]);
  const [openModal, setOpenModal] = useState(null);
  const [selectedResult, setSelectedResult] = useState(null);
  const [editData, setEditData] = useState({});
  const [previewUrl, setPreviewUrl] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    if (userDetails?.results) {
      setResults(userDetails.results);
      setLoading(false);
    }
  }, [userDetails]);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleOpen = (type, result) => {
    setSelectedResult(result);
    setEditData({ status: result.resultStatus });
    setErrors({});
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setOpenModal(type);
  };

  const handleClose = () => {
    setOpenModal(null);
    setSelectedResult(null);
    setEditData({});
    setErrors({});
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
  };

  const downloadFile = (file) => {
    try {
      const link = document.createElement("a");
      link.href = file.url;
      link.download = file.filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Download error:", error);
      alert("Failed to download file");
    }
  };

  const handleUpdate = async () => {
    setActionLoading(true);
    try {
      const formData = new FormData();
      formData.append("currentId", currentId);
      formData.append("resultId", selectedResult._id);
      formData.append("updatedData", JSON.stringify(editData));
      
      // Only append file if a new file was uploaded
      const fileInput = document.getElementById('result-edit-file-input');
      if (fileInput && fileInput.files[0]) {
        formData.append("file", fileInput.files[0]);
      }
      
      await updateResult(formData);
      getSingleUserData(currentId);
      handleClose();
    } catch (error) {
      console.error("Update error:", error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    setActionLoading(true);
    try {
      await deleteResult(currentId, selectedResult._id);
      getSingleUserData(currentId);
      handleClose();
    } catch (error) {
      console.error("Delete error:", error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Create preview URL for display
    const objectURL = URL.createObjectURL(file);
    setPreviewUrl(objectURL);
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

  const getStatusChip = (status, isOrder = false) => {
    const statusLower = status?.toLowerCase() || "";
    
    if (isOrder) {
      switch (statusLower) {
        case "completed":
          return <Chip size="small" label="Completed" color="success" icon={<CheckCircleIcon />} />;
        case "pending":
          return <Chip size="small" label="Pending" color="warning" icon={<PendingIcon />} />;
        default:
          return <Chip size="small" label={status} color="default" />;
      }
    } else {
      switch (statusLower) {
        case "positive":
          return <Chip size="small" label="Positive" color="error" icon={<ErrorIcon />} />;
        case "negative":
          return <Chip size="small" label="Negative" color="success" icon={<CheckCircleIcon />} />;
        case "pending":
          return <Chip size="small" label="Pending" color="warning" icon={<PendingIcon />} />;
        default:
          return <Chip size="small" label={status} color="default" />;
      }
    }
  };

  const getInitials = (name) => {
    if (!name) return "—";
    return name.split(' ').map(n => n.charAt(0)).join('').toUpperCase();
  };

  const getFileIcon = (mimeType) => {
    if (!mimeType) return <AssessmentIcon />;
    if (mimeType === 'application/pdf') return <PictureAsPdfIcon />;
    if (mimeType.startsWith('image/')) return <ImageIcon />;
    return <AssessmentIcon />;
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 300 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (results.length === 0) {
    return (
      <Card sx={{ borderRadius: 3, border: '1px dashed', borderColor: 'divider' }}>
        <CardContent sx={{ textAlign: 'center', py: 6 }}>
          <Avatar sx={{ width: 64, height: 64, mx: 'auto', mb: 2, bgcolor: alpha(theme.palette.primary.main, 0.1) }}>
            <AssessmentIcon sx={{ fontSize: 32, color: 'primary.main' }} />
          </Avatar>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No Results Found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Add test results to get started
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
              {!isTablet && <TableCell sx={{ color: 'primary.main', fontWeight: 700, fontSize: '0.875rem' }}>License #</TableCell>}
              {!isMobile && <TableCell sx={{ color: 'primary.main', fontWeight: 700, fontSize: '0.875rem' }}>Test Date</TableCell>}
              {!isTablet && <TableCell sx={{ color: 'primary.main', fontWeight: 700, fontSize: '0.875rem' }}>Test Type</TableCell>}
              <TableCell sx={{ color: 'primary.main', fontWeight: 700, fontSize: '0.875rem' }}>Order Status</TableCell>
              <TableCell sx={{ color: 'primary.main', fontWeight: 700, fontSize: '0.875rem' }}>Result Status</TableCell>
              {!isTablet && <TableCell sx={{ color: 'primary.main', fontWeight: 700, fontSize: '0.875rem' }}>Case #</TableCell>}
              <TableCell sx={{ color: 'primary.main', fontWeight: 700, fontSize: '0.875rem', textAlign: 'center' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {results.map((result, index) => {
              if (!result) return null;
              
              return (
                <TableRow 
                  key={result._id || index}
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
                        {getInitials(result.driverName)}
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600, lineHeight: 1.2 }}>
                          {result.driverName || "Unknown Driver"}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Test Result
                        </Typography>
                      </Box>
                    </Stack>
                  </TableCell>
                  {!isTablet && (
                    <TableCell>
                      <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                        {result.licenseNumber || "—"}
                      </Typography>
                    </TableCell>
                  )}
                  {!isMobile && (
                    <TableCell>
                      <Typography variant="body2">
                        {formatDate(result.date)}
                      </Typography>
                    </TableCell>
                  )}
                  {!isTablet && (
                    <TableCell>
                      <Typography variant="body2">
                        {result.testType || "—"}
                      </Typography>
                    </TableCell>
                  )}
                  <TableCell>
                    {getStatusChip(result.orderStatus, true)}
                  </TableCell>
                  <TableCell>
                    {getStatusChip(result.resultStatus)}
                  </TableCell>
                  {!isTablet && (
                    <TableCell>
                      <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                        {result.caseNumber || "—"}
                      </Typography>
                    </TableCell>
                  )}
                  <TableCell align="center">
                    <Stack direction="row" spacing={0.5} justifyContent="center">
                      <Tooltip title="View Details" TransitionComponent={Zoom}>
                        <IconButton 
                          size="small"
                          onClick={() => handleOpen("view", result)}
                          sx={{ bgcolor: alpha(theme.palette.info.main, 0.1), '&:hover': { bgcolor: alpha(theme.palette.info.main, 0.2) } }}
                        >
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Download Files" TransitionComponent={Zoom}>
                        <IconButton 
                          size="small"
                          onClick={() => handleOpen("download", result)}
                          sx={{ bgcolor: alpha(theme.palette.success.main, 0.1), '&:hover': { bgcolor: alpha(theme.palette.success.main, 0.2) } }}
                        >
                          <DownloadIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit" TransitionComponent={Zoom}>
                        <IconButton 
                          size="small"
                          onClick={() => handleOpen("edit", result)}
                          sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1), '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.2) } }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete" TransitionComponent={Zoom}>
                        <IconButton 
                          size="small"
                          onClick={() => handleOpen("delete", result)}
                          sx={{ bgcolor: alpha(theme.palette.error.main, 0.1), '&:hover': { bgcolor: alpha(theme.palette.error.main, 0.2) } }}
                        >
                          <DeleteIcon fontSize="small" />
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
              <AssessmentIcon />
              Result Details
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9, mt: 0.5 }}>
              {selectedResult?.driverName} - {selectedResult?.testType}
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
                      {getStatusChip(selectedResult?.resultStatus)}
                    </Box>
                    
                    <Divider />
                    
                    <Box>
                      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                        Employee
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {selectedResult?.driverName || "—"}
                      </Typography>
                    </Box>
                    
                    <Box>
                      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                        Test Type
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {selectedResult?.testType || "—"}
                      </Typography>
                    </Box>
                    
                    <Box>
                      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                        Test Date
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {formatDate(selectedResult?.date)}
                      </Typography>
                    </Box>
                    
                    <Box>
                      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                        Case Number
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600, fontFamily: 'monospace' }}>
                        {selectedResult?.caseNumber || "—"}
                      </Typography>
                    </Box>

                    <Box>
                      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                        Order Status
                      </Typography>
                      <Box sx={{ mt: 0.5 }}>
                        {getStatusChip(selectedResult?.orderStatus, true)}
                      </Box>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={8}>
              {selectedResult?.resultImages?.length > 0 ? (
                <Box sx={{ height: 600, border: 1, borderColor: 'divider', borderRadius: 2, overflow: 'hidden' }}>
                  <Typography variant="h6" sx={{ p: 2, borderBottom: 1, borderColor: 'divider', bgcolor: 'grey.50' }}>
                    Result Files ({selectedResult.resultImages.length})
                  </Typography>
                  <Box sx={{ p: 2, height: 'calc(100% - 64px)', overflow: 'auto' }}>
                    <Grid container spacing={2}>
                      {selectedResult.resultImages.map((file, i) => (
                        <Grid item xs={12} key={i}>
                          {file.mimeType?.startsWith("image/") ? (
                            <Box
                              component="img"
                              src={file.url}
                              alt={file.filename}
                              sx={{ width: "100%", maxHeight: 400, objectFit: 'contain', borderRadius: 1, border: 1, borderColor: 'divider' }}
                            />
                          ) : file.mimeType === "application/pdf" ? (
                            <iframe
                              src={file.url}
                              title={file.filename}
                              style={{ width: "100%", height: "400px", borderRadius: 8, border: '1px solid #ddd' }}
                            />
                          ) : (
                            <Paper sx={{ p: 2, textAlign: 'center', border: '1px dashed', borderColor: 'divider' }}>
                              <Typography color="text.secondary">
                                Cannot preview {file.filename}. Please download to view.
                              </Typography>
                            </Paper>
                          )}
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                </Box>
              ) : (
                <Box sx={{ height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'grey.50', borderRadius: 2, border: '1px dashed', borderColor: 'divider' }}>
                  <Stack spacing={2} alignItems="center">
                    <FolderIcon sx={{ fontSize: 48, color: 'text.secondary' }} />
                    <Typography color="text.secondary">
                      No files available for this result
                    </Typography>
                  </Stack>
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

      {/* Download Modal */}
      <Dialog 
        open={openModal === "download"} 
        onClose={handleClose}
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
              <DownloadIcon />
              Download Files
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9, mt: 0.5 }}>
              Select files to download
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
          {selectedResult?.resultImages?.length > 0 ? (
            <Stack spacing={2}>
              {selectedResult.resultImages.map((file, i) => (
                <Paper 
                  key={i}
                  sx={{ 
                    p: 2, 
                    border: 1, 
                    borderColor: 'divider',
                    '&:hover': { bgcolor: 'grey.50' },
                    cursor: 'pointer'
                  }}
                  onClick={() => downloadFile(file)}
                >
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar sx={{ bgcolor: 'success.main' }}>
                      {getFileIcon(file.mimeType)}
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        {file.filename || `Result File ${i + 1}`}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {file.mimeType || 'Unknown format'}
                      </Typography>
                    </Box>
                    <DownloadIcon color="action" />
                  </Stack>
                </Paper>
              ))}
            </Stack>
          ) : (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <FolderIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
              <Typography color="text.secondary">
                No files available for download
              </Typography>
            </Box>
          )}
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

      {/* Edit Modal */}
      <Dialog 
        open={openModal === "edit"} 
        onClose={handleClose}
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
              Edit Result
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9, mt: 0.5 }}>
              Update result status and upload files
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
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Result Status</InputLabel>
                <Select
                  value={editData.status || ""}
                  onChange={e => setEditData({ ...editData, status: e.target.value })}
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
                  <MenuItem value="In Progress">
                    <Stack direction="row" spacing={1} alignItems="center">
                      <ScienceIcon color="info" />
                      <Typography>In Progress</Typography>
                    </Stack>
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <Paper
                variant="outlined"
                sx={{
                  p: 2,
                  textAlign: 'center',
                  borderRadius: 2,
                  borderStyle: 'dashed',
                  cursor: 'pointer',
                  '&:hover': { bgcolor: 'grey.50' }
                }}
                onClick={() => document.getElementById('result-edit-file-input').click()}
              >
                <input
                  id="result-edit-file-input"
                  type="file"
                  hidden
                  accept="image/*,application/pdf"
                  onChange={handleImageUpload}
                />
                <Stack spacing={1} alignItems="center">
                  <CloudUploadIcon color="primary" />
                  <Typography variant="body2">
                    Click to upload image or PDF
                  </Typography>
                </Stack>
              </Paper>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                File Preview:
              </Typography>
              {previewUrl ? (
                // Check if uploaded file is PDF by getting the file from input
                (() => {
                  const fileInput = document.getElementById('result-edit-file-input');
                  const uploadedFile = fileInput?.files[0];
                  return uploadedFile?.type === "application/pdf" ? (
                    <iframe
                      src={previewUrl}
                      title="PDF Preview"
                      style={{ width: "100%", height: "300px", borderRadius: 8, border: '1px solid #ddd' }}
                    />
                  ) : (
                    <Box
                      component="img"
                      src={previewUrl}
                      alt="New Preview"
                      sx={{ width: "100%", maxHeight: 300, objectFit: 'contain', borderRadius: 1, border: 1, borderColor: 'divider' }}
                    />
                  );
                })()
              ) : selectedResult?.resultImages?.[0] ? (
                selectedResult.resultImages[0].mimeType?.startsWith("image/") ? (
                  <Box
                    component="img"
                    src={selectedResult.resultImages[0].url}
                    alt="Current"
                    sx={{ width: "100%", maxHeight: 300, objectFit: 'contain', borderRadius: 1, border: 1, borderColor: 'divider' }}
                  />
                ) : selectedResult.resultImages[0].mimeType === "application/pdf" ? (
                  <iframe
                    src={selectedResult.resultImages[0].url}
                    title="Current PDF"
                    style={{ width: "100%", height: "300px", borderRadius: 8, border: '1px solid #ddd' }}
                  />
                ) : (
                  <Box sx={{ textAlign: 'center', py: 4, bgcolor: 'grey.50', borderRadius: 1 }}>
                    <Typography color="text.secondary">
                      File available but cannot preview
                    </Typography>
                  </Box>
                )
              ) : (
                <Box sx={{ textAlign: 'center', py: 4, bgcolor: 'grey.50', borderRadius: 1 }}>
                  <Typography color="text.secondary">
                    No file available
                  </Typography>
                </Box>
              )}
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
              disabled={actionLoading}
              sx={{ flex: 1, borderRadius: 2, py: 1.5, textTransform: 'none', fontWeight: 600 }}
            >
              {actionLoading ? 'Updating...' : 'Update Result'}
            </Button>
          </Stack>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog 
        open={openModal === "delete"} 
        onClose={handleClose}
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
              <Typography variant="h6" sx={{ fontWeight: 600 }}>Delete Result</Typography>
              <Typography variant="body2" color="text.secondary">This action cannot be undone</Typography>
            </Box>
          </Stack>
        </DialogTitle>
        
        <DialogContent>
          <Alert severity="error" sx={{ borderRadius: 2 }}>
            Are you sure you want to delete the result for <strong>{selectedResult?.driverName}</strong>? 
            This will permanently remove all result data and associated files.
          </Alert>
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
              onClick={handleDelete}
              variant="contained"
              color="error"
              disabled={actionLoading}
              sx={{ flex: 1, borderRadius: 2, py: 1.5, textTransform: 'none', fontWeight: 600 }}
            >
              {actionLoading ? 'Deleting...' : 'Delete Result'}
            </Button>
          </Stack>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default DisplayResult;