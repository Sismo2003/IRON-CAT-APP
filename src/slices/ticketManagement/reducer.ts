import { createSlice } from "@reduxjs/toolkit";
import {
    getTicket,
    addTicket,
    lookTicket,
    deleteTicket

    // updateTicket,
    // deleteTicket
} from './thunk';
import {deleteNotes} from "../notes/thunk";

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


        // builder.addCase(updateTicket.fulfilled, (state: any, action: any) => {
        //     state.ticketlist = state.ticketlist.map((ticketlist: any) =>
        //         ticketlist.id === action.payload.id
        //             ? { ...ticketlist, ...action.payload }
        //             : ticketlist
        //     );
        // });
        // builder.addCase(updateTicket.rejected, (state: any, action: any) => {
        //     state.error = action.payload.error || null;
        // });
        // builder.addCase(deleteTicket.fulfilled, (state: any, action: any) => {
        //     state.ticketlist = state.ticketlist.filter(
        //         (ticketlist: any) => ticketlist.id.toString() !== action.payload.toString()
        //     );
        // });
        // builder.addCase(deleteTicket.rejected, (state: any, action: any) => {
        //     state.error = action.payload.error || null;
        // });

        
    }
});

export default TICKETManagementSlice.reducer;