import React, { useContext, useState, useEffect } from "react";
import {
  Box, Card, CardContent, Typography, IconButton, Modal,
  TextField, Button, Grid, Divider, useMediaQuery, MenuItem, CircularProgress
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { useTheme } from "@mui/material/styles";
import CustomerContext from "../../../Context/Agency/Customer/CustomerContext";
const normalizePhoneNumber = require("../../Utils/normalizePhone")

// All US States
const stateOptions = [
  { label: "Alabama", value: "AL" }, { label: "Alaska", value: "AK" },
  { label: "Arizona", value: "AZ" }, { label: "Arkansas", value: "AR" },
  { label: "California", value: "CA" }, { label: "Colorado", value: "CO" },
  { label: "Connecticut", value: "CT" }, { label: "Delaware", value: "DE" },
  { label: "Florida", value: "FL" }, { label: "Georgia", value: "GA" },
  { label: "Hawaii", value: "HI" }, { label: "Idaho", value: "ID" },
  { label: "Illinois", value: "IL" }, { label: "Indiana", value: "IN" },
  { label: "Iowa", value: "IA" }, { label: "Kansas", value: "KS" },
  { label: "Kentucky", value: "KY" }, { label: "Louisiana", value: "LA" },
  { label: "Maine", value: "ME" }, { label: "Maryland", value: "MD" },
  { label: "Massachusetts", value: "MA" }, { label: "Michigan", value: "MI" },
  { label: "Minnesota", value: "MN" }, { label: "Mississippi", value: "MS" },
  { label: "Missouri", value: "MO" }, { label: "Montana", value: "MT" },
  { label: "Nebraska", value: "NE" }, { label: "Nevada", value: "NV" },
  { label: "New Hampshire", value: "NH" }, { label: "New Jersey", value: "NJ" },
  { label: "New Mexico", value: "NM" }, { label: "New York", value: "NY" },
  { label: "North Carolina", value: "NC" }, { label: "North Dakota", value: "ND" },
  { label: "Ohio", value: "OH" }, { label: "Oklahoma", value: "OK" },
  { label: "Oregon", value: "OR" }, { label: "Pennsylvania", value: "PA" },
  { label: "Rhode Island", value: "RI" }, { label: "South Carolina", value: "SC" },
  { label: "South Dakota", value: "SD" }, { label: "Tennessee", value: "TN" },
  { label: "Texas", value: "TX" }, { label: "Utah", value: "UT" },
  { label: "Vermont", value: "VT" }, { label: "Virginia", value: "VA" },
  { label: "Washington", value: "WA" }, { label: "West Virginia", value: "WV" },
  { label: "Wisconsin", value: "WI" }, { label: "Wyoming", value: "WY" },
];

// Format label with custom USDOT logic
const formatLabel = (key) => {
  if (key.toLowerCase() === "usdot") return "USDOT";
  const label = key.replace(/([A-Z])/g, " $1").trim();
  const [first, ...rest] = label.split(" ");
  return [first.charAt(0).toUpperCase() + first.slice(1), ...rest].join(" ");
};

const CompanyDetails = () => {
  const { userDetails, updateCompanyInformation } = useContext(CustomerContext);
  const [open, setOpen] = useState(false);
  const [companyInfoData, setCompanyInfoData] = useState({});
  const [tempCompanyInfoData, setTempCompanyInfoData] = useState({});
  const [loading, setLoading] = useState(true);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    if (userDetails?.companyInfoData) {
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

  const handleUpdate = () => {
    updateCompanyInformation(tempCompanyInfoData);
    setOpen(false);
  };

  const isEmailValid = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginTop: "100px",
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
          sx={{ position: "absolute", top: 15, right: 15, color: "primary.main" }}
        >
          <EditIcon />
        </IconButton>
        <CardContent>
          <Typography variant="h5" sx={{ mb: 3, fontWeight: "bold", color: "primary.main" }}>
            Company Information
          </Typography>
          <Grid container spacing={2}>
            {Object.entries(companyInfoData).map(([key, value]) => {
              let displayValue = value;

              if (key === "contactNumber") {
                displayValue = normalizePhoneNumber(value);
              } else if (key === "state") {
                displayValue = stateOptions.find((s) => s.value === value)?.label || value;
              }

              return (
                <Grid item xs={12} sm={6} key={key}>
                  <Typography variant="subtitle2" sx={{ fontWeight: "bold", color: "text.secondary" }}>
                    {formatLabel(key)}:
                  </Typography>
                  <Typography variant="body1" sx={{ color: "#003366", fontWeight: 700 }}>
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
          <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold", color: "primary.main" }}>
            Edit Company Details
          </Typography>
          <Divider sx={{ mb: 3 }} />
          <Grid container spacing={2}>
            {Object.entries(tempCompanyInfoData).map(([key, value]) => {
              const isNumericField = ["zip", "usdot", "suite", "employees"].includes(key);
              const isContactField = key === "contactNumber";
              const isEmailField = key === "email";
              const isStateField = key === "state";

              const handleFieldChange = (e) => {
                const { name, value } = e.target;

                if ((isNumericField || isContactField) && !/^\d*$/.test(value)) return;
                if (isContactField && value.length > 10) return;

                setTempCompanyInfoData((prev) => ({
                  ...prev,
                  [name]: value,
                }));
              };

              return (
                <Grid item xs={12} sm={6} key={key}>
                  {isStateField ? (
                    <TextField
                      select
                      fullWidth
                      size="small"
                      label={formatLabel(key)}
                      name={key}
                      value={value}
                      onChange={handleFieldChange}
                    >
                      {stateOptions.map((state) => (
                        <MenuItem key={state.value} value={state.value}>
                          {state.label}
                        </MenuItem>
                      ))}
                    </TextField>
                  ) : (
                    <TextField
                      fullWidth
                      size="small"
                      type={isNumericField || isContactField ? "tel" : "text"}
                      label={formatLabel(key)}
                      name={key}
                      value={value}
                      onChange={handleFieldChange}
                      variant="outlined"
                      error={
                        (isEmailField && value && !isEmailValid(value)) ||
                        (isContactField && value && value.length > 0 && value.length !== 10)
                      }
                      helperText={
                        isEmailField && value && !isEmailValid(value)
                          ? "Enter a valid email address"
                          : isContactField && value && value.length > 0 && value.length !== 10
                            ? "Contact number must be exactly 10 digits"
                            : ""
                      }
                    />
                  )}
                </Grid>
              );
            })}
          </Grid>
          <Box sx={{ mt: 4, display: "flex", justifyContent: "flex-end", gap: 2 }}>
            <Button onClick={handleClose} variant="outlined">Cancel</Button>
            <Button onClick={handleUpdate} variant="contained">Update</Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default CompanyDetails;
