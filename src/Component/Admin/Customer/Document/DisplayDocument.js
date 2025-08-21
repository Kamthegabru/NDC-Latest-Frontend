import React, { useContext, useState, useEffect } from "react";
import {
    Dialog, DialogTitle, DialogContent, DialogActions, Button,
    IconButton, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Typography, TextField, CircularProgress
} from "@mui/material";
import { Edit, Delete, Visibility, Download } from "@mui/icons-material";
import CustomerContext from "../../../../Context/Admin/Customer/CustomerContext";
import DocumentContext from "../../../../Context/Admin/Customer/Document/DocumentContext";

function DisplayDocument() {
    const { currentId, userDetails, getSingleUserData } = useContext(CustomerContext);
    const { editDocument, deleteDocument } = useContext(DocumentContext);

    const [loading, setLoading] = useState(true);
    const [documents, setDocuments] = useState([]);
    const [openModal, setOpenModal] = useState(null);
    const [selectedDoc, setSelectedDoc] = useState(null);
    const [editData, setEditData] = useState({
        description: "",
        date: ""
    });

    useEffect(() => {
        if (userDetails?.documents) {
            setDocuments(userDetails.documents);
            setLoading(false);
        }
    }, [userDetails]);

    const handleOpen = (type, doc) => {
        setSelectedDoc(doc);
        setEditData({
            description: doc.description || "",
            date: doc.date ? doc.date.slice(0, 10) : ""
        });
        setOpenModal(type);
    };

    const handleClose = () => {
        setOpenModal(null);
        setSelectedDoc(null);
        setEditData({ description: "", date: "" });
    };

    const handleDownload = (doc) => {
        if (!doc?.documentFile) return;
        const link = document.createElement("a");
        link.href = `data:${doc.mimeType};base64,${doc.documentFile}`;
        link.download = doc.description || "document";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };


    const handleUpdate = async () => {
        await editDocument(currentId, selectedDoc._id, editData);
        await getSingleUserData(currentId);
        handleClose();
    };

    const handleDelete = async () => {
        await deleteDocument(currentId, selectedDoc._id);
        await getSingleUserData(currentId);
        handleClose();
    };

    if (loading) return <CircularProgress />;

    return (
        <TableContainer>
            <Table>
                <TableHead style={{ backgroundColor: "#0b2f6a" }}>
                    <TableRow>
                        <TableCell style={{ color: "white" }}>Sr</TableCell>
                        <TableCell style={{ color: "white" }}>Description</TableCell>
                        <TableCell style={{ color: "white" }}>Upload Date</TableCell>
                        <TableCell style={{ color: "white" }} align="right">Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {documents.map((doc, index) => (
                        <TableRow key={doc._id || index}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>{doc.description}</TableCell>
                            <TableCell>{new Date(doc.date).toLocaleDateString()}</TableCell>
                            <TableCell align="right">
                                <IconButton onClick={() => handleOpen("view", doc)}><Visibility /></IconButton>
                                <IconButton onClick={() => handleDownload(doc)}><Download /></IconButton>
                                <IconButton onClick={() => handleOpen("edit", doc)}><Edit /></IconButton>
                                <IconButton onClick={() => handleOpen("delete", doc)}><Delete /></IconButton>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            {/* View Modal */}
            <Dialog open={openModal === "view"} onClose={handleClose} maxWidth="sm" fullWidth>
                <DialogTitle>Document Details</DialogTitle>
                <DialogContent>
                    <Typography gutterBottom><strong>Description:</strong> {selectedDoc?.description}</Typography>
                    <Typography gutterBottom><strong>Upload Date:</strong> {new Date(selectedDoc?.date).toLocaleDateString()}</Typography>

                    {selectedDoc?.mimeType?.startsWith("image/") ? (
                        <img
                            src={`data:${selectedDoc.mimeType};base64,${selectedDoc.documentFile}`}
                            alt="Document"
                            style={{ width: "100%", marginTop: "1rem", borderRadius: 8 }}
                        />
                    ) : selectedDoc?.mimeType === "application/pdf" ? (
                        <iframe
                            src={`data:application/pdf;base64,${selectedDoc.documentFile}`}
                            title="PDF Preview"
                            style={{ width: "100%", height: "500px", marginTop: "1rem", borderRadius: 8 }}
                        />
                    ) : (
                        <Typography sx={{ mt: 2 }}>
                            <em>Preview not available for this file type. Please download to view.</em>
                        </Typography>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Close</Button>
                </DialogActions>
            </Dialog>


            {/* Edit Modal */}
            <Dialog open={openModal === "edit"} onClose={handleClose}>
                <DialogTitle>Edit Document</DialogTitle>
                <DialogContent>
                    <TextField
                        margin="dense"
                        label="Description"
                        fullWidth
                        value={editData.description}
                        onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                    />
                    <TextField
                        margin="dense"
                        label="Upload Date"
                        type="date"
                        fullWidth
                        value={editData.date}
                        onChange={(e) => setEditData({ ...editData, date: e.target.value })}
                        InputLabelProps={{ shrink: true }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleUpdate} variant="contained" color="primary">Update</Button>
                </DialogActions>
            </Dialog>

            {/* Delete Modal */}
            <Dialog open={openModal === "delete"} onClose={handleClose}>
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogContent>
                    <Typography>Are you sure you want to delete this document?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleDelete} color="error">Delete</Button>
                </DialogActions>
            </Dialog>
        </TableContainer>
    );
}

export default DisplayDocument;
