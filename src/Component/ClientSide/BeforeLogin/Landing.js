import React, { useEffect } from "react";
import { Button } from "@mui/material";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";


import {
  Card,
  CardContent,
  Typography,
  Grid,
  Container,
  CardMedia,
} from "@mui/material";
import { motion } from "framer-motion";
import VaccinesIcon from "@mui/icons-material/Vaccines";
import DescriptionIcon from "@mui/icons-material/Description";
import AssessmentIcon from "@mui/icons-material/Assessment";
import SchoolIcon from "@mui/icons-material/School";


function Landing() {
  useEffect(() => {
    if (window.location.hash === "#services") {
      const element = document.getElementById("services");
      if (element) {
        setTimeout(() => {
          const yOffset = -120; // Adjust this based on your navbar height
          const y =
            element.getBoundingClientRect().top + window.pageYOffset + yOffset;

          window.scrollTo({ top: y, behavior: "smooth" });
        }, 600); // delay to wait for AnimatePresence transition
      }
    }
  }, []);

  return (
    <>
      <motion.div
  initial={{ opacity: 0, y: 30 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.8, ease: "easeOut" }}
  style={{ marginTop: "90px" }}
>
  <div>
{/* === Bootstrap Carousel Section === */}
<div
  id="carouselExampleCaptions"
  className="carousel slide"
  data-bs-ride="carousel"
  style={{
    marginTop: "40px",
    height: "600px",
    borderRadius: "16px",
    overflow: "hidden",
    position: "relative",
  }}
>
  <ol className="carousel-indicators" style={{ zIndex: 2 }}>
    <li data-bs-target="#carouselExampleCaptions" data-bs-slide-to="0" className="active"></li>
    <li data-bs-target="#carouselExampleCaptions" data-bs-slide-to="1"></li>
    <li data-bs-target="#carouselExampleCaptions" data-bs-slide-to="2"></li>
  </ol>

  <div className="carousel-inner" style={{ height: "100%" }}>
    {[1, 2, 3].map((slide, index) => (
      <div
        key={slide}
        className={`carousel-item ${index === 0 ? "active" : ""}`}
        style={{ height: "100%", position: "relative" }}
      >
        <img
          src="/Images/BeforeLogin/Landing/Mack-Anthem.jpg"
          className="d-block w-100"
          alt={`Slide ${slide}`}
          style={{ objectFit: "cover", height: "100%" }}
        />

        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.4)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "flex-start",
            padding: "0 60px",
            zIndex: 1,
          }}
        >
          <h1
            style={{
              color: "white",
              fontSize: "48px",
              fontWeight: "900",
              marginBottom: "10px",
              maxWidth: "700px",
            }}
          >
            Comprehensive DOT Drug Testing Services
          </h1>
          <p
            style={{
              color: "white",
              fontSize: "18px",
              maxWidth: "600px",
              lineHeight: "1.6",
              marginBottom: "30px",
            }}
          >
            Ensure workplace safety and compliance with our comprehensive DOT drug testing services. We offer reliable and efficient testing solutions tailored to meet your specific needs.
          </p>
          <Button
            component={Link}
            to="/pricing"
            variant="contained"
            style={{
              backgroundColor: "#1976d2",
              color: "white",
              fontWeight: "600",
              fontSize: "16px",
              padding: "10px 24px",
              borderRadius: "30px",
            }}
          >
            Sign Up Now
          </Button>
        </div>
      </div>
    ))}
  </div>

  <button
    className="carousel-control-prev"
    type="button"
    data-bs-target="#carouselExampleCaptions"
    data-bs-slide="prev"
  >
    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
    <span className="visually-hidden">Previous</span>
  </button>
  <button
    className="carousel-control-next"
    type="button"
    data-bs-target="#carouselExampleCaptions"
    data-bs-slide="next"
  >
    <span className="carousel-control-next-icon" aria-hidden="true"></span>
    <span className="visually-hidden">Next</span>
  </button>
