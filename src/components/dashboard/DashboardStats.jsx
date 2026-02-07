import {
    Briefcase,
    Activity,
    CheckCircle,
    Clock,
    TrendingUp,
    AlertCircle
} from 'lucide-react';
import PropTypes from 'prop-types';

const StatCard = ({ title, value, subtext, icon: Icon, color, trend }) => (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-sky-100 hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between mb-4">
            <div className={`p-3 rounded-xl ${color} bg-opacity-10`}>
                <Icon size={24} className={color.replace('bg-', 'text-')} />
            </div>
            {trend && (
                <div className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${trend >= 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                    <TrendingUp size={12} className={trend < 0 ? 'rotate-180' : ''} />
                    {Math.abs(trend)}%
                </div>
            )}
        </div>
        <div>
            <h3 className="text-3xl font-bold text-slate-800 mb-1">{value}</h3>
            <p className="text-slate-500 text-sm font-medium">{title}</p>
            {subtext && <p className="text-slate-400 text-xs mt-1">{subtext}</p>}
        </div>
    </div>
);

StatCard.propTypes = {
    title: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    subtext: PropTypes.string,
    icon: PropTypes.elementType.isRequired,
    color: PropTypes.string.isRequired,
    trend: PropTypes.number
};

const DashboardStats = ({ stats }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
                title="Total Systems"
                value={stats.total}
                subtext="All stored records"
                icon={Briefcase}
                color="bg-sky-500"
                trend={12}
            />
            <StatCard
                title="Active Projects"
                value={stats.active}
                subtext="Currently in progress"
                icon={Activity}
                color="bg-amber-500"
                trend={5}
            />
            <StatCard
                title="Completed"
                value={stats.completed}
                subtext="Deployed & Live"
                icon={CheckCircle}
                color="bg-emerald-500"
                trend={8}
            />
            <StatCard
                title="Pending Actions"
                value={stats.pending}
                subtext="Requires attention"
                icon={AlertCircle}
                color="bg-purple-500"
                trend={-2}
            />
        </div>
    );
};

DashboardStats.propTypes = {
    stats: PropTypes.shape({
        total: PropTypes.number.isRequired,
        active: PropTypes.number.isRequired,
        completed: PropTypes.number.isRequired,
        pending: PropTypes.number.isRequired
    }).isRequired
};

export default DashboardStats;
