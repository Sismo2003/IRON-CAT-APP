import React, { useMemo, useState, useEffect} from 'react';
import TableContainer from 'Common/TableContainer';
import { ProductOrdersData } from "Common/data";
import { Link } from 'react-router-dom';
import {MoreHorizontal, Search, Eye, FileEdit, Trash2, Boxes, TicketCheck, Loader, PackageX} from 'lucide-react';
import { Dropdown } from 'Common/Components/Dropdown';
import filterDataBySearch from 'Common/filterDataBySearch';
import {createSelector} from "reselect";
import {useSelector} from "react-redux";
import moment from "moment/moment";

const ProductsOrders = () => {
    
    
    
    const selectDataList = createSelector(
      (state: any) => state.TICKETManagment,
      (state) => ({
          dataList: state.ticketlist,
          loading: state.loading
      })
    );
    
    
    const { dataList,  } = useSelector(selectDataList);

    
    const [data, setData] = useState<any>([]);
    const [activeTab, setActiveTab] = useState("1");
    
    useEffect(() => {
        if (activeTab === "1" && dataList && dataList.length > 0) {
            setData(dataList);
        }
    }, [dataList, activeTab]);
    
    // Search Data
    const filterSearchData = (e: any) => {
        const search = e.target.value;
        const keysToSearch = ['orderId', 'customerName', 'location', 'orderDate', 'payments', 'quantity', 'status'];
        filterDataBySearch(ProductOrdersData, search, keysToSearch, setData);
    };
  
    
    
    const toggleTab = (tab: any, type: any) => {
        if (activeTab !== tab) {
            setActiveTab(tab);
            let ordersArray = Object.values(dataList);
            let filteredOrders = ordersArray;
            if (type !== "all") {
                filteredOrders = ordersArray.filter((order: any) => order.ticket_status === type);
            }
            setData(filteredOrders);
        }
    };
    
    const Status = ({ item }: any) => {
        switch (item) {
            case "Por autorizar":
            case 'pending':
                return (<span className="delivery_status px-2.5 py-0.5 text-xs inline-block font-medium rounded border bg-yellow-100 border-yellow-200 text-yellow-500 dark:bg-yellow-500/20 dark:border-yellow-500/20">Por autorizar</span>);
            case "Cancelados":
            case 'deleted':
                return (<span className="delivery_status px-2.5 py-0.5 text-xs inline-block font-medium rounded border bg-red-100 border-red-200 text-red-500 dark:bg-red-500/20 dark:border-red-500/20">Cancelados</span>);
            case "Autorizados":
            case 'authorized':
                return (<span className="delivery_status px-2.5 py-0.5 text-xs inline-block font-medium rounded border bg-green-100 border-green-200 text-green-500 dark:bg-green-500/20 dark:border-green-500/20">Autorizados</span>);
            default:
                return (<span className="delivery_status px-2.5 py-0.5 text-xs inline-block font-medium rounded border bg-sky-100 border-sky-200 text-sky-500 dark:bg-sky-500/20 dark:border-sky-500/20">{item}</span>);
        }
    };
    
    const columns = useMemo(() => [
          {
              header: "Folio",
              accessorKey: "ticket_id",
              enableColumnFilter: false,
              enableSorting: false,
              cell: (cell: any) => (
                <>
                    <Link to="#!" className="transition-all duration-150 ease-linear order_id text-custom-500 hover:text-custom-600">{cell.getValue()}</Link>
                </>
              ),
          },
          {
              header: "Cliente",
              accessorFn: (row: any) => row.ticketCustomerName ? row.ticketCustomerName : row.client?.name,
              enableColumnFilter: false
          },
          {
              header: "Total",
              accessorKey: "ticket_total",
              enableColumnFilter: false,
              cell: (cell: any) => (
                <span>$ {cell.getValue()}</span>
              ),
          },
          {
              header: "Creado por",
              accessorKey: "responsible.name",
              enableColumnFilter: false,
              
          },
          {
              header: "Fecha",
              accessorKey: "ticket_date",
              enableColumnFilter: false,
              cell: (cell: any) => (
                <span>{moment(cell.getValue() ).format("DD/MM/YYYY HH:mm")}</span>
              ),
          },
          {
              header: "Estatus",
              accessorKey: "ticket_status",
              enableColumnFilter: false,
              enableSorting: true,
              cell: (cell: any) => (
                <Status item={cell.getValue()} />
              ),
          },
         
      ], []
    );
    
    const columns2 = useMemo(() => [
          {
              header: "#",
              accessorKey: "id",
              enableColumnFilter: false,
              enableSorting: true,
          },
          {
              header: "Numero de folio",
              accessorKey: "OrderId",
              enableColumnFilter: false,
              enableSorting: true,
              cell: (cell: any) => (
                <>
                    <Link to="/apps-ecommerce-order-overview">{cell.row.original.orderId}</Link>
                </>
              ),
          },
          {
              header: "Nombre del cliente",
              accessorKey: "customerName",
              enableColumnFilter: false,
              enableSorting: true,
          },
          {
              header: "Ubicacion",
              accessorKey: "location",
              enableColumnFilter: false,
              enableSorting: true,
          },
          {
              header: "Fecha",
              accessorKey: "orderDate",
              enableColumnFilter: false,
              enableSorting: true,
          },
          {
              header: "Forma de pago",
              accessorKey: "payments",
              enableColumnFilter: false,
              enableSorting: true,
          },
          {
              header: "Cantidad",
              accessorKey: "quantity",
              enableColumnFilter: false,
              enableSorting: true,
          },
          {
              header: "Precio",
              accessorKey: "price",
              enableColumnFilter: false,
              enableSorting: true,
          },
          {
              header: "Monto total",
              accessorKey: "totalAmount",
              enableColumnFilter: false,
              enableSorting: true,
          },
          {
              header: "Actualizacion",
              accessorKey: "status",
              enableColumnFilter: false,
              enableSorting: true,
              cell: (cell: any) => (
                <>
                    {cell.row.original.status === "Delivered" ? (
                      <span className="delivery_status px-2.5 py-0.5 text-xs inline-block font-medium rounded border bg-green-100 border-green-200 text-green-500 dark:bg-green-500/20 dark:border-green-500/20">
                            {cell.row.original.status}
                        </span>
                    ) : cell.row.original.status === "Shipping" ? (
                      <span className="delivery_status px-2.5 py-0.5 text-xs inline-block font-medium rounded border bg-purple-100 border-purple-200 text-purple-500 dark:bg-purple-500/20 dark:border-purple-500/20">
                            {cell.row.original.status}
                        </span>
                    ) : cell.row.original.status === "New" ? (
                      <span className="delivery_status px-2.5 py-0.5 text-xs inline-block font-medium rounded border bg-sky-100 border-sky-200 text-sky-500 dark:bg-sky-500/20 dark:border-sky-500/20">
                            {cell.row.original.status}
                        </span>
                    ) : (
                      <span className="delivery_status px-2.5 py-0.5 text-xs inline-block font-medium rounded border bg-yellow-100 border-yellow-200 text-yellow-500 dark:bg-yellow-500/20 dark:border-yellow-500/20">
                            {cell.row.original.status}
                        </span>
                    )
                    }
                
                </>
              ),
          },
          {
              header: "Ver",
              enableColumnFilter: false,
              enableSorting: true,
              cell: (cell: any) => (
                <>
                    <Dropdown className="relative">
                        <Dropdown.Trigger id="orderAction5" data-bs-toggle="dropdown" className="flex items-center justify-center size-[30px] dropdown-toggle p-0 text-slate-500 btn bg-slate-100 hover:text-white hover:bg-slate-600 focus:text-white focus:bg-slate-600 focus:ring focus:ring-slate-100 active:text-white active:bg-slate-600 active:ring active:ring-slate-100 dark:bg-slate-500/20 dark:text-slate-400 dark:hover:bg-slate-500 dark:hover:text-white dark:focus:bg-slate-500 dark:focus:text-white dark:active:bg-slate-500 dark:active:text-white dark:ring-slate-400/20">
                            <MoreHorizontal className="size-3"></MoreHorizontal></Dropdown.Trigger>
                        <Dropdown.Content placement={cell.row.index ? "top-end" : "right-end"}  className="absolute z-50 py-2 mt-1 ltr:text-left rtl:text-right list-none bg-white rounded-md shadow-md dropdown-menu min-w-[10rem] dark:bg-zink-600" aria-labelledby="orderAction5">
                            <li>
                                <Link className="block px-4 py-1.5 text-base transition-all duration-200 ease-linear text-slate-600 dropdown-item hover:bg-slate-100 hover:text-slate-500 focus:bg-slate-100 focus:text-slate-500 dark:text-zink-100 dark:hover:bg-zink-500 dark:hover:text-zink-200 dark:focus:bg-zink-500 dark:focus:text-zink-200" to="/apps-ecommerce-order-overview"><Eye className="inline-block size-3 ltr:mr-1 rtl:ml-1"/> <span className="align-middle">Ver</span></Link>
                            </li>
                            <li>
                                <Link className="block px-4 py-1.5 text-base transition-all duration-200 ease-linear text-slate-600 dropdown-item hover:bg-slate-100 hover:text-slate-500 focus:bg-slate-100 focus:text-slate-500 dark:text-zink-100 dark:hover:bg-zink-500 dark:hover:text-zink-200 dark:focus:bg-zink-500 dark:focus:text-zink-200" to="#!"><FileEdit className="inline-block size-3 ltr:mr-1 rtl:ml-1"/> <span className="align-middle">Editar</span></Link>
                            </li>
                            <li>
                                <Link className="block px-4 py-1.5 text-base transition-all duration-200 ease-linear text-slate-600 dropdown-item hover:bg-slate-100 hover:text-slate-500 focus:bg-slate-100 focus:text-slate-500 dark:text-zink-100 dark:hover:bg-zink-500 dark:hover:text-zink-200 dark:focus:bg-zink-500 dark:focus:text-zink-200" to="#!"><Trash2 className="inline-block size-3 ltr:mr-1 rtl:ml-1"/> <span className="align-middle">Eliminar</span></Link>
                            </li>
                        </Dropdown.Content>
                    </Dropdown>
                
                </>
              ),
          }
      ], []
    );
    
    return (
      <React.Fragment>
          <div className="col-span-12 card 2xl:col-span-12">
            <div className="card-body">
                  <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
                      <div className="lg:col-span-3">
                          <div className="relative">
                              <input type="text" className="ltr:pl-8 rtl:pr-8 search form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200"
                                     placeholder="Buscar ..." autoComplete="off" onChange={(e) => filterSearchData(e)} />
                              <Search className="inline-block size-4 absolute ltr:left-2.5 rtl:right-2.5 top-2.5 text-slate-500 dark:text-zink-200 fill-slate-100 dark:fill-zink-600" />
                          </div>
                      </div>
                  </div>
                  {/* TAB'S FOR THE TABLE!*/}
                  <ul className="flex flex-wrap w-full mt-5 text-sm font-medium text-center text-gray-500 nav-tabs">
                      <li className={`group ${activeTab === "1" && "active"}`}>
                          <Link to="#" data-tab-toggle data-target="allOrders" className="inline-block px-4 py-1.5 text-base transition-all duration-300 ease-linear rounded-md text-slate-500 dark:text-zink-200 border border-transparent group-[.active]:bg-custom-500 group-[.active]:text-white dark:group-[.active]:text-white hover:text-custom-500 dark:hover:text-custom-500 active:text-custom-500 dark:active:text-custom-500 -mb-[1px]" onClick={() => { toggleTab("1", "all"); }}>
                              <Boxes className="inline-block size-4 ltr:mr-1 rtl:ml-1" /> <span className="align-middle">Total tickets</span>
                          </Link>
                      </li>
                      <li className={`group ${activeTab === "2" && "active"}`}>
                          <Link to="#" data-tab-toggle data-target="deliveredOrder" className="inline-block px-4 py-1.5
                            text-base transition-all duration-300 ease-linear rounded-md text-slate-500 dark:text-zink-200 border
                            border-transparent group-[.active]:bg-custom-500 group-[.active]:text-white dark:group-[.active]:text-white
                            hover:text-custom-500 dark:hover:text-custom-500 active:text-custom-500 dark:active:text-custom-500
                            -mb-[1px]" onClick={() => { toggleTab("2", "Autorizados"); }}>
                              <TicketCheck className="inline-block size-4 ltr:mr-1 rtl:ml-1" />
                              <span className="align-middle">Autorizados </span>
                          </Link>
                      </li>
                      <li className={`group ${activeTab === "3" && "active"}`}>
                          <Link to="#" data-tab-toggle data-target="pendingOrder" className="inline-block px-4 py-1.5 text-base transition-all
                            duration-300 ease-linear rounded-md text-slate-500 dark:text-zink-200 border border-transparent
                            group-[.active]:bg-custom-500 group-[.active]:text-white dark:group-[.active]:text-white
                            hover:text-custom-500 dark:hover:text-custom-500 active:text-custom-500 dark:active:text-custom-500 -mb-[1px]"
                                onClick={() => { toggleTab("3", "Por autorizar"); }}>
                              <Loader className="inline-block size-4 ltr:mr-1 rtl:ml-1" /> <span className="align-middle">Por autorizar</span>
                          </Link>
                      </li>
                      <li className={`group ${activeTab === "4" && "active"}`}>
                          <Link to="#" data-tab-toggle data-target="cancelledOrders" className="inline-block px-4 py-1.5
                                text-base transition-all duration-300 ease-linear rounded-md text-slate-500 dark:text-zink-200
                                border border-transparent group-[.active]:bg-custom-500 group-[.active]:text-white
                                dark:group-[.active]:text-white hover:text-custom-500 dark:hover:text-custom-500
                                active:text-custom-500 dark:active:text-custom-500 -mb-[1px]"
                                onClick={() => { toggleTab("4", "Cancelados"); }}>
                              <PackageX className="inline-block size-4 ltr:mr-1 rtl:ml-1 " /> <span className="align-middle">Cancelados</span>
                          </Link>
                      </li>
                  </ul>
                  
                  {dataList && Object.keys(dataList).length > 0 ?
                    <TableContainer
                      isPagination={true}
                      columns={(columns || [])}
                      data={(data || [])}
                      customPageSize={10}
                      divclassName="mt-5 overflow-x-auto"
                      tableclassName="w-full whitespace-nowrap"
                      theadclassName="ltr:text-left rtl:text-right bg-slate-100 dark:bg-zink-600"
                      thclassName="px-3.5 py-2.5 font-semibold text-slate-500 border-b border-slate-200 dark:border-zink-500 dark:text-zink-200"
                      tdclassName="px-3.5 py-2.5 border-y border-slate-200 dark:border-zink-500"
                      PaginationClassName="flex flex-col items-center mt-5 md:flex-row"
                    />
                    :
                    (
                      <div className="noresult">
                          <div className="py-6 text-center">
                              <Search className="size-6 mx-auto text-sky-500 fill-sky-100 dark:sky-500/20" />
                              <h5 className="mt-2 mb-1">Sin registros!</h5>
                              <p className="mb-0 text-slate-500 dark:text-zink-200">No se encontro ningun registro. Si crees que es un error contacta a tu soporte.</p>
                          </div>
                      </div>
                    )
                  }
              </div>
          </div>
      </React.Fragment>
    );
};

export default ProductsOrders;
