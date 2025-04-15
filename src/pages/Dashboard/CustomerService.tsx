import React from 'react';

import {UserRoundX } from 'lucide-react';

//import images
import avatar2 from "assets/images/users/avatar-2.png"

import {useSelector } from "react-redux";
import {createSelector} from "reselect";

const CustomerService = () => {
	const selectDataList = createSelector(
		(state: any) => state.TICKETManagment,
		(state) => ({
			clientsTickets : state.clientsTickets,
		})
	);
	
	const { clientsTickets } = useSelector(selectDataList);
	
	
	
	return (
		<React.Fragment>
			{/*<div className="col-span-12 card lg:col-span-6 2xl:col-span-3">*/}
			<div className="col-span-12 lg:col-span-6 order-[13] 2xl:order-1 card 2xl:col-span-3">
				<div className="card-body">
					<div className="flex items-center mb-3">
						<h6 className="grow text-15">Cliente más frecuente del mes</h6>
						{/*<h6 className="mt-4 mb-3">Cliente más frecuente del mes</h6>*/}
						{/*<Dropdown className="relative shrink-0">*/}
						{/*    <Dropdown.Trigger type="button" className="flex items-center justify-center size-[30px] p-0 bg-white text-slate-500 btn hover:text-slate-500 hover:bg-slate-100 focus:text-slate-500 focus:bg-slate-100 active:text-slate-500 active:bg-slate-100 dark:bg-zink-700 dark:hover:bg-slate-500/10 dark:focus:bg-slate-500/10 dark:active:bg-slate-500/10 dropdown-toggle"*/}
						{/*        id="customServiceDropdown" data-bs-toggle="dropdown">*/}
						{/*        <MoreVertical className="inline-block size-4"></MoreVertical>*/}
						{/*    </Dropdown.Trigger>*/}
						
						{/*    <Dropdown.Content placement="right-end" className="absolute z-50 py-2 mt-1 ltr:text-left rtl:text-right list-none bg-white rounded-md shadow-md dropdown-menu min-w-[10rem] dark:bg-zink-600" aria-labelledby="customServiceDropdown">*/}
						{/*        <li>*/}
						{/*            <Link className="block px-4 py-1.5 text-base transition-all duration-200 ease-linear text-slate-600 dropdown-item hover:bg-slate-100 hover:text-slate-500 focus:bg-slate-100 focus:text-slate-500 dark:text-zink-100 dark:hover:bg-zink-500 dark:hover:text-zink-200 dark:focus:bg-zink-500 dark:focus:text-zink-200"*/}
						{/*            to="#!">1 Semana</Link>*/}
						{/*        </li>*/}
						{/*    </Dropdown.Content>*/}
						{/*</Dropdown>*/}
					</div>
					
					{/*<div>*/}
					{/*    <div className="flex items-center justify-between mt-5 mb-2">*/}
					{/*        <p className="text-slate-500 dark:text-zink-200">54% de la meta alcanzada ($100k)</p>*/}
					{/*    </div>*/}
					{/*    <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-zink-600">*/}
					{/*        <div className="h-2 bg-green-500 rounded-full" style={{ width: "99%" }}></div>*/}
					{/*    </div>*/}
					{/*    <div className="grid mt-3 xl:grid-cols-2">*/}
					{/*        <div className="flex items-center gap-2">*/}
					{/*            <div className="shrink-0">*/}
					{/*                <CalendarDays className="inline-block size-4 mb-1 align-middle"></CalendarDays>*/}
					{/*            </div>*/}
					{/*            <p className="mb-0 text-slate-500 dark:text-zink-200">*/}
					{/*                Este mes:*/}
					{/*                <span className="font-medium text-slate-800 dark:text-zink-50"> $24,741</span>*/}
					{/*            </p>*/}
					{/*        </div>*/}
					{/*    </div>*/}
					{/*</div>*/}
					{clientsTickets.length > 0 ? (
						<>
							<div className="h-80 overflow-y-auto">
								<ul className="divide-y divide-slate-200 dark:divide-zink-500 flex flex-col gap-2">
									{clientsTickets && clientsTickets.map((entry: { client: any, count: number }, index: number) => (
										<li key={entry.client.id}
										    className="flex items-center gap-3 transition-colors duration-200 hover:bg-gray-100 dark:hover:bg-zinc-800 p-2 rounded-md"
											// className="flex items-center gap-3 py-2 first:pt-0 last:pb-0"
										>
											<div className="size-8 rounded-full shrink-0 bg-slate-100 dark:bg-zink-600">
												<img src={avatar2} alt="" className="size-8 rounded-full" />
											</div>
											<div className="grow">
												<h6 className="font-medium">{entry.client.name} {entry.client.last_name}</h6>
												<p className="text-slate-500 dark:text-zink-200">{entry.client.email || entry.client.phone}</p>
											</div>
											<div className="shrink-0">
												<h6>{entry.count} <span className="text-sm font-light ">Tickets</span> </h6>
											</div>
										</li>
									))}
								</ul>
							</div>
						</>
					) : (
						<>
							<div className="flex flex-col items-center justify-center p-8 bg-gray-50 dark:bg-gray-900 rounded-md shadow-md">
								<UserRoundX size={60} className="text-gray-400 dark:text-gray-300 mb-4" />
								<h3 className="text-xl font-semibold text-gray-700 dark:text-gray-100 mb-2">
									No hay datos disponibles
								</h3>
								<p className="text-gray-500 dark:text-gray-400 text-center max-w-md">
									Parece que no hay información para mostrar en este momento. Intenta refrescar la página o contacta a soporte si el problema persiste.
								</p>
							</div>
						</>
					)}
					
				
				</div>
			</div>
		</React.Fragment>
	);
};

export default CustomerService;
