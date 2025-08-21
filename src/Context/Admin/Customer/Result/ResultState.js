import React from "react";
import ResultContext from "./ResultContext";
import axios from "axios";
import { toast } from "react-toastify";

const API_URL = process.env.REACT_APP_API_URL;

const ResultState = (props) => {

    const addResult = async (formData) => {
        try {
            const response = await axios.post(`${API_URL}/admin/uploadResult`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            if (response.status !== 200) {
                toast.error("Error adding result");
            } else {
                toast.success("Result added successfully");
            }
        } catch (error) {
            console.error("Add Result Error:", error);
            toast.error("Error adding result");
        }
    };

    const updateResult = async (formData) => {
        try {
            const response = await axios.post(`${API_URL}/admin/editResult`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            if (response.status !== 200) {
                toast.error("Error adding result");
            } else {
                toast.success("Result added successfully");
            }
        } catch (error) {
            console.error("Add Result Error:", error);
            toast.error("Error adding result");
        }
    };


    const deleteResult = async (currentId, resultId) => {
        try {
            await axios.post(`${API_URL}/admin/deleteResult`, {
                currentId,
                resultId
            });
            toast.success("Result deleted successfully");
        } catch (error) {
            console.error("Delete Result Error:", error);
            toast.error("Failed to delete result");
        }
    };

    return (
        <ResultContext.Provider value={{ addResult, updateResult, deleteResult }}>
            {props.children}
        </ResultContext.Provider>
    );
};

export default ResultState;
