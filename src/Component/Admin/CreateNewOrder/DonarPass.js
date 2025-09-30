import React, { useContext, useEffect, useRef, useState } from "react";
import { Box, Typography, ToggleButton, ToggleButtonGroup, TextField } from "@mui/material";
import CreateNewOrderContext from "../../../Context/Admin/CreateNewOrder/CreateNewOrderContext";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function DonarPass() {
  const { formData, setFormData, selectedCompanyEmail } = useContext(CreateNewOrderContext);
  const [ccError, setCcError] = useState("");

  // Track whether the user has typed in CC, and whether we've auto-seeded once
  const ccTouchedRef = useRef(false);
  const seededOnceRef = useRef(false);

  // Seed ccEmail ONLY when Donor Pass is toggled ON (or company email changes) AND the user hasn't typed yet.
  useEffect(() => {
    if (!formData.donorPass) {
      // reset when donor pass is OFF so a future ON can seed again
      seededOnceRef.current = false;
      ccTouchedRef.current = false;
      return;
    }
    if (ccTouchedRef.current) return;         // don't override user input
    if (seededOnceRef.current) return;        // already seeded once this ON-cycle
    const empty = !String(formData.ccEmail || "").trim();
    if (selectedCompanyEmail && empty) {
      setFormData((prev) => ({ ...prev, ccEmail: selectedCompanyEmail }));
      seededOnceRef.current = true;           // remember we auto-filled once
    }
  // NOTE: deliberately NOT watching formData.ccEmail to avoid reseeding after user clears
  }, [formData.donorPass, selectedCompanyEmail, setFormData, formData.ccEmail]);

  const handleEmailChange = (event) => {
    setFormData({ ...formData, email: event.target.value });
  };

  const handleSendLinkChange = (_, value) => {
    if (value === null) return;
    const nextSendLink = value === "yes";
    setFormData((prev) => ({
      ...prev,
      sendLink: nextSendLink,
      donorPass: nextSendLink ? false : prev.donorPass,
      email: prev.email,
      ccEmail: nextSendLink ? "" : prev.ccEmail,
    }));
    setCcError("");
    if (nextSendLink) {
      // switching to link mode: consider untouched again
      ccTouchedRef.current = false;
      seededOnceRef.current = false;
    }
  };

  const handleDonorPassChange = (_, value) => {
    if (value === null) return;
    const next = value === "yes";
    setFormData((prev) => ({
      ...prev,
      donorPass: next,
      ccEmail: next ? prev.ccEmail : "",
    }));
    setCcError("");
    // when toggling, reset flags so a future ON can seed once again
    ccTouchedRef.current = false;
    seededOnceRef.current = false;
  };

  const handleCCEmailChange = (event) => {
    ccTouchedRef.current = true; // user has interacted; never auto-fill again during this ON-cycle
    setFormData({ ...formData, ccEmail: event.target.value });
  };

  // Validate semicolon-separated emails when Donor Pass is ON
  useEffect(() => {
    if (!formData.donorPass) return setCcError("");
    const raw = String(formData.ccEmail || "").trim();
    if (!raw) return setCcError("");
    const tokens = raw.split(";").map((t) => t.trim()).filter(Boolean);
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
          value={formData.email || ""}
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
              value={formData.ccEmail || ""}
              onChange={handleCCEmailChange}
              error={!!ccError}
              helperText={
                ccError ||
                (selectedCompanyEmail
                  ? `Company email: ${selectedCompanyEmail}`
                  : "Add more with “;”")
              }
              sx={{ mt: 2 }}
            />
          )}
        </Box>
      )}
    </Box>
  );
}

export default DonarPass;