</div>




          {/* === Blue Banner Section === */}
          <div
            style={{
              backgroundColor: "rgb(54, 107, 191)",
              marginTop: "30px",
              padding: "30px 0px",
              borderRadius: "20px",
            }}
          >
            <div className="container">
              <p
                className="text-center"
                style={{ fontSize: "56px", fontWeight: "900" }}
              >
                Connect US - (360)249-7511
              </p>
              <p
                className="text-center"
                style={{
                  fontSize: "28px",
                  fontWeight: "800",
                  color: "white",
                  marginBottom: "0px",
                }}
              >
                The #1 solution for DOT drug testing and screening
              </p>
              <p
                className="text-center"
                style={{ fontSize: "18px", color: "white" }}
              >
                As recognized by leading healthcare providers and occupational
                safety experts
              </p>
            </div>
          </div>

          {/* === Unified Services Section Container === */}
          <div id="services">
            <Container style={{ marginTop: "50px", marginBottom: "60px" }}>
              {/* Our Services Heading */}
              <div
                style={{
                  border: "2px solid black",
                  padding: "20px",
                  borderRadius: "12px",
                  textAlign: "center",
                  maxWidth: "600px",
                  margin: "0 auto 40px auto",
                }}
              >
                <Typography
                  variant="h4"
                  fontWeight="bold"
                  style={{ color: "rgb(54, 107, 191)", margin: 0 }}
                >
                  Our Services
                </Typography>
              </div>

              {/* Services Cards Section */}
              <Grid container spacing={3} style={{ marginBottom: "60px" }}>
                {services.map((service, index) => (
                  <Grid item xs={12} md={4} key={index}>
                    <motion.div
                      whileHover={{
                        scale: 1.05,
                        boxShadow: "0px 10px 20px rgba(0,0,0,0.2)",
                      }}
                      transition={{ type: "spring", stiffness: 300 }}
                      style={{ height: "100%" }}
                    >
                      <Card style={{ height: "100%" }}>
                        <CardMedia
                          component="img"
                          height="290"
                          image={service.image}
                          alt={service.title}
                        />
                        <CardContent>
                          <Typography variant="h6" fontWeight="bold">
                            {service.title}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            {service.description}
                          </Typography>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </Grid>
                ))}
              </Grid>

              {/* Drug Testing Solutions Section */}
              <Grid container spacing={4} alignItems="center">
                <Grid item xs={12} md={6}>
                  <Typography
                    variant="h4"
                    fontWeight="bold"
                    style={{ color: "#0a0a42", marginBottom: "20px" }}
                  >
                    Available Drug Testing Solutions:
                  </Typography>
                  <ul style={{ listStyle: "none", paddingLeft: 0 }}>
                    {[
                      "Fast and confidential drug test results with secure online access",
        "Nationwide scheduling with flexible testing locations",
        "On-demand mobile testing units for remote job sites",
        "Certified testing compliant with federal and state regulations",
        "Comprehensive employer support and policy guidance",
        "Random program management with built-in audit readiness",
        "Real-time tracking of employee testing history",
        "Easy integration with HR and compliance platforms",
        "Professional collectors and certified lab partnerships",
        "Custom test panels based on industry or company needs",
                    ].map((item, index) => (
                      <motion.li
                        key={index}
                        whileHover={{
                          scale: 1.03,
                          backgroundColor: "rgba(0, 115, 119, 0.07)",
                          transition: { type: "spring", stiffness: 250 },
                        }}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          marginBottom: "12px",
                          padding: "8px 12px",
                          borderRadius: "8px",
                          cursor: "default",
                        }}
                      >
                        <span
                          style={{
                            color: "blue",
                            fontSize: "18px",
                            marginRight: "10px",
                          }}
                        >
                          ✔
                        </span>
                        <span
                          style={{
                            fontSize: "16px",
                            fontWeight:
                              item.includes("eCCF") ||
                              item.includes("Collection Site") ||
                              item.includes("Random Pool") ||
                              item.includes("MRO")
                                ? "bold"
                                : "normal",
                            color:
                              item.includes("eCCF") ||
                              item.includes("Collection Site") ||
                              item.includes("Random Pool") ||
                              item.includes("MRO")
                                ? "#007377"
                                : "#333",
                          }}
                        >
                          {item}
                        </span>
                      </motion.li>
                    ))}
                  </ul>
                </Grid>
                <Grid item xs={12} md={6}>
                  <img
                    src="/Images/BeforeLogin/Landing/return-to-duty-drug-test.jpg"
                    alt="Drug Test Kit"
                    style={{
                      width: "100%",
                      borderRadius: "16px",
                      boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
                    }}
                  />
                </Grid>
              </Grid>
            </Container>
          </div>
{/* === Drug & Alcohol Testing Provider Section === */}
<Container style={{ marginTop: "60px", marginBottom: "40px" }}>
  <div
    style={{
      border: "2px solid #1976d2",
      borderRadius: "16px",
      padding: "40px 30px",
      maxWidth: "1100px",
      margin: "0 auto",
    }}
  >
    <Typography
      variant="h4"
      align="center"
      fontWeight="bold"
      style={{ color: "#0a0a42", marginBottom: "30px" }}
    >
      Complete Drug & Alcohol Testing Provider
    </Typography>

    <Typography
      align="center"
      style={{
        fontSize: "18px",
        color: "#444",
        maxWidth: "1000px",
        margin: "0 auto 20px auto",
        lineHeight: "1.8",
      }}
    >
      At <strong>NDC</strong>, we go beyond standard testing — we deliver innovative, efficient, and fully compliant drug and alcohol testing services tailored to your workplace needs. With years of experience and nationwide reach, our mission is to help employers maintain a safe, productive, and drug-free environment across all industries.
    </Typography>

    <Typography
      align="center"
      style={{
        fontSize: "18px",
        color: "#444",
        maxWidth: "900px",
        margin: "20px auto 0 auto",
        lineHeight: "1.8",
      }}
    >
      Whether you need a 5-panel, 10-panel, or fully DOT-compliant screening process,{" "}
      <span style={{ color: "#007377", fontWeight: 600 }}>
        a random testing program
      </span>
      , or a fully customized solution — NDC ensures your drug testing program meets all regulatory standards while aligning with your company’s goals.
    </Typography>
  </div>
