import React, { useState, useEffect } from "react";
import CustomerContext from "./AgencyContext";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
const API_URL = process.env.REACT_APP_API_URL;

const CustomerState = (props) => {
    const [agencyDetails, setAgencyDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentId, setCurrentId] = useState("")
    const [AllAgencyData, setAllAgencyData] = useState([])

    //function to get all agency data from backend
    useEffect(() => {
        const token = Cookies.get("token");
        if (token) {
            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
            axios.get(`${API_URL}/admin/getAllAgencyData`)
                .then(response => {
                    setAllAgencyData(response.data.data);
                })
                .catch(() => {
                    toast.error("Server error, Please try again later");
                });
        } else {
            toast.error("Invalid access, Please login again");
        }
    }, []);

    const getAllAgencyData = async () => {
        const token = Cookies.get("token");
        if (token) {
            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
            axios.get(`${API_URL}/admin/getAllAgencyData`)
                .then(response => {
                    setAllAgencyData(response.data.data);
                })
                .catch(() => {
                    toast.error("Server error, Please try again later");
                });
        } else {
            toast.error("Invalid access, Please login again");
        }
    }

    const getSingleAgencyData = async (id) => {
        setCurrentId(id)
        const token = Cookies.get("token");
        if (token) {
            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
            await axios.post(`${API_URL}/admin/getSingleAgencyDetails`, { id: id })
                .then(response => {
                    setAgencyDetails(response.data.data);
                    setLoading(false);
                })
                .catch((error) => {
                    console.error("Error fetching Agency details:", error);
                });
        } else {
            toast.error("Invalid access, Please login again");
        }
    }

    //function to update company information in backend
    const updateAgencyInformation = async (data) => {
        await axios.post(`${API_URL}/admin/updateAgencyData`, { data, currentId })
            .then(response => {
                const data = response.data;
                toast.success(data.message);
                getSingleAgencyData(currentId);
                getAllAgencyData();

            })
            .catch(error => {
                toast.error("server error, Please try again later")
            });
    }
    return (
        <CustomerContext.Provider value={{ AllAgencyData, agencyDetails, loading, currentId, updateAgencyInformation, setLoading, getSingleAgencyData, setAgencyDetails,getAllAgencyData }}>
            {props.children}
        </CustomerContext.Provider>
    )
}

export default CustomerState;