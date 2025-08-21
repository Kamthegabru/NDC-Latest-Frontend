import React, { useContext, useState } from "react";
import { TextField, Button, Box, Typography, Grid, IconButton, InputAdornment, CircularProgress } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import SignupContext from "../../../../Context/ClientSide/SignUp/SignupContext";
import { getPasswordStrengthHints } from "./PasswordStrengthHelper";
import axios from "axios";
import { toast } from "react-toastify";
const API_URL = process.env.REACT_APP_API_URL;

function ContactInfo() {
    const {
        currentPosition,
        maxPosition,
        contactInfoData,
        setContactInfoData,
        setCurrentPosition,
        setMaxPosition,
        setCompanyInfoData,
    } = useContext(SignupContext);

    const [passwordError, setPasswordError] = useState(false);
    const [confirmPasswordError, setConfirmPasswordError] = useState(false);
    const [emailError, setEmailError] = useState(false);
    const [phoneError, setPhoneError] = useState(false);
    const [passwordHints, setPasswordHints] = useState([]);
    const [showPassword, setShowPassword] = useState(false);
    const [usdotLookup, setUsdotLookup] = useState("");
    const [loading, setLoading] = useState(false);

    const isStrongPassword = (password) => {
        const hints = getPasswordStrengthHints(password);
        setPasswordHints(hints);
        return hints.length === 0;
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
                    address: data.phy_street || "",
                    city: data.phy_city || "",
                    state: data.phy_state || "",
                    zip: data.phy_zip || "",
                    suite: "",
                    employees: data.total_drivers || 0,
                }));

                const fullName = data.company_officer_1 || " ";
                const nameParts = fullName.trim().split(/\s+/);

                const firstName = nameParts[0] || "";
                const lastName = nameParts.length > 1 ? nameParts.slice(1).join(" ") : "";

                setContactInfoData(prev => ({
                    ...prev,
                    firstName: firstName || "",
                    lastName: lastName || "",
                    phone: data.phone || "",
                    email: data.email_address || "",
                    password: `${firstName}@${usdotLookup}`,
                    confirmPassword: `${firstName}@${usdotLookup}`,

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

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "phone") {
            // Only allow up to 10 digits and filter out non-digits
            const digitsOnly = value.replace(/\D/g, "").slice(0, 10);
            setContactInfoData({ ...contactInfoData, phone: digitsOnly });
            setPhoneError(digitsOnly.length !== 10);
            return;
        }
        setContactInfoData({ ...contactInfoData, [name]: value });

        if (name === "password") {
            const isStrong = isStrongPassword(value);
            setPasswordError(!isStrong);
        }

        if (name === "confirmPassword") {
            setConfirmPasswordError(value !== contactInfoData.password);
        }

        if (name === "email") {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            setEmailError(!emailRegex.test(value));
        }
    };

    const isFormValid =
        Object.values(contactInfoData).every(value => value.trim() !== "") &&
        !passwordError &&
        !confirmPasswordError &&
        !emailError &&
        !phoneError &&
        contactInfoData.phone.length === 10;

    const handleNext = () => {
        if (currentPosition === maxPosition) {
            setMaxPosition(maxPosition + 1);
        }
        setCurrentPosition(currentPosition + 1);
    };

    return (
        <Box sx={{ width: "100%", mx: "auto" }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6" fontWeight="bold">Contact Information</Typography>
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
                        label="First Name"
                        name="firstName"
                        value={contactInfoData.firstName}
                        onChange={handleChange}
                        fullWidth
                        required
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField
                        label="Last Name"
                        name="lastName"
                        value={contactInfoData.lastName}
                        onChange={handleChange}
                        fullWidth
                        required
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        label="Phone No"
                        name="phone"
                        value={contactInfoData.phone}
                        onChange={handleChange}
                        onKeyPress={(e) => {
                            // Prevent non-digit input
                            if (!/[0-9]/.test(e.key)) {
                                e.preventDefault();
                            }
                            // Prevent entering more than 10 digits
                            if (contactInfoData.phone.length >= 10) {
                                e.preventDefault();
                            }
                        }}
                        fullWidth
                        required
                        error={phoneError}
                        helperText={phoneError ? "Only 10 digits are allowed" : ""}
                        inputProps={{ inputMode: "numeric", pattern: "[0-9]*", maxLength: 10 }}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        label="Email"
                        name="email"
                        value={contactInfoData.email}
                        onChange={handleChange}
                        fullWidth
                        required
                        error={emailError}
                        helperText={emailError ? "Enter a valid email address" : ""}
                    />
                </Grid>
                <Grid item xs={12}>
                    <Typography variant="body2" color="textSecondary">
                        *By providing a telephone number and submitting this form you are consenting to be contacted by SMS text message. Message & data rates may apply. You can reply STOP to opt-out of further messaging.
                    </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField
                        label="Password"
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={contactInfoData.password}
                        onChange={handleChange}
                        fullWidth
                        required
                        error={passwordError}
                        helperText={passwordError ? "Password does not meet strength requirements" : ""}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label={showPassword ? "Hide password" : "Show password"}
                                        onClick={() => setShowPassword((show) => !show)}
                                        edge="end"
                                    >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            )
                        }}
                    />
                    {passwordHints.length > 0 && (
                        <Box sx={{ mt: 1 }}>
                            <Typography variant="body2" color="textSecondary" fontWeight="bold">
                                Suggestions to make a strong password:
                            </Typography>
                            <ul style={{ paddingLeft: "18px", margin: 0 }}>
                                {passwordHints.map((hint, index) => (
                                    <li key={index} style={{ fontSize: "0.85rem", color: "#666" }}>
                                        {hint}
                                    </li>
                                ))}
                            </ul>
                        </Box>
                    )}
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField
                        label="Confirm Password"
                        type="password"
                        name="confirmPassword"
                        value={contactInfoData.confirmPassword}
                        onChange={handleChange}
                        fullWidth
                        required
                        error={confirmPasswordError}
                        helperText={confirmPasswordError ? "Passwords do not match" : ""}
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

export default ContactInfo;
