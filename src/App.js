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
          <Route path="/*" element={<SignupState><Home /></SignupState>} />
          <Route path="/portal" element={<HomeState><PortalHome /></HomeState>} />
          <Route path="/admin" element={<AdminState><AdminHome /></AdminState>} />
          <Route path="/agency" element={<AgencyState><AgencyHome /></AgencyState>} />
          <Route path="*" element={<Error404Page />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
