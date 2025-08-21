import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Avatar,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import GroupIcon from "@mui/icons-material/Group";
import StoreIcon from "@mui/icons-material/Store";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import axios from "axios";
import Cookies from "js-cookie";
import Result from "./Result/Result"

const API_URL = process.env.REACT_APP_API_URL;

const GradientCard = styled(Card)(({ theme }) => ({
  background: theme.palette.background.paper,
  borderRadius: 20,
  boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
  transition: "transform 0.3s ease",
  "&:hover": {
    transform: "translateY(-5px)",
  },
}));


const Welcome = () => {
  const [counts, setCounts] = useState({
    totalCustomers: 0,
    activeCustomers: 0,
    totalDrivers: 0,
    totalAgencies: 0,
  });

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const token = Cookies.get("token");
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        const res = await axios.get(`${API_URL}/agency/getCustomerAndAgencyCount`);
        setCounts(res.data);
      } catch (err) {
        console.error("Failed to fetch dashboard counts:", err);
      }
    };

    fetchCounts();
  }, []);

  const metrics = [
    {
      icon: <FolderOpenIcon />,
      title: "Total companies",
      value: counts.totalCustomers,
    },
    {
      icon: <GroupIcon />,
      title: "Total Test scheduled",
      value: counts.activeCustomers,
    },
    {
      icon: <StoreIcon />,
      title: "Total Drivers",
      value: counts.totalDrivers,
    },
  ];

  return (
    <Box sx={{ width: "100%", maxWidth: "100%", ml: 0, mr: "auto", p: 3 }}>
      <Typography
        variant="h4"
        gutterBottom
        sx={{
          mb: 5,
          textAlign: "center",
          fontWeight: 600,
          color: "white",
          backgroundColor: "#0a0a42",
          p: 2,
          borderRadius: 1,
        }}
      >
        NDC Agency Dashboard
      </Typography>

      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <Grid container spacing={4} justifyContent="center" maxWidth="md">
          {metrics.map((metric, idx) => (
            <Grid item xs={12} sm={6} md={4} key={idx}>
              <GradientCard>
                <CardContent>
                  <Box display="flex" alignItems="center" gap={2}>
                    <Avatar sx={{ bgcolor: "#000000" }}>{metric.icon}</Avatar>
                    <Box>
                      <Typography color="text.secondary" variant="subtitle2">
                        {metric.title}
                      </Typography>
                      <Typography variant="h5" sx={{ fontWeight: 600 }}>
                        {metric.value}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </GradientCard>
            </Grid>
          ))}
        </Grid>
      </Box>
      <Result/>
    </Box>
  );
};

export default Welcome;
