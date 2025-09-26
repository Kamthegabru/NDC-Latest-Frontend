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
  const [selectedCompanyEmail, setSelectedCompanyEmail] = useState(""); // NEW

  const [packageId, setPackageId] = useState("");
  const [orderReasonId, setOrderReasonId] = useState("");
  const [dotAgency, setDotAgency] = useState("");
  const [caseNumber, setCaseNumber] = useState("");

  const [selectedSiteId, setSelectedSiteId] = useState(null);
  const [selectedSiteDetails, setSelectedSiteDetails] = useState(null);
  const [finlSelectedSite, setFinalSelectedSite] = useState(null);
  const [savedPincode, setSavedPincode] = useState("");

  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    ssn: "",
    ssnState: "",
    dob: "",
    phone1: "",
    phone2: "",
    email: "",            // scheduling link email
    orderExpires: "",
    observed: "0",
    participantAddress: true,
    address: "",
    address2: "",
    city: "",
    state: "",
    zip: "",
    sendLink: false,      // default No
    donorPass: true,      // default Yes
    ccEmail: "",
  });

  const [siteInformation, setSiteInformation] = useState([]);
  const [siteInformationLoading, setSiteInformationLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  const hardReset = () => {
    setCurrentPosition(1);
    setMaxPosition(1);
    setFormData({
      firstName: "",
      middleName: "",
      lastName: "",
      ssn: "",
      ssnState: "",
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
      donorPass: true,
      ccEmail: "",
    });
    setAllCompanyData([]);          // keeps your previous behavior
    setCompanyId("");
    setSelectedCompanyEmail("");
    setPackageId("");
    setOrderReasonId("");
    setDotAgency("");
    setSelectedSiteId(null);
    setSelectedSiteDetails(null);
    setFinalSelectedSite(null);
    setSavedPincode("");
    setCaseNumber("");
  };

  const getSiteInformation = async () => {
    const token = Cookies.get("token");
    if (!token) {
      toast.error("Invalid access, Please login again");
      return;
    }
    try {
      setSiteInformationLoading(true);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      const { data } = await axios.post(`${API_URL}/admin/getSiteInformation`, {
        companyId,
        packageId,
        orderReasonId,
        dotAgency,
        formData,
      });

      if (formData.sendLink === true) {
        hardReset();
        toast.success("Scheduling URL sent successfully");
      } else {
        setSiteInformation(data?.data || []);
        setCaseNumber(data?.caseNumber || "");
      }
    } catch (error) {
      console.error("Error fetching site info:", error);
    } finally {
      setSiteInformationLoading(false);
    }
  };

  const handleNewPincode = async (data) => {
    const token = Cookies.get("token");
    if (!token) {
      toast.error("Invalid access, Please login again");
      return;
    }
    try {
      setFormData((prev) => ({ ...prev, zip: savedPincode })); // no direct mutation
      setSiteInformationLoading(true);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      const res = await axios.post(`${API_URL}/admin/handleNewPincode`, {
        caseNumber,
        data,
      });
      setSiteInformation(res?.data?.data || []);
    } catch (error) {
      console.error("Error fetching new pincode data:", error);
    } finally {
      setSiteInformationLoading(false);
    }
  };

  const newDriverSubmitOrder = async () => {
    const token = Cookies.get("token");
    if (!token) {
      toast.error("Invalid access, Please login again");
      return;
    }
    try {
      setSubmitLoading(true);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      const response = await axios.post(`${API_URL}/admin/newDriverSubmitOrder`, {
        companyId,
        packageId,
        orderReasonId,
        caseNumber,
        formData,
        finlSelectedSite,
      });
      toast.success(response?.data?.message || "Order submitted");
      hardReset();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Submit failed");
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <CreateNewOrderContext.Provider
      value={{
        // core selections
        orderReasonId,
        packageId,
        companyId,
        dotAgency,

        // companies
        allCompanyData,
        selectedCompanyEmail,      // NEW

        // wizard
        currentPosition,
        maxPosition,

        // form + sites
        formData,
        siteInformation,
        siteInformationLoading,
        selectedSiteId,
        selectedSiteDetails,
        finlSelectedSite,
        submitLoading,

        // setters / actions
        setDotAgency,
        handleNewPincode,
        setSavedPincode,
        setSubmitLoading,
        newDriverSubmitOrder,
        setFinalSelectedSite,
        setSelectedSiteDetails,
        setSelectedSiteId,
        setSiteInformation,
        getSiteInformation,
        setFormData,
        setAllCompanyData,
        setCurrentPosition,
        setCompanyId,
        setPackageId,
        setOrderReasonId,
        setMaxPosition,

        // expose so OrderInformation can store company email
        setSelectedCompanyEmail,   // NEW
      }}
    >
      {props.children}
    </CreateNewOrderContext.Provider>
  );
};

export default CreateNewOrderState;
