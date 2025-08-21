import React, { useState, useEffect, useContext } from "react";
import {
    Typography,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Button,
    Box,
} from "@mui/material";
import axios from "axios";

import CreateNewOrderContext from "../../../../Context/ClientSide/AfterLogin/CreateNewOrder/CreateNewOrderContext";
const API_URL = process.env.REACT_APP_API_URL;

const DOT_AGENCY_LIST = [
    "FAA",
    "FMCSA",
    "FRA",
    "FTA",
    "HHS",
    "NRC",
    "PHMSA",
    "USCG"
];

function OrderInformation() {
    const { orderReasonId, packageId, companyId, allCompanyData, currentPosition, maxPosition, setAllCompanyData, setCurrentPosition, setCompanyId, setPackageId, setOrderReasonId, setMaxPosition, setFormData, dotAgency, setDotAgency } = useContext(CreateNewOrderContext);

    const [availablePackages, setAvailablePackages] = useState([]);
    const [availableReasons, setAvailableReasons] = useState([]);

    // Helper: Packages that require DOT Agency selection
    const DOT_PACKAGES = [
        "DOT BAT",
        "DOT PANEL",
        "DOT PANEL + DOT BAT",
        "DOT PHYSICAL"
    ];

    // Check if selected package requires DOT Agency
    const showDotAgency = DOT_PACKAGES.includes(packageId);

    // Fetch all companies and their details
    useEffect(() => {
        const fetchCompanies = async () => {
            try {
                const res = await axios.get(`${API_URL}/user/getAllCompanyAllDetials`);
                setAllCompanyData(res.data.data || []);
            } catch (err) {
                console.error("Failed to fetch company data:", err);
            }
        };
        fetchCompanies();
        // eslint-disable-next-line
    }, []);
    useEffect(() => {
        if (companyId && allCompanyData.length > 0) {
            const selectedCompany = allCompanyData.find(c => c._id === companyId);
            setAvailablePackages(selectedCompany?.packages || []);
            setAvailableReasons(selectedCompany?.orderReasons || []);
        }
    }, [companyId, allCompanyData]);

    const handleCompanyChange = (e) => {
        const selectedId = e.target.value;
        setCompanyId(selectedId);
        setPackageId("");
        setOrderReasonId("");
        setDotAgency(""); // Reset DOT Agency when company changes

        const selectedCompany = allCompanyData.find(c => c._id === selectedId);
        setFormData((prev) => ({
            ...prev,
            address: selectedCompany.companyDetails.address || "",
            city: selectedCompany.companyDetails.city || "",
            zip: selectedCompany.companyDetails.zip || "",
            state: selectedCompany.companyDetails.state || "",
            phone1: selectedCompany.companyDetails.contactNumber || "",
        }));
        setAvailablePackages(selectedCompany?.packages || []);
        setAvailableReasons(selectedCompany?.orderReasons || []);
    };

    const handlePackageChange = (e) => {
        setPackageId(e.target.value);
        setOrderReasonId("");
        setDotAgency(""); // Reset DOT Agency when package changes
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
        <div className="container py-4">
            <Typography variant="h6" className="fw-bold mb-4">
                Order Information
            </Typography>

            <div className="row mb-3">
                <div className="col-12">
                    <FormControl fullWidth>
                        <InputLabel id="company-location-label">Company</InputLabel>
                        <Select
                            labelId="company-location-label"
                            value={companyId}
                            onChange={handleCompanyChange}
                            label="Company"
                        >
                            {allCompanyData.map((company) => (
                                <MenuItem key={company._id} value={company._id}>
                                    {company.companyName}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </div>
            </div>

            <div className="row mb-3">
                <div className="col-12">
                    <FormControl fullWidth disabled={!companyId}>
                        <InputLabel id="package-label">Package</InputLabel>
                        <Select
                            labelId="package-label"
                            value={packageId}
                            onChange={handlePackageChange}
                            label="Package"
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

            <div className="row mb-4">
                <div className="col-12">
                    <FormControl fullWidth disabled={!packageId}>
                        <InputLabel id="order-reason-label">Order Reason</InputLabel>
                        <Select
                            labelId="order-reason-label"
                            value={orderReasonId}
                            onChange={handleReasonChange}
                            label="Order Reason"
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

export default OrderInformation;
