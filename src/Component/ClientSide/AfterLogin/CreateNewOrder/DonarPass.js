import React, {  useContext} from "react";
import {
  Box,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
  TextField,
} from "@mui/material";
import CreateNewOrderContext from "../../../../Context/ClientSide/AfterLogin/CreateNewOrder/CreateNewOrderContext";;

function DonarPass() {
  const { formData, setFormData } = useContext(CreateNewOrderContext);

  // If sendLink = true, always show email input, hide donor pass.
  // If sendLink = false, show donor pass toggle. If donorPass is true, show ccEmail input.

  // Email field state for "Send Scheduling Link"
  const handleEmailChange = (event) => {
    setFormData({ ...formData, email: event.target.value });
  };

  // For send scheduling link
  const handleSendLinkChange = (_, value) => {
    if (value !== null) {
      setFormData({
        ...formData,
        sendLink: value === "yes",
        donorPass: value === "yes" ? false : formData.donorPass,
        email: "",
        ccEmail: ""
      });
    }
  };

  // For donor pass toggle
  const handleDonorPassChange = (_, value) => {
    if (value !== null) {
      setFormData({
        ...formData,
        donorPass: value === "yes",
        ccEmail: value === "yes" ? formData.ccEmail : ""
      });
    }
  };

  // For ccEmail field (Donor Pass)
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

      {/* If Send Scheduling Link is Yes, show email input and hide Donor Pass */}
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
        // Otherwise, show donor pass toggle and ccEmail field if enabled
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
              value={formData.ccEmail}
              onChange={handleCCEmailChange}
              sx={{ mt: 2 }}
            />
          )}
        </Box>
      )}
    </Box>
  );
}

export default DonarPass;
