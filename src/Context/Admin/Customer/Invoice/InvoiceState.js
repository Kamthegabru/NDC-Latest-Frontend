import React from "react";
import InvoiceContext from "./InvoiceContext";
import axios from "axios";
import { toast } from "react-toastify";

const API_URL = process.env.REACT_APP_API_URL;

const InvoiceState = (props) => {

    const addInvoice = async (formData) => {
        try {
            const response = await axios.post(`${API_URL}/admin/uploadInvoice`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            if (response.status !== 200) {
                toast.error("Error adding invoice");
            } else {
                toast.success("Invoice added successfully");
            }
        } catch (error) {
            toast.error("Error adding invoice");
        }
    };

    const updateInvoice = async (currentId, invoiceId, updatedData) => {
        try {
            await axios.post(`${API_URL}/admin/editInvoice`, {
                currentId,
                invoiceId,
                updatedData
            });
            toast.success("Invoice updated successfully");
        } catch (error) {
            toast.error("Failed to update invoice");
        }
    };

    const deleteInvoice = async (currentId, invoiceId) => {
        try {
            await axios.post(`${API_URL}/admin/deleteInvoice`, {
                currentId,
                invoiceId
            });
            toast.success("Invoice deleted successfully");
        } catch (error) {
            toast.error("Failed to delete invoice");
        }
    };

    return (
        <InvoiceContext.Provider value={{ addInvoice, updateInvoice, deleteInvoice }}>
            {props.children}
        </InvoiceContext.Provider>
    );
};

export default InvoiceState;
