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

const API_URL = process.env.REACT_APP_API_URL;

function ExportAgency() {
  const [open, setOpen] = useState(false);
  const [agencyData, setAgencyData] = useState([]);

  const handleExport = async () => {
    try {
      const response = await axios.get(`${API_URL}/admin/exportAgency`);
      const agencies = response.data.data;
      setAgencyData(agencies);
      setOpen(true); // Open modal with data
    } catch (error) {
      console.error("Failed to export agency data:", error);
    }
  };

  const handleDownload = () => {
    const excelData = agencyData.map(agency => ({
      "Agency Name": agency.agencyName,
      "Company Name": agency.companyName,
      "Enrollment Date": agency.enrollmentDate,
      "Total Drivers": agency.totalDrivers,
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Agencies");

    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const fileData = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(fileData, "AgencyExport.xlsx");
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
        Export Agency
      </Button>

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="md">
        <DialogTitle>Agency Preview</DialogTitle>
        <DialogContent>
          {agencyData.length === 0 ? (
            <Typography>No data available.</Typography>
          ) : (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Agency Name</TableCell>
                  <TableCell>Company Name</TableCell>
                  <TableCell>Enrollment Date</TableCell>
                  <TableCell>Total Drivers</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {agencyData.map((agency, index) => (
                  <TableRow key={index}>
                    <TableCell>{agency.agencyName}</TableCell>
                    <TableCell>{agency.companyName}</TableCell>
                    <TableCell>{agency.enrollmentDate}</TableCell>
                    <TableCell>{agency.totalDrivers}</TableCell>
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

export default ExportAgency;
