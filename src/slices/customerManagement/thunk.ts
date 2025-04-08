import { createAsyncThunk } from "@reduxjs/toolkit";
import {
    getCustomer as getCustomerApi,
    getCustomerById as getCustomerByIdApi,
    addCustomer as addCustomerApi,
    updateCustomer as updateCustomerApi,
    deleteCustomer as deleteCustomerApi,
} from "../../helpers/fakebackend_helper";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export const getCustomer = createAsyncThunk("CustomerManagement/getCustomer", async () => {
    try {
        const response = getCustomerApi();
        return (await response).data;
    } catch (error) {
        return error;
    }
});

export const getCustomerById = createAsyncThunk("CustomerManagement/getCustomerById", async (event: any) => {
    try {
        const response = getCustomerByIdApi(event);
        return (await response).data;
    } catch (error) {
        return error;
    }
});

export const addCustomer = createAsyncThunk("CustomerManagement/addCustomer", async (event: any) => {
    try {
        const response = addCustomerApi(event);
        event.id = (await response).data;
        toast.success("Customer creado con éxito", { autoClose: 2000 });
        return event;
    } catch (error) {
        toast.error("Customer Added Failed", { autoClose: 2000 });
        return error;
    }
});
export const updateCustomer = createAsyncThunk("CustomerManagement/updateCustomer", async (event: any) => {
    try {
        console.log("event", event);
        const response = await updateCustomerApi(event);
        if(!response.data) {
            throw new Error("API Error");
        }
        toast.success("Cliente actualizado exitosamente", { autoClose: 2000 });
        return event;
    } catch (error) {
        toast.error("Customer updated Failed", { autoClose: 2000 });
        return error;
    }
});
export const deleteCustomer = createAsyncThunk("CustomerManagement/deleteCustomer", async (event: any) => {
    try {
        console.log("event", event);
        await deleteCustomerApi(event);
        toast.success("Customer deleted Successfully", { autoClose: 2000 });
        return event;
    } catch (error) {
        toast.error("Customer deleted Failed", { autoClose: 2000 });
        return error;
    }
});

