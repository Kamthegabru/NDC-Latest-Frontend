import React, { useContext, useState } from "react";
import {
    Box,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Typography,
    Grid,
} from "@mui/material";
import axios from "axios";

import AdminContext from "../../../Context/Admin/Admin/AdminContext"; // Adjust if necessary
import { toast } from "react-toastify";
const API_URL = process.env.REACT_APP_API_URL;

function CreateNewAdmin() {
    const { getAllAdminData } = useContext(AdminContext); // Adjust this context if necessary
    const [open, setOpen] = useState(false);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [confirmEmail, setConfirmEmail] = useState("");
    const [contactNumber, setContactNumber] = useState("");
    const [error, setError] = useState("");
    const [successMsg, setSuccessMsg] = useState("");

    const handleOpen = () => {
        setOpen(true);
        setFirstName("");
        setLastName("");
        setEmail("");
        setConfirmEmail("");
        setContactNumber("");
        setError("");
        setSuccessMsg("");
    };

    const handleClose = () => {
        setOpen(false);
    };

    const validateEmail = (email) => {
        // Simple email regex
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const validateContactNumber = (contactNumber) => {
        // Simple contact number validation
        return /^[0-9]{10}$/.test(contactNumber);
    };

    const handleSubmit = async () => {
        setError("");
        setSuccessMsg("");

        if (!validateEmail(email) || !validateEmail(confirmEmail)) {
            setError("Enter valid email addresses.");
            return;
        }

        if (email !== confirmEmail) {
            setError("Emails do not match.");
            return;
        }

        if (!validateContactNumber(contactNumber)) {
            setError("Enter a valid contact number.");
            return;
        }

        try {
            // Sending the data to the backend
            // eslint-disable-next-line
            const res = await axios.post(`${API_URL}/admin/createNewAdmin`, {
                firstName,
                lastName,
                email,
                contactNumber
            });

            setFirstName("");
            setLastName("");
            setEmail("");
            setConfirmEmail("");
            setContactNumber("");
            toast.success("Admin created successfully and email sent to user.");
            handleClose();
            getAllAdminData(); // Refresh the admin table
        } catch (err) {
            toast.error(err.response?.data?.message || "Something went wrong.");
        }
    };

    return (
        <div>
            <Box display="flex" justifyContent="center">
                <Button variant="contained" color="primary" onClick={handleOpen} style={{
                    backgroundColor: "#002D72",         // Navy Blue
                    color: "#fff",                      // White text
                    borderRadius: "6px",
                    padding: "10px 20px",
                    fontWeight: "bold",
                    textTransform: "none",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",                         // spacing between icon and text
                    boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
                }}>
                    Create New Admin
                </Button>
            </Box>

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Create New Admin</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                margin="dense"
                                label="First Name"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                margin="dense"
                                label="Last Name"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                required
                            />
                        </Grid>
                    </Grid>
                    <TextField
                        fullWidth
                        margin="dense"
                        label="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        type="email"
                        required
                    />
                    <TextField
                        fullWidth
                        margin="dense"
                        label="Confirm Email"
                        value={confirmEmail}
                        onChange={(e) => setConfirmEmail(e.target.value)}
                        type="email"
                        required
                    />
                    <TextField
                        fullWidth
                        margin="dense"
                        label="Contact Number"
                        value={contactNumber}
                        onChange={(e) => setContactNumber(e.target.value)}
                        type="text"
                        required
                    />

                    {error && <Typography color="error">{error}</Typography>}
                    {successMsg && <Typography color="primary">{successMsg}</Typography>}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button variant="contained" onClick={handleSubmit}>
                        Submit
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default CreateNewAdmin;
