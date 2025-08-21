import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import HomeContext from "./HomeContext";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import handleApiError from "../../../handleAPIError";

const API_URL = process.env.REACT_APP_API_URL;

const HomeState = (props) => {
    let navigate = useNavigate();
    const [currentActiveButton, setCurrentActiveButton] = useState(1);
    const [userData, setUserData] = useState();

    const getUserData = () => {
        const token = Cookies.get("token");
        if (token) {
            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
            axios.get(`${API_URL}/user/getdata`)
                .then(response => {
                    setUserData(response.data.data);
                })
                .catch((error) => {
                    handleApiError(error, "Network error")
                });
        } else {
            toast.error("No token is Provided, Please login again");
            setUserData(null);
            Cookies.remove("token");
            localStorage.removeItem("rememberedEmail");
            localStorage.removeItem("rememberedPassword");
            navigate("/login");
        }
    }

    //function to update company information in backend
    const updateCompanyInformation = async (data) => {
        await axios.post(`${API_URL}/user/updateCompanyInformation`, data)
            .then(response => {
                const data = response.data;
                toast.success(data.message);
                getUserData();
            })
            .catch(error => {
                handleApiError(error, "Failed to update company Information !")
            });
    }

    // function to update userdata
    const updateUserData = async () => {
        getUserData();
    }

    // fnction to update payment Info
    const updatePayment = async (data) => {
        await axios.post(`${API_URL}/user/updatePayment`, data)
            .then(response => {
                const data = response.data;
                toast.success(data.message);
                getUserData();
            })
            .catch(error => {
                handleApiError(error, "Failed to update payment information")
            });
    }

    return (
        <HomeContext.Provider value={{ currentActiveButton, userData, getUserData, updatePayment, updateUserData, updateCompanyInformation, setCurrentActiveButton }}>
            {props.children}
        </HomeContext.Provider>
    )
}

export default HomeState;