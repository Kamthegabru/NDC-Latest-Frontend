import React, { useState, useContext } from "react";
import { Tabs, Tab, Box } from "@mui/material";
import BusinessIcon from "@mui/icons-material/Business";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import CardMembershipIcon from "@mui/icons-material/CardMembership";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import ReceiptIcon from "@mui/icons-material/Receipt";
import AssessmentIcon from "@mui/icons-material/Assessment";
import PaymentIcon from "@mui/icons-material/Payment";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import NoteAltIcon from "@mui/icons-material/NoteAlt"; // Icon for Notes

import CompanyDetails from "./CompanyInfo";
import PaymentInformation from "./Payment";
import Driver from "./Drivers/Driver";
import Certificate from "./Certificate/Certificate";
import Result from "./Result/Result";
import Invoice from "./Invoice/Invoice";
import Document from "./Document/Document";
import Membership from "./Membership";
import Note from "./Notes"; 

import DriverState from "../../../Context/Admin/Customer/Driver/DriverState";
import CertificateState from "../../../Context/Admin/Customer/Certificate/CertificateState";
import InvoiceState from "../../../Context/Admin/Customer/Invoice/InvoiceState";
import ResultState from "../../../Context/Admin/Customer/Result/ResultState";
import DocumentState from "../../../Context/Admin/Customer/Document/DocumentState";
import NoteState from "../../../Context/Admin/Customer/Notes/NoteState"; 

import CustomerContext from "../../../Context/Admin/Customer/CustomerContext";

// ✅ Updated tabData with Notes tab
const tabData = [
  { label: "Company Info", icon: <BusinessIcon />, component: <CompanyDetails /> },
  { label: "Employees", icon: <DirectionsCarIcon />, component: <DriverState><Driver /></DriverState> },
  { label: "Membership", icon: <CardMembershipIcon />, component: <Membership /> },
  { label: "Certificate", icon: <WorkspacePremiumIcon />, component: <CertificateState><Certificate /></CertificateState> },
  { label: "Invoice", icon: <ReceiptIcon />, component: <InvoiceState><Invoice /></InvoiceState> },
  { label: "Result", icon: <AssessmentIcon />, component: <ResultState><Result /></ResultState> },
  { label: "Payment Info", icon: <PaymentIcon />, component: <PaymentInformation /> },
  { label: "Upload Doc", icon: <UploadFileIcon />, component: <DocumentState><Document /></DocumentState> },
  { label: "Notes", icon: <NoteAltIcon />, component: <NoteState><Note /> </NoteState>}
];

function CustomerHeader() {
  const [activeTab, setActiveTab] = useState(0);
  const { currentCompany } = useContext(CustomerContext);

  return (
    <Box>
      {/* Navbar */}
      <Tabs
        value={activeTab}
        onChange={(event, newValue) => setActiveTab(newValue)}
        variant="scrollable"
        scrollButtons="auto"
        sx={{ backgroundColor: "#0a0a42", color: "white" }}
      >
        {tabData.map((tab, index) => (
          <Tab
            key={index}
            label={tab.label}
            icon={tab.icon}
            iconPosition="top"
            sx={{ color: "white" }}
          />
        ))}
      </Tabs>

      {/* Company Name Banner */}
      <div className="text-center">
        <div
          style={{
            width: "100%",
            backgroundColor: "#d4edda",
            color: "#155724",
            border: "2px solid #28a745",
            padding: "10px 20px",
            fontWeight: "bold",
            fontSize: "24px"
          }}
        >
          {currentCompany}
        </div>
      </div>

      {/* Active Tab Component */}
      <Box sx={{ p: 2 }}>
        {tabData[activeTab].component}
      </Box>
    </Box>
  );
}

export default CustomerHeader;
