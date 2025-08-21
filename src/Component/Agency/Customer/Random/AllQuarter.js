import React, { useState, useEffect, useContext } from 'react';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Paper, Box, CircularProgress,
    FormControl, Select, InputLabel, MenuItem as SelectItem
} from '@mui/material';

import CustomerContext from "../../../../Context/Agency/Customer/CustomerContext";

function AllQuarter() {
    const { userDetails } = useContext(CustomerContext);
    const [randomDriver, setRandomDriver] = useState(userDetails.randoms);
    const [loading, setLoading] = useState(true);
    const [yearFilter, setYearFilter] = useState("All");
    const [quarterFilter, setQuarterFilter] = useState("All");

    useEffect(() => {
        if (userDetails) {
            setRandomDriver(userDetails.randoms)
            setLoading(false);
        }
    }, [userDetails]);

    const uniqueYears = [
        "All",
        ...new Set(randomDriver?.map(item => item.year).filter(Boolean))
    ];
    const uniqueQuarters = [
        "All",
        ...new Set(randomDriver?.map(item => item.quarter).filter(Boolean))
    ];

    const filteredData = randomDriver?.filter(item => {
        const matchYear = yearFilter === "All" || item.year === yearFilter;
        const matchQuarter = quarterFilter === "All" || item.quarter === quarterFilter;
        return matchYear && matchQuarter;
    });

    return (
        <div className=''>
            <Box>
                <TableContainer component={Paper} sx={{ mt: 3, p: 2, borderRadius: 2, boxShadow: 3 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                            Random Users of all year and all quarter
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
                                        <SelectItem key={i} value={year}>{year}</SelectItem>
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
                                        <SelectItem key={i} value={qtr}>{qtr}</SelectItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Box>
                    </Box>

                    {loading ? (
                        <Box display="flex" justifyContent="center" alignItems="center" height="150px">
                            <CircularProgress />
                        </Box>
                    ) : (
                        <Table>
                            <TableHead>
                                <TableRow sx={{ backgroundColor: "#003366" }}>
                                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>Company Name</TableCell>
                                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>Driver Name</TableCell>
                                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>Year</TableCell>
                                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>Quarter</TableCell>
                                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>Test Type</TableCell>
                                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>Status</TableCell>
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
                                            <TableCell>{item.status || "pending"}</TableCell>
                                        </TableRow>

                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={7} align="center">
                                            No data found.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    )}
                </TableContainer>
            </Box>
        </div>
    );
}

export default AllQuarter;
