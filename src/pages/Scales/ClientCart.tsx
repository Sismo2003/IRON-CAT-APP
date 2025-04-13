import React, { useEffect, useState } from "react";
import BreadCrumb from "Common/BreadCrumb";
import Select from 'react-select';
// import { Link } from "react-router-dom";
import scale from "assets/images/scale.png";
import { useDispatch, useSelector } from 'react-redux';
import { createSelector } from 'reselect';
import { 
  getMaterialsAssignedByClient as onGetMaterialsAssignedByClient, // Acción para obtener materiales asignados por cliente
  getCustomer as onGetCustomer, // Acción para obtener la lista de clientes
  addTicket as onAddTicket, // Acción para agregar un ticket
  getWasteRecords as onGetWasteRecords, // Acción para obtener la lista de merma
} from 'slices/thunk';
import { Trash2, ShoppingBasket } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const ws_ip = "ws://thegrid.myddns.me:3001";

const scales = [
  { id: 1, name: "Bascula 1", img: scale },
  { id: 2, name: "Bascula 2", img: scale },
  { id: 3, name: "Bascula 3", img: scale },
];

interface MaterialOption {
  value: number;
  label: string;
  wholesale_price_buy: number;
  retail_price_buy: number;
  wholesale_price_sell: number;
  retail_price_sell: number;
}

interface ClientOption {
  value: number;
  label: string;
}

interface CartItem {
  id: number;
  product_id: number;
  material: string;
  weight: number;
  price: number;
  total: number;
  waste: number;
  type: 'wholesale' | 'retail';
  usePredefinedMerma: boolean;
}

interface WasteOption {
  value: number; // weight como número
  label: string; // name de la merma
  wasteId: string; // waste_id para referencia
  img?: string; // Imagen opcional
}

// Componente personalizado para mostrar opciones con imágenes
const CustomOption = ({ innerProps, label, data }: any) => (
  <div {...innerProps} className="flex items-center p-2 hover:bg-gray-100 dark:hover:bg-zink-600 cursor-pointer">
    {data.img && (
      <img src={data.img} alt={label} className="w-8 h-8 mr-2 rounded-full" />
    )}
    <span className="text-slate-700 dark:text-zink-100">{`${label} - (${data.value}kg)`}</span>
  </div>
);

const CustomSingleValue = ({ data }: any) => (
  <div className="flex items-center">
    {data.img && (
      <img src={data.img} alt={data.label} className="w-6 h-6 mr-2 rounded-full" />
    )}
    <span className="text-slate-700 dark:text-zink-100">{`${data.label} - (${data.value}kg)`}</span>
  </div>
);

