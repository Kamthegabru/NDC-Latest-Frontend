import React, { useContext, useMemo } from "react";
import {
  Box, Card, CardContent, Typography, Grid, Avatar, Chip, Stack,
  LinearProgress, Divider, useMediaQuery, Paper, IconButton
} from "@mui/material";
import { useTheme, alpha } from "@mui/material/styles";

// Icons
import BusinessIcon from "@mui/icons-material/Business";
import PeopleIcon from "@mui/icons-material/People";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import AssignmentIcon from "@mui/icons-material/Assignment";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import WarningIcon from "@mui/icons-material/Warning";
import PersonOffIcon from "@mui/icons-material/PersonOff";
import ScienceIcon from "@mui/icons-material/Science";
import PendingIcon from "@mui/icons-material/Pending";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";

import HomeContext from "../../../Context/ClientSide/AfterLogin/Home/HomeContext";

// Stat Card Component
const StatCard = ({ title, value, icon, color = "primary", subtitle, trend, progress }) => {
  const theme = useTheme();
  
  return (
    <Card sx={{ 
      borderRadius: 3, 
      border: 1, 
      borderColor: 'divider',
      height: '100%',
      transition: 'all 0.2s ease',
      '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: theme.shadows[4]
      }
    }}>
      <CardContent sx={{ p: 3 }}>
        <Stack spacing={2}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar sx={{ 
              bgcolor: alpha(theme.palette[color].main, 0.1),
              color: `${color}.main`,
              width: 48,
              height: 48
            }}>
              {icon}
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h4" sx={{ 
                fontWeight: 700,
                color: `${color}.main`,
                lineHeight: 1
              }}>
                {value}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ 
                fontWeight: 500,
                textTransform: 'uppercase',
                letterSpacing: 0.5
              }}>
                {title}
              </Typography>
            </Box>
          </Stack>
          
          {subtitle && (
            <Typography variant="body2" color="text.secondary">
              {subtitle}
            </Typography>
          )}
          
          {progress !== undefined && (
            <Box>
              <LinearProgress 
                variant="determinate" 
                value={progress} 
                sx={{ 
                  borderRadius: 1,
                  height: 6,
                  bgcolor: alpha(theme.palette[color].main, 0.1),
                  '& .MuiLinearProgress-bar': {
                    bgcolor: `${color}.main`
                  }
                }}
              />
              <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                {progress}% of total
              </Typography>
            </Box>
          )}
          
          {trend && (
            <Chip
              size="small"
              label={trend}
              color={trend.includes('↑') ? 'success' : trend.includes('↓') ? 'error' : 'default'}
              sx={{ alignSelf: 'flex-start', fontSize: '0.75rem' }}
            />
          )}
        </Stack>
      </CardContent>
    </Card>
  );
};

