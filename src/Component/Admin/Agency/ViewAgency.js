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
import BusinessIcon from "@mui/icons-material/Business";
import AdminContext from "../../../Context/Admin/AdminContext";
import CustomerContext from "../../../Context/Admin/Agency/AgencyContext";
import ExportAgency from "./ExportAgency";
import CreateNewAgency from "./CreateNewAgency";
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import dayjs from "dayjs";
import { toUpperCase } from '../../Utils/formatText';

const normalizePhoneNumber = require('../../Utils/normalizePhone');

const STATUS_OPTIONS = ["All", "Active", "Inactive"];
const PAGE_SIZE = 10;

// Cache implementation
const cache = {
    data: null,
    timestamp: null,
    expiryTime: 5 * 60 * 1000, // 5 minutes
    
    set(data) {
        this.data = data;
        this.timestamp = Date.now();
    },
    
    get() {
        if (this.data && this.timestamp && (Date.now() - this.timestamp) < this.expiryTime) {
            return this.data;
        }
        return null;
    },
    
    clear() {
        this.data = null;
        this.timestamp = null;
    }
};

function ViewAgency() {
    const { setCurrentActiveButton, getAllAdminData } = useContext(AdminContext);
    const { getSingleAgencyData, setLoading, setAgencyDetails, AllAgencyData, getAllAgencyData } = useContext(CustomerContext);

    const [searchTerm, setSearchTerm] = useState("");
    const [searchTermByCode, setSearchTermByCode] = useState("");
    const [sortOrder, setSortOrder] = useState("asc");
    const [statusFilter, setStatusFilter] = useState("All");
    const [loading, setLocalLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [range, setRange] = useState({ from: undefined, to: undefined });
    const [showCalendar, setShowCalendar] = useState(false);
    const [selectedIds, setSelectedIds] = useState([]);
    const [showRemoveDialog, setShowRemoveDialog] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [isFromCache, setIsFromCache] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            // Check cache first
            const cachedData = cache.get();
            if (cachedData) {
                setIsFromCache(true);
                setInitialLoading(false);
                return;
            }

            setLocalLoading(true);
            setIsFromCache(false);
            
            try {
                // Load agency data (assuming you have this method)
                await getAllAgencyData();
                // Cache the data
                cache.set(AllAgencyData);
            } catch (error) {
                console.error('Error loading agency data:', error);
            } finally {
                setLocalLoading(false);
                setInitialLoading(false);
            }
        };

        loadData();
        // eslint-disable-next-line
    }, []);

    const handleViewDetails = (agency) => {
        setAgencyDetails(null);
        setLoading(true);
        getSingleAgencyData(agency.id);
        setCurrentActiveButton(6);
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
        setSearchTermByCode("");
        setStatusFilter("All");
        setRange({ from: undefined, to: undefined });
        setPage(1);
        setSelectedIds([]);
    };

    // Refresh data and clear cache
    const handleRefreshData = async () => {
        cache.clear();
        setLocalLoading(true);
        setIsFromCache(false);
        
        try {
            await getAllAgencyData();
            cache.set(AllAgencyData);
        } catch (error) {
            console.error('Error refreshing agency data:', error);
        } finally {
            setLocalLoading(false);
        }
    };

    // Highlight top agencies by numberOfCompanies
    const filteredAndSortedAgencies = useMemo(() => {
        let filtered = AllAgencyData.filter((agency) =>
            agency.agencyName.toLowerCase().includes(searchTerm.toLowerCase()) &&
            agency.agencyCode.toLowerCase().includes(searchTermByCode.toLowerCase()) &&
            (statusFilter === "All" || agency.status === statusFilter)
        );

        // Date range filter using react-day-picker
        if (range.from && range.to) {
            filtered = filtered.filter((agency) => {
                const createdDate = dayjs(agency.createdAt);
                return createdDate.isAfter(dayjs(range.from).subtract(1, 'day')) &&
                    createdDate.isBefore(dayjs(range.to).add(1, 'day'));
            });
        }

        filtered.sort((a, b) => {
            const nameA = a.agencyName.toLowerCase();
            const nameB = b.agencyName.toLowerCase();
            if (nameA < nameB) return sortOrder === "asc" ? -1 : 1;
            if (nameA > nameB) return sortOrder === "asc" ? 1 : -1;
            return 0;
        });

        return filtered;
    }, [AllAgencyData, searchTerm, searchTermByCode, sortOrder, statusFilter, range]);

    const topAgencyIds = useMemo(() => {
        if (!filteredAndSortedAgencies.length) return [];
        const sorted = [...filteredAndSortedAgencies].sort((a, b) => b.numberOfCompanies - a.numberOfCompanies);
        return sorted.slice(0, 3).map(u => u.id);
    }, [filteredAndSortedAgencies]);

    // Pagination
    const paginatedAgencies = useMemo(() => {
        const start = (page - 1) * PAGE_SIZE;
        return filteredAndSortedAgencies.slice(start, start + PAGE_SIZE);
    }, [filteredAndSortedAgencies, page]);

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
        // Here you should call your API to remove selected agencies
        // For demo, just clear selection
        setSelectedIds([]);
        setShowRemoveDialog(false);
        // Clear cache after removal
        cache.clear();
    };

    return (
        <>
            <Dialog open={showRemoveDialog} onClose={() => setShowRemoveDialog(false)}>
                <DialogTitle>Confirm Removal</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to remove the selected agency(ies)?
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
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <Typography variant="h7" className="max-w-[250px] " sx={{
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
                            Agency List
                        </Typography>
                        {isFromCache && (
                            <Chip
                                label="Cached Data"
                                color="info"
                                size="small"
                                icon={<RefreshIcon />}
                                sx={{ fontSize: '0.75rem' }}
                            />
                        )}
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <TextField
                            size="small"
                            label="Agency Name"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            sx={{ minWidth: 180 }}
                        />
                        <TextField
                            size="small"
                            label="Agency Code"
                            value={searchTermByCode}
                            onChange={(e) => setSearchTermByCode(e.target.value)}
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
                        <Tooltip title="Refresh Data">
                            <IconButton onClick={handleRefreshData} color="info">
                                <RefreshIcon />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Reset Filters">
                            <IconButton onClick={handleResetFilters} color="secondary">
                                <RefreshIcon />
                            </IconButton>
                        </Tooltip>


                        <CreateNewAgency />


                        <Tooltip className="max-w-[200px] "  title="Export Agency Data">
                            <span><ExportAgency /></span>
                        </Tooltip>
                    </Box>
                </Box>
                {initialLoading ? (
                    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 300 }}>
                        <CircularProgress color="primary" size={60} />
                        <Typography sx={{ mt: 2, fontWeight: "bold", color: "#1976d2" }}>Loading Agencies...</Typography>
                    </Box>
                ) : (
                    <>
                        <Table stickyHeader>
                            <TableHead>
                                <TableRow sx={{ backgroundColor: "#003366" }}>
                                    <TableCell align="center" sx={{ color: "#003366", background: "#e3f2fd", fontWeight: "bold", fontSize: 16 }}>
                                        <Checkbox
                                            checked={paginatedAgencies.length > 0 && paginatedAgencies.every(a => selectedIds.includes(a.id))}
                                            indeterminate={selectedIds.length > 0 && selectedIds.length < paginatedAgencies.length}
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    setSelectedIds(paginatedAgencies.map(a => a.id));
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
                                            Agency Name
                                        </TableSortLabel>
                                    </TableCell>
                                    <TableCell align="center" sx={{ color: "#003366", background: "#e3f2fd", fontWeight: "bold", fontSize: 16 }}>Contact No</TableCell>
                                    <TableCell align="center" sx={{ color: "#003366", background: "#e3f2fd", fontWeight: "bold", fontSize: 16 }}>Email</TableCell>
                                    <TableCell align="center" sx={{ color: "#003366", background: "#e3f2fd", fontWeight: "bold", fontSize: 16 }}>Date</TableCell>
                                    <TableCell align="center" sx={{ color: "#003366", background: "#e3f2fd", fontWeight: "bold", fontSize: 16 }}>Companies</TableCell>
                                    <TableCell align="center" sx={{ color: "#003366", background: "#e3f2fd", fontWeight: "bold", fontSize: 16 }}>Status</TableCell>
                                    <TableCell align="center" sx={{ color: "#003366", background: "#e3f2fd", fontWeight: "bold", fontSize: 16 }}>Agency Code</TableCell>
                                    <TableCell align="center" sx={{ color: "#003366", background: "#e3f2fd", fontWeight: "bold", fontSize: 16 }}>Logo</TableCell>
                                    <TableCell align="center" sx={{ color: "#003366", background: "#e3f2fd", fontWeight: "bold", fontSize: 16 }}>Details</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {paginatedAgencies.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={11} align="center">
                                            <Typography color="text.secondary">No agencies found.</Typography>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    paginatedAgencies.map((agency, index) => (
                                        <TableRow key={index} hover>
                                            <TableCell align="center">
                                                <Checkbox
                                                    checked={selectedIds.includes(agency.id)}
                                                    onChange={() => handleSelect(agency.id)}
                                                    color="primary"
                                                />
                                            </TableCell>
                                            <TableCell align="center">
                                                {(page - 1) * PAGE_SIZE + index + 1}
                                            </TableCell>
                                            <TableCell align="center">
                                                <Stack direction="row" alignItems="center" justifyContent="center" spacing={1}>
                                                    <Typography fontWeight="bold">{toUpperCase(agency.agencyName)}</Typography>
                                                    {topAgencyIds.includes(agency.id) && (
                                                        <Tooltip title="Top Agency by Companies">
                                                            <StarIcon sx={{ color: "#FFD700" }} />
                                                        </Tooltip>
                                                    )}
                                                </Stack>
                                            </TableCell>
                                            <TableCell align="center">
                                                <Chip
                                                    label={normalizePhoneNumber(agency.agencyContactNumber)}
                                                    color="primary"
                                                    variant="outlined"
                                                />
                                            </TableCell>
                                            <TableCell align="center">
                                                <Tooltip title={agency.agencyEmail}>
                                                    <Typography noWrap maxWidth={120}>{agency.agencyEmail}</Typography>
                                                </Tooltip>
                                            </TableCell>
                                            <TableCell align="center">
                                                <Chip
                                                    label={formatDate(agency.createdAt)}
                                                    color="secondary"
                                                    variant="outlined"
                                                    sx={{ fontWeight: "bold", fontSize: 15 }}
                                                />
                                            </TableCell>
                                            <TableCell align="center">
                                                <Chip
                                                    label={agency.numberOfCompanies}
                                                    color="info"
                                                    variant="filled"
                                                    icon={<BusinessIcon />}
                                                />
                                            </TableCell>
                                            <TableCell align="center">
                                                <Chip
                                                    label={agency.status || "Active"}
                                                    color={(agency.status || "Active") === "Active" ? "success" : "error"}
                                                    variant="filled"
                                                />
                                            </TableCell>
                                            <TableCell align="center">
                                                <Typography fontWeight="medium">{agency.agencyCode}</Typography>
                                            </TableCell>
                                            <TableCell align="center">
                                                <Avatar
                                                    src={agency.logoUrl || ""}
                                                    alt={agency.agencyName}
                                                    sx={{ width: 32, height: 32, bgcolor: "#e0e0e0", mx: "auto" }}
                                                >
                                                    <BusinessIcon />
                                                </Avatar>
                                            </TableCell>
                                            <TableCell align="center">
                                                <Tooltip title="View Details">
                                                    <IconButton onClick={() => handleViewDetails(agency)} color="primary">
                                                        <ArrowForwardIosIcon />
                                                    </IconButton>
                                                </Tooltip>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 2 }}>
                            <Typography variant="body2" color="text.secondary">
                                Showing {Math.min((page - 1) * PAGE_SIZE + 1, filteredAndSortedAgencies.length)} - {Math.min(page * PAGE_SIZE, filteredAndSortedAgencies.length)} of {filteredAndSortedAgencies.length} agencies
                                {isFromCache && " (from cache)"}
                            </Typography>
                            <Pagination
                                count={Math.ceil(filteredAndSortedAgencies.length / PAGE_SIZE)}
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

export default ViewAgency;
