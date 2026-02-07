import React, { useState } from 'react';
import { useSystem, STAGES, STAGE_NAMES } from '../context/SystemContext';
import { useAuth } from '../context/AuthContext';
import ReusableModal from '../components/ReusableModal';
import ReusableTable from '../components/StageTable';
import { ArrowRight, Database } from 'lucide-react';
import { calculateDelay } from '../utils/LocalStorageHelper';

const Stage11MISIntegration = () => {
    const { getPendingForStage, getHistoryForStage, updateSystemStage } = useSystem();
    const { user } = useAuth();

    const [selectedItem, setSelectedItem] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Additional Fields
    const [formData, setFormData] = useState({
        misIntegratedBy: user?.name || '',
        misModuleName: '',
        integrationStatus: 'Completed',
        misReferenceId: '',
        reportingEnabled: 'Yes',
        integrationRemarks: ''
    });

    // Tab State
    const [activeTab, setActiveTab] = useState('pending');

    const pendingItems = getPendingForStage(STAGES.MIS_INTEGRATION);
    const historyItems = getHistoryForStage(STAGES.MIS_INTEGRATION);

    const handleActionClick = (item) => {
        setSelectedItem(item);
        setFormData({
            misIntegratedBy: user?.name || '',
            misModuleName: '',
            integrationStatus: 'Completed',
            misReferenceId: '',
            reportingEnabled: 'Yes',
            integrationRemarks: ''
        });
        setIsModalOpen(true);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        updateSystemStage(selectedItem.serialNo, STAGES.MIS_INTEGRATION, formData);
        setIsModalOpen(false);
        setSelectedItem(null);
    };

    const getStage10Data = (item) => item.history[STAGES.SYSTEM_INDEXING] || {};
    const getStage11Data = (item) => item.history[STAGES.MIS_INTEGRATION] || {};

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-xl font-bold text-slate-800">Stage 11: {STAGE_NAMES[STAGES.MIS_INTEGRATION]}</h2>
                <p className="text-sm text-slate-500">Integrate with Management Information System</p>
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
                        headers={['Action', 'Serial No.', 'System Name', 'Category', 'Ref Code', 'Delay']}
                        data={pendingItems}
                        emptyMessage="No systems pending integration."
                        renderRow={(item, index) => {
                            const s10 = getStage10Data(item);
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
                                    <td className="px-4 py-3 text-sm">{s10.systemCategory}</td>
                                    <td className="px-4 py-3 font-mono text-xs">{s10.indexReferenceCode}</td>
                                    <td className="px-4 py-3 text-xs text-slate-500">{calculateDelay(item.requirementDate)} days</td>
                                </>
                            );
                        }}
                        renderCard={(item) => {
                            const s10 = getStage10Data(item);
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
                                            <span className="block text-xs text-slate-400">Category</span>
                                            <span className="font-medium text-slate-700">{s10.systemCategory}</span>
                                        </div>
                                        <div className="bg-slate-50 p-2 rounded">
                                            <span className="block text-xs text-slate-400">Ref Code</span>
                                            <span className="font-medium text-slate-700 font-mono text-xs">{s10.indexReferenceCode}</span>
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
                        headers={['Serial No.', 'System Name', 'Process System', 'Module', 'Status', 'Ref ID', 'Reporting', 'Remarks', 'Delay']}
                        data={historyItems}
                        renderRow={(item, index) => {
                            const s11 = getStage11Data(item);
                            return (
                                <>
                                    <td className="px-4 py-3 font-medium text-slate-700">{item.serialNo}</td>
                                    <td className="px-4 py-3 text-slate-800">{item.systemName}</td>
                                    <td className="px-4 py-3 text-sm">{item.processSystem}</td>
                                    <td className="px-4 py-3 text-slate-600">{s11.misModuleName}</td>
                                    <td className="px-4 py-3">
                                        <span className={`px-2 py-1 rounded text-xs font-bold border ${s11.integrationStatus === 'Completed'
                                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                            : 'bg-amber-50 text-amber-700 border-amber-200'
                                            }`}>
                                            {s11.integrationStatus}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 font-mono text-xs">{s11.misReferenceId}</td>
                                    <td className="px-4 py-3 text-xs">{s11.reportingEnabled}</td>
                                    <td className="px-4 py-3 text-xs text-slate-500 max-w-xs">{s11.integrationRemarks}</td>
                                    <td className="px-4 py-3 text-xs text-slate-500">{calculateDelay(item.requirementDate)} days</td>
                                </>
                            );
                        }}
                        renderCard={(item) => {
                            const s11 = getStage11Data(item);
                            return (
                                <div className="flex flex-col gap-3">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <span className="text-xs font-bold text-sky-600 bg-sky-50 px-2 py-0.5 rounded border border-sky-100">{item.serialNo}</span>
                                            <h4 className="font-bold text-slate-800 mt-1">{item.systemName}</h4>
                                        </div>
                                        <span className={`px-2 py-0.5 rounded text-xs font-bold border ${s11.integrationStatus === 'Completed'
                                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                            : 'bg-amber-50 text-amber-700 border-amber-200'
                                            }`}>
                                            {s11.integrationStatus}
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-2 gap-2 text-sm">
                                        <div className="bg-slate-50 p-2 rounded">
                                            <span className="block text-xs text-slate-400">Module</span>
                                            <span className="font-medium text-slate-700">{s11.misModuleName}</span>
                                        </div>
                                        <div className="bg-slate-50 p-2 rounded">
                                            <span className="block text-xs text-slate-400">Ref ID</span>
                                            <span className="font-medium text-slate-700 font-mono text-xs">{s11.misReferenceId}</span>
                                        </div>
                                    </div>

                                    {s11.integrationRemarks && (
                                        <div className="text-sm text-slate-600 bg-slate-50 p-2 rounded border border-slate-100">
                                            <span className="block text-xs text-slate-400 mb-1">Remarks</span>
                                            {s11.integrationRemarks}
                                        </div>
                                    )}

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
                title={`MIS Integration: ${selectedItem?.serialNo}`}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            >
                {selectedItem && (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Integrated By</label>
                                <input
                                    type="text"
                                    name="misIntegratedBy"
                                    value={formData.misIntegratedBy}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-sky-200 rounded-lg focus:outline-none focus:border-sky-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">MIS Module Name</label>
                                <input
                                    type="text"
                                    name="misModuleName"
                                    value={formData.misModuleName}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-sky-200 rounded-lg focus:outline-none focus:border-sky-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Integration Status</label>
                                <select
                                    name="integrationStatus"
                                    value={formData.integrationStatus}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-sky-200 rounded-lg focus:outline-none focus:border-sky-500"
                                    required
                                >
                                    <option value="Completed">Completed</option>
                                    <option value="Partial">Partial</option>
                                    <option value="Failed">Failed</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">MIS Reference ID</label>
                                <input
                                    type="text"
                                    name="misReferenceId"
                                    value={formData.misReferenceId}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-sky-200 rounded-lg focus:outline-none focus:border-sky-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Reporting Enabled</label>
                                <select
                                    name="reportingEnabled"
                                    value={formData.reportingEnabled}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-sky-200 rounded-lg focus:outline-none focus:border-sky-500"
                                    required
                                >
                                    <option value="Yes">Yes</option>
                                    <option value="No">No</option>
                                </select>
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-slate-700 mb-1">Integration Remarks</label>
                                <textarea
                                    name="integrationRemarks"
                                    value={formData.integrationRemarks}
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

export default Stage11MISIntegration;