const ShoppingCart = () => {
  const dispatch = useDispatch<any>();
  const navigate = useNavigate();
  

  const selectDataList = createSelector(
    (state: any) => state.AssignedMaterials,
    (state) => ({
      materialList: state.assignedMaterials,
      loading: state.loading,
    })
  );

  const clientDataList = createSelector(
    (state: any) => state.CUSTOMERManagement,
    (state) => ({
      clientlList: state.customerlist,
    })
  );

  const selectWasteList = createSelector(
    (state: any) => state.WasteManagement,
    (state) => ({
      wasteList: state.wastelist,
      loading: state.loading,
    })
  );

  const { materialList } = useSelector(selectDataList);
  const { clientlList } = useSelector(clientDataList);
  const { wasteList } = useSelector(selectWasteList);

  const [materials, setMaterials] = useState<MaterialOption[]>([]);
  const [selectedClient, setSelectedClient] = useState<ClientOption | null>(null);
  const [transactionType, setTransactionType] = useState<'compra' | 'venta' | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [weights, setWeights] = useState<{ [key: number]: number }>({});
  const [selectedMaterials, setSelectedMaterials] = useState<{ [key: number]: string }>({});
  const [wasteOptions, setWasteOptions] = useState<WasteOption[]>([]);
  const [clientSearch, setClientSearch] = useState('');
  const [selectedPriceTypes, setSelectedPriceTypes] = useState<{
    [key: number]: 'wholesale' | 'retail';
  }>({});
  const [authUser, setAuthUser] = useState(() => 
    JSON.parse(localStorage.getItem('authUser') || '{}')
  );

  // Obtener clientes y datos de usuario
  useEffect(() => {
    dispatch(onGetCustomer());
    dispatch(onGetWasteRecords());
    setAuthUser(JSON.parse(localStorage.getItem('authUser') || '{}'));
  }, [dispatch]);

  // Obtener materiales ligados al cliente seleccionado
  useEffect(() => {
    if (selectedClient && transactionType) {
      dispatch(onGetMaterialsAssignedByClient({ clientId: selectedClient.value }));
    }
  }, [dispatch, selectedClient, transactionType]);

  // Transformar los datos de la lista de merma
  useEffect(() => {
    if (wasteList && wasteList.length > 0) {
      const formattedWasteOptions = wasteList.map((waste: any) => ({
        value: parseFloat(waste.weight), // Convertir el peso a número
        label: waste.name,
        wasteId: waste.waste_id,
        img: waste.img, // Incluir la imagen si está disponible
      }));
      setWasteOptions(formattedWasteOptions);
    }
  }, [wasteList]);

  // Transformar los datos de los materiales
  useEffect(() => {
    if (materialList && materialList.length > 0) {

      const formattedMaterials = materialList.map((material: any) => ({
        value: material.value,
        label: material.label,
        wholesale_price_buy: material.wholesale_price_buy,
        retail_price_buy: material.retail_price_buy,
        wholesale_price_sell: material.wholesale_price_sell,
        retail_price_sell: material.retail_price_sell,
      }));
      setMaterials(formattedMaterials);
    } else {
      setMaterials([]);
    }
  }, [materialList]);

  // WebSocket para obtener pesos
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

  // Limpiar selecciones cuando cambia el cliente
  const handleClientChange = (selectedOption: ClientOption | null) => {
    setSelectedClient(selectedOption);
    setSelectedMaterials({});
    setSelectedPriceTypes({});
    setCart([]);
  };

  const filteredClients = clientlList
  .filter((client: any) => 
    client.name.toLowerCase().includes(clientSearch.toLowerCase()) ||
    (client.fullname && client.fullname.toLowerCase().includes(clientSearch.toLowerCase()))
  )
  .slice(0, 100)
  .map((client: any) => ({
    value: client.id,
    label: client.fullname ? `${client.name} (${client.fullname})` : client.name, 
    originalLabel: client.name, 
    fullname: client.fullname 
  }));

  // Función para mostrar alertas controladas
  const showToast = (message: string) => {
    if (!toast.isActive('unique-toast')) {
      toast.info(message, { 
        toastId: 'unique-toast',
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
    
    // Seleccionar el precio correcto en función del tipo de transacción
    let price = 0;
    if (transactionType === 'compra') {
      price = priceType === 'wholesale' ? material.wholesale_price_buy : material.retail_price_buy;
    } else if (transactionType === 'venta') {
      price = priceType === 'wholesale' ? material.wholesale_price_sell : material.retail_price_sell;
    }

    const total = weight * price;
    const waste = 0; // Inicializar la merma en 0

    setCart([...cart, {
      id: scaleId,
      product_id: material.value,
      material: material.label,
      weight: weight - waste,
      price,
      total,
      waste,
      type: priceType,
      usePredefinedMerma: false,
    }]);
  };

  // Función para eliminar un elemento del carrito
  const handleDeleteItem = (index: number) => {
    setCart((prevCart) => prevCart.filter((_, i) => i !== index));
  };

  // Función para actualizar la merma de un producto en el carrito
  const handleMermaChange = (index: number, value: number) => {
    const updatedCart = [...cart];
    const weight = weights[updatedCart[index].id] || 0;

    if (value > weight) {
      showToast("La merma no puede ser mayor que el peso registrado.");
      updatedCart[index].waste = 0;
      setCart(updatedCart);
      return;
    }

    if (value < 0) {
      updatedCart[index].waste = 0;
      setCart(updatedCart);
      return;
    }

    updatedCart[index].waste = value;
    updatedCart[index].weight = weight - value;
    setCart(updatedCart);
  };

  // Función para cambiar entre merma manual y predefinida
  const togglePredefinedMerma = (index: number, usePredefined: boolean) => {
    const updatedCart = [...cart];
    const weight = weights[updatedCart[index].id] || 0;

    updatedCart[index].usePredefinedMerma = usePredefined;

    if (usePredefined) {
      updatedCart[index].waste = 0;
    } else {
      updatedCart[index].waste = updatedCart[index].waste || 0;
    }

    if (updatedCart[index].waste > weight) {
      showToast("La merma no puede ser mayor que el peso registrado.");
      return;
    }

    updatedCart[index].weight = weight - updatedCart[index].waste;
    setCart(updatedCart);
  };

  // Función para realizar el checkout
  const handleCheckout = async () => {
    if (cart.length === 0) {
      showToast("El carrito está vacío.");
      return;
    }

    const payload = {
      total: cart.reduce((sum, item) => sum + item.total, 0),
      user_id: authUser.id, 
      type: transactionType,
      customer_name: selectedClient?.label,
      client_id: selectedClient?.value,
      cart: cart.map((item) => ({
        id: item.id,
        product_id: item.product_id,
        material: item.material,
        type: item.type,
        weight: item.weight,
        price: item.price,
        total: item.total,
        waste: item.waste,
      }))
    };

    // Primero despacha la acción y espera su resolución
    const result = await dispatch(onAddTicket(payload));
    console.log('Resultado del thunk:', result); // Verifica esto en consola

    // Limpiar estados después de éxito
    setCart([]);
    setSelectedClient(null);
    setTransactionType(null);
    setSelectedMaterials({});
    setSelectedPriceTypes({});
    setWeights({});

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
      <BreadCrumb title="Carrito de clientes especiales" pageTitle="Clientes especiales" />
      <ToastContainer 
        closeButton={false} 
        limit={1} 
        autoClose={2000}
        newestOnTop
      />
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-x-5">
        <div className="xl:col-span-9">
          <h5 className="underline text-16 mb-5">Basculas</h5>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-5">
            <Select
              options={filteredClients}
              isSearchable={true}
              placeholder="Seleccionar cliente"
              value={selectedClient}
              onChange={handleClientChange}
              onInputChange={setClientSearch} // Actualiza el filtro al escribir
              filterOption={null} // Desactiva el filtro interno
              classNames={{
                control: ({ isFocused }) =>
                  `border ${
                    isFocused ? 'border-custom-500 dark:border-custom-800' : 'border-slate-200 dark:border-zink-500'
                  } bg-white dark:bg-zink-700`,
                placeholder: () => 'text-slate-400 dark:text-zink-200',
                singleValue: () => 'dark:text-zink-100',
                menu: () => 'dark:bg-zink-700',
                option: ({ isFocused, isSelected }) =>
                  `cursor-pointer px-3 py-2 ${
                    isFocused ? 'bg-custom-500 text-white' : isSelected ? 'bg-custom-600 text-white' : 'text-slate-800 dark:text-zink-100'
                  }`,
              }}
            />
            <Select
              options={[
                { value: 'compra', label: 'Compra' },
                { value: 'venta', label: 'Venta' },
              ]}
              placeholder="Seleccionar tipo de transacción"
              value={transactionType ? { value: transactionType, label: transactionType === 'compra' ? 'Compra' : 'Venta' } : null}
              onChange={(selectedOption) => setTransactionType(selectedOption?.value as 'compra' | 'venta' | null)}
              classNames={{
                control: ({ isFocused }) =>
                  `border ${
                    isFocused ? 'border-custom-500 dark:border-custom-800' : 'border-slate-200 dark:border-zink-500'
                  } bg-white dark:bg-zink-700`,
                placeholder: () => 'text-slate-400 dark:text-zink-200',
                singleValue: () => 'dark:text-zink-100',
                menu: () => 'dark:bg-zink-700',
                option: ({ isFocused, isSelected }) =>
                  `cursor-pointer px-3 py-2 ${
                    isFocused ? 'bg-custom-500 text-white' : isSelected ? 'bg-custom-600 text-white' : 'text-slate-800 dark:text-zink-100'
                  }`,
              }}
            />
          </div>
          {scales.map((scale) => (
            <div key={scale.id} className="card p-4 mb-4 bg-white shadow rounded-lg">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <img src={scale.img} alt={scale.name} className="w-full max-w-[100px] h-auto rounded-lg mx-auto" />
                <div>
                  <h5>{scale.name}</h5>
                  <p className="text-slate-500">Peso: {weights[scale.id] || 0} kg</p>
                  <Select
                    options={materials}
                    isSearchable={true}
                    name="materialTypeSelect"
                    id="materialTypeSelect"
                    isDisabled={!selectedClient || !transactionType}
                    onChange={(selectedOption) =>
                      setSelectedMaterials({ ...selectedMaterials, [scale.id]: selectedOption?.label || "" })
                    }
                    value={selectedMaterials[scale.id] ? 
                      materials.find(m => m.label === selectedMaterials[scale.id]) : null
                    }
                    placeholder="Seleccionar"
                    classNames={{
                      control: ({ isFocused }) =>
                        `border ${
                          isFocused ? 'border-custom-500 dark:border-custom-800' : 'border-slate-200 dark:border-zink-500'
                        } bg-white dark:bg-zink-700`,
                      placeholder: () => 'text-slate-400 dark:text-zink-200',
                      singleValue: () => 'dark:text-zink-100',
                      menu: () => 'dark:bg-zink-700',
                      option: ({ isFocused, isSelected }) =>
                        `cursor-pointer px-3 py-2 ${
                          isFocused ? 'bg-custom-500 text-white' : isSelected ? 'bg-custom-600 text-white' : 'text-slate-800 dark:text-zink-100'
                        }`,
                    }}
                  />
                  <Select
                    options={[
                      { value: 'wholesale', label: 'Precio de Mayoreo' },
                      { value: 'retail', label: 'Precio de Menudeo' },
                    ]}
                    value={{
                      value: selectedPriceTypes[scale.id] || 'wholesale',
                      label: selectedPriceTypes[scale.id] === 'retail' ? 'Precio de Menudeo' : 'Precio de Mayoreo',
                    }}
                    isDisabled={!selectedClient || !transactionType}
                    onChange={(selectedOption) =>
                      setSelectedPriceTypes({ ...selectedPriceTypes, [scale.id]: selectedOption?.value as 'wholesale' | 'retail' })
                    }
                    placeholder="Seleccionar tipo de precio"
                    classNames={{
                      control: ({ isFocused }) =>
                        `border mt-2 ${
                          isFocused ? 'border-custom-500 dark:border-custom-800' : 'border-slate-200 dark:border-zink-500'
                        } bg-white dark:bg-zink-700`,
                      placeholder: () => 'text-slate-400 dark:text-zink-200',
                      singleValue: () => 'dark:text-zink-100',
                      menu: () => 'dark:bg-zink-700',
                      option: ({ isFocused, isSelected }) =>
                        `cursor-pointer px-3 py-2 ${
                          isFocused ? 'bg-custom-500 text-white' : isSelected ? 'bg-custom-600 text-white' : 'text-slate-800 dark:text-zink-100'
                        }`,
                    }}
                  />
                </div>
                <button
                  className="bg-blue-500 text-white p-2 rounded-lg mt-4"
                  onClick={() => handleAddToCart(scale.id)}
                  disabled={!selectedClient || !transactionType || !selectedMaterials[scale.id]}
                >
                  Registrar al carrito
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="xl:col-span-3">
          <div className="card p-4 bg-white shadow rounded-lg">
            <h6 className="mb-4 text-15">Carrito de clientes especiales<span className="inline-flex items-center justify-center size-5 ml-1 text-[11px] font-medium border rounded-full text-white bg-custom-500 border-custom-500">{cart.length ? cart.length : 0}</span></h6>
            {cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center my-5">
                <ShoppingBasket className="w-12 h-12 text-gray-500" />
                <p className="mt-2 text-gray-600 text-sm">Carrito está vacío!</p>
              </div>
            ) : (
              cart.map((item: CartItem, index: number) => (
                <div key={index} className="p-2 border-b">
                  <div className="flex items-center justify-between">
                    <span>{item.material} ({item.weight}kg)</span>
                    <div className="flex items-center gap-2">
                      <span>${item.total.toFixed(2)}</span>
                      <button
                        className="cursor-pointer p-2 inline-flex items-center justify-center hover:bg-slate-100 dark:hover:bg-zink-600 hover:rounded-md transition-colors duration-200"
                        onClick={() => handleDeleteItem(index)}
                      >
                        <Trash2 className="text-red-500 dark:text-red-400 w-5" />
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
                        options={wasteOptions}
                        value={item.waste > 0 ? 
                          wasteOptions.find(option => option.value === item.waste) : 
                          null
                        }
                        onChange={(selectedOption) => {
                          handleMermaChange(index, selectedOption?.value || 0);
                        }}
                        isClearable={true}
                        components={{ 
                          Option: CustomOption,
                          SingleValue: CustomSingleValue
                        }}
                        className="w-1/2"
                        classNames={{
                          control: ({ isFocused }) =>
                            `border h-10 ${
                              isFocused
                                ? 'border-custom-500 dark:border-custom-800'
                                : 'border-slate-200 dark:border-zink-500'
                            } bg-white dark:bg-zink-700`,
                          placeholder: () => 'text-slate-400 dark:text-zink-200',
                          singleValue: () => 'dark:text-zink-100',
                          menu: () => 'dark:bg-zink-700 w-1/2',
                          option: ({ isFocused, isSelected }) =>
                            `cursor-pointer px-3 py-2 ${
                              isFocused
                                ? 'bg-custom-500 text-white'
                                : isSelected
                                ? 'bg-custom-600 text-white'
                                : 'text-slate-800 dark:text-zink-100'
                            }`,
                        }}
                      />
                    ) : (
                      <input
                        type="number"
                        placeholder="50kg"
                        className="border rounded-md px-2 py-1 w-1/2 h-10 border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200"
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