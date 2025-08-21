import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Container,
} from "@mui/material";
import {
  LocalShipping as LocalShippingIcon,
  Flight as FlightIcon,
  Verified as VerifiedIcon,
  Construction as ConstructionIcon,
  Train as TrainIcon,
  MedicalServices as MedicalServicesIcon,
} from "@mui/icons-material";
import { motion } from "framer-motion";

const statsData = [
  { value: 10000, label: "Drug Tests" },
  { value: 800, label: "Customers" },
  { value: 50, label: "Daily Drug Tests" },
  { value: 20000, label: "Locations" },
];

const cardData = [
  {
    title: "FMCSA",
    content:
      "Our FMCSA DOT testing services ensure compliance with federal regulations for safety-sensitive transportation employees...",
    icon: <LocalShippingIcon sx={{ fontSize: 40, color: "#1976d2" }} />,
  },
  {
    title: "FAA",
    content:
      "Our FAA drug and alcohol testing services help aviation employers comply with Federal Aviation Administration regulations...",
    icon: <FlightIcon sx={{ fontSize: 40, color: "#1976d2" }} />,
  },
  {
    title: "SAMHSA",
    content:
      "Our SAMHSA-certified lab testing services guarantee the highest standards for drug and alcohol testing...",
    icon: <VerifiedIcon sx={{ fontSize: 40, color: "#1976d2" }} />,
  },
  {
    title: "CONSTRUCTION",
    content:
      "Our construction industry drug testing services are designed to ensure a safe, compliant, and productive work environment...",
    icon: <ConstructionIcon sx={{ fontSize: 40, color: "#1976d2" }} />,
  },
  {
    title: "FRA",
    content:
      "Our FRA drug and alcohol testing services are designed to meet Federal Railroad Administration requirements...",
    icon: <TrainIcon sx={{ fontSize: 40, color: "#1976d2" }} />,
  },
  {
    title: "NURSES/DOCTORS",
    content:
      "Our drug testing services for medical positions ensure that healthcare employers meet regulatory and safety standards...",
    icon: <MedicalServicesIcon sx={{ fontSize: 40, color: "#1976d2" }} />,
  },
];

const cardData2 = [
  {
    title: "Innovation",
    content: "We are committed to constantly pushing boundaries and exploring new ideas...",
    icon: <LocalShippingIcon sx={{ fontSize: 40, color: "#1976d2" }} />,
  },
  {
    title: "Customers first",
    content: "Our customers are at the center of everything we do...",
    icon: <FlightIcon sx={{ fontSize: 40, color: "#1976d2" }} />,
  },
  {
    title: "Teamwork",
    content: "We believe in the power of collaboration and teamwork...",
    icon: <VerifiedIcon sx={{ fontSize: 40, color: "#1976d2" }} />,
  },
  {
    title: "Accountability",
    content: "We take responsibility for our actions and decisions...",
    icon: <ConstructionIcon sx={{ fontSize: 40, color: "#1976d2" }} />,
  },
  {
    title: "Continuous learning",
    content: "We believe in the importance of continuous learning and growth...",
    icon: <TrainIcon sx={{ fontSize: 40, color: "#1976d2" }} />,
  },
  {
    title: "Agility",
    content: "We are adaptable and nimble, and we embrace change as an opportunity...",
    icon: <MedicalServicesIcon sx={{ fontSize: 40, color: "#1976d2" }} />,
  },
];

function AnimatedCounter({ target }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = parseInt(target);
    if (isNaN(end)) {
      setCount(target);
      return;
    }

    const duration = 1500;
    const incrementTime = 30;
    const increment = Math.ceil(end / (duration / incrementTime));

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end.toLocaleString());
        clearInterval(timer);
      } else {
        setCount(start.toLocaleString());
      }
    }, incrementTime);

    return () => clearInterval(timer);
  }, [target]);

  return <>{count}+</>;
}

