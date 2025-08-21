import React, { useState } from "react";
import CreateNewOrderContext from "./CreateNewOrderContext";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
const API_URL = process.env.REACT_APP_API_URL;

const CreateNewOrderState = (props) => {
    const [currentPosition, setCurrentPosition] = useState(1);
    const [maxPosition, setMaxPosition] = useState(1);

    const [allCompanyData, setAllCompanyData] = useState([]);
    const [companyId, setCompanyId] = useState("");
    const [packageId, setPackageId] = useState("");
    const [orderReasonId, setOrderReasonId] = useState("");
    const [dotAgency, setDotAgency] = useState("");
    const [caseNumber, setCaseNumber] = useState("");

    const [selectedSiteId, setSelectedSiteId] = useState(null);
    const [selectedSiteDetails, setSelectedSiteDetails] = useState(null);
    const [finlSelectedSite, setFinalSelectedSite] = useState(null)
    const [savedPincode, setSavedPincode] = useState("");

    const [formData, setFormData] = useState({
        firstName: "",
        middleName: "",
        lastName: "",
        ssn: "",
        dob: "",
        phone1: "",
        phone2: "",
        email: "",
        orderExpires: "",
        observed: "0",
        participantAddress: true,
        address: "",
        address2: "",
        city: "",
        state: "",
        zip: "",
        sendLink: false,
        ccEmail: ""
    });

    const [siteInformation, setSiteInformation] = useState([]);
    const [siteInformationLoading, setSiteInformationLoading] = useState(false);
    const [submitLoading, setSubmitLoading] = useState(false);

    const getSiteInformation = async () => {
        const token = Cookies.get("token");
        if (token) {
            setSiteInformationLoading(true);
            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
            await axios.post(`${API_URL}/user/getSiteInformation`, { companyId, packageId, orderReasonId, dotAgency,formData })
                .then(response => {
                    if (formData.sendLink === true) {
                        setCurrentPosition(1);
                        setMaxPosition(1);
                        setFormData({
                            firstName: "",
                            middleName: "",
                            lastName: "",
                            ssn: "",
                            dob: "",
                            phone1: "",
                            phone2: "",
                            email: "",
                            orderExpires: "",
                            observed: "0",
                            participantAddress: true,
                            address: "",
                            address2: "",
                            city: "",
                            state: "",
                            zip: "",
                            sendLink: false,
                            ccEmail: ""
                        })
                        setAllCompanyData([])
                        setCompanyId("");
                        setPackageId("");
                        setOrderReasonId("");
                        setDotAgency("");
                        toast.success("Scheduling URL sent successfully")
                    } else {
                        setSiteInformation(response.data.data);
                        setSiteInformationLoading(false);
                        setCaseNumber(response.data.caseNumber);
                    }
                })
                .catch((error) => {
                    setSiteInformationLoading(false);
                    console.error("Error fetching user details:", error);
                });
        } else {
            toast.error("Invalid access, Please login again");
        }
    }

    const handleNewPincode = async (data) => {
        const token = Cookies.get("token");
        formData.zip = savedPincode;
        if (token) {
            setSiteInformationLoading(true);
            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
            await axios.post(`${API_URL}/user/handleNewPincode`, { caseNumber, data })
                .then(response => {
                    setSiteInformation(response.data.data);
                    setSiteInformationLoading(false);
                })
                .catch((error) => {
                    setSiteInformationLoading(false);
                    console.error("Error fetching user details:", error);
                });
        } else {
            toast.error("Invalid access, Please login again");
        }
    }

    const newDriverSubmitOrder = async () => {
        const token = Cookies.get("token");
        if (token) {
            setSubmitLoading(true);
            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
            await axios.post(`${API_URL}/user/newDriverSubmitOrder`, { companyId, packageId, orderReasonId, caseNumber, formData, finlSelectedSite })
                .then(response => {
                    toast.success(response.data.message)
                    setSubmitLoading(false);
                    setAllCompanyData([])
                    setCompanyId("");
                    setPackageId("");
                    setOrderReasonId("");
                    setDotAgency("");
                    setFormData({
                        firstName: "",
                        middleName: "",
                        lastName: "",
                        ssn: "",
                        dob: "",
                        phone1: "",
                        phone2: "",
                        email: "",
                        orderExpires: "",
                        observed: "1",
                        participantAddress: true,
                        address: "",
                        address2: "",
                        city: "",
                        state: "",
                        zip: "",
                        sendLink: false,
                        ccEmail: ""
                    })
                })
                .catch((error) => {
                    toast.error(error?.response?.data?.message)
                });
        } else {
            toast.error("Invalid access, Please login again");
        }
    }

    return (
        <CreateNewOrderContext.Provider value={{ orderReasonId, packageId, companyId, allCompanyData, currentPosition, maxPosition, formData, siteInformation, siteInformationLoading, selectedSiteId, selectedSiteDetails, finlSelectedSite, submitLoading,dotAgency,setDotAgency, handleNewPincode, setSavedPincode, setSubmitLoading, newDriverSubmitOrder, setFinalSelectedSite, setSelectedSiteDetails, setSelectedSiteId, setSiteInformation, getSiteInformation, setFormData, setAllCompanyData, setCurrentPosition, setCompanyId, setPackageId, setOrderReasonId, setMaxPosition }}>
            {props.children}
        </CreateNewOrderContext.Provider>
    )
}

export default CreateNewOrderState;