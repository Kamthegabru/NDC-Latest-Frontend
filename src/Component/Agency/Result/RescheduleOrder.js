import React, { useContext, useEffect } from "react";
import {
  Container, Box, Typography, Stepper, Step, StepLabel,
  Paper, Divider, IconButton
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import { Close } from "@mui/icons-material";

import CreateNewOrderContext from "../../../Context/Agency/CreateNewOrder/CreateNewOrderContext";
import CreateNewOrderState from "../../../Context/Agency/CreateNewOrder/CreateNewOrderState";

// agency create-new-order steps
import OrderInformation from "../CreateNewOrder/OrderInformation";
import ParticipantInformation from "../CreateNewOrder/ParticipantInformation";
import ChooseCollectionSite from "../CreateNewOrder/ChooseCollectionSite";
import SubmitOrder from "../CreateNewOrder/SubmitOrder";

const steps = [
  "Order Information",
  "Participant Info",
  "Collection Site",
  "Submit Order",
  "Confirmation",
];

function PrefillBootstrap({ prefill }) {
  const {
    allCompanyData,
    setCompanyId,
    setPackageId,
    setOrderReasonId,
    setDotAgency,
    setFormData,
  } = useContext(CreateNewOrderContext);

  // 1) Seed participant/address/comms immediately
  useEffect(() => {
    if (!prefill) return;

    setFormData((prev) => ({
      ...prev,
      // participant
      firstName: prefill.firstName ?? prev.firstName,
      middleName: prefill.middleName ?? prev.middleName,
      lastName: prefill.lastName ?? prev.lastName,
      ssn: prefill.ssnEid ?? prev.ssn,
      dob: prefill.dob ? new Date(prefill.dob).toISOString().slice(0, 10) : prev.dob,
      phone1: prefill.phone1 ?? prev.phone1,
      phone2: prefill.phone2 ?? prev.phone2,
      observed: prefill.observed ? "1" : "0",
      orderExpires: prefill.orderExpires || prev.orderExpires,

      // address
      address: prefill.addr1 ?? prev.address,
      address2: prefill.addr2 ?? prev.address2,
      city: prefill.city ?? prev.city,
      state: prefill.stateShort ?? prev.state,
      zip: prefill.zip ?? prev.zip,

      // comms
      sendLink: !!prefill.sendSchedulingLink,
      donorPass: !!prefill.sendDonorPass,
      email: prefill.email ?? prev.email,
      ccEmail: prefill.ccEmails ?? prev.ccEmail,
    }));
  }, [prefill, setFormData]);

  // 2) Once handled companies load, select company & seed order meta
  useEffect(() => {
    if (!prefill || !Array.isArray(allCompanyData) || allCompanyData.length === 0) return;

    const norm = (s) => (s || "").toString().trim().toLowerCase();
    const targetName = norm(prefill.companyName);

    const match = allCompanyData.find((c) => norm(c.companyName) === targetName);
    if (match?._id) {
      setCompanyId(match._id);
      if (prefill.packageName) setPackageId(prefill.packageName);
      if (prefill.orderReason) setOrderReasonId(prefill.orderReason);
      if (prefill.dotAgency) setDotAgency(prefill.dotAgency);
    }
  }, [prefill, allCompanyData, setCompanyId, setPackageId, setOrderReasonId, setDotAgency]);

  return null;
}

function RescheduleOrderInner({ prefill }) {
  const { currentPosition } = useContext(CreateNewOrderContext);

  const renderStep = () => {
    switch (currentPosition) {
      case 1:
        return <OrderInformation rescheduleEnabled prefill={prefill} />;
      case 2:
        return <ParticipantInformation rescheduleEnabled prefill={prefill} />;
      case 3:
        return <ChooseCollectionSite rescheduleEnabled prefill={prefill} />;
      case 4:
        return <SubmitOrder rescheduleEnabled prefill={prefill} />;
      default:
        return <OrderInformation rescheduleEnabled prefill={prefill} />;
    }
  };

  const variants = {
    enter: { x: 50, opacity: 0 },
    center: { x: 0, opacity: 1 },
    exit: { x: -50, opacity: 0 },
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        py: { xs: 4, md: 8 },
        background: "#f8f9fa",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Container maxWidth="lg" sx={{ display: "flex", justifyContent: "center" }}>
        <Paper
          elevation={6}
          sx={{
            borderRadius: 4,
            border: "2px solid #d0d0d0",
            p: { xs: 3, md: 5 },
            background: "#fff",
            boxShadow: "0 6px 20px rgba(0,0,0,0.05)",
            width: "100%",
            maxWidth: "900px",
          }}
        >
          <Typography
            variant="h4"
            align="center"
            sx={{ fontWeight: 800, mb: 3, letterSpacing: "0.5px", color: "#093378" }}
          >
            Reschedule Order
          </Typography>

          <Divider sx={{ mb: 4 }} />

          <Stepper
            activeStep={currentPosition - 1}
            alternativeLabel
            sx={{
              mb: 5,
              "& .MuiStepLabel-label": { fontWeight: 600, fontSize: "1rem", color: "#495057" },
              "& .MuiStepIcon-root": { width: 36, height: 36 },
              "& .Mui-active .MuiStepIcon-root": { color: "#093378", transform: "scale(1.15)" },
              "& .Mui-completed .MuiStepIcon-root": { color: "#4caf50" },
            }}
          >
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          <Divider sx={{ mb: 4 }} />

          {/* Prefill bootstrapper */}
          <PrefillBootstrap prefill={prefill} />

          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={currentPosition}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.5, ease: "easeInOut" }}
            >
              {renderStep()}
            </motion.div>
          </AnimatePresence>
        </Paper>
      </Container>
    </Box>
  );
}

export default function RescheduleOrder({ prefill, onRescheduleSuccess, onClose }) {
  return (
    <CreateNewOrderState
      rescheduleEnabled
      initialPrefill={prefill}
      onRescheduleSuccess={onRescheduleSuccess}
      onClose={onClose}
    >
      <RescheduleOrderInner prefill={prefill} />
    </CreateNewOrderState>
  );
}
