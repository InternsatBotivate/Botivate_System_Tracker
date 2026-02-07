import React, { useState } from 'react';
import { useSystem, STAGES, STAGE_NAMES } from '../context/SystemContext';
import { useAuth } from '../context/AuthContext';
import ReusableModal from '../components/ReusableModal';
import ReusableTable from '../components/StageTable';
import { ArrowRight, Palette, Link as LinkIcon, ExternalLink } from 'lucide-react';
import { calculateDelay } from '../utils/LocalStorageHelper';

const Stage3SampleDesign = () => {
    const { getPendingForStage, getHistoryForStage, updateSystemStage } = useSystem();
    const { user } = useAuth();

    const [selectedItem, setSelectedItem] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Additional Fields
    const [formData, setFormData] = useState({
        designCreateBy: user?.name || '',
        designExplainTo: '',
        urlOfDesign: ''
    });

    // Tab State
    const [activeTab, setActiveTab] = useState('pending');

    const pendingItems = getPendingForStage(STAGES.SAMPLE_DESIGN);
    const historyItems = getHistoryForStage(STAGES.SAMPLE_DESIGN);

    const handleActionClick = (item) => {
        setSelectedItem(item);
        setFormData({
            designCreateBy: user?.name || '',
            designExplainTo: '',
            urlOfDesign: ''
        });
        setIsModalOpen(true);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        updateSystemStage(selectedItem.serialNo, STAGES.SAMPLE_DESIGN, formData);
        setIsModalOpen(false);
        setSelectedItem(null);
    };

    const getStage2Data = (item) => item.history[STAGES.REQUIREMENT_UNDERSTANDING] || {};
    const getStage3Data = (item) => item.history[STAGES.SAMPLE_DESIGN] || {};

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-xl font-bold text-slate-800">Stage 3: {STAGE_NAMES[STAGES.SAMPLE_DESIGN]}</h2>
                <p className="text-sm text-slate-500">Create and share initial designs</p>
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
                        headers={['Action', 'Serial No.', 'System Name', 'Understanding By', 'Design Remarks', 'Process', 'Delay']}
                        data={pendingItems}
                        emptyMessage="No pending designs."
                        renderRow={(item, index) => {
                            const s2 = getStage2Data(item);
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
                                    <td className="px-4 py-3 text-slate-600">{s2.requirementUnderstandingBy}</td>
                                    <td className="px-4 py-3 text-sm text-slate-500 max-w-xs truncate">{s2.remarks}</td>
                                    <td className="px-4 py-3 text-sm">{item.processSystem}</td>
                                    <td className="px-4 py-3 text-xs text-slate-500">{calculateDelay(item.requirementDate)} days</td>
                                </>
                            );
                        }}
                        renderCard={(item) => {
                            const s2 = getStage2Data(item);
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
                                            <span className="block text-xs text-slate-400">Process</span>
                                            <span className="font-medium text-slate-700">{item.processSystem}</span>
                                        </div>
                                        <div className="bg-slate-50 p-2 rounded">
                                            <span className="block text-xs text-slate-400">Und. By</span>
                                            <span className="font-medium text-slate-700">{s2.requirementUnderstandingBy}</span>
                                        </div>
                                    </div>

                                    {s2.remarks && (
                                        <div className="text-sm text-slate-600 bg-slate-50 p-2 rounded border border-slate-100">
                                            <span className="block text-xs text-slate-400 mb-1">Remarks</span>
                                            {s2.remarks}
                                        </div>
                                    )}

                                    <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                                        <span className="text-xs text-slate-500">Delay: {calculateDelay(item.requirementDate)} days</span>
                                        <span className="text-xs text-slate-400">{item.requirementDate}</span>
                                    </div>
                                </div>
                            );
                        }}
                    />
                </div>
            ) : (
                <div className="space-y-4 animate-in fade-in duration-300">
                    <ReusableTable
                        headers={['Serial No.', 'System Name', 'Process System', 'Design By', 'Explained To', 'Design URL', 'Delay']}
                        data={historyItems}
                        renderRow={(item, index) => {
                            const s3 = getStage3Data(item);
                            return (
                                <>
                                    <td className="px-4 py-3 font-medium text-slate-700">{item.serialNo}</td>
                                    <td className="px-4 py-3 text-slate-800">{item.systemName}</td>
                                    <td className="px-4 py-3 text-sm">{item.processSystem}</td>
                                    <td className="px-4 py-3 text-slate-600">{s3.designCreateBy}</td>
                                    <td className="px-4 py-3 text-slate-600">{s3.designExplainTo}</td>
                                    <td className="px-4 py-3 text-sky-600">
                                        {s3.urlOfDesign ? (
                                            <a href={s3.urlOfDesign} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:underline">
                                                <ExternalLink size={14} /> View
                                            </a>
                                        ) : '-'}
                                    </td>
                                    <td className="px-4 py-3 text-xs text-slate-500">{calculateDelay(item.requirementDate)} days</td>
                                </>
                            );
                        }}
                        renderCard={(item) => {
                            const s3 = getStage3Data(item);
                            return (
                                <div className="flex flex-col gap-3">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <span className="text-xs font-bold text-sky-600 bg-sky-50 px-2 py-0.5 rounded border border-sky-100">{item.serialNo}</span>
                                            <h4 className="font-bold text-slate-800 mt-1">{item.systemName}</h4>
                                        </div>
                                        <span className="text-xs text-slate-400">{item.requirementDate}</span>
                                    </div>

                                    <div className="grid grid-cols-2 gap-2 text-sm">
                                        <div className="bg-slate-50 p-2 rounded">
                                            <span className="block text-xs text-slate-400">Process</span>
                                            <span className="font-medium text-slate-700">{item.processSystem}</span>
                                        </div>
                                        <div className="bg-slate-50 p-2 rounded">
                                            <span className="block text-xs text-slate-400">Design By</span>
                                            <span className="font-medium text-slate-700">{s3.designCreateBy}</span>
                                        </div>
                                    </div>

                                    <div className="text-sm text-slate-600 bg-slate-50 p-2 rounded border border-slate-100">
                                        <span className="block text-xs text-slate-400 mb-1">Explained To</span>
                                        {s3.designExplainTo}
                                    </div>

                                    <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                                        <span className="text-xs text-slate-500">Delay: {calculateDelay(item.requirementDate)} days</span>
                                        {s3.urlOfDesign && (
                                            <a href={s3.urlOfDesign} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-sm text-sky-600 hover:text-sky-700">
                                                <ExternalLink size={14} /> View
                                            </a>
                                        )}
                                    </div>
                                </div>
                            );
                        }}
                    />
                </div >
            )}

            {/* Modal */}
            <ReusableModal
                title={`Sample Design: ${selectedItem?.serialNo}`}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            >
                {selectedItem && (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Design Create By</label>
                                <input
                                    type="text"
                                    name="designCreateBy"
                                    value={formData.designCreateBy}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-sky-200 rounded-lg focus:outline-none focus:border-sky-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Design Explain To</label>
                                <input
                                    type="text"
                                    name="designExplainTo"
                                    value={formData.designExplainTo}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-sky-200 rounded-lg focus:outline-none focus:border-sky-500"
                                    required
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-slate-700 mb-1">URL of Design</label>
                                <input
                                    type="text"
                                    name="urlOfDesign"
                                    value={formData.urlOfDesign}
                                    onChange={handleInputChange}
                                    placeholder="Figma / Adobe XD Link..."
                                    className="w-full px-3 py-2 border border-sky-200 rounded-lg focus:outline-none focus:border-sky-500"
                                    required
                                />
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

export default Stage3SampleDesign;
