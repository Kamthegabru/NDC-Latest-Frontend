import React, { useState, useEffect} from "react";
import AdminContext from "./AgencyContext";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
const API_URL = process.env.REACT_APP_API_URL;

const AgencyState = (props) => {
    const [currentActiveButton, setCurrentActiveButton] = useState(1);
    const [AllUserData,setAllUserData] = useState([]);
    
    useEffect(() => {
        const token = Cookies.get("token");
        if (token) {
            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
            axios.get(`${API_URL}/agency/getAllUserData`)
                .then(response => {
                    setAllUserData(response.data.data);
                })
                .catch(() => {
                    toast.error("Server error, Please try again later");
                });
        } else {
            toast.error("Invalid access, Please login again");
        }
    }, []);
    
    return (
        <AdminContext.Provider value={{currentActiveButton,AllUserData,setCurrentActiveButton}}>
            {props.children}
        </AdminContext.Provider>
    )
}

export default AgencyState;