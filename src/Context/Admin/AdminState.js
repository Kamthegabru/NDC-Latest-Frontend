import React, { useState} from "react";
import AdminContext from "./AdminContext";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
const API_URL = process.env.REACT_APP_API_URL;

const AdminState = (props) => {
    const [currentActiveButton, setCurrentActiveButton] = useState(1);
    const [AllUserData,setAllUserData] = useState([]);
    const getAllAdminData = async()=>{
        const token = Cookies.get("token");
        if (token) {
            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
            axios.get(`${API_URL}/admin/getAllUserData`)
                .then(response => {
                    setAllUserData(response.data.data);

                })
                .catch(() => {
                    toast.error("Server error, Please try again later");
                });
        } else {
            toast.error("Invalid access, Please login again");
        }
    };
    return (
        <AdminContext.Provider value={{currentActiveButton,AllUserData,getAllAdminData,setCurrentActiveButton}}>
            {props.children}
        </AdminContext.Provider>
    )
}

export default AdminState;