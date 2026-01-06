import React, { useEffect, useState, useContext, useMemo } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  alpha,
} from "@mui/material";
import { useTheme } from '@mui/material/styles';
import GroupIcon from "@mui/icons-material/Group";
import StoreIcon from "@mui/icons-material/Store";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import axios from "axios";
import Cookies from "js-cookie";
import Result from "./Result/Result";
import AdminContext from "../../Context/Agency/AgencyContext";

const API_URL = process.env.REACT_APP_API_URL;

// Utility functions
const fNumber = (number) => {
  return new Intl.NumberFormat().format(number);
};

const fPercent = (number) => {
  return `${number}%`;
};

const fShortenNumber = (number) => {
  if (number >= 1000000) {
    return `${(number / 1000000).toFixed(1)}M`;
  }
  if (number >= 1000) {
    return `${(number / 1000).toFixed(1)}K`;
  }
  return fNumber(number);
};

// Simple line chart component using CSS
const MiniChart = ({ data, color }) => {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min;
  
  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * 84;
    const y = range === 0 ? 28 : 56 - ((value - min) / range) * 56;
    return `${x},${y}`;
  }).join(' ');

  return (
    <Box sx={{ width: 84, height: 56, position: 'relative' }}>
      <svg width="84" height="56" style={{ display: 'block' }}>
        <polyline
          fill="none"
          stroke={color}
          strokeWidth="2"
          points={points}
          style={{
            filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.1))'
          }}
        />
        {data.map((value, index) => {
          const x = (index / (data.length - 1)) * 84;
          const y = range === 0 ? 28 : 56 - ((value - min) / range) * 56;
          return (
            <circle
              key={index}
              cx={x}
              cy={y}
              r="2"
              fill={color}
            />
          );
        })}
      </svg>
    </Box>
  );
};

// New DashboardCard component based on reference design
function DashboardCard({
  icon,
  title,
  total,
  chart,
  percent,
  color = 'primary',
  ...other
}) {
  const theme = useTheme();

  const renderTrending = () => (
    <Box
      sx={{
        top: 16,
        gap: 0.5,
        right: 16,
        display: 'flex',
        position: 'absolute',
        alignItems: 'center',
        color: percent >= 0 ? 'success.main' : 'error.main',
      }}
    >
      {percent < 0 ? (
        <TrendingDownIcon sx={{ width: 20, height: 20 }} />
      ) : (
        <TrendingUpIcon sx={{ width: 20, height: 20 }} />
      )}
      <Box component="span" sx={{ typography: 'subtitle2', fontWeight: 600 }}>
        {percent > 0 && '+'}
        {fPercent(percent)}
      </Box>
    </Box>
  );

  return (
    <Card
      sx={{
        p: 3,
        boxShadow: 'none',
        position: 'relative',
        color: `${color}.darker`,
        backgroundColor: 'common.white',
        backgroundImage: `linear-gradient(135deg, ${alpha(theme.palette[color].light, 0.48)}, ${alpha(theme.palette[color].main, 0.48)})`,
        border: `1px solid ${alpha(theme.palette[color].main, 0.12)}`,
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: `0 12px 24px ${alpha(theme.palette[color].main, 0.15)}`,
        },
        ...other.sx,
      }}
      {...other}
    >
      <Box sx={{ width: 48, height: 48, mb: 3, color: `${color}.main` }}>
        {icon}
      </Box>

      {renderTrending()}

      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'flex-end',
          justifyContent: 'flex-end',
        }}
      >
        <Box sx={{ flexGrow: 1, minWidth: 112 }}>
          <Box sx={{ 
            mb: 1, 
            typography: 'subtitle2',
            color: 'text.secondary',
            fontWeight: 500,
          }}>
            {title}
          </Box>

          <Box sx={{ 
            typography: 'h4',
            fontWeight: 700,
            color: 'text.primary',
          }}>
            {fShortenNumber(total)}
          </Box>
        </Box>

        <MiniChart 
          data={chart.series} 
          color={theme.palette[color].main}
        />
      </Box>

      {/* Background decoration */}
      <Box
        sx={{
          top: 0,
          left: -20,
          width: 240,
          zIndex: -1,
          height: 240,
          opacity: 0.1,
          position: 'absolute',
          background: `radial-gradient(circle, ${theme.palette[color].main} 0%, transparent 70%)`,
        }}
      />
    </Card>
  );
}

