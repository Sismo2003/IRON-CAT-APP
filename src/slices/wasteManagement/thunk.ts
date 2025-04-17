import { createAsyncThunk } from "@reduxjs/toolkit";
import { DateTime } from "luxon";
import {
    getWaste as getWasteApi,
    getActiveWaste as getActiveWasteApi,
    addWaste as addWasteApi,
    updateWaste as updateWasteApi,
    deleteWaste as deleteWasteApi,
} from "../../helpers/fakebackend_helper";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { now } from "moment";

export const getWasteRecords = createAsyncThunk("WasteManagement/getWaste", async () => {
    try {
        const response = getWasteApi();
        return (await response).data;
    } catch (error) {
        return error;
    }
});
export const getActiveWasteRecords = createAsyncThunk("WasteManagement/getActiveWaste", async () => {
    try {
        const response = getActiveWasteApi();
        return (await response).data;
    } catch (error) {
        return error;
    }
});
export const addWasteRecord = createAsyncThunk("WasteManagement/addWaste", async (event: any) => {
    try {
        const response = addWasteApi(event);
        const mexicanDate = DateTime.now()
        .setZone('America/Mexico_City')
        event.id = (await response).data;
        event.creation_date = mexicanDate;
        toast.success("Merma creada con éxito", { autoClose: 2000 });
        return event;
    } catch (error) {
        toast.error("Merma no creada", { autoClose: 2000 });
        return error;
    }
});
export const updateWasteRecord = createAsyncThunk("WasteManagement/updateWaste", async (event: any) => {
    try {
        const response = await updateWasteApi(event);
        if(!response.data) {
            throw new Error("API Error");
        }
        toast.success("Merma actualizada con éxito", { autoClose: 2000 });
        return event;
    } catch (error) {
        toast.error("Merma no actualizada", { autoClose: 2000 });
        return error;
    }
});
export const deleteWasteRecord = createAsyncThunk("WasteManagement/deleteWaste", async (event: any) => {
    try {
        await deleteWasteApi(event);
        toast.success("Merma eliminada correctamente", { autoClose: 2000 });
        return event;
    } catch (error) {
        toast.error("Merma no eliminada", { autoClose: 2000 });
        return error;
    }
});

