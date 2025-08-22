import React, { useState, useEffect, useContext, useMemo } from "react";
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
  Pagination,
  useMediaQuery,
  Card,
  CardContent,
  Grid,
  Collapse,
  CircularProgress
} from "@mui/material";
import { 
  Visibility, 
  Download, 
  Refresh, 
  ExpandMore, 
  ExpandLess 
} from "@mui/icons-material";
import HomeContext from "../../../Context/ClientSide/AfterLogin/Home/HomeContext";
import dayjs from "dayjs";
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';

const PAGE_SIZE = 10;
const STATUS_OPTIONS = ["All", "Positive", "Negative", "Pending"];
const ORDER_STATUS_OPTIONS = ["All", "Pending", "Completed"];

export default function Result() {
  const { userData } = useContext(HomeContext);
  const isTablet = useMediaQuery("(max-width:1200px)");
  const isMobile = useMediaQuery("(max-width:768px)");

  // State management
  const [searchTerm, setSearchTerm] = useState("");
  const [resultStatus, setResultStatus] = useState("All");
  const [orderStatus, setOrderStatus] = useState("All");
  const [page, setPage] = useState(1);
  const [range, setRange] = useState({ from: undefined, to: undefined });
  const [showCalendar, setShowCalendar] = useState(false);
  const [expandedCard, setExpandedCard] = useState(null);
  const [loading, setLoading] = useState(false);

  // Modal states
  const [openViewModal, setOpenViewModal] = useState(false);
  const [openDownloadModal, setOpenDownloadModal] = useState(false);
  const [selectedResult, setSelectedResult] = useState(null);

  // Get results from context
  const results = useMemo(() => {
    return userData?.results || [];
  }, [userData?.results]);

  // Optimized filtering
  const filteredResults = useMemo(() => {
    if (!results.length) return [];
    
    let filtered = results.filter((r) => {
      const nameMatch = r.driverName?.toLowerCase().includes(searchTerm.toLowerCase());
      return nameMatch;
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
        const testDate = dayjs(r.date);
        return testDate.isAfter(dayjs(range.from).subtract(1, 'day')) &&
          testDate.isBefore(dayjs(range.to).add(1, 'day'));
      });
    }

    return filtered;
  }, [results, searchTerm, resultStatus, orderStatus, range]);

  // Pagination
  const paginatedResults = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredResults.slice(start, start + PAGE_SIZE);
  }, [filteredResults, page]);

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
      if (file.url && file.url.startsWith('data:')) {
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
  };

  const formatDate = (date) => {
    if (!date) return "-";
    return dayjs(date).format("DD MMM YYYY");
  };

  const getStatusColor = (status) => {
    if (!status) return "warning";
    const s = status.toLowerCase();
    if (s === "negative" || s === "completed") return "success";
    if (s === "positive") return "error";
    return "warning";
  };

  const handleCardExpand = (index) => {
    setExpandedCard(expandedCard === index ? null : index);
  };

  // Mobile Card View
  const renderMobileView = () => (
    <Box sx={{ mt: 2 }}>
      {paginatedResults.map((result, index) => (
        <Card key={index} sx={{ mb: 2, boxShadow: 2 }}>
          <CardContent>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 1 }}>
              <Typography variant="h6" sx={{ fontWeight: "bold", color: "#003366" }}>
                {result.driverName}
              </Typography>
              <Box>
                <Tooltip title="View Details">
                  <IconButton size="small" onClick={() => handleView(result)} color="primary">
                    <Visibility />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Download">
                  <IconButton size="small" onClick={() => handleOpenDownload(result)} color="secondary">
                    <Download />
                  </IconButton>
                </Tooltip>
                <IconButton size="small" onClick={() => handleCardExpand(index)}>
                  {expandedCard === index ? <ExpandLess /> : <ExpandMore />}
                </IconButton>
              </Box>
            </Box>
            
            <Box sx={{ display: "flex", gap: 1, mb: 1, flexWrap: "wrap" }}>
              <Chip 
                label={result.testType || "N/A"} 
                color="info" 
                variant="outlined" 
                size="small"
              />
              <Chip 
                label={result.resultStatus || "N/A"} 
                color={getStatusColor(result.resultStatus)}
                variant="filled"
                size="small"
                sx={{ fontWeight: "bold" }}
              />
            </Box>

            <Typography variant="body2" color="text.secondary">
              Case: {result.caseNumber} • {formatDate(result.date)}
            </Typography>

            <Collapse in={expandedCard === index}>
              <Box sx={{ mt: 2, pt: 2, borderTop: "1px solid #eee" }}>
                <Typography variant="body2"><strong>License #:</strong> {result.licenseNumber}</Typography>
                <Typography variant="body2" sx={{ mt: 0.5 }}>
                  <strong>Order Status:</strong>{" "}
                  <Chip 
                    label={result.orderStatus || "N/A"} 
                    color={getStatusColor(result.orderStatus)}
                    variant="filled"
                    size="small"
                    sx={{ fontWeight: "bold" }}
                  />
                </Typography>
              </Box>
            </Collapse>
          </CardContent>
        </Card>
      ))}
    </Box>
  );

  if (loading) {
    return (
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 300 }}>
        <CircularProgress color="primary" size={60} />
        <Typography sx={{ mt: 2, fontWeight: "bold", color: "#1976d2" }}>Loading Results...</Typography>
      </Box>
    );
  }

  return (
    <div className="container" style={{ marginTop: 100 }}>
      <Typography 
        variant="h3" 
        align="center" 
        gutterBottom
        sx={{ 
          fontWeight: "bold", 
          background: "linear-gradient(90deg, #003366 60%, #1976d2 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          mb: 4
        }}
      >
        My Test Results
      </Typography>

      <TableContainer component={Paper} sx={{
        mt: 3, p: 2, borderRadius: 3, boxShadow: 6,
        background: "linear-gradient(135deg, #e3f2fd 0%, #f5f5f5 100%)"
      }}>
        {/* Filters */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
            flexWrap: "wrap",
            gap: 2
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
            Results ({filteredResults.length})
          </Typography>
          
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap" }}>
            <TextField
              size="small"
              label="Search Name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{ minWidth: 180 }}
            />
            
            {!isMobile && (
              <>
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
              </>
            )}
            
            <Tooltip title="Reset Filters">
              <IconButton onClick={handleResetFilters} color="info">
                <Refresh />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {/* Mobile filters */}
        {isMobile && (
          <Box sx={{ mb: 2, display: "flex", gap: 1, flexWrap: "wrap" }}>
            <FormControl size="small" sx={{ minWidth: 80, flex: 1 }}>
              <InputLabel>Result</InputLabel>
              <Select
                value={resultStatus}
                label="Result"
                onChange={(e) => { setResultStatus(e.target.value); setPage(1); }}
              >
                {STATUS_OPTIONS.map((status) => (
                  <MenuItem key={status} value={status}>{status}</MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <FormControl size="small" sx={{ minWidth: 80, flex: 1 }}>
              <InputLabel>Order</InputLabel>
              <Select
                value={orderStatus}
                label="Order"
                onChange={(e) => { setOrderStatus(e.target.value); setPage(1); }}
              >
                {ORDER_STATUS_OPTIONS.map((status) => (
                  <MenuItem key={status} value={status}>{status}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        )}

        {/* Content */}
        {isMobile ? (
          renderMobileView()
        ) : (
          <Table stickyHeader>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#003366" }}>
                <TableCell align="center" sx={{ color: "#003366", background: "#e3f2fd", fontWeight: "bold", fontSize: 16 }}>Sr</TableCell>
                <TableCell align="center" sx={{ color: "#003366", background: "#e3f2fd", fontWeight: "bold", fontSize: 16 }}>Driver Name</TableCell>
                {!isTablet && <TableCell align="center" sx={{ color: "#003366", background: "#e3f2fd", fontWeight: "bold", fontSize: 16 }}>License #</TableCell>}
                {!isTablet && <TableCell align="center" sx={{ color: "#003366", background: "#e3f2fd", fontWeight: "bold", fontSize: 16 }}>Test Date</TableCell>}
                <TableCell align="center" sx={{ color: "#003366", background: "#e3f2fd", fontWeight: "bold", fontSize: 16 }}>Test Type</TableCell>
                <TableCell align="center" sx={{ color: "#003366", background: "#e3f2fd", fontWeight: "bold", fontSize: 16 }}>Result Status</TableCell>
                <TableCell align="center" sx={{ color: "#003366", background: "#e3f2fd", fontWeight: "bold", fontSize: 16 }}>Order Status</TableCell>
                {!isTablet && <TableCell align="center" sx={{ color: "#003366", background: "#e3f2fd", fontWeight: "bold", fontSize: 16 }}>Case Number</TableCell>}
                <TableCell align="center" sx={{ color: "#003366", background: "#e3f2fd", fontWeight: "bold", fontSize: 16 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedResults.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={isTablet ? 6 : 9} align="center">
                    <Typography color="text.secondary" sx={{ py: 4 }}>
                      No results found.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedResults.map((result, index) => (
                  <TableRow key={index} hover>
                    <TableCell align="center">
                      {(page - 1) * PAGE_SIZE + index + 1}
                    </TableCell>
                    <TableCell align="center">
                      <Typography fontWeight="bold">{result.driverName}</Typography>
                    </TableCell>
                    {!isTablet && <TableCell align="center">{result.licenseNumber}</TableCell>}
                    {!isTablet && (
                      <TableCell align="center">
                        <Chip
                          label={formatDate(result.date)}
                          color="secondary"
                          variant="outlined"
                          sx={{ fontWeight: "bold", fontSize: 15 }}
                        />
                      </TableCell>
                    )}
                    <TableCell align="center">{result.testType}</TableCell>
                    <TableCell align="center">
                      <Chip
                        label={result.resultStatus || "N/A"}
                        color={getStatusColor(result.resultStatus)}
                        variant="filled"
                        sx={{ fontWeight: "bold" }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={result.orderStatus || "N/A"}
                        color={getStatusColor(result.orderStatus)}
                        variant="filled"
                        sx={{ fontWeight: "bold" }}
                      />
                    </TableCell>
                    {!isTablet && (
                      <TableCell align="center">
                        <Typography fontWeight="medium">{result.caseNumber}</Typography>
                      </TableCell>
                    )}
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
        )}

        {/* Pagination */}
        <Stack direction="row" justifyContent="center" alignItems="center" sx={{ mt: 2 }}>
          <Pagination
            count={Math.ceil(filteredResults.length / PAGE_SIZE)}
            page={page}
            onChange={(_, value) => setPage(value)}
            color="primary"
            shape="rounded"
            showFirstButton
            showLastButton
            size={isMobile ? "small" : "medium"}
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
              <strong>Name:</strong> {selectedResult?.driverName}
            </Typography>
            <Typography gutterBottom sx={{ fontWeight: "bold", color: "#003366" }}>
              <strong>License Number:</strong> {selectedResult?.licenseNumber}
            </Typography>
            <Typography gutterBottom sx={{ fontWeight: "bold", color: "#003366" }}>
              <strong>Date:</strong> {formatDate(selectedResult?.date)}
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
              const isPDF = file.mimeType === "application/pdf" || url?.startsWith("data:application/pdf");
              
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
    </div>
  );
}