import React, { useContext, useState } from "react";
import {
    Box,
    Typography,
    TextField,
    MenuItem,
    FormControlLabel,
    Radio,
    RadioGroup,
    Button,
    Grid
} from "@mui/material";
import SignupContext from "../../../../Context/ClientSide/SignUp/SignupContext";

function Payment() {
    const { currentPosition, maxPosition, paymentData, setPaymentData, setCurrentPosition, setMaxPosition } = useContext(SignupContext);

    const [errors, setErrors] = useState({
        creditCardNumber: false,
        cvv: false,
        billingZip: false,
        accountNumber: false,
        routingNumber: false,
        accountName: false,
    });

    const formatCardNumber = (value) => {
        // Remove all non-digit characters
        const digits = value.replace(/\D/g, "");
        // Add a space after every 4 digits
        return digits.replace(/(.{4})/g, "$1 ").trim();
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        let updatedValue = value || "";

        // Format credit card number with spaces after every 4 digits
        if (name === "creditCardNumber") {
            updatedValue = formatCardNumber(updatedValue);
        }

        const updatedPaymentData = { ...paymentData, [name]: updatedValue };
        setPaymentData(updatedPaymentData);

        const isAchSectionFilled =
            updatedPaymentData.accountNumber.trim() !== "" ||
            updatedPaymentData.routingNumber.trim() !== "" ||
            updatedPaymentData.accountName.trim() !== "";

        switch (name) {
            case "creditCardNumber":
                // Validate only digits and 16 digits (ignore spaces)
                setErrors(prev => ({
                    ...prev,
                    creditCardNumber: !/^\d{16}$/.test(updatedValue.replace(/\s/g, ""))
                }));
                break;
            case "cvv":
                setErrors(prev => ({ ...prev, cvv: !/^\d{3}$/.test(updatedValue) }));
                break;
            case "billingZip":
                setErrors(prev => ({ ...prev, billingZip: !/^\d+$/.test(updatedValue) }));
                break;
            case "accountNumber":
                setErrors(prev => ({
                    ...prev,
                    accountNumber: isAchSectionFilled && !/^\d+$/.test(updatedValue)
                }));
                break;
            case "routingNumber":
                setErrors(prev => ({
                    ...prev,
                    routingNumber: isAchSectionFilled && !/^\d{9}$/.test(updatedValue)
                }));
                break;
            case "accountName":
                setErrors(prev => ({
                    ...prev,
                    accountName: isAchSectionFilled && updatedValue.trim() === ""
                }));
                break;
            default:
                break;
        }
    };

    const isAchSectionFilled =
        paymentData.accountNumber.trim() !== "" ||
        paymentData.routingNumber.trim() !== "" ||
        paymentData.accountName.trim() !== "";

    // Fix: Remove .trim() for creditCardNumber and use .replace(/\s/g, "") to count only digits
    const isFormValid =
        paymentData.creditCardNumber.replace(/\s/g, "").length === 16 &&
        /^\d{3}$/.test(paymentData.cvv) &&
        paymentData.billingZip.trim() !== "" &&
        paymentData.expMonth &&
        paymentData.expYear &&
        Object.values(errors).every(error => !error) &&
        (!isAchSectionFilled || (
            /^\d+$/.test(paymentData.accountNumber) &&
            /^\d{9}$/.test(paymentData.routingNumber) &&
            paymentData.accountName.trim() !== ""
        ));

    const handleNext = () => {
        if (currentPosition === maxPosition) {
            setMaxPosition(maxPosition + 1);
        }
        setCurrentPosition(currentPosition + 1);
    };

    return (
        <Box sx={{ width: "100%", mx: "auto" }}>
            <Typography variant="h6" fontWeight="bold">Payment Information</Typography>

            <Typography variant="subtitle1" fontWeight="bold" mt={2}>Card Details *</Typography>

            <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                    <TextField
                        fullWidth
                        label="Credit Card Number"
                        name="creditCardNumber"
                        value={paymentData.creditCardNumber}
                        onChange={handleChange}
                        error={errors.creditCardNumber}
                        helperText={errors.creditCardNumber ? "Must be 16 digits" : ""}
                        inputProps={{
                            maxLength: 19, // 16 digits + 3 spaces
                            inputMode: "numeric",
                            pattern: "[0-9 ]*"
                        }}
                        onKeyPress={(e) => {
                            // Allow only digits and prevent entering more than 19 characters
                            if (!/[0-9]/.test(e.key) || paymentData.creditCardNumber.replace(/\s/g, "").length >= 16) {
                                e.preventDefault();
                            }
                        }}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField
                        fullWidth
                        label="3-Digit CVV"
                        name="cvv"
                        value={paymentData.cvv}
                        onChange={handleChange}
                        error={errors.cvv}
                        helperText={errors.cvv ? "Must be 3 digits" : ""}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField
                        fullWidth
                        select
                        label="Exp Date Month"
                        name="expMonth"
                        value={paymentData.expMonth}
                        onChange={handleChange}
                    >
                        {[...Array(12)].map((_, i) => (
                            <MenuItem key={i} value={i + 1}>{i + 1}</MenuItem>
                        ))}
                    </TextField>
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField
                        fullWidth
                        select
                        label="Exp Date Year"
                        name="expYear"
                        value={paymentData.expYear}
                        onChange={handleChange}
                    >
                        {[...Array(10)].map((_, i) => (
                            <MenuItem key={i} value={2025 + i}>{2025 + i}</MenuItem>
                        ))}
                    </TextField>
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label="Billing Zipcode"
                        name="billingZip"
                        value={paymentData.billingZip}
                        onChange={handleChange}
                        error={errors.billingZip}
                        helperText={errors.billingZip ? "Only numbers allowed" : ""}
                        inputProps={{
                            inputMode: "numeric",
                            pattern: "[0-9]*"
                        }}
                        onKeyPress={(e) => {
                            if (!/[0-9]/.test(e.key)) {
                                e.preventDefault();
                            }
                        }}
                    />
                </Grid>
            </Grid>

            <Typography variant="body2" mt={2}>
                I authorize Nationwide Drug Centers to electronically debit my bank account according to the terms outlined below...
            </Typography>

            <Typography variant="subtitle1" fontWeight="bold" mt={2}>E-Check ACH <span style={{ fontWeight: "normal", color: "gray" }}>(optional)</span></Typography>

            <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                    <TextField
                        fullWidth
                        label="Account Number"
                        name="accountNumber"
                        value={paymentData.accountNumber}
                        onChange={handleChange}
                        error={errors.accountNumber}
                        helperText={errors.accountNumber ? "Only numbers allowed" : ""}
                        inputProps={{
                            inputMode: "numeric",
                            pattern: "[0-9]*"
                        }}
                        onKeyPress={(e) => {
                            if (!/[0-9]/.test(e.key)) {
                                e.preventDefault();
                            }
                        }}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField
                        fullWidth
                        label="Routing Number"
                        name="routingNumber"
                        value={paymentData.routingNumber}
                        onChange={handleChange}
                        error={errors.routingNumber}
                        helperText={errors.routingNumber ? "Must be exactly 9 digits" : ""}
                        inputProps={{
                            inputMode: "numeric",
                            pattern: "[0-9]*"
                        }}
                        onKeyPress={(e) => {
                            if (!/[0-9]/.test(e.key)) {
                                e.preventDefault();
                            }
                        }}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label="Account Name"
                        name="accountName"
                        value={paymentData.accountName}
                        onChange={handleChange}
                        error={errors.accountName}
                        helperText={errors.accountName ? "Account Name is required" : ""}
                    />
                </Grid>
            </Grid>

            <Typography variant="subtitle1" mt={2}>Account Type:</Typography>
            <RadioGroup row name="accountType" value={paymentData.accountType} onChange={handleChange}>
                <FormControlLabel value="Saving" control={<Radio />} label="Saving" />
                <FormControlLabel value="Checking" control={<Radio />} label="Checking" />
                <FormControlLabel value="Consumer" control={<Radio />} label="Consumer" />
                <FormControlLabel value="Business" control={<Radio />} label="Business" />
            </RadioGroup>

            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
                <Button
                    variant="contained"
                    sx={{
                        backgroundColor: isFormValid ? "#003366" : "#E0E0E0",
                        color: isFormValid ? "#FFFFFF" : "#A0A0A0",
                        cursor: isFormValid ? "pointer" : "not-allowed",
                    }}
                    onClick={handleNext}
                    disabled={!isFormValid}
                >
                    Next
                </Button>
            </Box>
        </Box>
    );
}

export default Payment;
