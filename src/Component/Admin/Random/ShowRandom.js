import React, { useState, useEffect, useContext } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  IconButton, Menu, MenuItem, Typography, Paper, Box, CircularProgress,
  FormControl, Select, InputLabel, MenuItem as SelectItem,
  Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import RandomContext from '../../../Context/Admin/Random/RandomContext';
import AddRandom from './AddRandom';
import ExportRandom from './ExportRandom';
import { toast } from 'react-toastify';

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
    sendEmailToRandomDriver // <-- Make sure this exists in your context!
  } = useContext(RandomContext);

  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [statusValue, setStatusValue] = useState('');
  const [emailOpen, setEmailOpen] = useState(false);
  const [ccEmail, setCcEmail] = useState(""); // <-- NEW STATE

  useEffect(() => {
    const fetchData = async () => {
      await fetchRandomData();
      setLoading(false);
    };
    fetchData();
    // eslint-disable-next-line
  }, []);

  const handleMenuOpen = (event, item) => {
    setMenuAnchorEl(event.currentTarget);
    setSelectedItem(item);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

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

  // ---- Send Email Modal Logic ----
  const handleSendEmail = () => {
    setCcEmail(""); // Reset each time
    setEmailOpen(true);
    handleMenuClose();
  };

  const handleSendEmailConfirm = async () => {
    try {
      await sendEmailToRandomDriver(selectedItem, ccEmail); // Your context/backend should handle ccEmail
      setEmailOpen(false);
      setSelectedItem(null);
    } catch (error) {
      toast.error("Failed to send email.");
    }
  };

  const uniqueYears = [
    "All",
    ...new Set(randomUserDetails?.map(item => item.year).filter(Boolean))
  ];
  const uniqueQuarters = [
    "All",
    ...new Set(randomUserDetails?.map(item => item.quarter).filter(Boolean))
  ];

  const filteredData = randomUserDetails?.filter(item => {
    const matchYear = yearFilter === "All" || item.year === yearFilter;
    const matchQuarter = quarterFilter === "All" || item.quarter === quarterFilter;
    return matchYear && matchQuarter;
  });

  return (
    <Box>
      <TableContainer component={Paper} sx={{ mt: 3, p: 2, borderRadius: 2, boxShadow: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            Random Users
          </Typography>
          <Box display="flex" gap={2}>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Year</InputLabel>
              <Select
                value={yearFilter}
                label="Year"
                onChange={(e) => setYearFilter(e.target.value)}
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
                onChange={(e) => setQuarterFilter(e.target.value)}
              >
                {uniqueQuarters.map((qtr, i) => (
                  <SelectItem key={i} value={qtr}>{qtr}</SelectItem>
                ))}
              </Select>
            </FormControl>
            <ExportRandom />
            <AddRandom />
          </Box>
        </Box>

        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" height="150px">
            <CircularProgress />
          </Box>
        ) : (
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#003366" }}>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>Company Name</TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>Driver Name</TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>Year</TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>Quarter</TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>Test Type</TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>Status</TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>Action</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {filteredData?.length > 0 ? (
                filteredData.map((item, index) => (
                  <TableRow key={index} hover>
                    <TableCell>{item.company?.name || "N/A"}</TableCell>
                    <TableCell>{item.driver?.name || "N/A"}</TableCell>
                    <TableCell>{item.year}</TableCell>
                    <TableCell>{item.quarter}</TableCell>
                    <TableCell>{item.testType}</TableCell>
                    <TableCell
                      style={{
                        color:
                          item.status === "Completed"
                            ? "green"
                            : item.status === "Pending"
                            ? "#b58900"
                            : item.status === "Scheduled"
                            ? "orange"
                            : "black",
                        fontWeight: "bold",
                      }}
                    >
                      {item.status || "Pending"}
                    </TableCell>
                    <TableCell>
                      <IconButton onClick={(e) => handleMenuOpen(e, item)}>
                        <MoreVertIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    No data found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </TableContainer>

      {/* Action Menu */}
      <Menu anchorEl={menuAnchorEl} open={Boolean(menuAnchorEl)} onClose={handleMenuClose}>
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
    </Box>
  );
}

export default ShowRandom;
