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
import axios from "axios";
import dayjs from "dayjs";
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';

const API_URL = process.env.REACT_APP_API_URL;
const PAGE_SIZE = 10;
const STATUS_OPTIONS = ["All", "Positive", "Negative", "Pending"];
const ORDER_STATUS_OPTIONS = ["All", "Pending", "Completed"];
const SORT_OPTIONS = ["Alphabetical (A-Z)", "Alphabetical (Z-A)", "Newest First", "Oldest First"];

let cachedResults = null;

function DisplayResult() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [resultStatus, setResultStatus] = useState("All");
  const [orderStatus, setOrderStatus] = useState("All");
  const [sortOption, setSortOption] = useState("Newest First"); // Default to Newest First
  const [page, setPage] = useState(1);

  const [range, setRange] = useState({ from: undefined, to: undefined });
  const [showCalendar, setShowCalendar] = useState(false);

  const [openViewModal, setOpenViewModal] = useState(false);
  const [openDownloadModal, setOpenDownloadModal] = useState(false);
  const [selectedResult, setSelectedResult] = useState(null);

  const [selectedIds, setSelectedIds] = useState([]);
  const [showRemoveDialog, setShowRemoveDialog] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  // Only fetch once and cache results
  useEffect(() => {
    let isMounted = true;
    if (cachedResults) {
      setResults(cachedResults);
      setLoading(false);
      setInitialLoading(false);
    } else {
      setLoading(true);
      axios.get(`${API_URL}/admin/getAllResult`)
        .then(res => {
          if (isMounted) {
            setResults(res.data.data || []);
            cachedResults = res.data.data || [];
          }
        })
        .catch(err => {
          if (isMounted) {
            console.error("Error fetching results:", err);
          }
        })
        .finally(() => {
          if (isMounted) {
            setLoading(false);
            setInitialLoading(false);
          }
        });
    }
    return () => { isMounted = false; };
  }, []);

  const handleSortOptionChange = (event) => {
    setSortOption(event.target.value);
    setPage(1);
  };

  // Enhanced filtering and sorting with alphabetical and date options
  const filteredAndSortedResults = useMemo(() => {
    let filtered = results.filter(
      (r) =>
        r.driverName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.companyName?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
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

    // Enhanced sorting with multiple options
    filtered.sort((a, b) => {
      switch (sortOption) {
        case "Alphabetical (A-Z)":
          const companyA = (a.companyName || '').toLowerCase();
          const companyB = (b.companyName || '').toLowerCase();
          if (companyA < companyB) return -1;
          if (companyA > companyB) return 1;
          return 0;
        
        case "Alphabetical (Z-A)":
          const companyA2 = (a.companyName || '').toLowerCase();
          const companyB2 = (b.companyName || '').toLowerCase();
          if (companyA2 > companyB2) return -1;
          if (companyA2 < companyB2) return 1;
          return 0;
        
        case "Newest First":
          const dateA = dayjs(a.testDate);
          const dateB = dayjs(b.testDate);
          return dateB.diff(dateA); // Newer dates first
        
        case "Oldest First":
          const dateA2 = dayjs(a.testDate);
          const dateB2 = dayjs(b.testDate);
          return dateA2.diff(dateB2); // Older dates first
        
        default:
          return 0;
      }
    });

    return filtered;
  }, [results, searchTerm, resultStatus, orderStatus, range, sortOption]);

  // Pagination
  const paginatedResults = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredAndSortedResults.slice(start, start + PAGE_SIZE);
  }, [filteredAndSortedResults, page]);

  // Selection logic using caseNumber
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

