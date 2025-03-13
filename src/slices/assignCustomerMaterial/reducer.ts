import { createSlice } from "@reduxjs/toolkit";
import { assignMaterialToClient, unassignMaterialFromClient, getMaterialsByClient } from "./thunk";

// Definir el tipo de un material
interface Material {
  id: number;
  name: string;
  assigned: boolean;
}

// Definir el tipo del estado
interface MaterialState {
  materials: Material[];
  loading: boolean;
  error: string | null;
}

const initialState: MaterialState = {
  materials: [],
  loading: false,
  error: null,
};

const materialSlice = createSlice({
  name: "materials",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Asignar material
    builder.addCase(assignMaterialToClient.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(assignMaterialToClient.fulfilled, (state, action) => {
      state.loading = false;
      // Asegurar que action.payload tiene el tipo correcto
      const payload = action.payload as Material; // Type assertion
      state.materials = state.materials.map((material) =>
        material.id === payload.id ? { ...material, assigned: true } : material
      );
    });
    builder.addCase(assignMaterialToClient.rejected, (state, action) => {
      state.loading = false;
      // Asegurar que action.payload es de tipo string
      state.error = action.payload as string;
    });

    // Desasignar material
    builder.addCase(unassignMaterialFromClient.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(unassignMaterialFromClient.fulfilled, (state, action) => {
      state.loading = false;
      // Asegurar que action.payload tiene el tipo correcto
      const payload = action.payload as Material; // Type assertion
      state.materials = state.materials.map((material) =>
        material.id === payload.id ? { ...material, assigned: false } : material
      );
    });
    builder.addCase(unassignMaterialFromClient.rejected, (state, action) => {
      state.loading = false;
      // Asegurar que action.payload es de tipo string
      state.error = action.payload as string;
    });

    // Obtener materiales asignados del cliente
    builder.addCase(getMaterialsByClient.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getMaterialsByClient.fulfilled, (state, action) => {
      state.loading = false;
      // Asegurar que action.payload tiene el tipo correcto
      const payload = action.payload as Material[]; // Type assertion
      state.materials = payload;
    });
    builder.addCase(getMaterialsByClient.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export default materialSlice.reducer;