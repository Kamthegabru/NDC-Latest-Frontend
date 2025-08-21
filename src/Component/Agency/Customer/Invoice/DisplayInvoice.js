// [Unchanged imports]
import React, { useContext, useEffect, useState } from "react";
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    Button, IconButton, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Typography, CircularProgress
} from "@mui/material";
import { Visibility, Download } from "@mui/icons-material";
import CustomerContext from "../../../../Context/Agency/Customer/CustomerContext";

function DisplayInvoice() {
    const { userDetails } = useContext(CustomerContext);

    const [loading, setLoading] = useState(true);
    const [invoices, setInvoices] = useState([]);
    const [openModal, setOpenModal] = useState(null);
    const [selectedInvoice, setSelectedInvoice] = useState(null);

    useEffect(() => {
        if (userDetails?.invoices) {
            setInvoices(userDetails.invoices);
            setLoading(false);
        }
    }, [userDetails]);

    const handleOpen = (type, invoice) => {
        setSelectedInvoice(invoice);
        setOpenModal(type);
    };

    const handleClose = () => {
        setOpenModal(null);
        setSelectedInvoice(null);
    };

    const handleDownload = (invoice) => {
        if (!invoice?.file || !invoice?.mimeType) return;

        const link = document.createElement("a");
        link.href = `data:${invoice.mimeType};base64,${invoice.file}`;
        link.download = invoice.invoiceNumber || "invoice.pdf";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (loading) return <CircularProgress />;

    return (
        <TableContainer>
            <Table>
                <TableHead style={{ backgroundColor: "#0b2f6a" }}>
                    <TableRow>
                        <TableCell style={{ color: "white" }}>Sr</TableCell>
                        <TableCell style={{ color: "white" }}>Invoice Number</TableCell>
                        <TableCell style={{ color: "white" }}>Amount</TableCell>
                        <TableCell style={{ color: "white" }}>Date</TableCell>
                        <TableCell style={{ color: "white" }}>Status</TableCell>
                        <TableCell style={{ color: "white" }} align="right">Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {invoices.length > 0 ? (
                        invoices.map((invoice, index) => (
                            <TableRow key={index}>
                                <TableCell>{index + 1}</TableCell>
                                <TableCell>{invoice.invoiceNumber}</TableCell>
                                <TableCell>${invoice.amount}</TableCell>
                                <TableCell>
                                    {new Date(invoice.date).toLocaleDateString("en-US", {
                                        month: "2-digit",
                                        day: "2-digit",
                                        year: "numeric"
                                    })}
                                </TableCell>
                                <TableCell sx={{
                                    fontWeight: "bold",
                                    color:
                                        invoice.status === "Paid" ? "#2e7d32" :
                                            invoice.status === "Unpaid" ? "#d32f2f" :
                                                "#f57c00"
                                }}>
                                    {invoice.status}
                                </TableCell>
                                <TableCell align="right">
                                    <IconButton onClick={() => handleOpen("view", invoice)}><Visibility /></IconButton>
                                    <IconButton onClick={() => handleDownload(invoice)}><Download /></IconButton>
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={6} align="center">
                                <b>No Invoice to display</b>
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>

            {/* View Modal */}
            <Dialog open={openModal === "view"} onClose={handleClose} maxWidth="sm" fullWidth>
                <DialogTitle>Invoice Details</DialogTitle>
                <DialogContent>
                    <Typography><strong>Invoice Number:</strong> {selectedInvoice?.invoiceNumber}</Typography>
                    <Typography><strong>Amount:</strong> ${selectedInvoice?.amount}</Typography>
                    <Typography><strong>Date:</strong> {
                        selectedInvoice?.date ? new Date(selectedInvoice.date).toLocaleDateString("en-US", {
                            month: "2-digit", day: "2-digit", year: "numeric"
                        }) : "N/A"
                    }</Typography>
                    <Typography sx={{
                        fontWeight: "bold",
                        color:
                            selectedInvoice?.status === "Paid" ? "#2e7d32" :
                                selectedInvoice?.status === "Unpaid" ? "#d32f2f" :
                                    "#f57c00"
                    }}>
                        <strong>Status:</strong> {selectedInvoice?.status}
                    </Typography>

                    {selectedInvoice?.mimeType?.startsWith("image/") ? (
                        <img
                            src={`data:${selectedInvoice.mimeType};base64,${selectedInvoice.file?.data}`}
                            alt="Invoice"
                            style={{ width: "100%", marginTop: "1rem", borderRadius: 8 }}
                        />
                    ) : selectedInvoice?.mimeType === "application/pdf" ? (
                        <iframe
                            src={`data:${selectedInvoice.mimeType};base64,${selectedInvoice.file}`}
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
                    <Button onClick={handleClose} color="primary">Close</Button>
                </DialogActions>
            </Dialog>
        </TableContainer>
    );
}

export default DisplayInvoice;
