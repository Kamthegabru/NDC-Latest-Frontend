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
} from "@mui/material";
import axios from "axios";

import AgencyContext from "../../../Context/Admin/Agency/AgencyContext";
import { toast } from "react-toastify";
const API_URL = process.env.REACT_APP_API_URL;

function CreateNewAgency() {
    const { getAllAgencyData } = useContext(AgencyContext);
    const [open, setOpen] = useState(false);
    const [email, setEmail] = useState("");
    const [confirmEmail, setConfirmEmail] = useState("");
    const [contactNumber, setContactNumber] = useState("");
    const [agencyName, setAgencyName] = useState("");
    const [error, setError] = useState("");
    const [successMsg, setSuccessMsg] = useState("");

    const handleOpen = () => {
        setOpen(true);
        setEmail("");
        setConfirmEmail("");
        setContactNumber("");
        setAgencyName("");
        setError("");
        setSuccessMsg("");
    };

    const handleClose = () => {
        setOpen(false);
    };

    const validateEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const validateContactNumber = (contactNumber) => {
        return /^[0-9]{10}$/.test(contactNumber); // Simple 10-digit validation
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
            // eslint-disable-next-line
            const res = await axios.post(`${API_URL}/admin/createNewAgency`, {
                email,
                contactNumber,
                agencyName,
            });

            setEmail("");
            setConfirmEmail("");
            setContactNumber("");
            setAgencyName("");
            toast.success("Agency created and mail sent to user successfully");
            handleClose();
            getAllAgencyData();
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
                    Create New Agency
                </Button>
            </Box>

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Create New Agency</DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth
                        margin="dense"
                        label="Agency Name"
                        value={agencyName}
                        onChange={(e) => setAgencyName(e.target.value)}
                        required
                    />
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

export default CreateNewAgency;
