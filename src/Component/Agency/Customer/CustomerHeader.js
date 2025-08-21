import React, { useState, useContext } from "react";
import { Tabs, Tab, Box } from "@mui/material";
import BusinessIcon from "@mui/icons-material/Business";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import CardMembershipIcon from "@mui/icons-material/CardMembership";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import ReceiptIcon from "@mui/icons-material/Receipt";
import AssessmentIcon from "@mui/icons-material/Assessment";
import PaymentIcon from "@mui/icons-material/Payment";
import { Shuffle } from "@mui/icons-material";

import CompanyDetails from "./CompanyInfo";
import PaymentInformation from "./Payment";
import Driver from "./Drivers/Driver"
import Certificate from "./Certificate/Certificate";
import Result from "./Result/Result";
import Invoice from "./Invoice/Invoice";
import Membership from "./Membership"
import RandomDriver from "./Random/RandomDriver"

import DriverState from "../../../Context/Agency/Customer/Driver/DriverState";
import CustomerContext from "../../../Context/Agency/Customer/CustomerContext";

const tabData = [
  { label: "Company Info", icon: <BusinessIcon />, component: <CompanyDetails /> },
  { label: "Driver", icon: <DirectionsCarIcon />, component: <DriverState><Driver /></DriverState> },
  { label: "Membership", icon: <CardMembershipIcon />, component: <Membership /> },
  { label: "Certificate", icon: <WorkspacePremiumIcon />, component: <Certificate />},
  { label: "Invoice", icon: <ReceiptIcon />, component: <Invoice />  },
  { label: "Result", icon: <AssessmentIcon />, component: <Result /> },
  { label: "Payment Info", icon: <PaymentIcon />, component: <PaymentInformation /> },
  { label: "Random Driver", icon: <Shuffle />, component: <RandomDriver /> },
];

function CustomerHeader() {
  const [activeTab, setActiveTab] = useState(0);
  const { currentCompany } = useContext(CustomerContext)

  return (
    <Box>
      {/* Navbar */}
      <Tabs
        value={activeTab}
        onChange={(event, newValue) => setActiveTab(newValue)} // <-- This updates the active tab
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
      <div className="text-center">
        <div
          style={{
            width: ' 100%',
            backgroundColor: "#d4edda", // light green
            color: "#155724",           // dark green text
            border: "2px solid #28a745",
            padding: "10px 20px",
            fontWeight: "bold",
            fontSize: "24px"
          }}
        >
          {currentCompany}
        </div>
      </div>
      {/* Render Active Component */}
      <Box sx={{ p: 2 }}>
        {tabData[activeTab].component}
      </Box>
    </Box>
  );
}

export default CustomerHeader;