function About() {
  return (
    <div style={{ marginTop: "90px" }}>
      <Container maxWidth="md">
        {/* ABOUT US */}
        <motion.div
          style={{ paddingTop: "50px" }}
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div style={{ background: "linear-gradient(to bottom, white, #e3f2fd)", padding: "30px 0px" }}>
            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <motion.div
                  initial={{ scale: 0.9 }}
                  whileInView={{ scale: 1 }}
                  transition={{ duration: 0.6 }}
                  style={{ paddingLeft: "20px" }} // <-- Left padding added here
                >
                  <Typography fontWeight={700}>ABOUT US</Typography>
                  <Typography variant="h3" fontWeight={900} gutterBottom sx={{ lineHeight: 1.2 }}>
                    Helping the trucking Industry
                  </Typography>
                  <Typography variant="body1" fontWeight="bold">
                    Our company was founded with the goal of empowering drivers through technology...
                  </Typography>
                  <Typography variant="body1" fontWeight="bold">
                    We are driven by a passion for innovation and a desire to make a positive impact.
                  </Typography>
                </motion.div>
              </Grid>
              <Grid item xs={12} md={6}>
                <motion.img
                  style={{ borderRadius: "10px", width: "100%" }}
                  src="./Images/BeforeLogin/About/pexels-photo-4033152.avif"
                  alt="about"
                  initial={{ opacity: 0, x: 100 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.7 }}
                />
              </Grid>
            </Grid>
          </div>

          {/* STATS */}
          <motion.div
            style={{
              background: "linear-gradient(to top, white, #e3f2fd)",
              padding: "30px 0px",
              textAlign: "center",
            }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <h1 style={{ fontWeight: 900 }}>Strength in Our Numbers</h1>
            <Grid container spacing={2}>
              {statsData.map((stat, index) => (
                <Grid item xs={6} md={3} key={index}>
                  <Typography fontSize={40} fontWeight={900}>
                    <AnimatedCounter target={stat.value} />
                  </Typography>
                  <Typography color="primary" fontWeight={700}>
                    {stat.label}
                  </Typography>
                </Grid>
              ))}
            </Grid>
          </motion.div>

          {/* CORE VALUES SECTION 1 */}
          <Box sx={{ mt: 6 }}>
            <Typography variant="h6" fontWeight={700}>CORE VALUES</Typography>
            <Typography variant="h4" fontWeight={900} gutterBottom>What we do:</Typography>
            <Grid container spacing={3} alignItems="stretch" sx={{ mt: 1 }}>
              <Grid item xs={12} md={6}>
                <Typography variant="body1">
                  We cover various industries to provide best Employment Solutions focusing on Drug Testing...
                </Typography>
              </Grid>
            </Grid>

            <Grid container spacing={3} alignItems="stretch" sx={{ mt: 2 }}>
              {cardData.map((item, index) => (
                <Grid item xs={12} sm={6} md={6} lg={4} key={index}>
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <Card
                      sx={{
                        height: "260px",
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <CardContent>
                        {item.icon}
                        <Typography variant="h6" fontWeight="bold" gutterBottom>
                          {item.title}
                        </Typography>
                        <Typography variant="body2">{item.content}</Typography>
                      </CardContent>
                    </Card>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </Box>
        </motion.div>
      </Container>

      {/* CORE VALUES SECTION 2 */}
      <div style={{ backgroundColor: "black", padding: "50px 0px" }}>
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 0.8 }}>
          <Container maxWidth="md">
            <Typography variant="h6" color="white">CORE VALUES</Typography>
            <Typography variant="h4" color="white" fontWeight={900}>What we do:</Typography>
            <Grid container spacing={3} sx={{ mt: 1 }}>
              <Grid item xs={12} md={6}>
                <Typography variant="body1" color="white">
                  We cover various industries to provide best Employment Solutions focusing on Drug Testing...
                </Typography>
              </Grid>
            </Grid>

            <Grid container spacing={3} sx={{ mt: 2 }}>
              {cardData2.map((item, index) => (
                <Grid item xs={12} sm={6} md={6} lg={4} key={index}>
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <Box
                      sx={{
                        border: "2px solid white",
                        borderRadius: "16px",
                        padding: 3,
                        height: "260px",
                        color: "white",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-start",
                        justifyContent: "center",
                      }}
                    >
                      <Box sx={{ mb: 1 }}>{item.icon}</Box>
                      <Typography variant="h6" fontWeight="bold" gutterBottom>
                        {item.title}
                      </Typography>
                      <Typography variant="body2">{item.content}</Typography>
                    </Box>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </Container>
        </motion.div>
      </div>
    </div>
  );
}

export default About;
