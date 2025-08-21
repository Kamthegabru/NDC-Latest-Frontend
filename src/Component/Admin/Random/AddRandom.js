import React, { useState, useContext } from 'react';
import {
  Box, Button, Dialog, DialogTitle, DialogContent, DialogActions,
  FormControl, InputLabel, Select, MenuItem
} from '@mui/material';
import RandomContext from '../../../Context/Admin/Random/RandomContext';

function AddRandom() {
  const { RandomUserAddDetails, AddRandomDriver, fetchRandomDriver, fetchRandomData } = useContext(RandomContext);
  const [open, setOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState('');
  const [selectedCompanyName, setSelectedCompanyName] = useState('');
  const [drivers, setDrivers] = useState([]);
  const [selectedDriver, setSelectedDriver] = useState('');
  const [selectedDriverName, setSelectedDriverName] = useState('');
  const [year, setYear] = useState('');
  const [quarter, setQuarter] = useState('');
  const [testType, setTestType] = useState('');

  const years = ["2023", "2024", "2025", "2026", "2027", "2028", "2029"];
  const quarters = ["Q1", "Q2", "Q3", "Q4"];
  const testTypes = [ "BAT","DOT PANEL"];

  const handleCompanyChange = (e) => {
    const selectedId = e.target.value;
    setSelectedCompany(selectedId);
    const company = RandomUserAddDetails.find(comp => comp.companyId === selectedId);
    setDrivers(company?.drivers || []);
    setSelectedDriver('');
    setSelectedCompanyName(company?.companyName || ''); // Set selected company name
  };

  const handleDriverChange = (e) => {
    const selectedId = e.target.value;
    setSelectedDriver(selectedId);
    const driver = drivers.find(drv => drv.driverId === selectedId);
    setSelectedDriverName(driver?.driverName || ''); // Set selected driver name
  };

  const handleSubmit = async () => {
    const data = {
      year,
      quarter,
      companyId: selectedCompany,
      companyName: selectedCompanyName,
      driverId: selectedDriver,
      driverName: selectedDriverName,
      testType
    };
    await AddRandomDriver(data)
    fetchRandomData();
    // Reset the form after submitting
    setSelectedCompany('');
    setSelectedCompanyName('');
    setSelectedDriver('');
    setSelectedDriverName('');
    setYear('');
    setQuarter('');
    setTestType('');
    setOpen(false);
  };

  return (
    <Box>
      <Button
        variant="contained"
        onClick={async () => {
          await fetchRandomDriver();  // Wait for data to be fetched
          setOpen(true);              // Then open the dialog
        }}
        style={{
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
        }}
      >
        Add Random
      </Button>

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Add Random Test Entry</DialogTitle>
        <DialogContent dividers>

          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Year</InputLabel>
            <Select value={year} onChange={(e) => setYear(e.target.value)} label="Year">
              {years.map((y) => <MenuItem key={y} value={y}>{y}</MenuItem>)}
            </Select>
          </FormControl>

          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Quarter</InputLabel>
            <Select value={quarter} onChange={(e) => setQuarter(e.target.value)} label="Quarter">
              {quarters.map((q) => <MenuItem key={q} value={q}>{q}</MenuItem>)}
            </Select>
          </FormControl>

          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Company Name</InputLabel>
            <Select value={selectedCompany} onChange={handleCompanyChange} label="Company Name">
              {RandomUserAddDetails?.map((company) => (
                <MenuItem key={company.companyId} value={company.companyId}>
                  {company.companyName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth sx={{ mt: 2 }} disabled={!selectedCompany}>
            <InputLabel>Driver Name</InputLabel>
            <Select value={selectedDriver} onChange={handleDriverChange} label="Driver Name">
              {drivers.map((driver) => (
                <MenuItem key={driver.driverId} value={driver.driverId}>
                  {driver.driverName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Test Type</InputLabel>
            <Select value={testType} onChange={(e) => setTestType(e.target.value)} label="Test Type">
              {testTypes.map((type, i) => (
                <MenuItem key={i} value={type}>{type}</MenuItem>
              ))}
            </Select>
          </FormControl>

        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="secondary">Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" disabled={!selectedDriver}>Submit</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default AddRandom;
