import React from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Box, Button, Typography
} from "@mui/material";

const toISO = (v) => (v ? new Date(v).toISOString() : "");

// Build normalized prefill directly from a Result row (now flat in DB)
function buildPrefillFromRow(row) {
  return {
    // company / order
    companyName: row.companyName || "",
    companyEmail: "", // optional
    packageName: row.packageName || row.selectedPackageId || "",
    orderReason: row.orderReason || row.testType || row.selectedOrderReasonId || "",
    dotAgency: row.dotAgency || "",

    // participant
    firstName: row.firstName || "",
    middleName: row.middleName || "",
    lastName: row.lastName || "",
    ssnEid: row.ssnEid || row.licenseNumber || "",
    dob: toISO(row.dobString || ""),
    phone1: row.phone1 || "",
    phone2: row.phone2 || "",
    observed: !!row.observedBool,
    orderExpires: row.orderExpires || "",

    // address
    addr1: row.address || "",
    addr2: row.address2 || "",
    city: row.city || "",
    stateShort: row.state || "",
    zip: row.zip || "",

    // comms
    sendSchedulingLink: !!row.sendLink,
    sendDonorPass: !!row.donorPass,
    email: row.email || "",
    ccEmails: row.ccEmail || "",
  };
}

export default function Reschedule({
  open,
  onClose,
  row,         // a row from results table
  onConfirm,   // (prefill) => parent opens <RescheduleOrder prefill={prefill} />
}) {
  const handleConfirm = () => {
    const prefill = buildPrefillFromRow(row || {});
    onConfirm?.(prefill);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 700 }}>Confirm Reschedule</DialogTitle>
      <DialogContent dividers>
        <Box sx={{ py: 1 }}>
          <Typography variant="body2" color="text.secondary">
            We’ll reuse the existing order flow with company, participant, and order details pre-filled from this case.
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleConfirm}>Confirm Reschedule</Button>
      </DialogActions>
    </Dialog>
  );
}
