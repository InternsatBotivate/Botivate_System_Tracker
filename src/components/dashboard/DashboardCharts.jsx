import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    PointElement,
    LineElement,
    Filler
} from 'chart.js';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import { STAGE_NAMES } from '../../context/SystemContext';
import PropTypes from 'prop-types';

// Register ChartJS components
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    PointElement,
    LineElement,
    Filler
);

const DashboardCharts = ({ stageCounts }) => {
    // Stage Distribution (Bar Chart)
    const barData = {
        labels: Object.values(STAGE_NAMES).map(name => {
            // Shorten long names for the chart
            return name.length > 15 ? name.substring(0, 15) + '...' : name;
        }),
        datasets: [
            {
                label: 'Systems Count',
                data: Object.keys(STAGE_NAMES).map(id => stageCounts[id] || 0),
                backgroundColor: 'rgba(14, 165, 233, 0.7)', // sky-500
                borderColor: 'rgb(14, 165, 233)',
                borderWidth: 1,
                borderRadius: 6,
            },
        ],
    };

    const barOptions = {
        responsive: true,
        plugins: {
            legend: {
                display: false,
            },
            title: {
                display: false,
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    precision: 0
                },
                grid: {
                    display: true,
                    drawBorder: false,
                    color: 'rgba(0, 0, 0, 0.05)'
                }
            },
            x: {
                grid: {
                    display: false
                }
            }
        },
    };

    // System Status (Doughnut Chart)
    const activeCount = Object.entries(stageCounts).reduce((acc, [id, count]) => {
        return parseInt(id) < 11 ? acc + count : acc;
    }, 0);
    const completedCount = stageCounts[11] || 0; // Assuming 11 (MIS Integration) or later is completed

    const doughnutData = {
        labels: ['Active', 'Completed', 'On Hold'],
        datasets: [
            {
                data: [activeCount, completedCount, 0], // Adding a 0 for 'On Hold' for now
                backgroundColor: [
                    'rgba(14, 165, 233, 0.8)', // sky-500
                    'rgba(16, 185, 129, 0.8)', // emerald-500
                    'rgba(245, 158, 11, 0.8)', // amber-500
                ],
                borderColor: [
                    'white',
                    'white',
                    'white',
                ],
                borderWidth: 2,
            },
        ],
    };



    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Bar Chart - Takes up 2 columns */}
            <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-sky-100">
                <h3 className="text-lg font-bold text-slate-800 mb-4">Stage Distribution</h3>
                <div className="h-64">
                    <Bar data={barData} options={barOptions} />
                </div>
            </div>

            {/* Doughnut Chart */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-sky-100">
                <h3 className="text-lg font-bold text-slate-800 mb-4">System Status</h3>
                <div className="h-64 flex items-center justify-center">
                    <Doughnut data={doughnutData} />
                </div>
            </div>
        </div>
    );
};

DashboardCharts.propTypes = {
    stageCounts: PropTypes.object.isRequired
};

export default DashboardCharts;
