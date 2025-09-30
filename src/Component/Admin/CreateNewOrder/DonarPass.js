import React, { useContext, useEffect, useMemo, useState } from "react";
import { Box, Typography, ToggleButton, ToggleButtonGroup, TextField, Stack } from "@mui/material";
import CreateNewOrderContext from "../../../Context/Admin/CreateNewOrder/CreateNewOrderContext";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function DonarPass() {
  const { formData, setFormData, selectedCompanyEmail } = useContext(CreateNewOrderContext);
  const agencyEmailFromLookup = formData.managingAgencyEmail || "";

  const [companyCc, setCompanyCc] = useState("");
  const [agencyCc, setAgencyCc] = useState("");
  const [ccError, setCcError] = useState("");

  // --- helpers ---
  const splitEmails = (raw) =>
    String(raw || "")
      .split(";")
      .map((t) => t.trim())
      .filter(Boolean);

  const uniqueEmails = (list) => {
    const seen = new Map();
    for (const v of list) {
      const key = v.toLowerCase();
      if (!key) continue;
      if (!seen.has(key)) seen.set(key, v);
    }
    return Array.from(seen.values());
  };

  // IMPORTANT: join with ';' (no spaces)
  const joinEmails = (list) => uniqueEmails(list).join(";");

  // Seed local editable fields ONCE when donor pass is ON and they're empty
  useEffect(() => {
    if (!formData.donorPass) return;
    if (!companyCc && selectedCompanyEmail) setCompanyCc(selectedCompanyEmail);
    if (!agencyCc && agencyEmailFromLookup) setAgencyCc(agencyEmailFromLookup);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.donorPass, selectedCompanyEmail, agencyEmailFromLookup]);

  // Combined CC (company + agency) -> stored in formData.ccEmail
  const combinedCc = useMemo(() => {
    const parts = [...splitEmails(companyCc), ...splitEmails(agencyCc)];
    return joinEmails(parts);
  }, [companyCc, agencyCc]);

  // Keep formData.ccEmail synced while Donor Pass is ON
  useEffect(() => {
    if (!formData.donorPass) return;
    if (formData.ccEmail !== combinedCc) {
      setFormData((prev) => ({ ...prev, ccEmail: combinedCc }));
    }
  }, [formData.donorPass, combinedCc, formData.ccEmail, setFormData]);

  // When user toggles Send Link <-> Donor Pass
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
  };

  const handleDonorPassChange = (_, value) => {
    if (value === null) return;
    const next = value === "yes";
    setFormData((prev) => ({
      ...prev,
      donorPass: next,
      ccEmail: next ? combinedCc : "",
    }));
    if (!next) setCcError("");
  };

  // Validate the combined cc when Donor Pass is ON
  useEffect(() => {
    if (!formData.donorPass) return setCcError("");
    const raw = combinedCc.trim();
    if (!raw) return setCcError("");
    const tokens = splitEmails(raw);
    const invalid = tokens.filter((t) => !EMAIL_RE.test(t));
    setCcError(invalid.length ? `Invalid email(s): ${invalid.join(", ")}` : "");
  }, [formData.donorPass, combinedCc]);

  const handleEmailChange = (event) => {
    setFormData({ ...formData, email: event.target.value });
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
            <Stack spacing={2} sx={{ mt: 2 }}>
              {/* Editable, separate fields */}
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <TextField
                  label="Company CC Email"
                  variant="outlined"
                  fullWidth
                  value={companyCc}
                  onChange={(e) => setCompanyCc(e.target.value)}
                />
                <TextField
                  label="Agency CC Email"
                  variant="outlined"
                  fullWidth
                  value={agencyCc}
                  onChange={(e) => setAgencyCc(e.target.value)}
                />
              </Stack>

              {/* Show what will be submitted (no spaces around ';') */}
              <TextField
                label="Combined CC (submitted)"
                variant="outlined"
                fullWidth
                value={combinedCc}
                InputProps={{ readOnly: true }}
                error={!!ccError}
                helperText={ccError || "Format: company@example.com;agency@example.com"}
              />
            </Stack>
          )}
        </Box>
      )}
    </Box>
  );
}

export default DonarPass;
