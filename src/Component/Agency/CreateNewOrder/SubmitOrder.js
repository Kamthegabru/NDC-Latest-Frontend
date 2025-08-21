import React, { useContext, useEffect, useState } from "react";
import {
    Box,
    Typography,
    Grid,
    Paper,
    Button,
    CircularProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import CreateNewOrderContext from "../../../Context/Agency/CreateNewOrder/CreateNewOrderContext";;

function SubmitOrder() {
    const navigate = useNavigate();
    const {
        finlSelectedSite,
        formData,
        orderReasonId,
        packageId,
        companyId,
        allCompanyData,
        newDriverSubmitOrder,
        submitLoading, setCurrentPosition, setMaxPosition
    } = useContext(CreateNewOrderContext);

    const [openSuccessModal, setOpenSuccessModal] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        if (submitted && !submitLoading) {
            setOpenSuccessModal(true);
            const timeout = setTimeout(() => {
                setOpenSuccessModal(false);
                setCurrentPosition(1);
                setMaxPosition(1);
            }, 5000);
            return () => clearTimeout(timeout);
        }
        // eslint-disable-next-line
    }, [submitLoading, submitted, navigate]);

    const [companyName, setCompanyName] = useState("—");
    const [orderReasonName, setOrderReasonName] = useState("—");
    const [packageName, setPackageName] = useState("—");

    useEffect(() => {
        if (!companyId || !allCompanyData?.length) return;

        const selectedCompany = allCompanyData.find((company) => company._id === companyId);
        if (!selectedCompany) return;

        setCompanyName(selectedCompany.companyName || "—");
        setOrderReasonName(orderReasonId || "—");
        setPackageName(packageId || "—");

    }, [companyId, orderReasonId, packageId, allCompanyData]);

    const handleSubmit = () => {
        newDriverSubmitOrder();
        setSubmitted(true);
    };

    const handleCloseModal = () => {
        setOpenSuccessModal(false);
        setCurrentPosition(1);
        setMaxPosition(1);
    };

    function formatDateTime(input) {
        if (!input) return "N/A"; // covers undefined, null, empty
        const [date, time] = input.split("T");
        const [hour, minute] = time.split(":");
        return `${date} ${hour}:${minute}:00`;
    }

    return (
        <Box p={3}>
            <Typography variant="h5" gutterBottom>
                Submit Order
            </Typography>
            <Typography variant="body1" gutterBottom>
                Review the order details and submit order.
            </Typography>

            <Paper variant="outlined" sx={{ p: 3, mt: 2 }}>
                <Typography variant="h6" gutterBottom>
                    Order Information
                </Typography>
                <Grid container spacing={1}>
                    <Grid item xs={12} sm={6}>
                        <strong>Order Reason:</strong> {orderReasonName}
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <strong>Package:</strong> {packageName}
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <strong>Observed Collection:</strong> {formData?.observed === "1" ? "Yes" : "No"}
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <strong>Expiration Date:</strong> {formatDateTime(formData?.orderExpires)}
                    </Grid>
                    <Grid item xs={12}>
                        <strong>Company Location:</strong> {companyName}
                    </Grid>
                    <Grid item xs={12}>
                        <strong>Collection Site:</strong> {finlSelectedSite?.collection_site_name}
                    </Grid>
                    <Grid item xs={12}>
                        <strong>Collection Site Address:</strong>{" "}
                        {finlSelectedSite?.collection_site_address},{" "}
                        {finlSelectedSite?.collection_site_city},{" "}
                        {finlSelectedSite?.collection_site_country},{" "}
                        {finlSelectedSite?.collection_site_zip}
                    </Grid>
                </Grid>
            </Paper>

            <Paper variant="outlined" sx={{ p: 3, mt: 3 }}>
                <Typography variant="h6" gutterBottom>
                    Participant Information
                </Typography>
                <Grid container spacing={1}>
                    <Grid item xs={12} sm={6}>
                        <strong>First Name:</strong> {formData?.firstName}
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <strong>Last Name:</strong> {formData?.lastName}
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <strong>Primary ID:</strong> {formData?.ssn}
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <strong>Phone:</strong> {formData?.phone1}
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <strong>Email:</strong> {"—"}
                    </Grid>
                    <Grid item xs={12}>
                        <strong>Address:</strong> {formData.address}, {formData.city}, {formData.state}, {formData.zip}
                    </Grid>
                </Grid>
            </Paper>

            <Box display="flex" justifyContent="flex-end" mt={4}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSubmit}
                    disabled={submitLoading}
                    startIcon={submitLoading && <CircularProgress size={20} color="inherit" />}
                >
                    {submitLoading ? "Submitting..." : "Submit Order"}
                </Button>
            </Box>

            {/* Success Modal */}
            <Dialog open={openSuccessModal} onClose={handleCloseModal}>
                <DialogTitle>Order Placed Successfully</DialogTitle>
                <DialogContent>
                    <Typography>The order has been placed successfully. Redirecting...</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseModal} color="primary" variant="contained">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

export default SubmitOrder;
