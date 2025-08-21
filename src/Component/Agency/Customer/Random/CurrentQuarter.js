import React, { useState, useEffect, useContext } from 'react';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Paper, Box, CircularProgress,
} from '@mui/material';

import CustomerContext from "../../../../Context/Agency/Customer/CustomerContext";

function CurrentQuarter() {
    const { userDetails } = useContext(CustomerContext);
    const [randomDriver, setRandomDriver] = useState(userDetails.randoms);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (userDetails && userDetails.randoms) {
            const now = new Date();
            const currentYear = now.getFullYear();
            const currentMonth = now.getMonth(); // 0 = Jan, 11 = Dec

            const currentQuarter = `Q${Math.floor(currentMonth / 3) + 1}`;

            const filtered = userDetails.randoms.filter(item =>
                item.year === currentYear && item.quarter === currentQuarter
            );

            setRandomDriver(filtered);
            setLoading(false);
        }
    }, [userDetails]);



    return (
        <div className=''>
            <Box>
                <TableContainer component={Paper} sx={{ mt: 3, p: 2, borderRadius: 2, boxShadow: 3 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                            Random Users for current quarter
                        </Typography>
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
                                {randomDriver?.length > 0 ? (
                                    randomDriver.map((item, index) => (
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
                                            <b>No driver get selected for this quarter</b>
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

export default CurrentQuarter;
