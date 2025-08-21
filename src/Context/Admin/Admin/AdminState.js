import React, { useState, useEffect } from "react";
import CustomerContext from "./AdminContext";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
const API_URL = process.env.REACT_APP_API_URL;

const AdminState = (props) => {
    const [adminDetails, setAdminDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentId, setCurrentId] = useState("")
    const [AllAdminData, setAllAdminData] = useState([])

    //function to get all Admin data from backend
    useEffect(() => {
        const token = Cookies.get("token");
        if (token) {
            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
            axios.get(`${API_URL}/admin/getAllAdminData`)
                .then(response => {
                    setAllAdminData(response.data.data);
                })
                .catch(() => {
                    toast.error("Server error, Please try again later");
                });
        } else {
            toast.error("Invalid access, Please login again");
        }
    }, []);

    const getAllAdminData = async () => {
        const token = Cookies.get("token");
        if (token) {
            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
            axios.get(`${API_URL}/admin/getAllAdminData`)
                .then(response => {
                    setAllAdminData(response.data.data);
                })
                .catch(() => {
                    toast.error("Server error, Please try again later");
                });
        } else {
            toast.error("Invalid access, Please login again");
        }
    }

    //function to update admin information in backend
    const updateAdminInformation = async (updatedContactInfo) => {
        await axios.post(`${API_URL}/admin/updateAdminData`, {
            contactInfoData: updatedContactInfo
        })
            .then(response => {
                toast.success("admin information updated successfully");
                getAllAdminData(); // refresh admin table
            })
            .catch(error => {
                toast.error("Server error, please try again later");
            });
    };

    // function to delete admin from backend
    const deleteAdminAccount = async (adminId) => {
        await axios.post(`${API_URL}/admin/deleteAdmin`, { adminId })
            .then(response => {
                toast.success("Admin deleted successfully");
                getAllAdminData(); // refresh admin table
            })
            .catch(error => {
                toast.error("Server error, please try again later");
            });
    };


    return (
        <CustomerContext.Provider value={{ AllAdminData, adminDetails, loading, currentId, setCurrentId, deleteAdminAccount, updateAdminInformation, setLoading, setAdminDetails, getAllAdminData }}>
            {props.children}
        </CustomerContext.Provider>
    )
}

export default AdminState;