import { createAsyncThunk } from "@reduxjs/toolkit";
import {
    getAllTickets as getTickets,
    getTicketById,
    addTicket as newTicket,
    deleteTicket as deleteTicketById,
    updateTicketStatus,
    productImage,
} from "../../helpers/fakebackend_helper";


import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import {array, number} from "yup";


// Función para mostrar alertas controladas
const showToast = (message: string, status: 'info' | 'success' | 'error') => {
    if (!toast.isActive('unique-toast')) { // Verifica si no hay un toast activo con este id
        toast[status](message, {
            toastId: 'unique-toast', // Usa un ID único para controlar
            autoClose: 2000
        });
    }
};

export const getTicket = createAsyncThunk("ticketManagement/getTicket", async () => {
    try {
        const response = getTickets();
        return (await response).data;
    } catch (error) {
        return error;
    }
});


export const getImage = createAsyncThunk("ticketManagement/getImageId", async (id: number) => {
    try {
        const response = await productImage(id) ;
        const data = response;
        return {...data, id};
    } catch (error: any) {
        return { message: error.message };
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
        showToast("Ticket encontrado!",'success')
        return data;
    } catch (error: any) {
        showToast("Ticket encontrado!",'error')
        return { message: error.message };
    }
});

export const deleteTicket = createAsyncThunk("ticketManagement/deleteTicket", async (event: any) => {
    try {
        deleteTicketById(event);
        showToast("Ticket borrado con exito!",'success');
        return event;
    } catch (error) {
        showToast("Se produjo un error al intentar borrar el ticket, vuelve a intentarlo o contacta a tu soporte.",'error');
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


