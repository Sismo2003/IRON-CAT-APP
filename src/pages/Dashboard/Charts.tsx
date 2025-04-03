import React from "react";
import ReactApexChart from "react-apexcharts";
import useChartColors from "Common/useChartColors";
// import { Variable } from "lucide-react";

import {createSelector} from "reselect";
import {useSelector} from "react-redux";

const OrderStatisticsChart = ({ chartId }: any) => {
    const selectDataList = createSelector(
      (state: any) => state.TICKETManagment,
      (state) => ({
          TicketsStatusCount : state.TicketsStatusCount,
          
      })
    );
    
    
    const { TicketsStatusCount } = useSelector(selectDataList);
    
    const chartColors = useChartColors(chartId);

    //Order Statistics
    const series = [
        {
            name: 'Cancelados',
            data: TicketsStatusCount.map((item: any) => item.deleted)
        },
        {
            name: 'Pendientes',
            data: TicketsStatusCount.map((item: any) => item.pending)
        },
        {
            name: 'Autorizados',
            data: TicketsStatusCount.map((item: any) => item.authorized)
        },
        {
            name: 'Compra de material',
            data: TicketsStatusCount.map((item: any) => item.sale)
        },
        {
            name: 'Venta de material ',
            data: TicketsStatusCount.map((item: any) => item.shop)
        },
      
    ];
    var options: any = {
        chart: {
            type: 'line',
            height: 310,
            toolbar: {
                show: false,
            },
        },
        xaxis: {
            categories: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dec"],
        },
        stroke: {
            curve: 'smooth',
            width: 2,
        },
        colors: chartColors,
        dataLabels: {
            enabled: false
        },
        grid: {
            show: true,
            padding: {
                top: -20,
                right: 0,
            }
        },
        markers: {
            hover: {
                sizeOffset: 4
            }
        }
    };
    return (
        <React.Fragment>
            <ReactApexChart
                dir="ltr"
                options={options}
                series={series}
                data-chart-colors= '["bg-red-500", "bg-yellow-500", "bg-blue-500"]'
                id={chartId}
                className="apex-charts"
                type='line'
                height={310}
            />
        </React.Fragment>
    );
};

// const SubscriptionChart = ({ chartId }: any ) => {
const SubscriptionChart = (props: any) => {
    const selectDataList = createSelector(
      (state: any) => state.TICKETManagment,
      (state) => ({
          productsSaleCharts : state.productsSaleCharts,
      })
    );
    
    const { productsSaleCharts } = useSelector(selectDataList);
    
    
    // const chartColors = useChartColors(chartId);
    //Subscription Distribution
    // const series = [44, 55, 41, 17, 15];
    const chartColors = useChartColors(props.chartId);
    
    const ticketType = props.ticketType || 'sale';
    const productData = productsSaleCharts[ticketType] ? Object.values(productsSaleCharts[ticketType]) : [];
    
    // Calculamos el peso total
    const totalWeight = productData.reduce((acc: number, product: any) => acc + product.totalWeight, 0);

// Calculamos el porcentaje crudo
    let rawPercentages = productData.map((product: any) =>
      totalWeight > 0 ? (product.totalWeight / totalWeight) * 100 : 0
    );

// Redondeamos cada valor a 2 decimales
    let seriesTemp = rawPercentages.map((val) => parseFloat(val.toFixed(2)));

// Ajustamos la suma total a 100 exacto si quedó un pequeño desfase por el redondeo
    const sum = seriesTemp.reduce((acc, val) => acc + val, 0);
    const diff = parseFloat((100 - sum).toFixed(2));

// Si hay diferencia, se la sumamos al mayor porcentaje (para no alterar demasiado el resto)
    if (Math.abs(diff) > 0.001) {
        const maxIndex = seriesTemp.indexOf(Math.max(...seriesTemp));
        seriesTemp[maxIndex] = parseFloat((seriesTemp[maxIndex] + diff).toFixed(2));
    }

// Finalmente, este es el array de porcentajes que suman 100
    const series = seriesTemp;
    
    
    // console.log(series1);
    var options: any = {
        labels: productData.map((product: any) => product.product_name),
        chart: {
            height: 270,
            type: 'donut',
        },
        plotOptions: {
            pie: {
                startAngle: -90,
                endAngle: 270, // Forzamos el ángulo final para que el donut se cierre
                donut: {
                    size: '75%'
                }
            }
        },
        dataLabels: {
            enabled: false
        },
        fill: {
            type: 'gradient',
        },
        colors: chartColors,
        legend: {
            position: 'bottom',
            formatter: function (val: any, opts: any) {
                return val + " - " + opts.w.globals.series[opts.seriesIndex] + "%";
            }
        },
    };
    
    return (
      <React.Fragment>
          <ReactApexChart
            dir="ltr"
            options={options}
            series={series}
            data-chart-colors='["bg-custom-500", "bg-orange-500", "bg-green-500", "bg-yellow-500", "bg-purple-500"]'
            id="subscriptionDistribution"
            className="apex-charts"
            type='donut'
            height={270}
          />
      </React.Fragment>
    );
};


