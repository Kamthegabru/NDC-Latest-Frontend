import React, { useContext, useState } from "react";
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from "@mui/material";
import HomeContext from "../../../../Context/ClientSide/AfterLogin/Home/HomeContext";

function AddDriver() {
    const {updateUserData} = useContext(HomeContext);
    const [open, setOpen] = useState(false);
    const [driverData, setDriverData] = useState({
        name: "",
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
        setDriverData({ ...driverData, [e.target.name]: e.target.value });
    };

    const handleSave = async() => {
        await AddDriver(driverData);
        await updateUserData();
        setOpen(false);
    };

    return (
        <div style={{ display: "flex", justifyContent: "flex-end", margin: "20px" }}>
            <Button variant="contained" color="primary" onClick={handleClickOpen}>
                + Add Employee
            </Button>

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Add New Employee</DialogTitle>
                <DialogContent>
                    <TextField fullWidth margin="dense" label="Name" name="name" onChange={handleChange} />
                    <TextField fullWidth margin="dense" label="License #" name="license" onChange={handleChange} />
                    <Typography variant="subtitle2" style={{ marginTop: "10px" }}>Date of Birth (DOB)</Typography>
                    <TextField fullWidth margin="dense" type="date" name="dob" onChange={handleChange} InputLabelProps={{ shrink: true }} />
                    <TextField fullWidth margin="dense" label="Email" name="email" type="email" onChange={handleChange} />
                    <TextField fullWidth margin="dense" label="Phone No" name="phone" onChange={handleChange} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="secondary">Cancel</Button>
                    <Button onClick={handleSave} color="primary" variant="contained">Save Employee</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default AddDriver;