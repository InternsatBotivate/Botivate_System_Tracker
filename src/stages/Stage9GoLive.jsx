import React, { useState } from 'react';
import { useSystem, STAGES, STAGE_NAMES } from '../context/SystemContext';
import { useAuth } from '../context/AuthContext';
import ReusableModal from '../components/ReusableModal';
import ReusableTable from '../components/StageTable';
import { ArrowRight, Rocket } from 'lucide-react';
import { calculateDelay } from '../utils/LocalStorageHelper';

const Stage9GoLive = () => {
    const { getPendingForStage, getHistoryForStage, updateSystemStage } = useSystem();
    const { user } = useAuth();

    const [selectedItem, setSelectedItem] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Additional Fields
    const [formData, setFormData] = useState({
        goLiveDoneBy: user?.name || '',
        deploymentType: 'Production',
        goLiveDate: new Date().toLocaleDateString('en-GB'),
        postGoLiveStatus: 'Smooth',
        initialSupportNotes: ''
    });

    // Tab State
    const [activeTab, setActiveTab] = useState('pending');

    const pendingItems = getPendingForStage(STAGES.GO_LIVE);
    const historyItems = getHistoryForStage(STAGES.GO_LIVE);

    const handleActionClick = (item) => {
        setSelectedItem(item);
        setFormData({
            goLiveDoneBy: user?.name || '',
            deploymentType: 'Production',
            goLiveDate: new Date().toLocaleDateString('en-GB'),
            postGoLiveStatus: 'Smooth',
            initialSupportNotes: ''
        });
        setIsModalOpen(true);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        updateSystemStage(selectedItem.serialNo, STAGES.GO_LIVE, formData);
        setIsModalOpen(false);
        setSelectedItem(null);
    };

    const getStage8Data = (item) => item.history[STAGES.USER_TRAINING] || {};
    const getStage9Data = (item) => item.history[STAGES.GO_LIVE] || {};

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-xl font-bold text-slate-800">Stage 9: {STAGE_NAMES[STAGES.GO_LIVE]}</h2>
                <p className="text-sm text-slate-500">Deploy system to production</p>
            </div>

            {/* Tabs */}
            <div className="flex gap-4 border-b border-sky-100">
                <button
                    onClick={() => setActiveTab('pending')}
                    className={`pb-2 px-4 text-sm font-medium transition-colors relative ${activeTab === 'pending'
                        ? 'text-sky-600 border-b-2 border-sky-600'
                        : 'text-slate-500 hover:text-slate-700'
                        }`}
                >
                    Pending Actions ({pendingItems.length})
                </button>
                <button
                    onClick={() => setActiveTab('history')}
                    className={`pb-2 px-4 text-sm font-medium transition-colors relative ${activeTab === 'history'
                        ? 'text-sky-600 border-b-2 border-sky-600'
                        : 'text-slate-500 hover:text-slate-700'
                        }`}
                >
                    History ({historyItems.length})
                </button>
            </div>

            {/* Content */}
            {activeTab === 'pending' ? (
                <div className="space-y-4 animate-in fade-in duration-300">
                    <ReusableTable
                        headers={['Action', 'Serial No.', 'System Name', 'Readiness', 'Training Feedback', 'Delay']}
                        data={pendingItems}
                        emptyMessage="No systems pending Go Live."
                        renderRow={(item, index) => {
                            const s8 = getStage8Data(item);
                            return (
                                <>
                                    <td className="px-4 py-3">
                                        <button
                                            onClick={() => handleActionClick(item)}
                                            className="px-3 py-1.5 bg-sky-500 text-white text-xs font-medium rounded hover:bg-sky-600 shadow-sm transition-colors flex items-center gap-1"
                                        >
                                            Action <ArrowRight size={12} />
                                        </button>
                                    </td>
                                    <td className="px-4 py-3 font-medium text-slate-700">{item.serialNo}</td>
                                    <td className="px-4 py-3 text-slate-800 font-semibold">{item.systemName}</td>
                                    <td className="px-4 py-3">
                                        <span className={`px-2 py-1 rounded text-xs font-bold border ${s8.userReadiness === 'Ready'
                                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                            : 'bg-amber-50 text-amber-700 border-amber-200'
                                            }`}>
                                            {s8.userReadiness}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-sm text-slate-500 max-w-xs truncate">{s8.trainingFeedback}</td>
                                    <td className="px-4 py-3 text-xs text-slate-500">{calculateDelay(item.requirementDate)} days</td>
                                </>
                            );
                        }}
                        renderCard={(item) => {
                            const s8 = getStage8Data(item);
                            return (
                                <div className="flex flex-col gap-3">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <span className="text-xs font-bold text-sky-600 bg-sky-50 px-2 py-0.5 rounded border border-sky-100">{item.serialNo}</span>
                                            <h4 className="font-bold text-slate-800 mt-1">{item.systemName}</h4>
                                        </div>
                                        <button
                                            onClick={() => handleActionClick(item)}
                                            className="px-3 py-1.5 bg-sky-500 text-white text-xs font-medium rounded hover:bg-sky-600 shadow-sm transition-colors flex items-center gap-1"
                                        >
                                            Action <ArrowRight size={12} />
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-2 gap-2 text-sm">
                                        <div className="bg-slate-50 p-2 rounded">
                                            <span className="block text-xs text-slate-400">Readiness</span>
                                            <span className={`font-medium ${s8.userReadiness === 'Ready' ? 'text-emerald-700' : 'text-amber-700'}`}>{s8.userReadiness}</span>
                                        </div>
                                        <div className="bg-slate-50 p-2 rounded">
                                            <span className="block text-xs text-slate-400">Feedback</span>
                                            <span className="font-medium text-slate-700 truncate">{s8.trainingFeedback}</span>
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                                        <span className="text-xs text-slate-500">Delay: {calculateDelay(item.requirementDate)} days</span>
                                    </div>
                                </div>
                            );
                        }}
                    />
                </div>
            ) : (
                <div className="space-y-4 animate-in fade-in duration-300">
                    <ReusableTable
                        headers={['Serial No.', 'System Name', 'Process System', 'Done By', 'Type', 'Date', 'Status', 'Support Notes', 'Delay']}
                        data={historyItems}
                        renderRow={(item, index) => {
                            const s9 = getStage9Data(item);
                            return (
                                <>
                                    <td className="px-4 py-3 font-medium text-slate-700">{item.serialNo}</td>
                                    <td className="px-4 py-3 text-slate-800">{item.systemName}</td>
                                    <td className="px-4 py-3 text-sm">{item.processSystem}</td>
                                    <td className="px-4 py-3 text-slate-600">{s9.goLiveDoneBy}</td>
                                    <td className="px-4 py-3 text-sm">{s9.deploymentType}</td>
                                    <td className="px-4 py-3 text-xs text-slate-500">{s9.goLiveDate}</td>
                                    <td className="px-4 py-3 text-sm font-medium text-emerald-600">{s9.postGoLiveStatus}</td>
                                    <td className="px-4 py-3 text-xs text-slate-500 max-w-xs">{s9.initialSupportNotes}</td>
                                    <td className="px-4 py-3 text-xs text-slate-500">{calculateDelay(item.requirementDate)} days</td>
                                </>
                            );
                        }}
                        renderCard={(item) => {
                            const s9 = getStage9Data(item);
                            return (
                                <div className="flex flex-col gap-3">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <span className="text-xs font-bold text-sky-600 bg-sky-50 px-2 py-0.5 rounded border border-sky-100">{item.serialNo}</span>
                                            <h4 className="font-bold text-slate-800 mt-1">{item.systemName}</h4>
                                        </div>
                                        <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                                            {s9.postGoLiveStatus}
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-2 gap-2 text-sm">
                                        <div className="bg-slate-50 p-2 rounded">
                                            <span className="block text-xs text-slate-400">Done By</span>
                                            <span className="font-medium text-slate-700">{s9.goLiveDoneBy}</span>
                                        </div>
                                        <div className="bg-slate-50 p-2 rounded">
                                            <span className="block text-xs text-slate-400">Type</span>
                                            <span className="font-medium text-slate-700">{s9.deploymentType}</span>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-2 text-sm">
                                        <div className="bg-slate-50 p-2 rounded">
                                            <span className="block text-xs text-slate-400">Date</span>
                                            <span className="font-medium text-slate-700">{s9.goLiveDate}</span>
                                        </div>
                                        <div className="bg-slate-50 p-2 rounded">
                                            <span className="block text-xs text-slate-400">Support Notes</span>
                                            <span className="font-medium text-slate-700 truncate">{s9.initialSupportNotes}</span>
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                                        <span className="text-xs text-slate-500">Delay: {calculateDelay(item.requirementDate)} days</span>
                                        <span className="text-xs text-slate-400">{item.processSystem}</span>
                                    </div>
                                </div>
                            );
                        }}
                    />
                </div>
            )}

            {/* Modal */}
            <ReusableModal
                title={`Go Live: ${selectedItem?.serialNo}`}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            >
                {selectedItem && (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Go Live Done By</label>
                                <input
                                    type="text"
                                    name="goLiveDoneBy"
                                    value={formData.goLiveDoneBy}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-sky-200 rounded-lg focus:outline-none focus:border-sky-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Deployment Type</label>
                                <select
                                    name="deploymentType"
                                    value={formData.deploymentType}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-sky-200 rounded-lg focus:outline-none focus:border-sky-500"
                                    required
                                >
                                    <option value="Production">Production</option>
                                    <option value="Pilot">Pilot</option>
                                    <option value="Beta">Beta</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Go Live Date</label>
                                <input
                                    type="text"
                                    name="goLiveDate"
                                    value={formData.goLiveDate}
                                    readOnly
                                    className="w-full px-3 py-2 border border-sky-200 rounded-lg bg-slate-50 focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                                <select
                                    name="postGoLiveStatus"
                                    value={formData.postGoLiveStatus}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-sky-200 rounded-lg focus:outline-none focus:border-sky-500"
                                    required
                                >
                                    <option value="Smooth">Smooth</option>
                                    <option value="Issues Found">Issues Found</option>
                                </select>
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-slate-700 mb-1">Initial Support Notes</label>
                                <textarea
                                    name="initialSupportNotes"
                                    value={formData.initialSupportNotes}
                                    onChange={handleInputChange}
                                    rows="2"
                                    className="w-full px-3 py-2 border border-sky-200 rounded-lg focus:outline-none focus:border-sky-500"
                                ></textarea>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors">Cancel</button>
                            <button type="submit" className="px-6 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 shadow-md shadow-sky-500/20 transition-all font-medium">Save & Proceed</button>
                        </div>
                    </form>
                )}
            </ReusableModal>
        </div>
    );
};

export default Stage9GoLive;
