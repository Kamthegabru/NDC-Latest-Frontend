import React, { useEffect, useState } from "react";
import {
  Box, Typography, Card, CardContent, Grid, Avatar, Skeleton, CardHeader
} from "@mui/material";
import { styled } from "@mui/material/styles";
import GroupIcon from "@mui/icons-material/Group";
import StoreIcon from "@mui/icons-material/Store";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import axios from "axios";
import Cookies from "js-cookie";

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

const ChartCard = styled(Card)(({ theme }) => ({
  borderRadius: 20,
  boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
  background: theme.palette.background.paper,
  overflow: 'hidden',
  transition: "transform 0.3s ease",
  "&:hover": {
    transform: "translateY(-5px)",
  },
}));

// Custom Bar Chart Component for Website Visits
const WebsiteVisitsChart = ({ data }) => {
  const [hoveredBar, setHoveredBar] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  if (!data || data.length === 0) return null;

  const maxValue = Math.max(...data.map(d => d.count));
  const roundedMaxValue = Math.ceil(maxValue / 10) * 10;

  const getBarHeight = (value) => (value / roundedMaxValue) * 100;

  const getYAxisLabels = () => {
    const labels = [];
    const step = roundedMaxValue / 4;
    for (let i = 0; i <= 4; i++) {
      labels.push(Math.round(step * i));
    }
    return labels.reverse();
  };

  const yAxisLabels = getYAxisLabels();

  return (
    <div
      style={{
        backgroundColor: '#f8fafc',
        borderRadius: '16px',
        padding: '20px',
        margin: '16px',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        position: 'relative',
        height: '280px',
      }}
    >
      {/* Tooltip */}
      {hoveredBar !== null && (
        <div
          style={{
            position: 'absolute',
            left: tooltipPosition.x + 150,
            top: tooltipPosition.y - 10,
            transform: 'translateX(-50%)',
            backgroundColor: 'rgba(33, 150, 243, 0.95)',
            color: 'white',
            padding: '12px 16px',
            borderRadius: '12px',
            fontSize: '13px',
            fontWeight: '500',
            whiteSpace: 'nowrap',
            zIndex: 1000,
            pointerEvents: 'none',
            boxShadow: '0 8px 32px rgba(33, 150, 243, 0.4)',
          }}
        >
          <div style={{ fontWeight: '600', marginBottom: '4px' }}>{data[hoveredBar].name}</div>
          <div style={{ color: '#bbdefb' }}>
            Visits: {data[hoveredBar].count}
          </div>
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'stretch', height: '100%' }}>
        {/* Y-Axis */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            height: '200px',
            paddingRight: '16px',
            minWidth: '40px',
            marginTop: '20px',
          }}
        >
          {yAxisLabels.map((label, index) => (
            <div
              key={index}
              style={{
                fontSize: '11px',
                color: '#64748b',
                fontWeight: '500',
                textAlign: 'right',
                lineHeight: '1',
              }}
            >
              {label}
            </div>
          ))}
        </div>

        {/* Chart Area */}
        <div
          style={{
            height: '200px',
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            padding: '0 4px',
            position: 'relative',
            flex: 1,
            borderLeft: '2px solid #e2e8f0',
            gap: '4px',
            marginTop: '20px',
          }}
        >
          {/* Grid Lines */}
          <svg
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              width: '100%',
              height: '100%',
              pointerEvents: 'none',
            }}
          >
            {[0, 25, 50, 75, 100].map((percent) => (
              <line
                key={percent}
                x1="0"
                y1={`${percent}%`}
                x2="100%"
                y2={`${percent}%`}
                stroke="#f1f5f9"
                strokeWidth="1"
                opacity="0.8"
              />
            ))}
          </svg>

          {/* Bars */}
          {data.map((item, index) => {
            const height = getBarHeight(item.count);

            return (
              <div
                key={index}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  flex: 1,
                  maxWidth: '60px',
                  minWidth: '30px',
                }}
              >
                {/* Bar Container */}
                <div
                  style={{
                    width: '100%',
                    height: '160px',
                    display: 'flex',
                    alignItems: 'flex-end',
                    justifyContent: 'center',
                    position: 'relative',
                  }}
                >
                  <div
                    style={{
                      width: '32px',
                      height: `${height}%`,
                      background: 'linear-gradient(135deg, #2196f3 0%, #1976d2 100%)',
                      borderRadius: '16px 16px 8px 8px',
                      minHeight: '20px',
                      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                      cursor: 'pointer',
                      position: 'relative',
                      boxShadow: '0 8px 25px rgba(33, 150, 243, 0.3)',
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.transform = 'scale(1.1) translateZ(0)';
                      e.target.style.boxShadow = '0 12px 40px rgba(33, 150, 243, 0.5)';
                      
                      setHoveredBar(index);
                      const rect = e.target.getBoundingClientRect();
                      const containerRect = e.target.closest('[style*="position: relative"]').getBoundingClientRect();
                      setTooltipPosition({
                        x: rect.left + rect.width / 2 - containerRect.left,
                        y: rect.top - containerRect.top,
                      });
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = 'scale(1) translateZ(0)';
                      e.target.style.boxShadow = '0 8px 25px rgba(33, 150, 243, 0.3)';
                      setHoveredBar(null);
                    }}
                  />
                </div>

                {/* Category Label */}
                <div
                  style={{
                    marginTop: '12px',
                    fontSize: '11px',
                    fontWeight: '600',
                    color: '#475569',
                    textAlign: 'center',
                    maxWidth: '60px',
                    lineHeight: '1.2',
                    minHeight: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {item.name.length > 6 ? item.name.substring(0, 5) + '...' : item.name}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// Custom Bar Chart Component for New Users
const NewUsersChart = ({ data }) => {
  const [hoveredBar, setHoveredBar] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  if (!data || data.length === 0) return null;

  const maxValue = Math.max(...data.map(d => d.count));
  const roundedMaxValue = Math.ceil(maxValue / 10) * 10;

  const getBarHeight = (value) => (value / roundedMaxValue) * 100;

  const getYAxisLabels = () => {
    const labels = [];
    const step = roundedMaxValue / 4;
    for (let i = 0; i <= 4; i++) {
      labels.push(Math.round(step * i));
    }
    return labels.reverse();
  };

  const yAxisLabels = getYAxisLabels();

  return (
    <div
      style={{
        backgroundColor: '#f0fdf4',
        borderRadius: '16px',
        padding: '20px',
        margin: '16px',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        position: 'relative',
        height: '280px',
      }}
    >
      {/* Tooltip */}
      {hoveredBar !== null && (
        <div
          style={{
            position: 'absolute',
            left: tooltipPosition.x + 150,
            top: tooltipPosition.y - 10,
            transform: 'translateX(-50%)',
            backgroundColor: 'rgba(76, 175, 80, 0.95)',
            color: 'white',
            padding: '12px 16px',
            borderRadius: '12px',
            fontSize: '13px',
            fontWeight: '500',
            whiteSpace: 'nowrap',
            zIndex: 1000,
            pointerEvents: 'none',
            boxShadow: '0 8px 32px rgba(76, 175, 80, 0.4)',
          }}
        >
          <div style={{ fontWeight: '600', marginBottom: '4px' }}>{data[hoveredBar].name}</div>
          <div style={{ color: '#c8e6c9' }}>
            New Users: {data[hoveredBar].count}
          </div>
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'stretch', height: '100%' }}>
        {/* Y-Axis */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            height: '200px',
            paddingRight: '16px',
            minWidth: '40px',
            marginTop: '20px',
          }}
        >
          {yAxisLabels.map((label, index) => (
            <div
              key={index}
              style={{
                fontSize: '11px',
                color: '#16a34a',
                fontWeight: '500',
                textAlign: 'right',
                lineHeight: '1',
              }}
            >
              {label}
            </div>
          ))}
        </div>

        {/* Chart Area */}
        <div
          style={{
            height: '200px',
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            padding: '0 4px',
            position: 'relative',
            flex: 1,
            borderLeft: '2px solid #bbf7d0',
            gap: '4px',
            marginTop: '20px',
          }}
        >
          {/* Grid Lines */}
          <svg
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              width: '100%',
              height: '100%',
              pointerEvents: 'none',
            }}
          >
            {[0, 25, 50, 75, 100].map((percent) => (
              <line
                key={percent}
                x1="0"
                y1={`${percent}%`}
                x2="100%"
                y2={`${percent}%`}
                stroke="#dcfce7"
                strokeWidth="1"
                opacity="0.8"
              />
            ))}
          </svg>

          {/* Bars */}
          {data.map((item, index) => {
            const height = getBarHeight(item.count);

            return (
              <div
                key={index}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  flex: 1,
                  maxWidth: '60px',
                  minWidth: '30px',
                }}
              >
                <div
                  style={{
                    width: '100%',
                    height: '160px',
                    display: 'flex',
                    alignItems: 'flex-end',
                    justifyContent: 'center',
                    position: 'relative',
                  }}
                >
                  <div
                    style={{
                      width: '32px',
                      height: `${height}%`,
                      background: 'linear-gradient(135deg, #4caf50 0%, #388e3c 100%)',
                      borderRadius: '16px 16px 8px 8px',
                      minHeight: '20px',
                      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                      cursor: 'pointer',
                      position: 'relative',
                      boxShadow: '0 8px 25px rgba(76, 175, 80, 0.3)',
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.transform = 'scale(1.1) translateZ(0)';
                      e.target.style.boxShadow = '0 12px 40px rgba(76, 175, 80, 0.5)';
                      
                      setHoveredBar(index);
                      const rect = e.target.getBoundingClientRect();
                      const containerRect = e.target.closest('[style*="position: relative"]').getBoundingClientRect();
                      setTooltipPosition({
                        x: rect.left + rect.width / 2 - containerRect.left,
                        y: rect.top - containerRect.top,
                      });
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = 'scale(1) translateZ(0)';
                      e.target.style.boxShadow = '0 8px 25px rgba(76, 175, 80, 0.3)';
                      setHoveredBar(null);
                    }}
                  />
                </div>

                <div
                  style={{
                    marginTop: '12px',
                    fontSize: '11px',
                    fontWeight: '600',
                    color: '#15803d',
                    textAlign: 'center',
                    maxWidth: '60px',
                    lineHeight: '1.2',
                    minHeight: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {item.name.length > 6 ? item.name.substring(0, 5) + '...' : item.name}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// Custom Stacked Bar Chart Component for Test Schedule
const TestScheduleChart = ({ data }) => {
  const [hoveredBar, setHoveredBar] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [tooltipData, setTooltipData] = useState(null);

  if (!data || data.length === 0) return null;

  const maxValue = Math.max(...data.map(d => (d.random || 0) + (d.other || 0)));
  const roundedMaxValue = Math.ceil(maxValue / 10) * 10;

  const getBarHeight = (value) => (value / roundedMaxValue) * 100;

  const getYAxisLabels = () => {
    const labels = [];
    const step = roundedMaxValue / 4;
    for (let i = 0; i <= 4; i++) {
      labels.push(Math.round(step * i));
    }
    return labels.reverse();
  };

  const yAxisLabels = getYAxisLabels();

  return (
    <div
      style={{
        backgroundColor: '#fafafa',
        borderRadius: '16px',
        padding: '20px',
        margin: '16px',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        position: 'relative',
        height: '280px',
      }}
    >
      {/* Tooltip */}
      {hoveredBar !== null && tooltipData && (
        <div
          style={{
            position: 'absolute',
            left: tooltipPosition.x + 150,
            top: tooltipPosition.y - 10,
            transform: 'translateX(-50%)',
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            color: 'white',
            padding: '12px 16px',
            borderRadius: '12px',
            fontSize: '13px',
            fontWeight: '500',
            whiteSpace: 'nowrap',
            zIndex: 1000,
            pointerEvents: 'none',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
          }}
        >
          <div style={{ fontWeight: '600', marginBottom: '8px' }}>{tooltipData.name}</div>
          <div style={{ color: '#1976d2', marginBottom: '4px' }}>
            Random: {tooltipData.random || 0}
          </div>
          <div style={{ color: '#fbc02d' }}>
            Other: {tooltipData.other || 0}
          </div>
          <div style={{ color: '#fff', marginTop: '4px', fontWeight: '600' }}>
            Total: {(tooltipData.random || 0) + (tooltipData.other || 0)}
          </div>
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'stretch', height: '100%' }}>
        {/* Y-Axis */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            height: '200px',
            paddingRight: '16px',
            minWidth: '40px',
            marginTop: '20px',
          }}
        >
          {yAxisLabels.map((label, index) => (
            <div
              key={index}
              style={{
                fontSize: '11px',
                color: '#424242',
                fontWeight: '500',
                textAlign: 'right',
                lineHeight: '1',
              }}
            >
              {label}
            </div>
          ))}
        </div>

        {/* Chart Area */}
        <div
          style={{
            height: '200px',
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            padding: '0 4px',
            position: 'relative',
            flex: 1,
            borderLeft: '2px solid #e0e0e0',
            gap: '4px',
            marginTop: '20px',
          }}
        >
          {/* Grid Lines */}
          <svg
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              width: '100%',
              height: '100%',
              pointerEvents: 'none',
            }}
          >
            {[0, 25, 50, 75, 100].map((percent) => (
              <line
                key={percent}
                x1="0"
                y1={`${percent}%`}
                x2="100%"
                y2={`${percent}%`}
                stroke="#f5f5f5"
                strokeWidth="1"
                opacity="0.8"
              />
            ))}
          </svg>

          {/* Stacked Bars */}
          {data.map((item, index) => {
            const randomValue = item.random || 0;
            const otherValue = item.other || 0;
            const totalValue = randomValue + otherValue;
            const totalHeight = getBarHeight(totalValue);
            const randomHeight = (randomValue / totalValue) * totalHeight;
            const otherHeight = (otherValue / totalValue) * totalHeight;

            return (
              <div
                key={index}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  flex: 1,
                  maxWidth: '60px',
                  minWidth: '30px',
                }}
              >
                <div
                  style={{
                    width: '100%',
                    height: '160px',
                    display: 'flex',
                    alignItems: 'flex-end',
                    justifyContent: 'center',
                    position: 'relative',
                  }}
                >
                  <div
                    style={{
                      width: '32px',
                      height: `${totalHeight}%`,
                      borderRadius: '16px 16px 8px 8px',
                      minHeight: '20px',
                      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                      cursor: 'pointer',
                      position: 'relative',
                      overflow: 'hidden',
                      boxShadow: '0 8px 25px rgba(0, 0, 0, 0.2)',
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.transform = 'scale(1.1) translateZ(0)';
                      e.target.style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.3)';
                      
                      setHoveredBar(index);
                      setTooltipData(item);
                      const rect = e.target.getBoundingClientRect();
                      const containerRect = e.target.closest('[style*="position: relative"]').getBoundingClientRect();
                      setTooltipPosition({
                        x: rect.left + rect.width / 2 - containerRect.left,
                        y: rect.top - containerRect.top,
                      });
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = 'scale(1) translateZ(0)';
                      e.target.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.2)';
                      setHoveredBar(null);
                      setTooltipData(null);
                    }}
                  >
                    {/* Other segment (bottom) */}
                    <div
                      style={{
                        width: '100%',
                        height: `${(otherValue / totalValue) * 100}%`,
                        background: 'linear-gradient(135deg, #fbc02d 0%, #f9a825 100%)',
                        position: 'absolute',
                        bottom: 0,
                        borderRadius: otherValue === totalValue ? '16px 16px 8px 8px' : '0 0 8px 8px',
                      }}
                    />
                    {/* Random segment (top) */}
                    <div
                      style={{
                        width: '100%',
                        height: `${(randomValue / totalValue) * 100}%`,
                        background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
                        position: 'absolute',
                        top: 0,
                        borderRadius: randomValue === totalValue ? '16px 16px 8px 8px' : '16px 16px 0 0',
                      }}
                    />
                  </div>
                </div>

                <div
                  style={{
                    marginTop: '12px',
                    fontSize: '11px',
                    fontWeight: '600',
                    color: '#424242',
                    textAlign: 'center',
                    maxWidth: '60px',
                    lineHeight: '1.2',
                    minHeight: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {item.name.length > 6 ? item.name.substring(0, 5) + '...' : item.name}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div
        style={{
          position: 'absolute',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: '20px',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          padding: '8px 16px',
          borderRadius: '20px',
          fontSize: '12px',
          fontWeight: '500',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div
            style={{
              width: '12px',
              height: '12px',
              background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
              borderRadius: '3px',
            }}
          />
          <span style={{ color: '#424242' }}>Random</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div
            style={{
              width: '12px',
              height: '12px',
              background: 'linear-gradient(135deg, #fbc02d 0%, #f9a825 100%)',
              borderRadius: '3px',
            }}
          />
          <span style={{ color: '#424242' }}>Other</span>
        </div>
      </div>
    </div>
  );
};

const Welcome = () => {
  const [counts, setCounts] = useState({});
  const [userData, setUserData] = useState([]);
  const [testScheduleData, setTestScheduleData] = useState([]);
  const [websiteVisits, setWebsiteVisits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cached = dashboardCache || JSON.parse(sessionStorage.getItem("dashboardData"));

    if (cached) {    
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
      axios.get(`${API_URL}/admin/getAllDrivers`),
    ])
      .then(([countsRes, usersRes, testsRes, visitsRes, driversRes]) => {
        console.log('API Response from getCustomerAndAgencyCount:', countsRes.data);
        console.log('All Drivers Response:', driversRes.data);
        
        // Count active drivers from all drivers
        const activeDriversCount = driversRes.data.filter(driver => 
          driver.status === 'Active' || driver.driverStatus === 'Active'
        ).length;
        
        console.log('Active Drivers Count:', activeDriversCount);
        
        const newData = {
          counts: { ...countsRes.data, activeDrivers: activeDriversCount },
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
    { icon: <StoreIcon />, title: "Total Drivers", value: counts.activeDrivers, color: "#ff9800" },
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

      {/* Enhanced Charts */}
      <Grid container spacing={4} sx={{ mt: 4 }}>
        {loading
          ? Array.from(new Array(3)).map((_, idx) => (
              <Grid item xs={12} md={4} key={idx}>
                <Skeleton variant="rounded" height={400} animation="wave" sx={{ borderRadius: 3 }} />
              </Grid>
            ))
          : (
            <>
              <Grid item xs={12} md={4}>
                <ChartCard>
                  <CardHeader 
                    title="Website Views" 
                    subheader="Visits (Last 6 months)"
                    sx={{
                      backgroundColor: '#2196f3',
                      color: 'white',
                      '& .MuiCardHeader-title': { 
                        color: 'white', 
                        fontWeight: 600,
                        fontSize: '1.1rem'
                      },
                      '& .MuiCardHeader-subheader': { 
                        color: 'rgba(255, 255, 255, 0.8)',
                        fontSize: '0.875rem'
                      }
                    }}
                  />
                  <WebsiteVisitsChart data={websiteVisits} />
                </ChartCard>
              </Grid>

              <Grid item xs={12} md={4}>
                <ChartCard>
                  <CardHeader 
                    title="New Users" 
                    subheader="Last 6 months"
                    sx={{
                      backgroundColor: '#4caf50',
                      color: 'white',
                      '& .MuiCardHeader-title': { 
                        color: 'white', 
                        fontWeight: 600,
                        fontSize: '1.1rem'
                      },
                      '& .MuiCardHeader-subheader': { 
                        color: 'rgba(255, 255, 255, 0.8)',
                        fontSize: '0.875rem'
                      }
                    }}
                  />
                  <NewUsersChart data={userData} />
                </ChartCard>
              </Grid>

              <Grid item xs={12} md={4}>
                <ChartCard>
                  <CardHeader 
                    title="Test Scheduled" 
                    subheader="Random vs Other"
                    sx={{
                      backgroundColor: '#424242',
                      color: 'white',
                      '& .MuiCardHeader-title': { 
                        color: 'white', 
                        fontWeight: 600,
                        fontSize: '1.1rem'
                      },
                      '& .MuiCardHeader-subheader': { 
                        color: 'rgba(255, 255, 255, 0.8)',
                        fontSize: '0.875rem'
                      }
                    }}
                  />
                  <TestScheduleChart data={testScheduleData} />
                </ChartCard>
              </Grid>
            </>
          )}
      </Grid>
    </Box>
  );
};

export default Welcome;