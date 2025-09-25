import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

import Navbar from "./Navbar";
import Landing from "./Landing";
import Pricing from "./Pricing";
import Footer from "./Footer";
import About from "./About";
import Login from "./Login";
import SignUp from "./SignUp/Signup";
import ForgotPassword from "./ForgotPassword";
import ResetPassword from "./ResetPassword";
import Error404Page from "../../Error404Page";
import Privacy from "./Privacy";
import TermsAndConditions from "./TermAndCondition";
import LoginState from "../../../Context/ClientSide/Login/LoginState";
import Contact from "./Contact";
import PricingSection from "./Pricings";
import TestimonialSection from "./TestimonialSection";
import DrivenByResultsSection from "./DrivenByResultsSection";
import AboutSection from "./AboutSection";
import Process from "./Process";
import ServiceCards from "./ServiceCards";
import HeroComponent from "./HeroSection";
import Header from "./Header";
import ScrollObserver from "./ScrollObserver";
import ContactSection from "./aboutus";


const pageVariants = {
  initial: {
    opacity: 0,
    y: 30,
  },
  in: {
    opacity: 1,
    y: 0,
  },
  out: {
    opacity: 0,
    y: -30,
  },
};

const pageTransition = {
  type: "tween",
  ease: "anticipate",
  duration: 0.5,
};

const AnimatedPage = ({ children }) => (
  <motion.div
    initial="initial"
    animate="in"
    exit="out"
    variants={pageVariants}
    transition={pageTransition}
  >
    {children}
  </motion.div>
);

function Home() {
  const location = useLocation();

  return (
    <div  className="overflow-hidden">
    
              {/* <Navbar /> */}
              
               <div id="main-header" className='sticky top-0 z-50 bg-[#565858] border-b border-white transition-all duration-300'>
            <Header/>
            </div>
      
     {/* <ScrollObserver/> */}
      {/* Page Routes with Animation */}
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route
            path="/"
            element={
              <AnimatedPage>
               

<div id="home">
       <HeroComponent/>
      </div>
       
      
      <div id="how" className="     md:pt-[20px] pt-[0px]">
    <ServiceCards/>
      </div>

        <div id="st">
       <Process/>
      </div>

      <div id="service">
       <AboutSection/>
      </div>

<div id="about"  className="overflow-hidden">
        <DrivenByResultsSection/>
      </div>

      <div id="testimonials">
       <TestimonialSection/>
      </div>

      <div id="pricing">
       <PricingSection/>
      </div>

      <Contact/>
     
              </AnimatedPage>
            }
          />
          <Route
            path="/pricing"
            element={
              <AnimatedPage>
               <div id="pricing">
       <PricingSection/>
      </div>
              </AnimatedPage>
            }
          />
          <Route
            path="/about"
            element={
              <AnimatedPage>
                {/* <About /> */}
              </AnimatedPage>
            }
          />
          <Route
            path="/login"
            element={
              <AnimatedPage>
                <LoginState>
                  <Login />
                </LoginState>
              </AnimatedPage>
            }
          />
          <Route
            path="/signup"
           
            element={
              <AnimatedPage>
                <SignUp  />
              </AnimatedPage>
            }
          />
          <Route
            path="/forgotPassword"
            element={
              <AnimatedPage>
                <ForgotPassword />
              </AnimatedPage>
            }
          />
          <Route
            path="/resetPassword"
            element={
              <AnimatedPage>
                <ResetPassword />
              </AnimatedPage>
            }
          />
          <Route
            path="/privacy"
            element={
              <AnimatedPage>
                <Privacy />
              </AnimatedPage>
            }
          />
          <Route
            path="/termsAndConditions"
            element={
              <AnimatedPage>
                <TermsAndConditions />
              </AnimatedPage>
            }
          />
          <Route
            path="*"
            element={
              <AnimatedPage>
                <Error404Page />
              </AnimatedPage>
            }
          />
        </Routes>
      </AnimatePresence>

      <ContactSection/>
      <Footer />
    </div>
  );
}

export default Home;
