import React, {useEffect, useState} from 'react';
import { WifiOff } from 'lucide-react';
import {createSelector} from "reselect";
import {useSelector } from "react-redux";
// import {getImage} from 'slices/thunk';


interface Props {
	[key: number] : { [key: string]: string };
}

const MonthlyCampaign = ( ) => {
	
	
	const selectDataList = createSelector(
		(state: any) => state.TICKETManagment,
		(state) => ({
			productsSaleCharts : state.productsSaleCharts,
			productImages : state.productImages
		})
	);
	
	const { productsSaleCharts , productImages} = useSelector(selectDataList);
	
	
	const [TicketType, setTicketType] = useState('sale');
	const months = [
	  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
	  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
	];
	const currentMonth = months[new Date().getMonth()];

	
	//
	
	return (
		<React.Fragment>
			<div className="col-span-12 lg:col-span-6 order-[13] 2xl:order-1 card 2xl:col-span-3">
				<div className="card-body">
					{TicketType === 'sale' ? (
						<div className="flex w-full items-center justify-between mb-4">
							<h6 className="mb-3 text-15 font-medium">Hisotorico de venta en {currentMonth}</h6>
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
							<h6 className="mb-3 text-15 font-medium">Hisotorico de compra en {currentMonth}</h6>
							<button
								onClick={() => setTicketType('sale')}
								type="button"
								className="bg-white border-dashed text-sky-500 btn border-sky-500 hover:text-sky-500 hover:bg-sky-50 hover:border-sky-600 focus:text-sky-600 focus:bg-sky-50 focus:border-sky-600 active:text-sky-600 active:bg-sky-50 active:border-sky-600 dark:bg-zink-700 dark:ring-sky-400/20 dark:hover:bg-sky-800/20 dark:focus:bg-sky-800/20 dark:active:bg-sky-800/20">
								<i className="align-baseline ltr:pr-1 rtl:pl-1 ri-refresh-line"></i>
								Venta
							</button>
						</div>
					)}
					<div className="h-80 overflow-y-auto">
						<ul className="flex flex-col gap-2">
							{productsSaleCharts &&
								productsSaleCharts[TicketType] &&
								Object.values(productsSaleCharts[TicketType]).map((product : any) => (
									<React.Fragment key={product.product_id}>
										<li
											className="flex items-center gap-3 transition-colors duration-200 hover:bg-gray-100 dark:hover:bg-zinc-800 p-2 rounded-md"
										>
											<div className="flex items-center justify-center size-8 text-red-500 bg-red-100 rounded-md dark:bg-red-500/20 shrink-0">
												{productImages[product.product_id] ? (
													<img
														className="size-10"
														src={
															productImages[product.product_id].img
													}
														alt={product.product_name || 'Producto'}
													/>
												) : (
													<WifiOff className="size-5" />
												)}
											</div>
											<h6 className="grow">{product.product_name}</h6>
											<div className="flex flex-col items-end whitespace-nowrap text-right">
												<p className="text-slate-500 dark:text-zink-200 text-sm">
													$ {product.totalAmount?.toFixed(2)}
												</p>
												<p className="text-green-500 text-sm">
													{product.totalWeight?.toFixed(2)} KG
												</p>
											</div>
										</li>
										<hr className="border-t border-gray-200 dark:border-zinc-700" />
									</React.Fragment>
								))}
						</ul>
					</div>
				</div>
			</div>
		</React.Fragment>
	);
};

export default MonthlyCampaign;
