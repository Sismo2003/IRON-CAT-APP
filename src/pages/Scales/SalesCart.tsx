import React, { useEffect, useState } from "react";
import BreadCrumb from "Common/BreadCrumb";
import Select from 'react-select';
import scale from "assets/images/scale.png";
import { useDispatch, useSelector } from 'react-redux';
import { createSelector } from 'reselect';
import { 
  getShopProductList as onGetProductList,
  addTicket as onAddTicket,
  getActiveWasteRecords as onGetWasteRecords,
  getDiscountCodes as onGetDiscountCodes,
  incrementUsesDiscountCode as onUpdateDiscountCode,
} from 'slices/thunk';
import { Trash2, ShoppingBasket } from 'lucide-react';
import { ToastContainer } from 'react-toastify';
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Modal from "Common/Components/Modal";

const appMode: any = process.env.REACT_APP_MODE;
let ws_ip: any;

if(appMode === 'production'){
  ws_ip = process.env.REACT_APP_WS_URL_PROD;
}else{
  ws_ip = process.env.REACT_APP_WS_URL_DEV;
}

const scales = [
  { id: 1, name: "Bascula 1", img: scale },
  { id: 3, name: "Bascula 2", img: scale },
  { id: 4, name: "Bascula 3", img: scale },
  { id: 2, name: "Bascula 4", img: scale },
];

interface DiscountCode {
  id: number;
  code_id: string;
  name: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  max_uses: number;
  uses: number;
  end_date: string;
  status: 'active' | 'inactive' | 'exhausted';
}

interface MaterialOption {
  value: number;
  label: string;
  wholesale_price: number;
  retail_price: number;
}

interface CartItem {
  id: number;
  product_id: number;
  material: string;
  originalWeight: number;
  weight: number;
  price: number;
  total: number;
  waste: number;
  type: 'wholesale' | 'retail';
  usePredefinedMerma: boolean;
}

interface WasteOption {
  value: number;
  label: string;
  wasteId: string;
  img?: string;
}

const CustomOption = ({ innerProps, label, data }: any) => (
  <div {...innerProps} className="flex items-center p-2 hover:bg-gray-100 dark:hover:bg-zink-600 cursor-pointer">
    {data.img && (
      <img src={data.img} alt={label} className="w-8 h-8 mr-2 rounded-full" />
    )}
    <span className="text-slate-700 dark:text-zink-100 whitespace-nowrap overflow-hidden text-ellipsis">
      {`${label} - (${data.value}kg)`}
    </span>
  </div>
);

const CustomSingleValue = ({ data }: any) => (
  <div className="flex items-center -mt-7 max-w-full gap-1">
    {data.img && (
      <img 
        src={data.img} 
        alt={data.label} 
        className="w-5 h-5 rounded-full flex-shrink-0"
      />
    )}
    <span className="text-slate-700 dark:text-zink-100 truncate text-sm">
      {data.value}kg
    </span>
  </div>
);

