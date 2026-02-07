import React, { useState } from 'react';
import { useSystem, STAGES, STAGE_NAMES } from '../context/SystemContext';
import { useAuth } from '../context/AuthContext';
import ReusableModal from '../components/ReusableModal';
import ReusableTable from '../components/StageTable';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { calculateDelay } from '../utils/LocalStorageHelper';

const Stage5FinalDesignApproval = () => {
    const { getPendingForStage, getHistoryForStage, updateSystemStage } = useSystem();
    const { user } = useAuth();

    const [selectedItem, setSelectedItem] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Additional Fields
    const [formData, setFormData] = useState({
        finalApprovalBy: user?.name || '',
        approvalStatus: 'Approved',
        finalRemarks: ''
    });

    // Tab State
    const [activeTab, setActiveTab] = useState('pending');

    const pendingItems = getPendingForStage(STAGES.FINAL_DESIGN_APPROVAL);
    const historyItems = getHistoryForStage(STAGES.FINAL_DESIGN_APPROVAL);

    const handleActionClick = (item) => {
        setSelectedItem(item);
        setFormData({
            finalApprovalBy: user?.name || '',
            approvalStatus: 'Approved',
            finalRemarks: ''
        });
        setIsModalOpen(true);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        updateSystemStage(selectedItem.serialNo, STAGES.FINAL_DESIGN_APPROVAL, formData);
        setIsModalOpen(false);
        setSelectedItem(null);
    };

    const getStage4Data = (item) => item.history[STAGES.DESIGN_UPDATE] || {};
    const getStage5Data = (item) => item.history[STAGES.FINAL_DESIGN_APPROVAL] || {};

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-xl font-bold text-slate-800">Stage 5: {STAGE_NAMES[STAGES.FINAL_DESIGN_APPROVAL]}</h2>
                <p className="text-sm text-slate-500">Final approval before testing</p>
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
                        headers={['Action', 'Serial No.', 'System Name', 'Updated From', 'Remarks', 'Delay']}
                        data={pendingItems}
                        emptyMessage="No designs pending approval."
                        renderRow={(item, index) => {
                            const s4 = getStage4Data(item);
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
                                    <td className="px-4 py-3 text-slate-600">{s4.takeUpdateFrom}</td>
                                    <td className="px-4 py-3 text-sm text-slate-500 max-w-xs">{s4.remarks}</td>
                                    <td className="px-4 py-3 text-xs text-slate-500">{calculateDelay(item.requirementDate)} days</td>
                                </>
                            );
                        }}
                    />
                </div>
            ) : (
                <div className="space-y-4 animate-in fade-in duration-300">
                    <ReusableTable
                        headers={['Serial No.', 'System Name', 'Process System', 'Approved By', 'Status', 'Remarks', 'Delay']}
                        data={historyItems}
                        renderRow={(item, index) => {
                            const s5 = getStage5Data(item);
                            return (
                                <>
                                    <td className="px-4 py-3 font-medium text-slate-700">{item.serialNo}</td>
                                    <td className="px-4 py-3 text-slate-800">{item.systemName}</td>
                                    <td className="px-4 py-3 text-sm">{item.processSystem}</td>
                                    <td className="px-4 py-3 text-slate-600">{s5.finalApprovalBy}</td>
                                    <td className="px-4 py-3">
                                        <span className={`px-2 py-1 rounded text-xs font-bold border ${s5.approvalStatus === 'Approved'
                                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                            : 'bg-red-50 text-red-700 border-red-200'
                                            }`}>
                                            {s5.approvalStatus}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-sm text-slate-500">{s5.finalRemarks}</td>
                                    <td className="px-4 py-3 text-xs text-slate-500">{calculateDelay(item.requirementDate)} days</td>
                                </>
                            );
                        }}
                    />
                </div>
            )}

            {/* Modal */}
            <ReusableModal
                title={`Final Approval: ${selectedItem?.serialNo}`}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            >
                {selectedItem && (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Final Approval By</label>
                                <input
                                    type="text"
                                    name="finalApprovalBy"
                                    value={formData.finalApprovalBy}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-sky-200 rounded-lg focus:outline-none focus:border-sky-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Approval Status</label>
                                <select
                                    name="approvalStatus"
                                    value={formData.approvalStatus}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-sky-200 rounded-lg focus:outline-none focus:border-sky-500"
                                    required
                                >
                                    <option value="Approved">Approved</option>
                                    <option value="Changes Required">Changes Required</option>
                                </select>
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-slate-700 mb-1">Final Remarks</label>
                                <textarea
                                    name="finalRemarks"
                                    value={formData.finalRemarks}
                                    onChange={handleInputChange}
                                    rows="3"
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

export default Stage5FinalDesignApproval;
