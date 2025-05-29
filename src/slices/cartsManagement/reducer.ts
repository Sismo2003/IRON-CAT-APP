import { createSlice } from "@reduxjs/toolkit";
import {
  getPendingCarts,
  createCart,
  getCart,
	deleteProductInCart,
	insertProductInCart,
	updateWaste,
	getClientCart,
	updateCartVehicle,
} from './thunk';

interface CartState {
  pendingCarts: Array<{
    id: number;
    type: 'shop' | 'sale';
    items_count: number;
    created_at: string;
    status: 'pending' | 'completed' | 'cancelled';
    user_name: string;
    total: number;
  }>;
  currentCart: {
    id?: number;
    type?: 'purchase' | 'sale' | 'special';
    items: Array<{
      product_id: number;
      material: string;
      weight: number;
      price: number;
      total: number;
      waste: number;
      type: 'wholesale' | 'retail';
    }>;
    customer_name: string;
    vehicle_plate?: string;
    vehicle_model?: string;
    status?: 'pending' | 'completed' | 'cancelled';
    subtotal: number;
    discount_amount?: number;
    total: number;
  };
  loading: boolean;
  error: string | null;
}

const initialState: CartState = {
  pendingCarts: [],
  currentCart: {
    items: [],
    customer_name: '',
    subtotal: 0,
    total: 0
  },
  loading: false,
  error: null
};

const cartSlice = createSlice({
  name: 'cartManagement',
  initialState,
  reducers: {
    resetCurrentCart: (state) => {
      state.currentCart = initialState.currentCart;
    },
    updateCartItem: (state, action) => {
      const { index, item } = action.payload;
      if (index >= 0 && index < state.currentCart.items.length) {
        state.currentCart.items[index] = item;
        // Recalcular totales
        state.currentCart.subtotal = state.currentCart.items.reduce((sum, item) => sum + item.total, 0);
        state.currentCart.total = state.currentCart.subtotal - (state.currentCart.discount_amount || 0);
      }
    },
    setDiscount: (state, action) => {
      state.currentCart.discount_amount = action.payload;
      state.currentCart.total = state.currentCart.subtotal - (action.payload || 0);
    }
  },
  extraReducers: (builder) => {
    // getPendingCarts
    builder.addCase(getPendingCarts.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getPendingCarts.fulfilled, (state, action) => {
      state.loading = false;
      state.pendingCarts = action.payload as [];
    });
    builder.addCase(getPendingCarts.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string || 'Error al obtener carritos pendientes';
    });

    // createCart
    builder.addCase(createCart.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(createCart.fulfilled, (state, action) => {
      state.loading = false;
      state.currentCart = {
        ...initialState.currentCart,
        id: action.payload.id,
        type: action.payload.type,
        status: 'pending'
      };
    });
    builder.addCase(createCart.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string || 'Error al crear carrito';
    });

    // getCart
    builder.addCase(getCart.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getCart.fulfilled, (state, action) => {
      state.loading = false;
      state.currentCart = {
        ...action.payload.data,
        items: action.payload.data.items || []
      };
    });
    builder.addCase(getCart.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string || 'Error al obtener carrito';
    });

    // deleteProductInCart
		builder.addCase(deleteProductInCart.pending, (state) => {
			state.loading = true;
			state.error = null;
		});
		builder.addCase(deleteProductInCart.fulfilled, (state, action) => {
			state.loading = false;
			const { product_id } = action.payload;
			state.currentCart.items = state.currentCart.items.filter(item => item.product_id !== product_id);
			// Recalcular totales
			state.currentCart.subtotal = state.currentCart.items.reduce((sum, item) => sum + item.total, 0);
			state.currentCart.total = state.currentCart.subtotal - (state.currentCart.discount_amount || 0);
		});
		builder.addCase(deleteProductInCart.rejected, (state, action) => {
			state.loading = false;
			state.error = action.payload as string || 'Error al eliminar producto del carrito';
		});

		// insertProductInCart
		builder.addCase(insertProductInCart.pending, (state) => {
			state.loading = true;
			state.error = null;
		});
		builder.addCase(insertProductInCart.fulfilled, (state, action) => {
			state.loading = false;
			const { product_id, material, weight, price, total, waste, type } = action.payload;
			state.currentCart.items.push({
				product_id,
				material,
				weight,
				price,
				total,
				waste,
				type
			});
			// Recalcular totales
			state.currentCart.subtotal = state.currentCart.items.reduce((sum, item) => sum + item.total, 0);
			state.currentCart.total = state.currentCart.subtotal - (state.currentCart.discount_amount || 0);
		});
		builder.addCase(insertProductInCart.rejected, (state, action) => {
			state.loading = false;
			state.error = action.payload as string || 'Error al insertar producto en el carrito';
		});

		// updateWaste
		builder.addCase(updateWaste.pending, (state) => {
			state.loading = true;
			state.error = null;
		});
		builder.addCase(updateWaste.fulfilled, (state, action) => {
			state.loading = false;
			const { product_id, waste } = action.payload;
			const itemIndex = state.currentCart.items.findIndex(item => item.product_id === product_id);
			if (itemIndex !== -1) {
				state.currentCart.items[itemIndex].waste = waste;
				// Recalcular totales
				state.currentCart.subtotal = state.currentCart.items.reduce((sum, item) => sum + item.total, 0);
				state.currentCart.total = state.currentCart.subtotal - (state.currentCart.discount_amount || 0);
			}
		});
		builder.addCase(updateWaste.rejected, (state, action) => {
			state.loading = false;
			state.error = action.payload as string || 'Error al actualizar desperdicio del producto';
		});

		// getClientCart
		builder.addCase(getClientCart.pending, (state) => {
			state.loading = true;
			state.error = null;
		});
		builder.addCase(getClientCart.fulfilled, (state, action) => {
			state.loading = false;
			state.currentCart = {
				...action.payload.data,
				items: action.payload.data.items || []
			};
		});
		builder.addCase(getClientCart.rejected, (state, action) => {
			state.loading = false;
			state.error = action.payload as string || 'Error al obtener carrito del cliente';
		});

		// updateCartVehicle
		builder.addCase(updateCartVehicle.pending, (state) => {
			state.loading = true;
			state.error = null;
		});
		builder.addCase(updateCartVehicle.fulfilled, (state, action) => {
			state.loading = false;
			const { vehicle_plate, vehicle_model } = action.payload;
			state.currentCart.vehicle_plate = vehicle_plate;
			state.currentCart.vehicle_model = vehicle_model;
		});
  }
});

export const { resetCurrentCart, updateCartItem, setDiscount } = cartSlice.actions;
export default cartSlice.reducer;