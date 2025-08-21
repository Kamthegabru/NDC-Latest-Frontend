import React, { useContext } from "react";
import {
  Container,
  Box,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Paper,
  Divider,
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import CreateNewOrderContext from "../../../Context/Admin/CreateNewOrder/CreateNewOrderContext";

import OrderInformation from "./OrderInformation";
import ParticipantInformation from "./ParticipantInformation";
import ChooseCollectionSite from "./ChooseCollectionSite";
import SubmitOrder from "./SubmitOrder";

const steps = [
  "Order Information",
  "Participant Info",
  "Collection Site",
  "Submit Order",
  "Confirmation",
];

export default function CreateNewOrder() {
  const { currentPosition } = useContext(CreateNewOrderContext);

  const renderStep = () => {
    switch (currentPosition) {
      case 1:
        return <OrderInformation />;
      case 2:
        return <ParticipantInformation />;
      case 3:
        return <ChooseCollectionSite />;
      case 4:
        return <SubmitOrder />;
      default:
        return <OrderInformation />;
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
            maxWidth: "900px", // Middle size
          }}
        >
          {/* Title */}
          <Typography
            variant="h4"
            align="center"
            sx={{
              fontWeight: 800,
              mb: 3,
              letterSpacing: "0.5px",
              color: "#093378",
            }}
          >
            Create New Order
          </Typography>

          <Divider sx={{ mb: 4 }} />

          {/* Stepper */}
          <Stepper
            activeStep={currentPosition - 1}
            alternativeLabel
            sx={{
              mb: 5,
              "& .MuiStepLabel-label": {
                fontWeight: 600,
                fontSize: "1rem",
                color: "#495057",
              },
              "& .MuiStepIcon-root": {
                width: 36,
                height: 36,
              },
              "& .Mui-active .MuiStepIcon-root": {
                color: "#093378",
                transform: "scale(1.15)",
                transition: "0.3s ease",
              },
              "& .Mui-completed .MuiStepIcon-root": {
                color: "#4caf50",
              },
            }}
          >
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          <Divider sx={{ mb: 4 }} />

          {/* Info text */}
          <Typography
            variant="body1"
            align="center"
            sx={{
              fontWeight: "bold",
              my: 3,
              mx: 1,
              color: "#6c757d",
            }}
          >
            All fields marked with * are required.
          </Typography>

          <Divider sx={{ mb: 4 }} />

          {/* Animated Step Content */}
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
