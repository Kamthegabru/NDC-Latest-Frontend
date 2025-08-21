import React, { useContext } from "react";
import { Container, Box, Typography } from "@mui/material";
import CurrentTurn from "./CurrentTurn";
import ContactInfo from "./ContactInfo";
import CompanyInfo from "./CompanyInfo";
import Membership from "./Membership";
import Payment from "./Payment";
import Submit from "./Submit";

import SignupContext from "../../../../Context/ClientSide/SignUp/SignupContext";

function SignUp() {
    const { currentPosition } = useContext(SignupContext);

    // Function to render the component based on `currentPosition`
    const renderStep = () => {
        switch (currentPosition) {
            case 1:
                return <ContactInfo />;
            case 2:
                return <CompanyInfo />;
            case 3:
                return <Membership />;
            case 4:
                return <Payment />;
            case 5:
                    return <Submit />;
            default:
                return <ContactInfo />; // Default to first step
        }
    };

    return (
        <Box sx={{ marginTop: '90px', paddingTop: '60px', minHeight: `calc(100vh - 220px)`,marginBottom: '50px' }}>
            <Container maxWidth="md" sx={{ p: 3, border: "3px solid #ccc", borderRadius: 2 }}>
                <Typography variant="h4" align="center" sx={{ fontWeight: 900, color: 'rgba(9,51,120,1)' }} gutterBottom>
                    New Client Sign-Up Form
                </Typography>
                <Typography variant="body1" align="center">
                    Please carefully read applicant terms, information must be complete. This will allow NDC Billing Department to provide
                    proper service. *All Invoices are due upon receipt. Any late charges incurred may not be waived and are to be paid in full.
                </Typography>
                <hr />
                <CurrentTurn />
                <p className="text-center" style={{ margin: "30px 10px" }}><b>All fields marked with * are required and must be filled.</b></p>

                {/* Renders the correct step based on `currentPosition` */}
                {renderStep()}
            </Container>
        </Box>
    );
}

export default SignUp;
