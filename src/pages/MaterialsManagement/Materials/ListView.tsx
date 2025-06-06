import React, { useEffect, useMemo, useState } from "react";
import BreadCrumb from "Common/BreadCrumb";
// import Flatpickr from 'react-flatpickr';
import { Link } from "react-router-dom";
import { Dropdown } from "Common/Components/Dropdown";

// Icon
import { MoreHorizontal, /*Eye,*/ FileEdit, Trash2, Search, Plus, Download } from 'lucide-react';

import TableContainer from "Common/TableContainer";
import DeleteModal from "Common/DeleteModal";

// react-redux
import { useDispatch, useSelector } from 'react-redux';
import { createSelector } from 'reselect';

import {
	getShopProductList as onGetProductList,
	deleteShopProductList as onDeleteProductList
} from 'slices/thunk';
import { ToastContainer } from "react-toastify";
import filterDataBySearch from "Common/filterDataBySearch";

import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';


const ListView = () => {
	
	const dispatch = useDispatch<any>();
	
	const selectDataList = createSelector(
		(state: any) => state.MATERIALManagement,
		(state) => ({
			dataList: state.productList,
			loading: state.loading
		})
	);
	
	const { dataList, loading } = useSelector(selectDataList);
	
	// const [data, setData] = useState<any>([]);
	const [data, setData] = useState<any[]>([]);
	const [eventData, setEventData] = useState<any>();
	
	// console.log("data: ", data);
	
	// Get Data
	useEffect(() => {
		dispatch(onGetProductList());
	}, [dispatch]);
	
	useEffect(() => {
		setData(dataList);
	}, [dataList]);
	
	// Delete Modal
	const [deleteModal, setDeleteModal] = useState<boolean>(false);
	const deleteToggle = () => setDeleteModal(!deleteModal);
	
	// Delete Data
	const onClickDelete = (cell: any) => {
		setDeleteModal(true);
		if (cell.id) {
			setEventData(cell);
		}
	};
	
	const handleDelete = () => {
		if (eventData) {
			dispatch(onDeleteProductList(eventData.id));
			setDeleteModal(false);
		}
	};
	
	// Search Data
	const filterSearchData = (e: any) => {
		const search = e.target.value;
		const keysToSearch = ['material', 'wholesale_price', 'retail_price', 'existence'];
		filterDataBySearch(dataList, search, keysToSearch, setData);
	};
	
	// const Status = ({ item }: any) => {
	//     switch (item) {
	//         case "Publish":
	//             return (<span className="status px-2.5 py-0.5 inline-block text-xs font-medium rounded border bg-green-100 border-transparent text-green-500 dark:bg-green-500/20 dark:border-transparent">{item}</span>);
	//         case "Scheduled":
	//             return (<span className="status px-2.5 py-0.5 inline-block text-xs font-medium rounded border bg-orange-100 border-transparent text-orange-500 dark:bg-orange-500/20 dark:border-transparent">{item}</span>);
	//         case "Inactive":
	//             return (<span className="status px-2.5 py-0.5 inline-block text-xs font-medium rounded border bg-red-100 border-transparent text-red-500 dark:bg-red-500/20 dark:border-transparent">{item}</span>);
	//         default:
	//             return (<span className="status px-2.5 py-0.5 inline-block text-xs font-medium rounded border bg-green-100 border-transparent text-green-500 dark:bg-green-500/20 dark:border-transparent">{item}</span>);
	//     }
	// };
	
	const columns = useMemo(() => [
			{
				header: "Nombre del Material",
				accessorKey: "material",
				enableColumnFilter: false,
				enableSorting: true,
				cell: (cell: any) => (
					<span className="flex items-center gap-2">
                    <img src={cell.row.original.img} alt="Product images" className="h-6" />
                    <h6 className="product_name">{cell.getValue()}</h6>
                </span>
				),
			},
			{
				header: "Precio Mayoreo en Compra",
				accessorKey: "wholesale_price_buy",
				enableColumnFilter: false,
				cell: (cell: any) => (
					<span className="category px-2.5 py-0.5 text-xs inline-block font-medium rounded border bg-slate-100 border-slate-200 text-slate-500 dark:bg-slate-500/20 dark:border-slate-500/20 dark:text-zink-200">{cell.getValue()}</span>
				),
			},
			{
				header: "Precio Menudeo en Compra",
				accessorKey: "retail_price_buy",
				enableColumnFilter: false,
				cell: (cell: any) => (
					<span className="category px-2.5 py-0.5 text-xs inline-block font-medium rounded border bg-slate-100 border-slate-200 text-slate-500 dark:bg-slate-500/20 dark:border-slate-500/20 dark:text-zink-200">{cell.getValue()}</span>
				),
			},
			{
				header: "Precio Mayoreo en Venta",
				accessorKey: "wholesale_price_sell",
				enableColumnFilter: false,
				cell: (cell: any) => (
					<span className="category px-2.5 py-0.5 text-xs inline-block font-medium rounded border bg-slate-100 border-slate-200 text-slate-500 dark:bg-slate-500/20 dark:border-slate-500/20 dark:text-zink-200">{cell.getValue()}</span>
				),
			},
			{
				header: "Precio Menudeo en Venta",
				accessorKey: "retail_price_sell",
				enableColumnFilter: false,
				cell: (cell: any) => (
					<span className="category px-2.5 py-0.5 text-xs inline-block font-medium rounded border bg-slate-100 border-slate-200 text-slate-500 dark:bg-slate-500/20 dark:border-slate-500/20 dark:text-zink-200">{cell.getValue()}</span>
				),
			},
			{
				header: "Existencia (kg)",
				accessorKey: "existence",
				enableColumnFilter: false,
				cell: (cell: any) => {
					const value = parseFloat(cell.getValue());
					let colorClass = "";
					
					if (value < 0) {
						colorClass = "bg-red-100 border-transparent text-red-500 dark:bg-red-500/20";
					} else if (value >= 0 && value < 50) {
						colorClass = "bg-blue-100 border-transparent text-blue-500 dark:bg-blue-500/20";
					} else {
						colorClass = "bg-green-100 border-transparent text-green-500 dark:bg-green-500/20";
					}
					
					return (
						<span className={`px-2.5 py-0.5 text-xs inline-block font-medium rounded border ${colorClass}`}>
                        {value.toFixed(2)}
                    </span>
					);
				},
			},
			{
				header: "Acciones",
				enableColumnFilter: false,
				enableSorting: true,
				cell: (cell: any) => (
					<div className="flex gap-1">
						{/* Botón de Editar */}
						<Link
							to="/apps-materials-product-create"
							state={{ mode: "edit", data: cell.row.original }}
							title="Editar"
							className="flex items-center justify-center size-[30px] p-0 text-slate-500 btn bg-slate-100 hover:text-white hover:bg-blue-600 focus:text-white focus:bg-blue-600 focus:ring focus:ring-blue-100 active:text-white active:bg-blue-600 active:ring active:ring-blue-100 dark:bg-blue-500/20 dark:text-blue-400 dark:hover:bg-blue-500 dark:hover:text-white dark:focus:bg-blue-500 dark:focus:text-white dark:active:bg-blue-500 dark:active:text-white dark:ring-blue-400/20">
							<FileEdit className="size-3" />
						</Link>
			
						{/* Botón de Borrar */}
						<button
							onClick={() => {
								const data = cell.row.original;
								onClickDelete(data);
							}}
							title="Borrar"
							className="flex items-center justify-center size-[30px] p-0 text-slate-500 btn bg-slate-100 hover:text-white hover:bg-red-600 focus:text-white focus:bg-red-600 focus:ring focus:ring-red-100 active:text-white active:bg-red-600 active:ring active:ring-red-100 dark:bg-red-500/20 dark:text-red-400 dark:hover:bg-red-500 dark:hover:text-white dark:focus:bg-red-500 dark:focus:text-white dark:active:bg-red-500 dark:active:text-white dark:ring-red-400/20" >
							<Trash2 className="size-3" />
						</button>
					</div>
				),
			}			
		], []
	);
	
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
		
		// console.log("Cols: ",exportCols);
		
		// 2) Build the header and data rows
		const headerRow = exportCols.map(c => c.header).concat('Estado');
		
	
		const dataRows = data.map((row: any) => {
			const values = exportCols.map(c => row[c.accessorKey] ?? '');
			const estado = row.deleted === 0 ? 'Activo' : 'Inactivo';
			return [...values, estado];
		});
		
		// console.log("DataRows: ",dataRows);
		
		const wsData = [headerRow, ...dataRows];

		// 3) SheetJS boilerplate
		const ws = XLSX.utils.aoa_to_sheet(wsData);
		const wb = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(wb, ws, 'Productos');
		const buf = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
		const date = new Date();
		const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
		// console.log(formattedDate);
		saveAs(new Blob([buf], { type: 'application/octet-stream' }), 'REPORTE DE PRODUCTOS [' +formattedDate + '].xlsx');
	};
	
	return (
		<React.Fragment>
			<BreadCrumb title='Lista Productos' pageTitle='Productos' />
			<DeleteModal show={deleteModal} onHide={deleteToggle} onDelete={handleDelete} />
			<ToastContainer closeButton={false} limit={1} />
			<div className="card" id="productListTable">
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
									onChange={(e) => filterSearchData(e)}
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
							
							<Link to="/apps-materials-product-create" type="button" className="whitespace-nowrap flex items-center justify-center gap-2 text-white btn bg-custom-500 border-custom-500 hover:text-white hover:bg-custom-600 hover:border-custom-600 focus:text-white focus:bg-custom-600 focus:border-custom-600 focus:ring focus:ring-custom-100 active:text-white active:bg-custom-600 active:border-custom-600 active:ring active:ring-custom-100 dark:ring-custom-400/20">
								<Plus className="inline-block size-4" />
								<span className="align-middle">Añadir Material</span>
							</Link>
						</div>
					</div>
				</div>
				<div className="!pt-1 card-body">
					{
						loading ? (
							// Spinner de carga
							<div className="flex justify-center py-6">
								<div className="w-10 h-10 border-4 border-blue-500 border-solid rounded-full animate-spin border-t-transparent"></div>
							</div>
						) : (
							data && data.length > 0 ?
								<TableContainer
									isPagination={true}
									columns={(columns || [])}
									data={(data || [])}
									customPageSize={data.length > 7 ? 7 : data.length}
									divclassName="overflow-x-auto"
									tableclassName="w-full whitespace-nowrap"
									theadclassName="ltr:text-left rtl:text-right bg-slate-100 dark:bg-zink-600"
									thclassName="px-3.5 py-2.5 font-semibold border-b border-slate-200 dark:border-zink-500"
									tdclassName="px-3.5 py-2.5 border-y border-slate-200 dark:border-zink-500"
									PaginationClassName="flex flex-col items-center gap-4 px-4 mt-4 md:flex-row"
								/>
								:
								(<div className="noresult">
									<div className="py-6 text-center">
										<Search className="size-6 mx-auto mb-3 text-sky-500 fill-sky-100 dark:fill-sky-500/20" />
										<h5 className="mt-2 mb-1">Sorry! No Result Found</h5>
										<p className="mb-0 text-slate-500 dark:text-zink-200">We've searched more than 199+ product We did not find any product for you search.</p>
									</div>
								</div>)
						)
					}
				</div>
			</div>
		</React.Fragment>
	);
};

export default ListView;