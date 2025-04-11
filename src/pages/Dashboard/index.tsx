import React, { useEffect } from 'react';
import BreadCrumb from 'Common/BreadCrumb';

import Widgets from './Widgets';
import OrderStatistics from './OrderStatistics';
import MonthlyCampaign from './MonthlyCampaign';
import CustomerService from './CustomerService';
import Audience from './Audience';

import DistributedChart  from './TicketsDistributed';


import { useNavigate } from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import {
	getTicket as getTickets,
	getImage
} from 'slices/thunk';

import {createSelector} from "reselect";

const DashboardIronCat = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch<any>(); // Usamos any para evitar problemas de tipado
	
	useEffect(() => {
		// Navega al dashboard
		navigate("/dashboard");
	}, [navigate]);
	
	useEffect(() => {
		// Centralizamos la llamada a getTickets aquí, sin necesidad de store.ts
		dispatch(getTickets());
	}, [dispatch]);
	
	const selectDataList = createSelector(
		(state: any) => state.TICKETManagment,
		(state) => ({
			loading : state.loading,
			productsSaleCharts : state.productsSaleCharts,
			productImages : state.productImages,
		})
	);
	
	const { loading, productImages, productsSaleCharts } = useSelector(selectDataList);
	
	
	const fetchedImages = React.useRef<Set<number>>(new Set());
	
	useEffect(() => {
		if (productsSaleCharts) {
			Object.entries(productsSaleCharts).forEach(([ticketType, products]) => {
				Object.values(products as Record<string, any>).forEach((product: any) => {
					if (!productImages[product.product_id] && !fetchedImages.current.has(product.product_id)) {
						fetchedImages.current.add(product.product_id);
						dispatch(getImage(product.product_id));
					}
				});
			});
		}
	}, [productsSaleCharts, dispatch]);
	
	return (
		<React.Fragment>
				{loading ? (
					<>
						{/* Spinner overlay */}
							<div className="absolute -mx-4 inset-0 flex items-center justify-center">
								<div className="w-8 h-8 border-2 rounded-full animate-spin border-l-transparent border-custom-500"></div>
							</div>
					</>
				) : (
					<>
						<BreadCrumb title='Administración' pageTitle='Dashboards' />
						{/* Contenido principal */}
						<div className="grid grid-cols-11 gap-x-5">
							{/* Cards */}
							<Widgets />
							{/* Estados de tickets */}
							<OrderStatistics />
							
							
							<DistributedChart chartId="distributedChart" />
							
							{/* Tickets por día (venta y compra) */}
							<Audience />
							
							{/* Top 5 productos mas vendidos */}
							<MonthlyCampaign  />
							{/* Mejores Clientes */}
							<CustomerService />
							
							
						</div>
					</>
				)
			}
			
			
			
		</React.Fragment>
	);
};

export default DashboardIronCat;