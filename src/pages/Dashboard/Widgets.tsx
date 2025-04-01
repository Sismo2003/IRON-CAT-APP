// Widgets.tsx
import React from 'react';
import { HandCoins, CupSoda, Anvil, Ticket } from 'lucide-react';
import CountUp from 'react-countup';
import { useSelector } from 'react-redux';
import { createSelector } from 'reselect';

const Widgets = () => {
  const selectTicket = createSelector(
    (state: any) => state.TICKETManagment,
    (state) => ({
      MonthlyTickets: state.MonthlyTickets,
    })
  );
  
  // Solo usamos useSelector para acceder a la data ya cargada en el store
  const { MonthlyTickets } = useSelector(selectTicket);
  
  const WIDGET_DATA = [
    {
      id: 1,
      title: `Tickets de ${new Date().toLocaleString('es-ES', { month: 'long' })}`,
      value: MonthlyTickets,
      icon: <Ticket />,
      color: 'custom',
      decimals: 0,
      unit: ''
    },
    {
      id: 2,
      title: 'Total Egresos',
      value: 13461,
      icon: <HandCoins />,
      color: 'purple',
      decimals: 2,
      prefix: '$',
      unit: ''
    },
    {
      id: 3,
      title: 'Metal Recolectado',
      value: 9.5344,
      icon: <Anvil />,
      color: 'green',
      decimals: 2,
      unit: 'kg'
    },
    {
      id: 4,
      title: 'PET Recolectado',
      value: 73.454,
      icon: <CupSoda />,
      color: 'red',
      decimals: 2,
      unit: 'kg'
    }
  ];
  
  const WidgetItem = ({
                        title, value, icon, color, decimals = 0, prefix = '', unit = ''
                      }: {
    title: string;
    value: number;
    icon: React.ReactNode;
    color: string;
    decimals?: number;
    prefix?: string;
    unit?: string;
  }) => (
    <div className="col-span-12 card md:col-span-6 lg:col-span-3 2xl:col-span-2">
      <div className="text-center card-body">
        <div className={`flex items-center justify-center mx-auto rounded-full size-14 bg-${color}-100 text-${color}-500 dark:bg-${color}-500/20`}>
          {icon}
        </div>
        <h5 className="mt-4 mb-2">
          {prefix}
          <CountUp
            end={value}
            decimals={decimals}
            className="counter-value"
          />
          {unit && (
            <span className="text-xs text-gray-400"> /{unit}</span>
          )}
        </h5>
        <p className="text-slate-500 dark:text-zink-200">{title}</p>
      </div>
    </div>
  );
  
  return (
    <React.Fragment>
      {WIDGET_DATA.map((widget) => (
        <WidgetItem
          key={widget.id}
          title={widget.title}
          value={widget.value}
          icon={widget.icon}
          color={widget.color}
          decimals={widget.decimals}
          prefix={widget.prefix}
          unit={widget.unit}
        />
      ))}
    </React.Fragment>
  );
};

export default Widgets;