import React, { useContext, useEffect, useState } from "react";
import {
  Box,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
  TextField,
  InputAdornment,
} from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import Cookies from "js-cookie";
import CreateNewOrderContext from "../../../Context/Admin/CreateNewOrder/CreateNewOrderContext";

/* ---------- robust current-user email resolver (JWT + /admin/verify fallback) ---------- */
function base64UrlToJson(str) {
  try {
    const pad = "=".repeat((4 - (str.length % 4)) % 4);
    const b64 = (str + pad).replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(atob(b64));
  } catch {
    return {};
  }
}
async function fetchEmailFromVerify(token) {
  const API_URL = process.env.REACT_APP_API_URL;
  if (!API_URL || !token) return "";
  try {
    const res = await fetch(`${API_URL}/admin/verify`, {
      headers: { Authorization: `Bearer ${token}` },
      credentials: "include",
    });
    if (!res.ok) return "";
    const data = await res.json();
    return (
      data?.email ||
      data?.user?.email ||
      data?.admin?.email ||
      data?.data?.email ||
      ""
    );
  } catch {
    return "";
  }
}
async function resolveCurrentEmail() {
  const token = Cookies.get("token") || "";
  // 1) JWT
  try {
    const [, payload] = token.split(".");
    if (payload) {
      const decoded = base64UrlToJson(payload);
      const jwtEmail =
        decoded?.email ||
        decoded?.user?.email ||
        decoded?.data?.email ||
        decoded?.preferred_username ||
        decoded?.sub ||
        "";
      if (jwtEmail && jwtEmail.includes("@")) return jwtEmail;
    }
  } catch {}
  // 2) localStorage fallback (if you store it there)
  try {
    const lsEmail =
      localStorage.getItem("email") ||
      localStorage.getItem("userEmail") ||
      "";
    if (lsEmail && lsEmail.includes("@")) return lsEmail;
  } catch {}
  // 3) /admin/verify
  const apiEmail = await fetchEmailFromVerify(token);
  if (apiEmail && apiEmail.includes("@")) return apiEmail;

  return "";
}
/* --------------------------------------------------------------------------------------- */

function DonarPass() {
  const { formData, setFormData } = useContext(CreateNewOrderContext);
  const [currentEmail, setCurrentEmail] = useState("");

  // Resolve current user's email on mount
  useEffect(() => {
    let mounted = true;
    (async () => {
      const email = await resolveCurrentEmail();
      if (mounted) setCurrentEmail(email);
    })();
    return () => {
      mounted = false;
    };
  }, []);

  // When Send Scheduling Link is on, prefill email (editable)
  useEffect(() => {
    if (formData.sendLink && currentEmail && !formData.email) {
      setFormData((prev) => ({ ...prev, email: currentEmail }));
    }
  }, [formData.sendLink, currentEmail, formData.email, setFormData]);

  // When Donor Pass is on, sync donorEmail (read-only display)
  useEffect(() => {
    if (formData.donorPass && currentEmail && formData.donorEmail !== currentEmail) {
      setFormData((prev) => ({ ...prev, donorEmail: currentEmail }));
    }
  }, [formData.donorPass, currentEmail, formData.donorEmail, setFormData]);

  /* ---------------- Handlers ---------------- */
  const handleEmailChange = (event) => {
    setFormData({ ...formData, email: event.target.value });
  };

  const handleSendLinkChange = (_, value) => {
    if (value === null) return;
    const on = value === "yes";
    setFormData((prev) => ({
      ...prev,
      sendLink: on,
      // if turning on sendLink, donorPass should be off (per your UX comment)
      donorPass: on ? false : prev.donorPass,
      // prefill email when turning on; clear when off (keep your existing behavior)
      email: on ? (prev.email || currentEmail || "") : "",
      // clear donor pass cc when switching to sendLink on
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
      // ensure recipient email is set from current email when turning on
      donorEmail: on ? (currentEmail || prev.donorEmail || "") : "",
      // keep CCs only when on
      ccEmail: on ? prev.ccEmail || "" : "",
      // if donorPass on, make sure sendLink is off
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

      {/* If Send Scheduling Link is Yes -> show email input (prefilled, editable) */}
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
        // Otherwise, show Donor Pass toggle
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

          {/* When donor pass is ON -> show recipient (read-only) + CC */}
          {formData.donorPass && (
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
