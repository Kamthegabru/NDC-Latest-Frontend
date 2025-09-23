import React, { useEffect, useState, useMemo } from 'react';
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import {
  Box, CircularProgress, FormControl, InputLabel, MenuItem,
  Paper, Select, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Typography, TextField, Chip, Tooltip,
  IconButton, Pagination, Stack, Checkbox, Button, Dialog,
  DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import { Refresh } from '@mui/icons-material';
import DeleteIcon from '@mui/icons-material/Delete';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import dayjs from 'dayjs';

const API_URL = process.env.REACT_APP_API_URL;
const PAGE_SIZE = 10;
const SORT_OPTIONS = ["Alphabetical (A-Z)", "Alphabetical (Z-A)", "Newest First", "Oldest First"];
const STATUS_OPTIONS = ["All", "Completed", "Pending", "Scheduled"];

function ShowRandom() {
  const [randomUserDetails, setRandomUserDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filter states
  const [yearFilter, setYearFilter] = useState("All");
  const [quarterFilter, setQuarterFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortOption, setSortOption] = useState("Alphabetical (A-Z)");
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [range, setRange] = useState({ from: undefined, to: undefined });
  const [showCalendar, setShowCalendar] = useState(false);
  
  // Selection states
  const [selectedIds, setSelectedIds] = useState([]);
  const [showRemoveDialog, setShowRemoveDialog] = useState(false);

  useEffect(() => {
    const load = async () => {
      const token = Cookies.get("token");
      try {
        setLoading(true);
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        const response = await axios.get(`${API_URL}/agency/fetchRandomData`);
        setRandomUserDetails(response.data.data || []);
      } catch (error) {
        console.error("Error fetching random data:", error);
        toast.error("Server error, Please try again later");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleSortOptionChange = (event) => {
    setSortOption(event.target.value);
    setPage(1);
  };

  // Get unique values for dropdowns
  const uniqueYears = useMemo(() => 
    ["All", ...new Set(randomUserDetails?.map(item => item.year).filter(Boolean))],
    [randomUserDetails]
  );
  
  const uniqueQuarters = useMemo(() => 
    ["All", ...new Set(randomUserDetails?.map(item => item.quarter).filter(Boolean))],
    [randomUserDetails]
  );

  // Enhanced filtering and sorting
  const filteredAndSortedData = useMemo(() => {
    if (!randomUserDetails?.length) return [];

    let filtered = randomUserDetails.filter(item => {
      const matchYear = yearFilter === "All" || item.year === yearFilter;
      const matchQuarter = quarterFilter === "All" || item.quarter === quarterFilter;
      const matchStatus = statusFilter === "All" || item.status === statusFilter;
      
      const companyMatch = item.company?.name?.toLowerCase().includes(searchTerm.toLowerCase());
      const driverMatch = item.driver?.name?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchSearch = searchTerm === "" || companyMatch || driverMatch;
      
      return matchYear && matchQuarter && matchStatus && matchSearch;
    });

    // Date range filter (assuming there's a createdAt or testDate field)
    if (range.from && range.to && filtered.length > 0) {
      filtered = filtered.filter((item) => {
        // You may need to adjust this based on your actual date field
        const itemDate = dayjs(item.createdAt || item.testDate);
        if (!itemDate.isValid()) return true;
        return itemDate.isAfter(dayjs(range.from).subtract(1, 'day')) &&
          itemDate.isBefore(dayjs(range.to).add(1, 'day'));
      });
    }

    // Enhanced sorting
    filtered.sort((a, b) => {
      switch (sortOption) {
        case "Alphabetical (A-Z)":
          const companyA = (a.company?.name || '').toLowerCase();
          const companyB = (b.company?.name || '').toLowerCase();
          if (companyA < companyB) return -1;
          if (companyA > companyB) return 1;
          return 0;
        
        case "Alphabetical (Z-A)":
          const companyA2 = (a.company?.name || '').toLowerCase();
          const companyB2 = (b.company?.name || '').toLowerCase();
          if (companyA2 > companyB2) return -1;
          if (companyA2 < companyB2) return 1;
          return 0;
        
        case "Newest First":
          // Assuming there's a createdAt or testDate field
          const dateA = dayjs(a.createdAt || a.testDate);
          const dateB = dayjs(b.createdAt || b.testDate);
          if (!dateA.isValid() || !dateB.isValid()) return 0;
          return dateB.diff(dateA);
        
        case "Oldest First":
          const dateA2 = dayjs(a.createdAt || a.testDate);
          const dateB2 = dayjs(b.createdAt || b.testDate);
          if (!dateA2.isValid() || !dateB2.isValid()) return 0;
          return dateA2.diff(dateB2);
        
        default:
          return 0;
      }
    });

    return filtered;
  }, [randomUserDetails, yearFilter, quarterFilter, statusFilter, searchTerm, sortOption, range]);

  // Pagination
  const paginatedData = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredAndSortedData.slice(start, start + PAGE_SIZE);
  }, [filteredAndSortedData, page]);

  // Selection handlers
  const handleSelect = (itemId) => {
    setSelectedIds((prev) =>
      prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]
    );
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedIds([
        ...selectedIds.filter(id => !paginatedData.some(item => item._id === id)),
        ...paginatedData.map(item => item._id || Math.random())
      ]);
    } else {
      setSelectedIds(selectedIds.filter(id => !paginatedData.some(item => item._id === id)));
    }
  };

  const handleRemoveSelected = () => {
    setShowRemoveDialog(true);
  };

  const confirmRemove = () => {
    // API call to remove selected items would go here
    console.log("Removing selected items:", selectedIds);
    setSelectedIds([]);
    setShowRemoveDialog(false);
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    setYearFilter("All");
    setQuarterFilter("All");
    setStatusFilter("All");
    setSortOption("Alphabetical (A-Z)");
    setRange({ from: undefined, to: undefined });
    setPage(1);
    setSelectedIds([]);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Completed": return "success";
      case "Pending": return "warning";
      case "Scheduled": return "info";
      default: return "default";
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 300 }}>
        <CircularProgress color="primary" size={60} />
        <Typography sx={{ mt: 2, fontWeight: "bold", color: "#1976d2" }}>Loading Random Users...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      {/* Remove Dialog */}
      <Dialog open={showRemoveDialog} onClose={() => setShowRemoveDialog(false)}>
        <DialogTitle>Confirm Removal</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to remove the selected item(s)?
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
            Random Users
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
              label="Search Company/Driver"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{ minWidth: 180 }}
            />
            
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Year</InputLabel>
              <Select
                value={yearFilter}
                label="Year"
                onChange={(e) => { setYearFilter(e.target.value); setPage(1); }}
              >
                {uniqueYears.map((year, i) => (
                  <MenuItem key={i} value={year}>{year}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Quarter</InputLabel>
              <Select
                value={quarterFilter}
                label="Quarter"
                onChange={(e) => { setQuarterFilter(e.target.value); setPage(1); }}
              >
                {uniqueQuarters.map((qtr, i) => (
                  <MenuItem key={i} value={qtr}>{qtr}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Status</InputLabel>
              <Select
                value={statusFilter}
                label="Status"
                onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
              >
                {STATUS_OPTIONS.map((status) => (
                  <MenuItem key={status} value={status}>{status}</MenuItem>
                ))}
              </Select>
            </FormControl>
            
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

        {/* Selected count indicator */}
        {selectedIds.length > 0 && (
          <Box sx={{ mb: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Chip
              label={`${selectedIds.length} item${selectedIds.length > 1 ? 's' : ''} selected`}
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
                    paginatedData.length > 0 &&
                    paginatedData.every(item => selectedIds.includes(item._id || Math.random()))
                  }
                  indeterminate={
                    paginatedData.some(item => selectedIds.includes(item._id || Math.random())) &&
                    !paginatedData.every(item => selectedIds.includes(item._id || Math.random()))
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
              <TableCell align="center" sx={{ color: "#003366", background: "#e3f2fd", fontWeight: "bold", fontSize: 16 }}>Driver Name</TableCell>
              <TableCell align="center" sx={{ color: "#003366", background: "#e3f2fd", fontWeight: "bold", fontSize: 16 }}>Year</TableCell>
              <TableCell align="center" sx={{ color: "#003366", background: "#e3f2fd", fontWeight: "bold", fontSize: 16 }}>Quarter</TableCell>
              <TableCell align="center" sx={{ color: "#003366", background: "#e3f2fd", fontWeight: "bold", fontSize: 16 }}>Test Type</TableCell>
              <TableCell align="center" sx={{ color: "#003366", background: "#e3f2fd", fontWeight: "bold", fontSize: 16 }}>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  <Typography color="text.secondary">No data found matching your criteria.</Typography>
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((item, index) => (
                <TableRow key={item._id || index} hover>
                  <TableCell align="center">
                    <Checkbox
                      checked={selectedIds.includes(item._id || Math.random())}
                      onChange={() => handleSelect(item._id || Math.random())}
                      color="primary"
                    />
                  </TableCell>
                  <TableCell align="center">
                    {(page - 1) * PAGE_SIZE + index + 1}
                  </TableCell>
                  <TableCell align="center">
                    <Typography fontWeight="bold">{item.company?.name || "N/A"}</Typography>
                  </TableCell>
                  <TableCell align="center">{item.driver?.name || "N/A"}</TableCell>
                  <TableCell align="center">
                    <Chip
                      label={item.year}
                      color="secondary"
                      variant="outlined"
                      sx={{ fontWeight: "bold" }}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Chip
                      label={item.quarter}
                      color="info"
                      variant="outlined"
                      sx={{ fontWeight: "bold" }}
                    />
                  </TableCell>
                  <TableCell align="center">{item.testType}</TableCell>
                  <TableCell align="center">
                    <Chip
                      label={item.status}
                      color={getStatusColor(item.status)}
                      variant="filled"
                      sx={{ fontWeight: "bold" }}
                    />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Showing {Math.min((page - 1) * PAGE_SIZE + 1, filteredAndSortedData.length)} - {Math.min(page * PAGE_SIZE, filteredAndSortedData.length)} of {filteredAndSortedData.length} items
            {selectedIds.length > 0 && ` | ${selectedIds.length} selected`}
          </Typography>
          <Pagination
            count={Math.ceil(filteredAndSortedData.length / PAGE_SIZE)}
            page={page}
            onChange={(_, value) => setPage(value)}
            color="primary"
            shape="rounded"
            showFirstButton
            showLastButton
          />
        </Stack>
      </TableContainer>
    </Box>
  );
}

export default ShowRandom;