import React, { useEffect, useMemo, useState } from "react";
import BreadCrumb from "Common/BreadCrumb";
import { Search } from 'lucide-react';

import TableContainer from "Common/TableContainer";

// react-redux
import { useDispatch, useSelector } from 'react-redux';
import { createSelector } from 'reselect';

import {
	getShopProductList as onGetProductList
} from 'slices/thunk';
import { ToastContainer } from "react-toastify";
import filterDataBySearch from "Common/filterDataBySearch";

const ProductViewOnly = () => {
	
	const dispatch = useDispatch<any>();
	
	const selectDataList = createSelector(
		(state: any) => state.MATERIALManagement,
		(state) => ({
			dataList: state.productList,
			loading: state.loading
		})
	);
	
	const { dataList, loading } = useSelector(selectDataList);
	
	const [data, setData] = useState<any[]>([]);
	
	// Get Data
	useEffect(() => {
		dispatch(onGetProductList());
	}, [dispatch]);
	
	useEffect(() => {
		setData(dataList);
	}, [dataList]);
	
	// Search Data
	const filterSearchData = (e: any) => {
		const search = e.target.value;
		const keysToSearch = ['material', 'wholesale_price_buy', 'retail_price_buy', 'wholesale_price_sell', 'retail_price_sell', 'existence'];
		filterDataBySearch(dataList, search, keysToSearch, setData);
	};
	
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
			header: "Precio Mayoreo Compra",
			accessorKey: "wholesale_price_buy",
			enableColumnFilter: false,
			cell: (cell: any) => (
				<span className="category px-2.5 py-0.5 text-xs inline-block font-medium rounded border bg-blue-100 border-blue-200 text-blue-600 dark:bg-blue-500/20 dark:border-blue-500/20 dark:text-blue-300">
					${parseFloat(cell.getValue()).toFixed(2)}
				</span>
			),
		},
		{
			header: "Precio Menudeo Compra",
			accessorKey: "retail_price_buy",
			enableColumnFilter: false,
			cell: (cell: any) => (
				<span className="category px-2.5 py-0.5 text-xs inline-block font-medium rounded border bg-green-100 border-green-200 text-green-600 dark:bg-green-500/20 dark:border-green-500/20 dark:text-green-300">
					${parseFloat(cell.getValue()).toFixed(2)}
				</span>
			),
		},
		{
			header: "Precio Mayoreo Venta",
			accessorKey: "wholesale_price_sell",
			enableColumnFilter: false,
			cell: (cell: any) => (
				<span className="category px-2.5 py-0.5 text-xs inline-block font-medium rounded border bg-purple-100 border-purple-200 text-purple-600 dark:bg-purple-500/20 dark:border-purple-500/20 dark:text-purple-300">
					${parseFloat(cell.getValue()).toFixed(2)}
				</span>
			),
		},
		{
			header: "Precio Menudeo Venta",
			accessorKey: "retail_price_sell",
			enableColumnFilter: false,
			cell: (cell: any) => (
				<span className="category px-2.5 py-0.5 text-xs inline-block font-medium rounded border bg-orange-100 border-orange-200 text-orange-600 dark:bg-orange-500/20 dark:border-orange-500/20 dark:text-orange-300">
					${parseFloat(cell.getValue()).toFixed(2)}
				</span>
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
					colorClass = "bg-yellow-100 border-transparent text-yellow-600 dark:bg-yellow-500/20";
				} else {
					colorClass = "bg-green-100 border-transparent text-green-500 dark:bg-green-500/20";
				}
				
				return (
					<span className={`px-2.5 py-0.5 text-xs inline-block font-medium rounded border ${colorClass}`}>
						{value.toFixed(2)} kg
					</span>
				);
			},
		}		
	], []);
	
	return (
		<React.Fragment>
			<BreadCrumb title='Consulta de Productos' pageTitle='Productos' />
			<ToastContainer closeButton={false} limit={1} />
			<div className="card" id="productViewTable">
				<div className="xl:col-span-2 lg:col-span-1 card-header p-4">
					<div className="w-full flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
						{/* Input de búsqueda */}
						<div className="w-full sm:w-auto sm:flex-1 max-w-md">
							<div className="relative">
								<input
									type="text"
									className="w-full ltr:pl-8 rtl:pr-8 search form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200"
									placeholder="Buscar productos..."
									autoComplete="off"
									onChange={(e) => filterSearchData(e)}
								/>
								<Search className="inline-block size-4 absolute ltr:left-2.5 rtl:right-2.5 top-2.5 text-slate-500 dark:text-zink-200 fill-slate-100 dark:fill-zink-600" />
							</div>
						</div>
						
						{/* Información adicional */}
						<div className="flex items-center gap-2 text-sm text-slate-500 dark:text-zink-300">
							<span>Total de productos: {data.length}</span>
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
									customPageSize={data.length > 10 ? 10 : data.length}
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
										<h5 className="mt-2 mb-1">No se encontraron productos</h5>
										<p className="mb-0 text-slate-500 dark:text-zink-200">No se encontraron productos que coincidan con tu búsqueda.</p>
									</div>
								</div>)
						)
					}
				</div>
			</div>
		</React.Fragment>
	);
};

export default ProductViewOnly;