const SalesRevenueOverviewChart = ({ chartId }: any) => {

    const chartColors = useChartColors(chartId);

    //Sales Revenue Overview
    const series = [{
        name: 'Venta total',
        data: [44, 55, 41, 67, 22, 43, 21, 49, 20, 41, 67, 22,]
    }, {
        name: 'Ganancia total',
        data: [11, 17, 15, 15, 21, 14, 15, 13, 5, 15, 15, 21,]
    }];
    var options: any = {
        chart: {
            type: 'bar',
            height: 300,
            stacked: true,
            stackType: '100%',
            toolbar: {
                show: false,
            },
        },
        xaxis: {
            categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        },
        tooltip: {
            y: {
                formatter: function (val: any) {
                    return "$" + val + "k";
                }
            }
        },
        grid: {
            show: true,
            padding: {
                top: -20,
                right: -10,
            }
        },
        plotOptions: {
            bar: {
                horizontal: false,
                columnWidth: '50%',
            },
        },
        colors: chartColors,
        fill: {
            opacity: 1
        },
        legend: {
            position: 'bottom',
        },
    };
    return (
        <React.Fragment>
            <ReactApexChart
                dir="ltr"
                options={options}
                series={series}
                data-chart-colors='["bg-blue-500", "bg-purple-500", "bg-red-500"]'
                id={chartId}
                className="apex-charts"
                type='bar'
                height={300}
            />
        </React.Fragment>
    );
};

const TrafficResourcesChart = ({ chartId }: any) => {

    const chartColors = useChartColors(chartId);

    //Traffic Resources Chart
    let count : number=0;
    const series = [80, 45, 20];
    series.forEach(variable => {
        count+=variable;

    })
    var options: any = {
        chart: {
            height: 222,
            type: 'radialBar',
        },
        plotOptions: {
            radialBar: {
                dataLabels: {
                    total: {
                        show: true,
                        label: 'Total',
                        formatter: function (w: any) {
                            // By default this function returns the average of all series. The below is just an example to show the use of custom formatter function
                            return count;
                        }
                    }
                }
            }
        },
        grid: {
            show: true,
            padding: {
                top: -8,
                bottom: -15,
                left: 0,
                right: 0,
            }
        },
        colors: chartColors,
        labels: ['Aluminio', 'Cobre', 'Chatarra'],
    };

    return (
        <React.Fragment>
            <ReactApexChart
                dir="ltr"
                options={options}
                series={series}
                data-chart-colors='["bg-sky-500", "bg-purple-500", "bg-red-500", "bg-yellow-500"]'
                id={chartId}
                className="apex-charts"
                type='radialBar'
                height={222}
            />
        </React.Fragment>
    );
};

const AudienceChart = ({ chartId }: any) => {

    const chartColors = useChartColors(chartId);
    
    const selectDataList = createSelector(
      (state: any) => state.TICKETManagment,
      (state) => ({
          TicketsCountByDay : state.TicketsCountByDay,
          
      })
    );
    
    
    const { TicketsCountByDay } = useSelector(selectDataList);
    
    
    // console.log(TicketsCountByDay);
    //Order Statistics
    const series = [
        {
            name: 'Compra de material',
            data: TicketsCountByDay.map((item: any) => item.shop)
        },
        {
            name: 'Venta de material',
            data: TicketsCountByDay.map((item: any) => item.sale)
        }
    ];
    var options: any = {
        chart: {
            type: 'bar',
            height: 390,
            stacked: true,
            toolbar: {
                show: false
            },
            zoom: {
                enabled: true
            }
        },
        plotOptions: {
            bar: {
                horizontal: false,
                borderRadius: 6,
                columnWidth: '44%',
                dataLabels: {
                    total: {
                        enabled: true,
                        style: {
                            fontSize: '13px',
                            fontWeight: 600
                        }
                    }
                }
            },
        },
        xaxis: {
            // type: 'datetime',
            categories: TicketsCountByDay.map((item: any) => item.day)
        },
        colors: chartColors,
        legend: {
            position: 'top',
            horizontalAlign: 'right',
        },
        fill: {
            opacity: 1
        }
    };

    return (
        <React.Fragment>
            <ReactApexChart
                dir="ltr"
                options={options}
                series={series}
                data-chart-colors='["bg-blue-500", "bg-green-300"]'
                id={chartId}
                className="-mt-9 apex-charts"
                type='bar'
                height={390}
            />
        </React.Fragment>
    );
};

export {
    OrderStatisticsChart,
    SalesRevenueOverviewChart,
    TrafficResourcesChart,
    AudienceChart,
    SubscriptionChart
};