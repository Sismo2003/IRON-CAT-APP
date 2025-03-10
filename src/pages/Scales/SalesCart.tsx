import React, { useEffect, useState } from "react";
// import { Trash2, Plus, Minus } from "lucide-react";
import BreadCrumb from "Common/BreadCrumb";
import Select from 'react-select';
import { Link } from "react-router-dom";
// import DeleteModal from "Common/DeleteModal";
import scale from "assets/images/scale.png";

// pull materials
import {
  getSaleProductList as onGetProductList
} from 'slices/thunk';

// react-redux
import { useDispatch, useSelector } from 'react-redux';
import { createSelector } from 'reselect';

const ws_ip: string = process.env.REACT_APP_WS_URL || 'ws://localhost:3001';



// const materials = [
//   { value: 10, label: "Iron" },
//   { value: 15, label: "Copper" },
//   { value: 8, label: "Aluminum" },
// ];

const scales = [
  { id: 1, name: "Bascula 1", img: scale },
  { id: 2, name: "Bascula 2", img: scale },
  { id: 3, name: "Bascula 3", img: scale },
];

const ShoppingCart = () => {

  interface MaterialOption {
    value: number;
    label: string;
    wholesale_price: number;
    retail_price: number;
  }

  const dispatch = useDispatch<any>();

  const selectDataList = createSelector(
      (state: any) => state.EcommerceSale,
      (state) => ({
          materialList: state.productList,
          loading: state.loading
      })
  );

  const { materialList } = useSelector(selectDataList);

  const [materials, setMaterials] = useState<MaterialOption[]>([]);

  const [cart, setCart] = useState<any>([]);
  const [weights, setWeights] = useState<{ [key: number]: number }>({});
  const [selectedMaterials, setSelectedMaterials] = useState<{ [key: number]: string }>({});

  // Get Data
  useEffect(() => {
      dispatch(onGetProductList());
  }, [dispatch]);

  useEffect(() => {
    if (materialList && materialList.length > 0) {
      const formattedMaterials = materialList.map((product: any) => ({
        value: product.id, // Usamos el ID como valor
        label: product.material, // El nombre del material como etiqueta
        wholesale_price: product.wholesale_price, // Precio de mayoreo
        retail_price: product.retail_price, // Precio de menudeo
      }));
      setMaterials(formattedMaterials);
    }
  }, [materialList]);

  // WebSocket para obtener pesos
  useEffect(() => {
    // setWeights((prev) => ({ ...prev, [1]: 80 })) // Peso de Prueba de la Bascula 1 (80kg)
    const ws = new WebSocket(ws_ip);

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("📦 Mensaje recibido del WebSocket:", data);
      if (Array.isArray(data)) {
        data.forEach(item => {
          setWeights(prev => ({ ...prev, [item.id]: item.weight }));
        });
      } else {
        setWeights((prev) => ({ ...prev, [data.id]: data.weight }));
      }
    };
    return () => ws.close();
  }, []);

  const handleAddToCart = (scaleId: number) => {
    const material = materials.find((m) => m.label === selectedMaterials[scaleId]);
    if (!material) return;
    console.log("🛒 Agregando al carrito:", material, scaleId);
    const weight = weights[scaleId] || 0;
    const total = weight * material.wholesale_price; // Usamos el precio de mayoreo
  
    setCart([...cart, {
      id: scaleId,
      material: material.label,
      weight,
      price: material.wholesale_price, // Precio de mayoreo
      total,
    }]);
  };

  return (
    <>
      <BreadCrumb title="Carrito de Ventas" pageTitle="Ventas" />
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-x-5">
        <div className="xl:col-span-9">
          <h5 className="underline text-16 mb-5">Basculas</h5>
          {scales.map((scale) => (
            <div key={scale.id} className="card p-4 mb-4 bg-white shadow rounded-lg">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <img src={scale.img} alt={scale.name} className="w-full max-w-[100px] h-auto rounded-lg mx-auto" />
                <div>
                  <h5>{scale.name}</h5>
                  <p className="text-slate-500">Weight: {weights[scale.id] || 0} kg</p>
                  <Select
                    className="border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200"
                    options={materials}
                    isSearchable={true} // Permitir búsqueda
                    name="materialTypeSelect"
                    id="materialTypeSelect"
                    onChange={(selectedOption) =>
                      setSelectedMaterials({ ...selectedMaterials, [scale.id]: selectedOption?.label || "" })
                    }
                  />
                </div>
                <button
                  className="bg-blue-500 text-white p-2 rounded-lg mt-4"
                  onClick={() => handleAddToCart(scale.id)}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="xl:col-span-3">
          <div className="card p-4 bg-white shadow rounded-lg">
            <h6 className="mb-4 text-15">Venta De Material <span className="inline-flex items-center justify-center size-5 ml-1 text-[11px] font-medium border rounded-full text-white bg-custom-500 border-custom-500">{ cart.length ? cart.length : 0 }</span></h6>
            {cart.length === 0 ? (
              <p className="text-slate-500">Carrito está vacío</p>
            ) : (
              cart.map((item: any, index: any) => (
                <div key={index} className="flex justify-between p-2 border-b">
                  <span>{item.material} ({item.weight}kg)</span>
                  <span>${item.total.toFixed(2)}</span>
                </div>
              ))
            )}
            <div className="mt-4">
              <h6 className="text-16">Total: ${cart.reduce((sum: any, item: any) => sum + item.total, 0).toFixed(2)}</h6>
              <Link to="/apps-ecommerce-checkout" className="w-full text-white bg-red-500 border-red-500 btn
              hover:text-white hover:bg-red-600 hover:border-red-600 focus:text-white focus:bg-red-600
              focus:border-red-600 focus:ring focus:ring-red-100 active:text-white active:bg-red-600
              active:border-red-600 active:ring active:ring-red-100 dark:ring-custom-400/20"
              >Finalizar Compra</Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ShoppingCart;

