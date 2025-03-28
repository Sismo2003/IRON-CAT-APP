import { createSlice } from "@reduxjs/toolkit";
import {
    getTicket,
    addTicket,
    lookTicket,
    deleteTicket,
    updateStatus

} from './thunk';

export const initialState = {
    ticketlist: [],
    loading: true,
    ticketByid: []
};

const TICKETManagementSlice = createSlice({
    name: 'TICKETManagement',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        // Get all the tickets
        builder.addCase(getTicket.fulfilled, (state: any, action: any) => {
            state.ticketlist = action.payload;
            state.loading = false;
        });
        builder.addCase(getTicket.pending, (state: any, action: any) => {
            state.loading = true;
        });
        builder.addCase(getTicket.rejected, (state: any, action: any) => {
            state.error = action.payload.error || null;
            state.loading = false;
        });

        // add ticket
        builder.addCase(addTicket.fulfilled, (state: any, action: any) => {
            state.ticketlist.unshift(action.payload);
            state.loading = false;
        });
        builder.addCase(addTicket.pending, (state: any, action: any) => {
            state.loading = true;
        });
        builder.addCase(addTicket.rejected, (state: any, action: any) => {
            state.error = action.payload.error || null;
            state.loading = false;
        });

        // Get ticket by id
        builder.addCase(lookTicket.fulfilled, (state: any, action: any) => {
            state.ticketByid = action.payload;
            state.loading = false;
        });
        builder.addCase(lookTicket.pending, (state: any, action: any) => {
            state.loading = true;
        });
        builder.addCase(lookTicket.rejected, (state: any, action: any) => {
            state.error = action.payload.error || null;
            state.loading = false;
        });

        // delete ticket by id
        builder.addCase(deleteTicket.fulfilled, (state: any, action: any) => {
            state.loading = false;
            state.ticketlist = state.ticketlist.filter(
                (ticketlist: any) => ticketlist.ticket_id.toString() !== action.payload.toString()
            );
        });
        builder.addCase(deleteTicket.pending, (state: any, action: any) => {
            state.loading = true;
        });
        builder.addCase(deleteTicket.rejected, (state: any, action: any) => {
            state.error = action.payload.error || null;
            state.loading = false;
        });

        // update ticket status by id
        builder.addCase(updateStatus.fulfilled, (state: any, action: any) => {
            state.ticketlist = state.ticketlist.map((ticket: any) =>
                ticket.ticket_id === action.payload.id
                    ? { ...ticket, ticket_status: action.payload.onStatus }
                    : ticket
            );
            state.loading = false;
        });
        builder.addCase(updateStatus.pending, (state: any, action: any) => {
            state.loading = true;
        });
        builder.addCase(updateStatus.rejected, (state: any, action: any) => {
            state.error = action.payload.error || null;
            state.loading = false;
        });


        
    }
});

export default TICKETManagementSlice.reducer;