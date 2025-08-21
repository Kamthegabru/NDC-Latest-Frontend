import React, { useState, useEffect, useContext } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Menu, MenuItem, Paper, Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box, useMediaQuery } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DeleteIcon from "@mui/icons-material/Delete";

import CustomerContext from "../../../../Context/Admin/Customer/CustomerContext";
import DriverContext from "../../../../Context/Admin/Customer/Driver/DriverContext";
const normalizePhoneNumber = require("../../../Utils/normalizePhone");

function DeletedDriver() {
    const { userDetails, currentId, getSingleUserData } = useContext(CustomerContext);
    const { permanentlyDeleteDriver } = useContext(DriverContext);  
    const [drivers, setDrivers] = useState([]);
    const [menuAnchor, setMenuAnchor] = useState(null);
    const [selectedDriver, setSelectedDriver] = useState(null);
    const [viewOpen, setViewOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const isTablet = useMediaQuery("(max-width:1200px)");
    const isMobile = useMediaQuery("(max-width:500px)");

    useEffect(() => {
        if (userDetails?.drivers) {
            const activeDrivers = userDetails.drivers.filter(driver => driver.isDeleted);
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

    const handleViewOpen = () => {
        setViewOpen(true);
        handleMenuClose();
    };

    const handleDeleteOpen = () => {
        setDeleteOpen(true);
        handleMenuClose();
    };

    const handleDeleteDriver = async () => {
        await permanentlyDeleteDriver(selectedDriver);
        await getSingleUserData(currentId);
        // Optionally refresh drivers list here if needed
        setDeleteOpen(false);
    };

    return (
        <TableContainer component={Paper} sx={{ mt: 3, p: 2, borderRadius: 2, boxShadow: 3, overflowX: "auto" }}>
            <Table>
                <TableHead>
                    <TableRow sx={{ backgroundColor: "grey" }}>
                        <TableCell sx={{ color: "white", fontWeight: "bold" }}>Sr</TableCell>
                        <TableCell sx={{ color: "white", fontWeight: "bold" }}>Name</TableCell>
                        {!isMobile && <TableCell sx={{ color: "white", fontWeight: "bold" }}>Email</TableCell>}
                        {!isTablet && <TableCell sx={{ color: "white", fontWeight: "bold" }}>License #</TableCell>}
                        {!isTablet && <TableCell sx={{ color: "white", fontWeight: "bold" }}>DOB</TableCell>}
                        {!isTablet && <TableCell sx={{ color: "white", fontWeight: "bold" }}>Phone No</TableCell>}
                        {!isMobile && <TableCell sx={{ color: "white", fontWeight: "bold" }}>Deletion Date</TableCell>}
                        <TableCell sx={{ color: "white", fontWeight: "bold" }}>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {drivers.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={8} align="center">
                                <strong>No deleted Employee to show</strong>
                            </TableCell>
                        </TableRow>
                    ) : (
                        drivers.map((driver, index) => (
                            <TableRow key={index} hover>
                                <TableCell>{index + 1}</TableCell>
                                <TableCell>{driver.first_name} {driver.last_name}</TableCell>
                                {!isMobile && <TableCell>{driver.email}</TableCell>}
                                {!isTablet && <TableCell>{driver.government_id}</TableCell>}
                                {!isTablet && <TableCell>{new Date(driver.dob).toLocaleDateString()}</TableCell>}
                                {!isTablet && <TableCell>{normalizePhoneNumber(driver.phone)}</TableCell>}
                                {!isMobile && <TableCell>{new Date(driver.deletionDate).toLocaleDateString()}</TableCell>}
                                <TableCell>
                                    <IconButton onClick={(event) => handleMenuOpen(event, driver)}>
                                        <MoreVertIcon />
                                    </IconButton>
                                    <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={handleMenuClose}>
                                        <MenuItem onClick={handleViewOpen}>View More Details</MenuItem>
                                        <MenuItem onClick={handleDeleteOpen}>
                                            <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
                                            Permanently Delete
                                        </MenuItem>
                                    </Menu>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>

            </Table>

            {/* View More Details Modal */}
            <Dialog open={viewOpen} onClose={() => setViewOpen(false)}>
                <DialogTitle>Employee Details</DialogTitle>
                <DialogContent>
                    <Box sx={{ p: 2, borderRadius: 2, boxShadow: 1, bgcolor: "#f9f9f9", minWidth: '400px' }}>
                        <Typography variant="h6" gutterBottom>{selectedDriver?.first_name} {selectedDriver?.last_name}</Typography>
                        <Typography variant="body1"><strong>Email:</strong> {selectedDriver?.email}</Typography>
                        <Typography variant="body1"><strong>License #:</strong> {selectedDriver?.government_id}</Typography>
                        <Typography variant="body1"><strong>DOB:</strong> {selectedDriver?.dob}</Typography>
                        <Typography variant="body1"><strong>Phone No:</strong> {normalizePhoneNumber(selectedDriver?.phone)}</Typography>
                        <Typography variant="body1"><strong>Creation Date:</strong> {new Date(selectedDriver?.creationDate).toLocaleDateString()}</Typography>
                        <Typography variant="body1"><strong>Created By:</strong> {selectedDriver?.createdBy}</Typography>
                        <Typography variant="body1"><strong>Deletion Date:</strong> {new Date(selectedDriver?.deletionDate).toLocaleDateString()}</Typography>
                        <Typography variant="body1"><strong>Deleted By:</strong> {selectedDriver?.deletedBy || "N/A"}</Typography>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setViewOpen(false)} color="secondary">Close</Button>
                </DialogActions>
            </Dialog>

            {/* Permanently Delete Driver Confirmation Modal */}
            <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)}>
                <DialogTitle>Permanently Delete Employee</DialogTitle>
                <DialogContent>
                    <Typography>
                        Are you sure you want to permanently delete{" "}
                        <strong>{selectedDriver?.first_name} {selectedDriver?.last_name}</strong>?
                        This action cannot be undone.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteOpen(false)} color="secondary">Cancel</Button>
                    <Button onClick={handleDeleteDriver} color="error" variant="contained">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </TableContainer>
    );
}

export default DeletedDriver;