const Welcome = () => {
  const adminContext = useContext(AdminContext);
  const { AllUserData, getAllUserData } = adminContext || {};

  const [counts, setCounts] = useState({
    totalCustomers: 0,
    activeCustomers: 0,
    activeDrivers: 0,
    totalAgencies: 0,
  });

  // Calculate total drivers from customer data
  const totalDriversFromCustomers = useMemo(() => {
    if (!AllUserData || !Array.isArray(AllUserData)) return 0;
    
    return AllUserData.reduce((total, user) => {
      const driverCount = 
        parseInt(user.companyInfoData?.employees) || 
        parseInt(user.companyInfoData?.driverCount) || 
        parseInt(user.activeDriversCount) || 0;
      
      return total + driverCount;
    }, 0);
  }, [AllUserData]);

  // Debug: Log the current counts state and customer data
  console.log("Current counts state:", counts);
  console.log("AllUserData:", AllUserData);
  console.log("Calculated total drivers:", totalDriversFromCustomers);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = Cookies.get("token");
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        
        // Fetch dashboard counts and all users from API
        const [countsRes, allUsersRes] = await Promise.all([
          axios.get(`${API_URL}/agency/getCustomerAndAgencyCount`),
          axios.get(`${API_URL}/agency/getAllUser`)
        ]);
        
        console.log("API Response:", countsRes.data);
        console.log("Available keys:", Object.keys(countsRes.data));
        console.log("All Users:", allUsersRes.data);
        
        // Calculate active drivers from all users
        const activeDriversCount = allUsersRes.data.reduce((total, user) => {
          const driverCount = 
            parseInt(user.companyInfoData?.employees) || 
            parseInt(user.companyInfoData?.driverCount) || 
            parseInt(user.activeDriversCount) || 0;
          return total + driverCount;
        }, 0);
        
        setCounts({ ...countsRes.data, activeDrivers: activeDriversCount });
        
        // Also fetch all user data for driver count calculation
        if (getAllUserData && adminContext) {
          await getAllUserData();
        }
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
      }
    };

    if (adminContext) {
      fetchData();
    }
  }, [adminContext, getAllUserData]);

  // Sample chart data - you can replace this with real data
  const generateChartData = () => [10, 15, 12, 18, 20, 25, 22, 30];

  const metrics = [
    {
      icon: <FolderOpenIcon sx={{ fontSize: 28, color: 'inherit' }} />,
      title: "Total companies",
      total: counts.totalCustomers,
      color: 'primary',
      percent: 15.2,
      chart: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
        series: generateChartData(),
      },
    },
    {
      icon: <GroupIcon sx={{ fontSize: 28, color: 'inherit' }} />,
      title: "Total Test scheduled",
      total: counts.activeCustomers,
      color: 'success',
      percent: 8.7,
      chart: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
        series: generateChartData(),
      },
    },
    {
      icon: <StoreIcon sx={{ fontSize: 28, color: 'inherit' }} />,
      title: "Total Drivers",
      total: counts.activeDrivers || 0,
      color: 'warning',
      percent: -2.5,
      chart: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
        series: generateChartData(),
      },
    },
  ];

  console.log('Agency Dashboard - counts:', counts);
  console.log('Agency Dashboard - activeDrivers:', counts.activeDrivers);

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
        <Grid container spacing={4} justifyContent="center" maxWidth="lg">
          {metrics.map((metric, idx) => (
            <Grid item xs={12} sm={6} md={4} key={idx}>
              <DashboardCard
                icon={metric.icon}
                title={metric.title}
                total={metric.total}
                percent={metric.percent}
                color={metric.color}
                chart={metric.chart}
              />
            </Grid>
          ))}
        </Grid>
      </Box>
      <Result/>
    </Box>
  );
};

export default Welcome;