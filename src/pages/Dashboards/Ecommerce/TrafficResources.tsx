import React from 'react';
import { Link } from 'react-router-dom';
import { TrafficResourcesChart } from './Charts';
import CountUp from 'react-countup';
import { MoveRight, TrendingDown } from 'lucide-react';

const TrafficResources = () => {
    return (
        <React.Fragment>
            <div className="col-span-12 2xl:col-span-4">
                <div className="grid grid-cols-12 gap-x-5">
                    <div className="col-span-12 card lg:col-span-6 2xl:col-span-12">
                        <div className="card-body">
                            <div className="flex items-center mb-3">
                                <h6 className="grow text-15">Material más comprado</h6>
                                <div className="relative">
                                    <Link to="#" className="transition-all duration-300 ease-linear text-custom-500 hover:text-custom-700"> Ver más
                                        <MoveRight className="inline-block size-4 align-middle ltr:ml-2 rtl:mr-2"></MoveRight></Link>
                                </div>
                            </div>
                            <div className="grid grid-cols-12">
                                <div className="col-span-12 md:col-span-6 2xl:col-span-7">
                                    <TrafficResourcesChart chartId="trafficResourcesChart" />
                                </div>
                                <div className="col-span-12 md:col-span-6 2xl:col-span-5">
                                    <ul className="flex flex-col gap-3">
                                        <li className="flex items-center gap-2">
                                            <div className="size-3 bg-blue-500 shrink-0 clip-triangle"></div>
                                            <p className="text-blue-500">Aluminio (80%)</p>
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <div className="size-3 bg-purple-500 shrink-0 clip-triangle"></div>
                                            <p className="text-purple-500">Cobre (45%)</p>
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <div className="size-3 bg-red-500 shrink-0 clip-triangle"></div>
                                            <p className="text-red-500">Chatarra (20%)</p>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-span-12 card lg:col-span-6 2xl:col-span-12">
                        <div className="card-body">
                            <div className="flex items-center mb-3">
                                <h6 className="grow text-15">Material más comprado</h6>
                                <div className="relative">
                                    <Link to="#" className="transition-all duration-300 ease-linear text-custom-500 hover:text-custom-700"> Ver más
                                        <MoveRight className="inline-block size-4 align-middle ltr:ml-2 rtl:mr-2"></MoveRight></Link>
                                </div>
                            </div>
                            <div className="grid grid-cols-12">
                                <div className="col-span-12 md:col-span-6 2xl:col-span-7">
                                    <TrafficResourcesChart chartId="trafficResourcesChart" />
                                </div>
                                <div className="col-span-12 md:col-span-6 2xl:col-span-5">
                                    <ul className="flex flex-col gap-3">
                                        <li className="flex items-center gap-2">
                                            <div className="size-3 bg-blue-500 shrink-0 clip-triangle"></div>
                                            <p className="text-blue-500">Aluminio (80%)</p>
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <div className="size-3 bg-purple-500 shrink-0 clip-triangle"></div>
                                            <p className="text-purple-500">Cobre (45%)</p>
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <div className="size-3 bg-red-500 shrink-0 clip-triangle"></div>
                                            <p className="text-red-500">Chatarra (20%)</p>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                    
            </div>
        </React.Fragment>
    );
};

export default TrafficResources;