const confirmRemove = async () => {
  try {
    // Create promises for deleting each selected result
    const deletePromises = selectedIds.map(async (caseNumber) => {
      // Find the result to get its ID and userId
      const resultToDelete = results.find(r => r.caseNumber === caseNumber);
      if (!resultToDelete) return;
      
      // Make API call to delete the result
      return axios.post(`${API_URL}/admin/deleteResult`, {
        currentId: resultToDelete.userId,
        resultId: resultToDelete._id
      });
    });
    
    // Wait for all deletions to complete
    await Promise.all(deletePromises);
    
    // Update the local state by removing deleted results
    const updatedResults = results.filter(r => !selectedIds.includes(r.caseNumber));
    setResults(updatedResults);
    
    // Update cached results
    cachedResults = updatedResults;
    
    // Clear selections and close dialog
    setSelectedIds([]);
    setShowRemoveDialog(false);
    
    console.log('Results deleted successfully');
    
  } catch (error) {
    console.error('Error deleting results:', error);
    alert('Error deleting results. Please try again.');
  }
};

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
      const base64Data = file.url.split(",")[1];
      const byteArray = Uint8Array.from(atob(base64Data), (c) =>
        c.charCodeAt(0)
      );
      const blobType = file.url.match(/^data:(.+);base64/)?.[1] || "application/octet-stream";
      const blob = new Blob([byteArray], { type: blobType });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = file.filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("Error downloading file:", err);
    }
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    setResultStatus("All");
    setOrderStatus("All");
    setSortOption("Newest First");
    setRange({ from: undefined, to: undefined });
    setPage(1);
    setSelectedIds([]);
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
    <Box>
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
        mt: 3, 
        p: 2, 
        borderRadius: 3, 
        boxShadow: 6,
        background: "linear-gradient(135deg, #e3f2fd 0%, #f5f5f5 100%)"
      }}>
        <Box
          sx={{
            mb: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 2
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
            Result List
          </Typography>
          
          {/* Filters Row */}
          <Box sx={{ 
            display: "flex", 
            alignItems: "center", 
            gap: 2, 
            flexWrap: "wrap",
            width: "100%",
            justifyContent: "flex-end"
          }}>
            <TextField
              size="small"
              label="Search Name/Company"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{ minWidth: 180 }}
            />
            
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
            
            {/* New Sort Options */}
            <FormControl size="small" sx={{ minWidth: 180 }}>
              <InputLabel>Sort By</InputLabel>
              <Select
                value={sortOption}
                label="Sort By"
                onChange={handleSortOptionChange}
              >
                {SORT_OPTIONS.map((option) => (
                  <MenuItem key={option} value={option}>{option}</MenuItem>
                ))}
              </Select>
            </FormControl>
            
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
            
            <Button
              variant="contained"
              color="error"
              startIcon={<Download />}
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

        {/* Selected count indicator */}
        {selectedIds.length > 0 && (
          <Box sx={{ mb: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Chip
              label={`${selectedIds.length} result${selectedIds.length > 1 ? 's' : ''} selected`}
              color="primary"
              variant="outlined"
            />
            <Typography variant="body2" color="text.secondary">
              Current sort: {sortOption}
            </Typography>
          </Box>
        )}
        
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
              <TableCell align="center" sx={{ color: "#003366", background: "#e3f2fd", fontWeight: "bold", fontSize: 16 }}>
                Company Name
                {(sortOption.includes("Alphabetical")) && (
                  <Box component="span" sx={{ ml: 1, fontSize: 12, opacity: 0.7 }}>
                    ({sortOption})
                  </Box>
                )}
              </TableCell>
              <TableCell align="center" sx={{ color: "#003366", background: "#e3f2fd", fontWeight: "bold", fontSize: 16 }}>Name</TableCell>
              <TableCell align="center" sx={{ color: "#003366", background: "#e3f2fd", fontWeight: "bold", fontSize: 16 }}>License #</TableCell>
              <TableCell align="center" sx={{ color: "#003366", background: "#e3f2fd", fontWeight: "bold", fontSize: 16 }}>
                Test Date
                {(sortOption === "Newest First" || sortOption === "Oldest First") && (
                  <Box component="span" sx={{ ml: 1, fontSize: 12, opacity: 0.7 }}>
                    ({sortOption})
                  </Box>
                )}
              </TableCell>
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
                  <Typography color="text.secondary">No results found matching your criteria.</Typography>
                </TableCell>
              </TableRow>
            ) : (
              paginatedResults.map((result, index) => (
                <TableRow key={result.caseNumber} hover>
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
                  <TableCell align="center">{result.companyName}</TableCell>
                  <TableCell align="center">
                    <Typography fontWeight="bold">{result.driverName}</Typography>
                  </TableCell>
                  <TableCell align="center">{result.licenseNumber}</TableCell>
                  <TableCell align="center">
                    <Chip
                      label={result.testDate ? dayjs(result.testDate).format("DD MMM YYYY") : "-"}
                      color="secondary"
                      variant="outlined"
                      sx={{ fontWeight: "bold", fontSize: 12 }}
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
                          ? "error"
                          : result.orderStatus?.toLowerCase() === "completed"
                          ? "success"
                          : "warning"
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
                      <IconButton onClick={() => handleView(result)} color="primary">
                        <Visibility />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Download">
                      <IconButton onClick={() => handleOpenDownload(result)} color="secondary">
                        <Download />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Showing {Math.min((page - 1) * PAGE_SIZE + 1, filteredAndSortedResults.length)} - {Math.min(page * PAGE_SIZE, filteredAndSortedResults.length)} of {filteredAndSortedResults.length} results
            {selectedIds.length > 0 && ` | ${selectedIds.length} selected`}
          </Typography>
          <Pagination
            count={Math.ceil(filteredAndSortedResults.length / PAGE_SIZE)}
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
      <Dialog open={openViewModal} onClose={handleCloseView} maxWidth="sm" fullWidth>
        <DialogTitle>Result Details</DialogTitle>
        <DialogContent>
          <Typography gutterBottom>
            <strong>Name:</strong> {selectedResult?.driverName}
          </Typography>
          <Typography gutterBottom>
            <strong>License Number:</strong> {selectedResult?.licenseNumber}
          </Typography>
          <Typography gutterBottom>
            <strong>Company Name:</strong> {selectedResult?.companyName}
          </Typography>
          <Typography gutterBottom>
            <strong>Date:</strong>{" "}
            {selectedResult?.testDate
              ? dayjs(selectedResult.testDate).format("DD MMM YYYY")
              : ""}
          </Typography>
          <Typography gutterBottom>
            <strong>Test Type:</strong> {selectedResult?.testType}
          </Typography>

          {selectedResult?.resultImages?.length > 0 ? (
            selectedResult.resultImages.map((file, i) => {
              const url = file.url;
              const isPDF = url.startsWith("data:application/pdf");
              return isPDF ? (
                <iframe
                  key={i}
                  src={url}
                  title={file.filename}
                  width="100%"
                  height="500px"
                  style={{ borderRadius: 8, marginTop: "1rem" }}
                />
              ) : (
                <Box
                  key={i}
                  component="img"
                  src={url}
                  alt={file.filename}
                  sx={{ width: "100%", borderRadius: 1, mt: 2 }}
                />
              );
            })
          ) : (
            <Typography sx={{ mt: 2, fontStyle: "italic" }}>
              No image available to show.
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseView}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Download Modal */}
      <Dialog open={openDownloadModal} onClose={handleCloseDownload}>
        <DialogTitle>Select file to download</DialogTitle>
        <DialogContent dividers>
          {selectedResult?.resultImages?.length > 0 ? (
            selectedResult.resultImages.map((file, i) => (
              <Button
                key={i}
                fullWidth
                sx={{ mb: 1 }}
                onClick={() => {
                  downloadFile(file);
                  handleCloseDownload();
                }}
              >
                {file.filename}
              </Button>
            ))
          ) : (
            <Typography>No files available for download.</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDownload}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default DisplayResult;