import { createAsyncThunk } from "@reduxjs/toolkit";

import {
    // getSellers as getSellersApi,
    // addSellers as addSellersApi,
    // updateSellers as updateSellersApi,
    // deleteSellers as deleteSellersApi,
    getSaleProductList as getSaleProductListApi,
    addSaleProductList as addProductListApi,
    updateSaleProductList as updateProductListApi,
    deleteSaleProductList as deleteProductListApi,
    // getProductGrid as getProductGridApi,
    // addProductGrid as addProductGridApi,
    // updateProductGrid as updateProductGridApi,
    // deleteProductGrid as deleteProductGridApi
} from "../../helpers/fakebackend_helper";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

// export const getSellers = createAsyncThunk("ecommerce-sale/getSellers", async () => {
//     try {
//         const response = getSellersApi();
//         return response;
//     } catch (error) {
//         return error;
//     }
// });
// export const addSellers = createAsyncThunk("ecommerce-sale/addSellers", async (event: any) => {
//     try {
//         const response = addSellersApi(event);
//         const data = await response;
//         toast.success("Seller Added Successfully", { autoClose: 2000 });
//         return data;
//     } catch (error) {
//         toast.error("Seller Added Failed", { autoClose: 2000 });
//         return error;
//     }
// });
// export const updateSellers = createAsyncThunk("ecommerce-sale/updateSellers", async (event: any) => {
//     try {
//         const response = updateSellersApi(event);
//         const data = await response;
//         toast.success("Seller updated Successfully", { autoClose: 2000 });
//         return data;
//     } catch (error) {
//         toast.error("Seller updated Failed", { autoClose: 2000 });
//         return error;
//     }
// });
// export const deleteSellers = createAsyncThunk("ecommerce-sale/deleteSellers", async (event: any) => {
//     try {
//         const response = deleteSellersApi(event);
//         toast.success("Seller deleted Successfully", { autoClose: 2000 });
//         return response;
//     } catch (error) {
//         toast.error("Seller deleted Failed", { autoClose: 2000 });
//         return error;
//     }
// });

export const getSaleProductList = createAsyncThunk("ecommerce-sale/getProductList", async () => {
    try {
        const response = getSaleProductListApi();
        return (await response).data;
    } catch (error) {
        return error;
    }
});
export const addSaleProductList = createAsyncThunk("ecommerce-sale/addProductList", async (event: any) => {
    try {
        console.log("Event: ", event);
        const response = await addProductListApi(event); // Usa await aquí
        console.log("data: ", response); // Ahora response debería ser la respuesta de la API
        // await response;
        toast.success("Data Added Successfully", { autoClose: 2000 });
        return event;
    } catch (error) {
        toast.error("Data Added Failed", { autoClose: 2000 });
        return error;
    }
});
export const updateSaleProductList = createAsyncThunk("ecommerce-sale/updateProductList", async (event: any) => {
    console.log("Event update: ", event);
    try {
        const response = updateProductListApi(event);
        const data = await response;
        console.log("data update: ", data);
        toast.success("Data updated Successfully", { autoClose: 2000 });
        return event;
    } catch (error) {
        toast.error("Data updated Failed", { autoClose: 2000 });
        return error;
    }
});
export const deleteSaleProductList = createAsyncThunk("ecommerce-sale/deleteProductList", async (event: any) => {
    try {
        const response = deleteProductListApi(event);
        console.log("data delete: ", response);
        toast.success("Data deleted Successfully", { autoClose: 2000 });
        return event;
    } catch (error) {
        toast.error("Data deleted Failed", { autoClose: 2000 });
        return error;
    }
});

// export const getProductGrid = createAsyncThunk("ecommerce-sale/getProductGrid", async () => {
//     try {
//         const response = getProductGridApi();
//         return response;
//     } catch (error) {
//         return error;
//     }
// });
// export const addProductGrid = createAsyncThunk("ecommerce-sale/addProductGrid", async (event: any) => {
//     try {
//         const response = addProductGridApi(event);
//         const data = await response;
//         toast.success("Data Added Successfully", { autoClose: 2000 });
//         return data;
//     } catch (error) {
//         toast.error("Data Added Failed", { autoClose: 2000 });
//         return error;
//     }
// });
// export const updateProductGrid = createAsyncThunk("ecommerce-sale/updateProductGrid", async (event: any) => {
//     try {
//         const response = updateProductGridApi(event);
//         const data = await response;
//         toast.success("Data updated Successfully", { autoClose: 2000 });
//         return data;
//     } catch (error) {
//         toast.error("Data updated Failed", { autoClose: 2000 });
//         return error;
//     }
// });
// export const deleteProductGrid = createAsyncThunk("ecommerce-sale/deleteProductGrid", async (event: any) => {
//     try {
//         const response = deleteProductGridApi(event);
//         toast.success("Data deleted Successfully", { autoClose: 2000 });
//         return response;
//     } catch (error) {
//         toast.error("Data deleted Failed", { autoClose: 2000 });
//         return error;
//     }
// });


