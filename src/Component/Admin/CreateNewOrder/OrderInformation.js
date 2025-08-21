import React, { useState, useEffect, useContext } from "react";
import {
  Typography,
  FormControl,
  TextField,
  Select,
  MenuItem,
  Autocomplete,
  Button,
  Box,
  InputLabel,
} from "@mui/material";
import axios from "axios";
import CreateNewOrderContext from "../../../Context/Admin/CreateNewOrder/CreateNewOrderContext";

const API_URL = process.env.REACT_APP_API_URL;

const DOT_AGENCY_LIST = [
  "FAA",
  "FMCSA",
  "FRA",
  "FTA",
  "HHS",
  "NRC",
  "PHMSA",
  "USCG",
];

const DOT_PACKAGES = [
  "DOT BAT",
  "DOT PANEL",
  "DOT PANEL + DOT BAT",
  "DOT PHYSICAL",
];

const MENU_PROPS = {
  anchorOrigin: { vertical: "bottom", horizontal: "left" },
  transformOrigin: { vertical: "top", horizontal: "left" },
  PaperProps: {
    style: {
      maxHeight: 200,
      overflowY: "auto",
    },
  },
};

function OrderInformation() {
  const {
    orderReasonId,
    packageId,
    companyId,
    allCompanyData,
    currentPosition,
    maxPosition,
    setAllCompanyData,
    setCurrentPosition,
    setCompanyId,
    setPackageId,
    setOrderReasonId,
    setMaxPosition,
    setFormData,
    dotAgency,
    setDotAgency,
  } = useContext(CreateNewOrderContext);

  const [availablePackages, setAvailablePackages] = useState([]);
  const [availableReasons, setAvailableReasons] = useState([]);

  const showDotAgency = DOT_PACKAGES.includes(packageId);

  // Fetch all companies once
  useEffect(() => {
    axios
      .get(`${API_URL}/admin/getAllCompanyAllDetials`)
      .then((res) => setAllCompanyData(res.data.data || []))
      .catch((err) => console.error("Failed to fetch companies:", err));
    // eslint-disable-next-line
  }, []);

  // When company changes, populate packages & reasons
  useEffect(() => {
    if (companyId && allCompanyData.length) {
      const company = allCompanyData.find((c) => c._id === companyId);
      setAvailablePackages(company?.packages || []);
      setAvailableReasons(company?.orderReasons || []);
    } else {
      setAvailablePackages([]);
      setAvailableReasons([]);
    }
  }, [companyId, allCompanyData]);

  // Company selector via Autocomplete + search
  const handleCompanySelect = (e, company) => {
    if (!company) {
      setCompanyId("");
      setPackageId("");
      setOrderReasonId("");
      setFormData((prev) => ({
        ...prev,
        address: "",
        city: "",
        zip: "",
        phone1: "",
        state: "",
      }));
      return;
    }
    setCompanyId(company._id);
    setPackageId("");
    setOrderReasonId("");
    setFormData((prev) => ({
      ...prev,
      address: company.companyDetails.address || "",
      city: company.companyDetails.city || "",
      zip: company.companyDetails.zip || "",
      phone1: company.companyDetails.contactNumber || "",
      state: company.companyDetails.state || "",
    }));
  };

  const handlePackageChange = (e) => {
    setPackageId(e.target.value);
    setOrderReasonId("");
    setDotAgency("");
  };

  const handleReasonChange = (e) => {
    setOrderReasonId(e.target.value);
  };

  const handleDotAgencyChange = (e) => {
    setDotAgency(e.target.value);
  };

  const handleSubmit = () => {
    if (currentPosition === maxPosition) {
      setMaxPosition(maxPosition + 1);
    }
    setCurrentPosition(currentPosition + 1);
  };

  return (
    <Box className="container py-4">
      <Typography variant="h6" className="fw-bold mb-4">
        Order Information
      </Typography>

      {/* Company (with search) */}
      <Box mb={3}>
        <FormControl fullWidth>
          <Autocomplete
            options={allCompanyData}
            getOptionLabel={(opt) => opt.companyName || ""}
            value={allCompanyData.find((c) => c._id === companyId) || null}
            onChange={handleCompanySelect}
            isOptionEqualToValue={(opt, val) => opt._id === val._id}
            renderInput={(params) => (
              <TextField {...params} label="Company" variant="outlined" />
            )}
            ListboxProps={{
              style: { maxHeight: 200, overflowY: "auto" },
            }}
          />
        </FormControl>
      </Box>

      {/* Package */}
      <Box mb={3}>
        <FormControl fullWidth disabled={!companyId}>
          <InputLabel id="package-label">Package</InputLabel>
          <Select
            labelId="package-label"
            value={packageId}
            onChange={handlePackageChange}
            label="Package"
            MenuProps={MENU_PROPS}
          >
            {availablePackages.map((pkg) => (
              <MenuItem key={pkg._id} value={pkg.packageName}>
                {pkg.packageName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Order Reason */}
      <Box mb={showDotAgency ? 3 : 4}>
        <FormControl fullWidth disabled={!packageId}>
          <InputLabel id="order-reason-label">Order Reason</InputLabel>
          <Select
            labelId="order-reason-label"
            value={orderReasonId}
            onChange={handleReasonChange}
            label="Order Reason"
            MenuProps={MENU_PROPS}
          >
            {availableReasons.map((reason) => (
              <MenuItem key={reason._id} value={reason.orderReasonName}>
                {reason.orderReasonName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* DOT Agency */}
      {showDotAgency && (
        <Box mb={4}>
          <FormControl fullWidth>
            <InputLabel id="dot-agency-label">DOT Agency</InputLabel>
            <Select
              labelId="dot-agency-label"
              value={dotAgency}
              onChange={handleDotAgencyChange}
              label="DOT Agency"
              MenuProps={MENU_PROPS}
            >
              {DOT_AGENCY_LIST.map((agency) => (
                <MenuItem key={agency} value={agency}>
                  {agency}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      )}

      <Box display="flex" justifyContent="flex-end">
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          disabled={!orderReasonId || (showDotAgency && !dotAgency)}
        >
          Continue
        </Button>
      </Box>
    </Box>
  );
}

export default OrderInformation;
