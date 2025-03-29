import React from 'react';
import { HandCoins, CupSoda, Anvil, Ticket } from 'lucide-react';
import CountUp from 'react-countup';

const Widgets = () => {
    const currentMonth = new Date().toLocaleString('es-ES', { month: 'long' });
    const totalEgresos = 13461;
    const metalKg = 9.5344;
    const pet = 73.454;
    const totalTickets = 10;

    return (
        <div className="col-span-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
                {/* Widget Tickets */}
                <div className="card bg-white dark:bg-zinc-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-zinc-700">
                    <div className="text-center">
                        <div className="flex items-center justify-center mx-auto rounded-full size-14 bg-custom-100 text-custom-500 dark:bg-custom-500/20">
                            <Ticket className="size-5" />
                        </div>
                        <h5 className="mt-4 text-2xl font-bold">
                            <CountUp end={totalTickets} />
                        </h5>
                        <p className="text-gray-500 dark:text-gray-400 mt-1">
                            Tickets de {currentMonth}
                        </p>
                    </div>
                </div>

                {/* Widget Egresos */}
                <div className="card bg-white dark:bg-zinc-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-zinc-700">
                    <div className="text-center">
                        <div className="flex items-center justify-center mx-auto rounded-full size-14 bg-purple-100 text-purple-500 dark:bg-purple-500/20">
                            <HandCoins className="size-5" />
                        </div>
                        <h5 className="mt-4 text-2xl font-bold">
                            $<CountUp end={totalEgresos} decimals={2} separator="," />
                        </h5>
                        <p className="text-gray-500 dark:text-gray-400 mt-1">Total Egresos</p>
                    </div>
                </div>

                {/* Widget Metal */}
                <div className="card bg-white dark:bg-zinc-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-zinc-700">
                    <div className="text-center">
                        <div className="flex items-center justify-center mx-auto rounded-full size-14 bg-green-100 text-green-500 dark:bg-green-500/20">
                            <Anvil className="size-5" />
                        </div>
                        <h5 className="mt-4 text-2xl font-bold">
                            <CountUp end={metalKg} decimals={2} />
                            <span className="text-base font-normal text-gray-500"> /kg</span>
                        </h5>
                        <p className="text-gray-500 dark:text-gray-400 mt-1">Metal Recolectado</p>
                    </div>
                </div>

                {/* Widget PET */}
                <div className="card bg-white dark:bg-zinc-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-zinc-700">
                    <div className="text-center">
                        <div className="flex items-center justify-center mx-auto rounded-full size-14 bg-red-100 text-red-500 dark:bg-red-500/20">
                            <CupSoda className="size-5" />
                        </div>
                        <h5 className="mt-4 text-2xl font-bold">
                            <CountUp end={pet} decimals={2} />
                            <span className="text-base font-normal text-gray-500"> /kg</span>
                        </h5>
                        <p className="text-gray-500 dark:text-gray-400 mt-1">PET Recolectado</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Widgets;