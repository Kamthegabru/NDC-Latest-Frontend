import React, { useState, useEffect, useContext, useRef } from "react";
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
  Alert,
} from "@mui/material";
import axios from "axios";
import Cookies from "js-cookie";
import CreateNewOrderContext from "../../../Context/Admin/CreateNewOrder/CreateNewOrderContext";

const API_URL = process.env.REACT_APP_API_URL;

const DOT_AGENCY_LIST = ["FAA", "FMCSA", "FRA", "FTA", "HHS", "NRC", "PHMSA", "USCG"];
const DOT_PACKAGES = ["DOT BAT", "DOT PANEL", "DOT PANEL + DOT BAT", "DOT PHYSICAL"];
const DOT_PACKAGES_NORM = DOT_PACKAGES.map((s) => s.toLowerCase());

const MENU_PROPS = {
  anchorOrigin: { vertical: "bottom", horizontal: "left" },
  transformOrigin: { vertical: "top", horizontal: "left" },
  PaperProps: { style: { maxHeight: 200, overflowY: "auto" } },
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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

export default function OrderInformation(props) {
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

    setSelectedCompanyEmail,
    selectedCompanyEmail,
    formData,
  } = useContext(CreateNewOrderContext);

  const devDebug = props?.devDebug ?? false; // quiet by default
  const rescheduleEnabled = !!props?.rescheduleEnabled;
  const prefill = props?.prefill || {};

  const [availablePackages, setAvailablePackages] = useState([]);
  const [availableReasons, setAvailableReasons] = useState([]);
  const [loadingCompanies, setLoadingCompanies] = useState(false);

  // case-insensitive check for DOT packages
  const showDotAgency =
    DOT_PACKAGES_NORM.includes((packageId || "").toString().trim().toLowerCase());

  // prevent seeding more than once per company load
  const seededRef = useRef(false);

  // Fetch all companies
  useEffect(() => {
    const token = Cookies.get("token");
    const fetchCompanies = async () => {
      try {
        setLoadingCompanies(true);
        if (token) axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
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
      // allow reseed when company changes
      seededRef.current = false;
    } else {
      setAvailablePackages([]);
      setAvailableReasons([]);
      seededRef.current = false;
    }
  }, [companyId, allCompanyData]);

  // Auto-select company by name (reschedule)
  useEffect(() => {
    if (!rescheduleEnabled) return;
    if (!allCompanyData?.length) return;
    if (companyId) return;
    if (!prefill.companyName) return;

    const norm = (s) => (s || "").toString().trim().toLowerCase();
    const targetName = norm(prefill.companyName);

    let match =
      allCompanyData.find((c) => norm(c.companyName) === targetName);

    if (match) handleCompanySelect(null, match);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rescheduleEnabled, allCompanyData, prefill?.companyName, companyId]);

  // After options load, seed Package/Reason/DOT (once)
  useEffect(() => {
    if (!rescheduleEnabled) return;
    if (!companyId) return;
    if (seededRef.current) return;

    const norm = (s) => (s || "").toString().trim().toLowerCase();

    // Package
    if (prefill.packageName && availablePackages?.length) {
      const wanted = norm(prefill.packageName);
      const pkg = availablePackages.find(
        (p) => norm(p.packageName) === wanted || norm(p.packageName).includes(wanted)
      );
      if (pkg?.packageName) setPackageId(pkg.packageName);
    }

    // Order Reason
    if (prefill.orderReason && availableReasons?.length) {
      const wantedR = norm(prefill.orderReason);
      const reason = availableReasons.find(
        (r) =>
          norm(r.orderReasonName) === wantedR ||
          norm(r.orderReasonName).includes(wantedR)
      );
      if (reason?.orderReasonName) setOrderReasonId(reason.orderReasonName);
    }

    // DOT Agency (set regardless; visibility is handled by showDotAgency)
    if (prefill.dotAgency) setDotAgency(prefill.dotAgency);

    if (availablePackages?.length || availableReasons?.length) {
      seededRef.current = true;
    }
  }, [
    rescheduleEnabled,
    companyId,
    availablePackages,
    availableReasons,
    prefill?.packageName,
    prefill?.orderReason,
    prefill?.dotAgency,
    setPackageId,
    setOrderReasonId,
    setDotAgency,
  ]);

  // 🔎 DEV: log whenever the three critical fields change
  useEffect(() => {
    if (!devDebug) return;
    // eslint-disable-next-line no-console
    console.log("[OrderInformation] selections", {
      companyId,
      packageId,
      orderReasonId,
      dotAgency,
    });
  }, [companyId, packageId, orderReasonId, dotAgency, devDebug]);

  // Company selector
  const handleCompanySelect = (_e, company) => {
    if (!company) {
      setCompanyId("");
      setPackageId("");
      setOrderReasonId("");
      setSelectedCompanyEmail("");
      setFormData((prev) => ({
        ...prev,
        address: "",
        city: "",
        zip: "",
        phone1: "",
        state: "",
        ccEmail: prev.donorPass ? "" : prev.ccEmail,
      }));
      return;
    }

    const email = extractCompanyEmail(company);
    setCompanyId(company._id);
    setSelectedCompanyEmail(email);

    // reset options; allow prefill seeding again
    seededRef.current = false;
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

  const allGood = !!companyId && !!packageId && !!orderReasonId && (!showDotAgency || !!dotAgency);

  return (
    <Box className="container py-4">
      <Typography variant="h6" className="fw-bold mb-2">
        Order Information
      </Typography>
      <Typography variant="body2" color="text.secondary" className="mb-3">
        Choose company and order options. Company email (if found) will be used for Donor Pass CC.
      </Typography>

      {/* Dev: show what we will send to backend later */}
      {devDebug && (
        <Alert severity={allGood ? "success" : "info"} sx={{ mb: 2 }}>
          <strong>Debug:</strong> companyId=<code>{companyId || "-"}</code>, package=<code>{packageId || "-"}</code>, reason=<code>{orderReasonId || "-"}</code>
          {` `}
          {DOT_PACKAGES_NORM.includes((packageId || "").toLowerCase()) && (
            <>| dotAgency=<code>{dotAgency || "-"}</code></>
          )}
        </Alert>
      )}

      {/* Company */}
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

      {/* Picked email */}
      {companyId && (
        <Stack direction="row" spacing={1} mb={2}>
          <Chip
            size="small"
            variant="outlined"
            label={
              selectedCompanyEmail
                ? `Email: ${selectedCompanyEmail}`
                : ""
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
