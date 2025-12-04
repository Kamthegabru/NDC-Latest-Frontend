import './App.css';
import { useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Home from "./Component/ClientSide/BeforeLogin/Home";
import PortalHome from './Component/ClientSide/AfterLogin/PortalHome';
import AdminHome from './Component/Admin/AdminHome';
import AgencyHome from './Component/Agency/AgencyHome';
import Error404Page from './Component/Error404Page';
import ProtectedRoute from './Component/ProtectedRoute';

import HomeState from './Context/ClientSide/AfterLogin/Home/HomeState';
import AdminState from './Context/Admin/AdminState';
import AgencyState from './Context/Agency/AgencyState';
import SignupState from './Context/ClientSide/SignUp/SignupState';

const API_URL = process.env.REACT_APP_API_URL;

function App() {
  useEffect(() => {
    axios.post(`${API_URL}/random/handleVisitor`, {}, { withCredentials: true })
      .catch(err => {
        console.error("Visitor tracking failed:", err.message);
      });
  }, []);

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <Router>
        <Routes>
          {/* Public Routes - No authentication required */}
          <Route path="/*" element={<SignupState><Home /></SignupState>} />
          
          {/* Protected Routes - Authentication required */}
          <Route 
            path="/portal" 
            element={
              <ProtectedRoute allowedRoles={['User']}>
                <HomeState><PortalHome /></HomeState>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute allowedRoles={['Admin']}>
                <AdminState><AdminHome /></AdminState>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/agency" 
            element={
              <ProtectedRoute allowedRoles={['Agency']}>
                <AgencyState><AgencyHome /></AgencyState>
              </ProtectedRoute>
            } 
          />
          
          {/* 404 Error Page */}
          <Route path="*" element={<Error404Page />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
