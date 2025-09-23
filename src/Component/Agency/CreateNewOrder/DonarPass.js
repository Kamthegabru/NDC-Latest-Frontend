import React, { useContext, useEffect } from "react";
import {
  Box,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
  TextField,
  InputAdornment,
} from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import CreateNewOrderContext from "../../../Context/Agency/CreateNewOrder/CreateNewOrderContext";

function DonarPass({ currentEmail = "" }) {
  const { formData, setFormData } = useContext(CreateNewOrderContext);

  // Support either flag name (sendDonorPass or donorPass); keep using formData.donorPass for UI
  const donorPassOn =
    typeof formData.sendDonorPass !== "undefined" ? formData.sendDonorPass : formData.donorPass;

  // Prefill scheduling email when Send Link is ON
  useEffect(() => {
    if (formData.sendLink && currentEmail && !formData.email) {
      setFormData((prev) => ({ ...prev, email: currentEmail }));
    }
  }, [formData.sendLink, currentEmail, formData.email, setFormData]);

  // Sync donorEmail when Donor Pass is ON
  useEffect(() => {
    if (donorPassOn && currentEmail && formData.donorEmail !== currentEmail) {
      setFormData((prev) => ({ ...prev, donorEmail: currentEmail }));
    }
  }, [donorPassOn, currentEmail, formData.donorEmail, setFormData]);

  /* ---------------- handlers ---------------- */
  const handleEmailChange = (event) => {
    setFormData({ ...formData, email: event.target.value });
  };

  const handleSendLinkChange = (_, value) => {
    if (value === null) return;
    const on = value === "yes";
    setFormData((prev) => ({
      ...prev,
      sendLink: on,
      donorPass: on ? false : prev.donorPass,
      sendDonorPass: typeof prev.sendDonorPass !== "undefined" ? (on ? false : prev.sendDonorPass) : prev.sendDonorPass,
      email: on ? (prev.email || currentEmail || "") : "",
      ccEmail: on ? "" : prev.ccEmail || "",
      donorEmail: on ? "" : prev.donorEmail || "",
    }));
  };

  const handleDonorPassChange = (_, value) => {
    if (value === null) return;
    const on = value === "yes";
    setFormData((prev) => ({
      ...prev,
      donorPass: on,
      sendDonorPass: on,
      donorEmail: on ? (currentEmail || prev.donorEmail || "") : "",
      ccEmail: on ? prev.ccEmail || "" : "",
      sendLink: on ? false : prev.sendLink,
    }));
  };

  const handleCCEmailChange = (event) => {
    setFormData({ ...formData, ccEmail: event.target.value });
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 4, mb: 3 }}>
      {/* Send Scheduling Link */}
      <Box>
        <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: "bold" }}>
          Send Scheduling Link
        </Typography>
        <ToggleButtonGroup
          value={formData.sendLink ? "yes" : "no"}
          exclusive
          onChange={handleSendLinkChange}
          size="small"
        >
          <ToggleButton value="yes">Yes</ToggleButton>
          <ToggleButton value="no">No</ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {/* If Send Scheduling Link is Yes -> email input (prefilled, editable) */}
      {formData.sendLink ? (
        <TextField
          label="Enter Email (for scheduling link)"
          variant="outlined"
          fullWidth
          required
          value={formData.email ?? currentEmail ?? ""}
          onChange={handleEmailChange}
          sx={{ mt: 2 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <EmailIcon />
              </InputAdornment>
            ),
          }}
        />
      ) : (
        // Otherwise, show Donor Pass block
        <Box>
          <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: "bold" }}>
            Send Donor Pass
          </Typography>
          <ToggleButtonGroup
            value={donorPassOn ? "yes" : "no"}
            exclusive
            onChange={handleDonorPassChange}
            size="small"
          >
            <ToggleButton value="yes">Yes</ToggleButton>
            <ToggleButton value="no">No</ToggleButton>
          </ToggleButtonGroup>

          {donorPassOn && (
            <Box sx={{ mt: 2, display: "grid", gap: 2 }}>
              <TextField
                label="Recipient Email (auto)"
                variant="outlined"
                fullWidth
                value={currentEmail || formData.donorEmail || ""}
                InputProps={{
                  readOnly: true,
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon />
                    </InputAdornment>
                  ),
                }}
                helperText={
                  currentEmail
                    ? "The donor pass will be sent to this email."
                    : "No email found for the current user."
                }
              />
              <TextField
                label="Enter CC Email(s) separated by semicolons"
                variant="outlined"
                fullWidth
                value={formData.ccEmail || ""}
                onChange={handleCCEmailChange}
              />
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
}

export default DonarPass;
