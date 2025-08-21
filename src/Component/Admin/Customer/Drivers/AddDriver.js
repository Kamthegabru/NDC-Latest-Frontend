import React, { useContext, useState } from "react";
import {
    Button,
    TextField,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
} from "@mui/material";

import DriverContext from "../../../../Context/Admin/Customer/Driver/DriverContext";
import CustomerContext from "../../../../Context/Admin/Customer/CustomerContext";

function AddDriver() {
    const { currentId, getSingleUserData } = useContext(CustomerContext);
    const { AddDriver } = useContext(DriverContext);
    const [open, setOpen] = useState(false);

    const [driverData, setDriverData] = useState({
        firstName: "",
        lastName: "",
        license: "",
        dob: "",
        email: "",
        phone: ""
    });

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setDriverData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        await AddDriver(driverData, currentId);
        getSingleUserData(currentId);
        setOpen(false);
    };

    return (
        <div style={{ display: "flex", justifyContent: "flex-end", margin: "20px" }}>
            <Button
                variant="contained"
                color="primary"
                onClick={handleClickOpen}
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
                + Add Employee
            </Button>

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Add New Employee</DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth
                        margin="dense"
                        label="First Name"
                        name="firstName"
                        onChange={handleChange}
                    />
                    <TextField
                        fullWidth
                        margin="dense"
                        label="Last Name"
                        name="lastName"
                        onChange={handleChange}
                    />
                    <TextField
                        fullWidth
                        margin="dense"
                        label="License #"
                        name="license"
                        onChange={handleChange}
                    />

                    <TextField
                        fullWidth
                        required
                        type="date"
                        margin="dense"
                        InputLabelProps={{ shrink: true }}
                        label="DOB"
                        name="dob"
                        onChange={handleChange}
                    />
                    <TextField
                        fullWidth
                        margin="dense"
                        label="Email"
                        name="email"
                        type="email"
                        onChange={handleChange}
                    />
                    <TextField
                        fullWidth
                        margin="dense"
                        label="Phone No"
                        name="phone"
                        onChange={handleChange}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="secondary">
                        Cancel
                    </Button>
                    <Button onClick={handleSave} color="primary" variant="contained">
                        Save Driver
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default AddDriver;
