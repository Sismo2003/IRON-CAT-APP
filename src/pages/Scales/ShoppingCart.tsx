import React, { useEffect, useState } from "react";
import BreadCrumb from "Common/BreadCrumb";
import Select from 'react-select';
// import { Link } from "react-router-dom";
import scale from "assets/images/scale.png";
import { useDispatch, useSelector } from 'react-redux';
import { createSelector } from 'reselect';
import { getShopProductList as onGetProductList } from 'slices/thunk';
import { Trash2, ShoppingBasket } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

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

interface CartItem {
  id: number;
  material: string;
  weight: number;
  price: number;
  total: number;
  waste: number; // Merma siempre presente, inicializada en 0
  type: 'wholesale' | 'retail'; // Tipo de precio
  usePredefinedMerma: boolean; // Indica si se usa merma predefinida
}

const ShoppingCart = () => {
  const dispatch = useDispatch<any>();
  const navigate = useNavigate();

  const selectDataList = createSelector(
    (state: any) => state.MATERIALManagement,
    (state) => ({
      materialList: state.productList,
      loading: state.loading,
    })
  );

  const { materialList } = useSelector(selectDataList);

  const [materials, setMaterials] = useState<MaterialOption[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [weights, setWeights] = useState<{ [key: number]: number }>({});
  const [selectedMaterials, setSelectedMaterials] = useState<{ [key: number]: string }>({});
  const [selectedPriceTypes, setSelectedPriceTypes] = useState<{ [key: number]: 'wholesale' | 'retail' }>({});
  const [customerName, setCustomerName] = useState<string>(""); 

  // Opciones predefinidas para la merma
  const predefinedMermaOptions = [
    { value: 5, label: "Bote (5kg)" },
    { value: 10, label: "Charola (10kg)" },
    { value: 15, label: "Caja (15kg)" },
  ];

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
        wholesale_price: product.wholesale_price_buy,
        retail_price: product.retail_price_buy,
      }));
      setMaterials(formattedMaterials);
    }
  }, [materialList]);

  useEffect(() => {
    const ws = new WebSocket(ws_ip);

    ws.onmessage = (event) => {
      const jsonObject = JSON.parse(event.data);
      const data = eval(`(${jsonObject})`);

      if (Array.isArray(data)) {
        data.forEach(item => {
          if (item.weight === undefined) {
            console.error("El campo 'weight' no está definido en el ítem:", item);
            return;
          }

          if (typeof item.weight === 'string') {
            const numericString = item.weight.replace(/[^0-9.-]/g, "");
            item.weight = parseFloat(numericString);
          } else if (typeof item.weight !== 'number') {
            console.error("El peso no es un número ni una cadena:", item.weight);
            return;
          }
          setWeights(prev => ({ ...prev, [item.id]: item.weight }));
        });
      } else {
        if (data.weight === undefined) {
          console.error("El campo 'weight' no está definido en los datos:", data);
          return;
        }

        if (typeof data.weight === 'string') {
          const numericString = data.weight.replace(/[^0-9.-]/g, "");
          data.weight = parseFloat(numericString);
        } else if (typeof data.weight !== 'number') {
          console.error("El peso no es un número ni una cadena:", data.weight);
          return;
        }
        setWeights((prev) => ({ ...prev, [data.id]: data.weight }));
      }
    };

    return () => ws.close();
  }, []);

  // Función para mostrar alertas controladas
  const showToast = (message: string) => {
    if (!toast.isActive('unique-toast')) { // Verifica si no hay un toast activo con este id
      toast.info(message, { 
        toastId: 'unique-toast', // Usa un ID único para controlar
        autoClose: 2000 
      });
    }
  };

  // Función para agregar al carrito
  const handleAddToCart = (scaleId: number) => {
    const material = materials.find((m) => m.label === selectedMaterials[scaleId]);
    if (!material) return;

    const weight = weights[scaleId] || 0;
    const priceType = selectedPriceTypes[scaleId] || 'wholesale';
    const price = priceType === 'wholesale' ? material.wholesale_price : material.retail_price;
    const total = weight * price;

    // Validar que la merma no sea mayor que el peso
    const waste = 0; // Inicializar la merma en 0

    setCart([...cart, {
      id: scaleId,
      material: material.label,
      weight: weight - waste, // Restar la merma al peso
      price,
      total,
      waste,
      type: priceType,
      usePredefinedMerma: false, // Por defecto no usa merma predefinida
    }]);
  };

  // Función para eliminar un elemento del carrito
  const handleDeleteItem = (index: number) => {
    setCart((prevCart) => prevCart.filter((_, i) => i !== index));
  };

  // Función para actualizar la merma de un producto en el carrito
  const handleMermaChange = (index: number, value: number) => {
    const updatedCart = [...cart];
    const weight = weights[updatedCart[index].id] || 0; // Obtener el peso original

    // Validar que la merma no sea mayor que el peso
    if (value > weight) {
      showToast("La merma no puede ser mayor que el peso registrado.");
      // Limpiar el valor del Select específicamente
      updatedCart[index].waste = 0;
      // updatedCart[index].usePredefinedMerma = true; // Mantener el modo predefinido
      setCart(updatedCart);
      return;
    }

    updatedCart[index].waste = value;
    updatedCart[index].weight = weight - value; // Restar la merma al peso
    setCart(updatedCart);
  };

  // Función para cambiar entre merma manual y predefinida
  const togglePredefinedMerma = (index: number, usePredefined: boolean) => {
    const updatedCart = [...cart];
    const weight = weights[updatedCart[index].id] || 0; // Obtener el peso original

    updatedCart[index].usePredefinedMerma = usePredefined;

    if (usePredefined) {
      // Si se activa la merma predefinida, establecer la merma en 0
      updatedCart[index].waste = 0;
    } else {
      // Si se desactiva, mantener la merma actual
      updatedCart[index].waste = updatedCart[index].waste || 0;
    }

    // Validar que la merma no sea mayor que el peso
    if (updatedCart[index].waste > weight) {
      showToast("La merma no puede ser mayor que el peso registrado.");
      return;
    }

    updatedCart[index].weight = weight - updatedCart[index].waste; // Restar la merma al peso
    setCart(updatedCart);
  };

  // Función para realizar el checkout
  const handleCheckout = async () => {
    if (!customerName.trim()) {
      showToast("Por favor ingrese el nombre del cliente");
      return;
    }

    const payload = {
      total: cart.reduce((sum, item) => sum + item.total, 0),
      user_id: 1, // ID del usuario actual SE VA A CAMBIAR
      type: "shop",
      customer_name: customerName,
      cart: cart.map((item) => ({
        id: item.id,
        material: item.material,
        type: item.type,
        weight: item.weight,
        price: item.price,
        total: item.total,
        waste: item.waste,
      }))
    };
    
    try {
      const response = await fetch('http://192.168.100.77:8000/src/printer.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
  
      if (!response.ok) {
        throw new Error('Error en la solicitud');
      }
  
      const data = await response.json();
      console.log('Respuesta del servidor:', data);
  
      navigate('/apps-materials-product-list');
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <>
      <BreadCrumb title="Carrito de Compras" pageTitle="Compras" />
      <ToastContainer 
        closeButton={false} 
        limit={1} 
        autoClose={2000}
        newestOnTop
      />
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
              cart.map((item: CartItem, index: number) => (
                <div key={index} className="p-2 border-b">
                  <div className="flex items-center justify-between">
                    <span>{item.material} ({item.weight}kg)</span> {/* Mostrar el peso ajustado */}
                    <div className="flex items-center gap-2">
                      <span>${item.total.toFixed(2)}</span>
                      <button
                        className="cursor-pointer p-2 inline-flex items-center justify-center hover:bg-gray-200 hover:rounded-md"
                        onClick={() => handleDeleteItem(index)}
                      >
                        <Trash2 className="text-red-500 w-5" />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-2">
                      <input
                        id={`checkBox${index}`}
                        className="size-4 border rounded-full appearance-none cursor-pointer bg-slate-100 border-slate-200 dark:bg-zink-600 dark:border-zink-500 checked:bg-purple-500 checked:border-purple-500 dark:checked:bg-purple-500 dark:checked:border-purple-500 checked:disabled:bg-purple-400 checked:disabled:border-purple-400"
                        type="checkbox"
                        checked={item.usePredefinedMerma}
                        onChange={(e) => togglePredefinedMerma(index, e.target.checked)}
                      />
                      <label htmlFor={`checkBox${index}`} className="relative inline-block group">
                        Usar merma predefinida
                      </label>
                    </div>
                    {item.usePredefinedMerma ? (
                      <Select
                        options={predefinedMermaOptions}
                        value={item.waste > 0 ? 
                          predefinedMermaOptions.find(option => option.value === item.waste) : 
                          null
                        }
                        onChange={(selectedOption) => {
                          handleMermaChange(index, selectedOption?.value || 0);
                        }}
                        className="w-1/2 h-10"
                        isClearable={true}
                      />
                    ) : (
                      <input
                        type="number"
                        placeholder="50kg"
                        className="border border-gray-400 rounded-md px-2 py-1 w-1/2 h-10"
                        value={item.waste || ''}
                        onChange={(e) => handleMermaChange(index, parseFloat(e.target.value) || 0)}
                      />
                    )}
                  </div>
                </div>
              ))
            )}
            <div className="mt-4">
              <h6 className="text-10 text-gray-400 font-light mb-2">
                Total Merma: {cart.reduce((sum, item) => sum + item.waste, 0).toFixed(2)}/kg
              </h6>
              <h6 className="text-16">
                Total: ${cart.reduce((sum, item) => sum + item.total, 0).toFixed(2)}
              </h6>

              {/* Nuevo input para el cliente */}
              <div className="my-3 border-t pt-3">
                <label htmlFor="customerName" className="inline-block mb-2 text-base font-medium">
                  Nombre del Cliente
                </label>
                <input
                  type="text"
                  id="customerName"
                  className="form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200"
                  placeholder="Ingrese nombre del cliente"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  required
                />
                {!customerName.trim() && (
                  <p className="mt-1 text-sm text-red-500">Este campo es requerido</p>
                )}
              </div>

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