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
                        <div className="relative">
                            <Link to="#" className="underline transition-all duration-200 ease-linear text-custom-500 hover:text-custom-600">Ver todo
                            <MoveRight className="inline-block size-4 align-middle ltr:ml-2 rtl:mr-2"></MoveRight></Link>
                        </div>
                    </div>
                    <div className="w-full overflow-x-auto"> {/* Contenedor para la tabla con scroll horizontal si es necesario */}
                        <OrderStatisticsChart chartId="orderStatisticsChart" className="w-full" /> {/* Asegúrate de que el componente Chart acepte className */}
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
};

export default OrderStatistics;