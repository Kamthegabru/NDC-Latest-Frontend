// "new latest"


import React, { useState, useContext, useEffect, useRef } from "react";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Container,
  Divider,
  Tab,
  Tabs,
  Typography,
  useTheme,
  Fade,
  Paper,
} from "@mui/material";
import { alpha } from "@mui/material/styles";

// Enhanced modern icons
import DomainIcon from "@mui/icons-material/Domain"; // Better for Company
import GroupsIcon from "@mui/icons-material/Groups"; // Better for Employees
import CardMembershipIcon from "@mui/icons-material/CardMembership";
import VerifiedIcon from "@mui/icons-material/Verified"; // Better for Certificate
import DescriptionIcon from "@mui/icons-material/Description"; // Better for Invoice
import InsightsIcon from "@mui/icons-material/Insights"; // Better for Result
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet"; // Better for Payment
import CloudUploadIcon from "@mui/icons-material/CloudUpload"; // Better for Upload
import StickyNote2Icon from "@mui/icons-material/StickyNote2"; // Better for Notes

// Your existing imports
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

const tabData = [
  { label: "Company Info", icon: <DomainIcon />, component: <CompanyDetails /> },
  { label: "Employees", icon: <GroupsIcon />, component: <DriverState><Driver /></DriverState> },
  { label: "Membership", icon: <CardMembershipIcon />, component: <Membership /> },
  { label: "Certificate", icon: <VerifiedIcon />, component: <CertificateState><Certificate /></CertificateState> },
  { label: "Invoice", icon: <DescriptionIcon />, component: <InvoiceState><Invoice /></InvoiceState> },
  { label: "Result", icon: <InsightsIcon />, component: <ResultState><Result /></ResultState> },
  { label: "Payment Info", icon: <AccountBalanceWalletIcon />, component: <PaymentInformation /> },
  { label: "Upload Doc", icon: <CloudUploadIcon />, component: <DocumentState><Document /></DocumentState> },
  { label: "Notes", icon: <StickyNote2Icon />, component: <NoteState><Note /></NoteState> }
];

