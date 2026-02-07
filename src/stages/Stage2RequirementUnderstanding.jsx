import React, { useState } from 'react';
import { useSystem, STAGES, STAGE_NAMES } from '../context/SystemContext';
import { useAuth } from '../context/AuthContext';
import ReusableModal from '../components/ReusableModal';
import ReusableTable from '../components/StageTable';
import { ArrowRight, Image as ImageIcon, Link as LinkIcon } from 'lucide-react';
import { calculateDelay } from '../utils/LocalStorageHelper';

const Stage2RequirementUnderstanding = () => {
    const { getPendingForStage, getHistoryForStage, updateSystemStage } = useSystem();
    const { user } = useAuth();

    const [selectedItem, setSelectedItem] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Additional Fields
    const [formData, setFormData] = useState({
        requirementUnderstandingBy: user?.name || '',
        uploadImage: '', // URL or Path
        remarks: ''
    });

    // Tab State
    const [activeTab, setActiveTab] = useState('pending'); // 'pending' or 'history'

    const pendingItems = getPendingForStage(STAGES.REQUIREMENT_UNDERSTANDING);
    const historyItems = getHistoryForStage(STAGES.REQUIREMENT_UNDERSTANDING);

    const handleActionClick = (item) => {
        setSelectedItem(item);
        setFormData({
            requirementUnderstandingBy: user?.name || '',
            uploadImage: '',
            remarks: ''
        });
        setIsModalOpen(true);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        updateSystemStage(selectedItem.serialNo, STAGES.REQUIREMENT_UNDERSTANDING, formData);
        setIsModalOpen(false);
        setSelectedItem(null);
    };

    // Helper to get previous stage data safely
    const getStage1Data = (item) => item.history[STAGES.REQUIREMENT_UPDATE] || {};
    const getStage2Data = (item) => item.history[STAGES.REQUIREMENT_UNDERSTANDING] || {};

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h2 className="text-xl font-bold text-slate-800">Stage 2: {STAGE_NAMES[STAGES.REQUIREMENT_UNDERSTANDING]}</h2>
                <p className="text-sm text-slate-500">Review requirements and confirm understanding</p>
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
                        headers={['Action', 'Serial No.', 'Posted By', 'System Name', 'Process System', 'Reason', 'Any Link', 'Date', 'Delay']}
                        data={pendingItems}
                        emptyMessage="No pending requirements found."
                        renderRow={(item, index) => {
                            const s1 = getStage1Data(item);
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
                                    <td className="px-4 py-3 text-slate-600">{s1.postedBy}</td>
                                    <td className="px-4 py-3 text-slate-800 font-semibold">{item.systemName}</td>
                                    <td className="px-4 py-3 text-sm">{item.processSystem}</td>
                                    <td className="px-4 py-3 text-xs text-slate-500 max-w-xs truncate" title={item.reason}>{item.reason}</td>
                                    <td className="px-4 py-3 text-sky-600">{item.anyLink ? 'Yes' : 'No'}</td>
                                    <td className="px-4 py-3 text-xs text-slate-400">{item.requirementDate}</td>
                                    <td className="px-4 py-3 text-xs text-slate-500">{calculateDelay(item.requirementDate)} days</td>
                                </>
                            );
                        }}
                    />
                </div>
            ) : (
                <div className="space-y-4 animate-in fade-in duration-300">
                    <ReusableTable
                        headers={['Serial No.', 'System Name', 'Process System', 'Understanding By', 'Remarks', 'Image', 'Date', 'Delay']}
                        data={historyItems}
                        renderRow={(item, index) => {
                            const s2 = getStage2Data(item);
                            return (
                                <>
                                    <td className="px-4 py-3 font-medium text-slate-700">{item.serialNo}</td>
                                    <td className="px-4 py-3 text-slate-800">{item.systemName}</td>
                                    <td className="px-4 py-3 text-sm">{item.processSystem}</td>
                                    <td className="px-4 py-3 text-slate-600">{s2.requirementUnderstandingBy}</td>
                                    <td className="px-4 py-3 text-sm text-slate-500 max-w-xs truncate">{s2.remarks}</td>
                                    <td className="px-4 py-3 text-sky-600">
                                        {s2.uploadImage ? <ImageIcon size={16} /> : '-'}
                                    </td>
                                    <td className="px-4 py-3 text-xs text-slate-400">{item.requirementDate}</td>
                                    <td className="px-4 py-3 text-xs text-slate-500">{calculateDelay(item.requirementDate)} days</td>
                                </>
                            );
                        }}
                    />
                </div>
            )}

            {/* Action Modal */}
            <ReusableModal
                title={`Requirement Understanding: ${selectedItem?.serialNo}`}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            >
                {selectedItem && (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Read-only Context from Stage 1 */}
                        <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 text-sm space-y-3">
                            <h4 className="font-semibold text-slate-700 border-b border-slate-200 pb-2">Requirement Details</h4>
                            <div className="grid grid-cols-2 gap-4 text-slate-600">
                                <div><span className="font-medium">Posted By:</span> {getStage1Data(selectedItem).postedBy}</div>
                                <div><span className="font-medium">System Name:</span> {selectedItem.systemName}</div>
                                <div><span className="font-medium">Process:</span> {selectedItem.processSystem}</div>
                                <div className="col-span-2"><span className="font-medium">Reason:</span> {selectedItem.reason}</div>
                            </div>
                        </div>

                        {/* New Input Fields */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Understanding By</label>
                                <input
                                    type="text"
                                    name="requirementUnderstandingBy"
                                    value={formData.requirementUnderstandingBy}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-sky-200 rounded-lg focus:outline-none focus:border-sky-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Upload Image (URL)</label>
                                <input
                                    type="text"
                                    name="uploadImage"
                                    value={formData.uploadImage}
                                    onChange={handleInputChange}
                                    placeholder="http://..."
                                    className="w-full px-3 py-2 border border-sky-200 rounded-lg focus:outline-none focus:border-sky-500"
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-slate-700 mb-1">Remarks</label>
                                <textarea
                                    name="remarks"
                                    value={formData.remarks}
                                    onChange={handleInputChange}
                                    rows="3"
                                    className="w-full px-3 py-2 border border-sky-200 rounded-lg focus:outline-none focus:border-sky-500"
                                ></textarea>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                            <button
                                type="button"
                                onClick={() => setIsModalOpen(false)}
                                className="px-4 py-2 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-6 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 shadow-md shadow-sky-500/20 transition-all font-medium"
                            >
                                Save & Proceed
                            </button>
                        </div>
                    </form>
                )}
            </ReusableModal>
        </div>
    );
};

export default Stage2RequirementUnderstanding;
