import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
    Eye, Boxes, TicketX, Loader, Search, 
    TicketCheck, PackageX, MoreHorizontal, 
    Trash2, FileEdit, Ticket, BarChart2,
    Calendar, CreditCard, Tag, CheckCircle, XCircle, Clock
} from 'lucide-react';
import CountUp from 'react-countup';
import moment from "moment";
import BreadCrumb from "Common/BreadCrumb";
import TableContainer from "Common/TableContainer";
import { Dropdown } from "Common/Components/Dropdown";
import DeleteModal from "Common/DeleteModal";
import Modal from "Common/Components/Modal";
import { ToastContainer } from "react-toastify";
import filterDataBySearch from "Common/filterDataBySearch";
import { useDispatch, useSelector } from 'react-redux';
import { createSelector } from 'reselect';
import { getTicket as getTickets, deleteTicket as onDeleteTicket, updateStatus } from 'slices/thunk';
import * as Yup from "yup";
import { useFormik } from "formik";

const EmployeeTicketsDashboard = () => {
    const dispatch = useDispatch<any>();
    
    // Selector de datos
    const selectDataList = createSelector(
        (state: any) => state.TICKETManagment,
        (state) => ({
            dataList: state.ticketlist,
            loader: state.loading
        })
    );
    
    const { dataList, loader } = useSelector(selectDataList);
    const location = useLocation();
    const [employeeData] = useState(location.state?.data);
    const [filteredData, setFilteredData] = useState<any>([]); 
    const [displayData, setDisplayData] = useState<any>([]); 
    const [eventData, setEventData] = useState<any>();
    const [show, setShow] = useState<boolean>(false);
    const [deleteModal, setDeleteModal] = useState<boolean>(false);
    const [activeTab, setActiveTab] = useState("1");
    
    // Obtener tickets
    useEffect(() => {
        dispatch(getTickets());
    }, [dispatch]);
    
    // Filtrar tickets por empleado y estado
    useEffect(() => {
        let tickets = Object.values(dataList);
        if (employeeData?.id) {
            tickets = tickets.filter((ticket: any) => 
                ticket.responsible?.id === employeeData.id
            );
        }
        setFilteredData(tickets);
        setDisplayData(tickets); // Inicialmente mostrar todos los tickets filtrados
    }, [dataList, employeeData]);
    
    // Modal de eliminación
    const deleteToggle = () => setDeleteModal(!deleteModal);
    const onClickDelete = (cell: any) => {
        setDeleteModal(true);
        if (cell.ticket_id) {
            setEventData(cell);
        }
    };
    
    const handleDelete = () => {
        if (eventData) {
            dispatch(onDeleteTicket(eventData.ticket_id));
            setDeleteModal(false);
        }
    };
    
    // Actualizar datos
    const handleUpdateDataClick = (ele: any) => {
        setEventData({ ...ele });
        setShow(true);
    };
    
    // Validación del formulario
    const validation = useFormik({
        enableReinitialize: true,
        initialValues: {
            ticket_id: (eventData && eventData.ticket_id) || "",
            ticketCustomerName: (eventData && eventData.ticketCustomerName) || "",
            ticket_total: (eventData && eventData.ticket_total) || "",
            ticket_type: (eventData && eventData.ticket_type) || "",
            ticket_status: (eventData && eventData.ticket_status) || " ",
            ticket_date: (eventData && eventData.ticket_date) || "",
            productos: (eventData && eventData.productos) || [],
            responsible: (eventData && eventData.responsible) || [],
            client: (eventData && eventData.client) || []
        },
        validationSchema: Yup.object({
            ticket_id: Yup.string().required("Es necesario el identificador del ticket!")
        }),
        onSubmit: (values) => {
            const updateData = {
                id: eventData ? eventData.ticket_id : 0,
                onStatus: validation.values.ticket_status,
            };
            
            if (validation.values.ticket_status !== eventData.ticket_status) {
                dispatch(updateStatus(updateData));
            }
            
            toggle();
        },
    });
    
    const toggle = useCallback(() => {
        if (show) {
            setShow(false);
            setEventData("");
        } else {
            setShow(true);
            setEventData("");
            validation.resetForm();
        }
    }, [show, validation]);
    
    // Búsqueda de datos
    const filterSearchData = (e: any) => {
        const search = e.target.value;
        const keysToSearch = ['ticket_id'];
        filterDataBySearch(displayData, search, keysToSearch, setDisplayData);
    };
    
    // Cambiar pestaña y filtrar por estado
    const toggleTab = (tab: any, type: any) => {
        if (activeTab !== tab) {
            setActiveTab(tab);
            let filteredOrders = filteredData; // Usar filteredData en lugar de dataList
            
            if (type !== "all") {
                filteredOrders = filteredData.filter((order: any) => order.ticket_status === type);
            }
            setDisplayData(filteredOrders);
        }
    };
    
    // Componente de estado
    const Status = ({ item }: any) => {
        switch (item) {
            case "Por autorizar":
            case 'pending':
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-500/20 dark:text-yellow-200">
                        <Clock className="mr-1 h-3 w-3" /> Por autorizar
                    </span>
                );
            case "Cancelados":
            case 'deleted':
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-500/20 dark:text-red-200">
                        <XCircle className="mr-1 h-3 w-3" /> Cancelados
                    </span>
                );
            case "Autorizados":
            case 'authorized':
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-500/20 dark:text-green-200">
                        <CheckCircle className="mr-1 h-3 w-3" /> Autorizados
                    </span>
                );
            default:
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-sky-100 text-sky-800 dark:bg-sky-500/20 dark:text-sky-200">
                        {item}
                    </span>
                );
        }
    };
    
    // Columnas de la tabla
    const columns = useMemo(() => [
        {
            header: "Folio",
            accessorKey: "ticket_id",
            enableColumnFilter: false,
            enableSorting: false,
            cell: (cell: any) => (
                <Link to="#!" className="font-medium text-custom-500 hover:text-custom-600 transition-colors">
                    #{cell.getValue()}
                </Link>
            ),
        },
        {
            header: "Cliente",
            accessorFn: (row: any) => row.ticketCustomerName ? row.ticketCustomerName : row.client?.name,
            enableColumnFilter: false,
            cell: (cell: any) => (
                <span className="font-medium text-slate-600 dark:text-zink-100">
                    {cell.getValue()}
                </span>
            )
        },
        {
            header: "Total",
            accessorKey: "ticket_total",
            enableColumnFilter: false,
            cell: (cell: any) => (
                <span className="font-semibold text-green-500 dark:text-green-300">
                    ${cell.getValue()}
                </span>
            ),
        },
        {
            header: "Fecha",
            accessorKey: "ticket_date",
            enableColumnFilter: false,
            cell: (cell: any) => (
                <div className="flex items-center">
                    <Calendar className="h-3 w-3 mr-1 text-slate-500 dark:text-zink-200" />
                    <span className="text-slate-500 dark:text-zink-200">
                        {moment(cell.getValue()).format("DD/MM/YYYY HH:mm")}
                    </span>
                </div>
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
        {
            header: "Acciones",
            enableColumnFilter: false,
            enableSorting: true,
            cell: (cell: any) => (
                <div className="flex gap-2">
                    <button 
                        onClick={() => handleUpdateDataClick(cell.row.original)}
                        className="flex items-center justify-center size-8 transition-all duration-200 ease-linear rounded-md bg-slate-100 text-slate-500 hover:text-custom-500 hover:bg-custom-100 dark:bg-zink-600 dark:text-zink-200 dark:hover:bg-custom-500/20 dark:hover:text-custom-500"
                    >
                        <Eye className="inline-block size-3" />
                    </button>
                    <Dropdown className="relative">
                        <Dropdown.Trigger className="flex items-center justify-center size-8 p-0 text-slate-500 btn bg-slate-100 hover:text-white hover:bg-slate-600 focus:text-white focus:bg-slate-600 focus:ring focus:ring-slate-100 active:text-white active:bg-slate-600 active:ring active:ring-slate-100 dark:bg-slate-500/20 dark:text-slate-400 dark:hover:bg-slate-500 dark:hover:text-white dark:focus:bg-slate-500 dark:focus:text-white dark:active:bg-slate-500 dark:active:text-white dark:ring-slate-400/20">
                            <MoreHorizontal className="size-3" />
                        </Dropdown.Trigger>
                        <Dropdown.Content placement={cell.row.index ? "top-end" : "right-end"} className="absolute z-50 py-2 mt-1 ltr:text-left rtl:text-right list-none bg-white rounded-md shadow-md min-w-[10rem] dark:bg-zink-600" aria-labelledby="orderAction1">
                            <li>
                                <Link to="#!" className="block px-4 py-1.5 text-base transition-all duration-200 ease-linear text-slate-600 hover:bg-slate-100 hover:text-slate-500 focus:bg-slate-100 focus:text-slate-500 dark:text-zink-100 dark:hover:bg-zink-500 dark:hover:text-zink-200 dark:focus:bg-zink-500 dark:focus:text-zink-200" onClick={() => handleUpdateDataClick(cell.row.original)}>
                                    <FileEdit className="inline-block size-3 ltr:mr-1 rtl:ml-1" />
                                    <span className="align-middle">Detalles</span>
                                </Link>
                            </li>
                            <li>
                                <Link to="#!" className="block px-4 py-1.5 text-base transition-all duration-200 ease-linear text-slate-600 hover:bg-slate-100 hover:text-slate-500 focus:bg-slate-100 focus:text-slate-500 dark:text-zink-100 dark:hover:bg-zink-500 dark:hover:text-zink-200 dark:focus:bg-zink-500 dark:focus:text-zink-200" onClick={() => onClickDelete(cell.row.original)}>
                                    <Trash2 className="inline-block size-3 ltr:mr-1 rtl:ml-1" />
                                    <span className="align-middle">Eliminar</span>
                                </Link>
                            </li>
                        </Dropdown.Content>
                    </Dropdown>
                </div>
            ),
        }
    ], []);
    
    // Contador de tickets por estado
    const ticketTotals = useMemo(() => {
        const totals = { Autorizados: 0, "Por autorizar": 0, Cancelados: 0, total: 0 };
        
        Object.values(filteredData).forEach((ticket: any) => {
            // Filtrar por empleado si hay uno seleccionado
            if (employeeData?.id && ticket.responsible?.id !== employeeData.id) {
                return;
            }
            
            totals.total++;
            
            switch (ticket.ticket_status) {
                case "Autorizados":
                case "authorized":
                    totals.Autorizados++;
                    break;
                case "Por autorizar":
                case "pending":
                    totals["Por autorizar"]++;
                    break;
                case "Cancelados":
                case "deleted":
                    totals.Cancelados++;
                    break;
                default:
                    break;
            }
        });
        return totals;
    }, [filteredData, employeeData]);
    
    // Calcular total de ventas
    const totalSales = useMemo(() => {
        return displayData.reduce((sum: number, ticket: any) => {
            return sum + (parseFloat(ticket.ticket_total) || 0);
        }, 0);
    }, [displayData]);
    
    return (
        <React.Fragment>
            {loader ? (
                <div className="absolute inset-0 flex items-center justify-center bg-white/50 dark:bg-zink-700/50 z-10">
                    <div className="w-8 h-8 border-2 rounded-full animate-spin border-l-transparent border-custom-500"></div>
                </div>
            ) : (
                <div className="relative w-full h-full">
                    {/* Breadcrumb y título */}
                    {/* <div className="flex flex-col gap-2 mb-6 md:flex-row md:items-center md:justify-between"> */}
                        <BreadCrumb 
                            title={`Tickets de ${employeeData?.fullname || 'Empleado'}`} 
                            pageTitle='Dashboard' 
                        />
                        
                        {/* {employeeData && (
                            <div className="flex items-center gap-3 p-3 bg-white rounded-md shadow-sm dark:bg-zink-600">
                                <div className="flex items-center justify-center size-10 rounded-full bg-custom-50 text-custom-500 dark:bg-custom-500/20 shrink-0">
                                    <User className="size-5" />
                                </div>
                                <div>
                                    <h5 className="text-sm font-medium">{employeeData.fullname}</h5>
                                    <p className="text-xs text-slate-500 dark:text-zink-200">{employeeData.email}</p>
                                </div>
                            </div>
                        )} */}
                    {/* </div> */}
                    
                    <DeleteModal show={deleteModal} onHide={deleteToggle} onDelete={handleDelete} />
                    <ToastContainer closeButton={false} limit={1} />
                    
                    {/* Tarjetas resumen */}
                    <div className="grid grid-cols-1 gap-5 mb-5 md:grid-cols-2 xl:grid-cols-4">
                        {/* Total de tickets */}
                        <div className="card">
                            <div className="card-body">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h6 className="mb-1 text-gray-800 text-15 dark:text-zink-50">Total Tickets</h6>
                                        <h4 className="mb-0">
                                            <CountUp end={ticketTotals.total} separator="," className="counter-value" />
                                        </h4>
                                    </div>
                                    <div className="flex items-center justify-center size-12 rounded-md text-15 bg-custom-50 text-custom-500 dark:bg-custom-500/20 shrink-0">
                                        <Ticket className="size-5" />
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <div className="overflow-hidden rounded-full h-2.5 bg-slate-100 dark:bg-zink-600">
                                        <div 
                                            className="bg-custom-500 rounded-full h-2.5" 
                                            style={{ width: `${(ticketTotals.total / (ticketTotals.total || 1)) * 100}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        {/* Tickets pendientes */}
                        <div className="card">
                            <div className="card-body">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h6 className="mb-1 text-gray-800 text-15 dark:text-zink-50">Por Autorizar</h6>
                                        <h4 className="mb-0">
                                            <CountUp end={ticketTotals["Por autorizar"]} separator="," className="counter-value" />
                                        </h4>
                                    </div>
                                    <div className="flex items-center justify-center size-12 rounded-md text-15 bg-yellow-50 text-yellow-500 dark:bg-yellow-500/20 shrink-0">
                                        <Loader className="size-5" />
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <div className="overflow-hidden rounded-full h-2.5 bg-slate-100 dark:bg-zink-600">
                                        <div 
                                            className="bg-yellow-500 rounded-full h-2.5" 
                                            style={{ width: `${(ticketTotals["Por autorizar"] / (ticketTotals.total || 1)) * 100}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        {/* Tickets autorizados */}
                        <div className="card">
                            <div className="card-body">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h6 className="mb-1 text-gray-800 text-15 dark:text-zink-50">Autorizados</h6>
                                        <h4 className="mb-0">
                                            <CountUp end={ticketTotals.Autorizados} separator="," className="counter-value" />
                                        </h4>
                                    </div>
                                    <div className="flex items-center justify-center size-12 rounded-md text-15 bg-green-50 text-green-500 dark:bg-green-500/20 shrink-0">
                                        <TicketCheck className="size-5" />
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <div className="overflow-hidden rounded-full h-2.5 bg-slate-100 dark:bg-zink-600">
                                        <div 
                                            className="bg-green-500 rounded-full h-2.5" 
                                            style={{ width: `${(ticketTotals.Autorizados / (ticketTotals.total || 1)) * 100}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        {/* Tickets cancelados */}
                        <div className="card">
                            <div className="card-body">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h6 className="mb-1 text-gray-800 text-15 dark:text-zink-50">Cancelados</h6>
                                        <h4 className="mb-0">
                                            <CountUp end={ticketTotals.Cancelados} separator="," className="counter-value" />
                                        </h4>
                                    </div>
                                    <div className="flex items-center justify-center size-12 rounded-md text-15 bg-red-50 text-red-500 dark:bg-red-500/20 shrink-0">
                                        <TicketX className="size-5" />
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <div className="overflow-hidden rounded-full h-2.5 bg-slate-100 dark:bg-zink-600">
                                        <div 
                                            className="bg-red-500 rounded-full h-2.5" 
                                            style={{ width: `${(ticketTotals.Cancelados / (ticketTotals.total || 1)) * 100}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Estadísticas adicionales */}
                    <div className="grid grid-cols-1 gap-5 mb-5 lg:grid-cols-3">
                        {/* Total de ventas */}
                        <div className="card">
                            <div className="card-body">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h6 className="mb-1 text-gray-800 text-15 dark:text-zink-50">Total en Ventas</h6>
                                        <h4 className="mb-0">
                                            $<CountUp end={totalSales} separator="," decimals={2} decimal="." className="counter-value" />
                                        </h4>
                                    </div>
                                    <div className="flex items-center justify-center size-12 rounded-md text-15 bg-purple-50 text-purple-500 dark:bg-purple-500/20 shrink-0">
                                        <CreditCard className="size-5" />
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-zink-200">
                                        <BarChart2 className="size-4" />
                                        <span>Total acumulado de todos los tickets</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        {/* Ticket promedio */}
                        <div className="card">
                            <div className="card-body">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h6 className="mb-1 text-gray-800 text-15 dark:text-zink-50">Ticket Promedio</h6>
                                        <h4 className="mb-0">
                                            $<CountUp 
                                                end={ticketTotals.total > 0 ? totalSales / ticketTotals.total : 0} 
                                                separator="," 
                                                decimals={2} 
                                                decimal="." 
                                                className="counter-value" 
                                            />
                                        </h4>
                                    </div>
                                    <div className="flex items-center justify-center size-12 rounded-md text-15 bg-sky-50 text-sky-500 dark:bg-sky-500/20 shrink-0">
                                        <Tag className="size-5" />
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-zink-200">
                                        <BarChart2 className="size-4" />
                                        <span>Valor promedio por ticket</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        {/* Último ticket */}
                        <div className="card">
                            <div className="card-body">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h6 className="mb-1 text-gray-800 text-15 dark:text-zink-50">Último Ticket</h6>
                                        <h4 className="mb-0">
                                            {displayData.length > 0 ? (
                                                `#${displayData[displayData.length - 1].ticket_id}`
                                            ) : 'N/A'}
                                        </h4>
                                    </div>
                                    <div className="flex items-center justify-center size-12 rounded-md text-15 bg-orange-50 text-orange-500 dark:bg-orange-500/20 shrink-0">
                                        <Calendar className="size-5" />
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-zink-200">
                                        <Clock className="size-4" />
                                        <span>
                                            {displayData.length > 0 ? (
                                                moment(displayData[displayData.length - 1].ticket_date).fromNow()
                                            ) : 'Sin registros'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Tabla de tickets */}
                    <div className="card" id="ticketsTable">
                        <div className="card-body">
                            <div className="flex flex-col gap-4 mb-5 lg:flex-row lg:items-center lg:justify-between">
                                <div className="lg:w-1/3">
                                    <div className="relative">
                                        <input 
                                            type="text" 
                                            className="ltr:pl-8 rtl:pr-8 search form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200"
                                            placeholder="Buscar por folio..." 
                                            autoComplete="off" 
                                            onChange={filterSearchData} 
                                        />
                                        <Search className="inline-block size-4 absolute ltr:left-2.5 rtl:right-2.5 top-2.5 text-slate-500 dark:text-zink-200 fill-slate-100 dark:fill-zink-600" />
                                    </div>
                                </div>
                                
                                <div className="lg:w-auto">
                                    <ul className="flex flex-wrap w-full text-sm font-medium text-center text-gray-500 nav-tabs">
                                        <li className={`group ${activeTab === "1" && "active"}`}>
                                            <button 
                                                type="button"
                                                className="inline-flex items-center px-4 py-1.5 text-base transition-all duration-300 ease-linear rounded-md text-slate-500 dark:text-zink-200 border border-transparent group-[.active]:bg-custom-500 group-[.active]:text-white dark:group-[.active]:text-white hover:text-custom-500 dark:hover:text-custom-500 active:text-custom-500 dark:active:text-custom-500 -mb-[1px]" 
                                                onClick={() => toggleTab("1", "all")}
                                            >
                                                <Boxes className="inline-block size-4 mr-1" /> 
                                                <span>Total ({ticketTotals.total})</span>
                                            </button>
                                        </li>
                                        <li className={`group ${activeTab === "2" && "active"}`}>
                                            <button 
                                                type="button"
                                                className="inline-flex items-center px-4 py-1.5 text-base transition-all duration-300 ease-linear rounded-md text-slate-500 dark:text-zink-200 border border-transparent group-[.active]:bg-custom-500 group-[.active]:text-white dark:group-[.active]:text-white hover:text-custom-500 dark:hover:text-custom-500 active:text-custom-500 dark:active:text-custom-500 -mb-[1px]"
                                                onClick={() => toggleTab("2", "Autorizados")}
                                            >
                                                <TicketCheck className="inline-block size-4 mr-1" />
                                                <span>Autorizados ({ticketTotals.Autorizados})</span>
                                            </button>
                                        </li>
                                        <li className={`group ${activeTab === "3" && "active"}`}>
                                            <button 
                                                type="button"
                                                className="inline-flex items-center px-4 py-1.5 text-base transition-all duration-300 ease-linear rounded-md text-slate-500 dark:text-zink-200 border border-transparent group-[.active]:bg-custom-500 group-[.active]:text-white dark:group-[.active]:text-white hover:text-custom-500 dark:hover:text-custom-500 active:text-custom-500 dark:active:text-custom-500 -mb-[1px]"
                                                onClick={() => toggleTab("3", "Por autorizar")}
                                            >
                                                <Loader className="inline-block size-4 mr-1" /> 
                                                <span>Por autorizar ({ticketTotals["Por autorizar"]})</span>
                                            </button>
                                        </li>
                                        <li className={`group ${activeTab === "4" && "active"}`}>
                                            <button 
                                                type="button"
                                                className="inline-flex items-center px-4 py-1.5 text-base transition-all duration-300 ease-linear rounded-md text-slate-500 dark:text-zink-200 border border-transparent group-[.active]:bg-custom-500 group-[.active]:text-white dark:group-[.active]:text-white hover:text-custom-500 dark:hover:text-custom-500 active:text-custom-500 dark:active:text-custom-500 -mb-[1px]"
                                                onClick={() => toggleTab("4", "Cancelados")}
                                            >
                                                <PackageX className="inline-block size-4 mr-1" /> 
                                                <span>Cancelados ({ticketTotals.Cancelados})</span>
                                            </button>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            
                            {displayData.length > 0 ? (
                                <TableContainer
                                    isPagination={true}
                                    columns={columns}
                                    data={displayData}
                                    customPageSize={10}
                                    divclassName="overflow-x-auto"
                                    tableclassName="w-full whitespace-nowrap"
                                    theadclassName="ltr:text-left rtl:text-right bg-slate-100 dark:bg-zink-600"
                                    thclassName="px-3.5 py-2.5 font-semibold text-slate-500 border-b border-slate-200 dark:border-zink-500 dark:text-zink-200"
                                    tdclassName="px-3.5 py-2.5 border-y border-slate-200 dark:border-zink-500"
                                    PaginationClassName="flex flex-col items-center mt-5 md:flex-row"
                                />
                            ) : (
                                <div className="noresult">
                                    <div className="py-6 text-center">
                                        <Search className="size-6 mx-auto text-sky-500 fill-sky-100 dark:sky-500/20" />
                                        <h5 className="mt-2 mb-1">Sin registros!</h5>
                                        <p className="mb-0 text-slate-500 dark:text-zink-200">
                                            {employeeData ? 
                                                'El empleado no tiene tickets registrados' : 
                                                'No se encontraron tickets. Si crees que es un error contacta a soporte.'}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    
                    {/* Modal de detalles del ticket */}
                    <Modal 
                        show={show} 
                        onHide={toggle} 
                        modal-center="true"
                        className="fixed flex flex-col transition-all duration-300 ease-in-out left-2/4 z-drawer -translate-x-2/4 -translate-y-2/4"
                        dialogClassName="w-screen md:w-[40rem] bg-white shadow rounded-md dark:bg-zink-600"
                    >
                        <Modal.Header 
                            className="flex items-center justify-between p-4 border-b dark:border-zink-500"
                            closeButtonClass="transition-all duration-200 ease-linear text-slate-400 hover:text-red-500"
                        >
                            <Modal.Title className="text-16">Detalles del Ticket #{validation.values.ticket_id}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body className="max-h-[calc(theme('height.screen')_-_180px)] p-4 overflow-y-auto">
                            <form onSubmit={(e) => {
                                e.preventDefault();
                                validation.handleSubmit();
                                return false;
                            }}>
                                <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
                                    {/* Información básica */}
                                    <div className="xl:col-span-12">
                                        <div className="card">
                                            <div className="card-body">
                                                <h6 className="mb-4 text-15">Información del Ticket</h6>
                                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                                    <div>
                                                        <label className="inline-block mb-2 text-sm font-medium">Folio</label>
                                                        <input 
                                                            type="text" 
                                                            className="form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200"
                                                            disabled 
                                                            value={validation.values.ticket_id || "N/A"} 
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="inline-block mb-2 text-sm font-medium">Fecha</label>
                                                        <input 
                                                            type="text" 
                                                            className="form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200"
                                                            disabled 
                                                            value={validation.values.ticket_date ? moment(validation.values.ticket_date).format("DD/MM/YYYY HH:mm") : "N/A"} 
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="inline-block mb-2 text-sm font-medium">Tipo</label>
                                                        <input 
                                                            type="text" 
                                                            className="form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200"
                                                            disabled 
                                                            value={validation.values.ticket_type === 'sale' ? 'VENTA' : 'COMPRA'} 
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="inline-block mb-2 text-sm font-medium">Estado</label>
                                                        <select
                                                            name="ticket_status"
                                                            className="form-select border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-700 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200"
                                                            value={validation.values.ticket_status}
                                                            onChange={validation.handleChange}
                                                        >
                                                            <option value="pending">Por Autorizar</option>
                                                            <option value="deleted">Cancelado</option>
                                                            <option value="authorized">Autorizado</option>
                                                        </select>
                                                    </div>
                                                    <div>
                                                        <label className="inline-block mb-2 text-sm font-medium">Total</label>
                                                        <input 
                                                            type="text" 
                                                            className="form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200"
                                                            disabled 
                                                            value={`$ ${validation.values.ticket_total || "0.00"}`} 
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="inline-block mb-2 text-sm font-medium">Responsable</label>
                                                        <input 
                                                            type="text" 
                                                            className="form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200"
                                                            disabled 
                                                            value={validation.values.responsible?.name || "N/A"} 
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Información del cliente */}
                                    {validation.values.client && Object.keys(validation.values.client).length > 0 && (
                                        <div className="xl:col-span-12">
                                            <div className="card">
                                                <div className="card-body">
                                                    <h6 className="mb-4 text-15">Información del Cliente</h6>
                                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                                        <div>
                                                            <label className="inline-block mb-2 text-sm font-medium">Nombre</label>
                                                            <input 
                                                                type="text" 
                                                                className="form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200"
                                                                disabled 
                                                                value={validation.values.client?.name + " " + validation.values.client?.last_name || "N/A"} 
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="inline-block mb-2 text-sm font-medium">ID</label>
                                                            <input 
                                                                type="text" 
                                                                className="form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200"
                                                                disabled 
                                                                value={validation.values.client?.id || "N/A"} 
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="inline-block mb-2 text-sm font-medium">Email</label>
                                                            <input 
                                                                type="text" 
                                                                className="form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200"
                                                                disabled 
                                                                value={validation.values.client?.email || "N/A"} 
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="inline-block mb-2 text-sm font-medium">Teléfono</label>
                                                            <input 
                                                                type="text" 
                                                                className="form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200"
                                                                disabled 
                                                                value={validation.values.client?.phone || "N/A"} 
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    
                                    {/* Productos */}
                                    <div className="xl:col-span-12">
                                        <div className="card">
                                            <div className="card-body">
                                                <h6 className="mb-4 text-15">Productos</h6>
                                                
                                                <div className="overflow-x-auto">
                                                    <table className="w-full">
                                                        <thead className="ltr:text-left rtl:text-right">
                                                        <tr>
                                                            <th className="px-3.5 py-2.5 font-semibold border-b border-slate-200 dark:border-zink-500">Producto</th>
                                                            <th className="px-3.5 py-2.5 font-semibold border-b border-slate-200 dark:border-zink-500">
                                                                Peso<span className="text-xs text-gray-500">(kg)</span>
                                                            </th>
                                                            <th className="px-3.5 py-2.5 font-semibold border-b border-slate-200 dark:border-zink-500">
                                                                Merma<span className="text-xs text-gray-500">(kg)</span>
                                                            </th>
                                                            <th className="px-3.5 py-2.5 font-semibold border-b border-slate-200 dark:border-zink-500">Tipo</th>
                                                            <th className="px-3.5 py-2.5 font-semibold border-b border-slate-200 dark:border-zink-500">
                                                                Precio<span className="text-xs text-gray-500">(1/kg)</span>
                                                            </th>
                                                            <th className="px-3.5 py-2.5 font-semibold border-b border-slate-200 dark:border-zink-500">Total</th>
                                                        </tr>
                                                        </thead>
                                                        <tbody>
                                                        {validation.values.productos && validation.values.productos.length > 0 ? (
                                                            validation.values.productos.map((product: any, index: number) => (
                                                                <tr key={index} className="even:bg-slate-50 hover:bg-slate-50 even:hover:bg-slate-100 dark:even:bg-zink-600/50 dark:hover:bg-zink-600 dark:even:hover:bg-zink-600">
                                                                    <td className="px-3.5 py-2.5 border-y border-slate-200 dark:border-zink-500">{product.product_name}</td>
                                                                    <td className="px-3.5 py-2.5 border-y border-slate-200 dark:border-zink-500">
                                                                        {(Number(product.weight) + Number(product.waste)).toFixed(2)}
                                                                        <span className="text-xs text-gray-500"> kg</span>
                                                                    </td>
                                                                    <td className="px-3.5 py-2.5 border-y border-slate-200 dark:border-zink-500">
                                                                        {product.waste || '0.00'}
                                                                        <span className="text-xs text-gray-500"> kg</span>
                                                                    </td>
                                                                    <td className="px-3.5 py-2.5 border-y border-slate-200 dark:border-zink-500">{product.type || "N/A"}</td>
                                                                    <td className="px-3.5 py-2.5 border-y border-slate-200 dark:border-zink-500">
                                                                        <span className="text-xs text-gray-500"> $</span>{product.unit_price}
                                                                    </td>
                                                                    <td className="px-3.5 py-2.5 border-y border-slate-200 dark:border-zink-500">
                                                                        <span className="text-xs text-gray-500"> $</span>{product.total}
                                                                    </td>
                                                                </tr>
                                                            ))
                                                        ) : (
                                                            <tr>
                                                                <td colSpan={6} className="px-3.5 py-2.5 border-y border-slate-200 dark:border-zink-500 text-center">No hay productos</td>
                                                            </tr>
                                                        )}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="flex justify-end gap-2 mt-4">
                                    <button 
                                        type="button" 
                                        className="text-red-500 bg-white btn hover:text-red-500 hover:bg-red-100 focus:text-red-500 focus:bg-red-100 active:text-red-500 active:bg-red-100 dark:bg-zink-600 dark:hover:bg-red-500/10 dark:focus:bg-red-500/10 dark:active:bg-red-500/10"
                                        onClick={toggle}
                                    >
                                        Cerrar
                                    </button>
                                    <button 
                                        type="submit" 
                                        className="text-white btn bg-custom-500 border-custom-500 hover:text-white hover:bg-custom-600 hover:border-custom-600 focus:text-white focus:bg-custom-600 focus:border-custom-600 focus:ring focus:ring-custom-100 active:text-white active:bg-custom-600 active:border-custom-600 active:ring active:ring-custom-100 dark:ring-custom-400/20"
                                    >
                                        Actualizar Estado
                                    </button>
                                </div>
                            </form>
                        </Modal.Body>
                    </Modal>
                </div>
            )}
        </React.Fragment>
    );
};

export default EmployeeTicketsDashboard;