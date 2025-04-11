import { createSlice } from "@reduxjs/toolkit";
import {
    getTicket,
    addTicket,
    lookTicket,
    deleteTicket,
    updateStatus, getImage
    
} from './thunk';


export const initialState = {
    ticketlist: [],
    loading: true,
    ticketByid: [],
    ticketCount : 0,
    //arr de total de tickets de cada mes hasta el mes actual
    MonthlyTickets : 0,
    TicketsStatusCount: [],
    TicketsCountByDay: [],
    productsSaleCharts : [],
    // variable con el contador de tickets del mes actual
    actualMonthTickets : 0,
    // variable con las imagenes requeridas por el cliente!
    productImages : {},
    imgLoading : true,
    clientsTickets : []
};


const TICKETManagementSlice = createSlice({
    name: 'TICKETManagement',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        // Get all the tickets
        builder.addCase(getTicket.fulfilled, (state: any, action: any) => {
            state.ticketlist = action.payload;
            state.ticketCount = state.ticketlist.length;
            
            const now = new Date();
            const currentMonth = now.getMonth();
            const currentYear = now.getFullYear();
            
            // conteo de ticket mes tras mes hasta el mes actual
            state.MonthlyTickets = Array.from({ length: currentMonth + 1 }, (_, monthIndex) =>
                state.ticketlist.filter((ticket: { ticket_date: string }) => {
                    const ticketDate = new Date(ticket.ticket_date);
                    return ticketDate.getMonth() === monthIndex && ticketDate.getFullYear() === currentYear;
                }).length
            );
            
            // conteo unicamente de los tickets del mes actual
             state.actualMonthTickets = state.MonthlyTickets[state.MonthlyTickets.length - 1];

            const ticketsStatusCount = new Array(currentMonth + 1).fill(0).map(() => ({
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
                    if (month <= currentMonth) {  // Only count for months that have passed or are the current month
                        if (ticket.ticket_status === 'authorized' || ticket.ticket_status === 'Autorizados') {
                            ticketsStatusCount[month].authorized++;
                        }
                        if (ticket.ticket_status === 'pending' || ticket.ticket_status === 'Por autorizar') {
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
                }
            });
            state.TicketsStatusCount = ticketsStatusCount;
            

            const currentDay = now.getDate();
            let ticketsCountByDay = [];

            for (let day = 1; day <= currentDay; day++) {
                const dayTickets = state.ticketlist.filter((ticket: any) => {
                    const ticketDate = new Date(ticket.ticket_date);
                    return (
                        ticketDate.getFullYear() === currentYear &&
                        ticketDate.getMonth() === currentMonth &&
                        ticketDate.getDate() === day
                    );
                });

                const shopCount = dayTickets.filter((ticket: any) => ticket.ticket_type === 'shop').length;
                const saleCount = dayTickets.filter((ticket: any) => ticket.ticket_type === 'sale').length;

                ticketsCountByDay.push({
                    day,
                    shop: shopCount,
                    sale: saleCount
                });
            }

            state.TicketsCountByDay = ticketsCountByDay;
            
            
            const filteredTickets = state.ticketlist.filter((ticket: any) => {
                const ticketDate = new Date(ticket.ticket_date);
                return (
                    ticketDate.getFullYear() === currentYear &&
                    ticketDate.getMonth() === currentMonth
                );
            });

            const ticketTypeSummary: {
                [ticketType: string]: {
                    [productId: string]: {
                        product_id: number,
                        product_name: string,
                        totalWeight: number,
                        totalAmount: number
                    }
                }
            } = {};

            filteredTickets.forEach((ticket: any) => {
                const ticketType = ticket.ticket_type || 'unknown';
                if (!ticketTypeSummary[ticketType]) {
                    ticketTypeSummary[ticketType] = {};
                }
                
                if (Array.isArray(ticket.productos)) {
                    ticket.productos.forEach((product: any) => {
                        const productId = product.product_id.toString();
                        const weight = parseFloat(product.weight) || 0;
                        const total = parseFloat(product.total) || 0;
                        
                        
                        if (!ticketTypeSummary[ticketType][productId]) {
                            ticketTypeSummary[ticketType][productId] = {
                                product_id: product.product_id,
                                product_name: product.product_name,
                                totalWeight: 0,
                                totalAmount: 0
                            };
                        }
                        ticketTypeSummary[ticketType][productId].totalWeight += weight;
                        ticketTypeSummary[ticketType][productId].totalAmount += total;
                    });
                }
            });

            const limitedSummary: typeof ticketTypeSummary = {};

            Object.entries(ticketTypeSummary).forEach(([type, products]) => {
                const sorted = Object.values(products)
                    .sort((a, b) => b.totalAmount - a.totalAmount)
                    // .slice(0, 6);
                limitedSummary[type] = {};
                sorted.forEach((product) => {
                    limitedSummary[type][product.product_id.toString()] = product;
                });
            });

            state.productsSaleCharts = limitedSummary;
            
            
            // Agrupar tickets por cliente para el mes y año actual y obtener los 10 con más tickets registrados
            const clientsMap: Record<number, { client: any, count: number }> = {};
            state.ticketlist.forEach((ticket: any) => {
                const ticketDate = new Date(ticket.ticket_date);
                if (
                    ticketDate.getFullYear() === currentYear &&
                    ticketDate.getMonth() === currentMonth &&
                    ticket.client // solo si tiene información de cliente
                ) {
                    const clientId = ticket.client.id;
                    if (!clientsMap[clientId]) {
                        clientsMap[clientId] = { client: ticket.client, count: 0 };
                    }
                    clientsMap[clientId].count++;
                }
            });
            state.clientsTickets = Object.values(clientsMap)
                .sort((a, b) => b.count - a.count)
                .slice(0, 10);
            
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
        
        // Get product image by id ----
        builder.addCase(getImage.fulfilled, (state: any, action: any) => {
            state.productImages[action.payload.id] = action.payload.data[0];
            state.imgLoading = false;
        });
        builder.addCase(getImage.pending, (state: any, action: any) => {
            state.imgLoading = true;
        });
        builder.addCase(getImage.rejected, (state: any, action: any) => {
            state.error = action.payload.error || null;
            state.imgLoading = false;
        });

        // delete ticket by id
        builder.addCase(deleteTicket.fulfilled, (state: any, action: any) => {
            state.loading = false;
            state.ticketlist = state.ticketlist.filter(
                (ticketlist: any) => ticketlist.ticket_id.toString() !== action.payload.toString()
            );
            state.ticketByid = [];
            
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