function CustomerHeader() {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState(0);
  const { currentCompany } = useContext(CustomerContext);
  const tabsRef = useRef(null);

  // Add drag functionality
  useEffect(() => {
    const tabsScroller = document.querySelector('.MuiTabs-scroller');
    if (!tabsScroller) return;

    let isDown = false;
    let startX;
    let scrollLeft;

    const handleMouseDown = (e) => {
      isDown = true;
      startX = e.pageX - tabsScroller.offsetLeft;
      scrollLeft = tabsScroller.scrollLeft;
    };

    const handleMouseLeave = () => {
      isDown = false;
    };

    const handleMouseUp = () => {
      isDown = false;
    };

    const handleMouseMove = (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - tabsScroller.offsetLeft;
      const walk = (x - startX) * 2;
      tabsScroller.scrollLeft = scrollLeft - walk;
    };

    tabsScroller.addEventListener('mousedown', handleMouseDown);
    tabsScroller.addEventListener('mouseleave', handleMouseLeave);
    tabsScroller.addEventListener('mouseup', handleMouseUp);
    tabsScroller.addEventListener('mousemove', handleMouseMove);

    return () => {
      tabsScroller.removeEventListener('mousedown', handleMouseDown);
      tabsScroller.removeEventListener('mouseleave', handleMouseLeave);
      tabsScroller.removeEventListener('mouseup', handleMouseUp);
      tabsScroller.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Company Name Banner */}
      <Paper
        elevation={3}
        sx={{
          mb: 3,
          background: 'linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%)',
          borderRadius: 2,
          overflow: 'hidden',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: 'linear-gradient(90deg, #28a745 0%, #20c997 100%)',
          }
        }}
      >
        <Box
          sx={{
            p: 2.5,
            textAlign: 'center',
          }}
        >
          <Typography
            variant="h4"
            sx={{
              color: '#155724',
              fontWeight: 700,
              letterSpacing: 0.5,
            }}
          >
            {currentCompany}
          </Typography>
        </Box>
      </Paper>

      {/* Main Card with Tabs */}
      <Card
        sx={{
          borderRadius: 3,
          boxShadow: theme.shadows[8],
          overflow: "hidden",
          border: 1,
          borderColor: 'divider',
        }}
      >
        <CardHeader
          title="Customer Information"
          subheader="Navigate through customer data sections"
          sx={{
            background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            color: "white",
            py: 3,
          }}
          subheaderTypographyProps={{
            sx: { color: "rgba(255,255,255,0.9)", pb: 0.5, fontSize: '0.9rem' }
          }}
          titleTypographyProps={{
            sx: { fontWeight: 700, fontSize: '1.4rem' }
          }}
        />

        <Divider />

        {/* Tabs with individual underlines */}
        <Box 
          sx={{ 
            bgcolor: 'background.paper',
            position: 'relative',
          }}
        >
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
            aria-label="scrollable customer tabs"
            TabIndicatorProps={{
              style: { display: 'none' } // Hide default indicator
            }}
            sx={{
              px: 2,
              "& .MuiTabs-scroller": {
                overflowX: 'auto',
                '&::-webkit-scrollbar': {
                  height: 0,
                  display: 'none',
                },
                cursor: 'grab',
                '&:active': {
                  cursor: 'grabbing',
                },
              },
              "& .MuiTab-root": {
                minWidth: 'auto',
                fontWeight: 600,
                mx: 0,
                textTransform: "capitalize",
                py: 2,
                px: 2,
                borderRadius: 2,
                margin: 0.5,
                color: theme.palette.text.secondary,
                transition: 'all 0.2s ease',
                position: 'relative',
                "&::after": {
                  content: '""',
                  position: 'absolute',
                  bottom: 0,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: 0,
                  height: 3,
                  backgroundColor: theme.palette.primary.main,
                  borderRadius: 2,
                  transition: 'width 0.3s ease',
                },
                "&:hover": {
                  bgcolor: alpha(theme.palette.primary.main, 0.08),
                  color: theme.palette.primary.main,
                  transform: 'translateY(-1px)',
                  "&::after": {
                    width: '80%',
                    opacity: 0.5,
                  }
                },
                "&.Mui-selected": {
                  color: theme.palette.primary.main,
                  bgcolor: alpha(theme.palette.primary.main, 0.12),
                  "&::after": {
                    width: '100%',
                    opacity: 1,
                  }
                },
                "& .MuiTab-iconWrapper": {
                  marginRight: theme.spacing(0.75),
                  fontSize: '1.2rem',
                },
              },
              "& .MuiTabs-flexContainer": {
                gap: 1,
              },
            }}
          >
            {tabData.map((tab, index) => (
              <Tab
                key={index}
                icon={tab.icon}
                iconPosition="start"
                label={tab.label}
              />
            ))}
          </Tabs>
        </Box>
      </Card>

      {/* Tab Content Area */}
      <Card
        sx={{
          borderRadius: 3,
          boxShadow: theme.shadows[8],
          overflow: "hidden",
          bgcolor: "background.paper",
          border: 1,
          borderColor: 'divider',
          mt: 3,
        }}
      >
        <CardContent sx={{ p: 3 }}>
          {tabData.map((tab, index) => (
            <Fade
              key={index}
              in={activeTab === index}
              timeout={500}
              unmountOnExit
            >
              <Box
                sx={{
                  display: activeTab === index ? 'block' : 'none',
                  animation: activeTab === index ? 'fadeIn 0.5s ease' : 'none',
                  '@keyframes fadeIn': {
                    from: { opacity: 0, transform: 'translateY(10px)' },
                    to: { opacity: 1, transform: 'translateY(0)' },
                  },
                }}
              >
                {tab.component}
              </Box>
            </Fade>
          ))}
        </CardContent>
      </Card>
    </Container>
  );
}

export default CustomerHeader;