import React from "react";
import CertificateContext from "./CertificateContext";
import axios from "axios";
import { toast } from "react-toastify";
const API_URL = process.env.REACT_APP_API_URL;

const CertificateState = (props) => {

    const addCertificate = async (formData) => {
        try {
            const response = await axios.post(`${API_URL}/admin/uploadCertificate`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            if (response.status !== 200) {
                toast.error("Error adding certificate");
            } else {
                toast.success("Certificate added successfully");
            }
        } catch (error) {
            toast.error("Error adding certificate");
        }
    };

    const updateCertificate = async (currentId, certificateId, updatedData) => {
        try {
            await axios.post(`${API_URL}/admin/editCertificate`, {
                currentId,
                certificateId,
                updatedData
            });
            toast.success("Certificate updated successfully");
        } catch (error) {
            toast.error("Failed to update certificate");
        }
    };

    const deleteCertificate = async (currentId, certificateId) => {
        try {
            await axios.post(`${API_URL}/admin/deleteCertificate`, {
                currentId,
                certificateId
            });
            toast.success("Certificate deleted successfully");
        } catch (error) {
            toast.error("Failed to delete certificate");
        }
    };

    return (
        <CertificateContext.Provider value={{ addCertificate, updateCertificate, deleteCertificate }}>
            {props.children}
        </CertificateContext.Provider>
    );
};

export default CertificateState;
