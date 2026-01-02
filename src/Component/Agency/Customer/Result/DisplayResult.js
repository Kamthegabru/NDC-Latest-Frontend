import React, { useContext, useState, useEffect, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Paper,
  Box,
  TextField,
  Chip,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Tooltip,
  Stack,
  Checkbox,
  Pagination,
  Avatar,
  Card,
  CardContent,
  Grid,
  Divider,
  Alert,
  useMediaQuery,
  Zoom
} from "@mui/material";
import { 
  Visibility, 
  Download, 
  Refresh,
  Close as CloseIcon,
  Assessment as AssessmentIcon,
  Person as PersonIcon,
  CalendarToday as CalendarTodayIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Pending as PendingIcon,
  PictureAsPdf as PictureAsPdfIcon,
  Image as ImageIcon,
  Folder as FolderIcon,
  FilterList as FilterListIcon
} from "@mui/icons-material";
import { useTheme, alpha } from "@mui/material/styles";
import CustomerContext from "../../../../Context/Agency/Customer/CustomerContext";
import dayjs from "dayjs";
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';

const PAGE_SIZE = 10;
const STATUS_OPTIONS = ["All", "Positive", "Negative", "Pending"];
const ORDER_STATUS_OPTIONS = ["All", "Pending", "Completed"];

