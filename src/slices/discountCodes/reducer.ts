import { createSlice } from "@reduxjs/toolkit";
import {
    getDiscountCodes,
    addDiscountCode,
    updateDiscountCode,
    deleteDiscountCode,
    incrementUsesDiscountCode
} from './thunk';


export const initialState = {
    discountCodeList: [],
    errors: {},
    loading: false
};

const HRManagementSlice = createSlice({
    name: 'HRManagement',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        // Employee
        builder.addCase(getDiscountCodes.pending, (state: any) => {
            state.loading = true;
        });
        builder.addCase(getDiscountCodes.fulfilled, (state: any, action: any) => {
            state.loading = false;
            state.discountCodeList = action.payload;
        });
        builder.addCase(getDiscountCodes.rejected, (state: any, action: any) => {
            state.loading = false;
            state.error = action.payload.error || null;
        });
        builder.addCase(addDiscountCode.fulfilled, (state: any, action: any) => {
            state.discountCodeList.unshift(action.payload);
        });
        builder.addCase(addDiscountCode.rejected, (state: any, action: any) => {
            state.error = action.payload.error || null;
        });
        builder.addCase(updateDiscountCode.fulfilled, (state: any, action: any) => {
            state.discountCodeList = state.discountCodeList.map((discountCodeList: any) =>
                discountCodeList.id === action.payload.id
                    ? { ...discountCodeList, ...action.payload }
                    : discountCodeList
            );
        });
        builder.addCase(updateDiscountCode.rejected, (state: any, action: any) => {
            state.error = action.payload.error || null;
        });
        builder.addCase(deleteDiscountCode.fulfilled, (state: any, action: any) => {
            state.discountCodeList = state.discountCodeList.filter(
                (discountCodeList: any) => discountCodeList.id.toString() !== action.payload.toString()
            );
        });
        builder.addCase(deleteDiscountCode.rejected, (state: any, action: any) => {
            state.error = action.payload.error || null;
        });
        builder.addCase(incrementUsesDiscountCode.fulfilled, (state: any, action: any) => {
            state.discountCodeList = state.discountCodeList.map((discountCodeList: any) =>
                discountCodeList.id === action.payload.id
                    ? { ...discountCodeList, ...action.payload }
                    : discountCodeList
            );
        });
        builder.addCase(incrementUsesDiscountCode.rejected, (state: any, action: any) => {
            state.error = action.payload.error || null;
        });
    }
});

export default HRManagementSlice.reducer;