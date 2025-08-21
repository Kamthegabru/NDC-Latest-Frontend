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
  DialogActions,
  Modal,
  Grid,
  Divider,
  useMediaQuery,
  Card,
  CardContent
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import RefreshIcon from "@mui/icons-material/Refresh";
import { useTheme } from "@mui/material/styles";
import HomeContext from "../../../Context/ClientSide/AfterLogin/Home/HomeContext";
import dayjs from "dayjs";

const normalizePhoneNumber = require("../../Utils/normalizePhone");

const usStates = [
  { label: "Alabama" }, { label: "Alaska" }, { label: "Arizona" },
  { label: "Arkansas" }, { label: "California" }, { label: "Colorado" },
  { label: "Connecticut" }, { label: "Delaware" }, { label: "Florida" },
  { label: "Georgia" }, { label: "Hawaii" }, { label: "Idaho" },
  { label: "Illinois" }, { label: "Indiana" }, { label: "Iowa" },
  { label: "Kansas" }, { label: "Kentucky" }, { label: "Louisiana" },
  { label: "Maine" }, { label: "Maryland" }, { label: "Massachusetts" },
  { label: "Michigan" }, { label: "Minnesota" }, { label: "Mississippi" },
  { label: "Missouri" }, { label: "Montana" }, { label: "Nebraska" },
  { label: "Nevada" }, { label: "New Hampshire" }, { label: "New Jersey" },
  { label: "New Mexico" }, { label: "New York" }, { label: "North Carolina" },
  { label: "North Dakota" }, { label: "Ohio" }, { label: "Oklahoma" },
  { label: "Oregon" }, { label: "Pennsylvania" }, { label: "Rhode Island" },
  { label: "South Carolina" }, { label: "South Dakota" }, { label: "Tennessee" },
  { label: "Texas" }, { label: "Utah" }, { label: "Vermont" },
  { label: "Virginia" }, { label: "Washington" }, { label: "West Virginia" },
  { label: "Wisconsin" }, { label: "Wyoming" }
];

const labelMap = {
  companyName: "Company Name",
  contactNumber: "Contact Number",
  usdot: "USDOT",
  zip: "ZIP",
  suite: "Suite",
  employees: "Employees",
  address: "Address",
  city: "City",
  state: "State",
  country: "Country",
  contactPerson: "Contact Person",
  email: "Email",
  website: "Website"
};

const formatLabel = (key) =>
  labelMap[key] || key.replace(/([A-Z])/g, " $1").replace(/_/g, " ").trim().replace(/\b\w/g, c => c.toUpperCase());

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const digitOnlyFields = ["contactNumber", "zip", "usdot", "employees", "suite"];

