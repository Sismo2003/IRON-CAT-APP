import React, { useCallback, useEffect, useMemo, useState } from "react";
import BreadCrumb from "Common/BreadCrumb";
import CountUp from 'react-countup';
import Flatpickr from "react-flatpickr";
import moment from "moment";


import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

// icons
import {
	Boxes,
	TicketX,
	Loader,
	Search,
	TicketCheck,
	PackageX,
	MoreHorizontal,
	Trash2,
	FileEdit,
	Ticket, Download,
	Printer
} from 'lucide-react';
import { OrdersOverviewChart } from "./charts";
import { Link } from "react-router-dom";
import TableContainer from "Common/TableContainer";

import { Dropdown } from "Common/Components/Dropdown";
import DeleteModal from "Common/DeleteModal";
import Modal from "Common/Components/Modal";

// react-redux
import { useDispatch, useSelector } from 'react-redux';
import { createSelector } from 'reselect';

import {
	getTicket as getTickets,
	deleteTicket as onDeleteTicket,
	updateStatus
} from 'slices/thunk';


// Formik
import * as Yup from "yup";
import { useFormik } from "formik";
import { ToastContainer } from "react-toastify";
import filterDataBySearch from "Common/filterDataBySearch";

import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';


const ENV_MODE : any = process.env.REACT_APP_MODE;
const PRINTER_ROUTE_DEV : any = process.env.REACT_APP_PRINTER_DEV;
const PRINTER_ROUTE_PROD : any = process.env.REACT_APP_PRINTER_PROD;

