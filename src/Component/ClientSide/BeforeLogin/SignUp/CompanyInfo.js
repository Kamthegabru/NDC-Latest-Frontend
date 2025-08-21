import React, { useContext, useState } from "react";
import {
    TextField, Button, Box, Typography, Grid, MenuItem, CircularProgress
} from "@mui/material";
import SignupContext from "../../../../Context/ClientSide/SignUp/SignupContext";
import axios from "axios";
import { toast } from "react-toastify";
const API_URL = process.env.REACT_APP_API_URL;

function CompanyInfo() {
    const {
        currentPosition, maxPosition,
        companyInfoData, setCompanyInfoData,
        setCurrentPosition, setMaxPosition
    } = useContext(SignupContext);

    const [emailError, setEmailError] = useState(false);
    const [contactNumberError, setContactNumberError] = useState(false);
    const [usdotError, setUsdotError] = useState(false);
    const [employeesError, setEmployeesError] = useState(false);
    const [zipError, setZipError] = useState(false);

    const [usdotLookup, setUsdotLookup] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "contactNumber") {
            // Only allow up to 10 digits and filter out non-digits
            const digitsOnly = value.replace(/\D/g, "").slice(0, 10);
            setCompanyInfoData({ ...companyInfoData, contactNumber: digitsOnly });
            setContactNumberError(digitsOnly.length !== 10);
            return;
        }

        setCompanyInfoData({ ...companyInfoData, [name]: value });

        if (name === "companyEmail") {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            setEmailError(!emailRegex.test(value));
        }

        if (["usdot", "employees", "zip"].includes(name)) {
            if (/^\d*$/.test(value)) {
                setCompanyInfoData({ ...companyInfoData, [name]: value });
                if (name === "usdot") setUsdotError(false);
                if (name === "employees") setEmployeesError(false);
                if (name === "zip") setZipError(false);
            } else {
                if (name === "usdot") setUsdotError(true);
                if (name === "employees") setEmployeesError(true);
                if (name === "zip") setZipError(true);
            }
        } else {
            setCompanyInfoData({ ...companyInfoData, [name]: value });

            if (name === "companyEmail") {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                setEmailError(!emailRegex.test(value));
            }
        }
    };

    const isFormValid =
        Object.entries(companyInfoData)
            .filter(([key]) => key !== "suite") // suite is optional
            .every(([, value]) => value.trim() !== "") &&
        !emailError && !contactNumberError && !usdotError && !employeesError && !zipError;

    const handleNext = () => {
        if (currentPosition === maxPosition) {
            setMaxPosition(maxPosition + 1);
        }
        setCurrentPosition(currentPosition + 1);
    };

    const fetchUSDOTData = async () => {
        if (!usdotLookup.trim()) return;
        setLoading(true);
        try {
            // Call your backend endpoint (POST, send dot_number in body)
            const response = await axios.post(`${API_URL}/random/getValueFromUSDOT`, { dot_number: usdotLookup });
            const data = response.data.data;
            if (data) {
                setCompanyInfoData(prev => ({
                    ...prev,
                    companyName: data.legal_name || "",
                    usdot: data.dot_number || usdotLookup,
                    contactNumber: data.phone || "",
                    companyEmail: data.email_address || "",
                    safetyAgencyName: data.company_officer_1 || "",
                    employees: data.employees || "",
                    address: data.phy_street || "",
                    city: data.phy_city || "",
                    state: data.phy_state || "",
                    zip: data.phy_zip || "",
                    suite: "",
                }));
            } else {
                toast.error("No company found for this USDOT number.");
            }
        } catch (error) {
            console.error("USDOT API error:", error);
            toast.error("Error fetching company data.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ width: "100%", maxWidth: 800, mx: "auto", p: 3 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6" fontWeight="bold">Company Information</Typography>
                <Box display="flex" alignItems="center" gap={1}>
                    <TextField
                        label="Fill info with USDOT#"
                        size="small"
                        value={usdotLookup}
                        onChange={(e) => setUsdotLookup(e.target.value)}
                        disabled={loading}
                    />
                    <Button
                        variant="contained"
                        onClick={fetchUSDOTData}
                        disabled={loading || !usdotLookup.trim()}
                        sx={{ minWidth: 80 }}
                    >
                        {loading ? <CircularProgress size={24} color="inherit" /> : "Done"}
                    </Button>
                </Box>
            </Box>

            <Grid container spacing={2} mt={1}>
                <Grid item xs={12} md={6}>
                    <TextField
                        label="Company Name"
                        name="companyName"
                        value={companyInfoData.companyName}
                        onChange={handleChange}
                        fullWidth
                        required
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField
                        label="USDOT#"
                        name="usdot"
                        value={companyInfoData.usdot}
                        onChange={handleChange}
                        placeholder="e.g., 23"
                        fullWidth
                        required
                        error={usdotError}
                        helperText={usdotError ? "Only digits are allowed" : ""}
                        inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
                        onKeyPress={(e) => {
                            if (!/[0-9]/.test(e.key)) {
                                e.preventDefault();
                            }
                        }}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField
                        label="Contact Number"
                        name="contactNumber"
                        value={companyInfoData.contactNumber}
                        onChange={handleChange}
                        placeholder="10-digit phone number"
                        fullWidth
                        required
                        error={contactNumberError}
                        helperText={contactNumberError ? "Only 10 digits are allowed" : ""}
                        inputProps={{ inputMode: "numeric", pattern: "[0-9]*", maxLength: 10 }}
                        onKeyPress={(e) => {
                            // Prevent non-digit input
                            if (!/[0-9]/.test(e.key)) {
                                e.preventDefault();
                            }
                            // Prevent entering more than 10 digits
                            if (companyInfoData.contactNumber.length >= 10) {
                                e.preventDefault();
                            }
                        }}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField
                        label="Company E-mail"
                        name="companyEmail"
                        value={companyInfoData.companyEmail}
                        onChange={handleChange}
                        placeholder="example@example.com"
                        fullWidth
                        required
                        error={emailError}
                        helperText={emailError ? "Enter a valid email address" : ""}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField
                        label="Safety Agency Code"
                        name="safetyAgencyName"
                        value={companyInfoData.safetyAgencyName}
                        onChange={handleChange}
                        fullWidth
                        required
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField
                        label="No. of Employees/Drivers"
                        name="employees"
                        value={companyInfoData.employees}
                        onChange={handleChange}
                        placeholder="23"
                        fullWidth
                        required
                        error={employeesError}
                        helperText={employeesError ? "Only digits are allowed" : ""}
                        inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
                        onKeyPress={(e) => {
                            if (!/[0-9]/.test(e.key)) {
                                e.preventDefault();
                            }
                        }}
                    />
                </Grid>
                <Grid item xs={12}>
                    <Typography variant="body2" fontWeight="bold">Address *</Typography>
                    <TextField
                        name="address"
                        label="Address"
                        value={companyInfoData.address}
                        onChange={handleChange}
                        placeholder="Street Address"
                        fullWidth
                        required
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        name="suite"
                        label="Suite (Optional)"
                        value={companyInfoData.suite}
                        onChange={handleChange}
                        placeholder="Suite/Apt/Unit#"
                        fullWidth
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField
                        name="city"
                        label="City"
                        value={companyInfoData.city}
                        onChange={handleChange}
                        placeholder="City"
                        fullWidth
                        required
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField
                        select
                        name="state"
                        label="State / Province"
                        value={companyInfoData.state}
                        onChange={handleChange}
                        fullWidth
                        required
                        SelectProps={{ MenuProps: menuProps }}
                    >
                        {US_STATES.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.label}
                            </MenuItem>
                        ))}
                    </TextField>
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        name="zip"
                        label="Zip"
                        value={companyInfoData.zip}
                        onChange={handleChange}
                        placeholder="Postal / Zip Code"
                        fullWidth
                        required
                        error={zipError}
                        helperText={zipError ? "Only digits are allowed" : ""}
                        inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
                        onKeyPress={(e) => {
                            if (!/[0-9]/.test(e.key)) {
                                e.preventDefault();
                            }
                        }}
                    />
                </Grid>
                <Grid item xs={12} sx={{ display: "flex", justifyContent: "flex-end" }}>
                    <Button
                        variant="contained"
                        onClick={handleNext}
                        style={{
                            backgroundColor: isFormValid ? "#003366" : "#E0E0E0",
                            color: isFormValid ? "#FFFFFF" : "#A0A0A0",
                            cursor: isFormValid ? "pointer" : "not-allowed"
                        }}
                        disabled={!isFormValid}
                    >
                        Next
                    </Button>
                </Grid>
            </Grid>
        </Box>
    );
}