const CompanyDetails = () => {
  const { userData, updateCompanyInformation } = useContext(HomeContext);
  const [open, setOpen] = useState(false);
  const [companyInfoData, setCompanyInfoData] = useState(userData.companyInfoData);
  const [tempCompanyInfoData, setTempCompanyInfoData] = useState({ ...companyInfoData });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setCompanyInfoData(userData.companyInfoData);
  }, [userData]);

  const handleOpen = () => {
    setTempCompanyInfoData({ ...companyInfoData });
    setErrors({});
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let newErrors = { ...errors };

    if (digitOnlyFields.includes(name)) {
      if (!/^\d*$/.test(value)) return;
    }

    if (name === "contactNumber") {
      if (value.length !== 10) {
        newErrors.contactNumber = "Contact number must be 10 digits";
      } else {
        delete newErrors.contactNumber;
      }
    }

    if (name === "email") {
      if (value && !emailRegex.test(value)) {
        newErrors.email = "Invalid email format";
      } else {
        delete newErrors.email;
      }
    }

    setTempCompanyInfoData({ ...tempCompanyInfoData, [name]: value });
    setErrors(newErrors);
  };

  const handleUpdate = async () => {
    if (Object.keys(errors).length === 0) {
      setLoading(true);
      try {
        await updateCompanyInformation(tempCompanyInfoData);
        setOpen(false);
      } finally {
        setLoading(false);
      }
    }
  };

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <>
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
            Company Information
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Tooltip title="Edit Company Details">
              <IconButton onClick={handleOpen} color="primary" size="large">
                <EditIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {loading ? (
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 300 }}>
            <CircularProgress color="primary" size={60} />
            <Typography sx={{ mt: 2, fontWeight: "bold", color: "#1976d2" }}>Loading Company Data...</Typography>
          </Box>
        ) : (
          <Table stickyHeader>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#003366" }}>
                <TableCell align="center" sx={{ color: "#003366", background: "#e3f2fd", fontWeight: "bold", fontSize: 16 }}>
                  Field
                </TableCell>
                <TableCell align="center" sx={{ color: "#003366", background: "#e3f2fd", fontWeight: "bold", fontSize: 16 }}>
                  Value
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Object.entries(companyInfoData)?.map(([key, value]) => {
                let displayValue = value;

                if (key === "contactNumber") {
                  displayValue = normalizePhoneNumber(value);
                } else if (key.toLowerCase() === "usdot") {
                  displayValue = String(value).toUpperCase();
                } else {
                  displayValue = toTitleCase(value);
                }

                return (
                  <TableRow key={key} hover>
                    <TableCell align="center">
                      <Typography fontWeight="bold" sx={{ color: "#003366" }}>
                        {formatLabel(key)}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      {key === "contactNumber" ? (
                        <Chip
                          label={displayValue}
                          color="primary"
                          variant="outlined"
                        />
                      ) : key === "email" ? (
                        <Tooltip title={displayValue}>
                          <Typography noWrap maxWidth={200} sx={{ color: "#003366", fontWeight: 600 }}>
                            {displayValue}
                          </Typography>
                        </Tooltip>
                      ) : key === "employees" ? (
                        <Chip
                          label={displayValue}
                          color="info"
                          variant="filled"
                        />
                      ) : key === "usdot" ? (
                        <Typography fontWeight="medium" sx={{ color: "#003366" }}>
                          {displayValue}
                        </Typography>
                      ) : (
                        <Typography sx={{ color: "#003366", fontWeight: 600 }}>
                          {displayValue}
                        </Typography>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </TableContainer>

      {/* Edit Modal with Latest Design */}
      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            width: isMobile ? "90%" : 600,
            bgcolor: "background.paper",
            p: 4,
            m: "auto",
            mt: 5,
            borderRadius: 3,
            boxShadow: 6,
            background: "linear-gradient(135deg, #e3f2fd 0%, #f5f5f5 100%)"
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography variant="h6" sx={{
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
              Edit Company Details
            </Typography>
          </Box>
          
          <Divider sx={{ mb: 3 }} />
          
          <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 3 }}>
            <Grid container spacing={2}>
              {Object.entries(tempCompanyInfoData)?.map(([key, value]) => (
                <Grid item xs={12} sm={6} key={key}>
                  {key === "state" ? (
                    <TextField
                      select
                      fullWidth
                      size="small"
                      label={formatLabel(key)}
                      name={key}
                      value={value}
                      onChange={handleChange}
                      sx={{
                        backgroundColor: "#fff",
                        borderRadius: 2,
                      }}
                    >
                      {usStates.map((state) => (
                        <MenuItem 
                          key={state.label} 
                          value={state.label}
                          sx={{
                            fontWeight: value === state.label ? 600 : 400,
                            color: value === state.label ? "#003366" : "#222",
                            fontSize: 15,
                          }}
                        >
                          {state.label}
                        </MenuItem>
                      ))}
                    </TextField>
                  ) : (
                    <TextField
                      fullWidth
                      size="small"
                      label={formatLabel(key)}
                      name={key}
                      value={value}
                      onChange={handleChange}
                      variant="outlined"
                      type={
                        key === "email" ? "email" :
                          digitOnlyFields.includes(key) ? "tel" : "text"
                      }
                      inputProps={
                        digitOnlyFields.includes(key)
                          ? { inputMode: "numeric", pattern: "[0-9]*" }
                          : {}
                      }
                      error={Boolean(errors[key])}
                      helperText={errors[key] || ""}
                      sx={{
                        backgroundColor: "#fff",
                        borderRadius: 2,
                      }}
                    />
                  )}
                </Grid>
              ))}
            </Grid>
          </Paper>
          
          <Box sx={{ mt: 4, display: "flex", justifyContent: "flex-end", gap: 2 }}>
            <Button 
              onClick={handleClose} 
              variant="outlined"
              sx={{ 
                borderRadius: 2,
                px: 3,
                fontWeight: "bold"
              }}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleUpdate} 
              variant="contained" 
              disabled={Object.keys(errors).length > 0 || loading}
              sx={{ 
                borderRadius: 2,
                px: 3,
                fontWeight: "bold",
                background: "linear-gradient(90deg, #003366 60%, #1976d2 100%)"
              }}
            >
              {loading ? <CircularProgress size={20} color="inherit" /> : "Update"}
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

function toTitleCase(str) {
  if (!str || typeof str !== "string") return str;
  return str
    .toLowerCase()
    .split(" ")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export default CompanyDetails;