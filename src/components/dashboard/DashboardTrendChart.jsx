import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import PropTypes from 'prop-types';

// Register ChartJS components - Redundant if already registered in app entry, but safe here
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

const DashboardTrendChart = ({ monthlyData }) => {
    // Monthly Trend (Line Chart)
    const lineData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
            {
                fill: true,
                label: 'New Systems',
                data: monthlyData || [12, 19, 3, 5, 2, 3], // Mock data fallback
                borderColor: 'rgb(99, 102, 241)', // indigo-500
                backgroundColor: 'rgba(99, 102, 241, 0.1)',
                tension: 0.4,
            },
        ],
    };

    const lineOptions = {
        responsive: true,
        performant: true, // Optimization
        maintainAspectRatio: false, // Allow height control
        plugins: {
            legend: {
                display: false,
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: {
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

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-sky-100 h-full">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Activity Trend (New Systems)</h3>
            <div className="h-72">
                <Line data={lineData} options={lineOptions} />
            </div>
        </div>
    );
};

DashboardTrendChart.propTypes = {
    monthlyData: PropTypes.array
};

export default DashboardTrendChart;
