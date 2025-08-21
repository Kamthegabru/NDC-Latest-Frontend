import React, { useEffect, useState } from "react";
import {
  Box, Typography, Card, CardContent, Grid, Avatar, Skeleton
} from "@mui/material";
import { styled } from "@mui/material/styles";
import GroupIcon from "@mui/icons-material/Group";
import StoreIcon from "@mui/icons-material/Store";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import axios from "axios";
import Cookies from "js-cookie";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, Legend
} from "recharts";

const API_URL = process.env.REACT_APP_API_URL;

// In-memory cache (survives tab changes but not full reload)
let dashboardCache = null;

const GradientCard = styled(Card)(({ theme }) => ({
  borderRadius: 20,
  boxShadow: theme.shadows[6],
  background: theme.palette.background.paper,
  transition: "transform 0.25s ease, box-shadow 0.25s ease",
  "&:hover": {
    transform: "translateY(-6px)",
    boxShadow: theme.shadows[10],
  },
}));

const ChartBox = styled(Box)(({ theme, bgcolor }) => ({
  borderRadius: 20,
  padding: theme.spacing(3),
  height: 340,
  background: bgcolor,
  color: "#fff",
  boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
  transition: "transform 0.3s ease",
  "&:hover": {
    transform: "translateY(-5px)",
  },
}));

