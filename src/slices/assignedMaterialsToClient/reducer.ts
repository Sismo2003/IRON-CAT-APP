import { createSlice } from "@reduxjs/toolkit";
import { getMaterialsAssignedByClient } from "./thunk";

interface MaterialAssigned {
  value: number;
  label: string;
  wholesale_price_buy: number;
  wholesale_price_sell: number;
  retail_price_buy: number;
  retail_price_sell: number;
}

// Definir el tipo del estado
interface MaterialState {
  loading: boolean;
  error: string | null;
  assignedMaterials: MaterialAssigned[];
}

const initialState: MaterialState = {
  assignedMaterials: [],
  loading: false,
  error: null,
};

const materialSlice = createSlice({
  name: "assignedMaterials",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Obtener materiales asignados al cliente
    builder
      .addCase(getMaterialsAssignedByClient.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMaterialsAssignedByClient.fulfilled, (state, action) => {
        state.loading = false;
        const payload = action.payload as MaterialAssigned[]; // Type assertion
        state.assignedMaterials = payload;
      })
      .addCase(getMaterialsAssignedByClient.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default materialSlice.reducer;