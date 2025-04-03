import React from "react";
import ReactApexChart from "react-apexcharts";
import useChartColors from "Common/useChartColors";
import {useSelector} from "react-redux";
import {createSelector} from "reselect";


const selectDataList = createSelector(
  (state: any) => state.TICKETManagment,
  (state) => ({
      MonthlyTickets: state.MonthlyTickets,
  })
);

const OrdersOverviewChart = ({ chartId }: any) => {
    const { MonthlyTickets } = useSelector(selectDataList);

    const chartColors = useChartColors(chartId);
    const months = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dec"];
    const currentMonthIndex = new Date().getMonth();
    const availableTickets = MonthlyTickets.slice(0, currentMonthIndex + 1);
    const availableMonths = months.slice(0, currentMonthIndex + 1);
    const filteredData = availableTickets.filter((ticket: number) => ticket !== 0);
    const filteredMonths = availableMonths.filter((_, index) => availableTickets[index] !== 0);
    
    const series = [{
        name: 'Tickets',
        data: filteredData,
    }];

    var options: any = {
        chart: {
            height: 238,
            type: 'bar',
            toolbar: {
                show: false,
            }
        },
        plotOptions: {
            bar: {
                borderRadius: 5,
                dataLabels: {
                    position: 'top', // top, center, bottom
                },
            }
        },
        dataLabels: {
            enabled: true,
            formatter: function (val: any) {
                return val;
            },
            style: {
                fontSize: '12px',
            }
        },
        grid: {
            padding: {
                bottom: -10,
            }
        },
        xaxis: {
            categories: filteredMonths,
            position: 'bottom',
            axisBorder: {
                show: false
            },
            axisTicks: {
                show: false
            },
            tooltip: {
                enabled: true,
            }
        },
        yaxis: {
            axisBorder: {
                show: false
            },
            axisTicks: {
                show: false,
            },
            labels: {
                show: false,
                formatter: function (val: any) {
                    return val ;
                }
            }

        },
        colors: chartColors,
    };
    return (
        <React.Fragment>
            <ReactApexChart
                dir="ltr"
                options={options}
                series={series}
                data-chart-colors='["bg-custom-500"]'
                id={chartId}
                className="apex-charts"
                type='bar'
                height={238}
            />
        </React.Fragment>
    );
};

export { OrdersOverviewChart };
