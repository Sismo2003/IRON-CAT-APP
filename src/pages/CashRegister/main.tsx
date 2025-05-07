import React, { useState, useRef } from 'react';
import BreadCrumb from 'Common/BreadCrumb';
import Modal from "Common/Components/Modal";

import {useDispatch, useSelector} from 'react-redux';
import { createSelector } from 'reselect';


import {
	lookTicket,
	updateStatus,
	deleteTicket
} from 'slices/thunk';

// Icon
import {
	TicketX,
	TicketCheck,
	Ticket,
	ScanSearch,
	TicketPercent,
	ClipboardList
} from 'lucide-react';

import {toast, ToastContainer} from "react-toastify";


const Checkout = () => {
	
	const dispatch  = useDispatch<any>();
	const selectTicket = createSelector(
		(state:any) => state.TICKETManagment,
		(state) => ({
			ticketList: state.ticketByid,
			loading: state.loading,
		})
	);
	const { ticketList, loading } = useSelector(selectTicket);
	
	console.log(ticketList);
	function handle_ticket(event: React.FormEvent) {
		event.preventDefault(); // Evita que se recargue la página
		const input = document.getElementById('idToFind') as HTMLInputElement;
		const id = input?.value?.trim();
		
		if (!id) {
			toast.error("Porfavor ingresa un folio a buscar!", { autoClose: 2000 });
			return;
		}
		dispatch(lookTicket(id));
	}
	
	function delelteTicket(id : number) {
		if(!id || id === null){
			console.log(id);
			toast.info("Es necesario el Folio del ticket!");
			return;
		}
		dispatch(deleteTicket(id));
	}
	
	// defaultModal2
	const [defaultModal2, setDefaultModal2] = useState<boolean>(false);
	const default2Toggle = () => setDefaultModal2(!defaultModal2);
	
	const [paymentReceived, setPaymentReceived] = useState<number | null>(null);
	const paymentInputRef = useRef<HTMLInputElement>(null);
	
	interface pendingStateUpdateFormat {
		id : number,
		onStatus : string
	}
	const [pendingUpdate, setPendingUpdate] = useState<pendingStateUpdateFormat>();
	
	const handlePayment = () => {
	  if (paymentInputRef.current) {
			
			
	    const valueStr = paymentInputRef.current.value;
	    const value = parseFloat(valueStr.replace(/[^0-9.]/g, ''));
			if(Number(ticketList?.data?.ticket?.[0]?.total) <= value) setPaymentReceived(value);
			else{
				toast.info('El pago del cliente no puede ser menor a la cantidad a pagar!', { autoClose: 2000 });
			}
	  }
	};
	
	
	function TicketUpdateStatus(id:number, status :string, type : string){
		if(!id || id === null){
			console.log(id);
			toast.info("Es necesario el Folio del ticket!");
			return;
		}
		if(!status || status === ""){
			toast.info("Es necesario el status del ticket!");
			return;
		}
		
		if((type === 'sale' || type === 'venta' ) && (status === 'authorized' || status === 'autorizado')  ) {
			setPaymentReceived(null);
			setPendingUpdate({id : id, onStatus : status  })
			default2Toggle();
			return; // Detenemos la ejecución para abrir el modal
		}
		
		dispatch(updateStatus({id, onStatus: status}));
	}
	
	const handleModalAccept = () => {
		if (pendingUpdate) {
			dispatch(updateStatus({ id: pendingUpdate.id, onStatus: pendingUpdate.onStatus }));
			setPendingUpdate({id : -1 , onStatus : ''});
			default2Toggle(); // Cierra el modal
		}
	};
	
	return (
		<React.Fragment>
			{loading ? (<>
				{/* Spinner overlay */}
				<div className="absolute -mx-4 inset-0 flex items-center justify-center">
					<div className="w-8 h-8 border-2 rounded-full animate-spin border-l-transparent border-custom-500"></div>
				</div>
			</>) : (<>
				<BreadCrumb title='Caja Registradora' pageTitle='Punto de venta' />
				<ToastContainer closeButton={false} limit={1} />
				<div className="grid grid-cols-1 xl:grid-cols-12 gap-x-5">
					
					<div className={ticketList.data ? 'xl:col-span-8' : 'xl:col-span-8'}>
						{/* Bloque del buscador de ticket */}
						<div className={ticketList.data ? 'xl:col-span-8' : 'xl:col-span-8'} >
							<div className="card">
								<div className="card-body">
									<h6 className="mb-4 text-15">Pantalla de Cobro</h6>
									<form onSubmit={(event) => handle_ticket(event)}>
										<div className="grid grid-cols-1 gap-5 xl:grid-cols-12">
											<div className="xl:col-span-12">
												<label htmlFor="idToFind" className="inline-block mb-2 text-base font-medium">Folio de Ticket</label>
												<input type="text" pattern="\d*" maxLength={16} id="idToFind" className="form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200"
												       placeholder="Identificador del Ticket"
												/>
											</div>
										</div>
										<div className="flex items-center justify-end gap-3 my-5 ">
											<div className="shrink-0">
												<button
													type="submit"
													className="text-purple-500 bg-purple-100 btn hover:text-white hover:bg-purple-600 focus:text-white focus:bg-purple-600 focus:ring focus:ring-purple-100 active:text-white active:bg-purple-600 active:ring active:ring-purple-100 dark:bg-purple-500/20 dark:text-purple-500 dark:hover:bg-purple-500 dark:hover:text-white dark:focus:bg-purple-500 dark:focus:text-white dark:active:bg-purple-500 dark:active:text-white dark:ring-purple-400/20"
												>
													<span className="align-middle">Buscar Ticket</span>
													<ScanSearch className="inline-block size-4 align-middle ltr:ml-1 rtl:mr-1 rtl:rotate-180" />
												</button>
											</div>
										</div>
									</form>
								</div>
							</div>
						</div>
						
						{/* Desglose de productos */}
						{ticketList?.data && ticketList?.success && (
							<div className="xl:col-span-8">
								{/*  Order summary       */}
								<div className="card">
									<div className="card-body">
										<div className="flex items-center gap-3 mb-4">
											<h6 className="text-15 grow">Resumen Ticket</h6>
											<button onClick={() => delelteTicket(ticketList.data.ticket[0].id)} className="text-red-500 underline shrink-0">
												Eliminar Ticket
											</button>
										</div>
										<div className="overflow-x-auto">
											<table className="w-full">
												<tbody>
												{/* ITERACION DE PRODUCTOS  */}
												{Array.isArray(ticketList.data.products_ticket) && ticketList.data.products_ticket.map((item: any, index: number) => (
													<tr key={index}>
														<td className="px-3.5 py-4 border-b border-dashed first:pl-0 last:pr-0 border-slate-200 dark:border-zink-500">
															<div className="flex items-center gap-3">
																<div className="flex items-center justify-center size-12 rounded-md bg-slate-100 shrink-0">
																	<img src={item.img} alt="Imagen del producto!" className="h-8" />
																</div>
																<div className="grow">
																	<h6 className="mb-1 text-15">
																		{item.material}
																	</h6>
																	<p className="text-slate-500 dark:text-zink-200">
																		Peso: <span className="font-semibold text-green-500">{item.weight ? (Number(item.weight) + Number(item.waste)).toFixed(2) : 0.00}</span> <span className="text-xs text-gray-400">kg</span>
																	</p>
																	<p className="text-slate-500 dark:text-zink-200">
																		Merma: <span className="font-semibold text-green-500">{item.waste ? item.waste : 0.00}</span> <span className="text-xs text-gray-400">kg</span>
																	</p>
																	<p className="text-slate-500 dark:text-zink-200">
																		Precio <span className="text-xs text-gray-400">(1/kg)</span>: <span className="font-semibold text-green-500">$ {item.unit_price}</span>
																	</p>
																	<p className="text-slate-500 dark:text-zink-200">
																		Canal de venta/compra: <span className="font-semibold text-green-500">{item.type === 'wholesale' ? 'Mayoreo' : 'Menudeo'}</span>
																	</p>
																</div>
															</div>
														</td>
														<td className="px-3.5 py-4 border-b border-dashed first:pl-0 last:pr-0 border-slate-200 dark:border-zink-500 ltr:text-right rtl:text-left">
															${ item.total ?? 'N/A'}
														</td>
													</tr>
												))}
												
												<tr>
													<td className="px-3.5 py-3 first:pl-0 last:pr-0 text-slate-500 dark:text-zink-200">
														Total de Productos
													</td>
													<td className="px-3.5 py-3 first:pl-0 last:pr-0 ltr:text-right rtl:text-left">{ticketList.data.products_ticket.length } </td>
												</tr>
												<tr className="font-semibold">
													<td className="px-3.5 pt-3 first:pl-0 last:pr-0 text-slate-500 dark:text-zink-200">
														Total
													</td>
													<td className="px-3.5 pt-3 first:pl-0 last:pr-0 ltr:text-right rtl:text-left">$ {ticketList?.data?.ticket?.[0]?.total ?? 'N/A'}</td>
												</tr>
												</tbody>
											</table>
										</div>
									</div>
								</div>
								{/*  Buttoms */}
								<div className="flex  items-center justify-end gap-3 mb-5">
									<div className="shrink-0">
										{ticketList.data.ticket[0].status !== 'deleted' ? (
											<button
												type="button"
												onClick={() => TicketUpdateStatus(ticketList?.data?.ticket[0]?.id, 'deleted', ticketList?.data?.ticket[0].type)}
												className="text-red-500 bg-red-100 btn hover:text-white hover:bg-red-600 focus:text-white focus:bg-red-600 focus:ring focus:ring-red-100 active:text-white active:bg-red-600 active:ring active:ring-red-100 dark:bg-red-500/20 dark:text-red-500 dark:hover:bg-red-500 dark:hover:text-white dark:focus:bg-red-500 dark:focus:text-white dark:active:bg-red-500 dark:active:text-white dark:ring-red-400/20"
											>
												<span className="align-middle">Cancelar Ticket</span>
												<TicketX className="inline-block size-4 align-middle ltr:ml-1 rtl:mr-1 rtl:rotate-180" />
											</button>
										) : (
											<button
												type="button"
												onClick={() => TicketUpdateStatus(ticketList?.data?.ticket[0]?.id, 'pending', ticketList?.data?.ticket[0].type)}
												className="text-yellow-500 bg-yellow-100 btn hover:text-white hover:bg-yellow-600 focus:text-white focus:bg-yellow-600 focus:ring focus:ring-yellow-100 active:text-white active:bg-yellow-600 active:ring active:ring-yellow-100 dark:bg-yellow-500/20 dark:text-yellow-500 dark:hover:bg-yellow-500 dark:hover:text-white dark:focus:bg-yellow-500 dark:focus:text-white dark:active:bg-yellow-500 dark:active:text-white dark:ring-yellow-400/20"
											>
												<span className="align-middle">Ticket Pendiente</span>
												<TicketPercent  className="inline-block size-4 align-middle ltr:ml-1 rtl:mr-1 rtl:rotate-180" />
											</button>
										)}
									
									</div>
									<div className="shrink-0">
										{ticketList.data.ticket[0].status !== 'authorized' ? (
											<button
												
												type="button"
												onClick={() => TicketUpdateStatus(ticketList?.data?.ticket[0]?.id, 'authorized', ticketList?.data?.ticket[0].type)}
												className="text-green-500 bg-green-100 btn hover:text-white hover:bg-green-600 focus:text-white focus:bg-green-600 focus:ring focus:ring-green-100 active:text-white active:bg-green-600 active:ring active:ring-green-100 dark:bg-green-500/20 dark:text-green-400 dark:hover:bg-green-500 dark:hover:text-white dark:focus:bg-green-500 dark:focus:text-white dark:active:bg-green-500 dark:active:text-white dark:ring-green-400/20"
											>
												<span className="align-middle">Marcar como pagado</span>
												<TicketCheck className="inline-block size-4 align-middle ltr:ml-1 rtl:mr-1 rtl:rotate-180" />
											</button>
										) : (
											<button
												type="button"
												onClick={() => TicketUpdateStatus(ticketList?.data?.ticket[0]?.id, 'pending', ticketList?.data?.ticket[0].type)}
												className="text-yellow-500 bg-yellow-100 btn hover:text-white hover:bg-yellow-600 focus:text-white focus:bg-yellow-600 focus:ring focus:ring-yellow-100 active:text-white active:bg-yellow-600 active:ring active:ring-yellow-100 dark:bg-yellow-500/20 dark:text-yellow-500 dark:hover:bg-yellow-500 dark:hover:text-white dark:focus:bg-yellow-500 dark:focus:text-white dark:active:bg-yellow-500 dark:active:text-white dark:ring-yellow-400/20"
											>
												<span className="align-middle">Ticket Pendiente</span>
												<TicketPercent  className="inline-block size-4 align-middle ltr:ml-1 rtl:mr-1 rtl:rotate-180" />
											</button>
										)}
									</div>
								</div>
							</div>
						)}
					</div>
					
					{/* Desglose de la informacion del ticket y cliente */}
					<div className="xl:col-span-4 sticky card top-0 max-h-screen overflow-y-auto">
						<div className="card-body space-y-3">
							<div className="flex items-center justify-between">
								<h3 className="text-lg font-bold uppercase text-slate-700 dark:text-zink-200">
									Información del Ticket
								</h3>
								<div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-md dark:bg-green-500/20">
									<Ticket className="w-6 h-6 text-green-500 fill-green-100 dark:fill-green-500/30" />
								</div>
							</div>
							{ticketList?.data && ticketList?.success  ? (
								<>
									{/* Folio */}
									<div className="border-b border-slate-200 dark:border-zink-500 pb-2">
										<p className="text-xs font-bold uppercase text-slate-700 dark:text-zink-200">Folio</p>
										<p className="text-base text-slate-500 dark:text-zink-200">
											{ticketList.data.ticket[0].id}
										</p>
									</div>
									
									{/* Estatus del Ticket */}
									<div className="border-b border-slate-200 dark:border-zink-500 pb-2">
										<p className="text-xs font-bold uppercase text-slate-700 dark:text-zink-200">Estatus del Ticket</p>
										<p className="text-base">
											{(() => {
												switch(ticketList.data.ticket[0].status) {
													case "Por autorizar":
													case "pending":
														return (<span className="px-2.5 py-0.5 text-xs font-medium rounded border bg-yellow-100 border-yellow-200 text-yellow-500 dark:bg-yellow-500/20 dark:border-yellow-500/20 uppercase">Por pagar</span>
														);
													case "Cancelados":
													case "deleted":
														return (
															<span className="px-2.5 py-0.5 text-xs font-medium rounded border bg-red-100 border-red-200 text-red-500 dark:bg-red-500/20 dark:border-red-500/20 uppercase">Cancelado</span>);
													default:
														return (<span className="px-2.5 py-0.5 text-xs font-medium rounded border bg-green-100 border-green-200 text-green-500 dark:bg-green-500/20 dark:border-green-500/20 uppercase">Pagado</span>);
												}
											})()}
										</p>
									</div>
									
									{/* Tipo de Ticket */}
									<div className="border-b border-slate-200 dark:border-zink-500 pb-2">
										<p className="text-xs font-bold uppercase text-slate-700 dark:text-zink-200">Tipo de Ticket</p>
										<p className="text-base">
											{(() => {
												switch(ticketList.data.ticket[0].type) {
													case "shop":
														return (<span className="px-2.5 py-0.5 text-xs font-medium rounded border bg-green-100 border-green-200 text-green-500 dark:bg-green-500/20 dark:border-green-500/20 uppercase">Compra</span>);
													default:
														return (<span className="px-2.5 py-0.5 text-xs font-medium rounded border bg-sky-100 border-sky-200 text-sky-500 dark:bg-sky-500/20 dark:border-sky-500/20 uppercase">Venta</span>);
												}
											})()}
										</p>
									</div>
									
									{/* Información del Cliente */}
									{ticketList?.data?.client && ticketList?.data?.client.length > 0 ? (
										<div className="space-y-4">
											<div className="border-b border-slate-200 dark:border-zink-500 pb-2">
												<p className="text-xs font-bold uppercase text-slate-700 dark:text-zink-200">Cliente</p>
												<p className="text-base text-slate-500 dark:text-zink-200">
													{ticketList.data.client[0].name} {ticketList.data.client[0].last_name}
												</p>
											</div>
											<div className="border-b border-slate-200 dark:border-zink-500 pb-2">
												<p className="text-xs font-bold uppercase text-slate-700 dark:text-zink-200">Num. de Cliente</p>
												<p className="text-base text-slate-500 dark:text-zink-200">
													{ticketList.data.client[0].customer_id ?? "N/A"}
												</p>
											</div>
											<div className="border-b border-slate-200 dark:border-zink-500 pb-2">
												<p className="text-xs font-bold uppercase text-slate-700 dark:text-zink-200">RFC del Cliente</p>
												<p className="text-base text-slate-500 dark:text-zink-200">
													{ticketList.data.client[0].rfc ?? "N/A"}
												</p>
											</div>
											<div className="border-b border-slate-200 dark:border-zink-500 pb-2">
												<p className="text-xs font-bold uppercase text-slate-700 dark:text-zink-200">Email del Cliente</p>
												<p className="text-base text-slate-500 dark:text-zink-200">
													{ticketList.data.client[0].email ?? "N/A"}
												</p>
											</div>
											<div className="border-b border-slate-200 dark:border-zink-500 pb-2">
												<p className="text-xs font-bold uppercase text-slate-700 dark:text-zink-200">Tel del Cliente</p>
												<p className="text-base text-slate-500 dark:text-zink-200">
													{ticketList.data.client[0].phone ?? "N/A"}
												</p>
											</div>
											<div>
												<p className="text-xs font-bold uppercase text-slate-700 dark:text-zink-200">Dirección del Cliente</p>
												<p className="text-base text-slate-500 dark:text-zink-200">
													{ticketList.data.client[0].address ?? "N/A"}
												</p>
											</div>
										</div>
									) : (
										<div className="space-y-4">
											<div className="border-b border-slate-200 dark:border-zink-500 pb-2">
												<p className="text-xs font-bold uppercase text-slate-700 dark:text-zink-200">Consumidor</p>
												<p className="text-base text-slate-500 dark:text-zink-200">
													{ticketList.data.ticket[0].customer_name ?? "No se registró nombre"}
												</p>
											</div>
										</div>
									)}
								</>
							) : (
								<div className="border-b border-slate-200 dark:border-zink-500 pb-2">
									<p className="text-xs font-bold uppercase text-slate-700 dark:text-zink-200">Como buscar un ticket?</p>
									<p className="text-base">
										Busque un ticket ingresando el folio del ticket y presionando enter.
									</p>
								</div>
							)}
						</div>
					</div>
				</div>
				
				<Modal show={defaultModal2} onHide={default2Toggle} id="defaultModal2" modal-center="true"
				       className="fixed flex flex-col transition-all duration-300 ease-in-out left-2/4 z-drawer -translate-x-2/4 -translate-y-2/4"
				       dialogClassName="w-screen md:w-[30rem] bg-white shadow rounded-md dark:bg-zink-600 flex flex-col h-full"                            >
					<Modal.Header className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-zink-500"
					              closeButtonClass="transition-all duration-200 ease-linear text-slate-500 hover:text-red-500 dark:text-zink-200 dark:hover:text-red-500">
						
						<Modal.Title className="text-16">
							Venta de productos
							<div className="text-gray-500 font-normal text-sm">Ingrese la cantidad de dinero recibido por el cliente</div>
						</Modal.Title>
					</Modal.Header>
					<Modal.Body className="max-h-[calc(theme('height.screen')_-_180px)] p-4 overflow-y-auto">
						<label htmlFor="calculations"></label>
						<div className="flex">
							<input
								type="text"
								id="calculations"
								ref={paymentInputRef}
								className="ltr:rounded-r-none rtl:rounded-l-none form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200"
								placeholder="$500.00"
							/>
							<button onClick={handlePayment} className="flex items-center justify-center w-[39px] h-[39px] ltr:rounded-l-none rtl:rounded-r-none p-0 text-slate-500 btn bg-slate-200 border-slate-200 hover:text-slate-600 hover:bg-slate-300 hover:border-slate-300 focus:text-slate-600 focus:bg-slate-300 focus:border-slate-300 focus:ring focus:ring-slate-100 active:text-slate-600 active:bg-slate-300 active:border-slate-300 active:ring active:ring-slate-100 dark:bg-zink-600 dark:hover:bg-zink-500 dark:border-zink-600 dark:hover:border-zink-500 dark:text-zink-200 dark:ring-zink-400/50">
								<ClipboardList className="inline-block size-4"></ClipboardList>
							</button>
						
						</div>
					</Modal.Body>
					<Modal.Footer className="flex flex-col items-start p-4 mt-auto border-t border-slate-200 dark:border-zink-500 space-y-2">
						<div className="flex justify-between w-full">
							<span className="font-semibold text-gray-800">Total a pagar:</span>
							<span className="text-gray-500">$ {Number(ticketList?.data?.ticket?.[0]?.total).toFixed(2)}</span>
						</div>
						<div className="flex justify-between w-full">
							<span className="font-semibold text-gray-800">Dinero recibido:</span>
							<span className="text-gray-500">$ {paymentReceived !== null ? paymentReceived.toFixed(2) : '0.00'}</span>
						</div>
						<div className="flex justify-between w-full">
							<span className="font-semibold text-gray-800">Cambio:</span>
							<span className="text-gray-500">$ {paymentReceived !== null ? Math.abs(paymentReceived - Number(ticketList?.data?.ticket?.[0]?.total)).toFixed(2) : '0.00'}</span>
						</div>
						<button
							type="button"
							className="mt-2 text-custom-500 btn bg-custom-100 hover:text-white hover:bg-custom-600 focus:text-white focus:bg-custom-600 focus:ring focus:ring-custom-100 active:text-white active:bg-custom-600 active:ring active:ring-custom-100 dark:bg-custom-500/20 dark:text-custom-500 dark:hover:bg-custom-500 dark:hover:text-white dark:focus:bg-custom-500 dark:focus:text-white dark:active:bg-custom-500 dark:active:text-white dark:ring-custom-400/20"
							onClick={handleModalAccept}
						>
							Aceptar
						</button>
					</Modal.Footer>
				</Modal>
			</>)}
			
		</React.Fragment>
	);
};

export default Checkout;