function DisplayResult() {
  const { userDetails } = useContext(CustomerContext);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  // State management
  const [searchTerm, setSearchTerm] = useState("");
  const [resultStatus, setResultStatus] = useState("All");
  const [orderStatus, setOrderStatus] = useState("All");
  const [page, setPage] = useState(1);
  const [range, setRange] = useState({ from: undefined, to: undefined });
  const [showCalendar, setShowCalendar] = useState(false);
  
  // Modal states
  const [openViewModal, setOpenViewModal] = useState(false);
  const [openDownloadModal, setOpenDownloadModal] = useState(false);
  const [selectedResult, setSelectedResult] = useState(null);
  
  // Selection states
  const [selectedIds, setSelectedIds] = useState([]);

  // Get results from context - no loading needed as it's already available
  const results = useMemo(() => {
    return userDetails?.results || [];
  }, [userDetails?.results]);

  // Filtering and sorting with optimized performance
  const filteredResults = useMemo(() => {
    if (!results.length) return [];
    
    let filtered = results.filter((r) => {
      const nameMatch = r.driverName?.toLowerCase().includes(searchTerm.toLowerCase());
      const companyMatch = r.companyName?.toLowerCase().includes(searchTerm.toLowerCase());
      return nameMatch || companyMatch;
    });

    if (resultStatus !== "All") {
      filtered = filtered.filter(
        (r) => r.resultStatus?.toLowerCase() === resultStatus.toLowerCase()
      );
    }

    if (orderStatus !== "All") {
      filtered = filtered.filter(
        (r) => r.orderStatus?.toLowerCase() === orderStatus.toLowerCase()
      );
    }

    // Date range filter
    if (range.from && range.to) {
      filtered = filtered.filter((r) => {
        const testDate = dayjs(r.date || r.testDate);
        return testDate.isAfter(dayjs(range.from).subtract(1, 'day')) &&
          testDate.isBefore(dayjs(range.to).add(1, 'day'));
      });
    }

    return filtered;
  }, [results, searchTerm, resultStatus, orderStatus, range]);

  // Pagination with optimized performance
  const paginatedResults = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredResults.slice(start, start + PAGE_SIZE);
  }, [filteredResults, page]);

  // Selection logic using _id or caseNumber
  const handleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((selectedId) => selectedId !== id) : [...prev, id]
    );
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedIds([
        ...selectedIds.filter(id => !paginatedResults.some(r => (r._id || r.caseNumber) === id)),
        ...paginatedResults.map(r => r._id || r.caseNumber)
      ]);
    } else {
      setSelectedIds(selectedIds.filter(id => !paginatedResults.some(r => (r._id || r.caseNumber) === id)));
    }
  };

  // Modal handlers
  const handleView = (result) => {
    setSelectedResult(result);
    setOpenViewModal(true);
  };

  const handleCloseView = () => {
    setOpenViewModal(false);
    setSelectedResult(null);
  };

  const handleOpenDownload = (result) => {
    setSelectedResult(result);
    setOpenDownloadModal(true);
  };

  const handleCloseDownload = () => {
    setOpenDownloadModal(false);
    setSelectedResult(null);
  };

  const downloadFile = (file) => {
    try {
      // Handle both old and new file formats
      let downloadUrl = file.url;
      let fileName = file.filename || file.name || 'download';

      // If it's base64, convert to blob
      if (file.url && file.url.startsWith('data:')) {
        const base64Data = file.url.split(",")[1];
        const byteArray = Uint8Array.from(atob(base64Data), (c) =>
          c.charCodeAt(0)
        );
        const blobType = file.url.match(/^data:(.+);base64/)?.[1] || "application/octet-stream";
        const blob = new Blob([byteArray], { type: blobType });
        downloadUrl = URL.createObjectURL(blob);
      }

      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up blob URL if created
      if (downloadUrl !== file.url) {
        URL.revokeObjectURL(downloadUrl);
      }
    } catch (err) {
      console.error("Error downloading file:", err);
    }
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    setResultStatus("All");
    setOrderStatus("All");
    setRange({ from: undefined, to: undefined });
    setPage(1);
    setSelectedIds([]);
  };

  const formatDate = (date) => {
    if (!date) return "—";
    try {
      return dayjs(date).format("DD MMM YYYY");
    } catch (error) {
      return "—";
    }
  };

  const getStatusChip = (status, isOrder = false) => {
    const statusLower = status?.toLowerCase() || "";
    
    if (isOrder) {
      switch (statusLower) {
        case "completed":
          return <Chip size="small" label="Completed" color="success" icon={<CheckCircleIcon />} sx={{ fontWeight: 600 }} />;
        case "pending":
          return <Chip size="small" label="Pending" color="warning" icon={<PendingIcon />} sx={{ fontWeight: 600 }} />;
        default:
          return <Chip size="small" label={status} color="default" sx={{ fontWeight: 600 }} />;
      }
    } else {
      switch (statusLower) {
        case "positive":
          return <Chip size="small" label="Positive" color="error" icon={<ErrorIcon />} sx={{ fontWeight: 600 }} />;
        case "negative":
          return <Chip size="small" label="Negative" color="success" icon={<CheckCircleIcon />} sx={{ fontWeight: 600 }} />;
        case "pending":
          return <Chip size="small" label="Pending" color="warning" icon={<PendingIcon />} sx={{ fontWeight: 600 }} />;
        default:
          return <Chip size="small" label={status} color="default" sx={{ fontWeight: 600 }} />;
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

  if (results.length === 0) {
    return (
      <Card sx={{ borderRadius: 3, border: '1px dashed', borderColor: 'divider' }}>
        <CardContent sx={{ textAlign: 'center', py: 6 }}>
          <Avatar sx={{ width: 64, height: 64, mx: 'auto', mb: 2, bgcolor: alpha(theme.palette.primary.main, 0.1) }}>
            <AssessmentIcon sx={{ fontSize: 32, color: 'primary.main' }} />
          </Avatar>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No Test Results Found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Test results will appear here once available
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Box>
      {/* Header and Filters */}
      <Card sx={{ mb: 3, borderRadius: 3, border: 1, borderColor: 'divider' }}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ mb: 3 }}>
            <Typography 
              variant="h5" 
              sx={{ 
                fontWeight: 700, 
                color: 'primary.main',
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                mb: 1
              }}
            >
              <AssessmentIcon />
              My Test Results
            </Typography>
            <Typography variant="body2" color="text.secondary">
              View and manage your test results
            </Typography>
          </Box>

          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                size="small"
                label="Search Name/Company"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                fullWidth
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ position: "relative" }}>
                <Chip
                  label={
                    range.from && range.to
                      ? `${dayjs(range.from).format("DD MMM")} - ${dayjs(range.to).format("DD MMM")}`
                      : "Select Date Range"
                  }
                  color="primary"
                  variant="outlined"
                  onClick={() => setShowCalendar(!showCalendar)}
                  sx={{ 
                    cursor: "pointer", 
                    fontWeight: 600,
                    height: 40,
                    borderRadius: 2,
                    width: '100%',
                    justifyContent: 'flex-start'
                  }}
                  icon={<CalendarTodayIcon />}
                />
                {showCalendar && (
                  <Paper sx={{
                    position: "absolute",
                    zIndex: 10,
                    mt: 1,
                    boxShadow: 6,
                    borderRadius: 2,
                    p: 2,
                    right: 0,
                    minWidth: 600
                  }}>
                    <DayPicker
                      mode="range"
                      selected={range}
                      onSelect={setRange}
                      numberOfMonths={2}
                      showOutsideDays
                      footer={
                        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2, gap: 1 }}>
                          <Button
                            size="small"
                            onClick={() => setRange({ from: undefined, to: undefined })}
                            variant="outlined"
                          >
                            Clear
                          </Button>
                          <Button
                            size="small"
                            variant="contained"
                            onClick={() => setShowCalendar(false)}
                          >
                            Done
                          </Button>
                        </Box>
                      }
                    />
                  </Paper>
                )}
              </Box>
            </Grid>

            <Grid item xs={12} sm={6} md={2}>
              <FormControl size="small" fullWidth>
                <InputLabel>Result Status</InputLabel>
                <Select
                  value={resultStatus}
                  label="Result Status"
                  onChange={(e) => { setResultStatus(e.target.value); setPage(1); }}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                >
                  {STATUS_OPTIONS.map((status) => (
                    <MenuItem key={status} value={status}>{status}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6} md={2}>
              <FormControl size="small" fullWidth>
                <InputLabel>Order Status</InputLabel>
                <Select
                  value={orderStatus}
                  label="Order Status"
                  onChange={(e) => { setOrderStatus(e.target.value); setPage(1); }}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                >
                  {ORDER_STATUS_OPTIONS.map((status) => (
                    <MenuItem key={status} value={status}>{status}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={12} md={2}>
              <Stack direction="row" spacing={1} justifyContent="flex-end">
                <Tooltip title="Reset Filters" TransitionComponent={Zoom}>
                  <IconButton 
                    onClick={handleResetFilters} 
                    color="primary"
                    sx={{ 
                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                      '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.2) }
                    }}
                  >
                    <Refresh />
                  </IconButton>
                </Tooltip>
                {selectedIds.length > 0 && (
                  <Chip
                    label={`${selectedIds.length} selected`}
                    color="primary"
                    variant="filled"
                    sx={{ fontWeight: 600 }}
                  />
                )}
              </Stack>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Results Table */}
      <TableContainer 
        component={Paper} 
        sx={{ 
          borderRadius: 3, 
          border: 1, 
          borderColor: 'divider',
          overflow: 'hidden',
          overflowX: 'auto'
        }}
      >
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1) }}>
              <TableCell sx={{ color: 'primary.main', fontWeight: 700, fontSize: '0.875rem' }}>
                <Checkbox
                  checked={
                    paginatedResults.length > 0 &&
                    paginatedResults.every(r => selectedIds.includes(r._id || r.caseNumber))
                  }
                  indeterminate={
                    paginatedResults.some(r => selectedIds.includes(r._id || r.caseNumber)) &&
                    !paginatedResults.every(r => selectedIds.includes(r._id || r.caseNumber))
                  }
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  color="primary"
                />
              </TableCell>
              <TableCell sx={{ color: 'primary.main', fontWeight: 700, fontSize: '0.875rem' }}>#</TableCell>
              <TableCell sx={{ color: 'primary.main', fontWeight: 700, fontSize: '0.875rem' }}>Employee</TableCell>
              {!isTablet && <TableCell sx={{ color: 'primary.main', fontWeight: 700, fontSize: '0.875rem' }}>License #</TableCell>}
              {!isMobile && <TableCell sx={{ color: 'primary.main', fontWeight: 700, fontSize: '0.875rem' }}>Test Date</TableCell>}
              {!isTablet && <TableCell sx={{ color: 'primary.main', fontWeight: 700, fontSize: '0.875rem' }}>Test Type</TableCell>}
              <TableCell sx={{ color: 'primary.main', fontWeight: 700, fontSize: '0.875rem' }}>Order Status</TableCell>
              <TableCell sx={{ color: 'primary.main', fontWeight: 700, fontSize: '0.875rem' }}>Result Status</TableCell>
              {!isTablet && <TableCell sx={{ color: 'primary.main', fontWeight: 700, fontSize: '0.875rem' }}>Case #</TableCell>}
              <TableCell sx={{ color: 'primary.main', fontWeight: 700, fontSize: '0.875rem', textAlign: 'center' }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedResults.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} align="center" sx={{ py: 6 }}>
                  <Stack spacing={2} alignItems="center">
                    <Avatar sx={{ width: 48, height: 48, bgcolor: alpha(theme.palette.primary.main, 0.1) }}>
                      <FilterListIcon sx={{ color: 'primary.main' }} />
                    </Avatar>
                    <Typography variant="h6" color="text.secondary">
                      No results found
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Try adjusting your filters or search terms
                    </Typography>
                  </Stack>
                </TableCell>
              </TableRow>
            ) : (
              paginatedResults.map((result, index) => (
                <TableRow 
                  key={result._id || result.caseNumber} 
                  hover
                  sx={{ 
                    '&:hover': { 
                      bgcolor: alpha(theme.palette.primary.main, 0.04) 
                    } 
                  }}
                >
                  <TableCell>
                    <Checkbox
                      checked={selectedIds.includes(result._id || result.caseNumber)}
                      onChange={() => handleSelect(result._id || result.caseNumber)}
                      color="primary"
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.secondary' }}>
                      {(page - 1) * PAGE_SIZE + index + 1}
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
                      <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 500 }}>
                        {result.licenseNumber || "—"}
                      </Typography>
                    </TableCell>
                  )}
                  {!isMobile && (
                    <TableCell>
                      <Chip
                        label={formatDate(result.date || result.testDate)}
                        color="info"
                        variant="outlined"
                        sx={{ fontWeight: 600, borderRadius: 2 }}
                        size="small"
                      />
                    </TableCell>
                  )}
                  {!isTablet && (
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
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
                      <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 500 }}>
                        {result.caseNumber || "—"}
                      </Typography>
                    </TableCell>
                  )}
                  <TableCell align="center">
                    <Stack direction="row" spacing={0.5} justifyContent="center">
                      <Tooltip title="View Details" TransitionComponent={Zoom}>
                        <IconButton 
                          size="small"
                          onClick={() => handleView(result)}
                          sx={{ 
                            bgcolor: alpha(theme.palette.info.main, 0.1), 
                            '&:hover': { bgcolor: alpha(theme.palette.info.main, 0.2) } 
                          }}
                        >
                          <Visibility fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Download Files" TransitionComponent={Zoom}>
                        <IconButton 
                          size="small"
                          onClick={() => handleOpenDownload(result)}
                          sx={{ 
                            bgcolor: alpha(theme.palette.success.main, 0.1), 
                            '&:hover': { bgcolor: alpha(theme.palette.success.main, 0.2) } 
                          }}
                        >
                          <Download fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* Pagination */}
        <Box sx={{ p: 3, display: 'flex', justifyContent: 'center', borderTop: 1, borderColor: 'divider' }}>
          <Pagination
            count={Math.ceil(filteredResults.length / PAGE_SIZE)}
            page={page}
            onChange={(_, value) => setPage(value)}
            color="primary"
            shape="rounded"
            showFirstButton
            showLastButton
            sx={{
              '& .MuiPaginationItem-root': {
                fontWeight: 600
              }
            }}
          />
        </Box>
      </TableContainer>

      {/* View Modal */}
      <Dialog 
        open={openViewModal} 
        onClose={handleCloseView} 
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
              Test Result Details
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9, mt: 0.5 }}>
              {selectedResult?.driverName} - {selectedResult?.testType}
            </Typography>
          </Box>
          <IconButton
            onClick={handleCloseView}
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
              <Card elevation={0} sx={{ bgcolor: 'grey.50', border: 1, borderColor: 'divider', borderRadius: 2 }}>
                <CardContent sx={{ p: 3 }}>
                  <Stack spacing={3}>
                    <Box textAlign="center">
                      {getStatusChip(selectedResult?.resultStatus)}
                    </Box>
                    
                    <Divider />
                    
                    <Box>
                      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                        Employee Name
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 600, mt: 0.5 }}>
                        {selectedResult?.driverName || "—"}
                      </Typography>
                    </Box>
                    
                    <Box>
                      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                        License Number
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 600, fontFamily: 'monospace', mt: 0.5 }}>
                        {selectedResult?.licenseNumber || "—"}
                      </Typography>
                    </Box>
                    
                    <Box>
                      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                        Test Type
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 600, mt: 0.5 }}>
                        {selectedResult?.testType || "—"}
                      </Typography>
                    </Box>
                    
                    <Box>
                      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                        Test Date
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 600, mt: 0.5 }}>
                        {formatDate(selectedResult?.date || selectedResult?.testDate)}
                      </Typography>
                    </Box>
                    
                    <Box>
                      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                        Case Number
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 600, fontFamily: 'monospace', mt: 0.5 }}>
                        {selectedResult?.caseNumber || "—"}
                      </Typography>
                    </Box>

                    <Box>
                      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>
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
              <Card sx={{ height: 600, border: 1, borderColor: 'divider', borderRadius: 2, overflow: 'hidden' }}>
                <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider', bgcolor: 'grey.50' }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <FolderIcon />
                    Result Files ({selectedResult?.resultImages?.length || 0})
                  </Typography>
                </Box>
                <Box sx={{ p: 3, height: 'calc(100% - 64px)', overflow: 'auto' }}>
                  {selectedResult?.resultImages?.length > 0 ? (
                    <Grid container spacing={2}>
                      {selectedResult.resultImages.map((file, i) => (
                        <Grid item xs={12} key={i}>
                          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                            {file.filename || `File ${i + 1}`}
                          </Typography>
                          {file.mimeType?.startsWith("image/") ? (
                            <Box
                              component="img"
                              src={file.url}
                              alt={file.filename}
                              sx={{ 
                                width: "100%", 
                                maxHeight: 400, 
                                objectFit: 'contain', 
                                borderRadius: 2, 
                                border: 1, 
                                borderColor: 'divider',
                                bgcolor: 'grey.50'
                              }}
                            />
                          ) : file.mimeType === "application/pdf" ? (
                            <iframe
                              src={file.url}
                              title={file.filename}
                              style={{ 
                                width: "100%", 
                                height: "400px", 
                                borderRadius: 8, 
                                border: '1px solid #e0e0e0'
                              }}
                            />
                          ) : (
                            <Paper sx={{ 
                              p: 3, 
                              textAlign: 'center', 
                              border: '1px dashed', 
                              borderColor: 'divider',
                              borderRadius: 2,
                              bgcolor: 'grey.50'
                            }}>
                              <Stack spacing={1} alignItems="center">
                                {getFileIcon(file.mimeType)}
                                <Typography color="text.secondary" variant="body2">
                                  Cannot preview {file.filename}
                                </Typography>
                                <Typography color="text.secondary" variant="caption">
                                  Please download to view
                                </Typography>
                              </Stack>
                            </Paper>
                          )}
                        </Grid>
                      ))}
                    </Grid>
                  ) : (
                    <Box sx={{ 
                      height: '100%', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      bgcolor: 'grey.50', 
                      borderRadius: 2, 
                      border: '1px dashed', 
                      borderColor: 'divider' 
                    }}>
                      <Stack spacing={2} alignItems="center">
                        <Avatar sx={{ width: 64, height: 64, bgcolor: alpha(theme.palette.grey[500], 0.1) }}>
                          <FolderIcon sx={{ fontSize: 32, color: 'grey.500' }} />
                        </Avatar>
                        <Typography variant="h6" color="text.secondary">
                          No Files Available
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          No result files have been uploaded for this test
                        </Typography>
                      </Stack>
                    </Box>
                  )}
                </Box>
              </Card>
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button
            onClick={handleCloseView}
            variant="contained"
            fullWidth
            sx={{ 
              borderRadius: 2, 
              py: 1.5, 
              textTransform: 'none', 
              fontWeight: 600,
              fontSize: '1rem'
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Download Modal */}
      <Dialog 
        open={openDownloadModal} 
        onClose={handleCloseDownload}
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
              <Download />
              Download Files
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9, mt: 0.5 }}>
              Select files to download from this test result
            </Typography>
          </Box>
          <IconButton
            onClick={handleCloseDownload}
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
                    p: 3, 
                    border: 1, 
                    borderColor: 'divider',
                    borderRadius: 2,
                    '&:hover': { 
                      bgcolor: 'grey.50',
                      borderColor: 'primary.main',
                      transform: 'translateY(-1px)',
                      boxShadow: 2
                    },
                    cursor: 'pointer',
                    transition: 'all 0.2s ease-in-out'
                  }}
                  onClick={() => {
                    downloadFile(file);
                    handleCloseDownload();
                  }}
                >
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar sx={{ 
                      bgcolor: 'success.main',
                      width: 48,
                      height: 48
                    }}>
                      {getFileIcon(file.mimeType)}
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
                        {file.filename || `Result File ${i + 1}`}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {file.mimeType || 'Unknown format'}
                      </Typography>
                    </Box>
                    <IconButton
                      sx={{ 
                        bgcolor: alpha(theme.palette.success.main, 0.1),
                        '&:hover': { bgcolor: alpha(theme.palette.success.main, 0.2) }
                      }}
                    >
                      <Download color="success" />
                    </IconButton>
                  </Stack>
                </Paper>
              ))}
            </Stack>
          ) : (
            <Box sx={{ textAlign: 'center', py: 6 }}>
              <Avatar sx={{ width: 64, height: 64, mx: 'auto', mb: 2, bgcolor: alpha(theme.palette.grey[500], 0.1) }}>
                <FolderIcon sx={{ fontSize: 32, color: 'grey.500' }} />
              </Avatar>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No Files Available
              </Typography>
              <Typography variant="body2" color="text.secondary">
                There are no files available for download from this test result
              </Typography>
            </Box>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button
            onClick={handleCloseDownload}
            variant="contained"
            fullWidth
            sx={{ 
              borderRadius: 2, 
              py: 1.5, 
              textTransform: 'none', 
              fontWeight: 600,
              fontSize: '1rem'
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default DisplayResult;