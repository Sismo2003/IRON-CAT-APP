import { createSlice } from "@reduxjs/toolkit";
import {
    getCustomer,
    addCustomer,
    updateCustomer,
    deleteCustomer
} from './thunk';

export const initialState = {
    customerlist: [],
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