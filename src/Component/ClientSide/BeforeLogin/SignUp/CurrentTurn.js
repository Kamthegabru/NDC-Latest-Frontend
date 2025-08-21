import React, { useContext } from "react";
import { Box } from "@mui/material";

import SignupContext from "../../../../Context/ClientSide/SignUp/SignupContext";

function CurrentTurn() {
    const { currentPosition, maxPosition, setCurrentPosition} = useContext(SignupContext)
    const totalForms = 5;
    const handleFormClick = (position) => {
        if (position <= maxPosition) {
            setCurrentPosition(position);
        }
    };
    return (
        <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mt: 3 }}>
            {[...Array(totalForms)].map((_, index) => {
                const position = index + 1;
                let bgColor = "#ccc"; // Default Grey
                if (position <= maxPosition) bgColor = "green"; // Completed Forms
                if (position === currentPosition) bgColor = "#003366"; // Current Form

                return (
                    <Box
                        key={position}
                        sx={{
                            width: 40,
                            height: 40,
                            borderRadius: "50%",
                            backgroundColor: bgColor,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: position <= maxPosition ? "pointer" : "not-allowed",
                            color: "white",
                            fontWeight: "bold",
                            fontSize: "1.2rem"
                        }}
                        onClick={() => handleFormClick(position)}
                    >
                        {position}
                    </Box>
                );
            })}
        </Box>
    );
}

export default CurrentTurn;
