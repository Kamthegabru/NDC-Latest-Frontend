import React from "react";
import DocumentContext from "./DocumentContext";
import axios from "axios";
import { toast } from "react-toastify";

const API_URL = process.env.REACT_APP_API_URL;

const DocumentState = (props) => {

    const uploadDocument = async (formData) => {
        try {
            const response = await axios.post(`${API_URL}/admin/uploadDocument`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            if (response.status !== 200) {
                toast.error("Error uploading document");
            } else {
                toast.success("Document uploaded successfully");
            }
        } catch (error) {
            toast.error("Error uploading document");
        }
    };

    const editDocument = async (currentId, documentId, updatedData) => {
        try {
            await axios.post(`${API_URL}/admin/editDocument`, {
                currentId,
                documentId,
                updatedData
            });
            toast.success("Document updated successfully");
        } catch (error) {
            toast.error("Failed to update document");
        }
    };

    const deleteDocument = async (currentId, documentId) => {
        try {
            await axios.post(`${API_URL}/admin/deleteDocument`, {
                currentId,
                documentId
            });
            toast.success("Document deleted successfully");
        } catch (error) {
            toast.error("Failed to delete document");
        }
    };

    return (
        <DocumentContext.Provider value={{ uploadDocument, editDocument, deleteDocument }}>
            {props.children}
        </DocumentContext.Provider>
    );
};

export default DocumentState;
