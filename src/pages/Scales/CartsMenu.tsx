import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import BreadCrumb from "Common/BreadCrumb";
import { ShoppingBasket, Clock, CheckCircle, XCircle, Search, User, Package, CreditCard, Truck, Trash2 } from "lucide-react";
import { useDispatch, useSelector } from 'react-redux';
import { createSelector } from 'reselect';
import { 
  getPendingCarts as onGetPendingCarts,
  createCart as onCreateCart,
  getCustomer as onGetCustomer,
  deleteCart as onDeleteCart,
} from 'slices/thunk';

// Modals
import Modal from "Common/Components/Modal";
import DeleteModal from 'Common/DeleteModal';

import Select from 'react-select';

// Import styles for toastify
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { toast } from "react-toastify";

interface Cart {
  id: number;
  client_id?: number;
  sale_type: 'shop' | 'sale';
  sale_mode: 'wholesale' | 'retail';
  customer_name: string;
  vehicle_plate: string;
  vehicle_model: string;
  total: number | null;
  cart_products: any[];
}

interface ClientOption {
  value: number;
  label: string;
}

interface CartTypeOption {
  value: 'shop' | 'sale';
  label: string;
}

interface SaleModeOption {
  value: 'wholesale' | 'retail';
  label: string;
}

const CartMenu = () => {
  const dispatch = useDispatch<any>();
  const navigate = useNavigate();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [cartType, setCartType] = useState<'shop' | 'sale' | 'special' | null>(null);
  const [customerName, setCustomerName] = useState("");
  const [selectedClient, setSelectedClient] = useState<ClientOption | null>(null);
  const [clientSearch, setClientSearch] = useState("");
  const [vehiclePlate, setVehiclePlate] = useState("");
  const [vehicleModel, setVehicleModel] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [selectedCartType, setSelectedCartType] = useState<CartTypeOption | null>(null);
  const [selectedSaleMode, setSelectedSaleMode] = useState<SaleModeOption | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteModal, setDeleteModal] = useState<boolean>(false);
  const [cartToDelete, setCartToDelete] = useState<Cart | null>(null);

  const cartTypeOptions: CartTypeOption[] = [
    { value: 'shop', label: 'Compra' },
    { value: 'sale', label: 'Venta' }
  ];

  const saleModeOptions: SaleModeOption[] = [
    { value: 'wholesale', label: 'Mayoreo' },
    { value: 'retail', label: 'Menudeo' }
  ];

  const selectPendingCarts = createSelector(
    (state: any) => state.CartManagement,
    (state) => ({
      pendingCarts: state.pendingCarts,
      loading: state.loading,
    })
  );

  const clientDataList = createSelector(
    (state: any) => state.CUSTOMERManagement,
    (state) => ({
      clientList: state.customerlist,
    })
  );

  const { pendingCarts, loading } = useSelector(selectPendingCarts);
  const { clientList } = useSelector(clientDataList);

  useEffect(() => {
    dispatch(onGetPendingCarts());
    dispatch(onGetCustomer());
  }, [dispatch]);

  // Funciones para el modal de eliminación
  const deleteToggle = () => setDeleteModal(!deleteModal);

  const onClickDelete = (cart: Cart) => {
    setDeleteModal(true);
    setCartToDelete(cart);
  };

  const handleDelete = () => {
    if (cartToDelete) {
      console.log("Deleting cart with ID:", cartToDelete.id);
      dispatch(onDeleteCart({ cartId: cartToDelete.id }));
      setDeleteModal(false);
      setCartToDelete(null);
      toast.success("Carrito eliminado correctamente");
    }
  };

  const filteredClients = clientList
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

  // Filtrar carritos basado en el término de búsqueda
  const filteredCarts = pendingCarts?.filter((cart: Cart) => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      cart.customer_name.toLowerCase().includes(searchLower) ||
      cart.sale_type.toLowerCase().includes(searchLower) ||
      cart.sale_mode.toLowerCase().includes(searchLower) ||
      cart.vehicle_plate.toLowerCase().includes(searchLower) ||
      cart.vehicle_model.toLowerCase().includes(searchLower)
    );
  }) || [];

  const getCartTypeLabel = (type: string) => {
    switch(type) {
      case 'shop': return 'Compra';
      case 'sale': return 'Venta';
      default: return type;
    }
  };

  const getSaleModeLabel = (mode: string) => {
    switch(mode) {
      case 'wholesale': return 'Mayoreo';
      case 'retail': return 'Menudeo';
      default: return mode;
    }
  };

  const getSaleModeBadge = (mode: string) => {
    switch(mode) {
      case 'wholesale':
        return <span className="px-2.5 py-0.5 text-xs font-medium rounded border bg-blue-100 border-blue-300 text-blue-600 dark:bg-blue-500/20 dark:border-blue-500/50 dark:text-blue-200 inline-flex items-center">
          <Package className="size-3 mr-1" /> Mayoreo
        </span>;
      case 'retail':
        return <span className="px-2.5 py-0.5 text-xs font-medium rounded border bg-indigo-100 border-indigo-300 text-indigo-600 dark:bg-indigo-500/20 dark:border-indigo-500/50 dark:text-indigo-200 inline-flex items-center">
          <Package className="size-3 mr-1" /> Menudeo
        </span>;
      default:
        return <span className="px-2.5 py-0.5 text-xs font-medium rounded border bg-gray-100 border-gray-300 text-gray-600 dark:bg-gray-500/20 dark:border-gray-500/50 dark:text-gray-200">{mode}</span>;
    }
  };

  const handleCreateCartClick = (type: 'shop' | 'sale' | 'special') => {
    setCartType(type);
    setShowCreateModal(true);
    setCustomerName("");
    setSelectedClient(null);
    setVehiclePlate("");
    setVehicleModel("");
    setSelectedCartType(null);
    setSelectedSaleMode(null);
  };

  const handleCreateCart = async () => {
    if (!cartType) return;

    if (cartType === 'special') {
      if (!selectedClient) {
        toast.error("Debe seleccionar un cliente especial");
        return;
      }
      if (!selectedCartType) {
        toast.error("Debe seleccionar el tipo de carrito");
        return;
      }
      if (!selectedSaleMode) {
        toast.error("Debe seleccionar el modo de venta");
        return;
      }
    } else {
      if (!customerName.trim()) {
        toast.error("Debe ingresar el nombre del cliente");
        return;
      }
      if (!selectedSaleMode) {
        toast.error("Debe seleccionar el modo de venta");
        return;
      }
    }

    setIsCreating(true);

    try {
      const saleType = cartType === 'special' 
        ? selectedCartType?.value 
        : cartType;
      
      if (!saleType) {
        throw new Error("Tipo de carrito no válido");
      }
      
      const payload = {
        sale_type: saleType,
        sale_mode: selectedSaleMode?.value || 'retail',
        customer_name: cartType === 'special' 
          ? (selectedClient?.label || '') 
          : (customerName || ''),
        client_id: cartType === 'special' ? (selectedClient?.value || null) : null,
        vehicle_plate: vehiclePlate,
        vehicle_model: vehicleModel
      };

      const result = await dispatch(onCreateCart(payload));

			console.log("Result: ", result);
      
      if (result.payload) {
				toast.success("Carrito creado correctamente");
				setShowCreateModal(false);
				
				// Determinar la ruta basada en el cartType
				let routePath = '';
				if (cartType === 'special') {
					routePath = `/apps-scales-clientcart/${result.payload}`;
				} else if (cartType === 'shop') {
					routePath = `/apps-scales-shopcart/${result.payload}`;
				} else if (cartType === 'sale') {
					routePath = `/apps-scales-salecart/${result.payload}`;
				}
				
				navigate(routePath);
			} else {
				toast.error("Error al crear el carrito");
			}
    } catch (error) {
      toast.error("Error al crear el carrito");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <>
      <BreadCrumb title="Menú de Carritos" pageTitle="Carritos" />
      <ToastContainer
        closeButton={false}
        limit={1}
        autoClose={2000}
        newestOnTop
      />

      {/* Modal de confirmación de eliminación */}
      <DeleteModal 
        show={deleteModal} 
        onHide={deleteToggle} 
        onDelete={handleDelete} 
      />

      <Modal 
        show={showCreateModal} 
        onHide={() => setShowCreateModal(false)} 
        id="createCartModal"
        modal-center="true"
        className="fixed flex flex-col transition-all duration-300 ease-in-out left-2/4 z-drawer -translate-x-2/4 -translate-y-2/4"
        dialogClassName="w-screen md:w-[30rem] bg-white shadow rounded-md dark:bg-zink-600 flex flex-col h-full max-h-[90vh]"
      >
        <Modal.Header 
          className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-zink-500 flex-shrink-0"
          closeButtonClass="transition-all duration-200 ease-linear text-slate-500 hover:text-red-500 dark:text-zink-200 dark:hover:text-red-500"
        >
          <Modal.Title className="text-16">
            Nuevo Carrito {cartType === 'special' ? 'de Cliente Especial' : `de ${getCartTypeLabel(cartType || '')}`}
          </Modal.Title>
        </Modal.Header>
        
        <Modal.Body className="flex-1 p-4 overflow-y-auto min-h-0">
          <div className="space-y-4">
            {cartType === 'special' ? (
              <>
                <div className="space-y-1">
                  <label className="block text-sm font-medium">Cliente Especial <span className="text-red-500">*</span></label>
                  <Select
                    options={filteredClients}
                    isSearchable={true}
                    placeholder="Seleccionar cliente"
                    value={selectedClient}
                    onChange={(selected) => setSelectedClient(selected)}
                    onInputChange={setClientSearch}
                    filterOption={null}
                    menuPosition="fixed"
                    menuPlacement="auto"
                    menuShouldBlockScroll={true}
                    menuPortalTarget={document.body}
                    maxMenuHeight={200}
                    styles={{
                      menuPortal: (base) => ({
                        ...base,
                        zIndex: 9999,
                      }),
                      menu: (base) => ({
                        ...base,
                        zIndex: 9999,
                      }),
                    }}
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
                          isFocused ? 'bg-custom-500 text-white' : 
                          isSelected ? 'bg-custom-600 text-white' : 'text-slate-800 dark:text-zink-100'
                        }`,
                    }}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-sm font-medium">Tipo de Carrito <span className="text-red-500">*</span></label>
                    <Select
                      options={cartTypeOptions}
                      placeholder="Seleccionar tipo"
                      value={selectedCartType}
                      onChange={(selected) => setSelectedCartType(selected)}
                      menuPosition="fixed"
                      menuPlacement="auto"
                      menuShouldBlockScroll={true}
                      menuPortalTarget={document.body}
                      maxMenuHeight={200}
                      styles={{
                        menuPortal: (base) => ({
                          ...base,
                          zIndex: 9999,
                        }),
                        menu: (base) => ({
                          ...base,
                          zIndex: 9999,
                        }),
                      }}
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
                            isFocused ? 'bg-custom-500 text-white' : 
                            isSelected ? 'bg-custom-600 text-white' : 'text-slate-800 dark:text-zink-100'
                          }`,
                      }}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-sm font-medium">Modo de Venta <span className="text-red-500">*</span></label>
                    <Select
                      options={saleModeOptions}
                      placeholder="Seleccionar modo"
                      value={selectedSaleMode}
                      onChange={(selected) => setSelectedSaleMode(selected)}
                      menuPosition="fixed"
                      menuPlacement="auto"
                      menuShouldBlockScroll={true}
                      menuPortalTarget={document.body}
                      maxMenuHeight={200}
                      styles={{
                        menuPortal: (base) => ({
                          ...base,
                          zIndex: 9999,
                        }),
                        menu: (base) => ({
                          ...base,
                          zIndex: 9999,
                        }),
                      }}
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
                            isFocused ? 'bg-custom-500 text-white' : 
                            isSelected ? 'bg-custom-600 text-white' : 'text-slate-800 dark:text-zink-100'
                          }`,
                      }}
                    />
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="space-y-1">
                  <label className="block text-sm font-medium">Nombre del Cliente <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    className="form-input w-full border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200"
                    placeholder="Ingrese nombre del cliente"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-sm font-medium">Modo de Venta <span className="text-red-500">*</span></label>
                  <Select
                    options={saleModeOptions}
                    placeholder="Seleccionar modo"
                    value={selectedSaleMode}
                    onChange={(selected) => setSelectedSaleMode(selected)}
                    menuPosition="fixed"
                    menuPlacement="auto"
                    menuShouldBlockScroll={true}
                    menuPortalTarget={document.body}
                    maxMenuHeight={200}
                    styles={{
                      menuPortal: (base) => ({
                        ...base,
                        zIndex: 9999,
                      }),
                      menu: (base) => ({
                        ...base,
                        zIndex: 9999,
                      }),
                    }}
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
                          isFocused ? 'bg-custom-500 text-white' : 
                          isSelected ? 'bg-custom-600 text-white' : 'text-slate-800 dark:text-zink-100'
                        }`,
                    }}
                  />
                </div>
              </>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-sm font-medium">Placa del Vehículo (Opcional)</label>
                <input
                  type="text"
                  className="form-input w-full border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200"
                  placeholder="Ej: ABC123"
                  value={vehiclePlate}
                  onChange={(e) => setVehiclePlate(e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <label className="block text-sm font-medium">Modelo del Vehículo (Opcional)</label>
                <input
                  type="text"
                  className="form-input w-full border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200"
                  placeholder="Ej: Toyota Corolla"
                  value={vehicleModel}
                  onChange={(e) => setVehicleModel(e.target.value)}
                />
              </div>
            </div>
          </div>
        </Modal.Body>
        
        <Modal.Footer className="flex items-center justify-between p-4 border-t border-slate-200 dark:border-zink-500 flex-shrink-0">
          <button
            onClick={() => setShowCreateModal(false)}
            className="btn bg-slate-100 dark:bg-zink-600 text-slate-500 dark:text-zink-200 border-slate-200 dark:border-zink-500 hover:bg-slate-200 hover:dark:bg-zink-500 hover:dark:border-zink-400"
          >
            Cancelar
          </button>
          <button
            onClick={handleCreateCart}
            disabled={isCreating}
            className={`btn text-white border-custom-500 ${
              isCreating
                ? 'bg-custom-400 border-custom-400 cursor-not-allowed'
                : 'bg-custom-500 hover:bg-custom-600 hover:border-custom-600'
            }`}
          >
            {isCreating ? 'Creando...' : 'Crear Carrito'}
          </button>
        </Modal.Footer>
      </Modal>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="card xl:col-span-1">
          <div className="card-body">
            <h6 className="mb-4 text-16">Crear Nuevo Carrito</h6>
            
            <div className="grid grid-cols-1 gap-4">
              <button
                onClick={() => handleCreateCartClick('shop')}
                className="group flex flex-col items-center justify-center p-6 text-center bg-white dark:bg-zink-700 rounded-lg border border-slate-200 dark:border-zink-500 hover:border-custom-500 dark:hover:border-custom-500 transition-all duration-300 ease-in-out hover:shadow-lg"
              >
                <div className="size-16 flex items-center justify-center bg-custom-50 dark:bg-custom-500/20 text-custom-500 dark:text-custom-200 rounded-full mb-4 group-hover:bg-custom-100 dark:group-hover:bg-custom-500/30">
                  <ShoppingBasket className="size-7" />
                </div>
                <h5 className="mb-1 text-15 text-slate-700 dark:text-zink-100 group-hover:text-custom-500 dark:group-hover:text-custom-500">Carrito de Compra</h5>
                <p className="text-slate-500 dark:text-zink-200">Para registrar compras de materiales</p>
              </button>

              <button
                onClick={() => handleCreateCartClick('sale')}
                className="group flex flex-col items-center justify-center p-6 text-center bg-white dark:bg-zink-700 rounded-lg border border-slate-200 dark:border-zink-500 hover:border-green-500 dark:hover:border-green-500 transition-all duration-300 ease-in-out hover:shadow-lg"
              >
                <div className="size-16 flex items-center justify-center bg-green-50 dark:bg-green-500/20 text-green-500 dark:text-green-200 rounded-full mb-4 group-hover:bg-green-100 dark:group-hover:bg-green-500/30">
                  <ShoppingBasket className="size-7" />
                </div>
                <h5 className="mb-1 text-15 text-slate-700 dark:text-zink-100 group-hover:text-green-500 dark:group-hover:text-green-500">Carrito de Venta</h5>
                <p className="text-slate-500 dark:text-zink-200">Para registrar ventas de productos</p>
              </button>

              <button
                onClick={() => handleCreateCartClick('special')}
                className="group flex flex-col items-center justify-center p-6 text-center bg-white dark:bg-zink-700 rounded-lg border border-slate-200 dark:border-zink-500 hover:border-purple-500 dark:hover:border-purple-500 transition-all duration-300 ease-in-out hover:shadow-lg"
              >
                <div className="size-16 flex items-center justify-center bg-purple-50 dark:bg-purple-500/20 text-purple-500 dark:text-purple-200 rounded-full mb-4 group-hover:bg-purple-100 dark:group-hover:bg-purple-500/30">
                  <ShoppingBasket className="size-7" />
                </div>
                <h5 className="mb-1 text-15 text-slate-700 dark:text-zink-100 group-hover:text-purple-500 dark:group-hover:text-purple-500">Carrito Especial</h5>
                <p className="text-slate-500 dark:text-zink-200">Para clientes con condiciones especiales</p>
              </button>
            </div>
          </div>
        </div>

        <div className="card xl:col-span-2">
          <div className="card-body">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
              <div>
                <h6 className="text-16 mb-1">Carritos Pendientes</h6>
                <p className="text-slate-500 dark:text-zink-200 text-sm">
                  {filteredCarts.length} carrito{filteredCarts.length !== 1 ? 's' : ''} encontrado{filteredCarts.length !== 1 ? 's' : ''}
                </p>
              </div>
              <div className="relative w-full sm:w-auto">
                <input 
                  type="text" 
                  className="ltr:pr-8 rtl:pl-8 search form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200 w-full sm:w-64" 
                  placeholder="Buscar carritos..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search className="inline-block size-4 absolute ltr:right-2.5 rtl:left-2.5 top-2.5 text-slate-500 dark:text-zink-200 fill-slate-100 dark:fill-zink-600" />
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center items-center h-32">
                <div className="animate-spin rounded-full size-10 border-t-2 border-b-2 border-custom-500"></div>
              </div>
            ) : filteredCarts.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-100 dark:bg-zink-600">
                    <tr>
                      <th className="px-3.5 py-2.5 font-semibold border-b border-slate-200 dark:border-zink-500 text-slate-700 dark:text-zink-100 text-left">ID</th>
                      <th className="px-3.5 py-2.5 font-semibold border-b border-slate-200 dark:border-zink-500 text-slate-700 dark:text-zink-100 text-left">Tipo</th>
                      <th className="px-3.5 py-2.5 font-semibold border-b border-slate-200 dark:border-zink-500 text-slate-700 dark:text-zink-100 text-left">Cliente</th>
                      <th className="px-3.5 py-2.5 font-semibold border-b border-slate-200 dark:border-zink-500 text-slate-700 dark:text-zink-100 text-left">Modo</th>
                      <th className="px-3.5 py-2.5 font-semibold border-b border-slate-200 dark:border-zink-500 text-slate-700 dark:text-zink-100 text-left">Vehículo</th>
                      <th className="px-3.5 py-2.5 font-semibold border-b border-slate-200 dark:border-zink-500 text-slate-700 dark:text-zink-100 text-left">Productos</th>
                      <th className="px-3.5 py-2.5 font-semibold border-b border-slate-200 dark:border-zink-500 text-slate-700 dark:text-zink-100 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCarts.map((cart: Cart) => (
                      <tr key={cart.id} className="hover:bg-slate-50 dark:hover:bg-zink-600 transition-colors duration-200">
                        <td className="px-3.5 py-2.5 border-b border-slate-200 dark:border-zink-500">
                          <span className="text-sm font-medium text-slate-900 dark:text-zink-100">#{cart.id}</span>
                        </td>
                        <td className="px-3.5 py-2.5 border-b border-slate-200 dark:border-zink-500">
                          <span className={`px-2.5 py-0.5 text-xs inline-block rounded border font-medium ${
                            cart.sale_type === 'shop'
                              ? 'bg-custom-100 border-custom-200 text-custom-600 dark:bg-custom-500/20 dark:border-custom-500/30 dark:text-custom-200'
                              : 'bg-green-100 border-green-200 text-green-600 dark:bg-green-500/20 dark:border-green-500/30 dark:text-green-200'
                          }`}>
                            {getCartTypeLabel(cart.sale_type)}
                          </span>
                        </td>
                        <td className="px-3.5 py-2.5 border-b border-slate-200 dark:border-zink-500">
                          <div className="flex items-start space-x-2">
                            <div className="flex items-center justify-center size-8 bg-slate-100 dark:bg-zink-600 rounded-full flex-shrink-0">
                              <User className="size-4 text-slate-500 dark:text-zink-300" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-medium text-slate-900 dark:text-zink-100 truncate">
                                {cart.customer_name}
                              </p>
                              {cart.client_id && (
                                <p className="text-xs text-slate-500 dark:text-zink-400">
                                  Cliente ID: {cart.client_id}
                                </p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-3.5 py-2.5 border-b border-slate-200 dark:border-zink-500">
                          {getSaleModeBadge(cart.sale_mode)}
                        </td>
                        <td className="px-3.5 py-2.5 border-b border-slate-200 dark:border-zink-500">
                          {cart.vehicle_plate || cart.vehicle_model ? (
                            <div className="flex items-start space-x-2">
                              <div className="flex items-center justify-center size-8 bg-slate-100 dark:bg-zink-600 rounded-full flex-shrink-0">
                                <Truck className="size-4 text-slate-500 dark:text-zink-300" />
                              </div>
                              <div className="min-w-0 flex-1">
                                {cart.vehicle_plate && (
                                  <p className="text-sm font-medium text-slate-900 dark:text-zink-100">
                                    {cart.vehicle_plate}
                                  </p>
                                )}
                                {cart.vehicle_model && (
                                  <p className="text-xs text-slate-500 dark:text-zink-400 truncate">
                                    {cart.vehicle_model}
                                  </p>
                                )}
                              </div>
                            </div>
                          ) : (
                            <span className="text-sm text-slate-400 dark:text-zink-500">No especificado</span>
                          )}
                        </td>
                        <td className="px-3.5 py-2.5 border-b border-slate-200 dark:border-zink-500">
                          <div className="flex items-center space-x-2">
                            <span className="inline-flex items-center justify-center size-6 text-xs font-medium rounded-full bg-slate-200 text-slate-600 dark:bg-zink-500 dark:text-zink-200">
                              {cart.cart_products?.length || 0}
                            </span>
                            <span className="text-sm text-slate-500 dark:text-zink-400">
                              {cart.cart_products?.length === 1 ? 'producto' : 'productos'}
                            </span>
                          </div>
                        </td>
                        <td className="px-3.5 py-2.5 border-b border-slate-200 dark:border-zink-500 text-right">
                          <div className="flex gap-2 justify-end">
                            <Link 
                              to={cart.client_id ? `/apps-scales-clientcart/${cart.id}` : cart.sale_type == 'shop' ? `/apps-scales-shopcart/${cart.id}` : `/apps-scales-salecart/${cart.id}`} 
                              className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-custom-500 hover:text-custom-600 dark:text-custom-400 dark:hover:text-custom-300 bg-custom-50 hover:bg-custom-100 dark:bg-custom-500/10 dark:hover:bg-custom-500/20 rounded-md border border-custom-200 dark:border-custom-500/30 transition-all duration-200 ease-linear"
                            >
                              <ShoppingBasket className="size-3 mr-1" />
                              Continuar
                            </Link>
                            <button
                              onClick={() => onClickDelete(cart)}
                              className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 bg-red-50 hover:bg-red-100 dark:bg-red-500/10 dark:hover:bg-red-500/20 rounded-md border border-red-200 dark:border-red-500/30 transition-all duration-200 ease-linear"
                            >
                              <Trash2 className="size-3 mr-1" />
                              Eliminar
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-10 text-center">
                <div className="size-16 flex items-center justify-center bg-slate-100 dark:bg-zink-600 rounded-full mb-4">
                  <ShoppingBasket className="size-8 text-slate-400 dark:text-zink-300" />
                </div>
                <h5 className="mt-2 mb-2 text-16 font-semibold text-slate-700 dark:text-zink-100">
                  {searchTerm ? 'No se encontraron carritos' : 'No hay carritos pendientes'}
                </h5>
                <p className="text-slate-500 dark:text-zink-200 max-w-sm">
                  {searchTerm 
                    ? 'Intenta con términos de búsqueda diferentes o crea un nuevo carrito'
                    : 'Todos los carritos han sido completados o cancelados. Crea un nuevo carrito para comenzar.'
                  }
                </p>
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="mt-4 px-4 py-2 text-sm text-custom-500 hover:text-custom-600 dark:text-custom-400 dark:hover:text-custom-300 bg-custom-50 hover:bg-custom-100 dark:bg-custom-500/10 dark:hover:bg-custom-500/20 rounded-md border border-custom-200 dark:border-custom-500/30 transition-all duration-200"
                  >
                    Limpiar búsqueda
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default CartMenu;