const SalesCart = () => {
  const dispatch = useDispatch<any>();

  const selectDataList = createSelector(
    (state: any) => state.MATERIALManagement,
    (state) => ({
      materialList: state.productList,
      loading: state.loading,
    })
  );

  const ticketManagement = createSelector(
    (state: any) => state.TICKETManagment,
    (state) => ({
      ticket_loading: state.loading,
    })
  );

  const selectWasteList = createSelector(
    (state: any) => state.WasteManagement,
    (state) => ({
      wasteList: state.wastelist,
      loading: state.loading,
    })
  );

  const selectDiscountCodeList = createSelector(
    (state: any) => state.DiscountCodesManagement,
    (state) => ({
        dataList: state.discountCodeList,
        loading: state.loading
    })
  );

  const { dataList } = useSelector(selectDiscountCodeList);
  const { materialList } = useSelector(selectDataList);
  const { ticket_loading } = useSelector(ticketManagement);
  const { wasteList } = useSelector(selectWasteList);

  const [materials, setMaterials] = useState<MaterialOption[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [weights, setWeights] = useState<{ [key: number]: number }>({});
  const [selectedMaterials, setSelectedMaterials] = useState<{ [key: number]: string }>({});
  const [selectedPriceType, setSelectedPriceType] = useState<'wholesale' | 'retail'>('wholesale');
  const [customerName, setCustomerName] = useState<string>("");
  const [vehiclePlate, setVehiclePlate] = useState<string>("");
  const [vehicleModel, setVehicleModel] = useState<string>("");
  const [wasteOptions, setWasteOptions] = useState<WasteOption[]>([]);
  const [authUser, setAuthUser] = useState(() => 
    JSON.parse(localStorage.getItem('authUser') || '{}')
  );
  const [largeModal, setLargeModal] = useState(false);
  const [discountCode, setDiscountCode] = useState<DiscountCode | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    dispatch(onGetProductList());
    dispatch(onGetWasteRecords());
    dispatch(onGetDiscountCodes());
    setAuthUser(JSON.parse(localStorage.getItem('authUser') || '{}'));
  }, [dispatch]);

  useEffect(() => {
    if (materialList && materialList.length > 0) {
      const formattedMaterials = materialList.map((product: any) => ({
        value: product.id,
        label: product.material,
        wholesale_price: Number(product.wholesale_price_sell),
        retail_price: Number(product.retail_price_sell),
      }));
      setMaterials(formattedMaterials);
    }
  }, [materialList]);

  useEffect(() => {
    if (wasteList && wasteList.length > 0) {
      const formattedWasteOptions = wasteList.map((waste: any) => ({
        value: parseFloat(waste.weight),
        label: waste.name,
        wasteId: waste.waste_id,
        img: waste.img,
      }));
      setWasteOptions(formattedWasteOptions);
    }
  }, [wasteList]);

  useEffect(() => {
    const ws = new WebSocket(ws_ip);

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

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

  const showToast = (message: string) => {
    if (!toast.isActive('unique-toast')) {
      toast.info(message, { 
        toastId: 'unique-toast',
        autoClose: 2000 
      });
    }
  };

  const handleAddToCart = (scaleId: number) => {
    const material = materials.find((m) => m.label === selectedMaterials[scaleId]);
    if (!material) return;

    const weight = weights[scaleId] || 0;
    const price = Number(selectedPriceType === 'wholesale' ? material.wholesale_price : material.retail_price);
    const total = weight * price;

    setCart([...cart, {
      id: scaleId,
      material: material.label,
      product_id: material.value,
      originalWeight: weight,
      weight: weight,
      price,
      total,
      waste: 0,
      type: selectedPriceType,
      usePredefinedMerma: false,
    }]);
  };

  const handleDeleteItem = (index: number) => {
    setCart((prevCart) => prevCart.filter((_, i) => i !== index));
  };

  const handleMermaChange = (index: number, value: number) => {
    const updatedCart = [...cart];
    const originalWeight = updatedCart[index].originalWeight;

    if (value > originalWeight) {
      showToast("La merma no puede ser mayor que el peso registrado.");
      updatedCart[index].waste = 0;
      updatedCart[index].weight = originalWeight;
      setCart(updatedCart);
      return;
    }

    if (value < 0) {
      updatedCart[index].waste = 0;
      updatedCart[index].weight = originalWeight;
      setCart(updatedCart);
      return;
    }

    updatedCart[index].waste = value;
    updatedCart[index].weight = originalWeight - value;
    updatedCart[index].total = updatedCart[index].weight * updatedCart[index].price;
    setCart(updatedCart);
  };

  const togglePredefinedMerma = (index: number, usePredefined: boolean) => {
    const updatedCart = [...cart];
    updatedCart[index].usePredefinedMerma = usePredefined;

    if (usePredefined) {
      updatedCart[index].waste = 0;
      updatedCart[index].weight = updatedCart[index].originalWeight;
    }
    
    updatedCart[index].total = updatedCart[index].weight * updatedCart[index].price;
    setCart(updatedCart);
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      showToast("No hay productos en el carrito");
      return;
    }
    if (!customerName.trim()) {
      showToast("Por favor ingrese el nombre del cliente");
      return;
    }
    setLargeModal(true);
  };

  const calculateTotalWithDiscount = () => {
    const subtotal = cart.reduce((sum, item) => sum + item.total, 0);
    let discount = 0;
    let finalTotal = subtotal;
  
    if (discountCode) {
      const now = new Date();
      const endDate = new Date(discountCode.end_date);
      const isExpired = endDate < now;
      const isExhausted = discountCode.uses >= discountCode.max_uses;
      const isInactive = discountCode.status === 'inactive';
  
      if (isExpired || isExhausted || isInactive) {
        showToast("El código de descuento no es válido o ha expirado");
        setDiscountCode(null);
        return { subtotal, discount: 0, total: subtotal };
      }
  
      if (discountCode.discount_type === 'percentage') {
        discount = subtotal * (discountCode.discount_value / 100);
        finalTotal = subtotal - discount;
      } else {
        discount = discountCode.discount_value;
        finalTotal = Math.max(0, subtotal - discount);
      }
    }
  
    return {
      subtotal,
      discount,
      total: finalTotal,
      isFixedDiscountExceedsTotal: discountCode?.discount_type === 'fixed' && discountCode.discount_value >= subtotal
    };
  };

  const confirmAndPrint = async () => {
    setIsSubmitting(true);
  
    const totals = calculateTotalWithDiscount();
    const payload = {
      total: totals.total,
      user_id: authUser.id,
      user_name: authUser.name + " " + authUser.last_name,
      type: "sale",
      customer_name: customerName,
      vehicle_plate: vehiclePlate,
      vehicle_model: vehicleModel,
      discount_code: discountCode?.code_id || null,
      discount_code_id: discountCode?.id || null,
      subtotal: totals.subtotal,
      discount_amount: totals.discount,
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
  
    try {
      console.log("Payload para imprimir:", payload);

      const result = await dispatch(onAddTicket(payload));
      
      if (discountCode) {
        dispatch(onUpdateDiscountCode({ id: discountCode.id }));
      }
  
      const payloadToPrintTicket = {
        ...payload,
        ticket_id: result.payload.ticketId
      };
  
      setCart([]);
      setCustomerName("");
      setVehiclePlate("");
      setVehicleModel("");
      setSelectedMaterials({});
      setSelectedPriceType('wholesale');
      setWeights({});
      setDiscountCode(null);
      setLargeModal(false);
  
      const response1 = await fetch('http://192.168.100.59/src/printer.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payloadToPrintTicket),
      });
      const response2 = await fetch('http://192.168.100.59/src/printer.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payloadToPrintTicket),
      });
  
    } catch (error) {
      console.error('Error:', error);
      showToast("Ocurrió un error al procesar la venta");
    } finally {
      setIsSubmitting(false);
    }
  };

  const totals = calculateTotalWithDiscount();

  return (
    <>
      <BreadCrumb title="Carrito de ventas" pageTitle="Ventas" />
      <ToastContainer 
        closeButton={false} 
        limit={1} 
        autoClose={2000}
        newestOnTop
      />

      {/* Large Modal para el resumen */}
      <Modal show={largeModal} onHide={() => setLargeModal(false)} id="summaryModal" modal-center="true"
        className="fixed flex flex-col transition-all duration-300 ease-in-out left-2/4 z-drawer -translate-x-2/4 -translate-y-2/4"
        dialogClassName="w-screen md:w-[40rem] bg-white shadow rounded-md dark:bg-zink-600 flex flex-col h-full">
        
        <Modal.Header className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-zink-500"
          closeButtonClass="transition-all duration-200 ease-linear text-slate-500 hover:text-red-500 dark:text-zink-200 dark:hover:text-red-500">
          <Modal.Title className="text-16">Resumen de Venta</Modal.Title>
        </Modal.Header>
        
        <Modal.Body className="max-h-[calc(theme('height.screen')_-_180px)] p-4 overflow-y-auto">
          <div className="space-y-4">
            {/* Lista de productos */}
            <div className="border rounded-lg divide-y dark:divide-zink-500 dark:border-zink-500">
              {cart.map((item, index) => (
                <div key={index} className="p-3 flex justify-between items-center">
                  <div>
                    <h6 className="font-medium">{item.material}</h6>
                    <p className="text-sm text-slate-500 dark:text-zink-200">
                      {item.weight}kg × ${Number(item.price || 0).toFixed(2)} ({item.type === 'wholesale' ? 'Mayoreo' : 'Menudeo'})
                    </p>
                    {item.waste > 0 && (
                      <p className="text-xs text-slate-400 dark:text-zink-300">
                        Merma: {item.waste}kg
                      </p>
                    )}
                  </div>
                  <span className="font-semibold">${Number(item.total || 0).toFixed(2)}</span>
                </div>
              ))}
            </div>

            {/* Select para código de descuento */}
            <div className="space-y-1">
              <label className="block text-sm font-medium">Código de Descuento (Opcional)</label>
              <Select
                options={dataList.map((code: DiscountCode) => ({
                  value: code,
                  label: `${code.code_id} - ${code.discount_value}${code.discount_type === 'percentage' ? '%' : '$'}`,
                  codeData: code
                }))}
                isClearable
                placeholder="Buscar descuento..."
                onChange={(selected) => {
                  if (selected) {
                    setDiscountCode(selected.codeData);
                  } else {
                    setDiscountCode(null);
                  }
                }}
                value={discountCode ? {
                  value: discountCode,
                  label: `${discountCode.code_id} - ${discountCode.discount_value}${discountCode.discount_type === 'percentage' ? '%' : '$'}`,
                  codeData: discountCode
                } : null}
                className="react-select"
                classNamePrefix="select"
                menuPlacement="auto"
                maxMenuHeight={150}
                menuShouldScrollIntoView={false}
                menuPosition="absolute"
                menuShouldBlockScroll={false}
                menuPortalTarget={document.body}
                styles={{
                  menuPortal: base => ({ ...base, zIndex: 9999 }),
                  menu: provided => ({ 
                    ...provided, 
                    position: 'relative',
                    marginTop: '4px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                  })
                }}
                classNames={{
                  control: ({ isFocused }) =>
                    `border h-10 ${
                      isFocused
                        ? 'focus:outline-none border-custom-500 dark:border-custom-800'
                        : 'border-slate-200 dark:border-zink-500'
                    } bg-white dark:bg-zink-700 rounded-md`,
                  placeholder: () => 'placeholder:text-slate-400 dark:placeholder:text-zink-200',
                  singleValue: () => 'dark:text-zink-100 text-sm truncate',
                  menu: () => 'bg-white dark:bg-zink-700 shadow-lg rounded-md border border-slate-200 dark:border-zink-500',
                  menuList: () => 'text-sm py-1 max-h-[150px] overflow-y-auto',
                  option: ({ isFocused, isSelected }) =>
                    `px-3 py-1.5 ${
                      isSelected
                        ? 'bg-custom-600 text-white'
                        : isFocused
                        ? 'bg-custom-100 dark:bg-custom-900'
                        : ''
                    }`,
                }}
                noOptionsMessage={({ inputValue }) => 
                  inputValue ? 'No se encontraron descuentos' : 'No hay descuentos disponibles'
                }
              />
            </div>

            {/* Totales */}
            <div className="space-y-2 pt-2 border-t dark:border-zink-500">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>${totals.subtotal.toFixed(2)}</span>
              </div>
              {discountCode && (
                <>
                  <div className="flex justify-between text-green-500">
                    <span>Descuento ({discountCode.discount_type === 'percentage' 
                      ? `${discountCode.discount_value}%` 
                      : `$${Number(discountCode.discount_value).toFixed(2)}`}):</span>
                    <span>-${Number(totals.discount).toFixed(2)}</span>
                  </div>
                  {totals.isFixedDiscountExceedsTotal && (
                    <div className="text-sm text-yellow-500">
                      El descuento fijo cubre el total completo
                    </div>
                  )}
                </>
              )}
              <div className="flex justify-between font-semibold text-lg">
                <span>Total:</span>
                <span>${Number(totals.total).toFixed(2)}</span>
              </div>
            </div>
          </div>
        </Modal.Body>
        
        <Modal.Footer className="flex items-center justify-between p-4 mt-auto border-t border-slate-200 dark:border-zink-500">
          <button
            onClick={() => setLargeModal(false)}
            className="btn bg-slate-100 dark:bg-zink-600 text-slate-500 dark:text-zink-200 border-slate-200 dark:border-zink-500 hover:bg-slate-200 hover:dark:bg-zink-500 hover:dark:border-zink-400"
          >
            Volver
          </button>
          <button
            onClick={confirmAndPrint}
            disabled={isSubmitting}
            className={`btn text-white border-red-500 ${
              isSubmitting
                ? 'bg-red-400 border-red-400 cursor-not-allowed'
                : 'bg-red-500 hover:bg-red-600 hover:border-red-600'
            }`}
          >
            {isSubmitting ? 'Procesando...' : 'Confirmar e Imprimir'}
          </button>
        </Modal.Footer>
      </Modal>

      {/* Contenido principal */}
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
                    options={materials}
                    isSearchable={true}
                    name="materialTypeSelect"
                    id="materialTypeSelect"
                    onChange={(selectedOption) =>
                      setSelectedMaterials({ ...selectedMaterials, [scale.id]: selectedOption?.label || "" })
                    }
                    placeholder="Seleccionar"
                    className="w-full"
                    classNames={{
                      control: ({ isFocused }) =>
                        `${isFocused
                          ? 'focus:outline-none border-custom-500 dark:border-custom-800'
                          : 'border-slate-200 dark:border-zink-500'
                        } bg-white dark:bg-zink-700 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 disabled:text-slate-500 dark:disabled:text-zink-200 rounded-md h-10`,
                      placeholder: () => 'placeholder:text-slate-400 dark:placeholder:text-zink-200',
                      singleValue: () => 'dark:text-zink-100',
                      menu: () => 'bg-white dark:bg-zink-700 z-50',
                      option: ({ isFocused, isSelected }) =>
                        `${isSelected
                          ? 'bg-custom-600 text-white'
                          : isFocused
                          ? 'bg-custom-500 text-white'
                          : 'dark:text-zink-100'
                        } px-3 py-2 cursor-pointer`,
                    }}
                  />
                  <Select
                    options={[
                      { value: 'wholesale', label: 'Precio de Mayoreo' },
                      { value: 'retail', label: 'Precio de Menudeo' },
                    ]}
                    value={{
                      value: selectedPriceType,
                      label: selectedPriceType === 'retail' ? 'Precio de Menudeo' : 'Precio de Mayoreo',
                    }}
                    onChange={(selectedOption) => {
                      if (cart.length === 0) {
                        setSelectedPriceType(selectedOption?.value as 'wholesale' | 'retail');
                      }
                    }}
                    placeholder="Seleccionar tipo de precio"
                    className="w-full mt-2"
                    isDisabled={cart.length > 0}
                    classNames={{
                      control: ({ isFocused }) =>
                        `${isFocused
                          ? 'focus:outline-none border-custom-500 dark:border-custom-800'
                          : 'border-slate-200 dark:border-zink-500'
                        } bg-white dark:bg-zink-700 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 disabled:text-slate-500 dark:disabled:text-zink-200 rounded-md h-10`,
                      placeholder: () => 'placeholder:text-slate-400 dark:placeholder:text-zink-200',
                      singleValue: () => 'dark:text-zink-100',
                      menu: () => 'bg-white dark:bg-zink-700 z-50',
                      option: ({ isFocused, isSelected }) =>
                        `${isSelected
                          ? 'bg-custom-600 text-white'
                          : isFocused
                          ? 'bg-custom-500 text-white'
                          : 'dark:text-zink-100'
                        } px-3 py-2 cursor-pointer`,
                    }}
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
            <h6 className="mb-4 text-15">Carrito de ventas<span className="inline-flex items-center justify-center size-5 ml-1 text-[11px] font-medium border rounded-full text-white bg-custom-500 border-custom-500">{cart.length ? cart.length : 0}</span></h6>
            
            {/* Input para nombre del cliente */}
            <div className="mb-4 space-y-1">
              <label className="block text-sm font-medium text-slate-700 dark:text-zink-100">Nombre del Cliente <span className="text-red-500">*</span></label>
              <input
                type="text"
                className={`form-input w-full ${!customerName.trim() ? 'border-red-500' : 'border-slate-200 dark:border-zink-500'} focus:border-custom-500 dark:focus:border-custom-800 focus:outline-none dark:bg-zink-700 dark:text-zink-100 placeholder:text-slate-400 dark:placeholder:text-zink-200`}
                placeholder="Ingrese nombre del cliente"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                required
              />
              {!customerName.trim() && (
                <p className="text-sm text-red-500">Este campo es requerido</p>
              )}
            </div>

            {/* Input para placas de vehículo */}
            <div className="mb-4 space-y-1">
              <label className="block text-sm font-medium text-slate-700 dark:text-zink-100">Placas del Vehículo (Opcional)</label>
              <input
                type="text"
                className="form-input w-full border-slate-200 dark:border-zink-500 focus:border-custom-500 dark:focus:border-custom-800 focus:outline-none dark:bg-zink-700 dark:text-zink-100 placeholder:text-slate-400 dark:placeholder:text-zink-200"
                placeholder="Ingrese placas del vehículo"
                value={vehiclePlate}
                onChange={(e) => setVehiclePlate(e.target.value)}
              />
            </div>

            {/* Input para modelo de vehículo */}
            <div className="mb-4 space-y-1">
              <label className="block text-sm font-medium text-slate-700 dark:text-zink-100">Modelo del Vehículo (Opcional)</label>
              <input
                type="text"
                className="form-input w-full border-slate-200 dark:border-zink-500 focus:border-custom-500 dark:focus:border-custom-800 focus:outline-none dark:bg-zink-700 dark:text-zink-100 placeholder:text-slate-400 dark:placeholder:text-zink-200"
                placeholder="Ingrese modelo del vehículo"
                value={vehicleModel}
                onChange={(e) => setVehicleModel(e.target.value)}
              />
            </div>

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
                        className="w-1/2 min-w-[120px]"
                        classNames={{
                          control: ({ isFocused }) =>
                            `border h-10 ${
                              isFocused
                                ? 'border-custom-500 dark:border-custom-800'
                                : 'border-slate-200 dark:border-zink-500'
                            } bg-white dark:bg-zink-700`,
                          placeholder: () => 'text-slate-400 dark:text-zink-200',
                          singleValue: () => 'dark:text-zink-100 text-sm truncate',
                          input: () => 'text-sm',
                          valueContainer: () => 'px-2 py-0.5 gap-1',
                          menu: () => 'dark:bg-zink-700 min-w-[180px] text-sm',
                          option: ({ isFocused, isSelected }) =>
                            `cursor-pointer px-2 py-1.5 text-sm ${
                              isFocused
                                ? 'bg-custom-500 text-white'
                                : isSelected
                                ? 'bg-custom-600 text-white'
                                : 'text-slate-800 dark:text-zink-100'
                            } truncate`,
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

export default SalesCart;