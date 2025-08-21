import React, { useState, useContext, useEffect } from "react";
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    IconButton, Menu, MenuItem, Paper, Dialog, DialogTitle, DialogContent,
    DialogActions, Button, Typography, Box, TextField, useMediaQuery, Select, FormControl, InputLabel
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import CustomerContext from "../../../../Context/Admin/Customer/CustomerContext";
import DriverContext from "../../../../Context/Admin/Customer/Driver/DriverContext";
import axios from "axios";

const normalizePhoneNumber = require("../../../Utils/normalizePhone");

const API_URL = process.env.REACT_APP_API_URL;

function ActiveDriver() {
    const { userDetails, currentId, getSingleUserData } = useContext(CustomerContext);
    const { updateDriver, deleteDriver } = useContext(DriverContext);
    const [drivers, setDrivers] = useState([]);
    const [menuAnchor, setMenuAnchor] = useState(null);
    const [selectedDriver, setSelectedDriver] = useState(null);
    const [editOpen, setEditOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [viewOpen, setViewOpen] = useState(false);
    const [changeCompanyOpen, setChangeCompanyOpen] = useState(false);
    const [editedDriver, setEditedDriver] = useState(null);
    const [allCompanies, setAllCompanies] = useState([]);
    const [selectedCompanyId, setSelectedCompanyId] = useState("");
    const isTablet = useMediaQuery("(max-width:1200px)");
    const isMobile = useMediaQuery("(max-width:500px)");
    

    // Fetch companies on open modal
    const fetchCompanies = async () => {
        try {
            // Assuming you have endpoint like `/api/admin/all-companies`
            const { data } = await axios.get(`${API_URL}/admin/allCompany`);
            // Filter out the current company
            const filtered = data?.data?.filter(
                c => c._id !== currentId
            );
            setAllCompanies(filtered || []);
        } catch (err) {
            setAllCompanies([]);
        }
    };

    useEffect(() => {
        if (userDetails?.drivers) {
            const activeDrivers = userDetails.drivers.filter(
                driver => !driver.isDeleted && driver.isActive === true
            );
            setDrivers(activeDrivers);
        }
    }, [userDetails]);

    const handleMenuOpen = (event, driver) => {
        setMenuAnchor(event.currentTarget);
        setSelectedDriver(driver);
    };

    const handleMenuClose = () => {
        setMenuAnchor(null);
    };

    const handleEditOpen = () => {
        setEditedDriver({ ...selectedDriver });
        setEditOpen(true);
        handleMenuClose();
    };

    const handleDeleteOpen = () => {
        setDeleteOpen(true);
        handleMenuClose();
    };

    const handleViewOpen = () => {
        setViewOpen(true);
        handleMenuClose();
    };

    const handleEditChange = (e) => {
        setEditedDriver({ ...editedDriver, [e.target.name]: e.target.value });
    };

    const handleSaveEdit = async () => {
        await updateDriver(editedDriver, currentId);
        getSingleUserData(currentId);
        setEditOpen(false);
    };

    const handleDeleteDriver = async () => {
        await deleteDriver(selectedDriver, currentId);
        getSingleUserData(currentId);
        setDeleteOpen(false);
    };

    // === Change Company Modal Functions ===
    const handleChangeCompanyOpen = async () => {
        await fetchCompanies();
        setSelectedCompanyId(""); // Reset
        setChangeCompanyOpen(true);
        handleMenuClose();
    };

    const handleChangeCompanySubmit = async () => {
        if (!selectedCompanyId) return;
        try {
            // Backend should accept: driverId, newCompanyId
            await axios.post(`${API_URL}/admin/changeDriverCompany`, {
                driverId: selectedDriver._id,
                newCompanyId: selectedCompanyId,
            });
            getSingleUserData(currentId);
        } catch (error) {
            // Optionally: show error with toast
        }
        setChangeCompanyOpen(false);
    };

    return (
        <TableContainer component={Paper} sx={{ mt: 3, p: 2, borderRadius: 2, boxShadow: 3, overflowX: "auto" }}>
            <Table>
                <TableHead>
                    <TableRow sx={{ backgroundColor: "#003366" }}>
                        <TableCell sx={{ color: "white", fontWeight: "bold" }}>Sr</TableCell>
                        <TableCell sx={{ color: "white", fontWeight: "bold" }}>Name</TableCell>
                        {!isMobile && <TableCell sx={{ color: "white", fontWeight: "bold" }}>Email</TableCell>}
                        {!isTablet && <TableCell sx={{ color: "white", fontWeight: "bold" }}>License #</TableCell>}
                        {!isTablet && <TableCell sx={{ color: "white", fontWeight: "bold" }}>DOB</TableCell>}
                        {!isTablet && <TableCell sx={{ color: "white", fontWeight: "bold" }}>Phone No</TableCell>}
                        {!isTablet && <TableCell sx={{ color: "white", fontWeight: "bold" }}>Created By</TableCell>}
                        <TableCell sx={{ color: "white", fontWeight: "bold" }}>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {drivers.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={8} align="center">
                                <strong>No Active Employee to show</strong>
                            </TableCell>
                        </TableRow>
                    ) : (
                        drivers.map((driver, index) => (
                            <TableRow key={index} hover>
                                <TableCell>{index + 1}</TableCell>
                                <TableCell>{driver.first_name} {driver.last_name}</TableCell>
                                {!isMobile && <TableCell>{driver.email || "N/A"}</TableCell>}
                                {!isTablet && <TableCell>{driver.government_id}</TableCell>}
                                {!isTablet && <TableCell>{new Date(driver.dob).toLocaleDateString('en-US')}</TableCell>}
                                {!isTablet && <TableCell>{normalizePhoneNumber(driver.phone) || "N/A"}</TableCell>}
                                {!isTablet && <TableCell>{driver.createdBy}</TableCell>}
                                <TableCell>
                                    <IconButton onClick={(event) => handleMenuOpen(event, driver)}>
                                        <MoreVertIcon />
                                    </IconButton>
                                    <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={handleMenuClose}>
                                        <MenuItem onClick={handleEditOpen}>Edit</MenuItem>
                                        <MenuItem onClick={handleDeleteOpen}>Delete</MenuItem>
                                        <MenuItem onClick={handleViewOpen}>View More Details</MenuItem>
                                        <MenuItem onClick={handleChangeCompanyOpen}>Change Company</MenuItem>
                                    </Menu>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>

            {/* Edit Modal */}
            <Dialog open={editOpen} onClose={() => setEditOpen(false)}>
                <DialogTitle>Edit Employee</DialogTitle>
                <DialogContent>
                    <TextField fullWidth margin="dense" label="First Name" name="first_name" value={editedDriver?.first_name || ""} onChange={handleEditChange} />
                    <TextField fullWidth margin="dense" label="Last Name" name="last_name" value={editedDriver?.last_name || ""} onChange={handleEditChange} />
                    <TextField fullWidth margin="dense" label="Email" name="email" value={editedDriver?.email || ""} onChange={handleEditChange} />
                    <TextField fullWidth margin="dense" label="License #" name="government_id" value={editedDriver?.government_id || ""} onChange={handleEditChange} />
                    <TextField fullWidth margin="dense" label="DOB" name="dob" value={editedDriver?.dob || ""} onChange={handleEditChange} />
                    <TextField fullWidth margin="dense" label="Phone No" name="phone" value={editedDriver?.phone || ""} onChange={handleEditChange} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setEditOpen(false)} color="secondary">Cancel</Button>
                    <Button onClick={handleSaveEdit} color="primary" variant="contained">Save</Button>
                </DialogActions>
            </Dialog>

            {/* Delete Modal */}
            <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)}>
                <DialogTitle>Delete Employee</DialogTitle>
                <DialogContent>
                    <Typography>Are you sure you want to delete {selectedDriver?.first_name} {selectedDriver?.last_name}?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteOpen(false)} color="secondary">Cancel</Button>
                    <Button onClick={handleDeleteDriver} color="primary" variant="contained">Delete</Button>
                </DialogActions>
            </Dialog>

            {/* View More Details Modal */}
            <Dialog open={viewOpen} onClose={() => setViewOpen(false)}>
                <DialogTitle>Driver Details</DialogTitle>
                <DialogContent>
                    <Box sx={{ p: 2, borderRadius: 2, boxShadow: 1, bgcolor: "#f9f9f9", minWidth: '400px' }}>
                        <Typography variant="h6" gutterBottom>{selectedDriver?.first_name} {selectedDriver?.last_name}</Typography>
                        <Typography variant="body1"><strong>Email:</strong> {selectedDriver?.email}</Typography>
                        <Typography variant="body1"><strong>License #:</strong> {selectedDriver?.government_id}</Typography>
                        <Typography variant="body1"><strong>DOB:</strong> {new Date(selectedDriver?.dob).toLocaleDateString('en-US')}</Typography>
                        <Typography variant="body1"><strong>Phone No:</strong> {normalizePhoneNumber(selectedDriver?.phone)}</Typography>
                        <Typography variant="body1"><strong>Creation Date:</strong> {selectedDriver?.creationDate ? new Date(selectedDriver?.creationDate).toLocaleDateString('en-US') : ""}</Typography>
                        <Typography variant="body1"><strong>Created By:</strong> {selectedDriver?.createdBy}</Typography>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setViewOpen(false)} color="secondary">Close</Button>
                </DialogActions>
            </Dialog>

            {/* Change Company Modal */}
            <Dialog open={changeCompanyOpen} onClose={() => setChangeCompanyOpen(false)}>
                <DialogTitle>Change Employee's Company</DialogTitle>
                <DialogContent>
                    <FormControl fullWidth sx={{ mt: 2 }}>
                        <InputLabel>Select New Company</InputLabel>
                        <Select
                            label="Select New Company"
                            value={selectedCompanyId}
                            onChange={e => setSelectedCompanyId(e.target.value)}
                        >
                            {allCompanies.map(c => (
                                <MenuItem value={c._id} key={c._id}>{c.companyName}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setChangeCompanyOpen(false)} color="secondary">Cancel</Button>
                    <Button
                        onClick={handleChangeCompanySubmit}
                        color="primary"
                        variant="contained"
                        disabled={!selectedCompanyId}
                    >
                        Change Company
                    </Button>
                </DialogActions>
            </Dialog>
        </TableContainer>
    );
}

export default ActiveDriver;