const Welcome = () => {
  const [counts, setCounts] = useState({});
  const [userData, setUserData] = useState([]);
  const [testScheduleData, setTestScheduleData] = useState([]);
  const [websiteVisits, setWebsiteVisits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cached = dashboardCache || JSON.parse(sessionStorage.getItem("dashboardData"));

    if (cached) {
      // Load from cache
      setCounts(cached.counts);
      setUserData(cached.userData);
      setTestScheduleData(cached.testScheduleData);
      setWebsiteVisits(cached.websiteVisits);
      setLoading(false);
      return;
    }

    const token = Cookies.get("token");
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    Promise.all([
      axios.get(`${API_URL}/admin/getCustomerAndAgencyCount`),
      axios.get(`${API_URL}/admin/getUserCountsLast6Months`),
      axios.get(`${API_URL}/admin/getMonthlyTestScheduleStats`),
      axios.get(`${API_URL}/admin/getWebsiteVisitsLast6Months`),
    ])
      .then(([countsRes, usersRes, testsRes, visitsRes]) => {
        const newData = {
          counts: countsRes.data,
          userData: usersRes.data.data.map((d) => ({
            name: `${d.month} ${d.year}`,
            count: d.count,
          })),
          testScheduleData: testsRes.data,
          websiteVisits: visitsRes.data.data.map((d) => ({
            name: d.name,
            count: d.count,
          })),
        };

        // Save in both in-memory and sessionStorage
        dashboardCache = newData;
        sessionStorage.setItem("dashboardData", JSON.stringify(newData));

        setCounts(newData.counts);
        setUserData(newData.userData);
        setTestScheduleData(newData.testScheduleData);
        setWebsiteVisits(newData.websiteVisits);
      })
      .catch((err) => console.error("Dashboard load error:", err))
      .finally(() => setLoading(false));
  }, []);

  const metrics = [
    { icon: <FolderOpenIcon />, title: "Today Customers", value: counts.totalCustomers, color: "#1976d2" },
    { icon: <GroupIcon />, title: "Active Customers", value: counts.activeCustomers, color: "#4caf50" },
    { icon: <StoreIcon />, title: "Total Drivers", value: counts.totalDrivers, color: "#ff9800" },
    { icon: <PersonAddAltIcon />, title: "Agency's", value: counts.totalAgencies, color: "#9c27b0" },
  ];

  return (
    <Box sx={{ width: "100%", p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{
        textAlign: "center",
        fontWeight: 700,
        backgroundColor: "#0a0a42",
        color: "#fff",
        p: 2,
        borderRadius: 2,
      }}>
        NDC Dashboard
      </Typography>

      <Grid container spacing={4} sx={{ mt: 2 }}>
        {loading
          ? Array.from(new Array(4)).map((_, idx) => (
              <Grid item xs={12} sm={6} md={3} key={idx}>
                <Skeleton variant="rounded" height={100} animation="wave" sx={{ borderRadius: 3 }} />
              </Grid>
            ))
          : metrics.map((metric, idx) => (
              <Grid item xs={12} sm={6} md={3} key={idx}>
                <GradientCard>
                  <CardContent>
                    <Box display="flex" alignItems="center" gap={2}>
                      <Avatar sx={{ bgcolor: metric.color }}>{metric.icon}</Avatar>
                      <Box>
                        <Typography color="text.secondary" variant="subtitle2">{metric.title}</Typography>
                        <Typography variant="h5" sx={{ fontWeight: 600 }}>{metric.value ?? 0}</Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </GradientCard>
              </Grid>
            ))}
      </Grid>

      {/* Charts */}
      <Grid container spacing={4} sx={{ mt: 4 }}>
        {loading
          ? Array.from(new Array(3)).map((_, idx) => (
              <Grid item xs={12} md={4} key={idx}>
                <Skeleton variant="rounded" height={340} animation="wave" sx={{ borderRadius: 3 }} />
              </Grid>
            ))
          : (
            <>
              <Grid item xs={12} md={4}>
                <ChartBox bgcolor="#2196f3">
                  <Typography variant="h6" fontWeight={600}>Website Views</Typography>
                  <Typography variant="body2" sx={{ mb: 2 }}>Visits (Last 6 months)</Typography>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={websiteVisits}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.2)" />
                      <XAxis dataKey="name" stroke="#fff" />
                      <YAxis stroke="#fff" />
                      <Tooltip contentStyle={{ borderRadius: 8 }} />
                      <Bar dataKey="count" fill="url(#colorBlue)" radius={[8, 8, 0, 0]} />
                      <defs>
                        <linearGradient id="colorBlue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#ffffff" stopOpacity={0.9} />
                          <stop offset="95%" stopColor="#bbdefb" stopOpacity={0.6} />
                        </linearGradient>
                      </defs>
                    </BarChart>
                  </ResponsiveContainer>
                </ChartBox>
              </Grid>

              <Grid item xs={12} md={4}>
                <ChartBox bgcolor="#4caf50">
                  <Typography variant="h6" fontWeight={600}>New Users</Typography>
                  <Typography variant="body2" sx={{ mb: 2 }}>Last 6 months</Typography>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={userData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.2)" />
                      <XAxis dataKey="name" stroke="#fff" />
                      <YAxis stroke="#fff" />
                      <Tooltip contentStyle={{ borderRadius: 8 }} />
                      <Bar dataKey="count" fill="url(#colorGreen)" radius={[8, 8, 0, 0]} />
                      <defs>
                        <linearGradient id="colorGreen" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#ffffff" stopOpacity={0.9} />
                          <stop offset="95%" stopColor="#c8e6c9" stopOpacity={0.6} />
                        </linearGradient>
                      </defs>
                      
                    </BarChart>
                  </ResponsiveContainer>
                </ChartBox>
              </Grid>

              <Grid item xs={12} md={4}>
                <ChartBox bgcolor="#000">
                  <Typography variant="h6" fontWeight={600}>Test Scheduled</Typography>
                  <Typography variant="body2" sx={{ mb: 2 }}>Random vs Other</Typography>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={testScheduleData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.2)" />
                      <XAxis dataKey="name" stroke="#fff" />
                      <YAxis stroke="#fff" />
                      <Tooltip contentStyle={{ borderRadius: 8 }} />
                      <Legend />  
                      <Bar dataKey="random" stackId="a" fill="#1976d2" radius={[8, 8, 0, 0]} />
                      <Bar dataKey="other" stackId="a" fill="#fbc02d" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartBox>
              </Grid>
            </>
          )}
      </Grid>
    </Box>
  );
};

export default Welcome;
