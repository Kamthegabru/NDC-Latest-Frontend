import React, { useState, useContext, useEffect } from "react";
import {
  Box, Card, CardContent, Typography, Grid, useMediaQuery, CircularProgress, Chip
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import CustomerContext from "../../../Context/Agency/Customer/CustomerContext";

const MembershipInformation = () => {
  const { userDetails } = useContext(CustomerContext);
  const [membershipInfo, setMembershipInfo] = useState({});
  const [loading, setLoading] = useState(true);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    if (userDetails?.Membership) {
      setMembershipInfo(userDetails.Membership);
      setLoading(false);
    }
  }, [userDetails]);

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return isNaN(date.getTime()) ? "N/A" : date.toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric"
    });
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: "100px", px: 2 }}>
      <Card sx={{ width: isMobile ? "100%" : 600, p: 3, position: "relative", borderRadius: 3, boxShadow: 3 }}>
        <CardContent>
          <Typography variant="h5" sx={{ mb: 3, fontWeight: "bold", color: "primary.main" }}>
            Membership Information
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" sx={{ fontWeight: "bold", color: "grey.700" }}>Current Plan:</Typography>
              <Typography variant="body1" sx={{ fontWeight: 700, color: "#003366" }}>
                {membershipInfo.planName || "N/A"}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" sx={{ fontWeight: "bold", color: "grey.700" }}>Join Date:</Typography>
              <Typography variant="body1" sx={{ fontWeight: 700, color: "#003366" }}>
                {membershipInfo.planStartDate ? formatDate(membershipInfo.planStartDate) : "N/A"}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" sx={{ fontWeight: "bold", color: "grey.700" }}>Expiry Date:</Typography>
              <Typography variant="body1" sx={{ fontWeight: 700, color: "#003366" }}>
                {membershipInfo.planEndDate ? formatDate(membershipInfo.planEndDate) : "N/A"}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" sx={{ fontWeight: "bold", color: "grey.700" }}>Status:</Typography>
              <Typography variant="body1" sx={{ fontWeight: 700, color: membershipInfo.planStatus === "Active" ? "green" : "red" }}>
                {membershipInfo.planStatus || "N/A"}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" sx={{ fontWeight: "bold", color: "grey.700" }}>OrgId:</Typography>
              <Typography variant="body1" sx={{ fontWeight: 700, color: "#003366" }}>
                {membershipInfo.orgId || "N/A"}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" sx={{ fontWeight: "bold", color: "grey.700" }}>Location Code:</Typography>
              <Typography variant="body1" sx={{ fontWeight: 700, color: "#003366" }}>
                {membershipInfo.locationCode || "N/A"}
              </Typography>
            </Grid>

            {/* Packages Section with Chips */}
            <Grid item xs={12}>
              <Typography variant="subtitle2" sx={{ fontWeight: "bold", color: "grey.700" }}>Packages:</Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1 }}>
                {membershipInfo.package?.length > 0 ? (
                  membershipInfo.package.map((pkg, index) => (
                    <Chip
                      key={index}
                      label={pkg.package_name}
                      variant="outlined"
                      sx={{ borderColor: '#003366', color: '#003366', fontWeight: 'bold' }}
                    />
                  ))
                ) : (
                  <Typography variant="body2" color="text.secondary">N/A</Typography>
                )}
              </Box>
            </Grid>

            {/* Reason Names Section with Chips */}
            <Grid item xs={12}>
              <Typography variant="subtitle2" sx={{ fontWeight: "bold", color: "grey.700" }}>Reason Names:</Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1 }}>
                {membershipInfo.order_reason?.length > 0 ? (
                  membershipInfo.order_reason.map((reason, index) => (
                    <Chip
                      key={index}
                      label={reason.order_reason_name}
                      variant="outlined"
                      sx={{ borderColor: '#003366', color: '#003366', fontWeight: 'bold' }}
                    />
                  ))
                ) : (
                  <Typography variant="body2" color="text.secondary">N/A</Typography>
                )}
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default MembershipInformation;
