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
  Chip,
  Stack,
} from "@mui/material";
import axios from "axios";
import Cookies from "js-cookie";
import CreateNewOrderContext from "../../../Context/Admin/CreateNewOrder/CreateNewOrderContext";

const API_URL = process.env.REACT_APP_API_URL;

const DOT_AGENCY_LIST = ["FAA", "FMCSA", "FRA", "FTA", "HHS", "NRC", "PHMSA", "USCG"];
const DOT_PACKAGES = ["DOT BAT", "DOT PANEL", "DOT PANEL + DOT BAT", "DOT PHYSICAL"];

const MENU_PROPS = {
  anchorOrigin: { vertical: "bottom", horizontal: "left" },
  transformOrigin: { vertical: "top", horizontal: "left" },
  PaperProps: { style: { maxHeight: 200, overflowY: "auto" } },
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// 1) Try common locations first, then 2) deep-scan object for the first email-looking string.
function extractCompanyEmail(company) {
  const candidates = [
    company?.companyDetails?.contactEmail,
    company?.companyDetails?.email,
    company?.companyDetails?.companyEmail,
    company?.companyDetails?.company_email,
    company?.companyDetails?.primaryEmail,
    company?.companyInfoData?.email,
    company?.companyInfoData?.companyEmail,
    company?.email,
    company?.companyEmail,
    company?.contactEmail,
  ].filter(Boolean);

  for (const c of candidates) {
    if (typeof c === "string" && EMAIL_RE.test(c)) return c.trim();
  }

  // Deep fallback: walk the object and return the first string value that looks like an email.
  const seen = new Set();
  const stack = [company];
  while (stack.length) {
    const cur = stack.pop();
    if (!cur || typeof cur !== "object") continue;
    if (seen.has(cur)) continue;
    seen.add(cur);

    for (const val of Object.values(cur)) {
      if (typeof val === "string" && EMAIL_RE.test(val)) return val.trim();
      if (val && typeof val === "object") stack.push(val);
    }
  }
  return "";
}

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

    // NEW (from CreateNewOrderState)
    setSelectedCompanyEmail,
    selectedCompanyEmail,
    formData,
  } = useContext(CreateNewOrderContext);

  const [availablePackages, setAvailablePackages] = useState([]);
  const [availableReasons, setAvailableReasons] = useState([]);
  const [loadingCompanies, setLoadingCompanies] = useState(false);

  const showDotAgency = DOT_PACKAGES.includes(packageId);

  // Fetch all companies (your endpoint) with auth
  useEffect(() => {
    const token = Cookies.get("token");
    const fetchCompanies = async () => {
      try {
        setLoadingCompanies(true);
        if (token) {
          axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        }
        const res = await axios.get(`${API_URL}/admin/getAllCompanyAllDetials`);
        setAllCompanyData(res?.data?.data || []);
      } catch (err) {
        console.error("Failed to fetch companies:", err);
        setAllCompanyData([]);
      } finally {
        setLoadingCompanies(false);
      }
    };
    fetchCompanies();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
  const handleCompanySelect = (_e, company) => {
    if (!company) {
      setCompanyId("");
      setPackageId("");
      setOrderReasonId("");
      setSelectedCompanyEmail(""); // clear email in context
      setFormData((prev) => ({
        ...prev,
        address: "",
        city: "",
        zip: "",
        phone1: "",
        state: "",
        ccEmail: prev.donorPass ? "" : prev.ccEmail, // clear if donor pass active
      }));
      return;
    }

    const email = extractCompanyEmail(company);
    setCompanyId(company._id);
    setSelectedCompanyEmail(email); // <- push into context so DonarPass can see it

    // Reset Pkg/Reason, prefill address/phone, and seed ccEmail if donorPass ON & cc empty
    setPackageId("");
    setOrderReasonId("");
    setFormData((prev) => {
      const shouldSeedCc = prev.donorPass && !String(prev.ccEmail || "").trim() && email;
      return {
        ...prev,
        address: company.companyDetails?.address || "",
        city: company.companyDetails?.city || "",
        zip: company.companyDetails?.zip || "",
        phone1: company.companyDetails?.contactNumber || "",
        state: company.companyDetails?.state || "",
        ccEmail: shouldSeedCc ? email : prev.ccEmail,
      };
    });
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
    if (currentPosition === maxPosition) setMaxPosition(maxPosition + 1);
    setCurrentPosition(currentPosition + 1);
  };

  return (
    <Box className="container py-4">
      <Typography variant="h6" className="fw-bold mb-2">
        Order Information
      </Typography>
      <Typography variant="body2" color="text.secondary" className="mb-3">
        Choose company and order options. Company email (if found) will be used for Donor Pass CC.
      </Typography>

      {/* Company (with search) */}
      <Box mb={1.5}>
        <FormControl fullWidth>
          <Autocomplete
            loading={loadingCompanies}
            options={allCompanyData}
            getOptionLabel={(opt) => opt.companyName || ""}
            value={allCompanyData.find((c) => c._id === companyId) || null}
            onChange={handleCompanySelect}
            isOptionEqualToValue={(opt, val) => opt._id === val._id}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Company"
                variant="outlined"
                placeholder={loadingCompanies ? "Loading..." : "Search company"}
              />
            )}
            ListboxProps={{ style: { maxHeight: 220, overflowY: "auto" } }}
          />
        </FormControl>
      </Box>

      {/* Show the picked email so you can visually confirm */}
      {companyId && (
        <Stack direction="row" spacing={1} mb={2}>
          <Chip
            size="small"
            variant="outlined"
            label={
              selectedCompanyEmail
                ? `Email: ${selectedCompanyEmail}`
                : "No email found for this company"
            }
            color={selectedCompanyEmail ? "primary" : "default"}
          />
        </Stack>
      )}

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
            {(availablePackages || []).map((pkg) => (
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
            {(availableReasons || []).map((reason) => (
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
