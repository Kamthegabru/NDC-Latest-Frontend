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
import { formatDateUS } from "../../Utils/formatDateUs";

const API_URL = process.env.REACT_APP_API_URL;

function ExportDriver() {
    const [open, setOpen] = useState(false);
    const [driverData, setDriverData] = useState([]);
    
const handleExport = async () => {
  try {
    console.log("Exporting from:", `${API_URL}/admin/exportDriver`);
    const response = await axios.get(`${API_URL}/admin/exportDriver`);

    // Depending on your backend, this might be response.data or response.data.data
    const drivers = response.data?.data ?? response.data ?? [];
    console.log("Driver export response:", drivers);

    setDriverData(drivers);
    setOpen(true);
  } catch (error) {
    console.error("Failed to export driver data:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      url: error.config?.url,
      method: error.config?.method,
    });

    alert(
      `Export failed (${error.response?.status || "no status"}): ${
        error.response?.data?.message ||
        error.response?.data ||
        error.message
      }`
    );
   /* const handleExport = async () => {
        try {
            const response = await axios.get(`${API_URL}/admin/exportDriver`);
            const drivers = response.data.data;
            setDriverData(drivers);
            setOpen(true);
        } catch (error) {
            console.error("Failed to export driver data:", error);
        }
    };
*/
   const handleDownload = () => {
    // Always convert to strings in the desired format before exporting
    const excelData = driverData.map(driver => ({
      "Driver Name": `${driver.first_name ?? ""} ${driver.last_name ?? ""}`.trim(),
      "DOB": formatDateUS(driver.dob),
      "License Number": driver.government_id || "N/A",
      "Company Name": driver.companyName || "N/A",
      "Company Email": driver.companyEmail || "N/A",
      "Date Added": formatDateUS(driver.creationDate),
      "Date Deleted": driver?.deletionDate
        ? formatDateUS(driver.deletionDate)
        : "Not Deleted",
      "Agency Name": driver.agencyName || "N/A",
    }));

        const worksheet = XLSX.utils.json_to_sheet(excelData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Drivers");

        const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
        const fileData = new Blob([excelBuffer], { type: "application/octet-stream" });
        saveAs(fileData, "DriverExport.xlsx");
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
                Export Driver
            </Button>

            <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="lg">
                <DialogTitle>Driver Preview</DialogTitle>
                <DialogContent>
                    {driverData.length === 0 ? (
                        <Typography>No data available.</Typography>
                    ) : (
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Driver Name</TableCell>
                                    <TableCell style={{ minWidth: '120px' }}>DOB</TableCell>
                                    <TableCell>License Number</TableCell>
                                    <TableCell>Company Name</TableCell>
                                    <TableCell>Company Email</TableCell>
                                    <TableCell style={{ minWidth: '120px' }}>Date Added</TableCell>
                                    <TableCell style={{ minWidth: '120px' }}>Date Deleted</TableCell>
                                    <TableCell>Agency Name</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {driverData.map((driver, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{driver.first_name} {driver.last_name}</TableCell>
                                        <TableCell style={{ minWidth: '120px' }}>{formatDateUS(driver.dob)}</TableCell>
                                        <TableCell>{driver.government_id}</TableCell>
                                        <TableCell>{driver.companyName}</TableCell>
                                        <TableCell>{driver.companyEmail}</TableCell>
                                        <TableCell style={{ minWidth: '120px' }}>{driver.creationDate ? new Date(driver.creationDate).toLocaleDateString("en-US") : "N/A"}</TableCell>
                                        <TableCell style={{ minWidth: '120px' }}>{driver?.deletionDate
                                            ? new Date(driver.deletionDate).toLocaleDateString("en-US", { year: 'numeric', month: '2-digit', day: '2-digit' })
                                            : "Not Deleted"}
                                        </TableCell>
                                        <TableCell>{driver.agencyName}</TableCell>
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

export default ExportDriver;
