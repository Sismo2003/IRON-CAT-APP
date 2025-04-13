import { createSlice } from "@reduxjs/toolkit";
import {
    getNotes,
    addNotes,
    updateNotes,
    deleteNotes,
    flagUpdate
} from './thunk';
import {toast} from "react-toastify";
import loading = toast.loading;
import {addTicket} from "../ticketManagement/thunk";

export const initialState = {
    notes: [],
    errors: {},
    loading: true,
};

const NotesSlice = createSlice({
    name: 'Notes',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        // get notes
        builder.addCase(getNotes.fulfilled, (state: any, action: any) => {
            state.notes = action.payload;
            state.loading = false;
        });
        builder.addCase(getNotes.rejected, (state: any, action: any) => {
            state.error = action.payload.error || null;
            state.loading = false;
        });
        builder.addCase(getNotes.pending, (state: any, action: any) => {
            state.loading = true;
        });
        //add notes
        builder.addCase(addNotes.fulfilled, (state: any, action: any) => {
            state.notes.unshift(action.payload);
            state.loading = false;
        });
        builder.addCase(addNotes.pending, (state: any, action: any) => {
            state.loading = true;
        });
        builder.addCase(addNotes.rejected, (state: any, action: any) => {
            state.error = action.payload.error || null;
            state.loading = false;
        });
        // update notes
        builder.addCase(updateNotes.fulfilled, (state: any, action: any) => {
            state.notes = state.notes.map((notes: any) =>
                notes.id === action.payload.id
                    ? { ...notes, ...action.payload }
                    : notes
            );
            state.loading = false;
        });
        builder.addCase(updateNotes.pending, (state: any, action: any) => {
            state.loading = true;
        });
        builder.addCase(updateNotes.rejected, (state: any, action: any) => {
            state.error = action.payload.error || null;
            state.loading = false;
        });
        // delete notes
        builder.addCase(deleteNotes.fulfilled, (state: any, action: any) => {
            state.notes = state.notes.filter(
                (notes: any) => notes.id.toString() !== action.payload.toString()
            );
            state.loading = false;
        });
        builder.addCase(deleteNotes.pending, (state: any, action: any) => {
            state.loading = true;
        });
        builder.addCase(deleteNotes.rejected, (state: any, action: any) => {
            state.error = action.payload.error || null;
            state.loading = false;
        });
        // update note flag for favorite
        builder.addCase(flagUpdate.fulfilled, (state: any, action: any) => {
            state.notes = state.notes.map((note: any) =>
              note.id === action.payload.id
                ? { ...note, fav_flag: action.payload.flag }
                : note
            );
            // state.loading = false;
        });
        // i delete this cuz i dont like how everytime you mark a note as favorite shows the load screen!
        // builder.addCase(flagUpdate.pending, (state: any, action: any) => {
            // state.loading = true;
        // });
        builder.addCase(flagUpdate.rejected, (state: any, action: any) => {
            state.error = action.payload.error || null;
            // state.loading = false;
        });
    }
});

export default NotesSlice.reducer;