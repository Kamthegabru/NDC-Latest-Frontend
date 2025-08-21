import React, { useState } from "react";
import RandomContext from "./RandomContext";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
const API_URL = process.env.REACT_APP_API_URL;

const RandomState = (props) => {

    const [RandomUserAddDetails, setRandomUserAddDetails] = useState([])
    const [randomUserDetails, setRandomUserDetails] = useState([])
    const [yearFilter, setYearFilter] = useState("All");
    const [quarterFilter, setQuarterFilter] = useState("All");
    const AddRandomDriver = async (data) => {
        const token = Cookies.get("token");
        if (token) {
            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
            axios.post(`${API_URL}/admin/addRandomDriver`, data)
                .then(response => {
                    toast.success(response.data.message || "Random Driver added successfully");
                    fetchRandomData();
                })
                .catch(error => {
                    const message = error?.response?.data?.message || "Server error, Please try again later";
                    toast.error(message);
                });
        } else {
            toast.error("Invalid access, Please login again");
        }
    };


    const fetchRandomDriver = async () => {
        const token = Cookies.get("token");
        if (token) {
            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
            axios.get(`${API_URL}/admin/fetchRandomDriver`)
                .then(response => {
                    setRandomUserAddDetails(response.data.data);
                })
                .catch(() => {
                    toast.error("Server error, Please try again later");
                });
        } else {
            toast.error("Invalid access, Please login again");
        }
    }

    const fetchRandomData = async () => {
        const token = Cookies.get("token");
        if (token) {
            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
            axios.get(`${API_URL}/admin/fetchRandomData`)
                .then(response => {
                    setRandomUserDetails(response.data.data);
                })
                .catch(() => {
                    toast.error("Server error, Please try again later");
                });
        } else {
            toast.error("Invalid access, Please login again");
        }
    }

    const deleteRandomEntry = async (data) => {
        const token = Cookies.get("token");
        if (token) {
            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
            axios.post(`${API_URL}/admin/deleteRandomDriver`, data)
                .then(response => {
                    toast.success(response.data.message || "Random Driver deleted successfully");
                    fetchRandomData();
                })
                .catch(error => {
                    const message = error?.response?.data?.message || "Server error, Please try again later";
                    toast.error(message);
                });
        } else {
            toast.error("Invalid access, Please login again");
        }
    }

    const updateRandomStatus = async (data) => {
        const token = Cookies.get("token");
        if (token) {
            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
            axios.post(`${API_URL}/admin/updateRandomStatus`, data)
                .then(response => {
                    toast.success(response.data.message || "Random Updated successfully");
                    fetchRandomData();
                })
                .catch(error => {
                    const message = error?.response?.data?.message || "Server error, Please try again later";
                    toast.error(message);
                });
        } else {
            toast.error("Invalid access, Please login again");
        }
    }

    const sendEmailToRandomDriver = async (selectedItem, ccEmail) => {
        const token = Cookies.get("token");
        if (token) {
            const data = {
                selectedItem,
                ccEmail
            }
            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
            axios.post(`${API_URL}/admin/sendEmailToRandomDriver`, data)
                .then(response => {
                    toast.success(response.data.message || "Email sent successfully!");
                    fetchRandomData();
                })
                .catch(error => {
                    const message = error?.response?.data?.message || "Server error, Please try again later";
                    toast.error(message);
                });
        } else {
            toast.error("Invalid access, Please login again");
        }
    }

    return (
        <RandomContext.Provider value={{ yearFilter, setYearFilter, quarterFilter, sendEmailToRandomDriver, setQuarterFilter, AddRandomDriver, fetchRandomDriver, fetchRandomData, deleteRandomEntry, updateRandomStatus, randomUserDetails, RandomUserAddDetails }}>
            {props.children}
        </RandomContext.Provider>
    )
}

export default RandomState;