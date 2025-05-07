import { createAsyncThunk } from "@reduxjs/toolkit";
import {
    getDiscountCodes as getDiscountCodesApi,
    addDiscountCode as addDiscountCodesApi,
    updateDiscountCode as updateDiscountCodesApi,
    deleteDiscountCode as deleteDiscountCodesApi,
    incrementUsesDiscountCode as incrementUsesDiscountCodesApi,
} from "../../helpers/fakebackend_helper";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { DateTime } from "luxon";

export const getDiscountCodes = createAsyncThunk("discountCodeManagement/getDiscountCodes", async () => {
    try {
        const response = getDiscountCodesApi();
        return (await response).data;
    } catch (error) {
        return error;
    }
});
export const addDiscountCode = createAsyncThunk("discountCodeManagement/addDiscountCodes", async (event: any) => {
    try {
        console.log("event", event);

        const response = await addDiscountCodesApi(event);
        if (response.data) {
            event.id = response.data.DiscountCodesId;
            const dateTimeLocal = DateTime.fromSQL(event.end_date);
            const isoDateUTC = dateTimeLocal.toUTC().toISO();
            event.end_date = isoDateUTC;
            toast.success("Código de descuento creado con éxito", { autoClose: 2000 });
            return event;
        } else {
            toast.error("Código de descuento no creado", { autoClose: 2000 });
            return response;
        }
    } catch (error) {
        toast.error("Código de descuento no creado", { autoClose: 2000 });
        return error;
    }
});
export const updateDiscountCode = createAsyncThunk("discountCodeManagement/updateDiscountCodes", async (event: any) => {
    try {
        updateDiscountCodesApi(event);
        const dateTimeLocal = DateTime.fromSQL(event.end_date);
        const isoDateUTC = dateTimeLocal.toUTC().toISO();
        event.end_date = isoDateUTC;
        toast.success("Código de descuento actualizado con éxito", { autoClose: 2000 });
        return event;
    } catch (error) {
        toast.error("Código de descuento no actualizado", { autoClose: 2000 });
        return error;
    }
});
export const deleteDiscountCode = createAsyncThunk("discountCodeManagement/deleteDiscountCodes", async (event: any) => {
    try {
        deleteDiscountCodesApi(event);
        toast.success("Código de descuento eliminado con éxito", { autoClose: 2000 });
        return event;
    } catch (error) {
        toast.error("Fallo al eliminar código de descuento", { autoClose: 2000 });
        return error;
    }
});
export const incrementUsesDiscountCode = createAsyncThunk("discountCodeManagement/incrementUsesDiscountCodes", async (event: any) => {
    try {
        incrementUsesDiscountCodesApi(event);
        // toast.success("Código de descuento actualizado con éxito", { autoClose: 2000 });
        return event;
    } catch (error) {
        // toast.error("Código de descuento no actualizado", { autoClose: 2000 });
        return error;
    }
});