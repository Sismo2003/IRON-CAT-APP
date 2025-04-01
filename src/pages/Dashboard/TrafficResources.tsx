import React from 'react';
import { Link } from 'react-router-dom';
import { TrafficResourcesChart } from './Charts';
import { MoveRight, TrendingDown, TrendingUp } from 'lucide-react';

const MaterialStats = () => {
    // Datos de materiales con sus colores asociados
    const materialsData = {
        mostPurchased: [
            { name: 'Aluminio', percentage: 80, color: 'bg-blue-500', bgColor: 'bg-blue-50' },
            { name: 'Cobre', percentage: 45, color: 'bg-purple-500', bgColor: 'bg-purple-50' },
            { name: 'Chatarra', percentage: 20, color: 'bg-red-500', bgColor: 'bg-red-50' }
        ],
        leastPurchased: [
            { name: 'Plástico', percentage: 5, color: 'bg-yellow-500', bgColor: 'bg-yellow-50' },
            { name: 'Vidrio', percentage: 8, color: 'bg-blue-500', bgColor: 'bg-blue-50' },
            { name: 'Papel', percentage: 12, color: 'bg-gray-500', bgColor: 'bg-gray-50' }
        ]
    };

    return (
        <div className="col-span-12"> {/* Cambiado a col-span-12 para ancho completo */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Material más comprado */}
                <div className="card">
                    <div className="card-body">
                        <div className="flex items-center justify-between mb-4">
                            <h6 className="text-lg font-semibold flex items-center gap-2">
                                <TrendingUp className="text-green-500" />
                                Material más comprado
                            </h6>
                            <Link to="#" className="text-sm text-blue-500 hover:text-blue-700 flex items-center">
                                Ver más <MoveRight className="ml-1 size-4" />
                            </Link>
                        </div>
                        
                        <div className="flex flex-col md:flex-row gap-5">
                            <div className="w-full md:w-1/2">
                                <TrafficResourcesChart 
                                    chartId="mostPurchasedChart" 
                                    colors={['#3b82f6', '#a855f7', '#ef4444']} // Azul, Morado, Rojo
                                />
                            </div>
                            <div className="w-full md:w-1/2">
                                <ul className="space-y-3">
                                    {materialsData.mostPurchased.map((material, index) => (
                                        <li 
                                            key={index} 
                                            className={`flex items-center gap-3 p-2 ${material.bgColor} rounded`}
                                        >
                                            <div className={`size-4 ${material.color} rounded-full`}></div>
                                            <span className="font-medium">{material.name}</span>
                                            <span className="ml-auto font-bold">{material.percentage}%</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Material menos comprado */}
                <div className="card">
                    <div className="card-body">
                        <div className="flex items-center justify-between mb-4">
                            <h6 className="text-lg font-semibold flex items-center gap-2">
                                <TrendingDown className="text-red-500" />
                                Material menos comprado
                            </h6>
                            <Link to="#" className="text-sm text-blue-500 hover:text-blue-700 flex items-center">
                                Ver más <MoveRight className="ml-1 size-4" />
                            </Link>
                        </div>
                        
                        <div className="flex flex-col md:flex-row gap-5">
                            <div className="w-full md:w-1/2">
                                <TrafficResourcesChart 
                                    chartId="leastPurchasedChart" 
                                    colors={['#eab308', '#3b82f6', '#6b7280']} // Amarillo, Azul, Gris
                                />
                            </div>
                            <div className="w-full md:w-1/2">
                                <ul className="space-y-3">
                                    {materialsData.leastPurchased.map((material, index) => (
                                        <li 
                                            key={index} 
                                            className={`flex items-center gap-3 p-2 ${material.bgColor} rounded`}
                                        >
                                            <div className={`size-4 ${material.color} rounded-full`}></div>
                                            <span className="font-medium">{material.name}</span>
                                            <span className="ml-auto font-bold">{material.percentage}%</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MaterialStats;