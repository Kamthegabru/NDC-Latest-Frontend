import React from "react";
import NoteContext from "./NoteContext";
import axios from "axios";
import { toast } from "react-toastify";
const API_URL = process.env.REACT_APP_API_URL;

const NoteState = (props) => {

    const addNote = async (currentId, note) => {
        await axios.post(`${API_URL}/admin/addNote`, { note, currentId })
            .then(response => {
                const data = response.data;
                toast.success(data.message);
            })
            .catch(error => {
                toast.error("server error, Please try again later")
            });
    }

    const editNote = async (currentId, notesId, updatedNote) => {
        await axios.post(`${API_URL}/admin/editNote`, { currentId, notesId, updatedNote })
            .then(response => {
                const data = response.data;
                toast.success(data.message);
            })
            .catch(error => {
                toast.error("server error, Please try again later")
            });

    }

    const deleteNote = async (currentId, notesId) => {
        await axios.post(`${API_URL}/admin/deleteNote`, { currentId, notesId })
            .then(response => {
                const data = response.data;
                toast.success(data.message);
            })
            .catch(error => {
                toast.error("server error, Please try again later")
            });
    }

    return (
        <NoteContext.Provider value={{addNote, editNote, deleteNote}}>
            {props.children}
        </NoteContext.Provider>
    )
}

export default NoteState;