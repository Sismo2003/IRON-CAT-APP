import { createAsyncThunk } from "@reduxjs/toolkit";

import {
    assignMaterialToClient as assignMaterialToClientApi,
    unassignMaterialFromClient as unassignMaterialFromClientApi,
    getMaterialsByClient as onGetMaterialsByClientApi,
} from "../../helpers/fakebackend_helper";
import 'react-toastify/dist/ReactToastify.css';

// Thunk para obtener los materiales de un cliente
export const getMaterialsByClient = createAsyncThunk("materials/getMaterials", async (event: any) => {
    try {
      const response = await onGetMaterialsByClientApi(event.clientId );
      const materials = response.data.map((item: any) => ({
        id: item.product_id,
        name: item.material,
        assigned: item.status === "related", // Transforma "status" a "assigned"
      }));
      return materials;
    } catch (error) {
        return error;
    }
});

// Thunk para asignar un material a un cliente
export const assignMaterialToClient = createAsyncThunk("materials/assignMaterial", async (event: any) => {
  try {
    const response = assignMaterialToClientApi({ clientId: event.clientId, materialId: event.material.id });
    const data = await response;
    if (data) {
      return event.material;
    } else {
      return data;
    }
  } catch (error) {
      return error;
  }
});

// Thunk para desasignar un material de un cliente
export const unassignMaterialFromClient = createAsyncThunk("materials/unassignMaterial", async (event: any) => {
  try {
    const response = unassignMaterialFromClientApi(event);
    const data = await response;
    if (data){ 
      return event.material;
    } else {
      return data;
    }
  } catch (error) {
      return error;
  }
});