</Container>


          {/* === Consortium Programs Section === */}
          <Container style={{ marginTop: "60px", marginBottom: "50px" }}>
            <Typography
              variant="h4"
              align="center"
              fontWeight="bold"
              style={{ marginBottom: "0px", color: "#0a0a42" }}
            >
              Nationwide Drug Center
            </Typography>
            <Typography
              variant="h5"
              align="center"
              fontWeight="600"
              style={{ marginBottom: "30px" }}
            >
              DOT Consortium Programs
            </Typography>

            <Grid container spacing={3}>
              {programs.map((program, index) => (
                <Grid item xs={12} md={6} key={index}>
                  <motion.div
                    whileHover={{
                      scale: 1.03,
                      boxShadow: "0px 12px 24px rgba(0,0,0,0.15)",
                    }}
                    transition={{ type: "spring", stiffness: 300 }}
                    style={{ height: "100%" }}
                  >
                    <Card
                      elevation={3}
                      style={{
                        height: "100%",
                        minHeight: "320px",
                        padding: "20px",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        borderRadius: "12px",
                      }}
                    >
                      <div style={{ display: "flex", gap: "15px" }}>
                        <div style={{ fontSize: "40px", color: "#1976d2" }}>
                          {program.icon}
                        </div>
                        <div>
                          <Typography
                            variant="h6"
                            fontWeight="bold"
                            gutterBottom
                            style={{ color: "#0a0a42" }}
                          >
                            {program.title}
                          </Typography>
                          <ul style={{ paddingLeft: "20px", margin: 0 }}>
                            {program.points.map((point, i) => (
                              <li
                                key={i}
                                style={{
                                  marginBottom: "4px",
                                  fontSize: "0.95rem",
                                }}
                              >
                                {point}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      {program.button && program.path && (
                        <Button
                          component={Link}
                          to={program.path}
                          variant="contained"
                          style={{
                            backgroundColor: "#0a0a42",
                            color: "#fff",
                            marginTop: "16px",
                            alignSelf: "flex-start",
                          }}
                        >
                          {program.button}
                        </Button>
                      )}
                    </Card>
                  </motion.div>
                </Grid>
              ))}
              {programs.length % 2 !== 0 && (
                <Grid item xs={12} md={6}>
                  <div style={{ height: "100%", minHeight: "320px" }} />
                </Grid>
              )}
            </Grid>
          </Container>
        </div>
      </motion.div>
    </>
  );
}

export default Landing;

// === Services Data ===
const services = [
  {
    title: "Occupational Services",
    image: "./Images/BeforeLogin/Landing/occupational services.png",
    description:
      "Comprehensive occupational services focus on maintaining workforce health and ensuring compliance with safety regulations.",
  },
  {
    title: "Pre-Employment Screening",
    image: "./Images/BeforeLogin/Landing/Pre-Employment Screening.png",
    description:
      "Thorough screening helps identify qualified candidates through background checks and assessments.",
  },
  {
    title: "Drug Testing",
    image: "./Images/BeforeLogin/Landing/Drug Testing.png",
    description:
      "DOT-compliant testing for pre-employment, random, and post-incident needs with secure reporting.",
  },
];



// === Programs Data ===
const programs = [
  {
    title: "Drug & Alcohol Testing",
    icon: <VaccinesIcon fontSize="inherit" />,
    points: [
      "Random DOT Drug and Alcohol Testing Consortium",
      "Collection Site Network 20,000+ Locations",
      "24/7 Emergency, Post accident & Onsite Collection",
      "Pre-Employment Testing",
      "Medical Review Officer (MRO) Review",
      "Return to duty / SAP follow up program assistance",
      "DOT and non-DOT drug testing panels available",
      "Breath Alcohol Testing (BAT) compliance services",
      "Immediate access to certified collection sites",
      "Certified labs & electronic result reporting"
    ],
    button: "Sign Up Now!",
    path: "/pricing",
  },
  {
    title: "FMCSA Clearinghouse",
    icon: <DescriptionIcon fontSize="inherit" />,
    points: [
      "FMCSA Clearinghouse registration assistance is now available",
      "One-on-one with FMCSA Clearinghouse specialists",
      "Help managing your responsibilities",
      "Required for all Owner Operators",
      "Query assistance for new hires and annual requirements",
      "Violation reporting guidance and compliance tracking",
      "Educational support for understanding Clearinghouse rules"
    ],
  },
  {
    title: "File Management",
    icon: <AssessmentIcon fontSize="inherit" />,
    points: [
      "Immediate Enrollment Certification",
      "Online Account Portal Access",
      "Statistical Reporting, MIS Compliance Reports",
      "Friendly support for audit requirements",
      "Electronic Chain of Custody Forms (eCCF)",
      "Secure digital document storage and retrieval",
      "Driver qualification file setup and maintenance",
      "Annual and pre-employment file audit readiness",
      "FMCSA/DOT documentation standards support"
    ],
  },
  {
    title: "Supervisor / DER Training",
    icon: <SchoolIcon fontSize="inherit" />,
    points: [
      
      "DOT Approved Supervisor Training Available to non-members",
      "Complies with 49 CFR Part 382.603 requirements",
      "Covers alcohol & controlled substance indicators",
      "Includes DER roles & responsibilities overview",
      "Training completion certificates provided"
    ],
    button: "Non-Members Purchase",
    // path: "/training-purchase",
  },
];

