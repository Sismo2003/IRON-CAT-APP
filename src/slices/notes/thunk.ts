import { createAsyncThunk } from "@reduxjs/toolkit";

import {
    getNotes as getNotesApi,
    addNotes as addNotesApi,
    updateNotes as updateNotesApi,
    deleteNotes as deleteNotesApi
} from "../../helpers/fakebackend_helper";

import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export const getNotes = createAsyncThunk("notes/getNotes", async () => {
    try {
        const response = getNotesApi();
        return (await response).data;
    } catch (error) {
        return error;
    }
});
export const addNotes = createAsyncThunk("notes/addNotes", async (event: any) => {
    try {
        const response = addNotesApi(event);
        const data = await response;
        if(data){
            toast.success("Nota actualizada con exito!", { autoClose: 2000 });
            return event;
        }else{
            toast.error("Ocurrio un error al agregar la nota!", { autoClose: 2000 });
            return data;
        }
    } catch (error) {
        toast.error("La nota no se agrego", { autoClose: 2000 });
        return error;
    }
});
export const updateNotes = createAsyncThunk("notes/updateNotes", async (event: any) => {
    try {
        const response = updateNotesApi(event);
        const data = await response;
        if(data){
            toast.success("Nota actualizada con exito!", { autoClose: 2000 });
            return event;
        }else{
            toast.error("La nota no se actualizo!", { autoClose: 2000 });
            return data;
        }
    } catch (error) {
        toast.error("Notes updated Failed", { autoClose: 2000 });
        return error;
    }
});
export const deleteNotes = createAsyncThunk("notes/deleteNotes", async (event: any) => {
    try {
        const response = deleteNotesApi(event);
        const data = await response;
        if(data){
            toast.success("Nota borrada con exito!", { autoClose: 2000 });
            return event;
        }else{
            toast.error("Hubo un error al eliminar la nota!", { autoClose: 2000 });
            return response;
        }
    } catch (error) {
        toast.error("Hubo un error al eliminar la nota!", { autoClose: 2000 });
        return error;
    }
});