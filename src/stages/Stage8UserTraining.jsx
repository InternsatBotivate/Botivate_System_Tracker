import React, { useState } from 'react';
import { useSystem, STAGES, STAGE_NAMES } from '../context/SystemContext';
import { useAuth } from '../context/AuthContext';
import ReusableModal from '../components/ReusableModal';
import ReusableTable from '../components/StageTable';
import { ArrowRight, GraduationCap } from 'lucide-react';
import { calculateDelay } from '../utils/LocalStorageHelper';

const Stage8UserTraining = () => {
    const { getPendingForStage, getHistoryForStage, updateSystemStage } = useSystem();
    const { user } = useAuth();

    const [selectedItem, setSelectedItem] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Additional Fields
    const [formData, setFormData] = useState({
        trainingGivenBy: user?.name || '',
        trainingMode: 'Online',
        trainingDuration: '',
        trainingFeedback: '',
        userReadiness: 'Ready'
    });

    // Tab State
    const [activeTab, setActiveTab] = useState('pending');

    const pendingItems = getPendingForStage(STAGES.USER_TRAINING);
    const historyItems = getHistoryForStage(STAGES.USER_TRAINING);

    const handleActionClick = (item) => {
        setSelectedItem(item);
        setFormData({
            trainingGivenBy: user?.name || '',
            trainingMode: 'Online',
            trainingDuration: '',
            trainingFeedback: '',
            userReadiness: 'Ready'
        });
        setIsModalOpen(true);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        updateSystemStage(selectedItem.serialNo, STAGES.USER_TRAINING, formData);
        setIsModalOpen(false);
        setSelectedItem(null);
    };

    const getStage7Data = (item) => item.history[STAGES.CODE_REVIEW] || {};
    const getStage8Data = (item) => item.history[STAGES.USER_TRAINING] || {};

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-xl font-bold text-slate-800">Stage 8: {STAGE_NAMES[STAGES.USER_TRAINING]}</h2>
                <p className="text-sm text-slate-500">Train users and gather feedback</p>
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
                        headers={['Action', 'Serial No.', 'System Name', 'Reviewed By', 'Quality', 'Delay']}
                        data={pendingItems}
                        emptyMessage="No systems pending training."
                        renderRow={(item, index) => {
                            const s7 = getStage7Data(item);
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
                                    <td className="px-4 py-3 text-slate-600">{s7.reviewedBy}</td>
                                    <td className="px-4 py-3">{s7.codeQualityRating}</td>
                                    <td className="px-4 py-3 text-xs text-slate-500">{calculateDelay(item.requirementDate)} days</td>
                                </>
                            );
                        }}
                    />
                </div>
            ) : (
                <div className="space-y-4 animate-in fade-in duration-300">
                    <ReusableTable
                        headers={['Serial No.', 'System Name', 'Process System', 'Trainer', 'Mode', 'Duration', 'Readiness', 'Feedback', 'Delay']}
                        data={historyItems}
                        renderRow={(item, index) => {
                            const s8 = getStage8Data(item);
                            return (
                                <>
                                    <td className="px-4 py-3 font-medium text-slate-700">{item.serialNo}</td>
                                    <td className="px-4 py-3 text-slate-800">{item.systemName}</td>
                                    <td className="px-4 py-3 text-sm">{item.processSystem}</td>
                                    <td className="px-4 py-3 text-slate-600">{s8.trainingGivenBy}</td>
                                    <td className="px-4 py-3">{s8.trainingMode}</td>
                                    <td className="px-4 py-3">{s8.trainingDuration} hrs</td>
                                    <td className="px-4 py-3">
                                        <span className={`px-2 py-1 rounded text-xs font-bold border ${s8.userReadiness === 'Ready'
                                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                            : 'bg-amber-50 text-amber-700 border-amber-200'
                                            }`}>
                                            {s8.userReadiness}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-xs text-slate-500 max-w-xs">{s8.trainingFeedback}</td>
                                    <td className="px-4 py-3 text-xs text-slate-500">{calculateDelay(item.requirementDate)} days</td>
                                </>
                            );
                        }}
                    />
                </div>
            )}

            {/* Modal */}
            <ReusableModal
                title={`User Training: ${selectedItem?.serialNo}`}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            >
                {selectedItem && (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Training Given By</label>
                                <input
                                    type="text"
                                    name="trainingGivenBy"
                                    value={formData.trainingGivenBy}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-sky-200 rounded-lg focus:outline-none focus:border-sky-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Training Mode</label>
                                <select
                                    name="trainingMode"
                                    value={formData.trainingMode}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-sky-200 rounded-lg focus:outline-none focus:border-sky-500"
                                    required
                                >
                                    <option value="Online">Online</option>
                                    <option value="Offline">Offline</option>
                                    <option value="Hybrid">Hybrid</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Duration (Hours)</label>
                                <input
                                    type="number"
                                    name="trainingDuration"
                                    value={formData.trainingDuration}
                                    onChange={handleInputChange}
                                    min="0.5" step="0.5"
                                    className="w-full px-3 py-2 border border-sky-200 rounded-lg focus:outline-none focus:border-sky-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">User Readiness</label>
                                <select
                                    name="userReadiness"
                                    value={formData.userReadiness}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-sky-200 rounded-lg focus:outline-none focus:border-sky-500"
                                    required
                                >
                                    <option value="Ready">Ready</option>
                                    <option value="Needs Support">Needs Support</option>
                                </select>
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-slate-700 mb-1">Training Feedback</label>
                                <textarea
                                    name="trainingFeedback"
                                    value={formData.trainingFeedback}
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

export default Stage8UserTraining;
