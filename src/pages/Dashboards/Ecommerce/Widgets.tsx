import React from 'react';
import { HandCoins, CupSoda, Anvil, Ticket } from 'lucide-react';
import CountUp from 'react-countup';


const totalTickets = 10;


const totalEgresos = 13461;

const metalKg = 9.5344;
const pet = 73.454;

const Widgets = () => {
    return (
        <React.Fragment>
            <div className="col-span-12 card md:col-span-6 lg:col-span-3 2xl:col-span-2">
                <div className="text-center card-body">
                    <div className="flex items-center justify-center mx-auto rounded-full size-14 bg-custom-100 text-custom-500 dark:bg-custom-500/20">
                        <Ticket />
                    </div>
                    <h5 className="mt-4 mb-2">
                        <CountUp end={totalTickets}  className="counter-value" />
                        </h5>
                    <p className="text-slate-500 dark:text-zink-200">
                        Tickets de {new Date().toLocaleString('es-ES', { month: 'long' })}
                    </p>
                </div>
            </div>
            <div className="col-span-12 card md:col-span-6 lg:col-span-3 2xl:col-span-2">
                <div className="text-center card-body">
                    <div className="flex items-center justify-center mx-auto text-purple-500 bg-purple-100 rounded-full size-14 dark:bg-purple-500/20">
                        <HandCoins />
                    </div>
                    <h5 className="mt-4 mb-2">$
                        <CountUp end={totalEgresos} decimals={2} className="counter-value" />
                    </h5>
                    <p className="text-slate-500 dark:text-zink-200">Total Egresos </p>
                </div>
            </div>
            <div className="col-span-12 card md:col-span-6 lg:col-span-3 2xl:col-span-2">
                <div className="text-center card-body">
                    <div className="flex items-center justify-center mx-auto text-green-500 bg-green-100 rounded-full size-14 dark:bg-green-500/20">
                        <Anvil />
                    </div>
                    <h5 className="mt-4 mb-2">
                        <div className="flex items-center justify-center">
                            <CountUp end={metalKg} decimals={2} className="counter-value" />
                            <p className="text-xs text-gray-400"> /kg</p>
                        </div>
                    </h5>
                    <p className="text-slate-500 dark:text-zink-200">Metal Recolectado</p>
                </div>
            </div>
            <div className="col-span-12 card md:col-span-6 lg:col-span-3 2xl:col-span-2">
                <div className="text-center card-body">
                    <div className="flex items-center justify-center mx-auto text-red-500 bg-red-100 rounded-full size-14 dark:bg-red-500/20">
                        <CupSoda />
                    </div>
                    <h5 className="mt-4 mb-2">
                        <div className="flex items-center justify-center">
                            <CountUp end={pet} decimals={2} className="counter-value" />
                            <p className="text-xs text-gray-400">  /kg</p>
                        </div>
                    </h5>
                    <p className="text-slate-500 dark:text-zink-200">PET Recolectado</p>
                </div>
            </div>
        </React.Fragment>
    );
};

export default Widgets;
