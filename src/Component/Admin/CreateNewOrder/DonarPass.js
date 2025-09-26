import React, { useContext, useEffect, useState } from "react";
import { Box, Typography, ToggleButton, ToggleButtonGroup, TextField } from "@mui/material";
import CreateNewOrderContext from "../../../Context/Admin/CreateNewOrder/CreateNewOrderContext";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function DonarPass() {
  const { formData, setFormData, selectedCompanyEmail } = useContext(CreateNewOrderContext);
  const [ccError, setCcError] = useState("");

  // Seed ccEmail when Donor Pass is ON and empty
  useEffect(() => {
    if (formData.donorPass && selectedCompanyEmail && !String(formData.ccEmail || "").trim()) {
      setFormData((prev) => ({ ...prev, ccEmail: selectedCompanyEmail }));
    }
  }, [formData.donorPass, selectedCompanyEmail, formData.ccEmail, setFormData]);

  const handleEmailChange = (event) => {
    setFormData({ ...formData, email: event.target.value });
  };

  const handleSendLinkChange = (_, value) => {
    if (value !== null) {
      setFormData({
        ...formData,
        sendLink: value === "yes",
        donorPass: value === "yes" ? false : formData.donorPass,
        email: "",
        ccEmail: "",
      });
      setCcError("");
    }
  };

  const handleDonorPassChange = (_, value) => {
    if (value !== null) {
      const next = value === "yes";
      setFormData((prev) => ({
        ...prev,
        donorPass: next,
        ccEmail: next
          ? prev.ccEmail || selectedCompanyEmail || ""
          : "",
      }));
      setCcError("");
    }
  };

  const handleCCEmailChange = (event) => {
    setFormData({ ...formData, ccEmail: event.target.value });
  };

  // validate semicolon-separated emails
  useEffect(() => {
    if (!formData.donorPass) return setCcError("");
    const input = String(formData.ccEmail || "").trim();
    if (!input) return setCcError("");
    const tokens = input.split(";").map((t) => t.trim()).filter(Boolean);
    const invalid = tokens.filter((t) => !EMAIL_RE.test(t));
    setCcError(invalid.length ? `Invalid email(s): ${invalid.join(", ")}` : "");
  }, [formData.donorPass, formData.ccEmail]);

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

      {formData.sendLink ? (
        <TextField
          label="Enter Email (for scheduling link)"
          variant="outlined"
          fullWidth
          required
          value={formData.email}
          onChange={handleEmailChange}
          sx={{ mt: 2 }}
        />
      ) : (
        <Box>
          <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: "bold" }}>
            Send Donor Pass
          </Typography>
          <ToggleButtonGroup
            value={formData.donorPass ? "yes" : "no"}
            exclusive
            onChange={handleDonorPassChange}
            size="small"
          >
            <ToggleButton value="yes">Yes</ToggleButton>
            <ToggleButton value="no">No</ToggleButton>
          </ToggleButtonGroup>

          {formData.donorPass && (
            <TextField
              label="Enter CC Email(s) separated by semicolons"
              variant="outlined"
              fullWidth
              value={selectedCompanyEmail}
              onChange={handleCCEmailChange}
              error={!!ccError}
              helperText={ccError || (selectedCompanyEmail ? `Company email: ${selectedCompanyEmail}` : "Add more with “;”")}
              sx={{ mt: 2 }}
            />
          )}
        </Box>
      )}
    </Box>
  );
}

export default DonarPass;
