import { createAsyncThunk } from "@reduxjs/toolkit";
import {
	getPendingCarts as getPendingCartsApi,
	createCart as createCartApi,
	getCart as getCartApi,
	deleteProductInCart as deleteProductInCartApi,
	insertProductInCart as insertProductInCartApi,
} from "../../helpers/fakebackend_helper";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

// Tipos para TypeScript
interface CartItem {
  product_id: number;
  material: string;
  weight: number;
  price: number;
  total: number;
  waste: number;
  type: 'wholesale' | 'retail';
}

interface Cart {
  id: number;
  type: 'purchase' | 'sale' | 'special';
  items: CartItem[];
  customer_name: string;
  vehicle_plate?: string;
  vehicle_model?: string;
  status: 'pending' | 'completed' | 'cancelled';
  subtotal: number;
  discount_amount?: number;
  total: number;
  user_id: number;
  user_name: string;
  created_at: string;
  updated_at?: string;
}

export const getPendingCarts = createAsyncThunk(
  "cartManagement/getPendingCarts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getPendingCartsApi();
      return response.data;
    } catch (error: any) {
      toast.error("Error al obtener carritos pendientes", { autoClose: 2000 });
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const createCart = createAsyncThunk(
  "cartManagement/createCart",
  async (payload: {
    sale_type: 'shop' | 'sale';
    sale_mode: string;
    customer_name: string;
    client_id: number | null;
    vehicle_plate?: string;
    vehicle_model?: string;
  }, { rejectWithValue }) => {
    try {
      const response = await createCartApi(payload);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getCart = createAsyncThunk(
  "cartManagement/getCart",
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await getCartApi(id);
      return response;
    } catch (error: any) {
      toast.error("Error al obtener carrito", { autoClose: 2000 });
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteProductInCart = createAsyncThunk(
	"cartManagement/deleteProductInCart",
	async (data: any, { rejectWithValue }) => {
		try {
			const response = await deleteProductInCartApi(data);
			toast.success("Producto eliminado del carrito", { autoClose: 2000 });
			return response.data;
		} catch (error: any) {
			toast.error("Error al eliminar producto del carrito", { autoClose: 2000 });
			return rejectWithValue(error.response?.data || error.message);
		}
	}
);

export const insertProductInCart = createAsyncThunk(
	"cartManagement/insertProductInCart",
	async (data: any, { rejectWithValue }) => {
		try {
			const response = await insertProductInCartApi(data);
			toast.success("Producto agregado al carrito", { autoClose: 2000 });
			return response.data;
		} catch (error: any) {
			toast.error("Error al agregar producto al carrito", { autoClose: 2000 });
			return rejectWithValue(error.response?.data || error.message);
		}
	}
);