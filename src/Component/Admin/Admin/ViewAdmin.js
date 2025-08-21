import React, { useState, useContext, useMemo, useEffect } from "react";
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
    DialogActions,
    Menu
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import StarIcon from "@mui/icons-material/Star";
import RefreshIcon from "@mui/icons-material/Refresh";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import AdminContext from "../../../Context/Admin/Admin/AdminContext";
import EditAdminModal from "./EditAdminModal";
import DeleteAdminModal from "./DeleteAdminModal";
import CreateNewAdmin from "./CreateNewAdmin";
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import dayjs from "dayjs";

const normalizePhoneNumber = require("../../Utils/normalizePhone");

const ROLE_OPTIONS = ["All", "Super Admin", "Admin", "Manager"];
const STATUS_OPTIONS = ["All", "Active", "Inactive"];
const PAGE_SIZE = 10;

// Cache implementation
const adminCache = {
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

function ViewAdmin() {
    const { AllAdminData, getAllAdminData } = useContext(AdminContext);

    const [searchTerm, setSearchTerm] = useState("");
    const [searchTermByEmail, setSearchTermByEmail] = useState("");
    const [sortOrder, setSortOrder] = useState("asc");
    const [roleFilter, setRoleFilter] = useState("All");
    const [statusFilter, setStatusFilter] = useState("All");
    const [loading, setLocalLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [range, setRange] = useState({ from: undefined, to: undefined });
    const [showCalendar, setShowCalendar] = useState(false);
    const [selectedIds, setSelectedIds] = useState([]);
    const [showRemoveDialog, setShowRemoveDialog] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [isFromCache, setIsFromCache] = useState(false);

    // Menu state
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedAdmin, setSelectedAdmin] = useState(null);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            // Check cache first
            const cachedData = adminCache.get();
            if (cachedData) {
                setIsFromCache(true);
                setInitialLoading(false);
                return;
            }

            setLocalLoading(true);
            setIsFromCache(false);
            
            try {
                await getAllAdminData();
                adminCache.set(AllAdminData);
            } catch (error) {
                console.error('Error loading admin data:', error);
            } finally {
                setLocalLoading(false);
                setInitialLoading(false);
            }
        };

        loadData();
        // eslint-disable-next-line
    }, []);

    const handleSort = () => {
        setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    };

    const handleRoleFilter = (event) => {
        setRoleFilter(event.target.value);
        setPage(1);
    };

    const handleStatusFilter = (event) => {
        setStatusFilter(event.target.value);
        setPage(1);
    };

    // Reset filters
    const handleResetFilters = () => {
        setSearchTerm("");
        setSearchTermByEmail("");
        setRoleFilter("All");
        setStatusFilter("All");
        setRange({ from: undefined, to: undefined });
        setPage(1);
        setSelectedIds([]);
    };

    // Refresh data and clear cache
    const handleRefreshData = async () => {
        adminCache.clear();
        setLocalLoading(true);
        setIsFromCache(false);
        
        try {
            await getAllAdminData();
            adminCache.set(AllAdminData);
        } catch (error) {
            console.error('Error refreshing admin data:', error);
        } finally {
            setLocalLoading(false);
        }
    };

    // Menu handlers
    const handleMenuClick = (event, admin) => {
        setAnchorEl(event.currentTarget);
        setSelectedAdmin(admin);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleEdit = () => {
        setEditModalOpen(true);
        handleMenuClose();
    };

    const handleDelete = () => {
        setDeleteModalOpen(true);
        handleMenuClose();
    };

    // Filter and sort admins
    const filteredAndSortedAdmins = useMemo(() => {
        let filtered = AllAdminData?.filter((admin) =>
            `${admin.firstName} ${admin.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) &&
            admin.email.toLowerCase().includes(searchTermByEmail.toLowerCase()) &&
            (roleFilter === "All" || admin.role === roleFilter) &&
            (statusFilter === "All" || admin.status === statusFilter)
        ) || [];

        // Date range filter
        if (range.from && range.to) {
            filtered = filtered.filter((admin) => {
                const createdDate = dayjs(admin.createdAt);
                return createdDate.isAfter(dayjs(range.from).subtract(1, 'day')) &&
                    createdDate.isBefore(dayjs(range.to).add(1, 'day'));
            });
        }

        filtered.sort((a, b) => {
            const nameA = `${a.firstName} ${a.lastName}`.toLowerCase();
            const nameB = `${b.firstName} ${b.lastName}`.toLowerCase();
            if (nameA < nameB) return sortOrder === "asc" ? -1 : 1;
            if (nameA > nameB) return sortOrder === "asc" ? 1 : -1;
            return 0;
        });

        return filtered;
    }, [AllAdminData, searchTerm, searchTermByEmail, sortOrder, roleFilter, statusFilter, range]);

    // Highlight super admins
    const superAdminIds = useMemo(() => {
        return filteredAndSortedAdmins
            .filter(admin => admin.role === "Super Admin")
            .map(admin => admin.id);
    }, [filteredAndSortedAdmins]);

    // Pagination
    const paginatedAdmins = useMemo(() => {
        const start = (page - 1) * PAGE_SIZE;
        return filteredAndSortedAdmins.slice(start, start + PAGE_SIZE);
    }, [filteredAndSortedAdmins, page]);

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
        setSelectedIds([]);
        setShowRemoveDialog(false);
        adminCache.clear();
    };

    // Get role color
    const getRoleColor = (role) => {
        switch (role) {
            case "Super Admin": return "error";
            case "Admin": return "warning";
            case "Manager": return "info";
            default: return "default";
        }
    };

    // Get role icon
    const getRoleIcon = (role) => {
        switch (role) {
            case "Super Admin": return <AdminPanelSettingsIcon />;
            case "Admin": return <SupervisorAccountIcon />;
            default: return null;
        }
    };

    return (
        <Box>
            <Dialog open={showRemoveDialog} onClose={() => setShowRemoveDialog(false)}>
                <DialogTitle>Confirm Removal</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to remove the selected admin(s)?
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
                            Admin List
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
                            label="Admin Name"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            sx={{ minWidth: 180 }}
                        />
                        <TextField
                            size="small"
                            label="Email"
                            value={searchTermByEmail}
                            onChange={(e) => setSearchTermByEmail(e.target.value)}
                            sx={{ minWidth: 180 }}
                        />
                        <FormControl size="small" sx={{ minWidth: 120 }}>
                            <InputLabel>Role</InputLabel>
                            <Select
                                value={roleFilter}
                                label="Role"
                                onChange={handleRoleFilter}
                            >
                                {ROLE_OPTIONS.map((role) => (
                                    <MenuItem key={role} value={role}>{role}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
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
                        <CreateNewAdmin />
                    </Box>
                </Box>

                {initialLoading ? (
                    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 300 }}>
                        <CircularProgress color="primary" size={60} />
                        <Typography sx={{ mt: 2, fontWeight: "bold", color: "#1976d2" }}>Loading Admins...</Typography>
                    </Box>
                ) : (
                    <>
                        <Table stickyHeader>
                            <TableHead>
                                <TableRow sx={{ backgroundColor: "#003366" }}>
                                    <TableCell align="center" sx={{ color: "#003366", background: "#e3f2fd", fontWeight: "bold", fontSize: 16 }}>
                                        <Checkbox
                                            checked={paginatedAdmins.length > 0 && paginatedAdmins.every(a => selectedIds.includes(a.id))}
                                            indeterminate={selectedIds.length > 0 && selectedIds.length < paginatedAdmins.length}
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    setSelectedIds(paginatedAdmins.map(a => a.id));
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
                                            Name
                                        </TableSortLabel>
                                    </TableCell>
                                    <TableCell align="center" sx={{ color: "#003366", background: "#e3f2fd", fontWeight: "bold", fontSize: 16 }}>Email</TableCell>
                                    <TableCell align="center" sx={{ color: "#003366", background: "#e3f2fd", fontWeight: "bold", fontSize: 16 }}>Contact No</TableCell>
                                    <TableCell align="center" sx={{ color: "#003366", background: "#e3f2fd", fontWeight: "bold", fontSize: 16 }}>Role</TableCell>
                                    <TableCell align="center" sx={{ color: "#003366", background: "#e3f2fd", fontWeight: "bold", fontSize: 16 }}>Status</TableCell>
                                    <TableCell align="center" sx={{ color: "#003366", background: "#e3f2fd", fontWeight: "bold", fontSize: 16 }}>Date</TableCell>
                                    <TableCell align="center" sx={{ color: "#003366", background: "#e3f2fd", fontWeight: "bold", fontSize: 16 }}>Avatar</TableCell>
                                    <TableCell align="center" sx={{ color: "#003366", background: "#e3f2fd", fontWeight: "bold", fontSize: 16 }}>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {paginatedAdmins.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={10} align="center">
                                            <Typography color="text.secondary">No admins found.</Typography>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    paginatedAdmins.map((admin, index) => (
                                        <TableRow key={index} hover>
                                            <TableCell align="center">
                                                <Checkbox
                                                    checked={selectedIds.includes(admin.id)}
                                                    onChange={() => handleSelect(admin.id)}
                                                    color="primary"
                                                />
                                            </TableCell>
                                            <TableCell align="center">
                                                {(page - 1) * PAGE_SIZE + index + 1}
                                            </TableCell>
                                            <TableCell align="center">
                                                <Stack direction="row" alignItems="center" justifyContent="center" spacing={1}>
                                                    <Typography fontWeight="bold">
                                                        {admin.firstName} {admin.lastName}
                                                    </Typography>
                                                    {superAdminIds.includes(admin.id) && (
                                                        <Tooltip title="Super Admin">
                                                            <StarIcon sx={{ color: "#FFD700" }} />
                                                        </Tooltip>
                                                    )}
                                                </Stack>
                                            </TableCell>
                                            <TableCell align="center">
                                                <Tooltip title={admin.email}>
                                                    <Typography noWrap maxWidth={150}>{admin.email}</Typography>
                                                </Tooltip>
                                            </TableCell>
                                            <TableCell align="center">
                                                <Chip
                                                    label={normalizePhoneNumber(admin.contactNumber)}
                                                    color="primary"
                                                    variant="outlined"
                                                />
                                            </TableCell>
                                            <TableCell align="center">
                                                <Chip
                                                    label={admin.role || "Admin"}
                                                    color={getRoleColor(admin.role)}
                                                    variant="filled"
                                                    icon={getRoleIcon(admin.role)}
                                                />
                                            </TableCell>
                                            <TableCell align="center">
                                                <Chip
                                                    label={admin.status || "Active"}
                                                    color={(admin.status || "Active") === "Active" ? "success" : "error"}
                                                    variant="filled"
                                                />
                                            </TableCell>
                                            <TableCell align="center">
                                                <Chip
                                                    label={formatDate(admin.createdAt)}
                                                    color="secondary"
                                                    variant="outlined"
                                                    sx={{ fontWeight: "bold", fontSize: 15 }}
                                                />
                                            </TableCell>
                                            <TableCell align="center">
                                                <Avatar
                                                    src={admin.avatarUrl || ""}
                                                    alt={`${admin.firstName} ${admin.lastName}`}
                                                    sx={{ width: 32, height: 32, bgcolor: "#e0e0e0", mx: "auto" }}
                                                >
                                                    {admin.firstName?.charAt(0)}{admin.lastName?.charAt(0)}
                                                </Avatar>
                                            </TableCell>
                                            <TableCell align="center">
                                                <Tooltip title="More Actions">
                                                    <IconButton onClick={(e) => handleMenuClick(e, admin)} color="primary">
                                                        <MoreVertIcon />
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
                                Showing {Math.min((page - 1) * PAGE_SIZE + 1, filteredAndSortedAdmins.length)} - {Math.min(page * PAGE_SIZE, filteredAndSortedAdmins.length)} of {filteredAndSortedAdmins.length} admins
                                {isFromCache && " (from cache)"}
                            </Typography>
                            <Pagination
                                count={Math.ceil(filteredAndSortedAdmins.length / PAGE_SIZE)}
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

            {/* Action Menu */}
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                <MenuItem onClick={handleEdit}>
                    <EditIcon sx={{ mr: 1 }} />
                    Edit
                </MenuItem>
                <MenuItem onClick={handleDelete} sx={{ color: "error.main" }}>
                    <DeleteIcon sx={{ mr: 1 }} />
                    Delete
                </MenuItem>
            </Menu>

            {/* Modals */}
            {selectedAdmin && (
                <>
                    <EditAdminModal
                        open={editModalOpen}
                        onClose={() => setEditModalOpen(false)}
                        admin={selectedAdmin}
                    />
                    <DeleteAdminModal
                        open={deleteModalOpen}
                        onClose={() => setDeleteModalOpen(false)}
                        admin={selectedAdmin}
                    />
                </>
            )}
        </Box>
    );
}

export default ViewAdmin;