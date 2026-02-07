import React from 'react';
import { useSystem, STAGES, STAGE_NAMES } from '../context/SystemContext';
import {
    BarChart,
    Activity,
    CheckCircle,
    Clock,
    Briefcase
} from 'lucide-react';

const Dashboard = () => {
    const { systems, loading } = useSystem();

    if (loading) {
        return <div className="p-8 text-center text-slate-500">Loading dashboard...</div>;
    }

    // Calculate stats
    const totalSystems = systems.length;
    const completedSystems = systems.filter(s => s.currentStage > 11).length; // Assuming > 11 is 'Done' done? Or Stage 11 completed?
    // Stage 11 is MIS Integration and if it's done index moves to 12? user didn't specify what happens after 11.
    // We can assume currentStage > STAGES.MIS_INTEGRATION implies fully done in some sense.

    // Stages breakdown
    const stageCounts = Object.keys(STAGES).reduce((acc, key) => {
        const stageId = STAGES[key];
        acc[stageId] = systems.filter(s => s.currentStage === stageId).length;
        return acc;
    }, {});

    const StatCard = ({ title, value, icon: Icon, color }) => (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-sky-100 flex items-start justify-between">
            <div>
                <p className="text-slate-500 text-sm font-medium mb-1">{title}</p>
                <h3 className="text-2xl font-bold text-slate-800">{value}</h3>
            </div>
            <div className={`p-3 rounded-lg ${color}`}>
                <Icon size={24} className="opacity-80" />
            </div>
        </div>
    );

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    title="Total Systems"
                    value={totalSystems}
                    icon={Briefcase}
                    color="bg-sky-100 text-sky-600"
                />
                <StatCard
                    title="In Progress"
                    value={totalSystems - completedSystems}
                    icon={Activity}
                    color="bg-amber-100 text-amber-600"
                />
                <StatCard
                    title="Completed"
                    value={completedSystems}
                    icon={CheckCircle}
                    color="bg-emerald-100 text-emerald-600"
                />
                <StatCard
                    title="Pending Actions"
                    value={systems.length} // Just a dummy, 'Pending Actions' implies user has to do something?
                    icon={Clock}
                    color="bg-purple-100 text-purple-600"
                />
            </div>

            {/* Stage Breakdown */}
            <div className="bg-white rounded-xl shadow-sm border border-sky-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-sky-100">
                    <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                        <BarChart size={20} className="text-sky-500" />
                        Stage Distribution
                    </h3>
                </div>
                <div className="p-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {Object.entries(STAGE_NAMES).map(([id, name]) => {
                            const count = stageCounts[id] || 0;
                            return (
                                <div key={id} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-100">
                                    <span className="text-sm font-medium text-slate-700 truncate mr-2" title={name}>
                                        {id}. {name}
                                    </span>
                                    <span className="px-2.5 py-1 rounded-md bg-white text-xs font-bold text-sky-600 border border-sky-100">
                                        {count}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