// Quick Info Card Component
const QuickInfoCard = ({ title, items, color = "primary" }) => {
  return (
    <Card sx={{ 
      borderRadius: 3, 
      border: 1, 
      borderColor: 'divider',
      height: '100%'
    }}>
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ 
          fontWeight: 600, 
          mb: 2,
          color: `${color}.main`
        }}>
          {title}
        </Typography>
        <Stack spacing={1.5}>
          {items.map((item, index) => (
            <Stack key={index} direction="row" spacing={2} alignItems="center">
              <Avatar sx={{ 
                width: 32, 
                height: 32,
                bgcolor: alpha(item.color || 'grey', 0.1),
                color: item.color || 'grey'
              }}>
                {item.icon}
              </Avatar>
              <Box sx={{ flex: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {item.label}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {item.value}
                </Typography>
              </Box>
            </Stack>
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
};

const UserOverview = () => {
  const { userData } = useContext(HomeContext);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Calculate statistics from context data
  const stats = useMemo(() => {
    if (!userData) return null;

    // Driver statistics
    const drivers = userData.drivers || [];
    const activeDrivers = drivers.filter(d => !d.isDeleted && d.isActive);
    const deletedDrivers = drivers.filter(d => d.isDeleted);
    
    // Results statistics
    const results = userData.results || [];
    const positiveResults = results.filter(r => r.resultStatus?.toLowerCase() === 'positive');
    const negativeResults = results.filter(r => r.resultStatus?.toLowerCase() === 'negative');
    const pendingResults = results.filter(r => r.resultStatus?.toLowerCase() === 'pending');
    const completedOrders = results.filter(r => r.orderStatus?.toLowerCase() === 'completed');
    const pendingOrders = results.filter(r => r.orderStatus?.toLowerCase() === 'pending');
    
    // Recent results (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentResults = results.filter(r => {
      if (!r.date) return false;
      return new Date(r.date) >= thirtyDaysAgo;
    });
    
    // Company information
    const company = userData.companyInfoData || {};

    return {
      drivers: {
        total: drivers.length,
        active: activeDrivers.length,
        deleted: deletedDrivers.length
      },
      results: {
        total: results.length,
        positive: positiveResults.length,
        negative: negativeResults.length,
        pending: pendingResults.length,
        completed: completedOrders.length,
        pendingOrders: pendingOrders.length,
        recent: recentResults.length
      },
      company: {
        name: company.companyName,
        employees: company.employees,
        hasInfo: Object.keys(company).length > 0
      }
    };
  }, [userData]);

  if (!userData || !stats) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
          Loading Dashboard...
        </Typography>
      </Box>
    );
  }

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  const quickInfoItems = [
    {
      label: "Test Results Status",
      value: `${stats.results.completed} completed, ${stats.results.pendingOrders} pending`,
      icon: <AssignmentIcon fontSize="small" />,
      color: stats.results.completed > stats.results.pendingOrders ? theme.palette.success.main : theme.palette.warning.main
    },
    {
      label: "Active Workforce",
      value: `${stats.drivers.active} employees active`,
      icon: <PeopleIcon fontSize="small" />,
      color: stats.drivers.active > 0 ? theme.palette.primary.main : theme.palette.error.main
    },
    {
      label: "Recent Activity",
      value: `${stats.results.recent} tests in last 30 days`,
      icon: <CalendarTodayIcon fontSize="small" />,
      color: stats.results.recent > 0 ? theme.palette.info.main : theme.palette.grey[500]
    }
  ];

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      {/* Welcome Header */}
      <Paper sx={{ 
        p: 4, 
        mb: 4, 
        borderRadius: 3,
        background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
        color: 'white'
      }}>
        <Stack direction="row" spacing={3} alignItems="center">
          <Avatar sx={{ 
            width: 80, 
            height: 80, 
            bgcolor: alpha(theme.palette.common.white, 0.2),
            fontSize: '2rem'
          }}>
            {stats.company.name?.charAt(0) || 'W'}
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
              {getGreeting()}!
            </Typography>
            <Typography variant="h5" sx={{ opacity: 0.9, mb: 1 }}>
              {stats.company.name ? `Welcome back to ${stats.company.name}` : "Welcome to Nationwide Drug Centers"}
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.8 }}>
              {stats.company.name ? "Your testing and employee management dashboard" : "Complete your company profile to get started"}
            </Typography>
          </Box>
        </Stack>
      </Paper>

      {/* Statistics Grid */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Active Drivers"
            value={stats.drivers.active}
            icon={<PeopleIcon />}
            color="primary"
            subtitle={`${stats.drivers.total} total drivers registered`}
            trend={stats.drivers.deleted > 0 ? `${stats.drivers.deleted} inactive` : undefined}
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Tests"
            value={stats.results.total}
            icon={<ScienceIcon />}
            color="secondary"
            subtitle={`${stats.results.recent} tests in last 30 days`}
            progress={stats.results.total > 0 ? Math.round((stats.results.completed / stats.results.total) * 100) : 0}
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Positive Results"
            value={stats.results.positive}
            icon={<ErrorIcon />}
            color="error"
            subtitle={`${stats.results.negative} negative results`}
            progress={stats.results.total > 0 ? Math.round((stats.results.positive / stats.results.total) * 100) : 0}
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Pending Tests"
            value={stats.results.pending}
            icon={<PendingIcon />}
            color="warning"
            subtitle="Awaiting results"
            trend={stats.results.pendingOrders > 0 ? `${stats.results.pendingOrders} orders pending` : "All orders complete"}
          />
        </Grid>
      </Grid>

      {/* Quick Info and Status Cards */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <QuickInfoCard
            title="Operations Overview"
            items={quickInfoItems}
            color="primary"
          />
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card sx={{ 
            borderRadius: 3, 
            border: 1, 
            borderColor: 'divider',
            height: '100%'
          }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ 
                fontWeight: 600, 
                mb: 2,
                color: 'secondary.main'
              }}>
                Current Status
              </Typography>
              
              <Stack spacing={2}>
                {stats.results.positive > 0 && (
                  <Stack direction="row" spacing={2} alignItems="center">
                    <ErrorIcon color="error" />
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {stats.results.positive} Positive Results
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Requires immediate attention
                      </Typography>
                    </Box>
                  </Stack>
                )}
                
                {stats.results.pending > 0 && (
                  <Stack direction="row" spacing={2} alignItems="center">
                    <PendingIcon color="warning" />
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {stats.results.pending} Tests Pending
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Awaiting laboratory results
                      </Typography>
                    </Box>
                  </Stack>
                )}
                
                {stats.drivers.active > 0 && (
                  <Stack direction="row" spacing={2} alignItems="center">
                    <CheckCircleIcon color="success" />
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {stats.drivers.active} Active Drivers
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Ready for testing assignments
                      </Typography>
                    </Box>
                  </Stack>
                )}
                
                {stats.results.recent === 0 && stats.results.total > 0 && (
                  <Stack direction="row" spacing={2} alignItems="center">
                    <WarningIcon color="info" />
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        No Recent Activity
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        No tests in the last 30 days
                      </Typography>
                    </Box>
                  </Stack>
                )}
                
                {stats.results.total === 0 && stats.drivers.active === 0 && (
                  <Stack direction="row" spacing={2} alignItems="center">
                    <BusinessIcon color="primary" />
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        Getting Started
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Add drivers and schedule tests to begin
                      </Typography>
                    </Box>
                  </Stack>
                )}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default UserOverview;