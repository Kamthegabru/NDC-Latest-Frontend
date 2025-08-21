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
  Pagination
} from "@mui/material";
import { Visibility, Download, Refresh } from "@mui/icons-material";
import CustomerContext from "../../../../Context/Agency/Customer/CustomerContext";
import dayjs from "dayjs";
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';

const PAGE_SIZE = 10;
const STATUS_OPTIONS = ["All", "Positive", "Negative", "Pending"];
const ORDER_STATUS_OPTIONS = ["All", "Pending", "Completed"];

function DisplayResult() {
  const { userDetails } = useContext(CustomerContext);

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
    if (!date) return "-";
    return dayjs(date).format("DD MMM YYYY");
  };

  // No loading spinner needed - data is immediately available from context
  return (
    <Box>
      <TableContainer component={Paper} sx={{ mt: 3, p: 2, borderRadius: 2, boxShadow: 3 }}>
        <Box
          sx={{
            mb: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <Typography variant="h6" sx={{
            fontWeight: "bold",
            color: "#003366",
            letterSpacing: 1,
            background: "linear-gradient(90deg, #003366 60%, #1976d2 100%)",
            px: 2,
            py: 1,
            borderRadius: 2,
            boxShadow: 2,
            color: "#fff"
          }}>
            My Test Results
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap" }}>
            <TextField
              size="small"
              label="Search Name/Company"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{ minWidth: 180 }}
            />
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: "bold", color: "#003366" }}>
                Date Range:
              </Typography>
              <Box sx={{ position: "relative" }}>
                <Chip
                  label={
                    range.from && range.to
                      ? `${dayjs(range.from).format("DD MMM YYYY")} - ${dayjs(range.to).format("DD MMM YYYY")}`
                      : "Select Range"
                  }
                  color="info"
                  variant="outlined"
                  onClick={() => setShowCalendar(!showCalendar)}
                  sx={{ cursor: "pointer", fontWeight: "bold" }}
                />
                {showCalendar && (
                  <Box sx={{
                    position: "absolute",
                    zIndex: 10,
                    mt: 2,
                    background: "#fff",
                    boxShadow: 6,
                    borderRadius: 2,
                    p: 2,
                    right: 0
                  }}>
                    <DayPicker
                      mode="range"
                      selected={range}
                      onSelect={setRange}
                      numberOfMonths={2}
                      showOutsideDays
                      footer={
                        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 1 }}>
                          <Chip
                            label="Done"
                            color="primary"
                            onClick={() => setShowCalendar(false)}
                            sx={{ cursor: "pointer" }}
                          />
                        </Box>
                      }
                    />
                  </Box>
                )}
              </Box>
            </Box>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Result Status</InputLabel>
              <Select
                value={resultStatus}
                label="Result Status"
                onChange={(e) => { setResultStatus(e.target.value); setPage(1); }}
              >
                {STATUS_OPTIONS.map((status) => (
                  <MenuItem key={status} value={status}>{status}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Order Status</InputLabel>
              <Select
                value={orderStatus}
                label="Order Status"
                onChange={(e) => { setOrderStatus(e.target.value); setPage(1); }}
              >
                {ORDER_STATUS_OPTIONS.map((status) => (
                  <MenuItem key={status} value={status}>{status}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <Tooltip title="Reset Filters">
              <IconButton onClick={handleResetFilters} color="info">
                <Refresh />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#003366" }}>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
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
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Sr</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Name</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>License #</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Test Date</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Test Type</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Order Status</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Result Status</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Case Number</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }} align="right">
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedResults.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} align="center">
                  <Typography color="text.secondary" sx={{ py: 4 }}>
                    No results found.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              paginatedResults.map((result, index) => (
                <TableRow key={result._id || result.caseNumber} hover>
                  <TableCell align="center">
                    <Checkbox
                      checked={selectedIds.includes(result._id || result.caseNumber)}
                      onChange={() => handleSelect(result._id || result.caseNumber)}
                      color="primary"
                    />
                  </TableCell>
                  <TableCell align="center">
                    {(page - 1) * PAGE_SIZE + index + 1}
                  </TableCell>
                  <TableCell>{result.driverName}</TableCell>
                  <TableCell>{result.licenseNumber}</TableCell>
                  <TableCell>
                    <Chip
                      label={formatDate(result.date || result.testDate)}
                      color="secondary"
                      variant="outlined"
                      sx={{ fontWeight: "bold", fontSize: 12 }}
                    />
                  </TableCell>
                  <TableCell>{result.testType}</TableCell>
                  <TableCell>
                    <Chip
                      label={result.orderStatus}
                      color={
                        result.orderStatus?.toLowerCase() === "pending"
                          ? "warning"
                          : result.orderStatus?.toLowerCase() === "completed"
                          ? "success"
                          : "default"
                      }
                      variant="filled"
                      sx={{ fontWeight: "bold" }}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={result.resultStatus}
                      color={
                        result.resultStatus?.toLowerCase() === "positive"
                          ? "error"
                          : result.resultStatus?.toLowerCase() === "negative"
                          ? "success"
                          : "warning"
                      }
                      variant="filled"
                      sx={{ fontWeight: "bold" }}
                    />
                  </TableCell>
                  <TableCell>{result.caseNumber}</TableCell>
                  <TableCell align="right">
                    <IconButton 
                      onClick={() => handleView(result)}
                      color="primary"
                      size="small"
                    >
                      <Visibility />
                    </IconButton>
                    <IconButton 
                      onClick={() => handleOpenDownload(result)}
                      color="secondary"
                      size="small"
                    >
                      <Download />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        <Stack direction="row" justifyContent="center" alignItems="center" sx={{ mt: 2 }}>
          <Pagination
            count={Math.ceil(filteredResults.length / PAGE_SIZE)}
            page={page}
            onChange={(_, value) => setPage(value)}
            color="primary"
            shape="rounded"
            showFirstButton
            showLastButton
          />
        </Stack>
      </TableContainer>

      {/* View Modal */}
      <Dialog open={openViewModal} onClose={handleCloseView} maxWidth="md" fullWidth>
        <DialogTitle sx={{ 
          background: "linear-gradient(90deg, #003366 60%, #1976d2 100%)", 
          color: "white",
          fontWeight: "bold"
        }}>
          Test Result Details
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Box sx={{ mb: 3 }}>
            <Typography gutterBottom sx={{ fontWeight: "bold", color: "#003366" }}>
              <strong>Driver Name:</strong> {selectedResult?.driverName}
            </Typography>
            <Typography gutterBottom sx={{ fontWeight: "bold", color: "#003366" }}>
              <strong>License Number:</strong> {selectedResult?.licenseNumber}
            </Typography>
            <Typography gutterBottom sx={{ fontWeight: "bold", color: "#003366" }}>
              <strong>Test Date:</strong> {formatDate(selectedResult?.date || selectedResult?.testDate)}
            </Typography>
            <Typography gutterBottom sx={{ fontWeight: "bold", color: "#003366" }}>
              <strong>Test Type:</strong> {selectedResult?.testType}
            </Typography>
            <Typography gutterBottom sx={{ fontWeight: "bold", color: "#003366" }}>
              <strong>Case Number:</strong> {selectedResult?.caseNumber}
            </Typography>
          </Box>

          {selectedResult?.resultImages?.length > 0 ? (
            selectedResult.resultImages.map((file, i) => {
              const url = file.url;
              const isPDF = file.mimeType === "application/pdf" || url?.startsWith("data:application/pdf");
              const isImage = file.mimeType?.startsWith("image/") || (!isPDF && url);
              
              return (
                <Box key={i} sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: "bold" }}>
                    {file.filename || `File ${i + 1}`}
                  </Typography>
                  {isPDF ? (
                    <iframe
                      src={url}
                      title={file.filename}
                      width="100%"
                      height="500px"
                      style={{ borderRadius: 8, border: "1px solid #ddd" }}
                    />
                  ) : isImage ? (
                    <Box
                      component="img"
                      src={url}
                      alt={file.filename}
                      sx={{ 
                        width: "100%", 
                        maxHeight: "400px",
                        objectFit: "contain",
                        borderRadius: 1,
                        border: "1px solid #ddd"
                      }}
                    />
                  ) : (
                    <Typography sx={{ fontStyle: "italic", color: "text.secondary" }}>
                      Cannot preview {file.filename}. Please download to view.
                    </Typography>
                  )}
                </Box>
              );
            })
          ) : (
            <Typography sx={{ mt: 2, fontStyle: "italic", textAlign: "center", color: "text.secondary" }}>
              No files available to preview.
            </Typography>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleCloseView} variant="contained" color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Download Modal */}
      <Dialog open={openDownloadModal} onClose={handleCloseDownload} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ 
          background: "linear-gradient(90deg, #003366 60%, #1976d2 100%)", 
          color: "white",
          fontWeight: "bold"
        }}>
          Download Files
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          {selectedResult?.resultImages?.length > 0 ? (
            selectedResult.resultImages.map((file, i) => (
              <Button
                key={i}
                fullWidth
                variant="outlined"
                sx={{ mb: 2, justifyContent: "flex-start", textTransform: "none" }}
                startIcon={<Download />}
                onClick={() => {
                  downloadFile(file);
                  handleCloseDownload();
                }}
              >
                {file.filename || `File ${i + 1}`}
              </Button>
            ))
          ) : (
            <Typography sx={{ textAlign: "center", color: "text.secondary" }}>
              No files available for download.
            </Typography>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleCloseDownload} variant="contained" color="primary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default DisplayResult; 