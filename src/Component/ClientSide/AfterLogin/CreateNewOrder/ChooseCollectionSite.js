import React, { useState, useContext } from "react";
import {
    Grid,
    Card,
    CardContent,
    Typography,
    Button,
    Pagination,
    Box,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    CircularProgress,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CreateNewOrderContext from "../../../../Context/ClientSide/AfterLogin/CreateNewOrder/CreateNewOrderContext";

function ChooseCollectionSite() {
    const {
        currentPosition,
        maxPosition,
        setCurrentPosition,
        setMaxPosition,
        siteInformation,
        siteInformationLoading,
        selectedSiteId, selectedSiteDetails, setSelectedSiteDetails, setSelectedSiteId, setFinalSelectedSite, setSavedPincode, handleNewPincode
    } = useContext(CreateNewOrderContext);

    const [currentPage, setCurrentPage] = useState(1);
    const [openModal, setOpenModal] = useState(false);
    const [pincodeModalOpen, setPincodeModalOpen] = useState(false);
    const [enteredPincode, setEnteredPincode] = useState("");

    const sitesPerPage = 6;

    const indexOfLastSite = currentPage * sitesPerPage;
    const indexOfFirstSite = indexOfLastSite - sitesPerPage;
    const currentSites = siteInformation.slice(indexOfFirstSite, indexOfLastSite);
    const totalPages = Math.ceil(siteInformation.length / sitesPerPage);

    const handleSelectSite = (site) => {
        setSelectedSiteId(site.collection_site_link_id);
        setFinalSelectedSite(site)
    };

    const handlePrevious = () => {
        setCurrentPosition(currentPosition - 1);
    };

    const handleContinue = () => {
        if (currentPosition === maxPosition) {
            setMaxPosition(maxPosition + 1);
        }
        setCurrentPosition(currentPosition + 1);
    };

    const handleOpenModal = (site) => {
        setSelectedSiteDetails(site);
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setSelectedSiteDetails(null);
    };

    const handlechangePincode = (data) => {
        handleNewPincode(data)
    }

    if (siteInformationLoading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box p={3}>
            <Box display="flex" justifyContent="flex-end" mb={2}>
                <Button variant="outlined" onClick={() => setPincodeModalOpen(true)}>
                    Change Zipcode
                </Button>
            </Box>
            <Typography variant="h5" fontWeight={600} align="center" gutterBottom>
                Choose a Collection Site
            </Typography>

            <Grid container spacing={3}>
                {currentSites.map((site) => {
                    const isSelected = selectedSiteId === site.collection_site_link_id;

                    return (
                        <Grid item xs={12} sm={6} key={site.collection_site_link_id}>
                            <Card
                                variant="outlined"
                                sx={{
                                    borderColor: isSelected ? 'primary.main' : 'grey.300',
                                    backgroundColor: isSelected ? 'primary.light' : '#fff',
                                    cursor: 'pointer',
                                    transition: '0.3s',
                                    '&:hover': {
                                        boxShadow: 3
                                    },
                                    position: 'relative'
                                }}
                                onClick={() => handleSelectSite(site)}
                            >
                                <CardContent>
                                    {isSelected && (
                                        <CheckCircleIcon
                                            color="primary"
                                            sx={{ position: 'absolute', top: 8, right: 8 }}
                                        />
                                    )}
                                    <Typography
                                        variant="subtitle1"
                                        fontWeight={600}
                                        textTransform="uppercase"
                                        gutterBottom
                                    >
                                        {site.collection_site_name}
                                    </Typography>
                                    <Typography variant="body2" color="">
                                        {site.collection_site_address}
                                    </Typography>
                                    <Typography variant="" color="">
                                        Distance: {site.distance_miles_numeric}
                                    </Typography>
                                    <Box>
                                        <Typography color="">
                                            Site Type: {site.collection_site_type}
                                        </Typography>
                                        <Typography color="">
                                            Lab Type: {site.resulting_vendor_name}
                                        </Typography>

                                    </Box>

                                    <Box display="flex" justifyContent="space-between" mt={2}>
                                        <Button
                                            size="small"
                                            variant="contained"
                                            sx={{
                                                backgroundColor: 'black',
                                                color: 'white',
                                                '&:hover': {
                                                    backgroundColor: '#333'
                                                }
                                            }}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleOpenModal(site);
                                            }}
                                        >
                                            More Details
                                        </Button>

                                        <Button
                                            size="small"
                                            variant={isSelected ? "contained" : "outlined"}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleSelectSite(site);
                                            }}
                                        >
                                            {isSelected ? "Selected" : "Select Site"}
                                        </Button>
                                    </Box>

                                </CardContent>
                            </Card>
                        </Grid>
                    );
                })}
            </Grid>

            <Dialog open={pincodeModalOpen} onClose={() => setPincodeModalOpen(false)} fullWidth maxWidth="xs">
                <DialogTitle>Change Pincode</DialogTitle>
                <DialogContent>
                    <Typography variant="body2" mb={1}>Enter new pincode:</Typography>
                    <input
                        type="text"
                        value={enteredPincode}
                        onChange={(e) => setEnteredPincode(e.target.value)}
                        style={{
                            width: "100%",
                            padding: "10px",
                            fontSize: "16px",
                            border: "1px solid #ccc",
                            borderRadius: "4px"
                        }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setPincodeModalOpen(false)}>Cancel</Button>
                    <Button
                        variant="contained"
                        onClick={() => {
                            setSavedPincode(enteredPincode);
                            setPincodeModalOpen(false);
                            handlechangePincode(enteredPincode);
                            // You can now send `savedPincode` to the backend on form submission
                        }}
                        disabled={!enteredPincode.trim()}
                    >
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>


            {/* Pagination */}
            <Box display="flex" justifyContent="center" mt={4}>
                <Pagination
                    count={totalPages}
                    page={currentPage}
                    onChange={(_, value) => setCurrentPage(value)}
                    color="primary"
                    variant="outlined"
                    shape="rounded"
                />
            </Box>

            {/* Navigation Buttons */}
            <Box display="flex" justifyContent="space-between" mt={4}>
                <Button
                    startIcon={<ArrowBackIcon />}
                    variant="outlined"
                    onClick={handlePrevious}
                >
                    Previous
                </Button>
                <Button
                    endIcon={<ArrowForwardIcon />}
                    variant="contained"
                    onClick={handleContinue}
                    disabled={!selectedSiteId}
                >
                    Continue
                </Button>
            </Box>

            <Dialog open={openModal} onClose={handleCloseModal} fullWidth maxWidth="sm">
                <DialogTitle>
                    <Box display="flex" justifyContent="center">
                        <img
                            src={
                                selectedSiteDetails?.resulting_vendor_name === "Quest Diagnostics"
                                    ? "./Images/Admin/Quest-Diagnostics-logo.png"
                                    : "./Images/Admin/Labcorp_Logo_updated_12-2020.svg.png"
                            }
                            alt="Vendor Logo"
                            style={{ maxWidth: "100px", height: "auto" }}
                        />
                    </Box>
                </DialogTitle>

                <DialogContent dividers>
                    <Typography gutterBottom><strong>Name:</strong> {selectedSiteDetails?.collection_site_name}</Typography>
                    <Typography gutterBottom><strong>Address:</strong> {selectedSiteDetails?.collection_site_address}</Typography>
                    <Typography gutterBottom><strong>Distance:</strong> {selectedSiteDetails?.distance_miles_numeric} miles</Typography>
                    <Typography gutterBottom><strong>Site Fax:</strong> {selectedSiteDetails?.collection_site_fax}</Typography>
                    <Typography gutterBottom><strong>Site Phone:</strong> {selectedSiteDetails?.collection_site_phone}</Typography>

                    <Box mt={3}>
                        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                            Weekly Operating Hours
                        </Typography>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell><strong>Day</strong></TableCell>
                                    <TableCell><strong>Opening</strong></TableCell>
                                    <TableCell><strong>Closing</strong></TableCell>
                                    <TableCell><strong>Open During Lunch</strong></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {[
                                    "mon",
                                    "tue",
                                    "wed",
                                    "thur",
                                    "fri",
                                    "sat",
                                    "sun",
                                ].map((day) => {
                                    const opening = selectedSiteDetails?.[`${day}_open`];
                                    const closing = selectedSiteDetails?.[`${day}_close`];
                                    const lunch = selectedSiteDetails?.[`${day}_open_lunch`] === "1";

                                    const isClosed = !opening && !closing;

                                    return (
                                        <TableRow key={day}>
                                            <TableCell sx={{ textTransform: "capitalize" }}>{day}</TableCell>
                                            <TableCell>{isClosed ? "Closed" : opening}</TableCell>
                                            <TableCell>{isClosed ? "—" : closing}</TableCell>
                                            <TableCell>{isClosed ? "—" : lunch ? "Yes" : "No"}</TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseModal}>Close</Button>
                </DialogActions>
            </Dialog>

        </Box >
    );
}

export default ChooseCollectionSite;
