import React, { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import SettingContext from "./SettingContext";
const API_URL = process.env.REACT_APP_API_URL;

const SettingState = (props) => {
    const [settings, setSettings] = useState({
        sendWelcomeEmail: true,
        sendCustomerPDF: true,
        sendAgreementPDF: true,
        sendCertificatePDF: true,
        orgIdAndLocationCode: true,
    });

    // Fetch settings from backend
    const fetchSettings = async () => {
        const token = Cookies.get("token");
        if (token) {
            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
            try {
                const res = await axios.get(`${API_URL}/admin/getSettings`);
                setSettings(res.data.data);
            } catch (error) {
                toast.error("Failed to fetch settings");
            }
        } else {
            toast.error("Invalid access, Please login again");
        }
    };

    // Update a specific setting
    const updateSetting = async (settingKey, value) => {
        const token = Cookies.get("token");
        if (token) {
            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
            try {
                let endpoint = "";
                switch (settingKey) {
                    case "sendWelcomeEmail":
                        endpoint = "/admin/updateSendWelcomeEmail";
                        break;
                    case "sendCustomerPDF":
                        endpoint = "/admin/updateSendCustomerPDF";
                        break;
                    case "sendAgreementPDF":
                        endpoint = "/admin/updateSendAgreementPDF";
                        break;
                    case "sendCertificatePDF":
                        endpoint = "/admin/updateSendCertificatePDF";
                        break;
                    case "orgIdAndLocationCode":
                        endpoint = "/admin/updateOrgIdAndLocationCode";
                        break;
                    default:
                        toast.error("Invalid setting key");
                        return;
                }
                await axios.post(`${API_URL}${endpoint}`, { value });
                setSettings(prev => ({ ...prev, [settingKey]: value }));
                toast.success("Setting updated successfully");
            } catch (error) {
                toast.error("Failed to update setting");
            }
        } else {
            toast.error("Invalid access, Please login again");
        }
    };

    return (
        <SettingContext.Provider value={{ settings, fetchSettings, updateSetting }}>
            {props.children}
        </SettingContext.Provider>
    );
};

export default SettingState;