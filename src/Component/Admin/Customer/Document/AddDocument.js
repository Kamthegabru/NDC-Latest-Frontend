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
import CustomerContext from "../../../../Context/Admin/Customer/CustomerContext";
import DocumentContext from "../../../../Context/Admin/Customer/Document/DocumentContext";

function AddDocument() {
    const { currentId, getSingleUserData } = useContext(CustomerContext);
    const { uploadDocument } = useContext(DocumentContext);

    const [open, setOpen] = useState(false);
    const [documentData, setDocumentData] = useState({
        title: "",
        date: "",
        file: null,
    });

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setDocumentData({
            title: "",
            date: "",
            file: null,
        });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setDocumentData({ ...documentData, [name]: value });
    };

    const handleFileChange = (e) => {
        setDocumentData({ ...documentData, file: e.target.files[0] });
    };

    const handleSave = async () => {
        const formData = new FormData();
        formData.append("title", documentData.title);
        formData.append("date", documentData.date);
        formData.append("file", documentData.file);
        formData.append("currentId", currentId);

        await uploadDocument(formData);
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
                <i className="fas fa-file-upload"></i>
                Add Document
            </Button>

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Add New Document</DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth
                        margin="dense"
                        label="Title"
                        name="title"
                        value={documentData.title}
                        onChange={handleChange}
                    />
                    <Typography variant="subtitle2" style={{ marginTop: "10px" }}>Date</Typography>
                    <TextField
                        fullWidth
                        margin="dense"
                        type="date"
                        name="date"
                        value={documentData.date}
                        onChange={handleChange}
                        InputLabelProps={{ shrink: true }}
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
                    <Button onClick={handleSave} color="primary" variant="contained">Save Document</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default AddDocument;
