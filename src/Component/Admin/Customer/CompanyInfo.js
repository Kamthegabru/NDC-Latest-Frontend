import React, { useContext, useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  IconButton,
  Modal,
  TextField,
  Button,
  Grid,
  Divider,
  useMediaQuery,
  CircularProgress,
  MenuItem,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { useTheme } from "@mui/material/styles";
import CustomerContext from "../../../Context/Admin/Customer/CustomerContext";

const normalizePhoneNumber = require("../../Utils/normalizePhone");

// 🔤 Converts string to Title Case
const toTitleCase = (str) => {
  if (typeof str !== "string") return str;
  return str
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

// 🏷️ Converts camelCase to Title Case
const formatKeyLabel = (key) => {
  if (key.toLowerCase() === "usdot") return "USDOT";
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase())
    .trim();
};

// 🇺🇸 US States List
const states = [
  { label: "Alabama", value: "AL" },
  { label: "Alaska", value: "AK" },
  { label: "Arizona", value: "AZ" },
  { label: "Arkansas", value: "AR" },
  { label: "California", value: "CA" },
  { label: "Colorado", value: "CO" },
  { label: "Connecticut", value: "CT" },
  { label: "Delaware", value: "DE" },
  { label: "Florida", value: "FL" },
  { label: "Georgia", value: "GA" },
  { label: "Hawaii", value: "HI" },
  { label: "Idaho", value: "ID" },
  { label: "Illinois", value: "IL" },
  { label: "Indiana", value: "IN" },
  { label: "Iowa", value: "IA" },
  { label: "Kansas", value: "KS" },
  { label: "Kentucky", value: "KY" },
  { label: "Louisiana", value: "LA" },
  { label: "Maine", value: "ME" },
  { label: "Maryland", value: "MD" },
  { label: "Massachusetts", value: "MA" },
  { label: "Michigan", value: "MI" },
  { label: "Minnesota", value: "MN" },
  { label: "Mississippi", value: "MS" },
  { label: "Missouri", value: "MO" },
  { label: "Montana", value: "MT" },
  { label: "Nebraska", value: "NE" },
  { label: "Nevada", value: "NV" },
  { label: "New Hampshire", value: "NH" },
  { label: "New Jersey", value: "NJ" },
  { label: "New Mexico", value: "NM" },
  { label: "New York", value: "NY" },
  { label: "North Carolina", value: "NC" },
  { label: "North Dakota", value: "ND" },
  { label: "Ohio", value: "OH" },
  { label: "Oklahoma", value: "OK" },
  { label: "Oregon", value: "OR" },
  { label: "Pennsylvania", value: "PA" },
  { label: "Rhode Island", value: "RI" },
  { label: "South Carolina", value: "SC" },
  { label: "South Dakota", value: "SD" },
  { label: "Tennessee", value: "TN" },
  { label: "Texas", value: "TX" },
  { label: "Utah", value: "UT" },
  { label: "Vermont", value: "VT" },
  { label: "Virginia", value: "VA" },
  { label: "Washington", value: "WA" },
  { label: "West Virginia", value: "WV" },
  { label: "Wisconsin", value: "WI" },
  { label: "Wyoming", value: "WY" },
];

const CompanyDetails = () => {
  const { userDetails, updateCompanyInformation } = useContext(CustomerContext);
  const [open, setOpen] = useState(false);
  const [companyInfoData, setCompanyInfoData] = useState({});
  const [tempCompanyInfoData, setTempCompanyInfoData] = useState({});
  const [loading, setLoading] = useState(true);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    if (userDetails) {
      setCompanyInfoData(userDetails.companyInfoData);
      setTempCompanyInfoData(userDetails.companyInfoData);
      setLoading(false);
    }
  }, [userDetails]);

  if (loading) return <CircularProgress />;

  const handleOpen = () => {
    setTempCompanyInfoData({ ...companyInfoData });
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleChange = (e) => {
    setTempCompanyInfoData({
      ...tempCompanyInfoData,
      [e.target.name]: e.target.value,
    });
  };
  const handleUpdate = () => {
    updateCompanyInformation(tempCompanyInfoData);
    setOpen(false);
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginTop: "40px",
        px: 2,
      }}
    >
      <Card
        sx={{
          width: isMobile ? "100%" : 550,
          p: 3,
          position: "relative",
          borderRadius: 3,
          boxShadow: 3,
        }}
      >
        <IconButton
          onClick={handleOpen}
          sx={{
            position: "absolute",
            top: 15,
            right: 15,
            color: "primary.main",
          }}
        >
          <EditIcon />
        </IconButton>

        <CardContent>
          <Typography
            variant="h5"
            sx={{ mb: 3, fontWeight: "bold", color: "primary.main" }}
          >
            Company Information
          </Typography>

          <Grid container spacing={2}>
            {Object.entries(companyInfoData).map(([key, value]) => {
              let displayValue = value;

              if (key === "contactNumber") {
                displayValue = normalizePhoneNumber(value);
              } else if (key.toLowerCase() === "usdot") {
                displayValue = String(value).toUpperCase();
              } else {
                displayValue = toTitleCase(value);
              }

              return (
                <Grid item xs={12} sm={6} key={key}>
                  <Typography
                    variant="subtitle2"
                    sx={{ fontWeight: "bold", color: "text.secondary" }}
                  >
                    {formatKeyLabel(key)}:
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ color: "#003366", fontWeight: 700 }}
                  >
                    {displayValue}
                  </Typography>
                </Grid>
              );
            })}

          </Grid>
        </CardContent>
      </Card>

      {/* Edit Modal */}
      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            width: isMobile ? "90%" : 500,
            bgcolor: "background.paper",
            p: 4,
            m: "auto",
            mt: 10,
            borderRadius: 3,
            boxShadow: 5,
          }}
        >
          <Typography
            variant="h6"
            sx={{ mb: 2, fontWeight: "bold", color: "primary.main" }}
          >
            Edit Company Details
          </Typography>
          <Divider sx={{ mb: 3 }} />

          <Grid container spacing={2}>
            {Object.entries(tempCompanyInfoData).map(([key, value]) => (
              <Grid item xs={12} sm={6} key={key}>
                {key.toLowerCase() === "state" ? (
                  <TextField
                    select
                    fullWidth
                    size="small"
                    label="State"
                    name="state"
                    value={value}
                    onChange={handleChange}
                    variant="outlined"
                  >
                    {states.map((state) => (
                      <MenuItem key={state.label} value={state.label}>
                        {state.label}
                      </MenuItem>
                    ))}
                  </TextField>
                ) : (
                  <TextField
                    fullWidth
                    size="small"
                    label={formatKeyLabel(key)}
                    name={key}
                    value={value}
                    onChange={handleChange}
                    variant="outlined"
                    type={
                      ["usdot", "zip", "suite", "employees"].includes(
                        key.toLowerCase()
                      )
                        ? "number"
                        : key.toLowerCase() === "email"
                          ? "email"
                          : key.toLowerCase().includes("contact")
                            ? "tel"
                            : "text"
                    }
                    inputProps={{
                      ...(key.toLowerCase() === "email" && {
                        pattern: "[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,}$",
                      }),
                      ...(key.toLowerCase().includes("contact") && {
                        maxLength: 10,
                        inputMode: "numeric",
                        pattern: "[0-9]{10}",
                        onInput: (e) => {
                          e.target.value = e.target.value
                            .replace(/\D/g, "")
                            .slice(0, 10);
                        },
                      }),

                      ...(["usdot", "zip", "suite", "employees"].includes(
                        key.toLowerCase()
                      ) && {
                        inputMode: "numeric",
                      }),
                    }}
                    InputProps={{
                      sx: {
                        "& input[type=number]": {
                          MozAppearance: "textfield",
                        },
                        "& input[type=number]::-webkit-outer-spin-button": {
                          WebkitAppearance: "none",
                          margin: 0,
                        },
                        "& input[type=number]::-webkit-inner-spin-button": {
                          WebkitAppearance: "none",
                          margin: 0,
                        },
                      },
                    }}
                    error={
                      (key.toLowerCase() === "email" &&
                        value &&
                        !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value)) ||
                      (key.toLowerCase().includes("contact") &&
                        value &&
                        !/^\d{10}$/.test(value))
                    }
                    helperText={
                      key.toLowerCase() === "email" &&
                        value &&
                        !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value)
                        ? "Invalid email format"
                        : key.toLowerCase().includes("contact") &&
                          value &&
                          !/^\d{10}$/.test(value)
                          ? "Must be a 10-digit number"
                          : ""
                    }
                  />
                )}
              </Grid>
            ))}
          </Grid>

          <Box
            sx={{ mt: 4, display: "flex", justifyContent: "flex-end", gap: 2 }}
          >
            <Button onClick={handleClose} variant="outlined">
              Cancel
            </Button>
            <Button onClick={handleUpdate} variant="contained">
              Update
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default CompanyDetails;