const Orders = () => {
	
	const dispatch = useDispatch<any>();
	
	const selectDataList = createSelector(
		(state: any) => state.TICKETManagment,
		(state) => ({
			dataList: state.ticketlist,
			loader : state.loading,
		})
	);
	
	const { dataList,loader } = useSelector(selectDataList);
	
	
	const [data, setData] = useState<any>([]);
	
	const [eventData, setEventData] = useState<any>();
	
	const [show, setShow] = useState<boolean>(false);

	const [originalData, setOriginalData] = useState<any[]>([]);

	
	
	
	useEffect(() => {
		dispatch(getTickets());
	}, [dispatch]);
	
	useEffect(() => {
		const tickets = Object.values(dataList);
		setOriginalData(tickets);
		setData(tickets);
	}, [dataList]);	
	
	
	// Delete Modal
	const [deleteModal, setDeleteModal] = useState<boolean>(false);
	const deleteToggle = () => setDeleteModal(!deleteModal);
	
	// Delete Data
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
	//
	
	// Update Data
	const handleUpdateDataClick = (ele: any) => {
		setEventData({ ...ele });
		setShow(true);
	};
	
	// fetch to re print the ticket
	const onClickPrint = (cell: any) => {
		interface pos{
			ticket_id : number ,
			customer_name : string
		}
		// console.log(cell);
		if (cell.ticket_id) {
			//customer_name
			const data : pos = {
				ticket_id: cell.ticket_id,
				customer_name: cell.ticketCustomerName
			}
			const route : string = ENV_MODE === 'production' ? PRINTER_ROUTE_PROD : PRINTER_ROUTE_DEV;
			if(route !== undefined && route !== "") {
				fetch(route, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify(data)
				});
				toast.success("Ticket enviado a la impresora!", {autoClose : 2000});
				return;
			}
			toast.error("Routa indefinida para la impresa!", {autoClose : 2000});
			return;
		}
		toast.error("Error en la captura el folio del ticket!", {autoClose : 2000});
	};
	
	// validation
	const validation: any = useFormik({
		// enableReinitialize : use this flag when initial values needs to be changed
		enableReinitialize: true,
		
		initialValues: {
			ticket_id: (eventData && eventData.ticket_id) || "",
			ticketCustomerName: (eventData && eventData.ticketCustomerName) || "",
			ticket_total: (eventData && eventData.ticket_total) || "",
			ticket_type: (eventData && eventData.ticket_type) || "",
			ticket_status: (eventData && eventData.ticket_status) || " ",
			ticket_date: (eventData && eventData.ticket_date) ||  "",
			productos: (eventData && eventData.productos) || [],
			responsible: (eventData && eventData.responsible) || [] ,
			client: (eventData && eventData.client) || [] ,
			
			ticket_subtotal : (eventData && eventData.subtotal_ticket) || "",
			discount_code : (eventData && eventData.discount_code) || "",
			discount_total : (eventData && eventData.discount_amount) || "",

			
		},
		validationSchema: Yup.object({
			ticket_id: Yup.string().required("Es necesario el identificador del ticket!")
		}),
		
		onSubmit: (values) => {
			const updateData = {
				id: eventData ? eventData.ticket_id : 0,
				onStatus : validation.values.ticket_status,
				// ...values,
			};
			//dispatch for update state from the ticket!
			if(validation.values.ticket_status !== eventData.ticket_status) {
				dispatch(updateStatus(updateData));
			}
			
			toggle();
		},
	});
	
	//
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
	
	// Search Data
	const filterSearchData = (e: any) => {
		const search: string = String(e.target.value).toLowerCase();
		const keysToSearch = ['ticket_id'];
		filterDataBySearch(originalData, search, keysToSearch, setData);
	};
	
	const [activeTab, setActiveTab] = useState("1");
	
	
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
				return (<span className="delivery_status px-2.5 py-0.5 text-xs inline-block font-medium rounded border bg-green-100 border-green-200 text-green-500 dark:bg-green-500/20 dark:border-green-500/20">Pagados</span>);
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
				header: "Subtotal",
				accessorKey: "subtotal_ticket",
				enableColumnFilter: false,
				cell: (cell: any) => (
					<span>$ {cell.getValue()}</span>
				),
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
				// accessorKey: "responsible.name",
				accessorFn: row => row.responsible?.name ?? "",
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
			{
				header: "Action",
				enableColumnFilter: false,
				enableSorting: true,
				cell: (cell: any) => (
					<Dropdown className="relative">
						<Dropdown.Trigger id="orderAction1" data-bs-toggle="dropdown" className="flex items-center justify-center size-[30px] p-0 text-slate-500 btn bg-slate-100 hover:text-white hover:bg-slate-600 focus:text-white focus:bg-slate-600 focus:ring focus:ring-slate-100 active:text-white active:bg-slate-600 active:ring active:ring-slate-100 dark:bg-slate-500/20 dark:text-slate-400 dark:hover:bg-slate-500 dark:hover:text-white dark:focus:bg-slate-500 dark:focus:text-white dark:active:bg-slate-500 dark:active:text-white dark:ring-slate-400/20">
							<MoreHorizontal className="size-3" /></Dropdown.Trigger>
						<Dropdown.Content placement={cell.row.index ? "top-end" : "right-end"} className="absolute z-50 py-2 mt-1 ltr:text-left rtl:text-right list-none bg-white rounded-md shadow-md min-w-[10rem] dark:bg-zink-600"
						                  aria-labelledby="orderAction1">
							<li>
								<Link to="#!" data-modal-target="addOrderModal"
									className="block px-4 py-1.5 text-base transition-all duration-200 ease-linear text-slate-600 hover:bg-slate-100 hover:text-slate-500 focus:bg-slate-100 focus:text-slate-500 dark:text-zink-100 dark:hover:bg-zink-500 dark:hover:text-zink-200 dark:focus:bg-zink-500 dark:focus:text-zink-200"
									onClick={() => {const data = cell.row.original;handleUpdateDataClick(data);}}
								>
									<FileEdit className="inline-block size-3 ltr:mr-1 rtl:ml-1" />
									<span className="align-middle">Detalles</span>
								</Link>
							</li>
							<li>
								<Link to="#!" className="block px-4 py-1.5 text-base transition-all duration-200
									ease-linear text-slate-600 hover:bg-slate-100 hover:text-slate-500
								focus:bg-slate-100 focus:text-slate-500 dark:text-zink-100 dark:hover:bg-zink-500
								dark:hover:text-zink-200 dark:focus:bg-zink-500 dark:focus:text-zink-200"
									onClick={() => {const data = cell.row.original;onClickDelete(data);}}
								>
									<Trash2 className="inline-block size-3 ltr:mr-1 rtl:ml-1" />
									<span className="align-middle">Eliminar</span>
								</Link>
							</li>
							<li>
								<Link to="#!"
									className="block px-4 py-1.5 text-base transition-all duration-200
									ease-linear text-slate-600 hover:bg-slate-100 hover:text-slate-500
									focus:bg-slate-100 focus:text-slate-500 dark:text-zink-100 dark:hover:bg-zink-500
									dark:hover:text-zink-200 dark:focus:bg-zink-500 dark:focus:text-zink-200"
									onClick={() => {const data = cell.row.original;onClickPrint(data);}}
								>
									<Printer  className="inline-block size-3 ltr:mr-1 rtl:ml-1" />
									<span className="align-middle">Imprimir</span>
								</Link>
							</li>
						</Dropdown.Content>
					</Dropdown>
				),
			}
		], []
	);
	
	
	// console.log(dataList);
	
	// contador de status para las cards!
	const ticketTotals = useMemo(() => {
		const totals = { Autorizados: 0, "Por autorizar": 0, Cancelados: 0 };
		Object.values(dataList).forEach((ticket: any) => {
			// Ajusta según el valor exacto que tenga ticket.ticket_status
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
	}, [dataList]);
	
	
	interface ExportableColumn {
		header: string;
		accessorKey: string;
	}
	
	const handleExport = () => {
		// 1) Filter to only the columns that have accessorKey
		const cols = columns.filter(
			(c => c.accessorKey)
		) as ExportableColumn[];
		
		const exportCols: ExportableColumn[] = cols.map(({ header, accessorKey }) => ({
			header,
			accessorKey
		}));
		
		// Calcula el máximo de productos en cualquier ticket
		let productFields = ['Producto','Peso','Merma','Precio unitario (kg)','Total','Tipo'];
		const maxProducts : number = data.reduce((max : number, t : any) => Math.max(max, t.productos?.length || 0), 0);
		
		
		// 2) Build the header and data rows
		
		const headerRow = [
			...exportCols.map(c => c.header),
			'Tipo',
			'Cliente',
			'Nombre Responsable',
			'Email Responsable',
			'Rol Responsable'
		];
		for (let i = 0; i < maxProducts; i++) {
			productFields.forEach(f  =>
				headerRow.push(f +" "+ (i + 1)));
		}
		
		
		const dataRows = data.map((row: any) => {
			// valores de columns
			const values = exportCols.map(c => row[c.accessorKey] ?? '');
			
			//HEADER -> tipo
			const type = row.ticket_type === 'shop' ? 'Compra' : 'Venta';
			//HEADER -> Cliente
			const client = row.ticketCustomerName ?? 'Sin registro';
			//HEADER -> Nombre del responsable
			const responsible_name = row.responsible?.name ?? 'Sin registro';
			//HEADER -> Nombre del responsable
			const responsible_email = row.responsible?.email ?? 'Sin registro';
			//HEADER -> Nombre del responsable
			const responsible_rol = row.responsible?.role ?? 'Sin registro';
			
			//PUSH AL arreglo que devolvemos
			values.push(
				type,
				client,
				responsible_name,
				responsible_email,
				responsible_rol,
			)
			
			productFields = ['product_name','weight','waste','unit_price','total','type'];
			
			
			// 3) Aquí acoplo el for tal cual, empujando a base
			for (let i = 0; i < maxProducts; i++) {
				const p = row.productos[i] || {};
				productFields.forEach(f => {
					if(f === 'type' ){
						let tmp;
						if(p[f] === 'wholesale') tmp = 'Precio Especial';
						else tmp = 'Precio regular';
						values.push(tmp);
					}else{
						values.push(p[f] ?? '');
					}
				});
			}
			
			// 4) Devuelvo el array completo
			return [...values];
		});
		
		const wsData = [headerRow, ...dataRows];

		// 3) SheetJS boilerplate
		const ws = XLSX.utils.aoa_to_sheet(wsData);
		const wb = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(wb, ws, 'Productos');
		const buf = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
		const date = new Date();
		const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
		// console.log(formattedDate);
		saveAs(new Blob([buf], { type: 'application/octet-stream' }), 'REPORTE DE TICKETS [' +formattedDate + '].xlsx');
	};
	
	
	return (
		
		<React.Fragment>
			{loader ? (
				<>
					{/* Spinner overlay */}
					<div className="absolute -mx-4 inset-0 flex items-center justify-center">
						<div className="w-8 h-8 border-2 rounded-full animate-spin border-l-transparent border-custom-500"></div>
					</div>
				</>
			) : (
				<>
					<div className="relative w-full h-full">
						<BreadCrumb title='Historial de Ticketes' pageTitle='Tickets' />
						<DeleteModal show={deleteModal} onHide={deleteToggle} onDelete={handleDelete} />
						<ToastContainer closeButton={false} limit={1} />
						{/* cards && charts */}
						<div className="grid grid-cols-1 gap-x-5 md:grid-cols-2 2xl:grid-cols-12">
							<div className="2xl:col-span-2 2xl:row-span-1">
								<div className="card">
									<div className="flex items-center gap-3 card-body">
										<div className="flex items-center justify-center size-12 rounded-md text-15 bg-custom-50 text-custom-500 dark:bg-custom-500/20 shrink-0">
											<Ticket />
										</div>
										<div className="grow">
											<h5 className="mb-1 text-16">
												<CountUp end={Object.keys(dataList).length ?? "0"} separator="," className="counter-value" />
											</h5>
											<p className="text-slate-500 dark:text-zink-200">Total Tickets</p>
										</div>
									</div>
								</div>
							</div>
							<div className="2xl:col-span-2 2xl:row-span-1">
								<div className="card">
									<div className="flex items-center gap-3 card-body">
										<div className="flex items-center justify-center size-12 rounded-md text-15 bg-red-50 text-red-500 dark:bg-red-500/20 shrink-0">
											<TicketX />
										</div>
										<div className="grow">
											<h5 className="mb-1 text-16">
												<CountUp end={ticketTotals.Cancelados} separator="," className="counter-value" />
											</h5>
											<p className="text-slate-500 dark:text-zink-200">Tickets Cancelados</p>
										</div>
									</div>
								</div>
							</div>
							{/* Charts  */}
							<div className="order-last md:col-span-2 2xl:col-span-8 2xl:row-span-3 card 2xl:order-none">
								<div className="card-body">
									<h6 className="mb-4 text-gray-800 text-15 dark:text-zink-50">Tickets Anuales</h6>
									<OrdersOverviewChart id="ordersOverview" />
								</div>
							</div>
							<div className="2xl:col-span-2 2xl:row-span-1">
								<div className="card">
									<div className="flex items-center gap-3 card-body">
										<div className="flex items-center justify-center size-12 text-yellow-500 rounded-md text-15 bg-yellow-50 dark:bg-yellow-500/20 shrink-0"><Loader /></div>
										<div className="grow">
											<h5 className="mb-1 text-16">
												<CountUp end={ticketTotals["Por autorizar"]} separator="," className="counter-value" />
											</h5>
											<p className="text-slate-500 dark:text-zink-200">Tickets Pendientes</p>
										</div>
									</div>
								</div>
							</div>
							<div className="2xl:col-span-2 2xl:row-span-1">
								<div className="card">
									<div className="flex items-center gap-3 card-body">
										<div className="flex items-center justify-center size-12 text-green-500 rounded-md text-15 bg-green-50 dark:bg-green-500/20 shrink-0">
											<TicketCheck />
										</div>
										<div className="grow">
											<h5 className="mb-1 text-16">
												<CountUp end={ticketTotals.Autorizados} separator="," className="counter-value" />
											</h5>
											<p className="text-slate-500 dark:text-zink-200">Tickets Pagados</p>
										</div>
									</div>
								</div>
							</div>
						
						</div>
						{/* Table  */}
						<div className="card" id="ticketsTable">
							<div className="card-body">
								<div className="xl:col-span-2 lg:col-span-1 card-header p-4">
									<div className="w-full flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
										{/* Input de búsqueda con ancho limitado */}
										<div className="w-full sm:w-auto sm:flex-1 max-w-md">
											<div className="relative">
												<input
													type="text"
													className="w-full ltr:pl-8 rtl:pr-8 search form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200"
													placeholder="Buscar ..."
													autoComplete="off"
													onChange={filterSearchData}
												/>
												<Search className="inline-block size-4 absolute ltr:left-2.5 rtl:right-2.5 top-2.5 text-slate-500 dark:text-zink-200 fill-slate-100 dark:fill-zink-600" />
											</div>
										</div>
										
										{/* Botones */}
										<div className="flex flex-col gap-2 sm:flex-row sm:justify-end flex-shrink-0">
											<button onClick={handleExport} type="button" className="whitespace-nowrap flex items-center justify-center gap-2 text-purple-500 bg-white border border-purple-500 border-dashed btn hover:text-purple-600 hover:bg-purple-50 hover:border-purple-600 focus:text-purple-600 focus:bg-purple-100 focus:border-purple-700 active:text-purple-700 active:bg-purple-200 active:border-purple-700 dark:bg-zink-700 dark:border-purple-400 dark:text-purple-300 dark:hover:bg-purple-800/20 dark:hover:text-purple-400 dark:focus:bg-purple-800/30 dark:focus:text-purple-400 dark:active:bg-purple-800/40 dark:active:text-purple-400">
												<Download className="inline-block size-4" />
												<span className="align-middle text-sm">Descargar Reporte</span>
											</button>
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
											<span className="align-middle">Pagado </span>
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
					</div>
					{/* Order Modal */}
					<Modal show={show} onHide={toggle} modal-center="true"
					       className="fixed flex flex-col transition-all duration-300 ease-in-out left-2/4 z-drawer -translate-x-2/4 -translate-y-2/4"
					       dialogClassName="w-screen md:w-[30rem] bg-white shadow rounded-md dark:bg-zink-600">
						<Modal.Header className="flex items-center justify-between p-4 border-b dark:border-zink-500"
						              closeButtonClass="transition-all duration-200 ease-linear text-slate-400 hover:text-red-500">
							<Modal.Title className="text-16">Detalles del Ticket</Modal.Title>
						</Modal.Header>
						<Modal.Body className="max-h-[calc(theme('height.screen')_-_180px)] p-4 overflow-y-auto">
							<form action="#!" onSubmit={(e) => {
								e.preventDefault();
								validation.handleSubmit();
								return false;
							}}>
								<div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
									{/* FOLIO */}
									<div className="xl:col-span-12">
										<label htmlFor="orderId" className="inline-block mb-2 text-base font-medium">Folio Ticket</label>
										<input type="text" id="orderId" className="form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200"
										       disabled value={validation.values.ticket_id || "SIN REGISTRO"} required />
									</div>
									{/* Client Name */}
									<div className="xl:col-span-6">
										<label htmlFor="customerNameInput" className="inline-block mb-2 text-base font-medium">Nombre de Cliente</label>
										<input type="text" id="customerNameInput" className="form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200"
										       placeholder="Cliente"
										       name="customerName"
										       disabled
										       value={validation.values.ticketCustomerName ?? validation.values.client.name + validation.values.client.last_name}
										/>
									</div>
									{/* Ternaria para saber si la ticket esta asociado a un cliente registrado*/}
									{ validation.values.client && Object.keys(validation.values.client).length > 0 ?
										<>
											<div className="xl:col-span-6">
												<label htmlFor="customerIdInput" className="inline-block mb-2 text-base font-medium">Identificador del Cliente</label>
												<input type="text" id="customerIdInput" className="form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200"
												       placeholder="Cliente id"
												       name="idClient"
												       disabled
												       value={validation.values.client.id ?? 'SIN REGISTRO'}
												/>
											</div>
											<div className="xl:col-span-6">
												<label htmlFor="customerEmailInput" className="inline-block mb-2 text-base font-medium">Correo Electrónico del Cliente</label>
												<input type="text" id="customerEmailInput" className="form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200"
												       placeholder="Correo Elctronico Cliente"
												       name="clientEmail"
												       disabled
												       value={validation.values.client.email ?? 'SIN REGISTRO'}
												/>
											</div>
											<div className="xl:col-span-6">
												<label htmlFor="customerPhoneInput" className="inline-block mb-2 text-base font-medium">Telefono del Cliente</label>
												<input type="text" id="customerPhoneInput" className="form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200"
												       placeholder="Telefono Cliente"
												       name="clientPhone"
												       disabled
												       value={validation.values.client.phone ?? 'SIN REGISTRO'}
												/>
											</div>
										</>
										: null
									}
									{/* Ticket Status */}
									<div className="xl:col-span-6">
										<label htmlFor="TicketStatus" className="inline-block mb-2 text-base font-medium">
											Estado del Ticket
										</label>
										<select
											name="ticket_status"
											id="TicketStatus"
											value={validation.values.ticket_status}
											onChange={validation.handleChange}
											className="form-select border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-700 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200"
										>
											<option value="pending">Por Autorizar</option>
											<option value="deleted">Cancelado</option>
											<option value="authorized">Autorizado</option>
										</select>
									</div>
									{/* Ticket Type */}
									<div className="xl:col-span-6">
										<label htmlFor="ticketType" className="inline-block mb-2 text-base font-medium">Tipo de Ticket</label>
										<input type="text" id="ticketType" className="form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200"
										       placeholder="Tipo de ticket"
										       name="ticketType"
										       disabled
										       value={validation.values.ticket_type === 'sale' ? 'VENTA' : 'COMPRA'}
										/>
									</div>
									{/* Ticket Creation Date */}
									<div className="xl:col-span-6">
										<label htmlFor="orderDateInput" className="inline-block mb-2 text-base font-medium">Fecha de Creación</label>
										<Flatpickr
											id="orderDateInput"
											disabled
											className="form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200"
											options={{
												dateFormat: "d M, Y"
											}}
											placeholder='Selecciona un fecha' name='orderDate'
											onChange={(date: any) => validation.setFieldValue("orderDate", moment(date[0]).format("DD MMMM ,YYYY"))}
											value={validation.values.ticket_date ? moment(validation.values.ticket_date).toDate() : ''}
										/>
										{validation.touched.orderDate && validation.errors.orderDate ? (
											<p className="text-red-400">{validation.errors.orderDate}</p>
										) : null}
									</div>
									
									{/* Responsable */}
									<div className="xl:col-span-6">
										<label htmlFor="responsableName" className="inline-block mb-2 text-base font-medium">Ticket Creador por</label>
										<input type="text" id="responsableName" className="form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200"
										       disabled value={validation.values.responsible.name || "SIN REGISTRO"} required />
									</div>
									
									{/* TERNARIA PARA CODIGOS DE DESCUENTO */}
									{ validation.values.discount_code  ?
										(
											<>
												{/* Discount Code */}
												<div className="xl:col-span-6">
													<label htmlFor="discount_code" className="inline-block mb-2 text-base font-medium">Código de Descuento</label>
													<input type="text" id="discount_code" className="form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200"
																 disabled value={validation.values.discount_code || "SIN REGISTRO"} required />
												</div>
												{/* Discount Amount */}
												<div className="xl:col-span-6">
													<label htmlFor="discount_total" className="inline-block mb-2 text-base font-medium">Total de Descuento</label>
													<input type="text" id="discount_total" className="form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200"
																 disabled value={ validation.values.discount_total ? "$ " + validation.values.discount_total : "SIN REGISTRO"} required />
												</div>
											</>
										):
										null
									}
									
									{/* SubTotal del Ticket */}
									<div className="xl:col-span-6">
										<label htmlFor="ticket_subtotal" className="inline-block mb-2 text-base font-medium">Subtotal del Ticket</label>
										<input type="text" id="ticket_subtotal" className="form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200"
										       disabled value={validation.values.ticket_subtotal ?  "$ " + validation.values.ticket_subtotal: "SIN REGISTRO"} required />
									</div>
									
									{/* Total del Ticket */}
									<div className="xl:col-span-6">
										<label htmlFor="ticket_total" className="inline-block mb-2 text-base font-medium">Total del Ticket</label>
										<input type="text" id="ticket_total" className="form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200"
										       disabled value={ validation.values.ticket_total ?  "$ " + validation.values.ticket_total : "SIN REGISTRO"} required />
									</div>
									
									<div className="card xl:col-span-12">
										<div className="card-body">
											<h6 className="mb-4 text-15">Productos asociados al Ticket</h6>
											
											<div className="overflow-x-auto">
												<table className="w-full">
													<thead className="ltr:text-left rtl:text-right ">
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
																<td className="px-3.5 py-2.5 border-y border-slate-200 dark:border-zink-500">
																	{product.type === 'wholesale' ? 'Mayoreo' : product.type === 'retail' ? 'Menudeo' : product.type || "N/A"}
																</td>
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
								<div className="flex justify-end gap-2 mt-4">
									<button type="reset" className="text-red-500 bg-white btn hover:text-red-500 hover:bg-red-100 focus:text-red-500 focus:bg-red-100 active:text-red-500 active:bg-red-100 dark:bg-zink-600 dark:hover:bg-red-500/10 dark:focus:bg-red-500/10 dark:active:bg-red-500/10"
									        onClick={toggle}>
										Cerrar
									</button>
									<button type="submit" className="text-white btn bg-custom-500 border-custom-500 hover:text-white hover:bg-custom-600 hover:border-custom-600 focus:text-white focus:bg-custom-600 focus:border-custom-600 focus:ring focus:ring-custom-100 active:text-white active:bg-custom-600 active:border-custom-600 active:ring active:ring-custom-100 dark:ring-custom-400/20">
										Actualizar
									</button>
								</div>
							</form>
						</Modal.Body>
					</Modal>
				</>
			)}
		
		
		
		
		
		</React.Fragment>
	);
};

export default Orders;