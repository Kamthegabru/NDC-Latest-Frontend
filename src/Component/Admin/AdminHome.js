import React, { useState, useContext, useEffect } from "react";
import { Box, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import axios from "axios";
import Cookies from "js-cookie"
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

import Navbar from "./Navbar";
import Welcome from "./Welcome";
import ViewCustomer from "./Customer/ViewCustomer";
import ViewCustomerDetails from "./Customer/ViewUserDetails";
import ViewAgency from "./Agency/ViewAgency";
import ViewAgencyDetails from "./Agency/ViewAgencyDetails";
import ViewAdmin from "./Admin/ViewAdmin";
import Random from "./Random/Random"
import CreateNewOrder from "./CreateNewOrder/CreateNewOrder";
import Result from "./Result/Result";
import Setting from "./Setting/Setting"

import AdminContext from "../../Context/Admin/AdminContext";
import CustomerState from "../../Context/Admin/Customer/CustomerState"
import AgencyState from "../../Context/Admin/Agency/AgencyState";
import AdminState from "../../Context/Admin/Admin/AdminState";
import RandomState from "../../Context/Admin/Random/RandomState";
import SettingState from "../../Context/Admin/Setting/SettingState";
import CreateNewAdmin from "../../Context/Admin/CreateNewOrder/CreateNewOrderState";

const API_URL = process.env.REACT_APP_API_URL
const drawerWidth = 240;

function AdminHome() {
    const { currentActiveButton } = useContext(AdminContext);
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const navigate = useNavigate();

    useEffect(() => {
        const token = Cookies.get("token");
        if (token) {
            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
            axios.get(`${API_URL}/admin/verify`)
                .then(response => {

                })
                .catch(error => {
                    if (error.message === "Network Error") {
                        toast.error("Server error, Please try again later!")
                    } else {
                        toast.error(error.response.data.message)
                    }
                    navigate("/login")
                });
        } else {

            toast.error("Invalid access, Please login again")
            navigate("/login")
        }
        // eslint-disable-next-line
    }, []);


    const renderContent = () => {
        switch (currentActiveButton) {
            case 1:
                return <Welcome />;
            case 2:
                return <CustomerState><ViewCustomer /></CustomerState>
            case 3:
                return <AgencyState><ViewAgency /></AgencyState>
            case 4:
                return <AdminState><ViewAdmin /></AdminState>
            case 5:
                return <CustomerState><ViewCustomerDetails /></CustomerState>
            case 6:
                return <AgencyState><ViewAgencyDetails /></AgencyState>
            case 7:
                return <RandomState><Random /></RandomState>
            case 9:
                return <CreateNewAdmin><CreateNewOrder /></CreateNewAdmin>;
            case 10:
                return <Result/>
            case 11:
                return <SettingState><Setting/></SettingState>
            default:    
                return <Welcome />; // Default component
        }
    }
    return (
        <Box sx={{ display: "flex" }}>
            <Navbar isMobileOpen={isMobileOpen} setIsMobileOpen={setIsMobileOpen} />
            <Box
                sx={{
                    flexGrow: 1,
                    ml: isMobile ? 0 : `${drawerWidth}px`, // Avoids hiding content
                }}
            >
                {renderContent()}
            </Box>
        </Box>
    );
}

export default AdminHome;
