import React from 'react';
import { Link } from 'react-router-dom';
import { OrderStatisticsChart } from './Charts';
import { MoveRight } from 'lucide-react';

const OrderStatistics = () => {
    return (
        <React.Fragment>
            <div className="col-span-12 card 2xl:col-span-12"> {/* Cambiado a col-span-12 para ocupar todo el ancho */}
                <div className="card-body p-0"> {/* Añadido p-0 para eliminar el padding si es necesario */}
                    <div className="flex items-center mb-3 p-4"> {/* Añadido p-4 para mantener el padding interno */}
                        <h6 className="grow text-15">Estados de tickets</h6>
                     
                    </div>
                    <OrderStatisticsChart chartId="orderStatisticsChart" className="w-full" /> {/* Asegúrate de que el componente Chart acepte className */}
                </div>
            </div>
        </React.Fragment>
    );
};

export default OrderStatistics;