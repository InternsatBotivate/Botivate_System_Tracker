import React, { useState } from 'react';
import { useSystem, STAGES, STAGE_NAMES } from '../context/SystemContext';
import { useAuth } from '../context/AuthContext';
import ReusableModal from '../components/ReusableModal';
import ReusableTable from '../components/StageTable';
import { ArrowRight, Search } from 'lucide-react';
import { calculateDelay } from '../utils/LocalStorageHelper';

const Stage10SystemIndexing = () => {
    const { getPendingForStage, getHistoryForStage, updateSystemStage } = useSystem();
    const { user } = useAuth();

    const [selectedItem, setSelectedItem] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Additional Fields
    const [formData, setFormData] = useState({
        indexedBy: user?.name || '',
        systemCategory: 'Internal Tool',
        indexReferenceCode: '',
        documentationLink: ''
    });

    // Tab State
    const [activeTab, setActiveTab] = useState('pending');

    const pendingItems = getPendingForStage(STAGES.SYSTEM_INDEXING);
    const historyItems = getHistoryForStage(STAGES.SYSTEM_INDEXING);

    const handleActionClick = (item) => {
        setSelectedItem(item);
        setFormData({
            indexedBy: user?.name || '',
            systemCategory: 'Internal Tool',
            indexReferenceCode: '',
            documentationLink: ''
        });
        setIsModalOpen(true);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        updateSystemStage(selectedItem.serialNo, STAGES.SYSTEM_INDEXING, formData);
        setIsModalOpen(false);
        setSelectedItem(null);
    };

    const getStage9Data = (item) => item.history[STAGES.GO_LIVE] || {};
    const getStage10Data = (item) => item.history[STAGES.SYSTEM_INDEXING] || {};

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-xl font-bold text-slate-800">Stage 10: {STAGE_NAMES[STAGES.SYSTEM_INDEXING]}</h2>
                <p className="text-sm text-slate-500">Catalog and index the live system</p>
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
                        headers={['Action', 'Serial No.', 'System Name', 'Type', 'Go Live Date', 'Delay']}
                        data={pendingItems}
                        emptyMessage="No systems pending indexing."
                        renderRow={(item, index) => {
                            const s9 = getStage9Data(item);
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
                                    <td className="px-4 py-3 text-sm">{s9.deploymentType}</td>
                                    <td className="px-4 py-3 text-xs text-slate-500">{s9.goLiveDate}</td>
                                    <td className="px-4 py-3 text-xs text-slate-500">{calculateDelay(item.requirementDate)} days</td>
                                </>
                            );
                        }}
                    />
                </div>
            ) : (
                <div className="space-y-4 animate-in fade-in duration-300">
                    <ReusableTable
                        headers={['Serial No.', 'System Name', 'Process System', 'Indexed By', 'Category', 'Ref Code', 'Docs', 'Delay']}
                        data={historyItems}
                        renderRow={(item, index) => {
                            const s10 = getStage10Data(item);
                            return (
                                <>
                                    <td className="px-4 py-3 font-medium text-slate-700">{item.serialNo}</td>
                                    <td className="px-4 py-3 text-slate-800">{item.systemName}</td>
                                    <td className="px-4 py-3 text-sm">{item.processSystem}</td>
                                    <td className="px-4 py-3 text-slate-600">{s10.indexedBy}</td>
                                    <td className="px-4 py-3">{s10.systemCategory}</td>
                                    <td className="px-4 py-3 font-mono text-xs">{s10.indexReferenceCode}</td>
                                    <td className="px-4 py-3 text-sky-600 truncate max-w-[100px]">{s10.documentationLink}</td>
                                    <td className="px-4 py-3 text-xs text-slate-500">{calculateDelay(item.requirementDate)} days</td>
                                </>
                            );
                        }}
                    />
                </div>
            )}

            {/* Modal */}
            <ReusableModal
                title={`System Indexing: ${selectedItem?.serialNo}`}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            >
                {selectedItem && (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Indexed By</label>
                                <input
                                    type="text"
                                    name="indexedBy"
                                    value={formData.indexedBy}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-sky-200 rounded-lg focus:outline-none focus:border-sky-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">System Category</label>
                                <select
                                    name="systemCategory"
                                    value={formData.systemCategory}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-sky-200 rounded-lg focus:outline-none focus:border-sky-500"
                                    required
                                >
                                    <option value="Internal Tool">Internal Tool</option>
                                    <option value="Client System">Client System</option>
                                    <option value="Automation">Automation</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Index Reference Code</label>
                                <input
                                    type="text"
                                    name="indexReferenceCode"
                                    value={formData.indexReferenceCode}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-sky-200 rounded-lg focus:outline-none focus:border-sky-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Documentation Link</label>
                                <input
                                    type="text"
                                    name="documentationLink"
                                    value={formData.documentationLink}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-sky-200 rounded-lg focus:outline-none focus:border-sky-500"
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

export default Stage10SystemIndexing;
