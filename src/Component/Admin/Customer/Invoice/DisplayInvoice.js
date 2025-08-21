import React, { useContext, useEffect, useState } from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, IconButton, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Typography,
  TextField, CircularProgress, MenuItem, Select, InputLabel, FormControl
} from "@mui/material";
import { Edit, Delete, Visibility, Download } from "@mui/icons-material";
import CustomerContext from "../../../../Context/Admin/Customer/CustomerContext";
import InvoiceContext from "../../../../Context/Admin/Customer/Invoice/InvoiceContext";

function DisplayInvoice() {
  const { currentId, userDetails, getSingleUserData } = useContext(CustomerContext);
  const { updateInvoice, deleteInvoice } = useContext(InvoiceContext);

  const [loading, setLoading] = useState(true);
  const [invoices, setInvoices] = useState([]);
  const [openModal, setOpenModal] = useState(null);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [editData, setEditData] = useState({});

  useEffect(() => {
    if (userDetails?.invoices) {
      setInvoices(userDetails.invoices);
      setLoading(false);
    }
  }, [userDetails]);

  const handleOpen = (type, invoice) => {
    setSelectedInvoice(invoice);
    setEditData(invoice);
    setOpenModal(type);
  };

  const handleClose = () => {
    setOpenModal(null);
    setSelectedInvoice(null);
    setEditData({});
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

  const handleUpdate = async () => {
    await updateInvoice(currentId, selectedInvoice._id, editData);
    await getSingleUserData(currentId);
    handleClose();
  };

  const handleDelete = async () => {
    await deleteInvoice(currentId, selectedInvoice._id);
    await getSingleUserData(currentId);
    handleClose();
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const year = d.getFullYear();
    return `${month}/${day}/${year}`;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Paid": return "green";
      case "Unpaid": return "red";
      case "Pending": return "orange";
      default: return "inherit";
    }
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
          {invoices.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} align="center">
                <strong>No invoice to show</strong>
              </TableCell>
            </TableRow>
          ) : (
            invoices.map((invoice, index) => (
              <TableRow key={invoice._id || index}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{invoice.invoiceNumber}</TableCell>
                <TableCell>${invoice.amount}</TableCell>
                <TableCell>{formatDate(invoice.date)}</TableCell>
                <TableCell sx={{ color: getStatusColor(invoice.status), fontWeight: "bold" }}>
                  {invoice.status}
                </TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => handleOpen("view", invoice)}><Visibility /></IconButton>
                  <IconButton onClick={() => handleDownload(invoice)}><Download /></IconButton>
                  <IconButton onClick={() => handleOpen("edit", invoice)}><Edit /></IconButton>
                  <IconButton onClick={() => handleOpen("delete", invoice)}><Delete /></IconButton>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {/* View Modal */}
      <Dialog open={openModal === "view"} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Invoice Details</DialogTitle>
        <DialogContent>
          <Typography><strong>Invoice Number:</strong> {selectedInvoice?.invoiceNumber}</Typography>
          <Typography><strong>Amount:</strong> ${selectedInvoice?.amount}</Typography>
          <Typography><strong>Date:</strong> {formatDate(selectedInvoice?.date)}</Typography>
          <Typography style={{ color: getStatusColor(selectedInvoice?.status) }}>
            <strong>Status:</strong> {selectedInvoice?.status}
          </Typography>

          {selectedInvoice?.mimeType?.startsWith("image/") ? (
            <img
              src={`data:${selectedInvoice.mimeType};base64,${selectedInvoice.file}`}
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

      {/* Edit Modal */}
      <Dialog open={openModal === "edit"} onClose={handleClose}>
        <DialogTitle>Edit Invoice</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Invoice Number"
            fullWidth
            value={editData.invoiceNumber || ""}
            onChange={(e) => setEditData({ ...editData, invoiceNumber: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Amount"
            type="number"
            fullWidth
            value={editData.amount || ""}
            onChange={(e) => setEditData({ ...editData, amount: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Date"
            type="date"
            fullWidth
            value={editData.date?.slice(0, 10) || ""}
            onChange={(e) => setEditData({ ...editData, date: e.target.value })}
            InputLabelProps={{ shrink: true }}
          />
          <FormControl fullWidth style={{ marginTop: 16 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={editData.status || "Pending"}
              onChange={(e) => setEditData({ ...editData, status: e.target.value })}
            >
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="Paid">Paid</MenuItem>
              <MenuItem value="Unpaid">Unpaid</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">Cancel</Button>
          <Button onClick={handleUpdate} color="primary" variant="contained">Update</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Modal */}
      <Dialog open={openModal === "delete"} onClose={handleClose}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this invoice?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">Cancel</Button>
          <Button onClick={handleDelete} color="secondary" variant="contained">Delete</Button>
        </DialogActions>
      </Dialog>
    </TableContainer>
  );
}

export default DisplayInvoice;
