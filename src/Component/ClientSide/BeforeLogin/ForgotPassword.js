import React, { useState } from 'react';
import { Container, Box, TextField, Button, Typography, Paper, CircularProgress, } from '@mui/material';

import axios from 'axios';
import { toast } from "react-toastify";

const API_URL = process.env.REACT_APP_API_URL;


function ForgetPassword() {
    const [email, setEmail] = useState('');
    const [confirmEmail, setConfirmEmail] = useState('');
    const [error, setError] = useState('');
    const [isResponseArrive, setIsResponseArrive] = useState(true);
    const validateEmailFormat = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateEmailFormat(email)) {
            setError("Please enter a valid email address.");
            return;
        }

        if (email !== confirmEmail) {
            setError("Email addresses do not match.");
            return;
        }

        setError('');
        setIsResponseArrive(false);
        try {
            const response = await axios.post(`${API_URL}/loginAndSignUp/forgotPassword`, { email });
            toast.success(response.data.message || `Reset link sent to ${email}`);
            setEmail('');
            setConfirmEmail('');
            setIsResponseArrive(true)
        } catch (error) {
            console.error("Error sending reset email:", error);
            toast.error(error.response?.data?.message || "Something went wrong. Please try again.");
            setIsResponseArrive(true)
        }
    };

    return (
        <Box sx={{ marginTop: '90px' }}>
            <Container maxWidth="sm" className="d-flex justify-content-center align-items-center" sx={{ minHeight: `calc(100vh - 220px)`, alignContent: 'center' }}>
                <Paper elevation={3} className="p-4 w-100" style={{ borderRadius: '20px' }}>
                    <Typography variant="h5" align="center" gutterBottom>
                        Forgot Password
                    </Typography>
                    <Typography variant="body2" align="center" gutterBottom>
                        Enter and confirm your email to receive a password reset link.
                    </Typography>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <TextField
                                label="Email"
                                variant="outlined"
                                fullWidth
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="mb-3">
                            <TextField
                                label="Confirm Email"
                                variant="outlined"
                                fullWidth
                                required
                                value={confirmEmail}
                                onChange={(e) => setConfirmEmail(e.target.value)}
                            />
                        </div>
                        {error && (
                            <Typography variant="body2" color="error" className="mb-3">
                                {error}
                            </Typography>
                        )}
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            fullWidth
                            disabled={!isResponseArrive}
                            startIcon={!isResponseArrive && <CircularProgress size={20} color="inherit" />}
                            sx={{ mt: 1, borderRadius: 2 }}
                        >
                            {!isResponseArrive ? "Sending..." : "Send Reset Link"}
                        </Button>

                    </form>
                </Paper>
            </Container>
        </Box>
    );
}

export default ForgetPassword;
