import {
    FilePlus,
    FileText,
    Settings,
    PieChart,
    Plus
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const QuickActions = () => {
    const navigate = useNavigate();

    const actions = [
        {
            label: "New Requirement",
            icon: FilePlus,
            path: "/stage-1",
            color: "from-sky-500 to-blue-600",
            shadow: "shadow-sky-500/25"
        },
        {
            label: "All Systems",
            icon: FileText,
            path: "/stage-10", // Using System Indexing as 'All Systems' list for now
            color: "from-violet-500 to-purple-600",
            shadow: "shadow-violet-500/25"
        },
        {
            label: "Generate Report",
            icon: PieChart,
            path: "/stage-11", // MIS
            color: "from-emerald-500 to-teal-600",
            shadow: "shadow-emerald-500/25"
        },
        {
            label: "Settings",
            icon: Settings,
            path: "/settings",
            color: "from-slate-700 to-slate-800",
            shadow: "shadow-slate-500/25"
        }
    ];

    return (
        <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-sm border border-sky-100">
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Plus size={20} className="text-sky-500" />
                Quick Actions
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {actions.map((action) => {
                    const Icon = action.icon;
                    return (
                        <button
                            key={action.label}
                            onClick={() => navigate(action.path)}
                            className={`
                                group relative overflow-hidden rounded-xl p-4 text-left transition-all duration-300
                                hover:-translate-y-1 hover:shadow-lg ${action.shadow}
                                bg-gradient-to-br ${action.color}
                            `}
                        >
                            <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                                <Icon size={48} />
                            </div>
                            <div className="relative z-10">
                                <div className="w-10 h-10 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center mb-3 group-hover:bg-white/30 transition-colors">
                                    <Icon size={20} className="text-white" />
                                </div>
                                <p className="text-white font-semibold text-sm leading-tight">
                                    {action.label.split(' ').map((word, i) => (
                                        <span key={i} className="block">{word}</span>
                                    ))}
                                </p>
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default QuickActions;
