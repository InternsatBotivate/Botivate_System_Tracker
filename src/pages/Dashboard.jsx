import { useSystem, STAGES } from '../context/SystemContext';
import DashboardStats from '../components/dashboard/DashboardStats';
import DashboardCharts from '../components/dashboard/DashboardCharts';
import RecentActivity from '../components/dashboard/RecentActivity';
import QuickActions from '../components/dashboard/QuickActions';
import DashboardTrendChart from '../components/dashboard/DashboardTrendChart';

const Dashboard = () => {
    const { systems, loading } = useSystem();

    if (loading) {
        return (
            <div className="h-[80vh] flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-500"></div>
            </div>
        );
    }

    // Calculate stats
    const totalSystems = systems.length;
    const completedSystems = systems.filter(s => s.currentStage > 11).length;
    const activeSystems = totalSystems - completedSystems;

    // Stages breakdown
    const stageCounts = Object.keys(STAGES).reduce((acc, key) => {
        const stageId = STAGES[key];
        acc[stageId] = systems.filter(s => s.currentStage === stageId).length;
        return acc;
    }, {});

    const stats = {
        total: totalSystems,
        active: activeSystems,
        completed: completedSystems,
        pending: activeSystems // Simplified for now
    };

    // Get recent systems (last 5)
    const recentSystems = [...systems]
        .sort((a, b) => b.serialNo.localeCompare(a.serialNo)) // Assuming newer serials are larger
        .slice(0, 5);

    // Mock Monthly Data (would come from real dates in a production app)
    const monthlyData = [12, 19, 15, 25, 22, 30];

    return (
        <div className="space-y-6 animate-fade-in pb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Dashboard Overview</h1>
                    <p className="text-slate-500">Welcome back! Here's your system activity at a glance.</p>
                </div>
                <div className="text-right hidden md:block">
                    <p className="text-sm font-medium text-slate-800">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
            </div>

            <DashboardStats stats={stats} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <QuickActions />
                    <DashboardCharts stageCounts={stageCounts} />
                </div>

                <div className="lg:col-span-1">
                    <RecentActivity recentSystems={recentSystems} />
                </div>

                <div className="lg:col-span-3">
                    <DashboardTrendChart monthlyData={monthlyData} />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
