// src/components/DisplayResult.js

import React, { useContext, useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  CircularProgress,
  MenuItem,
  TextField,
  Box
} from "@mui/material";
import { Visibility, Download, Edit, Delete } from "@mui/icons-material";
import CustomerContext from "../../../../Context/Admin/Customer/CustomerContext";
import ResultContext from "../../../../Context/Admin/Customer/Result/ResultContext";

function DisplayResult() {
  const { currentId, userDetails, getSingleUserData } = useContext(CustomerContext);
  const { updateResult, deleteResult }             = useContext(ResultContext);

  const [loading, setLoading]         = useState(true);
  const [results, setResults]         = useState([]);
  const [openModal, setOpenModal]     = useState(null);
  const [selectedResult, setSelectedResult] = useState(null);
  const [editData, setEditData]       = useState({});
  const [previewUrl, setPreviewUrl]   = useState(null);

  // Load user results on mount / update
  useEffect(() => {
    if (userDetails?.results) {
      setResults(userDetails.results);
      setLoading(false);
    }
  }, [userDetails]);

  // Clean up object URL on unmount / change
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleOpen = (type, result) => {
    setSelectedResult(result);
    setEditData({ status: result.resultStatus });
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setOpenModal(type);
  };

  const handleClose = () => {
    setOpenModal(null);
    setSelectedResult(null);
    setEditData({});
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
  };

  // Download a single file from its data-URI
  const downloadFile = (file) => {
    const link = document.createElement("a");
    link.href = file.url;
    link.download = file.filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Handle result update (status + optional file)
  const handleUpdate = async () => {
    const formData = new FormData();
    formData.append("currentId", currentId);
    formData.append("resultId", selectedResult._id);
    formData.append("updatedData", JSON.stringify(editData));
    const fileInput = document.querySelector("input[type='file']");
    if (previewUrl && fileInput && fileInput.files[0]) {
      formData.append("file", fileInput.files[0]);
    }
    await updateResult(formData);
    getSingleUserData(currentId);
    handleClose();
  };

  // Handle result deletion
  const handleDelete = async () => {
    await deleteResult(currentId, selectedResult._id);
    getSingleUserData(currentId);
    handleClose();
  };

  // Preview an uploaded image before update
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const objectURL = URL.createObjectURL(file);
    setPreviewUrl(objectURL);

    const reader = new FileReader();
    reader.onload = (ev) => {
      const base64 = ev.target.result.split(",")[1];
      setEditData((prev) => ({
        ...prev,
        file: { data: Array.from(atob(base64), c => c.charCodeAt(0)) },
        mimeType: file.type
      }));
    };
    reader.readAsDataURL(file);
  };

  if (loading) {
    return <CircularProgress sx={{ mt: 4 }} />;
  }

  return (
    <TableContainer>
      <Table>
        <TableHead sx={{ backgroundColor: "#0b2f6a" }}>
          <TableRow>
            {["Sr","Name","License #","Test Date","Test Type","Order Status","Result Status","Case Number","Actions"].map((h,i) => (
              <TableCell key={i} sx={{ color: "white" }}>
                {h}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>

        <TableBody>
          {results.map((result, idx) => (
            <TableRow key={result._id} hover>
              <TableCell>{idx + 1}</TableCell>
              <TableCell>{result.driverName}</TableCell>
              <TableCell>{result.licenseNumber}</TableCell>
              <TableCell>{new Date(result.date).toLocaleDateString("en-US")}</TableCell>
              <TableCell>{result.testType}</TableCell>
              <TableCell>
                <Typography sx={{
                  color:
                    result.orderStatus.toLowerCase() === "pending"   ? "red" :
                    result.orderStatus.toLowerCase() === "completed" ? "green" : "orange",
                  fontWeight: "bold"
                }}>
                  {result.orderStatus}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography sx={{
                  color:
                    result.resultStatus.toLowerCase() === "positive" ? "red" :
                    result.resultStatus.toLowerCase() === "negative" ? "green" : "orange",
                  fontWeight: "bold"
                }}>
                  {result.resultStatus}
                </Typography>
              </TableCell>
              <TableCell>{result.caseNumber}</TableCell>
              <TableCell align="right">
                <IconButton onClick={() => handleOpen("view", result)}><Visibility/></IconButton>
                <IconButton onClick={() => handleOpen("download", result)}><Download/></IconButton>
                <IconButton onClick={() => handleOpen("edit", result)}><Edit/></IconButton>
                <IconButton onClick={() => handleOpen("delete", result)}><Delete/></IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* View Modal */}
      <Dialog open={openModal==="view"} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Result Preview</DialogTitle>
        <DialogContent dividers>
          {selectedResult?.resultImages?.length > 0 ? (
            selectedResult.resultImages.map((file,i) => {
              if (file.mimeType.startsWith("image/")) {
                return (
                  <Box key={i} component="img"
                    src={file.url}
                    alt={file.filename}
                    sx={{ width: "100%", mt: 2, borderRadius: 1 }}
                  />
                );
              } else if (file.mimeType === "application/pdf") {
                return (
                  <iframe key={i}
                    src={file.url}
                    title={file.filename}
                    width="100%" height="400px"
                    style={{ borderRadius: 8, marginTop: "1rem" }}
                  />
                );
              } else {
                return (
                  <Typography key={i} sx={{ mt: 2, fontStyle: "italic" }}>
                    Cannot preview {file.filename}. Please download.
                  </Typography>
                );
              }
            })
          ) : (
            <Typography>No files to preview.</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Download Modal */}
      <Dialog open={openModal==="download"} onClose={handleClose}>
        <DialogTitle>Download Files</DialogTitle>
        <DialogContent dividers>
          {selectedResult?.resultImages?.length > 0 ? (
            selectedResult.resultImages.map((file,i) => (
              <Button
                key={i}
                fullWidth
                sx={{ mb: 1 }}
                onClick={() => downloadFile(file)}
              >
                {file.filename}
              </Button>
            ))
          ) : (
            <Typography>No files available for download.</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
        </DialogActions>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={openModal==="edit"} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Result</DialogTitle>
        <DialogContent dividers>
          <TextField
            select
            label="Status"
            margin="dense"
            fullWidth
            value={editData.status || ""}
            onChange={e => setEditData({ ...editData, status: e.target.value })}
          >
            <MenuItem value="">Select Status</MenuItem>
            <MenuItem value="Pending">Pending</MenuItem>
            <MenuItem value="Positive">Positive</MenuItem>
            <MenuItem value="Negative">Negative</MenuItem>
            <MenuItem value="In Progress">In Progress</MenuItem>
          </TextField>

          <Button variant="contained" component="label" sx={{ mt: 2 }}>
            Upload Image
            <input type="file" hidden accept="image/*" onChange={handleImageUpload} />
          </Button>

          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2">Image Preview:</Typography>
            {previewUrl ? (
              <Box component="img" src={previewUrl} alt="New Preview" sx={{ width: "100%", borderRadius: 1 }} />
            ) : selectedResult?.resultImages?.[0] && selectedResult.resultImages[0].mimeType.startsWith("image/") ? (
              <Box component="img" src={selectedResult.resultImages[0].url} alt="Current" sx={{ width: "100%", borderRadius: 1 }} />
            ) : (
              <Typography color="text.secondary">No image available.</Typography>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleUpdate} variant="contained" color="primary">Update</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Modal */}
      <Dialog open={openModal==="delete"} onClose={handleClose}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this result?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleDelete} color="secondary" variant="contained">Delete</Button>
        </DialogActions>
      </Dialog>
    </TableContainer>
  );
}

export default DisplayResult;
