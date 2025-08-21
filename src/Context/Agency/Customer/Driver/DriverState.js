import React from "react";
import DriverContext from "./DriverContext";
import axios from "axios";
import { toast } from "react-toastify";
const API_URL = process.env.REACT_APP_API_URL;


const DriverState = (props) => {


    const AddDriver = async (driver, currentId) => {
        await axios.post(`${API_URL}/agency/addDriver`, { driver, currentId })
            .then(response => {
                const data = response.data;
                toast.success(data.message);
            })
            .catch(error => {
                toast.error("server error, Please try again later")
            });
    }

    const updateDriver = async (driver, currentId) => {
        await axios.post(`${API_URL}/agency/updateDriver`, { driver, currentId })
            .then(response => {
                const data = response.data;
                toast.success(data.message);
            })
            .catch(error => {
                toast.error("server error, Please try again later")
            });
    }

    const deleteDriver = async (driver, currentId) => {
        await axios.post(`${API_URL}/agency/deleteDriver`, { driver, currentId })
            .then(response => {
                const data = response.data;
                toast.success(data.message);
            })
            .catch(error => {
                toast.error("server error, Please try again later")
            });
    }

    return (
        <DriverContext.Provider value={{ AddDriver, deleteDriver, updateDriver }}>
            {props.children}
        </DriverContext.Provider>
    )
}

export default DriverState;