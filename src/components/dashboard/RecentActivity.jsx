import { Clock, FileText, ArrowRight } from 'lucide-react';
import { STAGE_NAMES } from '../../context/SystemContext';
import PropTypes from 'prop-types';

const RecentActivity = ({ recentSystems }) => {
    return (
        <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-sm border border-sky-100 h-full flex flex-col">
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Clock size={20} className="text-sky-500" />
                Recent Activity
            </h3>

            <div className="space-y-4 flex-grow">
                {recentSystems.length > 0 ? (
                    recentSystems.map((system, index) => (
                        <div key={system.serialNo || index} className="relative pl-6 pb-2 border-l border-sky-100 last:border-0">
                            <div className="absolute left-[-5px] top-1 w-2.5 h-2.5 rounded-full bg-sky-400 ring-4 ring-sky-50"></div>
                            <div className="flex flex-col gap-1">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-semibold text-slate-700">{system.serialNo}</span>
                                    <span className="text-[10px] font-medium text-slate-400 bg-slate-50 px-2 py-0.5 rounded-full border border-slate-100">
                                        {system.requirementDate}
                                    </span>
                                </div>
                                <p className="text-xs text-slate-500">
                                    Moved to <span className="font-medium text-sky-600">{STAGE_NAMES[system.currentStage]}</span>
                                </p>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-8 text-slate-400 text-sm">
                        No recent activity found.
                    </div>
                )}
            </div>

            <button className="w-full mt-4 py-2 flex items-center justify-center gap-1 text-xs font-medium text-sky-600 hover:text-sky-700 hover:bg-sky-50 rounded-lg transition-colors">
                View Timeline <ArrowRight size={14} />
            </button>
        </div>
    );
};

RecentActivity.propTypes = {
    recentSystems: PropTypes.array.isRequired
};

export default RecentActivity;
