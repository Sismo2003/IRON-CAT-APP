import { createSlice } from "@reduxjs/toolkit";
import {
    // getSellers,
    // addSellers,
    // updateSellers,
    // deleteSellers,
    getSaleProductList,
    addSaleProductList,
    updateSaleProductList,
    deleteSaleProductList,
    // getProductGrid,
    // addProductGrid,
    // updateProductGrid,
    // deleteProductGrid
} from './thunk';

export const initialState = {
    orders: [],
    sellers: [],
    productList: [],
    productGrid: [],
    reviews: [],
    errors: {},
    loading: false
};

const EcommerceSaleSlice = createSlice({
    name: 'EcommerceSale',
    initialState,
    reducers: {},
    extraReducers: (builder) => {

        // Sellers
        // builder.addCase(getSellers.fulfilled, (state: any, action: any) => {
        //     state.sellers = action.payload;
        // });
        // builder.addCase(getSellers.rejected, (state: any, action: any) => {
        //     state.error = action.payload.error || null;
        // });
        // builder.addCase(addSellers.fulfilled, (state: any, action: any) => {
        //     state.sellers.unshift(action.payload);
        // });
        // builder.addCase(addSellers.rejected, (state: any, action: any) => {
        //     state.error = action.payload.error || null;
        // });
        // builder.addCase(updateSellers.fulfilled, (state: any, action: any) => {
        //     state.sellers = state.sellers.map((sellers: any) =>
        //         sellers.id === action.payload.id
        //             ? { ...sellers, ...action.payload }
        //             : sellers
        //     );
        // });
        // builder.addCase(updateSellers.rejected, (state: any, action: any) => {
        //     state.error = action.payload.error || null;
        // });
        // builder.addCase(deleteSellers.fulfilled, (state: any, action: any) => {
        //     state.sellers = state.sellers.filter(
        //         (sellers: any) => sellers.id.toString() !== action.payload.toString()
        //     );
        // });
        // builder.addCase(deleteSellers.rejected, (state: any, action: any) => {
        //     state.error = action.payload.error || null;
        // });

        // Products
        // List View
        builder.addCase(getSaleProductList.fulfilled, (state: any, action: any) => {
            state.loading = false;
            state.productList = action.payload;
        });
        builder.addCase(getSaleProductList.pending, (state: any, action: any) => {
            state.loading = true;
        });
        builder.addCase(getSaleProductList.rejected, (state: any, action: any) => {
            state.loading = false;
            state.error = action.payload.error || null;
        });
        builder.addCase(addSaleProductList.fulfilled, (state: any, action: any) => {
            // console.log(action.payload);
            state.productList.unshift(action.payload);
        });
        builder.addCase(addSaleProductList.rejected, (state: any, action: any) => {
            state.error = action.payload.error || null;
        });
        builder.addCase(updateSaleProductList.fulfilled, (state: any, action: any) => {
            state.productList = state.productList.map((productList: any) =>
                productList.id === action.payload.id
                    ? { ...productList, ...action.payload }
                    : productList
            );
        });
        builder.addCase(updateSaleProductList.rejected, (state: any, action: any) => {
            state.error = action.payload.error || null;
        });
        builder.addCase(deleteSaleProductList.fulfilled, (state: any, action: any) => {
            state.productList = state.productList.filter(
                (productList: any) => productList.id.toString() !== action.payload.toString()
            );
        });
        builder.addCase(deleteSaleProductList.rejected, (state: any, action: any) => {
            state.error = action.payload.error || null;
        });

        // Grid View
        // builder.addCase(getProductGrid.fulfilled, (state: any, action: any) => {
        //     state.productGrid = action.payload;
        // });
        // builder.addCase(getProductGrid.rejected, (state: any, action: any) => {
        //     state.error = action.payload.error || null;
        // });
        // builder.addCase(addProductGrid.fulfilled, (state: any, action: any) => {
        //     state.productGrid.unshift(action.payload);
        // });
        // builder.addCase(addProductGrid.rejected, (state: any, action: any) => {
        //     state.error = action.payload.error || null;
        // });
        // builder.addCase(updateProductGrid.fulfilled, (state: any, action: any) => {
        //     state.productGrid = state.productGrid.map((productGrid: any) =>
        //         productGrid.id === action.payload.id
        //             ? { ...productGrid, ...action.payload }
        //             : productGrid
        //     );
        // });
        // builder.addCase(updateProductGrid.rejected, (state: any, action: any) => {
        //     state.error = action.payload.error || null;
        // });
        // builder.addCase(deleteProductGrid.fulfilled, (state: any, action: any) => {
        //     state.productGrid = state.productGrid.filter(
        //         (productGrid: any) => productGrid.id.toString() !== action.payload.toString()
        //     );
        // });
        // builder.addCase(deleteProductGrid.rejected, (state: any, action: any) => {
        //     state.error = action.payload.error || null;
        // });
    }
});

export default EcommerceSaleSlice.reducer;