import React, { useContext, useEffect, useMemo } from "react";
import {
  TextField,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Select,
  MenuItem,
  InputLabel,
  Button,
  Typography,
  Box,
  InputAdornment,
} from "@mui/material";
import { Row, Col } from "react-bootstrap";
import CreateNewOrderContext from "../../../Context/Admin/CreateNewOrder/CreateNewOrderContext";
import DonarPass from "./DonarPass";

function ParticipantInformation() {
  const {
    currentPosition,
    maxPosition,
    setCurrentPosition,
    setMaxPosition,
    formData,
    setFormData,
    getSiteInformation,
    selectedCompanyEmail,
  } = useContext(CreateNewOrderContext);

  // 👉 Set default order expiry = today + 10 days
  useEffect(() => {
    if (!formData.orderExpires) {
      const now = new Date();
      now.setDate(now.getDate() + 10);
      const formatted = now.toISOString().slice(0, 16);
      setFormData((prev) => ({
        ...prev,
        orderExpires: formatted,
      }));
    }
  }, [formData.orderExpires, setFormData]);

  // 👉 Auto-fill email from selectedCompanyEmail if not already set
  useEffect(() => {
    if (selectedCompanyEmail && !formData.email) {
      setFormData((prev) => ({
        ...prev,
        email: selectedCompanyEmail,
      }));
    }
  }, [selectedCompanyEmail, formData.email, setFormData]);

  // 👉 Reorder US_STATES so the selected state appears at the top
  const reorderedStates = useMemo(() => {
    if (!formData.state) return US_STATES;
    const selected = US_STATES.find((s) => s.value === formData.state);
    const rest = US_STATES.filter((s) => s.value !== formData.state);
    return selected ? [selected, ...rest] : US_STATES;
  }, [formData.state]);

  // 👉 Reorder US_STATES for SSN dropdown so the selected state appears at the top
  const reorderedSSNStates = useMemo(() => {
    if (!formData.ssnState) return US_STATES;
    const selected = US_STATES.find((s) => s.value === formData.ssnState);
    const rest = US_STATES.filter((s) => s.value !== formData.ssnState);
    return selected ? [selected, ...rest] : US_STATES;
  }, [formData.ssnState]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // Handle SSN state change - combine with SSN value
    if (name === "ssnState") {
      const ssnValue = formData.ssn?.replace(/^[A-Z]{2}/, '') || '';
      const combinedSSN = value ? `${value}${ssnValue}` : ssnValue;
      setFormData((prev) => ({
        ...prev,
        ssnState: value,
        ssn: combinedSSN,
      }));
    }
    
    else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const handlePrevious = () => {
    setCurrentPosition(currentPosition - 1);
  };

  const handleContinue = () => {
    if (currentPosition === maxPosition) {
      setMaxPosition(maxPosition + 1);
    }
    setCurrentPosition(currentPosition + 1);
    getSiteInformation();
  };

  const handSubmitLink = () => {
    getSiteInformation();
  };

  // Helper function to display SSN without state prefix in the input field
  const getDisplaySSN = () => {
    if (formData.ssn && formData.ssnState) {
      return formData.ssn.replace(new RegExp(`^${formData.ssnState}`), '');
    }
    return formData.ssn || '';
  };

  const validateRequiredFields = () => {
    const required = [
      formData.firstName,
      formData.lastName,
      formData.ssn,
      formData.dob,
      formData.phone1,
      formData.address,
      formData.city,
      formData.state,
      formData.zip,
    ];
    return required.every((val) => val?.toString().trim() !== "");
  };

  return (
    <Box p={2}>
      <Typography variant="h6" className="fw-bold mb-1">
        Participant Information
      </Typography>
      <Typography variant="body2" color="text.secondary" className="mb-4">
        Use the form below to enter participant information. All required fields
        are marked <span className="text-danger">*</span>.
      </Typography>

      {/* Name Fields */}
      <Row className="mb-3">
        <Col md={4}>
          <TextField
            fullWidth
            required
            label="First Name"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
          />
        </Col>
        <Col md={4}>
          <TextField
            fullWidth
            label="Middle Name"
            name="middleName"
            value={formData.middleName}
            onChange={handleChange}
          />
        </Col>
        <Col md={4}>
          <TextField
            fullWidth
            required
            label="Last Name"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
          />
        </Col>
      </Row>

      {/* Personal Details */}
      <Row className="mb-3">
        <Col md={4}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <FormControl sx={{ minWidth: 80 }}>
              <InputLabel id="ssn-state-label">State</InputLabel>
              <Select
                labelId="ssn-state-label"
                name="ssnState"
                value={formData.ssnState || ""}
                onChange={handleChange}
                label="State"
                MenuProps={menuProps}
                sx={{
                  backgroundColor: "#fff",
                  borderRadius: 1,
                  '& .MuiOutlinedInput-root': {
                    borderTopRightRadius: 0,
                    borderBottomRightRadius: 0,
                  }
                }}
              >
                <MenuItem value="">
                  <em>--</em>
                </MenuItem>
                {reorderedSSNStates.map((state) => (
                  <MenuItem
                    key={state.value}
                    value={state.value}
                    sx={{
                      fontWeight: formData.ssnState === state.value ? 600 : 400,
                      color: formData.ssnState === state.value ? "#003366" : "#222",
                      fontSize: 14,
                    }}
                  >
                    {state.value}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              fullWidth
              required
              label="SSN/EID"
              name="ssn"
              value={getDisplaySSN()}
              onChange={handleChange}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderTopLeftRadius: 0,
                  borderBottomLeftRadius: 0,
                }
              }}
            />
          </Box>
        </Col>
        <Col md={4}>
          <TextField
            fullWidth
            required
            type="date"
            InputLabelProps={{ shrink: true }}
            label="DOB"
            name="dob"
            value={formData.dob}
            onChange={handleChange}
          />
        </Col>
        <Col md={4}>
          <TextField
            fullWidth
            required
            label="Phone 1"
            name="phone1"
            value={formData.phone1}
            onChange={handleChange}
          />
        </Col>
      </Row>

      {/* Extra Contact Info - Added Email Field */}
      <Row className="mb-3">
        <Col md={4}>
          <TextField
            fullWidth
            label="Phone 2"
            name="phone2"
            value={formData.phone2}
            onChange={handleChange}
          />
        </Col>

        <Col md={4}>
          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={formData.email || ""}
            onChange={handleChange}
            helperText={selectedCompanyEmail && formData.email === selectedCompanyEmail ? "Auto-filled from company" : ""}
          />
        </Col>

        <Col md={4}>
          <TextField
            fullWidth
            label="Order Expires"
            type="datetime-local"
            InputLabelProps={{ shrink: true }}
            name="orderExpires"
            value={formData.orderExpires || ""}
            onChange={handleChange}
          />
        </Col>
      </Row>

      {/* Observed Collection */}
      <Row className="mb-3">
        <Col md={4}>
          <FormControl>
            <FormLabel>Observed Collection?</FormLabel>
            <RadioGroup
              row
              name="observed"
              value={formData.observed}
              onChange={handleChange}
            >
              <FormControlLabel value="0" control={<Radio />} label="No" />
              <FormControlLabel value="1" control={<Radio />} label="Yes" />
            </RadioGroup>
          </FormControl>
        </Col>
      </Row>

      {/* Address */}
      <Row className="mb-3">
        <Col>
          <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 1 }}>
            Participant Address
          </Typography>
        </Col>
      </Row>

      <Row className="mb-3">
        <Col md={6}>
          <TextField
            fullWidth
            required
            label="Address"
            name="address"
            value={formData.address}
            onChange={handleChange}
          />
        </Col>
        <Col md={6}>
          <TextField
            fullWidth
            label="Address 2"
            name="address2"
            value={formData.address2}
            onChange={handleChange}
          />
        </Col>
      </Row>

      <Row className="mb-4">
        <Col md={4}>
          <TextField
            fullWidth
            required
            label="City"
            name="city"
            value={formData.city}
            onChange={handleChange}
          />
        </Col>
        <Col md={4}>
          <FormControl fullWidth required>
            <InputLabel id="state-label">State</InputLabel>
            <Select
              labelId="state-label"
              name="state"
              value={formData.state}
              onChange={handleChange}
              label="State"
              MenuProps={menuProps}
              sx={{
                backgroundColor: "#fff",
                borderRadius: 2,
              }}
            >
              <MenuItem value="">
                <em>Select state</em>
              </MenuItem>
              {reorderedStates.map((state) => (
                <MenuItem
                  key={state.value}
                  value={state.value}
                  sx={{
                    fontWeight: formData.state === state.value ? 600 : 400,
                    color: formData.state === state.value ? "#003366" : "#222",
                    fontSize: 15,
                  }}
                >
                  {state.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Col>
        <Col md={4}>
          <TextField
            fullWidth
            required
            label="Zip Code"
            name="zip"
            value={formData.zip}
            onChange={handleChange}
          />
        </Col>
      </Row>

      {/* Donar Pass */}
      <DonarPass />

      {/* Actions */}
      <Box display="flex" justifyContent="space-between">
        <Button variant="outlined" onClick={handlePrevious}>
          Previous
        </Button>
        <Box>
          {formData.sendLink ? (
            <Button
              variant="contained"
              onClick={handSubmitLink}
              disabled={!validateRequiredFields()}
            >
              Submit
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={handleContinue}
              disabled={!validateRequiredFields()}
            >
              Continue
            </Button>
          )}
        </Box>
      </Box>
    </Box>
  );
}

export default ParticipantInformation;

const US_STATES = [
  { label: "Alabama", value: "AL" }, { label: "Alaska", value: "AK" },
  { label: "Arizona", value: "AZ" }, { label: "Arkansas", value: "AR" },
  { label: "California", value: "CA" }, { label: "Colorado", value: "CO" },
  { label: "Connecticut", value: "CT" }, { label: "Delaware", value: "DE" },
  { label: "Florida", value: "FL" }, { label: "Georgia", value: "GA" },
  { label: "Hawaii", value: "HI" }, { label: "Idaho", value: "ID" },
  { label: "Illinois", value: "IL" }, { label: "Indiana", value: "IN" },
  { label: "Iowa", value: "IA" }, { label: "Kansas", value: "KS" },
  { label: "Kentucky", value: "KY" }, { label: "Louisiana", value: "LA" },
  { label: "Maine", value: "ME" }, { label: "Maryland", value: "MD" },
  { label: "Massachusetts", value: "MA" }, { label: "Michigan", value: "MI" },
  { label: "Minnesota", value: "MN" }, { label: "Mississippi", value: "MS" },
  { label: "Missouri", value: "MO" }, { label: "Montana", value: "MT" },
  { label: "Nebraska", value: "NE" }, { label: "Nevada", value: "NV" },
  { label: "New Hampshire", value: "NH" }, { label: "New Jersey", value: "NJ" },
  { label: "New Mexico", value: "NM" }, { label: "New York", value: "NY" },
  { label: "North Carolina", value: "NC" }, { label: "North Dakota", value: "ND" },
  { label: "Ohio", value: "OH" }, { label: "Oklahoma", value: "OK" },
  { label: "Oregon", value: "OR" }, { label: "Pennsylvania", value: "PA" },
  { label: "Rhode Island", value: "RI" }, { label: "South Carolina", value: "SC" },
  { label: "South Dakota", value: "SD" }, { label: "Tennessee", value: "TN" },
  { label: "Texas", value: "TX" }, { label: "Utah", value: "UT" },
  { label: "Vermont", value: "VT" }, { label: "Virginia", value: "VA" },
  { label: "Washington", value: "WA" }, { label: "West Virginia", value: "WV" },
  { label: "Wisconsin", value: "WI" }, { label: "Wyoming", value: "WY" },
];

const menuProps = {
  PaperProps: {
    style: {
      maxHeight: 250,
      width: 250,
      marginTop: 6,
      borderRadius: 8,
      boxShadow: "0 4px 20px rgba(0,0,0,0.09)",
      padding: 0,
    },
  },
  MenuListProps: {
    style: {
      padding: 0,
    },
  },
};
