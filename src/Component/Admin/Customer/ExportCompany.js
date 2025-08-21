import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Typography,
} from "@mui/material";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import axios from "axios";

const API_URL = "http://localhost:8000/api";

function ExportCompany() {
  const [open, setOpen] = useState(false);
  const [companyData, setCompanyData] = useState([]);

  const handleExport = async () => {
    try {
      const response = await axios.get(`${API_URL}/admin/exportCompany`);
      const companies = response.data.data;
      setCompanyData(companies);
      setOpen(true);
    } catch (error) {
      console.error("Failed to export company data:", error);
    }
  };

  const handleDownload = () => {
    const excelData = companyData.map(company => ({
      "Company Name": company["Company Name"] || "N/A",
      "Status": company["Status"] || "Inactive",
      "Membership Active Date": company["Membership Active Date"] !== "N/A" ? company["Membership Active Date"] : "Not Available",
      "Membership Price": company["Membership Price"] || "N/A",
      "Agency Name": company["Agency Name"] || "N/A",
      "Total Drivers": company["Total Drivers"] || 0,
      "Address": company["Address"] || "N/A",
      "City": company["City"] || "N/A",
      "Zipcode": company["Zipcode"] || "N/A",
      "Contact": company["Contact"] || "N/A",
      "Email": company["Email"] || "N/A",
      "Name on Credit Card": company["Name on Credit Card"] || "N/A",
      "Credit Card Number": company["Credit Card Number"] || "N/A",
      "CC - CVC": company["CC - CVC"] || "N/A",
      "CC - Expiration Date": company["CC - Expiration Date"] || "N/A",
      "CC - Billing Zipcode": company["CC - Billing Zipcode"] || "N/A",
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Companies");

    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const fileData = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(fileData, "CompanyExport.xlsx");
  };

  return (
    <div>
      <Button variant="contained" color="primary" onClick={handleExport} style={{
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
      }}>
        Export Company
      </Button>

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="lg">
        <DialogTitle>Company Preview</DialogTitle>
        <DialogContent>
          {companyData.length === 0 ? (
            <Typography>No data available.</Typography>
          ) : (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Company Name</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Membership Active Date</TableCell>
                  <TableCell>Membership Price</TableCell>
                  <TableCell>Agency Name</TableCell>
                  <TableCell>Total Drivers</TableCell>
                  <TableCell>Address</TableCell>
                  <TableCell>City</TableCell>
                  <TableCell>Zipcode</TableCell>
                  <TableCell>Contact</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Name on Credit Card</TableCell>
                  <TableCell>Credit Card Number</TableCell>
                  <TableCell>CC - CVC</TableCell>
                  <TableCell>CC - Expiration Date</TableCell>
                  <TableCell>CC - Billing Zipcode</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {companyData.map((company, index) => (
                  <TableRow key={index}>
                    <TableCell>{company["Company Name"] || "N/A"}</TableCell>
                    <TableCell>{company["Status"] || "Inactive"}</TableCell>
                    <TableCell>{company["Membership Active Date"] !== "N/A" ? company["Membership Active Date"] : "Not Available"}</TableCell>
                    <TableCell>{company["Membership Price"] || "N/A"}</TableCell>
                    <TableCell>{company["Agency Name"] || "N/A"}</TableCell>
                    <TableCell>{company["Total Drivers"] || 0}</TableCell>
                    <TableCell>{company["Address"] || "N/A"}</TableCell>
                    <TableCell>{company["City"] || "N/A"}</TableCell>
                    <TableCell>{company["Zipcode"] || "N/A"}</TableCell>
                    <TableCell>{company["Contact"] || "N/A"}</TableCell>
                    <TableCell>{company["Email"] || "N/A"}</TableCell>
                    <TableCell>{company["Name on Credit Card"] || "N/A"}</TableCell>
                    <TableCell>{company["Credit Card Number"] || "N/A"}</TableCell>
                    <TableCell>{company["CC - CVC"] || "N/A"}</TableCell>
                    <TableCell>{company["CC - Expiration Date"] || "N/A"}</TableCell>
                    <TableCell>{company["CC - Billing Zipcode"] || "N/A"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" color="primary" onClick={handleDownload}>
            Download as Excel
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default ExportCompany;
