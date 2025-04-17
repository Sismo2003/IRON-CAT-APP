import React, { useMemo } from 'react';
import { Pickaxe, CupSoda, Anvil, Ticket } from 'lucide-react';
import CountUp from 'react-countup';
import { useSelector } from 'react-redux';
import { createSelector } from 'reselect';

// Definición de tipos para TypeScript
type ProductData = {
  product_name: string;
  totalWeight: number;
};

type ChartData = {
  [key: string]: ProductData;
};

type RootState = {
  TICKETManagment: {
    actualMonthTickets: number;
    productsSaleCharts: {
      shop?: ChartData;
    };
    loading: boolean;
  };
};

// Componente WidgetItem separado para evitar re-renderizados innecesarios
const WidgetItem = React.memo(({
  title,
  value,
  icon,
  color,
  decimals = 0,
  prefix = '',
  unit = ''
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
          key={`${title}-${value}`} // Key única para forzar remontaje cuando cambian los datos
        />
        {unit && (
          <span className="text-xs text-gray-400"> /{unit}</span>
        )}
      </h5>
      <p className="text-slate-500 dark:text-zink-200">{title}</p>
    </div>
  </div>
));

const Widgets = () => {
  const selectTicket = createSelector(
    (state: RootState) => state.TICKETManagment,
    (state) => ({
      actualMonthTickets: state.actualMonthTickets,
      productsSaleCharts: state.productsSaleCharts,
      loading: state.loading
    })
  );

  const { actualMonthTickets, productsSaleCharts, loading } = useSelector(selectTicket);

  // Usamos useMemo para evitar recálculos innecesarios
  const transformedShop = useMemo(() => {
    return Object.values(productsSaleCharts?.shop || {})
      .map((item: any) => ({
        value: item.totalWeight,
        title: item.product_name
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 3);
  }, [productsSaleCharts?.shop]);

  // Preparamos los datos de los widgets con useMemo
  const WIDGET_DATA = useMemo(() => {
    const currentMonth = new Date().toLocaleString('es-ES', { month: 'long' });
    
    return [
      {
        id: 1,
        title: `Tickets de ${currentMonth}`,
        value: actualMonthTickets ?? 0,
        icon: <Ticket />,
        color: 'custom',
        decimals: 0,
        unit: ''
      },
      {
        id: 2,
        title: transformedShop[0]?.title ?? 'No hay datos',
        value: Number(transformedShop[0]?.value) ?? 0,
        icon: <Pickaxe />,
        color: 'purple',
        decimals: 2,
        prefix: '',
        unit: 'kg'
      },
      {
        id: 3,
        title: transformedShop[1]?.title ?? 'No hay datos',
        value: Number(transformedShop[1]?.value) ?? 0,
        icon: <Anvil />,
        color: 'green',
        decimals: 2,
        unit: 'kg'
      },
      {
        id: 4,
        title: transformedShop[2]?.title ?? 'No hay datos',
        value: Number(transformedShop[2]?.value) ?? 0,
        icon: <CupSoda />,
        color: 'red',
        decimals: 2,
        unit: 'kg'
      }
    ];
  }, [actualMonthTickets, transformedShop]);

  // Mostramos skeleton loader mientras carga
  if (loading) {
    return (
      <React.Fragment>
        {[1, 2, 3, 4].map((id) => (
          <div key={id} className="col-span-12 card md:col-span-6 lg:col-span-3 2xl:col-span-2">
            <div className="text-center card-body">
              <div className="flex items-center justify-center mx-auto rounded-full size-14 bg-gray-100 animate-pulse" />
              <div className="mt-4 mb-2 h-6 bg-gray-100 rounded animate-pulse" />
              <div className="h-4 bg-gray-100 rounded animate-pulse" />
            </div>
          </div>
        ))}
      </React.Fragment>
    );
  }

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

export default React.memo(Widgets);