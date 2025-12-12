import React, { useState, useEffect, useContext, useMemo } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  IconButton, Menu, MenuItem, Typography, Paper, Box, CircularProgress,
  FormControl, Select, InputLabel, MenuItem as SelectItem,
  Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField,
  Chip, Tooltip, Checkbox, Pagination, Stack
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Refresh } from '@mui/icons-material';
import DeleteIcon from '@mui/icons-material/Delete';
import ScheduleIcon from '@mui/icons-material/Schedule';
import RandomContext from '../../../Context/Agency/Random/RandomContext';
import AddRandom from './AddRandom';
import ExportRandom from './ExportRandom';
import { toast } from 'react-toastify';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import dayjs from 'dayjs';
import RescheduleOrder from '../Result/RescheduleOrder';
import CloseIcon from '@mui/icons-material/Close';
import { toProperCase, toUpperCase } from '../../Utils/formatText';

const PAGE_SIZE = 10;
const SORT_OPTIONS = ["Alphabetical (A-Z)", "Alphabetical (Z-A)", "Newest First", "Oldest First"];
const STATUS_OPTIONS = ["All", "Completed", "Pending", "Scheduled"];

function ShowRandom() {
  const {
    randomUserDetails,
    deleteRandomEntry,
    fetchRandomData,
    updateRandomStatus,
    yearFilter,
    setYearFilter,
    quarterFilter,
    setQuarterFilter,
    sendEmailToRandomDriver,
    getScheduleDataFromRandom,
    linkRandomToResult
  } = useContext(RandomContext);

  // Existing states
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [statusValue, setStatusValue] = useState('');
  const [emailOpen, setEmailOpen] = useState(false);
  const [ccEmail, setCcEmail] = useState("");

  // New enhanced filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortOption, setSortOption] = useState("Alphabetical (A-Z)");
  const [page, setPage] = useState(1);
  const [range, setRange] = useState({ from: undefined, to: undefined });
  const [showCalendar, setShowCalendar] = useState(false);

  // Selection states
  const [selectedIds, setSelectedIds] = useState([]);
  const [showBulkDeleteDialog, setShowBulkDeleteDialog] = useState(false);

  // Schedule states
  const [scheduleLoading, setScheduleLoading] = useState(false);
  const [schedulePrefill, setSchedulePrefill] = useState(null);
  const [scheduleTarget, setScheduleTarget] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      await fetchRandomData();
      setLoading(false);
    };
    fetchData();
  }, [fetchRandomData]);

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

    // Date range filter
    if (range.from && range.to && filtered.length > 0) {
      filtered = filtered.filter((item) => {
        const itemDate = dayjs(item.createdAt || item.testDate);
        if (!itemDate.isValid()) return true;
        return itemDate.isAfter(dayjs(range.from).subtract(1, 'day')) &&
          itemDate.isBefore(dayjs(range.to).add(1, 'day'));
      });
    }

    // Quarter priority mapping (Q4 = 4, Q3 = 3, Q2 = 2, Q1 = 1)
    const getQuarterPriority = (quarter) => {
      const qMap = { 'Q4': 4, 'Q3': 3, 'Q2': 2, 'Q1': 1 };
      return qMap[quarter] || 0;
    };

    // Enhanced sorting
    filtered.sort((a, b) => {
      // First, sort by quarter (current quarter first: Q4 → Q3 → Q2 → Q1)
      const quarterA = getQuarterPriority(a.quarter);
      const quarterB = getQuarterPriority(b.quarter);
      if (quarterA !== quarterB) return quarterB - quarterA;

      // Then apply user-selected sort option
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

  // Menu handlers
  const handleMenuOpen = (event, item) => {
    setMenuAnchorEl(event.currentTarget);
    setSelectedItem(item);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

  // Delete handlers
  const handleDelete = () => {
    setDeleteOpen(true);
    handleMenuClose();
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteRandomEntry({ selectedItem });
      setDeleteOpen(false);
      setSelectedItem(null);
    } catch (error) {
      toast.error("Delete failed");
    }
  };

  // Edit handlers
  const handleEdit = () => {
    setStatusValue(selectedItem?.status || 'Pending');
    setEditOpen(true);
    handleMenuClose();
  };

  const handleEditConfirm = async () => {
    try {
      const data = {
        selectedItem,
        status: statusValue
      };
      await updateRandomStatus(data);
      setEditOpen(false);
      setSelectedItem(null);
    } catch (error) {
      toast.error("Update failed");
    }
  };

  // Email handlers
  const handleSendEmail = () => {
    setCcEmail("");
    setEmailOpen(true);
    handleMenuClose();
  };

  // Schedule handler
  const handleSchedule = async () => {
    try {
      setScheduleLoading(true);
      handleMenuClose();
      const prefillData = await getScheduleDataFromRandom(selectedItem._id);
      
      console.log("[Agency Random] Prefill data received:", prefillData);
      
      // Extract first 2 characters from SSN as state (keep full SSN)
      const ssnValue = prefillData.ssnEid || "";
      const extractedState = ssnValue.length >= 2 ? ssnValue.substring(0, 2).toUpperCase() : "";
      
      const finalPrefill = {
        ...prefillData,
        ssnState: extractedState
      };
      
      console.log("[Agency Random] Final prefill with ssnState:", finalPrefill);
      
      setSchedulePrefill(finalPrefill);
      setScheduleTarget(selectedItem);
    } catch (error) {
      console.error("Schedule error:", error);
      toast.error("Failed to load schedule data");
    } finally {
      setScheduleLoading(false);
    }
  };

  const handleScheduleSuccess = async (resultId) => {
    try {
      if (resultId && scheduleTarget?._id) {
        await linkRandomToResult(scheduleTarget._id, resultId);
      }
      await updateRandomStatus({
        selectedItem: scheduleTarget,
        status: "Scheduled"
      });
      toast.success("Order scheduled successfully!");
    } catch (error) {
      console.error("Failed to update status:", error);
    } finally {
      setSchedulePrefill(null);
      setScheduleTarget(null);
    }
  };

  const handleSendEmailConfirm = async () => {
    try {
      await sendEmailToRandomDriver(selectedItem, ccEmail);
      setEmailOpen(false);
      setSelectedItem(null);
    } catch (error) {
      toast.error("Failed to send email.");
    }
  };

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

  const handleBulkDelete = () => {
    setShowBulkDeleteDialog(true);
  };

  const confirmBulkDelete = async () => {
    try {
      // API call to delete multiple items
      for (const id of selectedIds) {
        const item = randomUserDetails.find(item => item._id === id);
        if (item) {
          await deleteRandomEntry({ selectedItem: item });
        }
      }
      setSelectedIds([]);
      setShowBulkDeleteDialog(false);
      toast.success("Selected items deleted successfully");
    } catch (error) {
      toast.error("Failed to delete selected items");
    }
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
      {/* Bulk Delete Dialog */}
      <Dialog open={showBulkDeleteDialog} onClose={() => setShowBulkDeleteDialog(false)}>
        <DialogTitle>Confirm Bulk Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete {selectedIds.length} selected item(s)?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowBulkDeleteDialog(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={confirmBulkDelete} color="error" variant="contained">
            Delete All
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
            justifyContent: "space-between"
          }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap" }}>
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
                    <SelectItem key={i} value={year}>{year}</SelectItem>
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
                    <SelectItem key={i} value={qtr}>{qtr}</SelectItem>
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
                    <SelectItem key={status} value={status}>{status}</SelectItem>
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
                    <SelectItem key={option} value={option}>{option}</SelectItem>
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
                onClick={handleBulkDelete}
              >
                Remove
              </Button>
              
              <Tooltip title="Reset Filters">
                <IconButton onClick={handleResetFilters} color="info">
                  <Refresh />
                </IconButton>
              </Tooltip>
            </Box>

            <Box sx={{ display: "flex", gap: 2 }}>
              <ExportRandom />
              <AddRandom />
            </Box>
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
              <TableCell align="center" sx={{ color: "#003366", background: "#e3f2fd", fontWeight: "bold", fontSize: 16 }}>Order Status</TableCell>
              <TableCell align="center" sx={{ color: "#003366", background: "#e3f2fd", fontWeight: "bold", fontSize: 16 }}>Result Status</TableCell>
              <TableCell align="center" sx={{ color: "#003366", background: "#e3f2fd", fontWeight: "bold", fontSize: 16 }}>Action</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {paginatedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={11} align="center">
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
                    <Typography fontWeight="bold">{toUpperCase(item.company?.name) || "N/A"}</Typography>
                  </TableCell>
                  <TableCell align="center">{toProperCase(item.driver?.name) || "N/A"}</TableCell>
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
                      label={item.status || "Pending"}
                      color={getStatusColor(item.status)}
                      variant="filled"
                      sx={{ fontWeight: "bold" }}
                    />
                  </TableCell>
                  <TableCell align="center">
                    {item.orderStatus ? (
                      <Chip
                        label={item.orderStatus}
                        color={item.orderStatus === "Pending" ? "warning" : "success"}
                        variant="outlined"
                        size="small"
                      />
                    ) : (
                      <Typography color="text.secondary">-</Typography>
                    )}
                  </TableCell>
                  <TableCell align="center">
                    {item.resultStatus ? (
                      <Chip
                        label={item.resultStatus}
                        color={item.resultStatus === "Pending" ? "warning" : "success"}
                        variant="outlined"
                        size="small"
                      />
                    ) : (
                      <Typography color="text.secondary">-</Typography>
                    )}
                  </TableCell>
                  <TableCell align="center">
                    <IconButton onClick={(e) => handleMenuOpen(e, item)}>
                      <MoreVertIcon />
                    </IconButton>
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

      {/* Action Menu */}
      <Menu anchorEl={menuAnchorEl} open={Boolean(menuAnchorEl)} onClose={handleMenuClose}>
        {selectedItem?.status !== "Scheduled" && (
          <MenuItem onClick={handleSchedule}>
            <ScheduleIcon fontSize="small" sx={{ mr: 1 }} />
            Schedule
          </MenuItem>
        )}
        <MenuItem onClick={handleSendEmail}>Send Email</MenuItem>
        <MenuItem onClick={handleEdit}>Edit</MenuItem>
        <MenuItem onClick={handleDelete}>Delete</MenuItem>
      </Menu>

      {/* Delete Confirmation Modal */}
      <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent dividers>
          {selectedItem && (
            <Box>
              <Typography><strong>Company:</strong> {selectedItem.company?.name || "N/A"}</Typography>
              <Typography><strong>Driver:</strong> {selectedItem.driver?.name || "N/A"}</Typography>
              <Typography><strong>Year:</strong> {selectedItem.year}</Typography>
              <Typography><strong>Quarter:</strong> {selectedItem.quarter}</Typography>
              <Typography><strong>Test Type:</strong> {selectedItem.testType}</Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteOpen(false)}>Cancel</Button>
          <Button color="error" variant="contained" onClick={handleDeleteConfirm}>
            Confirm Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Status Modal */}
      <Dialog open={editOpen} onClose={() => setEditOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Edit Status</DialogTitle>
        <DialogContent dividers>
          <FormControl fullWidth>
            <InputLabel>Status</InputLabel>
            <Select
              value={statusValue}
              label="Status"
              onChange={(e) => setStatusValue(e.target.value)}
            >
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Scheduled">Scheduled</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleEditConfirm}
            style={{
              backgroundColor: "#002D72",
              color: "#fff",
              borderRadius: "6px",
              padding: "10px 20px",
              fontWeight: "bold",
              textTransform: "none",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
            }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Send Email Modal */}
      <Dialog open={emailOpen} onClose={() => setEmailOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Send Email</DialogTitle>
        <DialogContent dividers>
          <Typography sx={{ mb: 2 }}>
            Are you sure you want to send an email to <b>{selectedItem?.driver?.name || "this driver"}</b>?
          </Typography>
          <TextField
            label="CC Email (optional)"
            type="email"
            fullWidth
            value={ccEmail}
            onChange={(e) => setCcEmail(e.target.value)}
            variant="outlined"
            margin="dense"
            placeholder="Enter CC email address"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEmailOpen(false)}>Cancel</Button>
          <Button
            color="primary"
            variant="contained"
            onClick={handleSendEmailConfirm}
            style={{
              backgroundColor: "#1976d2",
              color: "#fff",
              borderRadius: "6px",
              padding: "8px 20px",
              fontWeight: "bold"
            }}
          >
            Send
          </Button>
        </DialogActions>
      </Dialog>

      {/* Schedule Order Modal */}
      {schedulePrefill && (
        <Box
          sx={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 1300, p: 2
          }}
        >
          <Paper
            sx={{
              position: 'relative',
              width: '90%', maxWidth: '1200px', height: '90%',
              borderRadius: 3, boxShadow: 6, overflow: 'hidden',
              display: 'flex', flexDirection: 'column'
            }}
          >
            <Box
              sx={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                background: 'linear-gradient(90deg, #003366 60%, #1976d2 100%)',
                color: 'white', px: 3, py: 2
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 'bold', letterSpacing: 1 }}>
                Schedule Order Test
              </Typography>
              <IconButton
                onClick={() => setSchedulePrefill(null)}
                sx={{ color: 'white', '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' } }}
              >
                <CloseIcon />
              </IconButton>
            </Box>
            <Box
              sx={{
                flex: 1, overflow: 'auto',
                '&::-webkit-scrollbar': { width: '6px' },
                '&::-webkit-scrollbar-track': { background: '#f1f1f1' },
                '&::-webkit-scrollbar-thumb': { background: '#888', borderRadius: '3px' },
                '&::-webkit-scrollbar-thumb:hover': { background: '#555' },
              }}
            >
              <RescheduleOrder
                key={JSON.stringify(schedulePrefill)}
                prefill={schedulePrefill}
                onRescheduleSuccess={handleScheduleSuccess}
                onClose={() => setSchedulePrefill(null)}
                rescheduleEnabled={false}
              />
            </Box>
          </Paper>
        </Box>
      )}

      {/* Loading overlay */}
      {scheduleLoading && (
        <Box
          sx={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 1400
          }}
        >
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Stack direction="row" spacing={2} alignItems="center">
              <CircularProgress size={24} />
              <Typography>Loading schedule data...</Typography>
            </Stack>
          </Paper>
        </Box>
      )}
    </Box>
  );
}

export default ShowRandom;
