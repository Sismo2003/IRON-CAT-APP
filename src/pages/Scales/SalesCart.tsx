import React, { useEffect, useState } from "react";
import BreadCrumb from "Common/BreadCrumb";
import Select from 'react-select';
import scale from "assets/images/scale.png";
import { useDispatch, useSelector } from 'react-redux';
import { createSelector } from 'reselect';
import { getShopProductList as onGetProductList } from 'slices/thunk';
import { Trash2,ShoppingBasket } from 'lucide-react';
const ws_ip = "ws://thegrid.myddns.me:3001";

const scales = [
  { id: 1, name: "Bascula 1", img: scale },
  { id: 3, name: "Bascula 2", img: scale },
  { id: 4, name: "Bascula 3", img: scale },
  { id: 2, name: "Bascula 4", img: scale },
];

interface MaterialOption {
  value: number;
  label: string;
  wholesale_price: number;
  retail_price: number;
}

const ShoppingCart = () => {
  const dispatch = useDispatch<any>();

  const selectDataList = createSelector(
    (state: any) => state.MATERIALManagement,
    (state) => ({
      materialList: state.productList,
      loading: state.loading,
    })
  );

  const { materialList } = useSelector(selectDataList);

  const [materials, setMaterials] = useState<MaterialOption[]>([]);
  const [cart, setCart] = useState<any>([]);
  const [weights, setWeights] = useState<{ [key: number]: number }>({});
  const [selectedMaterials, setSelectedMaterials] = useState<{ [key: number]: string }>({});
  const [selectedPriceTypes, setSelectedPriceTypes] = useState<{ [key: number]: 'wholesale' | 'retail' }>({}); // Estado para el tipo de precio por báscula

  const [mermaDefault, setMermaDefault] = useState<{ [key: number]: boolean }>({});
  const [mermaValues, setMermaValues] = useState<{ [key: number]: string }>({});


  // Obtener datos de la base de datos
  useEffect(() => {
    dispatch(onGetProductList());
  }, [dispatch]);

  // Transformar los datos de la base de datos
  useEffect(() => {
    if (materialList && materialList.length > 0) {
      const formattedMaterials = materialList.map((product: any) => ({
        value: product.id,
        label: product.material,
        wholesale_price: product.wholesale_price_sell,
        retail_price: product.retail_price_sell,
      }));
      setMaterials(formattedMaterials);
    }
  }, [materialList]);

  useEffect(() => {
    const ws = new WebSocket(ws_ip);
  
    ws.onmessage = (event) => {

      const jsonObject = JSON.parse(event.data);
      const data = eval(`(${jsonObject})`);
      // console.log(jsonObject);
      // console.log(typeof data);
      // console.log("📦 Mensaje recibido del WebSocket:", data);
  
      if (Array.isArray(data)) {
        data.forEach(item => {
          // console.log("Procesando ítem:", item);
  
          // Verificar si el campo 'weight' está presente
          if (item.weight === undefined) {
            console.error("El campo 'weight' no está definido en el ítem:", item);
            return; // Salir del bucle para este ítem si el peso no está definido
          }
  
          // Procesar el peso si está presente
          if (typeof item.weight === 'string') {
            // console.log("Peso (string) antes de procesar:", item.weight);
            const numericString = item.weight.replace(/[^0-9.-]/g, ""); // Extraer números, puntos y signos negativos
            item.weight = parseFloat(numericString); // Convertir a número
            // console.log("Peso (número) después de procesar:", item.weight);
          } else if (typeof item.weight !== 'number') {
            // console.error("El peso no es un número ni una cadena:", item.weight);
            return; // Salir del bucle para este ítem si el peso no es manejable
          }
          setWeights(prev => ({ ...prev, [item.id]: item.weight }));
        });
      } else {
        // console.log("Procesando datos:", data);
  
        // Verificar si el campo 'weight' está presente
        if (data.weight === undefined) {
          console.error("El campo 'weight' no está definido en los datos:", data);
          return; // No actualizar el estado si el peso no está definido
        }
  
        // Procesar el peso si está presente
        if (typeof data.weight === 'string') {
          // console.log("Peso (string) antes de procesar:", data.weight);
          const numericString = data.weight.replace(/[^0-9.-]/g, ""); // Extraer números, puntos y signos negativos
          data.weight = parseFloat(numericString); // Convertir a número
          // console.log("Peso (número) después de procesar:", data.weight);
        } else if (typeof data.weight !== 'number') {
          console.error("El peso no es un número ni una cadena:", data.weight);
          return; // No actualizar el estado si el peso no es manejable
        }
        setWeights((prev) => ({ ...prev, [data.id]: data.weight }));
      }
    };
  
    return () => ws.close();
  }, []);

  // Función para agregar al carrito
  const handleAddToCart = (scaleId: number) => {
    const material = materials.find((m) => m.label === selectedMaterials[scaleId]);
    if (!material) return;

    const weight = weights[scaleId] || 0;
    const priceType = selectedPriceTypes[scaleId] || 'wholesale'; // Obtener el tipo de precio seleccionado para esta báscula
    const price = priceType === 'wholesale' ? material.wholesale_price : material.retail_price; // Usar el precio seleccionado
    const total = weight * price;

    setCart([...cart, {
      id: scaleId,
      material: material.label,
      weight,
      price,
      total,
    }]);
  };

  const handleCheckout = async () => {
    console.log("fetch")
    try {
      const response = await fetch('http://192.168.100.77:8000/src/printer.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cart }),
      });

      if (!response.ok) {
        throw new Error('Error en la solicitud');
      }

      const data = await response.json();
      console.log('Respuesta del servidor:', data);

      // Redirigir al usuario a la página de checkout o mostrar un mensaje de éxito
      window.location.href = '/apps-materials-product-list';
    } catch (error) {
      console.error('Error:', error);
    }
  };


  const handleDeleteItem = (index: number) => {
    setCart((prevCart: any[]) => prevCart.filter((_, i) => i !== index));
  };

  return (
    <>
      <BreadCrumb title="Carrito de Compras" pageTitle="Compras" />
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-x-5">
        <div className="xl:col-span-9">
          <h5 className="underline text-16 mb-5">Basculas</h5>
          {scales.map((scale) => (
            <div key={scale.id} className="card p-4 mb-4 bg-white shadow rounded-lg">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <img src={scale.img} alt={scale.name} className="w-full max-w-[100px] h-auto rounded-lg mx-auto" />
                <div>
                  <h5>{scale.name}</h5>
                  <p className="text-slate-500">Peso: {weights[scale.id] || 0} kg</p>
                  <Select
                    className="border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200"
                    options={materials}
                    isSearchable={true}
                    name="materialTypeSelect"
                    id="materialTypeSelect"
                    onChange={(selectedOption) =>
                      setSelectedMaterials({ ...selectedMaterials, [scale.id]: selectedOption?.label || "" })
                    }
                  />
                  {/* Select para elegir el tipo de precio */}
                  <Select
                    className="mt-2 border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200"
                    options={[
                      { value: 'wholesale', label: 'Precio de Mayoreo' },
                      { value: 'retail', label: 'Precio de Menudeo' },
                    ]}
                    value={{
                      value: selectedPriceTypes[scale.id] || 'wholesale',
                      label: selectedPriceTypes[scale.id] === 'retail' ? 'Precio de Menudeo' : 'Precio de Mayoreo',
                    }}
                    onChange={(selectedOption) =>
                      setSelectedPriceTypes({ ...selectedPriceTypes, [scale.id]: selectedOption?.value as 'wholesale' | 'retail' })
                    }
                    placeholder="Seleccionar tipo de precio"
                  />
                </div>
                <button
                  className="bg-blue-500 text-white p-2 rounded-lg mt-4"
                  onClick={() => handleAddToCart(scale.id)}
                >
                  Registrar al carrito
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="xl:col-span-3">
          <div className="card p-4 bg-white shadow rounded-lg">
            <h6 className="mb-4 text-15">Carrito de compras<span className="inline-flex items-center justify-center size-5 ml-1 text-[11px] font-medium border rounded-full text-white bg-custom-500 border-custom-500">{cart.length ? cart.length : 0}</span></h6>
            {cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center my-5">
                <ShoppingBasket className="w-12 h-12 text-gray-500" />
                <p className="mt-2 text-gray-600 text-sm">Carrito está vacío!</p>
              </div>
            ) : (
              cart.map((item: any, index: any) => (
                  <div key={index} className="p-2 border-b">
                    <div className="flex items-center justify-between">
                      <span>{item.material} ({item.weight}kg)</span>
                      <div className="flex items-center gap-2">
                        <span>${item.total.toFixed(2)}</span>
                        <a
                            className="cursor-pointer p-2 inline-flex items-center justify-center hover:bg-gray-200 hover:rounded-md"
                            onClick={() => handleDeleteItem(index)}
                        >
                          <Trash2 className="text-red-500 w-5" />
                        </a>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-2">
                        <input
                            id={'checkBox' +index}
                            className="size-4 border rounded-full appearance-none cursor-pointer bg-slate-100 border-slate-200 dark:bg-zink-600 dark:border-zink-500 checked:bg-purple-500 checked:border-purple-500 dark:checked:bg-purple-500 dark:checked:border-purple-500 checked:disabled:bg-purple-400 checked:disabled:border-purple-400"
                            type="checkbox"
                            checked={mermaDefault[index] || false}
                            onChange={(e) =>
                                setMermaDefault({ ...mermaDefault, [index]: e.target.checked })
                            }
                        />
                        <label htmlFor={'checkBox' +index} className="relative inline-block group">
                          Fijar merma
                        </label>
                      </div>
                      {mermaDefault[index] ? (
                          <Select
                              options={[
                                { value: '10', label: '10kg' },
                                { value: '20', label: '20kg' },
                                { value: '30', label: '30kg' },
                              ]}
                              value={
                                mermaValues[index]
                                    ? { value: mermaValues[index], label: `${mermaValues[index]}kg` }
                                    : null
                              }
                              onChange={(selectedOption: any) =>
                                  setMermaValues({ ...mermaValues, [index]: selectedOption?.value })
                              }
                              className="w-1/2 h-10"

                          />
                      ) : (
                          <input
                              type="number"
                              placeholder="50kg"
                              className="border border-gray-400 rounded-md px-2 py-1 w-1/2 h-10"
                              value={mermaValues[index] || ''}
                              onChange={(e) =>
                                  setMermaValues({ ...mermaValues, [index]: e.target.value })
                              }
                          />
                      )}

                    </div>
                  </div>
              ))
            )}
            <div className="mt-4">
              <h6 className="text-10 text-gray-400 font-light mb-2">
                Total Merma: {cart.reduce((sum: any, item: any) => sum + item.value, 0).toFixed(2)}/kg
              </h6>
              <h6 className="text-16">
                Total: ${cart.reduce((sum: any, item: any) => sum + item.total, 0).toFixed(2)}
              </h6>


              <button
                onClick={handleCheckout}
                className="w-full mt-3 text-white bg-red-500 border-red-500 btn hover:text-white hover:bg-red-600 hover:border-red-600 focus:text-white focus:bg-red-600 focus:border-red-600 focus:ring focus:ring-red-100 active:text-white active:bg-red-600 active:border-red-600 active:ring active:ring-red-100 dark:ring-custom-400/20"
              >
                Imprimir
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ShoppingCart;