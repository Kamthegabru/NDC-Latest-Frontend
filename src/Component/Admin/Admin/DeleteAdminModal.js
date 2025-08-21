import React, { useContext } from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Typography
} from "@mui/material";

import AdminContext from "../../../Context/Admin/Admin/AdminContext";

function DeleteAdminModal({ open, onClose, admin }) {
  const { deleteAdminAccount } = useContext(AdminContext);

  const handleDelete = () => {
    deleteAdminAccount(admin._id);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Delete Admin</DialogTitle>
      <DialogContent>
        <Typography>
          Are you sure you want to delete <strong>{admin.name}</strong>?
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">Cancel</Button>
        <Button onClick={handleDelete} variant="contained" color="error">Delete</Button>
      </DialogActions>
    </Dialog>
  );
}

export default DeleteAdminModal;
