import React, { useEffect, useState } from 'react';
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import {
  Box, CircularProgress, FormControl, InputLabel, MenuItem,
  Paper, Select, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Typography
} from '@mui/material';

const API_URL = process.env.REACT_APP_API_URL;

function ShowRandom() {
  const [randomUserDetails, setRandomUserDetails] = useState([]);
  const [yearFilter, setYearFilter] = useState("All");
  const [quarterFilter, setQuarterFilter] = useState("All");

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const token = Cookies.get("token");
      try {
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        const response = await axios.get(`${API_URL}/agency/fetchRandomData`);
        setRandomUserDetails(response.data.data);
        setLoading(false);
      } catch {
        toast.error("Server error, Please try again later");
      }

    };
    load();
    // eslint-disable-next-line
  }, []);

  const uniqueYears = ["All", ...new Set(randomUserDetails?.map(item => item.year).filter(Boolean))];
  const uniqueQuarters = ["All", ...new Set(randomUserDetails?.map(item => item.quarter).filter(Boolean))];

  const filteredData = randomUserDetails?.filter(item => {
    const matchYear = yearFilter === "All" || item.year === yearFilter;
    const matchQuarter = quarterFilter === "All" || item.quarter === quarterFilter;
    return matchYear && matchQuarter;
  });

  return (
    <Box>
      <TableContainer component={Paper} sx={{ mt: 3, p: 2, borderRadius: 2, boxShadow: 3 }}>
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" height="150px">
            <CircularProgress />
          </Box>
        ) : (
          <>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                Random Users
              </Typography>
              <Box display="flex" gap={2}>
                <FormControl size="small" sx={{ minWidth: 120 }}>
                  <InputLabel>Year</InputLabel>
                  <Select
                    value={yearFilter}
                    label="Year"
                    onChange={(e) => setYearFilter(e.target.value)}
                  >
                    {uniqueYears.map((year, i) => (
                      <MenuItem key={i} value={year}>{year}</MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl size="small" sx={{ minWidth: 120 }}>
                  <InputLabel>Quarter</InputLabel>
                  <Select
                    value={quarterFilter}
                    label="Quarter"
                    onChange={(e) => setQuarterFilter(e.target.value)}
                  >
                    {uniqueQuarters.map((qtr, i) => (
                      <MenuItem key={i} value={qtr}>{qtr}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            </Box>

            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#003366' }}>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Company Name</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Driver Name</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Year</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Quarter</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Test Type</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredData?.length > 0 ? (
                  filteredData.map((item, index) => (
                    <TableRow key={index} hover>
                      <TableCell>{item.company?.name || "N/A"}</TableCell>
                      <TableCell>{item.driver?.name || "N/A"}</TableCell>
                      <TableCell>{item.year}</TableCell>
                      <TableCell>{item.quarter}</TableCell>
                      <TableCell>{item.testType}</TableCell>
                      <TableCell
                        style={{
                          color:
                            item.status === "Completed"
                              ? "green"
                              : item.status === "Pending"
                                ? "#b58900"
                                : item.status === "Scheduled"
                                  ? "orange"
                                  : "black",
                          fontWeight: "bold",
                        }}
                      >
                        {item.status}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} align="center">No data found.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </>
        )}
      </TableContainer>
    </Box>
  );
}

export default ShowRandom;
