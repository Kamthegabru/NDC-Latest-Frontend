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
import CreateNewOrderContext from "../../../Context/Agency/CreateNewOrder/CreateNewOrderContext";

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
  // fallback: deep scan
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

// keep 2-letter state if that’s what we have
const maybeAbbrev = (s) => {
  const v = (s || "").toString().trim();
  return /^[A-Za-z]{2}$/.test(v) ? v.toUpperCase() : v;
};

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
    formData,
  } = useContext(CreateNewOrderContext);

  const devDebug = props?.devDebug ?? false;

  const [availablePackages, setAvailablePackages] = useState([]);
  const [availableReasons, setAvailableReasons] = useState([]);
  const [loadingCompanies, setLoadingCompanies] = useState(false);

  // managing agency (email)
  const [managingAgencyEmail, setManagingAgencyEmail] = useState("");
  const [agencyLookupLoading, setAgencyLookupLoading] = useState(false);
  const [agencyLookupError, setAgencyLookupError] = useState("");

  // case-insensitive DOT package check
  const showDotAgency =
    DOT_PACKAGES_NORM.includes((packageId || "").toString().trim().toLowerCase());

  const seededRef = useRef(false);

  // fetch companies (Agency endpoint)
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        setLoadingCompanies(true);
        const token = Cookies.get("token");
        if (token) axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        const res = await axios.get(`${API_URL}/agency/getAllCompanyAllDetials`);
        setAllCompanyData(res?.data?.data || []);
      } catch (err) {
        console.error("Failed to fetch company data:", err);
        setAllCompanyData([]);
      } finally {
        setLoadingCompanies(false);
      }
    };
    fetchCompanies();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // update packages / reasons when company changes
  useEffect(() => {
    if (companyId && allCompanyData.length > 0) {
      const sel = allCompanyData.find((c) => c._id === companyId);
      setAvailablePackages(sel?.packages || []);
      setAvailableReasons(sel?.orderReasons || []);
      seededRef.current = false;
    } else {
      setAvailablePackages([]);
      setAvailableReasons([]);
      seededRef.current = false;
    }
  }, [companyId, allCompanyData]);

  // backend-driven agency lookup (try Agency endpoint first, then Admin as fallback)
  const lookupManagingAgency = async (companyDisplayName) => {
    const token = Cookies.get("token");
    if (token) axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    const tryCall = async (url) => {
      return axios.post(url, { companyName: companyDisplayName });
    };

    if (!companyDisplayName) {
      setManagingAgencyEmail("");
      setFormData((prev) => ({ ...prev, managingAgencyEmail: "" }));
      return;
    }

    try {
      setAgencyLookupLoading(true);
      setAgencyLookupError("");

      // 1) Agency endpoint (if you added it)
      try {
        const r1 = await tryCall(`${API_URL}/agency/findAgencyByCompanyName`);
        const email1 = r1?.data?.data?.agencyEmail || "";
        setManagingAgencyEmail(email1);
        setFormData((prev) => ({ ...prev, managingAgencyEmail: email1 }));
        return;
      } catch (_err1) {
        // fall back to admin endpoint
      }

      // 2) Admin endpoint fallback (works if agency can read it)
      const r2 = await tryCall(`${API_URL}/admin/findAgencyByCompanyName`);
      const email2 = r2?.data?.data?.agencyEmail || "";
      setManagingAgencyEmail(email2);
      setFormData((prev) => ({ ...prev, managingAgencyEmail: email2 }));
    } catch (err) {
      setManagingAgencyEmail("");
      setFormData((prev) => ({ ...prev, managingAgencyEmail: "" }));
      if (err?.response?.status !== 404) {
        setAgencyLookupError("Agency lookup failed");
        console.error("Agency lookup error:", err);
      } else {
        setAgencyLookupError("");
      }
    } finally {
      setAgencyLookupLoading(false);
    }
  };

  // company selector
  const handleCompanySelect = (_e, company) => {
    if (!company) {
      setCompanyId("");
      setPackageId("");
      setOrderReasonId("");
      setManagingAgencyEmail("");
      setAgencyLookupError("");
      setFormData((prev) => ({
        ...prev,
        address: "",
        city: "",
        zip: "",
        phone1: "",
        state: "",
        companyEmail: "",
        managingAgencyEmail: "",
        ccEmail: prev.donorPass ? "" : prev.ccEmail,
      }));
      return;
    }

    const email = extractCompanyEmail(company);
    setCompanyId(company._id);
    setPackageId("");
    setOrderReasonId("");

    // seed address, state, and store company email for DonorPass
    setFormData((prev) => {
      const incomingState =
        company.companyDetails?.state ||
        company.companyDetails?.stateShort ||
        "";
      return {
        ...prev,
        address: company.companyDetails?.address || "",
        city: company.companyDetails?.city || "",
        zip: company.companyDetails?.zip || "",
        phone1: company.companyDetails?.contactNumber || "",
        state: maybeAbbrev(incomingState) || prev.state || "",
        companyEmail: email || "",
        managingAgencyEmail: "",
        // do not auto-combine here; DonorPass controls ccEmail
      };
    });

    const displayName =
      company.companyName ||
      company.companyDetails?.companyName ||
      company.companyInfoData?.companyName ||
      "";
    lookupManagingAgency(displayName);
  };

  const handlePackageChange = (e) => {
    setPackageId(e.target.value);
    setOrderReasonId("");
    setDotAgency("");
  };
  const handleReasonChange = (e) => setOrderReasonId(e.target.value);
  const handleDotAgencyChange = (e) => setDotAgency(e.target.value);

  const handleSubmit = () => {
    if (currentPosition === maxPosition) setMaxPosition(maxPosition + 1);
    setCurrentPosition(currentPosition + 1);
  };

  const allGood =
    !!companyId && !!packageId && !!orderReasonId && (!showDotAgency || !!dotAgency);

  // debug
  useEffect(() => {
    if (!devDebug) return;
    // eslint-disable-next-line no-console
    console.log("[Agency OrderInformation] selections", {
      companyId,
      packageId,
      orderReasonId,
      dotAgency,
      companyEmail: formData?.companyEmail,
      managingAgencyEmail,
    });
  }, [companyId, packageId, orderReasonId, dotAgency, formData?.companyEmail, managingAgencyEmail, devDebug]);

  return (
    <div className="container py-4">
      <Typography variant="h6" className="fw-bold mb-2">
        Order Information
      </Typography>
      <Typography variant="body2" color="text.secondary" className="mb-3">
        Choose company and order options. Company & Agency emails will be used for Donor Pass CC.
      </Typography>

      {devDebug && (
        <Alert severity={allGood ? "success" : "info"} sx={{ mb: 2 }}>
          <strong>Debug:</strong> companyId=<code>{companyId || "-"}</code>, package=
          <code>{packageId || "-"}</code>, reason=<code>{orderReasonId || "-"}</code>{" "}
          {DOT_PACKAGES_NORM.includes((packageId || "").toLowerCase()) && (
            <>| dotAgency=<code>{dotAgency || "-"}</code></>
          )}
          {" | "}companyEmail=<code>{formData?.companyEmail || "-"}</code>
          {" | "}agencyEmail=<code>{managingAgencyEmail || "-"}</code>
        </Alert>
      )}

      {/* Company with search */}
      <div className="row mb-2">
        <div className="col-12">
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
        </div>
      </div>

      {/* Show picked emails just under the company field */}
      {companyId && (
        <Stack direction={{ xs: "column", sm: "row" }} spacing={1} mb={2}>
          {formData?.companyEmail ? (
            <Chip size="small" variant="outlined" color="primary" label={`Company: ${formData.companyEmail}`} />
          ) : null}
          {agencyLookupLoading && <Chip size="small" variant="outlined" label="Finding agency..." />}
          {!agencyLookupLoading && managingAgencyEmail && (
            <Chip size="small" variant="outlined" label={`Agency: ${managingAgencyEmail}`} />
          )}
          {!agencyLookupLoading && !managingAgencyEmail && !agencyLookupError && (
            <Chip size="small" variant="outlined" label="No managing agency found" />
          )}
          {agencyLookupError && (
            <Chip size="small" color="warning" variant="outlined" label={agencyLookupError} />
          )}
        </Stack>
      )}

      {/* Package */}
      <div className="row mb-3">
        <div className="col-12">
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
        </div>
      </div>

      {/* Order Reason */}
      <div className="row mb-4">
        <div className="col-12">
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
        </div>
      </div>

      {/* DOT Agency */}
      {showDotAgency && (
        <div className="row mb-3">
          <div className="col-12">
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
          </div>
        </div>
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
    </div>
  );
}
