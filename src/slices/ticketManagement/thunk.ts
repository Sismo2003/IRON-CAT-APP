import { createAsyncThunk } from "@reduxjs/toolkit";
import {
    getAllTickets as getTickets,
    getTicketById,
    addTicket as newTicket,
    deleteTicket as deleteTicketById,
    updateTicketStatus
} from "../../helpers/fakebackend_helper";


import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export const getTicket = createAsyncThunk("ticketManagement/getTicket", async () => {
    try {
        const response = getTickets();
        return (await response).data;
    } catch (error) {
        return error;
    }
});

export const addTicket = createAsyncThunk("ticketManagement/addTicket", async (event: any) => {
    try {
        const response = newTicket(event);
        await response;
        toast.success("Ticket creado con éxito", { autoClose: 2000 });
        return event;
    } catch (error) {
        toast.error("Ticket no creado!", { autoClose: 2000 });
        return error;
    }
});


export const lookTicket = createAsyncThunk("ticketManagement/getTicketByid", async (event: any) => {
    try {
        const response = getTicketById(event);
        const data = await response;
        return data;
    } catch (error) {
        return error;
    }
});

export const deleteTicket = createAsyncThunk("ticketManagement/deleteTicket", async (event: any) => {
    try {
        deleteTicketById(event);
        toast.success("Ticket borrado con exito!", { autoClose: 2000 });
        return event;
    } catch (error) {
        toast.error("Se produjo un error al intentar borrar el ticket, vuelve a intentarlo o contacta a tu soporte.", { autoClose: 2000 });
        return error;
    }
});

export const updateStatus = createAsyncThunk("ticketManagement/updateStatus", async (event: any) => {
    try {
        updateTicketStatus(event);
        toast.success("Estado de ticket actualizado correctamete!", { autoClose: 2000 });
        return event;
    } catch (error) {
        toast.error("Se produjo un erro al actulizar el estado del ticket, vuelve a intentarlo.", { autoClose: 2000 });
        return error;
    }
});



/* NOTE
*** NEED to create THIS FUNCTIONS!
* as well need to create a endpoint in the API!
*/
// export const updateTicket = createAsyncThunk("ticketManagement/updateTicket", async (event: any) => {
//     try {
//         console.log("event", event);
//         const response = updateTicketApi(event);
//         const data = await response;
//         toast.success("Ticket updated Successfully", { autoClose: 2000 });
//         return event;
//     } catch (error) {
//         toast.error("Ticket updated Failed", { autoClose: 2000 });
//         return error;
//     }
// });


