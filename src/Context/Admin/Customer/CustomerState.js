import React, { useState } from "react";
import CustomerContext from "./CustomerContext";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
const API_URL = process.env.REACT_APP_API_URL;

const CustomerState = (props) => {
    const [userDetails, setUserDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentId, setCurrentId] = useState("")
    const [currentCompany, setCurrentCompany] = useState("")

    const getSingleUserData = async (id) => {
        setCurrentId(id)
        const token = Cookies.get("token");
        if (token) {
            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
            await axios.post(`${API_URL}/admin/getSingleUserDetails`, { id: id })
                .then(response => {
                    setUserDetails(response.data.data);
                    setCurrentCompany(response?.data?.data?.companyInfoData?.companyName)
                    setLoading(false);
                })
                .catch((error) => {
                    console.error("Error fetching user details:", error);
                });
        } else {
            toast.error("Invalid access, Please login again");
        }
    }

    //function to update company information in backend
    const updateCompanyInformation = async (data) => {
        await axios.post(`${API_URL}/admin/updateCompanyInformation`, { data, currentId })
            .then(response => {
                const data = response.data;
                toast.success(data.message);
                getSingleUserData(currentId);
            })
            .catch(error => {
                toast.error("server error, Please try again later")
            });
    }

    //function to update payment information in backend
    const updatePaymentInformation = async (data) => {
        await axios.post(`${API_URL}/admin/updatePaymentInformation`, { data, currentId })
            .then(response => {
                const data = response.data;
                toast.success(data.message);
                getSingleUserData(currentId);
            })
            .catch(error => {
                toast.error("server error, Please try again later")
            });
    }

    const updateMembershipInformation = async (data) => {
        await axios.post(`${API_URL}/admin/updateMembershipInformation`, { data, currentId })
            .then(response => {
                const data = response.data;
                toast.success(data.message);
                getSingleUserData(currentId);
            })
            .catch(error => {
                toast.error("server error, Please try again later")
            });
    }
    return (
        <CustomerContext.Provider value={{ userDetails, loading, currentId, currentCompany, updateMembershipInformation, updatePaymentInformation, updateCompanyInformation, setLoading, getSingleUserData, setUserDetails }}>
            {props.children}
        </CustomerContext.Provider>
    )
}

export default CustomerState;