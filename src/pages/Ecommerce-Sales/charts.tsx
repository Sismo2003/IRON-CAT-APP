import React from "react";
import ReactApexChart from "react-apexcharts";
import useChartColors from "Common/useChartColors";

const OrdersOverviewChart = ({ chartId }: any) => {

    const chartColors = useChartColors(chartId);
    //  Total tickets
    const series = [{
        name: 'Tickets',
        data: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
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
                return val + "%";
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
            categories: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dec"],
            position: 'bottom   ',
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
                    return val + "%";
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
