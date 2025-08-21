import React, { useContext, useState, useMemo, useEffect } from "react";
import {
    Box,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    Typography,
    TextField,
    TableSortLabel,
    Chip,
    MenuItem,
    Select,
    InputLabel,
    FormControl,
    Tooltip,
    CircularProgress,
    Avatar,
    Pagination,
    Stack,
    Checkbox,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions
} from "@mui/material";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import StarIcon from "@mui/icons-material/Star";
import RefreshIcon from "@mui/icons-material/Refresh";
import DeleteIcon from "@mui/icons-material/Delete";
import AdminContext from "../../../Context/Admin/AdminContext";
import CustomerContext from "../../../Context/Admin/Customer/CustomerContext";
import ExportDriver from "./ExportDriver";
import ExportCompany from "./ExportCompany";
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import dayjs from "dayjs";

const normalizePhoneNumber = require('../../Utils/normalizePhone');

const STATUS_OPTIONS = ["All", "Active", "Inactive"];
const PAGE_SIZE = 10;

function ViewCustomer() {
    const { AllUserData, setCurrentActiveButton, getAllAdminData } = useContext(AdminContext);
    const { getSingleUserData, setLoading, setUserDetails } = useContext(CustomerContext);

    const [searchTerm, setSearchTerm] = useState("");
    const [searchTermByUSDOT, setSearchTermByUSDOT] = useState("");
    const [sortOrder, setSortOrder] = useState("asc");
    const [statusFilter, setStatusFilter] = useState("All");
    const [loading, setLocalLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [range, setRange] = useState({ from: undefined, to: undefined });
    const [showCalendar, setShowCalendar] = useState(false);
    const [selectedIds, setSelectedIds] = useState([]);
    const [showRemoveDialog, setShowRemoveDialog] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);

    useEffect(() => {
        setLocalLoading(true);
        getAllAdminData().finally(() => {
            setLocalLoading(false);
            setInitialLoading(false);
        });
        // eslint-disable-next-line
    }, []);

    const handleViewDetails = (user) => {
        setUserDetails(null);
        setLoading(true);
        getSingleUserData(user.id);
        setCurrentActiveButton(5);
    };

    const handleSort = () => {
        setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    };

    const handleStatusFilter = (event) => {
        setStatusFilter(event.target.value);
        setPage(1);
    };

    // Reset filters
    const handleResetFilters = () => {
        setSearchTerm("");
        setSearchTermByUSDOT("");
        setStatusFilter("All");
        setRange({ from: undefined, to: undefined });
        setPage(1);
        setSelectedIds([]);
    };

    // Highlight top companies by activeDriversCount
    const filteredAndSortedUsers = useMemo(() => {
        let filtered = AllUserData.filter((user) =>
            user.companyName.toLowerCase().includes(searchTerm.toLowerCase()) &&
            user.companyUSDOTNumber.toLowerCase().includes(searchTermByUSDOT.toLowerCase()) &&
            (statusFilter === "All" || user.status === statusFilter)
        );

        // Date range filter using react-day-picker
        if (range.from && range.to) {
            filtered = filtered.filter((user) => {
                const createdDate = dayjs(user.createdAt);
                return createdDate.isAfter(dayjs(range.from).subtract(1, 'day')) &&
                    createdDate.isBefore(dayjs(range.to).add(1, 'day'));
            });
        }

        filtered.sort((a, b) => {
            const nameA = a.companyName.toLowerCase();
            const nameB = b.companyName.toLowerCase();
            if (nameA < nameB) return sortOrder === "asc" ? -1 : 1;
            if (nameA > nameB) return sortOrder === "asc" ? 1 : -1;
            return 0;
        });

        return filtered;
    }, [AllUserData, searchTerm, searchTermByUSDOT, sortOrder, statusFilter, range]);

    const topCompanyIds = useMemo(() => {
        if (!filteredAndSortedUsers.length) return [];
        const sorted = [...filteredAndSortedUsers].sort((a, b) => b.activeDriversCount - a.activeDriversCount);
        return sorted.slice(0, 3).map(u => u.id);
    }, [filteredAndSortedUsers]);

    // Pagination
    const paginatedUsers = useMemo(() => {
        const start = (page - 1) * PAGE_SIZE;
        return filteredAndSortedUsers.slice(start, start + PAGE_SIZE);
    }, [filteredAndSortedUsers, page]);

    // Format date for display
    const formatDate = (dateStr) => {
        if (!dateStr) return "-";
        return dayjs(dateStr).format("DD MMM YYYY, hh:mm A");
    };

    // Selection logic
    const handleSelect = (id) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
        );
    };

    const handleRemoveSelected = () => {
        setShowRemoveDialog(true);
    };

    const confirmRemove = () => {
        // Here you should call your API to remove selected users
        // For demo, just clear selection
        setSelectedIds([]);
        setShowRemoveDialog(false);
    };

    return (
        <>
            <Dialog open={showRemoveDialog} onClose={() => setShowRemoveDialog(false)}>
                <DialogTitle>Confirm Removal</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to remove the selected customer(s)?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setShowRemoveDialog(false)} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={confirmRemove} color="error" variant="contained">
                        Remove
                    </Button>
                </DialogActions>
            </Dialog>
            <TableContainer component={Paper} sx={{
                mt: 3, p: 2, borderRadius: 3, boxShadow: 6,
                background: "linear-gradient(135deg, #e3f2fd 0%, #f5f5f5 100%)"
            }}>
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 2,
                    }}
                >
                    <Typography variant="h5" sx={{
                        fontWeight: "bold",
                        color: "#003366",
                        letterSpacing: 1,
                        background: "linear-gradient(90deg, #003366 60%, #1976d2 100%)",
                        px: 2,
                        py: 1,
                        borderRadius: 2,
                        boxShadow: 2,
                        color: "#fff"
                    }}>
                        Customer List
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <TextField
                            size="small"
                            label="Company Name"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            sx={{ minWidth: 180 }}
                        />
                        <TextField
                            size="small"
                            label="USDOT Code"
                            value={searchTermByUSDOT}
                            onChange={(e) => setSearchTermByUSDOT(e.target.value)}
                            sx={{ minWidth: 140 }}
                        />
                        <FormControl size="small" sx={{ minWidth: 120 }}>
                            <InputLabel>Status</InputLabel>
                            <Select
                                value={statusFilter}
                                label="Status"
                                onChange={handleStatusFilter}
                            >
                                {STATUS_OPTIONS.map((status) => (
                                    <MenuItem key={status} value={status}>{status}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <Typography variant="body2" sx={{ fontWeight: "bold", color: "#003366" }}>
                                Date Range:
                            </Typography>
                            <Box>
                                <Chip
                                    label={
                                        range.from && range.to
                                            ? `${dayjs(range.from).format("DD MMM YYYY")} - ${dayjs(range.to).format("DD MMM YYYY")}`
                                            : "Select Range"
                                    }
                                    color="info"
                                    variant="outlined"
                                    onClick={() => setShowCalendar(!showCalendar)}
                                    sx={{ cursor: "pointer", fontWeight: "bold" }}
                                />
                                {showCalendar && (
                                    <Box sx={{
                                        position: "absolute",
                                        zIndex: 10,
                                        mt: 2,
                                        background: "#fff",
                                        boxShadow: 6,
                                        borderRadius: 2,
                                        p: 2
                                    }}>
                                        <DayPicker
                                            mode="range"
                                            selected={range}
                                            onSelect={setRange}
                                            numberOfMonths={2}
                                            showOutsideDays
                                            footer={
                                                <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 1 }}>
                                                    <Chip
                                                        label="Done"
                                                        color="primary"
                                                        onClick={() => setShowCalendar(false)}
                                                        sx={{ cursor: "pointer" }}
                                                    />
                                                </Box>
                                            }
                                        />
                                    </Box>
                                )}
                            </Box>
                        </Box>
                        <Button
                            variant="contained"
                            color="error"
                            startIcon={<DeleteIcon />}
                            disabled={selectedIds.length === 0}
                            onClick={handleRemoveSelected}
                        >
                            Remove
                        </Button>
                        <Tooltip title="Reset Filters">
                            <IconButton onClick={handleResetFilters} color="info">
                                <RefreshIcon />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Export Driver Data">
                            <span><ExportDriver /></span>
                        </Tooltip>
                        <Tooltip title="Export Company Data">
                            <span><ExportCompany /></span>
                        </Tooltip>
                    </Box>
                </Box>
                {initialLoading ? (
                    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 300 }}>
                        <CircularProgress color="primary" size={60} />
                        <Typography sx={{ mt: 2, fontWeight: "bold", color: "#1976d2" }}>Loading Customers...</Typography>
                    </Box>
                ) : (
                    <>
                        <Table stickyHeader>
                            <TableHead>
                                <TableRow sx={{ backgroundColor: "#003366" }}>
                                    <TableCell align="center" sx={{ color: "#003366", background: "#e3f2fd", fontWeight: "bold", fontSize: 16 }}>
                                        <Checkbox
                                            checked={paginatedUsers.length > 0 && paginatedUsers.every(u => selectedIds.includes(u.id))}
                                            indeterminate={selectedIds.length > 0 && selectedIds.length < paginatedUsers.length}
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    setSelectedIds(paginatedUsers.map(u => u.id));
                                                } else {
                                                    setSelectedIds([]);
                                                }
                                            }}
                                            color="primary"
                                        />
                                    </TableCell>
                                    <TableCell align="center" sx={{ color: "#003366", background: "#e3f2fd", fontWeight: "bold", fontSize: 16 }}>
                                        Sr
                                    </TableCell>
                                    <TableCell align="center" sx={{ color: "#003366", background: "#e3f2fd", fontWeight: "bold", fontSize: 16 }}>
                                        <TableSortLabel
                                            active={true}
                                            direction={sortOrder}
                                            onClick={handleSort}
                                            sx={{
                                                color: "#003366",
                                                '&.Mui-active': {
                                                    color: "#003366",
                                                },
                                                '& .MuiTableSortLabel-icon': {
                                                    color: "#003366 !important",
                                                },
                                            }}
                                        >
                                            Company Name
                                        </TableSortLabel>
                                    </TableCell>
                                    <TableCell align="center" sx={{ color: "#003366", background: "#e3f2fd", fontWeight: "bold", fontSize: 16 }}>Contact No</TableCell>
                                    <TableCell align="center" sx={{ color: "#003366", background: "#e3f2fd", fontWeight: "bold", fontSize: 16 }}>Email</TableCell>
                                    <TableCell align="center" sx={{ color: "#003366", background: "#e3f2fd", fontWeight: "bold", fontSize: 16 }}>Date</TableCell>
                                    <TableCell align="center" sx={{ color: "#003366", background: "#e3f2fd", fontWeight: "bold", fontSize: 16 }}>Active Employees</TableCell>
                                    <TableCell align="center" sx={{ color: "#003366", background: "#e3f2fd", fontWeight: "bold", fontSize: 16 }}>Status</TableCell>
                                    <TableCell align="center" sx={{ color: "#003366", background: "#e3f2fd", fontWeight: "bold", fontSize: 16 }}>USDOT</TableCell>
                                    <TableCell align="center" sx={{ color: "#003366", background: "#e3f2fd", fontWeight: "bold", fontSize: 16 }}>Logo</TableCell>
                                    <TableCell align="center" sx={{ color: "#003366", background: "#e3f2fd", fontWeight: "bold", fontSize: 16 }}>Details</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {paginatedUsers.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={11} align="center">
                                            <Typography color="text.secondary">No customers found.</Typography>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    paginatedUsers.map((user, index) => (
                                        <TableRow key={index} hover>
                                            <TableCell align="center">
                                                <Checkbox
                                                    checked={selectedIds.includes(user.id)}
                                                    onChange={() => handleSelect(user.id)}
                                                    color="primary"
                                                />
                                            </TableCell>
                                            <TableCell align="center">
                                                {(page - 1) * PAGE_SIZE + index + 1}
                                            </TableCell>
                                            <TableCell align="center">
                                                <Stack direction="row" alignItems="center" justifyContent="center" spacing={1}>
                                                    <Typography fontWeight="bold">{user.companyName}</Typography>
                                                    {topCompanyIds.includes(user.id) && (
                                                        <Tooltip title="Top Company">
                                                            <StarIcon sx={{ color: "#FFD700" }} />
                                                        </Tooltip>
                                                    )}
                                                </Stack>
                                            </TableCell>
                                            <TableCell align="center">
                                                <Chip
                                                    label={normalizePhoneNumber(user.companyContactNumber)}
                                                    color="primary"
                                                    variant="outlined"
                                                />
                                            </TableCell>
                                            <TableCell align="center">
                                                <Tooltip title={user.companyEmail}>
                                                    <Typography noWrap maxWidth={120}>{user.companyEmail}</Typography>
                                                </Tooltip>
                                            </TableCell>
                                            <TableCell align="center">
                                                <Chip
                                                    label={formatDate(user.createdAt)}
                                                    color="secondary"
                                                    variant="outlined"
                                                    sx={{ fontWeight: "bold", fontSize: 15 }}
                                                />
                                            </TableCell>
                                            <TableCell align="center">
                                                <Chip
                                                    label={user.activeDriversCount}
                                                    color="info"
                                                    variant="filled"
                                                />
                                            </TableCell>
                                            <TableCell align="center">
                                                <Chip
                                                    label={user.status}
                                                    color={user.status === "Active" ? "success" : "error"}
                                                    variant="filled"
                                                />
                                            </TableCell>
                                            <TableCell align="center">
                                                <Typography fontWeight="medium">{user.companyUSDOTNumber}</Typography>
                                            </TableCell>
                                            <TableCell align="center">
                                                <Avatar
                                                    src={user.logoUrl || ""}
                                                    alt={user.companyName}
                                                    sx={{ width: 32, height: 32, bgcolor: "#e0e0e0", mx: "auto" }}
                                                />
                                            </TableCell>
                                            <TableCell align="center">
                                                <Tooltip title="View Details">
                                                    <IconButton onClick={() => handleViewDetails(user)} color="primary">
                                                        <ArrowForwardIosIcon />
                                                    </IconButton>
                                                </Tooltip>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                        <Stack direction="row" justifyContent="center" alignItems="center" sx={{ mt: 2 }}>
                            <Pagination
                                count={Math.ceil(filteredAndSortedUsers.length / PAGE_SIZE)}
                                page={page}
                                onChange={(_, value) => setPage(value)}
                                color="primary"
                                shape="rounded"
                                showFirstButton
                                showLastButton
                            />
                        </Stack>
                    </>
                )}
            </TableContainer>
        </>
    );
}

export default ViewCustomer;