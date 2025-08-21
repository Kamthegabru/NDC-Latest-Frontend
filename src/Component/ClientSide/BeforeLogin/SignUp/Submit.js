import React, { useContext, useState, useRef } from "react";
import { TextField, Button, Box, Typography, Grid, Checkbox, FormControlLabel, Paper, Modal } from "@mui/material";
import SignupContext from "../../../../Context/ClientSide/SignUp/SignupContext";
import SignatureCanvas from 'react-signature-canvas';
import CircularProgress from '@mui/material/CircularProgress';


function Submit() {
    const { submitFormData, setSubmitFormData, submitFormFunction, isLoading } = useContext(SignupContext);
    const [errors, setErrors] = useState({
        firstName: false,
        lastName: false,
        date: false,
        signature: false,
    });
    const [openSignatureModal, setOpenSignatureModal] = useState(false);
    const signatureCanvasRef = useRef(null);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setSubmitFormData({ ...submitFormData, [name]: type === "checkbox" ? checked : value });

        switch (name) {
            case "firstName":
            case "lastName":
                setErrors({ ...errors, [name]: !/^[A-Za-z\s]+$/.test(value) || value.trim() === "" });
                break;
            case "date":
                const selectedDate = new Date(value);
                const today = new Date();
                setErrors({ ...errors, date: value === "" || selectedDate > today });
                break;
            default:
                break;
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        submitFormFunction();
    };

    const openSignaturePad = () => {
        setOpenSignatureModal(true);
    };

    const closeSignaturePad = () => {
        setOpenSignatureModal(false);
    };

    const clearSignature = () => {
        signatureCanvasRef.current.clear();
    };

    const saveSignature = () => {
        const signatureData = signatureCanvasRef.current.toDataURL();
        setSubmitFormData({ ...submitFormData, signature: signatureData });
        setErrors({ ...errors, signature: !signatureData.startsWith("data:image/png;base64,") });
        closeSignaturePad();
    };

    const isFormValid =
        submitFormData.firstName &&
        submitFormData.lastName &&
        submitFormData.date &&
        submitFormData.signature &&
        submitFormData.signature.startsWith("data:image/png;base64,") &&  // Signature must be a valid image URL
        submitFormData.agree &&
        Object.values(errors).every(error => !error);

    return (
        <Box sx={{ width: "100%", maxWidth: 800, mx: "auto", p: 3 }}>
            <Typography variant="h6" fontWeight="bold">Signature & Submission</Typography>

            <Grid container spacing={2} mt={1}>
                <Grid item xs={12} md={6}>
                    <Typography fontWeight="bold">Business Owner Name *</Typography>
                    <TextField
                        label="First Name"
                        name="firstName"
                        value={submitFormData.firstName}
                        onChange={handleChange}
                        fullWidth
                        required
                        error={errors.firstName}
                        helperText={errors.firstName ? "Only letters are allowed" : ""}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField
                        label="Last Name"
                        name="lastName"
                        value={submitFormData.lastName}
                        onChange={handleChange}
                        fullWidth
                        required
                        error={errors.lastName}
                        helperText={errors.lastName ? "Only letters are allowed" : ""}
                        sx={{ marginTop: '23px' }}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <Typography fontWeight="bold">Date *</Typography>
                    <TextField
                        type="date"
                        name="date"
                        value={submitFormData.date}
                        onChange={handleChange}
                        fullWidth
                        required
                        error={errors.date}
                        helperText={errors.date ? "Date cannot be empty or in the future" : ""}
                        inputProps={{
                            min: new Date().toISOString().split("T")[0] // Only allow today or future dates
                        }}
                    />
                </Grid>
                <Grid item xs={12}>
                    <Typography fontWeight="bold">Read carefully</Typography>
                    <Paper sx={{ p: 2, bgcolor: "#f5f5f5", height: 100, overflow: "auto", fontSize: 14 }}>
                        *By Signing below, individual/company agrees to authorize Nationwide Drug Centers to charge
                        credit card/debit payment (automatically if requested) or in full, including late fees 45 days past the original billing date.
                        I also understand and authorize Nationwide Drug Centers to bill the company or personal credit card or direct debit
                        on file to be charged without notice. A credit card is mandatory in order to open an account. You agree to auto-renewal
                        charges, and cancellation may only be done via email notice 30 days before renewal.
                    </Paper>
                </Grid>
                <Grid item xs={12}>
                    <Typography fontWeight="bold">Signature *</Typography>
                    <Button variant="contained" onClick={openSignaturePad} style={{ backgroundColor: "#003366" }}>
                        Add Sign
                    </Button>
                    {submitFormData.signature && (
                        <Box sx={{ mt: 2, border: "1px solid #ccc", p: 1 }}>
                            <Typography fontWeight="bold">Saved Signature:</Typography>
                            <img src={submitFormData.signature} alt="Signature" width="200px" />
                        </Box>
                    )}
                    {errors.signature && <Typography color="error">Signature is required</Typography>}
                </Grid>
                <Grid item xs={12}>
                    <FormControlLabel
                        control={<Checkbox checked={submitFormData.agree} onChange={handleChange} name="agree" />}
                        label="Please ensure that all the information you have entered is correct."
                    />
                </Grid>
                <Grid item xs={12} sx={{ display: "flex", justifyContent: "flex-end" }}>
                    <Button
                        variant="contained"
                        sx={{
                            backgroundColor: isFormValid && !isLoading ? "#003366" : "#E0E0E0",
                            color: isFormValid && !isLoading ? "#FFFFFF" : "#A0A0A0",
                            cursor: isFormValid && !isLoading ? "pointer" : "not-allowed",
                            minWidth: 120
                        }}
                        onClick={handleSubmit}
                        disabled={!isFormValid || isLoading}
                    >
                        {isLoading ? (
                            <CircularProgress size={24} color="inherit" />
                        ) : (
                            "Sign up"
                        )}
                    </Button>
                </Grid>

            </Grid>

            {/* Signature Modal */}
            <Modal
                open={openSignatureModal}
                onClose={closeSignaturePad}
                sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
            >
                <Box sx={{ bgcolor: "white", p: 4, borderRadius: 2, boxShadow: 24, textAlign: "center" }}>
                    <Typography variant="h6" fontWeight="bold">Sign Below</Typography>
                    <SignatureCanvas
                        ref={signatureCanvasRef}
                        penColor='black'
                        canvasProps={{ width: 500, height: 200, className: 'signature-canvas' }}
                    />
                    <Box mt={2} display="flex" justifyContent="space-between">
                        <Button variant="contained" color="error" onClick={clearSignature}>Clear</Button>
                        <Button variant="contained" color="primary" onClick={saveSignature}>Save</Button>
                    </Box>
                </Box>
            </Modal>
        </Box>
    );
}

export default Submit;
