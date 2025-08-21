import React, { useContext, useEffect, useState } from "react";
import { Box, Typography, Button } from "@mui/material";

import SignupContext from "../../../../Context/ClientSide/SignUp/SignupContext";

function Membership() {
  const {
    currentPosition,
    maxPosition,
    selectedPlan,
    setCurrentPosition,
    setMaxPosition,
  } = useContext(SignupContext);
  const [price, setPrice] = useState(99);
  useEffect(() => {
    if (selectedPlan === 1) {
      setPrice(99);
    } else if (selectedPlan === 2) {
      setPrice(150);
    } else {
      setPrice(275);
    }
  }, [selectedPlan]);
  const handleNext = () => {
    if (currentPosition === maxPosition) {
      setMaxPosition(maxPosition + 1);
    }
    setCurrentPosition(currentPosition + 1);
  };

  return (
    <Box
      sx={{
        width: "100%",
        mx: "auto",
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      <Typography variant="h6" fontWeight="bold">
        Membership Information
      </Typography>

      <Typography variant="body1">
        Your selected membership information is below:
      </Typography>

      <Typography variant="body1">
        <strong>Your Selected Plan is </strong>
        <Typography component="span" sx={{ color: "blue", fontWeight: "bold" }}>
          {selectedPlan === 1
            ? "NON-DOT Account"
            : selectedPlan === 2
            ? "1 Year Random Enrollment"
            : selectedPlan === 3
            ? "3 Year Random Enrollment"
            : ""}
        </Typography>
      </Typography>

      <Typography variant="body1">
        <strong>Price of your selected package is </strong>
        <Typography component="span" sx={{ color: "blue", fontWeight: "bold" }}>
          ${price}
        </Typography>
      </Typography>

      <Button
        variant="contained"
        sx={{
          alignSelf: "flex-end",
          backgroundColor: "#003366",
          color: "#fff",
        }}
        onClick={handleNext}
      >
        Next
      </Button>
    </Box>
  );
}

export default Membership;
