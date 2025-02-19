import { createSlice } from "@reduxjs/toolkit";
import {
    getTicket,
    addTicket,
    updateTicket,
    deleteTicket
} from './thunk';

export const initialState = {
    ticketlist: []
};

const TICKETManagementSlice = createSlice({
    name: 'TICKETManagement',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        // Ticket
        builder.addCase(getTicket.fulfilled, (state: any, action: any) => {
            state.ticketlist = action.payload;
        });
        builder.addCase(getTicket.rejected, (state: any, action: any) => {
            state.error = action.payload.error || null;
        });
        builder.addCase(addTicket.fulfilled, (state: any, action: any) => {
            state.ticketlist.unshift(action.payload);
        });
        builder.addCase(addTicket.rejected, (state: any, action: any) => {
            state.error = action.payload.error || null;
        });
        builder.addCase(updateTicket.fulfilled, (state: any, action: any) => {
            state.ticketlist = state.ticketlist.map((ticketlist: any) =>
                ticketlist.id === action.payload.id
                    ? { ...ticketlist, ...action.payload }
                    : ticketlist
            );
        });
        builder.addCase(updateTicket.rejected, (state: any, action: any) => {
            state.error = action.payload.error || null;
        });
        builder.addCase(deleteTicket.fulfilled, (state: any, action: any) => {
            state.ticketlist = state.ticketlist.filter(
                (ticketlist: any) => ticketlist.id.toString() !== action.payload.toString()
            );
        });
        builder.addCase(deleteTicket.rejected, (state: any, action: any) => {
            state.error = action.payload.error || null;
        });

        
    }
});

export default TICKETManagementSlice.reducer;