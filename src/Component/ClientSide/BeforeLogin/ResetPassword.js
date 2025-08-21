import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Alert,
} from "@mui/material";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";
import { getPasswordStrengthHints } from "../BeforeLogin/SignUp/PasswordStrengthHelper";

const API_URL = process.env.REACT_APP_API_URL;

function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [confirmPasswordError, setConfirmPasswordError] = useState(false);
  const [error] = useState("");
  const [passwordHints, setPasswordHints] = useState([]);

  const isStrongPassword = (password) => {
    const hints = getPasswordStrengthHints(password);
    setPasswordHints(hints);
    return hints.length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "password") {
      setPassword(value);
      const strong = isStrongPassword(value);
      setPasswordError(!strong);
    }

    if (name === "confirmPassword") {
      setConfirmPassword(value);
      setConfirmPasswordError(value !== password);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isStrongPassword(password)) {
      setPasswordError(true);
      return;
    }

    if (password !== confirmPassword) {
      setConfirmPasswordError(true);
      return;
    }

    try {
      const res = await axios.post(`${API_URL}/loginAndSignUp/resetPassword`, {
        email,
        token,
        password,
      });

      toast.success(res.data.message || "Password reset successful.");
      setPassword("");
      setConfirmPassword("");
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong.");
    }
  };

  return (
    <Box sx={{ marginTop: "90px" }}>
      <Container maxWidth="sm" sx={{ minHeight: `calc(100vh - 220px)` }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: "20px" }}>
          <Typography variant="h5" align="center" gutterBottom>
            Reset Your Password
          </Typography>

          {error && <Alert severity="error">{error}</Alert>}

          <form onSubmit={handleSubmit}>
            <TextField
              label="New Password"
              type="password"
              name="password"
              value={password}
              onChange={handleChange}
              fullWidth
              required
              error={passwordError}
              helperText={
                passwordError ? "Password does not meet strength requirements" : ""
              }
              sx={{ mb: 2 }}
            />

            {passwordHints.length > 0 && (
              <Box sx={{ mb: 2 }}>
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

            <TextField
              label="Confirm New Password"
              type="password"
              name="confirmPassword"
              value={confirmPassword}
              onChange={handleChange}
              fullWidth
              required
              error={confirmPasswordError}
              helperText={confirmPasswordError ? "Passwords do not match" : ""}
              sx={{ mb: 2 }}
            />

            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ borderRadius: 2 }}
            >
              Reset Password
            </Button>
          </form>
        </Paper>
      </Container>
    </Box>
  );
}

export default ResetPassword;
