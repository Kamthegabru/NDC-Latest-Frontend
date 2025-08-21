import React, { useContext, useState, useEffect } from "react";
import {
    Dialog, DialogTitle, DialogContent, DialogActions, Button,
    IconButton, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Typography, TextField, CircularProgress
} from "@mui/material";
import { Edit, Delete, Visibility, Download } from "@mui/icons-material";
import CustomerContext from "../../../../Context/Admin/Customer/CustomerContext";
import CertificateContext from "../../../../Context/Admin/Customer/Certificate/CertificateContext";

function DisplayCertificate() {
    const { currentId, userDetails, getSingleUserData } = useContext(CustomerContext);
    const { updateCertificate, deleteCertificate } = useContext(CertificateContext);

    const [loading, setLoading] = useState(true);
    const [certificates, setCertificates] = useState([]);
    const [openModal, setOpenModal] = useState(null);
    const [selectedCert, setSelectedCert] = useState(null);
    const [editData, setEditData] = useState({
        description: "",
        issueDate: "",
        expirationDate: ""
    });

    // Helper function to format date as MM/DD/YYYY
    const formatDate = (dateStr) => {
        if (!dateStr) return "";
        const d = new Date(dateStr);
        const month = String(d.getMonth() + 1).padStart(2, "0"); // months are 0-based
        const day = String(d.getDate()).padStart(2, "0");
        const year = d.getFullYear();
        return `${month}/${day}/${year}`;
    };

    useEffect(() => {
        if (userDetails?.certificates) {
            setCertificates(userDetails.certificates);
            setLoading(false);
        }
    }, [userDetails]);

    const handleOpen = (type, cert) => {
        setSelectedCert(cert);
        setEditData({
            description: cert.description || "",
            issueDate: cert.issueDate ? cert.issueDate.slice(0, 10) : "",
            expirationDate: cert.expirationDate ? cert.expirationDate.slice(0, 10) : ""
        });
        setOpenModal(type);
    };

    const handleClose = () => {
        setOpenModal(null);
        setSelectedCert(null);
        setEditData({ description: "", issueDate: "", expirationDate: "" });
    };

    const handleDownload = async (cert) => {
        try {
            const base64 = cert.certificateFile; // base64 string
            if (!base64) {
                alert("No certificate file found");
                return;
            }

            const byteArray = Uint8Array.from(atob(base64), char => char.charCodeAt(0));
            const blob = new Blob([byteArray], { type: cert.mimeType || "application/pdf" });
            const url = URL.createObjectURL(blob);

            const link = document.createElement("a");
            link.href = url;
            link.download = `${cert.description || "certificate"}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Download error:", error);
        }
    };


    const handleUpdate = async () => {
        await updateCertificate(currentId, selectedCert._id, editData);
        await getSingleUserData(currentId);
        handleClose();
    };

    const handleDelete = async () => {
        await deleteCertificate(currentId, selectedCert._id);
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
                        <TableCell style={{ color: "white" }}>Issue Date</TableCell>
                        <TableCell style={{ color: "white" }}>Expiration Date</TableCell>
                        <TableCell style={{ color: "white" }} align="right">Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {certificates.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={5} align="center">
                                <strong>No certificate to show</strong>
                            </TableCell>
                        </TableRow>
                    ) : (
                        certificates.map((cert, index) => (
                            <TableRow key={cert._id || index}>
                                <TableCell>{index + 1}</TableCell>
                                <TableCell>{cert.description}</TableCell>
                                <TableCell>{formatDate(cert.issueDate)}</TableCell>
                                <TableCell>{formatDate(cert.expirationDate)}</TableCell>
                                <TableCell align="right">
                                    <IconButton onClick={() => handleOpen("view", cert)}><Visibility /></IconButton>
                                    <IconButton onClick={() => handleDownload(cert)}><Download /></IconButton>
                                    <IconButton onClick={() => handleOpen("edit", cert)}><Edit /></IconButton>
                                    <IconButton onClick={() => handleOpen("delete", cert)}><Delete /></IconButton>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>

            </Table>

            {/* View Modal */}
            <Dialog open={openModal === "view"} onClose={handleClose} maxWidth="sm" fullWidth>
                <DialogTitle>Certificate Details</DialogTitle>
                <DialogContent>
                    <Typography gutterBottom><strong>Description:</strong> {selectedCert?.description}</Typography>
                    <Typography gutterBottom><strong>Issue Date:</strong> {formatDate(selectedCert?.issueDate)}</Typography>
                    <Typography gutterBottom><strong>Expiration Date:</strong> {formatDate(selectedCert?.expirationDate)}</Typography>

                    {selectedCert?.certificateFile && (
                        <iframe
                            src={`data:${selectedCert.mimeType || "application/pdf"};base64,${selectedCert.certificateFile}`}
                            title="Certificate PDF"
                            style={{ width: "100%", height: "500px", marginTop: "1rem", borderRadius: 8 }}
                        />
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">Close</Button>
                </DialogActions>
            </Dialog>


            {/* Edit Modal */}
            <Dialog open={openModal === "edit"} onClose={handleClose}>
                <DialogTitle>Edit Certificate</DialogTitle>
                <DialogContent>
                    <TextField
                        margin="dense"
                        label="Description"
                        fullWidth
                        value={editData.description || ""}
                        onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                    />
                    <TextField
                        margin="dense"
                        label="Issue Date"
                        type="date"
                        fullWidth
                        value={editData.issueDate || ""}
                        onChange={(e) => setEditData({ ...editData, issueDate: e.target.value })}
                        InputLabelProps={{ shrink: true }}
                    />
                    <TextField
                        margin="dense"
                        label="Expiration Date"
                        type="date"
                        fullWidth
                        value={editData.expirationDate || ""}
                        onChange={(e) => setEditData({ ...editData, expirationDate: e.target.value })}
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
                    <Typography>Are you sure you want to delete this certificate?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleDelete} color="error">Delete</Button>
                </DialogActions>
            </Dialog>
        </TableContainer>
    );
}

export default DisplayCertificate;
