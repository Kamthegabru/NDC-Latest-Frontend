import React, { useEffect, useState, useMemo } from "react";
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
  CircularProgress,
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
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import dayjs from "dayjs";
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import Cookies from "js-cookie";

const API_URL = process.env.REACT_APP_API_URL;
const PAGE_SIZE = 10;
const STATUS_OPTIONS = ["All", "Positive", "Negative", "Pending"];
const ORDER_STATUS_OPTIONS = ["All", "Pending", "Completed"];

// Cache for results to avoid repeated API calls
let cachedResults = null;
let cacheTimestamp = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export default function DisplayResult() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [initialLoading, setInitialLoading] = useState(true);

  // Filter and pagination states
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
  const [showRemoveDialog, setShowRemoveDialog] = useState(false);

  // Fetch results with caching
  useEffect(() => {
    let isMounted = true;
    
    const fetchResults = async () => {
      // Check if we have valid cached data
      const now = Date.now();
      if (cachedResults && cacheTimestamp && (now - cacheTimestamp) < CACHE_DURATION) {
        setResults(cachedResults);
        setLoading(false);
        setInitialLoading(false);
        return;
      }

      try {
        setLoading(true);
        const token = Cookies.get("token");
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        const res = await axios.get(`${API_URL}/agency/getAllResult`);
        const data = res.data.data || [];
        
        if (isMounted) {
          setResults(data);
          // Cache the results
          cachedResults = data;
          cacheTimestamp = now;
        }
      } catch (err) {
        if (isMounted) {
          console.error("Error fetching results:", err);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
          setInitialLoading(false);
        }
      }
    };

    fetchResults();
    return () => { isMounted = false; };
  }, []);

  // Optimized filtering with useMemo
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
        const testDate = dayjs(r.testDate);
        return testDate.isAfter(dayjs(range.from).subtract(1, 'day')) &&
          testDate.isBefore(dayjs(range.to).add(1, 'day'));
      });
    }

    return filtered;
  }, [results, searchTerm, resultStatus, orderStatus, range]);

  // Pagination with useMemo
  const paginatedResults = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredResults.slice(start, start + PAGE_SIZE);
  }, [filteredResults, page]);

  // Selection handlers
  const handleSelect = (caseNumber) => {
    setSelectedIds((prev) =>
      prev.includes(caseNumber) ? prev.filter((id) => id !== caseNumber) : [...prev, caseNumber]
    );
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedIds([
        ...selectedIds.filter(id => !paginatedResults.some(r => r.caseNumber === id)),
        ...paginatedResults.map(r => r.caseNumber)
      ]);
    } else {
      setSelectedIds(selectedIds.filter(id => !paginatedResults.some(r => r.caseNumber === id)));
    }
  };

  const handleRemoveSelected = () => {
    setShowRemoveDialog(true);
  };

  const confirmRemove = () => {
    // API call to remove selected results would go here
    console.log("Removing selected results:", selectedIds);
    setSelectedIds([]);
    setShowRemoveDialog(false);
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
      // Handle both base64 and direct URLs
      if (file.url.startsWith('data:')) {
        const base64Data = file.url.split(",")[1];
        const byteArray = Uint8Array.from(atob(base64Data), (c) => c.charCodeAt(0));
        const blobType = file.url.match(/^data:(.+);base64/)?.[1] || "application/octet-stream";
        const blob = new Blob([byteArray], { type: blobType });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = file.filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);
      } else {
        // Direct URL download
        const link = document.createElement("a");
        link.href = file.url;
        link.download = file.filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
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

  if (initialLoading) {
    return (
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 300 }}>
        <CircularProgress color="primary" size={60} />
        <Typography sx={{ mt: 2, fontWeight: "bold", color: "#1976d2" }}>Loading Results...</Typography>
      </Box>
    );
  }

  return (
    <>
      {/* Remove Dialog */}
      <Dialog open={showRemoveDialog} onClose={() => setShowRemoveDialog(false)}>
        <DialogTitle>Confirm Removal</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to remove the selected result(s)?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowRemoveDialog(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={confirmRemove} color="error" variant="contained">
            Remove
          </Button>
        </DialogActions>
      </Dialog>

      <TableContainer component={Paper} sx={{
        mt: 3, p: 2, borderRadius: 3, boxShadow: 6,
        background: "linear-gradient(135deg, #e3f2fd 0%, #f5f5f5 100%)"
      }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography variant="h5" sx={{
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
            Result List
          </Typography>
          
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
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
                    top: "100%",
                    left: 0,
                    zIndex: 10,
                    mt: 1,
                    background: "#fff",
                    boxShadow: 6,
                    borderRadius: 2,
                    p: 2
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
            
            <Button
              variant="contained"
              color="error"
              startIcon={<DeleteIcon />}
              disabled={selectedIds.length === 0}
              onClick={handleRemoveSelected}
            >
              Remove
            </Button>
            
            <Tooltip title="Reset Filters">
              <IconButton onClick={handleResetFilters} color="info">
                <Refresh />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
        
        <Table stickyHeader>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#003366" }}>
              <TableCell align="center" sx={{ color: "#003366", background: "#e3f2fd", fontWeight: "bold", fontSize: 16 }}>
                <Checkbox
                  checked={
                    paginatedResults.length > 0 &&
                    paginatedResults.every(r => selectedIds.includes(r.caseNumber))
                  }
                  indeterminate={
                    paginatedResults.some(r => selectedIds.includes(r.caseNumber)) &&
                    !paginatedResults.every(r => selectedIds.includes(r.caseNumber))
                  }
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  color="primary"
                />
              </TableCell>
              <TableCell align="center" sx={{ color: "#003366", background: "#e3f2fd", fontWeight: "bold", fontSize: 16 }}>Sr</TableCell>
              <TableCell align="center" sx={{ color: "#003366", background: "#e3f2fd", fontWeight: "bold", fontSize: 16 }}>Company Name</TableCell>
              <TableCell align="center" sx={{ color: "#003366", background: "#e3f2fd", fontWeight: "bold", fontSize: 16 }}>Name</TableCell>
              <TableCell align="center" sx={{ color: "#003366", background: "#e3f2fd", fontWeight: "bold", fontSize: 16 }}>License #</TableCell>
              <TableCell align="center" sx={{ color: "#003366", background: "#e3f2fd", fontWeight: "bold", fontSize: 16 }}>Test Date</TableCell>
              <TableCell align="center" sx={{ color: "#003366", background: "#e3f2fd", fontWeight: "bold", fontSize: 16 }}>Test Type</TableCell>
              <TableCell align="center" sx={{ color: "#003366", background: "#e3f2fd", fontWeight: "bold", fontSize: 16 }}>Result Status</TableCell>
              <TableCell align="center" sx={{ color: "#003366", background: "#e3f2fd", fontWeight: "bold", fontSize: 16 }}>Order Status</TableCell>
              <TableCell align="center" sx={{ color: "#003366", background: "#e3f2fd", fontWeight: "bold", fontSize: 16 }}>Case Number</TableCell>
              <TableCell align="center" sx={{ color: "#003366", background: "#e3f2fd", fontWeight: "bold", fontSize: 16 }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedResults.length === 0 ? (
              <TableRow>
                <TableCell colSpan={11} align="center">
                  <Typography color="text.secondary">No results found.</Typography>
                </TableCell>
              </TableRow>
            ) : (
              paginatedResults.map((result, index) => (
                <TableRow key={result.caseNumber || index} hover>
                  <TableCell align="center">
                    <Checkbox
                      checked={selectedIds.includes(result.caseNumber)}
                      onChange={() => handleSelect(result.caseNumber)}
                      color="primary"
                    />
                  </TableCell>
                  <TableCell align="center">
                    {(page - 1) * PAGE_SIZE + index + 1}
                  </TableCell>
                  <TableCell align="center">
                    <Typography fontWeight="bold">{result.companyName}</Typography>
                  </TableCell>
                  <TableCell align="center">{result.driverName}</TableCell>
                  <TableCell align="center">{result.licenseNumber}</TableCell>
                  <TableCell align="center">
                    <Chip
                      label={formatDate(result.testDate)}
                      color="secondary"
                      variant="outlined"
                      sx={{ fontWeight: "bold", fontSize: 15 }}
                    />
                  </TableCell>
                  <TableCell align="center">{result.testType}</TableCell>
                  <TableCell align="center">
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
                  <TableCell align="center">
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
                  <TableCell align="center">
                    <Typography fontWeight="medium">{result.caseNumber}</Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip title="View Details">
                      <IconButton 
                        onClick={() => handleView(result)}
                        color="primary"
                        size="small"
                      >
                        <Visibility />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Download">
                      <IconButton 
                        onClick={() => handleOpenDownload(result)}
                        color="secondary"
                        size="small"
                      >
                        <Download />
                      </IconButton>
                    </Tooltip>
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
          Result Details
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Box sx={{ mb: 3 }}>
            <Typography gutterBottom sx={{ fontWeight: "bold", color: "#003366" }}>
              <strong>Company Name:</strong> {selectedResult?.companyName}
            </Typography>
            <Typography gutterBottom sx={{ fontWeight: "bold", color: "#003366" }}>
              <strong>Name:</strong> {selectedResult?.driverName}
            </Typography>
            <Typography gutterBottom sx={{ fontWeight: "bold", color: "#003366" }}>
              <strong>License Number:</strong> {selectedResult?.licenseNumber}
            </Typography>
            <Typography gutterBottom sx={{ fontWeight: "bold", color: "#003366" }}>
              <strong>Date:</strong> {formatDate(selectedResult?.testDate)}
            </Typography>
            <Typography gutterBottom sx={{ fontWeight: "bold", color: "#003366" }}>
              <strong>Test Type:</strong> {selectedResult?.testType}
            </Typography>
            <Typography gutterBottom sx={{ fontWeight: "bold", color: "#003366" }}>
              <strong>Order Status:</strong> {selectedResult?.orderStatus}
            </Typography>
            <Typography gutterBottom sx={{ fontWeight: "bold", color: "#003366" }}>
              <strong>Result Status:</strong> {selectedResult?.resultStatus}
            </Typography>
            <Typography gutterBottom sx={{ fontWeight: "bold", color: "#003366" }}>
              <strong>Case Number:</strong> {selectedResult?.caseNumber}
            </Typography>
          </Box>

          {selectedResult?.resultImages?.length > 0 ? (
            selectedResult.resultImages.map((file, i) => {
              const url = file.url;
              const isPDF = url?.startsWith("data:application/pdf");
              
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
                  ) : (
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
                  )}
                </Box>
              );
            })
          ) : (
            <Typography sx={{ mt: 2, fontStyle: "italic", textAlign: "center", color: "text.secondary" }}>
              No image available to show.
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
          Select file to download
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
    </>
  );
}