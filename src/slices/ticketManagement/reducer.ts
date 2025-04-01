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
    ticketByid: [],
    ticketCount : 0,
    MonthlyTickets : 0,
    TicketsStatusCount: [],
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
            state.ticketCount = state.ticketlist.length;
            
            const now = new Date();
            const currentMonth = now.getMonth();
            const currentYear = now.getFullYear();
            
            state.MonthlyTickets = state.ticketlist.filter((ticket: { ticket_date: string }) => {
                const ticketDate = new Date(ticket.ticket_date);
                return ticketDate.getMonth() === currentMonth && ticketDate.getFullYear() === currentYear;
            }).length;

            const ticketsStatusCount = new Array(12).fill(0).map(() => ({
                authorized: 0,
                pending: 0,
                deleted: 0,
                shop: 0,
                sale: 0,
            }));

            state.ticketlist.forEach((ticket: any) => {
                const ticketDate = new Date(ticket.ticket_date);
                if (ticketDate.getFullYear() === currentYear) {
                    const month = ticketDate.getMonth();
                    if (ticket.ticket_status === 'authorized' || ticket.ticket_status === 'Autorizados' ) {
                        ticketsStatusCount[month].authorized++;
                    }
                    if (ticket.ticket_status === 'pending' || ticket.ticket_status === 'Por autorizar'  ) {
                        ticketsStatusCount[month].pending++;
                    }
                    if (ticket.ticket_status === 'deleted' || ticket.ticket_status === 'Cancelados') {
                        ticketsStatusCount[month].deleted++;
                    }
                    if (ticket.ticket_type === 'shop') {
                        ticketsStatusCount[month].shop++;
                    }
                    if (ticket.ticket_type === 'sale') {
                        ticketsStatusCount[month].sale++;
                    }
                }
            });

            state.TicketsStatusCount = ticketsStatusCount;
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
            if (
              state.ticketByid &&
              state.ticketByid.data &&
              state.ticketByid.data.ticket &&
              state.ticketByid.data.ticket.length > 0 &&
              Number(state.ticketByid.data.ticket[0].id) === Number(action.payload.id)
            ) {
                state.ticketByid = [];
            }
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
            if (
              state.ticketByid &&
              state.ticketByid.data &&
              state.ticketByid.data.ticket &&
              state.ticketByid.data.ticket.length > 0 &&
              Number(state.ticketByid.data.ticket[0].id) === Number(action.payload.id)
            ) {
                state.ticketByid.data.ticket[0].status = action.payload.onStatus;
            }
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