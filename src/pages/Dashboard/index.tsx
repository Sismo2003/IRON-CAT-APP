import React, { useEffect } from 'react';
import BreadCrumb from 'Common/BreadCrumb';

import Widgets from './Widgets';
import OrderStatistics from './OrderStatistics';
import MonthlyCampaign from './MonthlyCampaign';
import Subscription from './Subscription';
import CustomerService from './CustomerService';
import Audience from './Audience';

import DistributedChart  from './TicketsDistributed';


import { useNavigate } from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import { getTicket as getTickets } from 'slices/thunk';

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
		})
	);
	
	const { loading } = useSelector(selectDataList);
	
	
	return (
		
		<React.Fragment>
			<div className="relative">
				<BreadCrumb title='Administración' pageTitle='Dashboards' />
				{loading ? (
					<>
						{/* Spinner overlay */}
						<div className="absolute -mx-4 inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
							<div className="w-8 h-8 border-2 rounded-full animate-spin border-l-transparent border-custom-500"></div>
						</div>
					</>
				) : null}
				{/* Contenido principal */}
				<div className="grid grid-cols-11 gap-x-5">
					{/* Cards */}
					<Widgets />
					{/* Estados de tickets */}
					<OrderStatistics />
					<DistributedChart chartId="distributedChart" />
					{/* Top 5 productos mas vendidos */}
					<MonthlyCampaign />
					{/* Mejores Clientes */}
					<CustomerService />
					{/* Tickets por día (venta y compra) */}
					<Audience />
					{/* Productos gráfico pie */}
					<Subscription />
				</div>
				
				
			</div>
		</React.Fragment>
	);
};

export default DashboardIronCat;