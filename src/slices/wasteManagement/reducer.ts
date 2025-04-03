import { createSlice } from "@reduxjs/toolkit";
import {
    getWasteRecords,
    addWasteRecord,
    updateWasteRecord,
    deleteWasteRecord
} from './thunk';

export const initialState = {
    wastelist: [],
    loading: false,
    error: null
};

const WasteManagementSlice = createSlice({
    name: 'WasteManagement',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        // Waste Records
        builder.addCase(getWasteRecords.fulfilled, (state: any, action: any) => {
            state.loading = false;
            state.wastelist = action.payload;
        });
        builder.addCase(getWasteRecords.pending, (state: any) => {
            state.loading = true;
        });
        builder.addCase(getWasteRecords.rejected, (state: any, action: any) => {
            state.loading = false;
            state.error = action.payload.error || null;
        });
        
        builder.addCase(addWasteRecord.fulfilled, (state: any, action: any) => {
            state.wastelist.unshift(action.payload);
        });
        builder.addCase(addWasteRecord.rejected, (state: any, action: any) => {
            state.error = action.payload.error || null;
        });
        
        builder.addCase(updateWasteRecord.fulfilled, (state: any, action: any) => {
            console.log("action.payload", action.payload);
            state.wastelist = state.wastelist.map((waste: any) =>
                waste.id === action.payload.id
                    ? { ...waste, ...action.payload }
                    : waste
            );
        });
        builder.addCase(updateWasteRecord.rejected, (state: any, action: any) => {
            state.error = action.payload.error || null;
        });
        
        builder.addCase(deleteWasteRecord.fulfilled, (state: any, action: any) => {
            state.wastelist = state.wastelist.filter(
                (waste: any) => waste.id.toString() !== action.payload.toString()
            );
        });
        builder.addCase(deleteWasteRecord.rejected, (state: any, action: any) => {
            state.error = action.payload.error || null;
        });
    }
});

export default WasteManagementSlice.reducer;