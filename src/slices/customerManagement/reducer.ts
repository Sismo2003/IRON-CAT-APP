import { createSlice } from "@reduxjs/toolkit";
import {
    getCustomer,
    getCustomerById,
    addCustomer,
    updateCustomer,
    deleteCustomer
} from './thunk';

interface customer {
    id: number;
    name: string;
    fullname: string;
    address: string;
    customer_id: string;
    email: string;
    img: string;
    phone: string;
    rfc?: string;
    last_visit?: string;
}

export const initialState = {
    customerlist: [],
    customer: {} as customer,
    loading: false,
};

const CustomerManagementSlice = createSlice({
    name: 'CustomerManagement',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        // Customer
        builder.addCase(getCustomer.fulfilled, (state: any, action: any) => {
            state.loading = false;
            state.customerlist = action.payload;
        });
        builder.addCase(getCustomer.pending, (state: any, action: any) => {
            state.loading = true;
        });
        builder.addCase(getCustomer.rejected, (state: any, action: any) => {
            state.loading = false;
            state.error = action.payload.error || null;
        });
        builder.addCase(getCustomerById.fulfilled, (state: any, action: any) => {
            state.loading = false;
            state.customer = action.payload;
        });
        builder.addCase(getCustomerById.pending, (state: any, action: any) => {
            state.loading = true;
        });
        builder.addCase(getCustomerById.rejected, (state: any, action: any) => {
            state.loading = false;
            state.error = action.payload.error || null;
        });
        builder.addCase(addCustomer.fulfilled, (state: any, action: any) => {
            state.customerlist.unshift(action.payload);
        });
        builder.addCase(addCustomer.rejected, (state: any, action: any) => {
            state.error = action.payload.error || null;
        });
        builder.addCase(updateCustomer.fulfilled, (state: any, action: any) => {
            state.customerlist = state.customerlist.map((customerlist: any) =>
                customerlist.id === action.payload.id
                    ? { ...customerlist, ...action.payload }
                    : customerlist
            );
        });
        builder.addCase(updateCustomer.rejected, (state: any, action: any) => {
            state.error = action.payload.error || null;
        });
        builder.addCase(deleteCustomer.fulfilled, (state: any, action: any) => {
            state.customerlist = state.customerlist.filter(
                (customerlist: any) => customerlist.id.toString() !== action.payload.toString()
            );
        });
        builder.addCase(deleteCustomer.rejected, (state: any, action: any) => {
            state.error = action.payload.error || null;
        });

        
    }
});

export default CustomerManagementSlice.reducer;