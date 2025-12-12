import React, { useContext } from 'react';
import { Button, Box } from '@mui/material';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import RandomContext from '../../../Context/Agency/Random/RandomContext';
import { toProperCase, toUpperCase } from '../../Utils/formatText';

function ExportRandom() {
    const columns = ["Company Name", "Driver Name", "Year", "Quarter", "Test Type", "Status"];
    const { randomUserDetails, yearFilter, quarterFilter } = useContext(RandomContext);
    const getFilteredData = (randomUserDetails) => {
        return randomUserDetails?.filter(item => {
            const matchYear = yearFilter === 'All' || item.year === yearFilter;
            const matchQuarter = quarterFilter === 'All' || item.quarter === quarterFilter;
            return matchYear && matchQuarter;
        }) || [];
    };

    const prepareDataRows = (data) => {
        return data.map(item => [
            toUpperCase(item.company?.name) || 'N/A',
            toProperCase(item.driver?.name) || 'N/A',
            item.year,
            item.quarter,
            item.testType,
            item.status || 'pending'
        ]);
    };

    const handleExcelExport = () => {
        const filteredData = getFilteredData(randomUserDetails);
        const rows = prepareDataRows(filteredData);
        const worksheet = XLSX.utils.aoa_to_sheet([columns, ...rows]);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Random Data');
        XLSX.writeFile(workbook, 'RandomData.xlsx');
    };

    const handlePdfExport = () => {
        const filteredData = getFilteredData(randomUserDetails);
        const rows = prepareDataRows(filteredData);
        const doc = new jsPDF();
        doc.text("Random Data", 14, 15);
        autoTable(doc, {
            head: [columns],
            body: rows,
            startY: 20,
        });
        doc.save('RandomData.pdf');
    };

    return (
        <Box display="flex" gap={2}>
            <Button variant="contained" onClick={handlePdfExport} style={{
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
                Export PDF
            </Button>
            <Button variant="contained"  onClick={handleExcelExport} style={{
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
                Export Excel
            </Button>
        </Box>
    );
}

export default ExportRandom;
