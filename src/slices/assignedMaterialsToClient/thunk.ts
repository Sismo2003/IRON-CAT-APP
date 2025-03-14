import { createAsyncThunk } from "@reduxjs/toolkit";

import {
    getAssignedMaterials as onGetAssignedMaterials,
} from "../../helpers/fakebackend_helper";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

// Thunk para obtener materiales asignados a un cliente
export const getMaterialsAssignedByClient = createAsyncThunk("materials/getMaterials", async (event: any) => {
  try {
    const response = await onGetAssignedMaterials(event.clientId );
    const materials = response.data.map((item: any) => ({
      value: item.product_id,
      label: item.material,
      wholesale_price_buy: item.wholesale_price_buy,
      wholesale_price_sell: item.wholesale_price_sell,
      retail_price_buy: item.retail_price_buy,
      retail_price_sell: item.retail_price_sell
    }));
    return materials;
  } catch (error) {
      return error;
  }
});