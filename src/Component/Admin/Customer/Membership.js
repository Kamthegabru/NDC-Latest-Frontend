import React, { useState, useContext, useEffect } from "react";
import {
  Box, Card, CardContent, Typography, IconButton, Modal,
  TextField, Button, Grid, Divider, useMediaQuery, CircularProgress,
  Chip
} from "@mui/material";
import { MenuItem, FormControl, InputLabel, Select } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { useTheme } from "@mui/material/styles";
import CustomerContext from "../../../Context/Admin/Customer/CustomerContext";

// Reusable Label + Value UI block
const LabelValue = ({ label, value }) => (
  <>
    <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: 'grey' }}>{label}</Typography>
    <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#003366' }}>{value || "N/A"}</Typography>
  </>
);

const MembershipInformation = () => {
  const { userDetails, updateMembershipInformation } = useContext(CustomerContext);
  const [open, setOpen] = useState(false);
  const [membershipInfo, setMembershipInfo] = useState({});
  const [tempMembershipInfo, setTempMembershipInfo] = useState({});
  const [loading, setLoading] = useState(true);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    const date = new Date(dateStr);
    if (isNaN(date)) return "N/A";
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  };

  useEffect(() => {
    if (userDetails?.Membership) {
      const mem = userDetails.Membership;
      setMembershipInfo(mem);
      setTempMembershipInfo({
        ...mem,
        planStartDate: mem.planStartDate?.slice(0, 10) || "",
        planEndDate: mem.planEndDate?.slice(0, 10) || "",
        package: mem.package?.map(p => p.package_name) || [],
        order_reason: mem.order_reason?.map(r => r.order_reason_name) || [],
      });
      setLoading(false);
    }
  }, [userDetails]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleChange = (e) => {
    setTempMembershipInfo({ ...tempMembershipInfo, [e.target.name]: e.target.value });
  };

  const handleRemoveItem = (field, item) => {
    setTempMembershipInfo(prev => ({
      ...prev,
      [field]: prev[field].filter(val => val !== item)
    }));
  };

  const handleUpdate = async () => {
    const formattedInfo = {
      ...tempMembershipInfo,
      package: tempMembershipInfo.package.map(name => ({ package_name: name })),
      order_reason: tempMembershipInfo.order_reason.map(name => ({ order_reason_name: name })),
    };
    await updateMembershipInformation(formattedInfo);
    setOpen(false);
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: "40px", px: 2 }}>
      <Card sx={{ width: isMobile ? "100%" : 600, p: 3, position: "relative", borderRadius: 3, boxShadow: 3 }}>
        <IconButton onClick={handleOpen} sx={{ position: "absolute", top: 15, right: 15, color: "primary.main" }}>
          <EditIcon />
        </IconButton>
        <CardContent>
          <Typography variant="h5" sx={{ mb: 3, fontWeight: "bold", color: "primary.main" }}>
            Membership Information
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <LabelValue label="Current Plan:" value={membershipInfo.planName} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <LabelValue label="Join Date:" value={formatDate(membershipInfo.planStartDate)} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <LabelValue label="Renewal Date:" value={formatDate(membershipInfo.planEndDate)} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: 'grey' }}>Status:</Typography>
              <Typography
                variant="body1"
                sx={{
                  fontWeight: 'bold',
                  color:
                    membershipInfo.planStatus === "Active" ? "green" :
                      membershipInfo.planStatus === "Pending" ? "orange" :
                        membershipInfo.planStatus === "Inactive" ? "red" :
                          "#003366"
                }}
              >
                {membershipInfo.planStatus || "N/A"}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <LabelValue label="OrgId:" value={membershipInfo.orgId} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <LabelValue label="Location Code:" value={membershipInfo.locationCode} />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: 'grey' }}>Packages:</Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1 }}>
                {membershipInfo.package?.length > 0 ? (
                  membershipInfo.package.map((pkg, index) => (
                    <Chip
                      key={index}
                      label={pkg.package_name}
                      variant="outlined"
                      sx={{ borderColor: '#003366', color: '#003366', fontWeight: 'bold' }}
                    />
                  ))
                ) : (
                  <Typography variant="body2" color="text.secondary">N/A</Typography>
                )}
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: 'grey' }}>Reason Names:</Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1 }}>
                {membershipInfo.order_reason?.length > 0 ? (
                  membershipInfo.order_reason.map((reason, index) => (
                    <Chip
                      key={index}
                      label={reason.order_reason_name}
                      variant="outlined"
                      sx={{ borderColor: '#003366', color: '#003366', fontWeight: 'bold' }}
                    />
                  ))
                ) : (
                  <Typography variant="body2" color="text.secondary">N/A</Typography>
                )}
              </Box>
            </Grid>

            {/* <Grid item xs={12}>
              <LabelValue
                label="Reason Names:"
                value={
                  membershipInfo.order_reason?.length
                    ? membershipInfo.order_reason.map((reason) => reason.order_reason_name).join(", ")
                    : "N/A"
                }
              />
            </Grid> */}
          </Grid>
        </CardContent>
      </Card>

      {/* Edit Modal */}
      <Modal open={open} onClose={handleClose}>
        <Box sx={{ width: isMobile ? "90%" : 500, bgcolor: "background.paper", p: 4, m: "auto", mt: 10, borderRadius: 3, boxShadow: 5 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold", color: "primary.main" }}>
            Edit Membership Information
          </Typography>
          <Divider sx={{ mb: 3 }} />
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField name="selectedPlan" fullWidth size="small" label="Current Plan" value={tempMembershipInfo.selectedPlan || ""} onChange={handleChange} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField name="planStartDate" type="date" fullWidth size="small" label="Join Date" value={tempMembershipInfo.planStartDate || ""} onChange={handleChange} InputLabelProps={{ shrink: true }} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="planEndDate"
                type="date"
                fullWidth
                size="small"
                label="Expiry Date"
                value={tempMembershipInfo.planEndDate || ""}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                inputProps={{
                  min: tempMembershipInfo.planStartDate || undefined,
                }}
              />

            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth size="small">
                <InputLabel>Status</InputLabel>
                <Select name="planStatus" value={tempMembershipInfo.planStatus || ""} onChange={handleChange} label="Status">
                  <MenuItem value="Active">Active</MenuItem>
                  <MenuItem value="Inactive">Inactive</MenuItem>
                  <MenuItem value="Pending">Pending</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField name="orgId" fullWidth size="small" label="OrgId" value={tempMembershipInfo.orgId || ""} onChange={handleChange} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField name="locationCode" fullWidth size="small" label="Location Code" value={tempMembershipInfo.locationCode || ""} onChange={handleChange} />
            </Grid>

            {/* Selected Packages Chips */}
            <Grid item xs={12}>
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: 'grey' }}>Selected Packages:</Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1 }}>
                {tempMembershipInfo.package?.map((item, i) => (
                  <Chip key={i} label={item} onDelete={() => handleRemoveItem("package", item)} />
                ))}
              </Box>
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth size="small">
                <InputLabel>Packages</InputLabel>
                <Select
                  multiple
                  name="package"
                  label="Packages"
                  value={tempMembershipInfo.package || []}
                  onChange={(e) => setTempMembershipInfo({ ...tempMembershipInfo, package: e.target.value })}
                  renderValue={(selected) => selected.join(", ")}
                >
                  {[
                    "NDCDEMO",
                    "10 PANEL URINE",
                    "5 PANEL URINE DOT LIKE",
                    "7 PANEL URINE",
                    "9 PANEL URINE",
                    "DOT BAT",
                    "DOT PANEL",
                    "DOT PANEL + DOT BAT",
                    "DOT PHYSICAL"
                  ].map(pkg => (
                    <MenuItem key={pkg} value={pkg}>{pkg}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Selected Reasons Chips */}
            <Grid item xs={12}>
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: 'grey' }}>Selected Reasons:</Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1 }}>
                {tempMembershipInfo.order_reason?.map((item, i) => (
                  <Chip key={i} label={item} onDelete={() => handleRemoveItem("order_reason", item)} />
                ))}
              </Box>
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth size="small">
                <InputLabel>Reason Names</InputLabel>
                <Select
                  multiple
                  name="order_reason"
                  label="Reason Names"
                  value={tempMembershipInfo.order_reason || []}
                  onChange={(e) => setTempMembershipInfo({ ...tempMembershipInfo, order_reason: e.target.value })}
                  renderValue={(selected) => selected.join(", ")}
                >
                  {[
                    "PRE-EMPLOYMENT", "RANDOM", "POST-ACCIDENT", "REASONABLE SUSPICION/CAUSE",
                    "FOLLOW-UP", "PERIODIC", "ANNUAL", "RETURN TO DUTY", "FITNESS FOR DUTY",
                    "JOB TRANSFER", "PROMOTION", "PRE-SITE ACCESS", "SWEEP", "COURT ORDERED",
                    "CONTRACTUAL", "PROBATION", "OTHER"
                  ].map(reason => (
                    <MenuItem key={reason} value={reason}>{reason}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          <Box sx={{ mt: 4, display: "flex", justifyContent: "flex-end", gap: 2 }}>
            <Button onClick={handleClose} variant="outlined">Cancel</Button>
            <Button onClick={handleUpdate} variant="contained">Update</Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default MembershipInformation;
