// result.js  (old UI restored, latest logic preserved)
import React, { useEffect, useMemo, useState } from "react";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Button,
  Typography, CircularProgress, Paper, Box, TextField, Chip, MenuItem, Select,
  InputLabel, FormControl, Tooltip, Stack, Checkbox, Pagination, Menu,
  ListItemIcon, ListItemText
} from "@mui/material";
import {
  Visibility, Download, Refresh, MoreVert, Schedule, Close, Delete
} from "@mui/icons-material";
import axios from "axios";
import dayjs from "dayjs";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { toProperCase, toUpperCase } from "../../Utils/formatText";

// 👉 reschedule confirm + order flow (same directory)
import Reschedule from "./Reschedule";
import RescheduleOrder from "./RescheduleOrder";

const API_URL = process.env.REACT_APP_API_URL;
const PAGE_SIZE = 10;
const STATUS_OPTIONS = ["All", "Positive", "Negative", "Pending"];
const ORDER_STATUS_OPTIONS = ["All", "Pending", "Completed"];
const SORT_OPTIONS = ["Alphabetical (A-Z)", "Alphabetical (Z-A)", "Newest First", "Oldest First"];

let cachedResults = null;

function DisplayResult() {
  // ===== latest logic state (unchanged) =====
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  // filters (latest)
  const [searchTerm, setSearchTerm] = useState("");
  const [resultStatus, setResultStatus] = useState("All");
  const [orderStatus, setOrderStatus] = useState("All");
  const [sortOption, setSortOption] = useState("Newest First");
  const [page, setPage] = useState(1);

  // row actions (latest)
  const [selectedResult, setSelectedResult] = useState(null);
  const [openViewModal, setOpenViewModal] = useState(false);

  // bulk remove (latest)
  const [selectedIds, setSelectedIds] = useState([]);
  const [showRemoveDialog, setShowRemoveDialog] = useState(false);

  // 3-dot menu (latest)
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuResult, setMenuResult] = useState(null);

  // reschedule (latest)
  const [openRescheduleModal, setOpenRescheduleModal] = useState(false);
  const [reschedulePrefill, setReschedulePrefill] = useState(null);
  const [rescheduleTarget, setRescheduleTarget] = useState(null);

  // ===== UI-only extras to match old look (do not affect latest logic) =====
  const [range, setRange] = useState({ from: undefined, to: undefined });
  const [showCalendar, setShowCalendar] = useState(false);
  const [openDownloadModal, setOpenDownloadModal] = useState(false);

  // ===== initial load with cache (latest) =====
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        if (cachedResults) {
          if (mounted) setResults(cachedResults);
        } else {
          const res = await axios.get(`${API_URL}/admin/getAllResult`);
          const data = res?.data?.data || [];
          cachedResults = data;
          if (mounted) setResults(data);
        }
      } catch (e) {
        console.error("Error fetching results:", e);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  // ===== refresh (latest) =====
  const refresh = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/admin/getAllResult`);
      const data = res?.data?.data || [];
      cachedResults = data;
      setResults(data);
      setPage(1);
      setSelectedIds([]);
    } catch (e) {
      console.error("Refresh failed:", e);
    } finally {
      setLoading(false);
    }
  };

  // ===== filter & sort (latest logic preserved – no date range filter applied) =====
  const filteredAndSortedResults = useMemo(() => {
    let filtered = results.filter(
      (r) =>
        (r.driverName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (r.companyName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (r.caseNumber || "").toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (resultStatus !== "All") {
      filtered = filtered.filter(
        (r) => (r.resultStatus || "").toLowerCase() === resultStatus.toLowerCase()
      );
    }
    if (orderStatus !== "All") {
      filtered = filtered.filter(
        (r) => (r.orderStatus || "").toLowerCase() === orderStatus.toLowerCase()
      );
    }

    filtered.sort((a, b) => {
      switch (sortOption) {
        case "Alphabetical (A-Z)": {
          const A = (a.companyName || "").toLowerCase();
          const B = (b.companyName || "").toLowerCase();
          return A < B ? -1 : A > B ? 1 : 0;
        }
        case "Alphabetical (Z-A)": {
          const A = (a.companyName || "").toLowerCase();
          const B = (b.companyName || "").toLowerCase();
          return A > B ? -1 : A < B ? 1 : 0;
        }
        case "Newest First": {
          const A = dayjs(a.testDate);
          const B = dayjs(b.testDate);
          return B.diff(A);
        }
        case "Oldest First": {
          const A = dayjs(a.testDate);
          const B = dayjs(b.testDate);
          return A.diff(B);
        }
        default:
          return 0;
      }
    });
    return filtered;
  }, [results, searchTerm, resultStatus, orderStatus, sortOption]);

  const paginatedResults = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredAndSortedResults.slice(start, start + PAGE_SIZE);
  }, [filteredAndSortedResults, page]);

  // ===== selection (latest) =====
  const handleSelect = (caseNumber) => {
    setSelectedIds((prev) =>
      prev.includes(caseNumber)
        ? prev.filter((id) => id !== caseNumber)
        : [...prev, caseNumber]
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

  // ===== remove (latest) =====
  const confirmRemove = async () => {
    try {
      const deletePromises = selectedIds.map(async (caseNumber) => {
        const toDelete = results.find(r => r.caseNumber === caseNumber);
        if (!toDelete) return;
        return axios.post(`${API_URL}/admin/deleteResult`, {
          currentId: toDelete.userId,
          resultId: toDelete._id
        });
      });
      await Promise.all(deletePromises);
      const updated = results.filter(r => !selectedIds.includes(r.caseNumber));
      setResults(updated);
      cachedResults = updated;
      setSelectedIds([]);
      setShowRemoveDialog(false);
    } catch (e) {
      console.error("Error deleting results:", e);
      alert("Error deleting results. Please try again.");
    }
  };

  // ===== table row actions (latest) =====
  const handleView = (result) => { setSelectedResult(result); setOpenViewModal(true); };
  const handleCloseView = () => { setOpenViewModal(false); setSelectedResult(null); };

  // ===== 3-dot menu (latest) =====
  const handleMenuOpen = (e, result) => { setAnchorEl(e.currentTarget); setMenuResult(result); };
  const handleMenuClose = () => { setAnchorEl(null); setMenuResult(null); };

  const hasPendingStatus = (row) => {
    const resultPending = (row.resultStatus || "").toLowerCase() === "pending";
    const orderPending  = (row.orderStatus  || "").toLowerCase() === "pending";
    return resultPending || orderPending;
  };

  // ===== latest reschedule flow (no backend fetch; build prefill from row) =====
  const toISO = (v) => (v ? new Date(v).toISOString() : "");
  const buildPrefillFromRow = (row) => ({
    companyName: row.companyName || "",
    companyEmail: "",
    packageName: row.packageName || row.selectedPackageId || "",
    orderReason: row.orderReason || row.testType || row.selectedOrderReasonId || "",
    dotAgency: row.dotAgency || "",

    firstName: row.firstName || "",
    middleName: row.middleName || "",
    lastName: row.lastName || "",
    ssnEid: row.ssnEid || row.licenseNumber || "",
    dob: toISO(row.dobString || ""),
    phone1: row.phone1 || "",
    phone2: row.phone2 || "",
    observed: !!row.observedBool,
    orderExpires: row.orderExpires || "",

    addr1: row.address || "",
    addr2: row.address2 || "",
    city: row.city || "",
    stateShort: row.state || "",
    zip: row.zip || "",

    sendSchedulingLink: !!row.sendLink,
    sendDonorPass: !!row.donorPass,
    email: row.email || "",
    ccEmails: row.ccEmail || "",
  });

  const handleReschedule = () => {
    try {
      if (!menuResult) return;
      setRescheduleTarget(menuResult);
      setOpenRescheduleModal(true);
    } catch (e) {
      console.error("Reschedule bootstrap failed:", e);
      alert("Error preparing reschedule: " + e.message);
    } finally {
      handleMenuClose();
    }
  };

  const handleRescheduleSuccess = async () => {
    if (!rescheduleTarget) return;
    try {
      await axios.post(`${API_URL}/admin/deleteResult`, {
        currentId: rescheduleTarget.userId,
        resultId:  rescheduleTarget._id,
      });
      const updated = results.filter(r => r._id !== rescheduleTarget._id);
      setResults(updated);
      cachedResults = updated;
    } catch (e) {
      console.error("Failed to delete old result after reschedule:", e);
    } finally {
      setRescheduleTarget(null);
      setReschedulePrefill(null);
      setOpenRescheduleModal(false);
    }
  };

  // ===== download (latest) =====
  const downloadFile = (file) => {
    try {
      const base64Data = file.url.split(",")[1];
      const byteArray = Uint8Array.from(atob(base64Data), (c) => c.charCodeAt(0));
      const blobType = file.url.match(/^data:(.+);base64/)?.[1] || "application/octet-stream";
      const blob = new Blob([byteArray], { type: blobType });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = file.filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (err) {
      console.error("Error downloading file:", err);
    }
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    setResultStatus("All");
    setOrderStatus("All");
    setSortOption("Newest First");
    // keep range UI consistent with old look; it doesn't affect filtering (logic unchanged)
    setRange({ from: undefined, to: undefined });
    setPage(1);
    setSelectedIds([]);
  };

  if (loading && !results.length) {
    return (
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 300 }}>
        <CircularProgress color="primary" size={60} />
        <Typography sx={{ mt: 2, fontWeight: "bold", color: "#1976d2" }}>Loading Results...</Typography>
      </Box>
    );
  }

  const allCheckedOnPage =
    paginatedResults.length > 0 &&
    paginatedResults.every(r => selectedIds.includes(r.caseNumber));

  return (
    <Box>
      {/* Remove dialog (latest logic) */}
      <Dialog open={showRemoveDialog} onClose={() => setShowRemoveDialog(false)}>
        <DialogTitle>Confirm Removal</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to remove the selected result(s)?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowRemoveDialog(false)}>Cancel</Button>
          <Button color="error" variant="contained" onClick={confirmRemove}>Remove</Button>
        </DialogActions>
      </Dialog>

      {/* ===== Old UI wrapper, header, filters (visual match) ===== */}
      <TableContainer
        component={Paper}
        sx={{
          mt: 3, p: 2, borderRadius: 3, boxShadow: 6,
          background: "linear-gradient(135deg, #e3f2fd 0%, #f5f5f5 100%)"
        }}
      >
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
          <Typography
            variant="h6"
            sx={{
              fontWeight: "bold",
              color: "#fff",
              letterSpacing: 1,
              background: "linear-gradient(90deg, #003366 60%, #1976d2 100%)",
              px: 2, py: 1, borderRadius: 2, boxShadow: 2
            }}
          >
            Result List
          </Typography>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              flexWrap: "wrap",
              width: "100%",
              justifyContent: "flex-end"
            }}
          >
            <TextField
              size="small"
              label="Search Name/Company/Case"
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
              sx={{ minWidth: 220 }}
            />

            <FormControl size="small" sx={{ minWidth: 140 }}>
              <InputLabel>Result Status</InputLabel>
              <Select
                value={resultStatus}
                label="Result Status"
                onChange={(e) => { setResultStatus(e.target.value); setPage(1); }}
              >
                {STATUS_OPTIONS.map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ minWidth: 140 }}>
              <InputLabel>Order Status</InputLabel>
              <Select
                value={orderStatus}
                label="Order Status"
                onChange={(e) => { setOrderStatus(e.target.value); setPage(1); }}
              >
                {ORDER_STATUS_OPTIONS.map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ minWidth: 200 }}>
              <InputLabel>Sort By</InputLabel>
              <Select
                value={sortOption}
                label="Sort By"
                onChange={(e) => { setSortOption(e.target.value); setPage(1); }}
              >
                {SORT_OPTIONS.map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
              </Select>
            </FormControl>

            {/* Date range chip — UI only (does not change latest filtering logic) */}
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
                  <Box
                    sx={{
                      position: "absolute", zIndex: 10, mt: 2, right: 0,
                      background: "#fff", boxShadow: 6, borderRadius: 2, p: 2
                    }}
                  >
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

            {/* Old UI shows "Remove" with a download icon – keep latest remove logic */}
            <Button
              variant="contained"
              color="error"
              startIcon={<Delete />}
              disabled={selectedIds.length === 0}
              onClick={() => setShowRemoveDialog(true)}
            >
              Remove
            </Button>

            {/* Old UI right icons: Reset + Refresh */}
            <Tooltip title="Reset Filters">
              <IconButton onClick={handleResetFilters} color="info"><Refresh /></IconButton>
            </Tooltip>
            <Tooltip title="Refresh">
              <IconButton onClick={refresh} color="primary"><Refresh /></IconButton>
            </Tooltip>
          </Box>
        </Box>

        {/* selected count strip */}
        {selectedIds.length > 0 && (
          <Box sx={{ mb: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Chip label={`${selectedIds.length} result${selectedIds.length > 1 ? "s" : ""} selected`} color="primary" variant="outlined" />
            <Typography variant="body2" color="text.secondary">Current sort: {sortOption}</Typography>
          </Box>
        )}

        {/* ===== Old UI table shape (visual), latest data mapping kept ===== */}
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell align="center">
                <Checkbox
                  checked={allCheckedOnPage}
                  indeterminate={
                    paginatedResults.some(r => selectedIds.includes(r.caseNumber)) &&
                    !allCheckedOnPage
                  }
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  color="primary"
                />
              </TableCell>
              <TableCell align="center">Sr</TableCell>
              <TableCell align="center">Company Name</TableCell>
              <TableCell align="center">Name</TableCell>
              <TableCell align="center">License #</TableCell>
              <TableCell align="center">Test Date</TableCell>
              <TableCell align="center">Test Type</TableCell>
              <TableCell align="center">Result Status</TableCell>
              <TableCell align="center">Order Status</TableCell>
              <TableCell align="center">Case Number</TableCell>
              <TableCell align="center">Actions</TableCell>
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
              paginatedResults.map((row, idx) => (
                <TableRow key={row._id || row.caseNumber} hover>
                  <TableCell align="center">
                    <Checkbox
                      checked={selectedIds.includes(row.caseNumber)}
                      onChange={() => handleSelect(row.caseNumber)}
                      color="primary"
                    />
                  </TableCell>
                  <TableCell align="center">{(page - 1) * PAGE_SIZE + idx + 1}</TableCell>
                  <TableCell align="center">{toUpperCase(row.companyName) || "-"}</TableCell>
                  <TableCell align="center">
                    <Typography fontWeight="bold">{toProperCase(row.driverName) || "-"}</Typography>
                  </TableCell>
                  <TableCell align="center">{row.licenseNumber || row.ssnEid || "-"}</TableCell>
                  <TableCell align="center">
                    <Chip
                      label={row.testDate ? dayjs(row.testDate).format("DD MMM YYYY") : "-"}
                      color="secondary"
                      variant="outlined"
                      sx={{ fontWeight: "bold", fontSize: 12 }}
                    />
                  </TableCell>
                  <TableCell align="center">{row.testType || row.orderReason || "-"}</TableCell>
                  <TableCell align="center">
                    <Chip
                      label={row.resultStatus || "N/A"}
                      color={
                        (row.resultStatus || "").toLowerCase() === "positive" ? "error" :
                        (row.resultStatus || "").toLowerCase() === "negative" ? "success" : "warning"
                      }
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Chip
                      label={row.orderStatus || "N/A"}
                      color={
                        (row.orderStatus || "").toLowerCase() === "completed" ? "success" :
                        (row.orderStatus || "").toLowerCase() === "pending" ? "warning" : "info"
                      }
                    />
                  </TableCell>
                  <TableCell align="center">{row.caseNumber || "-"}</TableCell>
                  <TableCell align="center">
                    <Tooltip title="View Details">
                      <IconButton onClick={() => handleView(row)} color="primary"><Visibility /></IconButton>
                    </Tooltip>
                    {/* Old UI had a separate Download action → show file picker modal */}
                    <Tooltip title="Download">
                      <span>
                        <IconButton
                          onClick={() => { setSelectedResult(row); setOpenDownloadModal(true); }}
                          color="secondary"
                          disabled={!(row.resultImages || []).length}
                        >
                          <Download />
                        </IconButton>
                      </span>
                    </Tooltip>
                    <Tooltip title="More">
                      <IconButton onClick={(e) => handleMenuOpen(e, row)}><MoreVert /></IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Showing {Math.min((page - 1) * PAGE_SIZE + 1, filteredAndSortedResults.length)} - {Math.min(page * PAGE_SIZE, filteredAndSortedResults.length)} of {filteredAndSortedResults.length}
            {selectedIds.length > 0 && ` | ${selectedIds.length} selected`}
          </Typography>
          <Pagination
            count={Math.max(1, Math.ceil(filteredAndSortedResults.length / PAGE_SIZE))}
            page={page}
            onChange={(_, v) => setPage(v)}
            color="primary"
            shape="rounded"
            showFirstButton
            showLastButton
          />
        </Stack>
      </TableContainer>

      {/* 3-dot Menu (latest logic: pending → reschedule) */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{ sx: { borderRadius: 2, minWidth: 180, boxShadow: 3 } }}
      >
        {menuResult && hasPendingStatus(menuResult) ? (
          <MenuItem onClick={handleReschedule} sx={{ py: 1.5 }}>
            <ListItemIcon><Schedule fontSize="small" color="primary" /></ListItemIcon>
            <ListItemText primary="Reschedule" primaryTypographyProps={{ fontWeight: "medium" }} />
          </MenuItem>
        ) : (
          <MenuItem disabled sx={{ py: 1.5 }}>
            <ListItemIcon><Schedule fontSize="small" color="disabled" /></ListItemIcon>
            <ListItemText primary="No pending actions" primaryTypographyProps={{ fontStyle: "italic", color: "text.secondary" }} />
          </MenuItem>
        )}
      </Menu>

      {/* View Modal (latest view content kept minimal to match old's light view) */}
      <Dialog open={openViewModal} onClose={handleCloseView} maxWidth="sm" fullWidth>
        <DialogTitle>Result Details</DialogTitle>
        <DialogContent>
          <Typography gutterBottom><strong>Name:</strong> {selectedResult?.driverName || "-"}</Typography>
          <Typography gutterBottom><strong>License Number:</strong> {selectedResult?.licenseNumber || selectedResult?.ssnEid || "-"}</Typography>
          <Typography gutterBottom><strong>Company Name:</strong> {selectedResult?.companyName || "-"}</Typography>
          <Typography gutterBottom><strong>Date:</strong> {selectedResult?.testDate ? dayjs(selectedResult.testDate).format("DD MMM YYYY") : "-"}</Typography>
          <Typography gutterBottom><strong>Test Type:</strong> {selectedResult?.testType || selectedResult?.orderReason || "-"}</Typography>
          {(selectedResult?.resultImages || []).length === 0 && (
            <Typography sx={{ mt: 2, fontStyle: "italic" }}>No image available.</Typography>
          )}
        </DialogContent>
        <DialogActions><Button onClick={handleCloseView}>Close</Button></DialogActions>
      </Dialog>

      {/* Download Modal (old UI) — uses latest downloadFile() */}
      <Dialog open={openDownloadModal} onClose={() => setOpenDownloadModal(false)}>
        <DialogTitle>Select file to download</DialogTitle>
        <DialogContent dividers>
          {(selectedResult?.resultImages || []).length ? (
            selectedResult.resultImages.map((file, i) => (
              <Button
                key={i}
                fullWidth
                sx={{ mb: 1 }}
                onClick={() => { downloadFile(file); setOpenDownloadModal(false); }}
              >
                {file.filename}
              </Button>
            ))
          ) : (
            <Typography>No files available.</Typography>
          )}
        </DialogContent>
        <DialogActions><Button onClick={() => setOpenDownloadModal(false)}>Cancel</Button></DialogActions>
      </Dialog>

      {/* Reschedule Confirm (latest props shape) */}
      <Reschedule
        open={openRescheduleModal}
        onClose={() => setOpenRescheduleModal(false)}
        row={rescheduleTarget}
        onConfirm={(prefill) => {
          setOpenRescheduleModal(false);   // close confirm dialog
          setReschedulePrefill(prefill);   // show the reschedule order popup
        }}
      />

      {/* Reschedule Order Popup (latest) */}
      {reschedulePrefill && (
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
            {/* Header with close button (old look) */}
            <Box
              sx={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                background: 'linear-gradient(90deg, #003366 60%, #1976d2 100%)',
                color: 'white', px: 3, py: 2
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 'bold', letterSpacing: 1 }}>
                Reschedule Order
              </Typography>
              <IconButton
                onClick={() => setReschedulePrefill(null)}
                sx={{ color: 'white', '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' } }}
              >
                <Close />
              </IconButton>
            </Box>

            {/* Content area */}
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
                key={JSON.stringify(reschedulePrefill)}
                prefill={reschedulePrefill}
                onRescheduleSuccess={handleRescheduleSuccess}
                onClose={() => setReschedulePrefill(null)}
              />
            </Box>
          </Paper>
        </Box>
      )}
    </Box>
  );
}

export default DisplayResult;
