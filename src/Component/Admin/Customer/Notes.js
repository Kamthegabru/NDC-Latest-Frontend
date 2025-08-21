import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  Paper,
  Grid,
  Tooltip,
  CircularProgress
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import NoteAltIcon from "@mui/icons-material/NoteAlt";

import CustomerContext from "../../../Context/Admin/Customer/CustomerContext";
import NoteContext from "../../../Context/Admin/Customer/Notes/NoteContext";

const Notes = () => {
  const { getSingleUserData, currentId, userDetails } = React.useContext(CustomerContext);
  const { addNote, editNote, deleteNote } = React.useContext(NoteContext);

  const [notes, setNotes] = useState([]);
  const [input, setInput] = useState("");
  const [editIndex, setEditIndex] = useState(null);
  const [editText, setEditText] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userDetails?.notes) {
      setNotes(
        [...userDetails.notes].sort(
          (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
        )
      );
      setLoading(false);
    }
  }, [userDetails]);

  const handleAddNote = async () => {
    if (input.trim()) {
      await addNote(currentId, input.trim());
      await getSingleUserData(currentId);
      setInput("");
    }
  };

  const handleDeleteNote = async (id) => {
    await deleteNote(currentId, id);
    await getSingleUserData(currentId);
  };

  const handleEdit = (index) => {
    setEditIndex(index);
    setEditText(notes[index].text);
  };

  const handleSaveEdit = async () => {
    await editNote(currentId, notes[editIndex]._id, editText.trim());
    await getSingleUserData(currentId);
    setEditIndex(null);
    setEditText("");
  };

  const handleCancelEdit = () => {
    setEditIndex(null);
    setEditText("");
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 700, mx: "auto", mt: 4 }}>
      <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
        <NoteAltIcon sx={{ mr: 1, fontSize: 30, color: "#1976d2" }} />
        <Typography variant="h5" fontWeight="bold">
          Notes
        </Typography>
      </Box>

      <Box
        sx={{
          display: "flex",
          gap: 2,
          mb: 3,
          flexDirection: { xs: "column", sm: "row" }
        }}
      >
        <TextField
          label="Write a note"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          fullWidth
        />
        <Button
          variant="contained"
          onClick={handleAddNote}
          sx={{
            minWidth: { sm: "120px" },
            whiteSpace: "nowrap",
            backgroundColor: "#0a0a42",
            "&:hover": { backgroundColor: "#08083a" }
          }}
        >
          Add Note
        </Button>
      </Box>

      {notes.length === 0 ? (
        <Typography sx={{ textAlign: "center", color: "gray" }}>
          No notes yet.
        </Typography>
      ) : (
        <Grid container spacing={2}>
          {notes.map((note, index) => (
            <Grid item xs={12} sm={6} key={index}>
              <Paper
                elevation={3}
                sx={{
                  p: 2,
                  height: "100%",
                  backgroundColor: "#f5faff",
                  borderLeft: "4px solid #1976d2",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between"
                }}
              >
                {editIndex === index ? (
                  <Box>
                    <TextField
                      multiline
                      fullWidth
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                    />
                    <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 1 }}>
                      <Tooltip title="Save">
                        <IconButton onClick={handleSaveEdit}>
                          <SaveIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Cancel">
                        <IconButton onClick={handleCancelEdit}>
                          <CancelIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>
                ) : (
                  <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                      <Typography
                        variant="caption"
                        color="textSecondary"
                        sx={{ fontSize: "0.8rem" }}
                      >
                        By: <strong>{note.addedBy || "Staff Member"}</strong><br />
                        {new Date(note.timestamp).toLocaleString("en-US", {
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true
                        })}
                      </Typography>
                      <Box>
                        <Tooltip title="Edit">
                          <IconButton color="primary" onClick={() => handleEdit(index)}>
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton color="error" onClick={() => handleDeleteNote(note._id)}>
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </Box>

                    <Typography
                      sx={{
                        fontSize: "1rem",
                        whiteSpace: "pre-wrap",
                        wordBreak: "break-word",
                        flexGrow: 1
                      }}
                    >
                      {note.text}
                    </Typography>
                  </Box>
                )}
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default Notes;
