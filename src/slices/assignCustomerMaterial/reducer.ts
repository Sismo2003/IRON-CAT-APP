import { createSlice } from "@reduxjs/toolkit";
import { assignMaterialToClient, unassignMaterialFromClient, getMaterialsByClient } from "./thunk";

// Definir el tipo de un material
interface Material {
  id: number;
  name: string;
  assigned: boolean;
}

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
  materials: Material[];
  loading: boolean;
  error: string | null;
  assignedMaterials: MaterialAssigned[];
}

const initialState: MaterialState = {
  materials: [],
  assignedMaterials: [],
  loading: false,
  error: null,
};

const materialSlice = createSlice({
  name: "materials",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Asignar material
    builder
      .addCase(assignMaterialToClient.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(assignMaterialToClient.fulfilled, (state, action) => {
        state.loading = false;
        const payload = action.payload as Material; // Type assertion
        state.materials = state.materials.map((material) =>
          material.id === payload.id ? { ...material, assigned: true } : material
        );
      })
      .addCase(assignMaterialToClient.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Desasignar material
    builder
      .addCase(unassignMaterialFromClient.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(unassignMaterialFromClient.fulfilled, (state, action) => {
        state.loading = false;
        const payload = action.payload as Material; // Type assertion
        state.materials = state.materials.map((material) =>
          material.id === payload.id ? { ...material, assigned: false } : material
        );
      })
      .addCase(unassignMaterialFromClient.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Obtener materiales del cliente
    builder
      .addCase(getMaterialsByClient.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMaterialsByClient.fulfilled, (state, action) => {
        state.loading = false;
        const payload = action.payload as Material[]; // Type assertion
        state.materials = payload;
      })
      .addCase(getMaterialsByClient.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default materialSlice.reducer;