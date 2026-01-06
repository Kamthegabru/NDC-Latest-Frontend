import React, { useContext, useMemo, useState, useEffect } from "react";
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
import AdminContext from "../../../Context/Agency/AgencyContext";
import CustomerContext from "../../../Context/Agency/Customer/CustomerContext";
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import dayjs from "dayjs";

const normalizePhoneNumber = require('../../Utils/normalizePhone');

const STATUS_OPTIONS = ["All", "Active", "Inactive", "Pending"];
const SORT_OPTIONS = ["Alphabetical (A-Z)", "Alphabetical (Z-A)", "Newest First", "Oldest First"];
const PAGE_SIZE = 10;

// Cache implementation for agency customer data
const agencyCustomerCache = {
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

function ViewCustomer() {
    const adminContext = useContext(AdminContext);
    const customerContext = useContext(CustomerContext);

    const [searchTerm, setSearchTerm] = useState("");
    const [searchTermByUSDOT, setSearchTermByUSDOT] = useState("");
    const [sortOption, setSortOption] = useState("Alphabetical (A-Z)");
    const [statusFilter, setStatusFilter] = useState("Active");
    const [loading, setLocalLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [range, setRange] = useState({ from: undefined, to: undefined });
    const [showCalendar, setShowCalendar] = useState(false);
    const [selectedIds, setSelectedIds] = useState([]);
    const [showRemoveDialog, setShowRemoveDialog] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [isFromCache, setIsFromCache] = useState(false);

    const { AllUserData, setCurrentActiveButton, getAllUserData } = adminContext || {};
    const { getSingleUserData, setLoading, setUserDetails } = customerContext || {};

    useEffect(() => {
        const loadData = async () => {
            // Check cache first
            const cachedData = agencyCustomerCache.get();
            if (cachedData) {
                setIsFromCache(true);
                setInitialLoading(false);
                return;
            }

            setLocalLoading(true);
            setIsFromCache(false);
            
            try {
                // Assuming you have a method to fetch all user data
                if (getAllUserData) {
                    await getAllUserData();
                    agencyCustomerCache.set(AllUserData);
                }
            } catch (error) {
                console.error('Error loading customer data:', error);
            } finally {
                setLocalLoading(false);
                setInitialLoading(false);
            }
        };

        if (adminContext && customerContext) {
            loadData();
        } else {
            setInitialLoading(false);
        }
        // eslint-disable-next-line
    }, [adminContext, customerContext]);

    // Debug: Check membership data
    useEffect(() => {
        if (AllUserData && AllUserData.length > 0) {
            console.log('Sample user data:', AllUserData[0]);
            console.log('Membership data:', AllUserData[0].Membership);
            console.log('Plan start date:', AllUserData[0].Membership?.planStartDate);
            console.log('Created at:', AllUserData[0].createdAt);
            
            // Check all users for membership data
            const usersWithMembership = AllUserData.filter(u => u.Membership?.planStartDate);
            console.log(`Users with membership date: ${usersWithMembership.length} out of ${AllUserData.length}`);
        }
    }, [AllUserData]);

    const handleViewDetails = (user) => {
        if (setUserDetails && setLoading && getSingleUserData && setCurrentActiveButton) {
            setUserDetails(null);
            setLoading(true);
            getSingleUserData(user.id || user._id);
            setCurrentActiveButton(5);
        }
    };

    const handleSortOptionChange = (event) => {
        setSortOption(event.target.value);
        setPage(1);
    };

    const handleStatusFilter = (event) => {
        setStatusFilter(event.target.value);
        setPage(1);
    };

    // Reset filters
    const handleResetFilters = () => {
        setSearchTerm("");
        setSearchTermByUSDOT("");
        setStatusFilter("Active");
        setSortOption("Alphabetical (A-Z)");
        setRange({ from: undefined, to: undefined });
        setPage(1);
        setSelectedIds([]);
    };

    // Refresh data and clear cache
    const handleRefreshData = async () => {
        agencyCustomerCache.clear();
        setLocalLoading(true);
        setIsFromCache(false);
        
        try {
            if (getAllUserData) {
                await getAllUserData();
                agencyCustomerCache.set(AllUserData);
            }
        } catch (error) {
            console.error('Error refreshing customer data:', error);
        } finally {
            setLocalLoading(false);
        }
    };

    // Enhanced filtering and sorting with alphabetical and date options
    const filteredAndSortedUsers = useMemo(() => {
        if (!AllUserData) return [];

        let filtered = AllUserData.filter((user) => {
            // Access company name from nested object structure
            const companyName = user.companyInfoData?.companyName || user.companyName || '';
            const usdotNumber = user.companyInfoData?.usdot || user.companyUSDOTNumber || '';
            
            return companyName.toLowerCase().includes(searchTerm.toLowerCase()) &&
                   usdotNumber.toLowerCase().includes(searchTermByUSDOT.toLowerCase()) &&
                   (statusFilter === "All" || user.status === statusFilter);
        });

        // Date range filter using react-day-picker
        if (range.from && range.to) {
            filtered = filtered.filter((user) => {
                const createdDate = dayjs(user.createdAt);
                return createdDate.isAfter(dayjs(range.from).subtract(1, 'day')) &&
                    createdDate.isBefore(dayjs(range.to).add(1, 'day'));
            });
        }

        // Enhanced sorting with multiple options
        filtered.sort((a, b) => {
            const nameA = (a.companyInfoData?.companyName || a.companyName || '').toLowerCase();
            const nameB = (b.companyInfoData?.companyName || b.companyName || '').toLowerCase();
            
            switch (sortOption) {
                case "Alphabetical (A-Z)":
                    if (nameA < nameB) return -1;
                    if (nameA > nameB) return 1;
                    return 0;
                
                case "Alphabetical (Z-A)":
                    if (nameA > nameB) return -1;
                    if (nameA < nameB) return 1;
                    return 0;
                
                case "Newest First":
                    const dateA = dayjs(a.createdAt || a.timestamp || a.createdDate);
                    const dateB = dayjs(b.createdAt || b.timestamp || b.createdDate);
                    return dateB.diff(dateA); // Newer dates first
                
                case "Oldest First":
                    const dateA2 = dayjs(a.createdAt || a.timestamp || a.createdDate);
                    const dateB2 = dayjs(b.createdAt || b.timestamp || b.createdDate);
                    return dateA2.diff(dateB2); // Older dates first
                
                default:
                    return 0;
            }
        });

        return filtered;
    }, [AllUserData, searchTerm, searchTermByUSDOT, sortOption, statusFilter, range]);

    const topCompanyIds = useMemo(() => {
        if (!filteredAndSortedUsers.length) return [];
        const sorted = [...filteredAndSortedUsers].sort((a, b) => 
            (parseInt(b.companyInfoData?.employees) || parseInt(b.companyInfoData?.driverCount) || 0) - 
            (parseInt(a.companyInfoData?.employees) || parseInt(a.companyInfoData?.driverCount) || 0)
        );
        return sorted.slice(0, 3).map(u => u.id || u._id);
    }, [filteredAndSortedUsers]);

    const paginatedUsers = useMemo(() => {
        const start = (page - 1) * PAGE_SIZE;
        return filteredAndSortedUsers.slice(start, start + PAGE_SIZE);
    }, [filteredAndSortedUsers, page]);

    const formatDate = (dateStr) => {
        if (!dateStr) return "-";
        try {
            const date = dayjs(dateStr);
            if (!date.isValid()) return "-";
            return date.format("MMM DD, YYYY");
        } catch (error) {
            console.error('Date formatting error:', error, 'Input:', dateStr);
            return "-";
        }
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
        // Clear cache after removal
        agencyCustomerCache.clear();
    };

    // Context validation
    if (!adminContext || !customerContext) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 300 }}>
                <Typography color="error" variant="h6">Context not available.</Typography>
            </Box>
        );
    }

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
                        flexWrap: "wrap",
                        gap: 2
                    }}
                >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <Typography variant="h6" className="max-w-[250px] max-h-[50px] " sx={{
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
                    
                    {/* Filters Row */}
                    <Box sx={{ 
                        display: "flex", 
                        alignItems: "center", 
                        gap: 2, 
                        flexWrap: "wrap",
                        width: "100%",
                        justifyContent: "flex-end"
                    }}>
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
                        
                        {/* New Sort Options */}
                        <FormControl size="small" sx={{ minWidth: 180 }}>
                            <InputLabel>Sort By</InputLabel>
                            <Select
                                value={sortOption}
                                label="Sort By"
                                onChange={handleSortOptionChange}
                            >
                                {SORT_OPTIONS.map((option) => (
                                    <MenuItem key={option} value={option}>{option}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <Typography variant="body2" sx={{ fontWeight: "bold", color: "#003366" }}>
                                Date Range:
                            </Typography>
                            <Box sx={{ position: "relative" }}>
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
                                        p: 2,
                                        right: 0
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
                        
                        {/* Remove Selected Button */}
                        {selectedIds.length > 0 && (
                            <Tooltip title={`Remove ${selectedIds.length} selected`}>
                                <IconButton onClick={handleRemoveSelected} color="error">
                                    <DeleteIcon />
                                </IconButton>
                            </Tooltip>
                        )}
                    </Box>
                </Box>

                {initialLoading ? (
                    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 300 }}>
                        <CircularProgress color="primary" size={60} />
                        <Typography sx={{ mt: 2, fontWeight: "bold", color: "#1976d2" }}>Loading Customers...</Typography>
                    </Box>
                ) : !AllUserData || AllUserData.length === 0 ? (
                    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 200 }}>
                        <BusinessIcon sx={{ fontSize: 60, color: "#bbb", mb: 2 }} />
                        <Typography variant="h6" align="center" color="text.secondary">
                            No customers found.
                        </Typography>
                    </Box>
                ) : (
                    <>
                        {/* Selected count indicator */}
                        {selectedIds.length > 0 && (
                            <Box sx={{ mb: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <Chip
                                    label={`${selectedIds.length} customer${selectedIds.length > 1 ? 's' : ''} selected`}
                                    color="primary"
                                    variant="outlined"
                                />
                                <Typography variant="body2" color="text.secondary">
                                    Current sort: {sortOption}
                                </Typography>
                            </Box>
                        )}
                        
                        <Table stickyHeader>
                            <TableHead>
                                <TableRow sx={{ backgroundColor: "#003366" }}>
                                    <TableCell align="center" sx={{ color: "#003366", background: "#e3f2fd", fontWeight: "bold", fontSize: 16 }}>
                                        <Checkbox
                                            checked={paginatedUsers.length > 0 && paginatedUsers.every(u => selectedIds.includes(u.id || u._id))}
                                            indeterminate={selectedIds.length > 0 && selectedIds.length < paginatedUsers.length}
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    setSelectedIds(paginatedUsers.map(u => u.id || u._id));
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
                                        Company Name
                                        {(sortOption.includes("Alphabetical") || sortOption.includes("Newest") || sortOption.includes("Oldest")) && (
                                            <Box component="span" sx={{ ml: 1, fontSize: 12, opacity: 0.7 }}>
                                                ({sortOption})
                                            </Box>
                                        )}
                                    </TableCell>
                                    <TableCell align="center" sx={{ color: "#003366", background: "#e3f2fd", fontWeight: "bold", fontSize: 16 }}>Contact No</TableCell>
                                    <TableCell align="center" sx={{ color: "#003366", background: "#e3f2fd", fontWeight: "bold", fontSize: 16 }}>Email</TableCell>
                                    <TableCell align="center" sx={{ color: "#003366", background: "#e3f2fd", fontWeight: "bold", fontSize: 16 }}>
                                        Joining Date
                                        {(sortOption === "Newest First" || sortOption === "Oldest First") && (
                                            <Box component="span" sx={{ ml: 1, fontSize: 12, opacity: 0.7 }}>
                                                ({sortOption})
                                            </Box>
                                        )}
                                    </TableCell>
                                    <TableCell align="center" sx={{ color: "#003366", background: "#e3f2fd", fontWeight: "bold", fontSize: 16 }}>Active Employees</TableCell>
                                    <TableCell align="center" sx={{ color: "#003366", background: "#e3f2fd", fontWeight: "bold", fontSize: 16 }}>Status</TableCell>
                                    <TableCell align="center" sx={{ color: "#003366", background: "#e3f2fd", fontWeight: "bold", fontSize: 16 }}>USDOT</TableCell>
                                    <TableCell align="center" sx={{ color: "#003366", background: "#e3f2fd", fontWeight: "bold", fontSize: 16 }}>Details</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {paginatedUsers.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={10} align="center">
                                            <Typography color="text.secondary">No customers found matching your criteria.</Typography>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    paginatedUsers.map((user, index) => (
                                        <TableRow 
                                            key={user._id || user.id || index} 
                                            hover
                                            onClick={() => handleViewDetails(user)}
                                            sx={{ cursor: 'pointer' }}
                                        >
                                            <TableCell align="center" onClick={(e) => e.stopPropagation()}>
                                                <Checkbox
                                                    checked={selectedIds.includes(user.id || user._id)}
                                                    onChange={() => handleSelect(user.id || user._id)}
                                                    color="primary"
                                                />
                                            </TableCell>
                                            <TableCell align="center">
                                                {(page - 1) * PAGE_SIZE + index + 1}
                                            </TableCell>
                                            <TableCell align="center">
                                                <Stack direction="row" alignItems="center" justifyContent="center" spacing={1}>
                                                    <Typography fontWeight="bold">
                                                        {user.companyInfoData?.companyName || user.companyName || 'N/A'}
                                                    </Typography>
                                                    {topCompanyIds.includes(user.id || user._id) && (
                                                        <Tooltip title="Top Company">
                                                            <StarIcon sx={{ color: "#FFD700" }} />
                                                        </Tooltip>
                                                    )}
                                                </Stack>
                                            </TableCell>
                                            <TableCell align="center">
                                                <Chip
                                                    label={normalizePhoneNumber(
                                                        user.companyInfoData?.contactNumber || 
                                                        user.contactInfoData?.phone || 
                                                        user.companyContactNumber
                                                    ) || 'N/A'}
                                                    color="primary"
                                                    variant="outlined"
                                                />
                                            </TableCell>
                                            <TableCell align="center">
                                                <Tooltip title={
                                                    user.companyInfoData?.companyEmail || 
                                                    user.contactInfoData?.email || 
                                                    user.companyEmail || 
                                                    'No email'
                                                }>
                                                    <Typography noWrap maxWidth={120}>
                                                        {user.companyInfoData?.companyEmail || 
                                                         user.contactInfoData?.email || 
                                                         user.companyEmail || 'N/A'}
                                                    </Typography>
                                                </Tooltip>
                                            </TableCell>
                                            <TableCell align="center">
                                                <Chip
                                                    label={formatDate(user.Membership?.planStartDate || user.createdAt)}
                                                    color="secondary"
                                                    variant="outlined"
                                                    sx={{ fontWeight: "bold", fontSize: 12 }}
                                                />
                                            </TableCell>
                                            <TableCell align="center">
                                                <Chip
                                                    label={
                                                        user.companyInfoData?.employees || 
                                                        user.companyInfoData?.driverCount || 
                                                        user.activeDriversCount || 0
                                                    }
                                                    color="info"
                                                    variant="filled"
                                                />
                                            </TableCell>
                                            <TableCell align="center">
                                                <Chip
                                                    label={
                                                        user.Membership?.planStatus || 
                                                        user.status || 
                                                        "Pending"
                                                    }
                                                    color={
                                                        (user.Membership?.planStatus || user.status || "Pending") === "Active" 
                                                            ? "success" 
                                                            : (user.Membership?.planStatus || user.status) === "Inactive" 
                                                                ? "error" 
                                                                : "warning"
                                                    }
                                                    variant="filled"
                                                />
                                            </TableCell>
                                            <TableCell align="center">
                                                <Typography fontWeight="medium">
                                                    {user.companyInfoData?.usdot || user.companyUSDOTNumber || 'N/A'}
                                                </Typography>
                                            </TableCell>
                                            <TableCell align="center" onClick={(e) => e.stopPropagation()}>
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
                        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 2 }}>
                            <Typography variant="body2" color="text.secondary">
                                Showing {Math.min((page - 1) * PAGE_SIZE + 1, filteredAndSortedUsers.length)} - {Math.min(page * PAGE_SIZE, filteredAndSortedUsers.length)} of {filteredAndSortedUsers.length} customers
                                {isFromCache && " (from cache)"}
                                {selectedIds.length > 0 && ` | ${selectedIds.length} selected`}
                            </Typography>
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
