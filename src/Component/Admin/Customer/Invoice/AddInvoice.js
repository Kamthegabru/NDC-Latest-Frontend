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
import InvoiceContext from "../../../../Context/Admin/Customer/Invoice/InvoiceContext";

function AddInvoice() {
  const { currentId, getSingleUserData } = useContext(CustomerContext);
  const { addInvoice } = useContext(InvoiceContext);

  const [open, setOpen] = useState(false);
  const [invoiceData, setInvoiceData] = useState({
    invoiceNumber: "",
    amount: "",
    date: "",
    file: null,
  });

  const [dateError, setDateError] = useState("");

  const handleClickOpen = () => setOpen(true);

  const handleClose = () => {
    setOpen(false);
    setInvoiceData({
      invoiceNumber: "",
      amount: "",
      date: "",
      file: null,
    });
    setDateError("");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "date") {
      // Validate MM/DD/YYYY
      const dateRegex = /^(0[1-9]|1[0-2])\/(0[1-9]|[12]\d|3[01])\/\d{4}$/;
      if (!dateRegex.test(value)) {
        setDateError("Date must be in MM/DD/YYYY format");
      } else {
        setDateError("");
      }
    }

    setInvoiceData({ ...invoiceData, [name]: value });
  };

  const handleFileChange = (e) => {
    setInvoiceData({ ...invoiceData, file: e.target.files[0] });
  };

  const handleSave = async () => {
    if (dateError || invoiceData.date === "") {
      alert("Please enter a valid date in MM/DD/YYYY format.");
      return;
    }

    const formData = new FormData();
    formData.append("invoiceNumber", invoiceData.invoiceNumber);
    formData.append("amount", invoiceData.amount);
    formData.append("date", invoiceData.date);
    if (invoiceData.file) formData.append("file", invoiceData.file);
    formData.append("currentId", currentId);
    await addInvoice(formData);
    getSingleUserData(currentId);
    handleClose();
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", padding: "30px" }}>
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
        <i className="fas fa-file-invoice"></i>&nbsp; Add Invoice
      </Button>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add New Invoice</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Invoice Number"
            name="invoiceNumber"
            fullWidth
            value={invoiceData.invoiceNumber}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            label="Amount"
            name="amount"
            type="number"
            fullWidth
            value={invoiceData.amount}
            onChange={handleChange}
          />
          <Typography variant="subtitle2" style={{ marginTop: "10px" }}>
            Invoice Date (MM/DD/YYYY)
          </Typography>
          <TextField
            margin="dense"
            name="date"
            fullWidth
            placeholder="MM/DD/YYYY"
            value={invoiceData.date}
            onChange={handleChange}
            error={!!dateError}
            helperText={dateError || "Enter date as MM/DD/YYYY"}
          />
          <Typography variant="subtitle2" style={{ marginTop: "10px" }}>
            Upload File
          </Typography>
          <input
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={handleFileChange}
            style={{ marginTop: "5px" }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">Cancel</Button>
          <Button onClick={handleSave} color="primary" variant="contained">Save Invoice</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default AddInvoice;
