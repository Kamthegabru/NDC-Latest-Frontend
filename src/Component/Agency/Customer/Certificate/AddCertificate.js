import React, { useContext, useState } from "react";
import {
    Button,
    TextField,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Typography
} from "@mui/material";
import CustomerContext from "../../../../Context/Agency/Customer/CustomerContext";
import CertificateContext from "../../../../Context/Agency/Customer/Certificate/CertificateContext"; 

function AddCertificate() {
    const { currentId ,getSingleUserData} = useContext(CustomerContext);
    const { addCertificate} = useContext(CertificateContext);

    const [open, setOpen] = useState(false);
    const [certificateData, setCertificateData] = useState({
        issueDate: "",
        expirationDate: "",
        description: "",
        file: null,
    });

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setCertificateData({
            issueDate: "",
            expirationDate: "",
            description: "",
            file: null
        });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCertificateData({ ...certificateData, [name]: value });
    };

    const handleFileChange = (e) => {
        setCertificateData({ ...certificateData, file: e.target.files[0] });
    };

    const handleSave = async () => {
        const formData = new FormData();
        formData.append("issueDate", certificateData.issueDate);
        formData.append("expirationDate", certificateData.expirationDate);
        formData.append("description", certificateData.description);
        formData.append("file", certificateData.file);
        formData.append("currentId", currentId);
        await addCertificate(formData);
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
                }}
            >
                <i className="fas fa-cloud-upload-alt"></i> {/* Font Awesome icon if you use it */}
                Add Certificate
            </Button>


            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Add New Certificate</DialogTitle>
                <DialogContent>
                    <Typography variant="subtitle2" style={{ marginTop: "10px" }}>Issue Date</Typography>
                    <TextField
                        fullWidth
                        margin="dense"
                        type="date"
                        name="issueDate"
                        value={certificateData.issueDate}
                        onChange={handleChange}
                        InputLabelProps={{ shrink: true }}
                    />
                    <Typography variant="subtitle2" style={{ marginTop: "10px" }}>Expiry Date</Typography>
                    <TextField
                        fullWidth
                        margin="dense"
                        type="date"
                        name="expirationDate"
                        value={certificateData.expirationDate}
                        onChange={handleChange}
                        InputLabelProps={{ shrink: true }}
                    />
                    <TextField
                        fullWidth
                        margin="dense"
                        label="Description"
                        name="description"
                        value={certificateData.description}
                        onChange={handleChange}
                    />
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
                    <Button onClick={handleSave} color="primary" variant="contained">Save Certificate</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default AddCertificate;
