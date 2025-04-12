import { createSlice } from "@reduxjs/toolkit";
import {
    getNotes,
    addNotes,
    updateNotes,
    deleteNotes,
} from './thunk';
import {toast} from "react-toastify";
import loading = toast.loading;

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
        builder.addCase(getNotes.fulfilled, (state: any, action: any) => {
            state.notes = action.payload;
            state.loading = false;
        });
        builder.addCase(getNotes.rejected, (state: any, action: any) => {
            state.error = action.payload.error || null;
            state.loading = false;
        });
        builder.addCase(addNotes.fulfilled, (state: any, action: any) => {
            state.notes.unshift(action.payload);
            state.loading = false;
        });
        builder.addCase(addNotes.rejected, (state: any, action: any) => {
            state.error = action.payload.error || null;
            state.loading = false;
        });
        builder.addCase(updateNotes.fulfilled, (state: any, action: any) => {
            state.notes = state.notes.map((notes: any) =>
                notes.id === action.payload.id
                    ? { ...notes, ...action.payload }
                    : notes
            );
            state.loading = false;
        });
        builder.addCase(updateNotes.rejected, (state: any, action: any) => {
            state.error = action.payload.error || null;
            state.loading = false;
        });
        builder.addCase(deleteNotes.fulfilled, (state: any, action: any) => {
            state.notes = state.notes.filter(
                (notes: any) => notes.id.toString() !== action.payload.toString()
            );
            state.loading = false;
        });
        builder.addCase(deleteNotes.rejected, (state: any, action: any) => {
            state.error = action.payload.error || null;
            state.loading = false;
        });
    }
});

export default NotesSlice.reducer;