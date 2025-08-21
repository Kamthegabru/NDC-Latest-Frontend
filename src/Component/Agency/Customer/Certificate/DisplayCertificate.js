import React, { useContext, useState, useEffect } from "react";
import {
    Dialog, DialogTitle, DialogContent, DialogActions, Button,
    IconButton, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Typography, CircularProgress
} from "@mui/material";
import { Visibility, Download } from "@mui/icons-material";
import CustomerContext from "../../../../Context/Agency/Customer/CustomerContext";

// Format date to MM/DD/YYYY
const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit"
    }).format(date);
};

function DisplayCertificate() {
    const { userDetails } = useContext(CustomerContext);

    const [loading, setLoading] = useState(true);
    const [certificates, setCertificates] = useState([]);
    const [openModal, setOpenModal] = useState(null);
    const [selectedCert, setSelectedCert] = useState(null);

    useEffect(() => {
        if (userDetails?.certificates) {
            setCertificates(userDetails.certificates);
            setLoading(false);
        }
    }, [userDetails]);

    const handleOpen = (type, cert) => {
        setSelectedCert(cert);
        setOpenModal(type);
    };

    const handleClose = () => {
        setOpenModal(null);
        setSelectedCert(null);
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
                    {certificates.length > 0 ? (
                        certificates.map((cert, index) => (
                            <TableRow key={index}>
                                <TableCell>{index + 1}</TableCell>
                                <TableCell>{cert.description}</TableCell>
                                <TableCell>{formatDate(cert.issueDate)}</TableCell>
                                <TableCell>{formatDate(cert.expirationDate)}</TableCell>
                                <TableCell align="right">
                                    <IconButton onClick={() => handleOpen("view", cert)}><Visibility /></IconButton>
                                    <IconButton onClick={() => handleDownload(cert)}><Download /></IconButton>
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={5} align="center">
                                <b>No Certificate to display</b>
                            </TableCell>
                        </TableRow>
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
        </TableContainer>
    );
}

export default DisplayCertificate;
