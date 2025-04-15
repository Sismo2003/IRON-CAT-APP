import React, {useState} from 'react'
import ReactApexChart from 'react-apexcharts'

import {BookDashed } from 'lucide-react'

import {createSelector} from "reselect";
import {useSelector} from "react-redux";


const DistributedChart = ({ chartId }: any) => {
	
	const selectDataList = createSelector(
		(state: any) => state.TICKETManagment,
		(state) => ({
			productsSaleCharts : state.productsSaleCharts,
			loading : state.loading,
		})
	);
	
	const {  productsSaleCharts,loading } = useSelector(selectDataList);
	const [TicketType, setTicketType] = useState('sale')
	
	
	
	// console.log("errror: ",productsSaleCharts);
	let series;
	let type;
	let options : any;
	
	if(!loading && productsSaleCharts.length > 0){
		TicketType === 'sale' ? type = productsSaleCharts?.sale : type = productsSaleCharts?.shop ;
		
		
		if(Object.keys(type).length > 0){
		  series = [{
		      data: Object.values(type).map((product: any) => ({
		          x: product.product_name,
		          y: product.totalWeight
		      }))
		  }];
			
			options = {
				legend: {
					show: false
				},
				chart: {
					height: 350,
					type: 'treemap'
				},
				title: {
					text: TicketType === 'sale' ? 'Total en kilogramos de venta de cada producto' : 'Total en kilogramos de compra de cada producto',
					align: 'center'
				},
				colors: [
					'#3B93A5',
					'#F7B844',
					'#ADD8C7',
					'#EC3C65',
					'#CDD7B6',
					'#C1F666',
					'#D43F97',
					'#1E5D8C',
					'#421243',
					'#7F94B0',
					'#EF6537',
					'#C0ADDB'
				],
				plotOptions: {
					treemap: {
						distributed: true,
						enableShades: false
					}
				}
			};
		}
	}
	
	return (
		<React.Fragment>
			<div className="col-span-12 card 2xl:col-span-12">
				<div className="card-body p-0">
					{!loading ? (
						Object.keys(
							TicketType === 'sale'
								? (productsSaleCharts?.sale || {})
								: (productsSaleCharts?.shop || {})
						).length > 0 ? (
							<>
								{TicketType === 'sale' ? (
									<div className="flex w-full items-center justify-between mb-4">
										{/*<h6 className="mb-3 text-15 font-medium">Venta de productos</h6>*/}
										<button
											onClick={() => setTicketType('shop')}
											type="button"
											className="bg-white border-dashed text-sky-500 btn border-sky-500 hover:text-sky-500 hover:bg-sky-50 hover:border-sky-600 focus:text-sky-600 focus:bg-sky-50 focus:border-sky-600 active:text-sky-600 active:bg-sky-50 active:border-sky-600 dark:bg-zink-700 dark:ring-sky-400/20 dark:hover:bg-sky-800/20 dark:focus:bg-sky-800/20 dark:active:bg-sky-800/20">
											<i className="align-baseline ltr:pr-1 rtl:pl-1 ri-refresh-line"></i>
											Compra
										</button>
									</div>
								) : (
									<div className="flex w-full items-center justify-between mb-4">
										{/*<h6 className="mb-3 text-15 font-medium">Compra de productos</h6>*/}
										<button
											onClick={() => setTicketType('sale')}
											type="button"
											className="bg-white border-dashed text-sky-500 btn border-sky-500 hover:text-sky-500 hover:bg-sky-50 hover:border-sky-600 focus:text-sky-600 focus:bg-sky-50 focus:border-sky-600 active:text-sky-600 active:bg-sky-50 active:border-sky-600 dark:bg-zink-700 dark:ring-sky-400/20 dark:hover:bg-sky-800/20 dark:focus:bg-sky-800/20 dark:active:bg-sky-800/20">
											<i className="align-baseline ltr:pr-1 rtl:pl-1 ri-refresh-line"></i>
											Venta
										</button>
									</div>
								)}
								<ReactApexChart
									dir="ltr"
									options={options}
									series={series || []}
									id={chartId}
									className="apex-charts"
									height={350}
									type="treemap"
								/>
							</>
						) : (
							<div className="flex flex-col items-center justify-center p-4">
								<BookDashed size={50} className="mb-2" />
								<span className="text-center">Sin Datos Registrados. Intenté cargar la pagina o contacta a tu soporte.</span>
							</div>
						)
					) : null}
				</div>
			</div>
		</React.Fragment>
	);
	
}

export default DistributedChart