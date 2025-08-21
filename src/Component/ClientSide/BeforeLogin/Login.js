import React, { useContext, useEffect, useState } from "react";
import {
    TextField,
    Button,
    Checkbox,
    FormControlLabel,
    Container,
    Typography,
    Box,
    IconButton,
    InputAdornment
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Link } from "react-router-dom";
import LoginContext from "../../../Context/ClientSide/Login/LoginContext";

function Login() {
    const {
        email,
        password,
        loginSubmit,
        rememberMe,
        setRememberMe,
        setPassword,
        setEmail
    } = useContext(LoginContext);

    const [emailError, setEmailError] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        const savedEmail = localStorage.getItem("rememberedEmail");
        const savedPassword = localStorage.getItem("rememberedPassword");
        if (savedEmail && savedPassword) {
            setEmail(savedEmail);
            setPassword(savedPassword);
            setRememberMe(true);
        }
        // eslint-disable-next-line
    }, [setEmail, setPassword]);

    const handleEmailChange = (event) => {
        const value = event.target.value;
        setEmail(value);
        setEmailError(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value));
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    const togglePasswordVisibility = () => {
        setShowPassword((prev) => !prev);
    };

    const handleLoginSubmit = (event) => {
        event.preventDefault();

        const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        setEmailError(!isEmailValid);

        if (isEmailValid && password.trim()) {
            loginSubmit();
        }
    };

    const isFormValid = email && !emailError && password;

    return (
        <Box sx={{ marginTop: '90px' }}>
            <Container maxWidth="xs" sx={{ minHeight: `calc(100vh - 220px)`, alignContent: 'center' }}>
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        mt: 8,
                        p: 3,
                        boxShadow: 3,
                        borderRadius: 2,
                        bgcolor: "background.paper",
                    }}
                >
                    <Typography variant="h5" gutterBottom>
                        Log in
                    </Typography>

                    <form onSubmit={handleLoginSubmit} style={{ width: '100%' }}>
                        <TextField
                            fullWidth
                            label="Email"
                            variant="outlined"
                            margin="normal"
                            value={email}
                            onChange={handleEmailChange}
                            error={emailError}
                            helperText={emailError ? "Enter a valid email address" : ""}
                        />
                        <TextField
                            fullWidth
                            label="Password"
                            type={showPassword ? "text" : "password"}
                            variant="outlined"
                            margin="normal"
                            value={password}
                            onChange={handlePasswordChange}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton onClick={togglePasswordVisibility} edge="end">
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                )
                            }}
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                />
                            }
                            label="Remember me"
                            sx={{ alignSelf: "flex-start", mt: 1 }}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            sx={{ mt: 2 }}
                            disabled={!isFormValid}
                        >
                            Log in
                        </Button>
                    </form>

                    <Box sx={{ display: "flex", justifyContent: "space-between", width: "100%", mt: 1 }}>
                        <Link to="/forgotPassword" style={{ textDecoration: "none" }}>
                            <Typography variant="body2" color="primary" sx={{ cursor: "pointer" }}>
                                Forgot password?
                            </Typography>
                        </Link>
                        <Link to="/pricing" style={{ textDecoration: "none" }}>
                            <Typography variant="body2" color="primary" sx={{ cursor: "pointer" }}>
                                Sign up
                            </Typography>
                        </Link>
                    </Box>
                </Box>
            </Container>
        </Box>
    );
}

export default Login;
