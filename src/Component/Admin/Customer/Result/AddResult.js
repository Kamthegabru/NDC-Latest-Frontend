import React, { useContext, useState, useEffect } from "react";
import {
    Button,
    TextField,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Typography,
    MenuItem,
    Select,
    FormControl,
    InputLabel
} from "@mui/material";
import CustomerContext from "../../../../Context/Admin/Customer/CustomerContext";
import ResultContext from "../../../../Context/Admin/Customer/Result/ResultContext";

function AddResult() {
    const { currentId, getSingleUserData, userDetails } = useContext(CustomerContext);
    const { addResult } = useContext(ResultContext);

    const [open, setOpen] = useState(false);
    const [drivers, setDrivers] = useState([]);
    const [resultData, setResultData] = useState({
        driverId: "",
        date: "",
        testType: "",
        caseNumber :"",
        file: null,
        status: "Pending",
    });

    useEffect(() => {
        // Load active & non-deleted drivers
        if (userDetails?.drivers) {
            const filteredDrivers = userDetails.drivers.filter(
                (driver) => driver.isActive && !driver.isDeleted
            );
            setDrivers(filteredDrivers);
        }
    }, [userDetails]);

    const handleClickOpen = () => setOpen(true);

    const handleClose = () => {
        setOpen(false);
        setResultData({
            driverId: "",
            date: "",
            testType: "",
            caseNumber:"",
            file: null,
            status: "Pending",
        });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setResultData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        setResultData((prev) => ({
            ...prev,
            file: e.target.files[0],
        }));
    };

    const handleSave = async () => {
        const formData = new FormData();
        formData.append("driverId", resultData.driverId);
        formData.append("date", resultData.date);
        formData.append("testType", resultData.testType);
        formData.append("caseNumber", resultData.caseNumber);
        formData.append("file", resultData.file);
        formData.append("status", resultData.status);
        formData.append("currentId", currentId);
        await addResult(formData);
        getSingleUserData(currentId);
        handleClose();
    };

    return (
        <div style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "30px"
        }}>
            <Button
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
                <i className="fas fa-plus-circle"></i> Add Result
            </Button>

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Add New Result</DialogTitle>
                <DialogContent>
                    <FormControl fullWidth margin="dense">
                        <InputLabel>Driver</InputLabel>
                        <Select
                            value={resultData.driverId}
                            name="driverId"
                            onChange={handleChange}
                            label="Driver"
                        >
                            {drivers.map((driver) => (
                                <MenuItem key={driver._id} value={driver._id}>
                                    {driver.first_name} {driver.last_name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <Typography variant="subtitle2" style={{ marginTop: "10px" }}>Test Date</Typography>
                    <TextField
                        fullWidth
                        margin="dense"
                        type="date"
                        name="date"
                        value={resultData.date}
                        onChange={handleChange}
                        InputLabelProps={{ shrink: true }}
                    />
                    <TextField
                        fullWidth
                        margin="dense"
                        label="Test Type"
                        name="testType"
                        value={resultData.testType}
                        onChange={handleChange}
                    />
                    <TextField
                        fullWidth
                        margin="dense"
                        label="Case Number"
                        name="caseNumber"
                        value={resultData.caseNumber}
                        onChange={handleChange}
                    />
                    <FormControl fullWidth margin="dense">
                        <InputLabel>Status</InputLabel>
                        <Select
                            value={resultData.status}
                            name="status"
                            onChange={handleChange}
                            label="Status"
                        >
                            <MenuItem value="Pending">Pending</MenuItem>
                            <MenuItem value="Positive">Positive</MenuItem>
                            <MenuItem value="Negative">Negative</MenuItem>
                        </Select>
                    </FormControl>
                    <Typography variant="subtitle2" style={{ marginTop: "10px" }}>Upload File</Typography>
                    <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={handleFileChange}
                        style={{ marginTop: "5px" }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="secondary">Cancel</Button>
                    <Button onClick={handleSave} color="primary" variant="contained">Save Result</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default AddResult;