export default CompanyInfo;

const US_STATES = [
    { label: "Alabama", value: "AL" }, { label: "Alaska", value: "AK" }, { label: "Arizona", value: "AZ" },
    { label: "Arkansas", value: "AR" }, { label: "California", value: "CA" }, { label: "Colorado", value: "CO" },
    { label: "Connecticut", value: "CT" }, { label: "Delaware", value: "DE" }, { label: "Florida", value: "FL" },
    { label: "Georgia", value: "GA" }, { label: "Hawaii", value: "HI" }, { label: "Idaho", value: "ID" },
    { label: "Illinois", value: "IL" }, { label: "Indiana", value: "IN" }, { label: "Iowa", value: "IA" },
    { label: "Kansas", value: "KS" }, { label: "Kentucky", value: "KY" }, { label: "Louisiana", value: "LA" },
    { label: "Maine", value: "ME" }, { label: "Maryland", value: "MD" }, { label: "Massachusetts", value: "MA" },
    { label: "Michigan", value: "MI" }, { label: "Minnesota", value: "MN" }, { label: "Mississippi", value: "MS" },
    { label: "Missouri", value: "MO" }, { label: "Montana", value: "MT" }, { label: "Nebraska", value: "NE" },
    { label: "Nevada", value: "NV" }, { label: "New Hampshire", value: "NH" }, { label: "New Jersey", value: "NJ" },
    { label: "New Mexico", value: "NM" }, { label: "New York", value: "NY" }, { label: "North Carolina", value: "NC" },
    { label: "North Dakota", value: "ND" }, { label: "Ohio", value: "OH" }, { label: "Oklahoma", value: "OK" },
    { label: "Oregon", value: "OR" }, { label: "Pennsylvania", value: "PA" }, { label: "Rhode Island", value: "RI" },
    { label: "South Carolina", value: "SC" }, { label: "South Dakota", value: "SD" }, { label: "Tennessee", value: "TN" },
    { label: "Texas", value: "TX" }, { label: "Utah", value: "UT" }, { label: "Vermont", value: "VT" },
    { label: "Virginia", value: "VA" }, { label: "Washington", value: "WA" }, { label: "West Virginia", value: "WV" },
    { label: "Wisconsin", value: "WI" }, { label: "Wyoming", value: "WY" },
];

const menuProps = {
    PaperProps: {
        style: {
            maxHeight: 200,
        },
    },
};
