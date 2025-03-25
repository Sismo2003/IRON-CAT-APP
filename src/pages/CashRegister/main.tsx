import React from 'react';
import BreadCrumb from 'Common/BreadCrumb';

import {useDispatch, useSelector} from 'react-redux';
import { createSelector } from 'reselect';


import {
    lookTicket
} from 'slices/thunk';

// Icon
import {
    MoveRight,
    BookUser,
    UserPlus
} from 'lucide-react';

import { Link } from 'react-router-dom';





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


    function handle_ticket(event: React.FormEvent) {
        event.preventDefault(); // Evita que se recargue la página

        const input = document.getElementById('idToFind') as HTMLInputElement;
        const id = input?.value?.trim();

        console.log("fetching:", id);
        if (!id) {
            alert('Por favor ingresa un ID válido');
            return;
        }

        dispatch(lookTicket(id));
    }


    console.log(ticketList);


    return (
        <React.Fragment>

            <BreadCrumb title='Caja Registradora' pageTitle='Punto de venta' />
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-x-5">
                <div className="xl:col-span-12">
                    <div className="card">
                        <div className="card-body">
                            <h6 className="mb-4 text-15">Pantalla de Cobro</h6>
                            <form onSubmit={(event) => handle_ticket(event)}>
                                <div className="grid grid-cols-1 gap-5 xl:grid-cols-12">
                                    <div className="xl:col-span-12">
                                        <label htmlFor="idToFind" className="inline-block mb-2 text-base font-medium">Folio de Ticket</label>
                                        <input type="text" pattern="\d*" maxLength={16} id="idToFind" className="form-input border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200"
                                               placeholder="Identificador del Ticket" />
                                    </div>
                                    <button type="submit" className="text-purple-500 bg-purple-100 btn hover:text-white hover:bg-purple-600 focus:text-white focus:bg-purple-600 focus:ring focus:ring-purple-100 active:text-white active:bg-purple-600 active:ring active:ring-purple-100 dark:bg-purple-500/20 dark:text-purple-500 dark:hover:bg-purple-500 dark:hover:text-white dark:focus:bg-purple-500 dark:focus:text-white dark:active:bg-purple-500 dark:active:text-white dark:ring-purple-400/20">
                                        Buscar Ticket
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

                {ticketList?.data && ticketList?.success  ? (
                <>
                    <div className="xl:col-span-8">
                        {/*  Order summary       */}
                        <div className="card">
                            <div className="card-body">
                                <div className="flex items-center gap-3 mb-4">
                                    <h6 className="text-15 grow">Resumen Ticket</h6>
                                    <Link to="#!" className="text-red-500 underline shrink-0">Eliminar Ticket</Link>
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
                                                              Canal de venta/compra: <span className="font-semibold text-green-500">{item.type == 'wholesale' ? 'Mayoreo' : 'Menudeo'}</span>
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-3.5 py-4 border-b border-dashed first:pl-0 last:pr-0 border-slate-200 dark:border-zink-500 ltr:text-right rtl:text-left">
                                                    ${item.total ?? 'N/A'}
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
                                            <td className="px-3.5 pt-3 first:pl-0 last:pr-0 ltr:text-right rtl:text-left">$ {ticketList.data.ticket[0].total ?? 'N/A'}</td>
                                        </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                        {/*  Buttoms */}
                        <div className="flex items-center gap-3 mb-5">
                            <div className="shrink-0">
                                <button type="button" className="text-white btn bg-custom-500 border-custom-500 hover:text-white hover:bg-custom-600 hover:border-custom-600 focus:text-white focus:bg-custom-600 focus:border-custom-600 focus:ring focus:ring-custom-100 active:text-white active:bg-custom-600 active:border-custom-600 active:ring active:ring-custom-100 dark:ring-custom-400/20"><span className="align-middle">Place Order</span> <MoveRight className="inline-block size-4 align-middle ltr:ml-1 rtl:mr-1 rtl:rotate-180" /></button>
                            </div>
                            <div className="shrink-0">
                                <button type="button" className="text-white btn bg-custom-500 border-custom-500 hover:text-white hover:bg-custom-600 hover:border-custom-600 focus:text-white focus:bg-custom-600 focus:border-custom-600 focus:ring focus:ring-custom-100 active:text-white active:bg-custom-600 active:border-custom-600 active:ring active:ring-custom-100 dark:ring-custom-400/20"><span className="align-middle">Place Order</span> <MoveRight className="inline-block size-4 align-middle ltr:ml-1 rtl:mr-1 rtl:rotate-180" /></button>
                            </div>
                        </div>
                    </div>

                    {ticketList?.data?.client && ticketList?.data?.client.length > 0 ? (
                        <div className="xl:col-span-4">
                            <div className="card">
                                <div className="card-body">
                                <div className="flex items-center justify-center size-12 bg-purple-100 rounded-md dark:bg-purple-500/20 ltr:float-right rtl:float-left">
                                    <BookUser className="text-purple-500 fill-purple-200 dark:fill-purple-500/30" />
                                </div>
                                    <h6 className="mb-4 text-15">Cliente Registrado</h6>
                                    <h6 className="mb-1">{ticketList?.data?.client[0].name + ticketList?.data?.client[0].last_name} </h6>
                                    <p className="text-slate-500 dark:text-zink-200">
                                        {ticketList?.data?.client[0].customer_id ? "Num. Cliente: " + ticketList?.data?.client[0].customer_id : 'N/A' }
                                    </p>

                                    <p className="text-slate-500 dark:text-zink-200">
                                        {ticketList?.data?.client[0].rfc ? "RFC: " + ticketList?.data?.client[0].rfc : 'N/A' }
                                    </p>
                                    <p className="text-slate-500 dark:text-zink-200">
                                        {ticketList?.data?.client[0].email ? "Email: " + ticketList?.data?.client[0].email : null }
                                    </p>
                                    <p className="mb-1 text-slate-500 dark:text-zink-200">Tel: {ticketList?.data?.client[0].phone} </p>
                                    <p className="text-slate-500 dark:text-zink-200">{ticketList?.data?.client[0].address} </p>

                                    <p className="text-slate-500 dark:text-zink-200">
                                        {ticketList?.data?.client[0].last_visit ? "Ultima visita:" + ticketList?.data?.client[0].last_visit : null }
                                    </p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="xl:col-span-4">
                            <div className="card">
                                <div className="card-body">
                                    <div className="flex items-center justify-center size-12 bg-purple-100 rounded-md dark:bg-purple-500/20 ltr:float-right rtl:float-left">
                                        <UserPlus className="text-purple-500 fill-purple-200 dark:fill-purple-500/30" />
                                    </div>
                                    <h6 className="mb-4 text-15">Consumidor</h6>
                                    <h6 className="mb-1">{ticketList.data.ticket[0].customer_name ?? 'NO SE REGISTRO NOMBRE AL GENERAR EL TICKET' }</h6>
                                    <p className="mb-1 text-slate-500 dark:text-zink-200">Consumidor sin registro!</p>
                                </div>
                            </div>
                        </div>
                    )}
                </>
                ) : (
                    <div className="xl:col-span-8">
                        <p>No hay datos todavía</p>
                    </div>
                )}




            </div>




        </React.Fragment>
    );
};

export default Checkout;
