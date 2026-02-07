import React, { useState } from 'react';
import { useSystem, STAGES, STAGE_NAMES } from '../context/SystemContext';
import { useAuth } from '../context/AuthContext';
import ReusableModal from '../components/ReusableModal';
import ReusableTable from '../components/StageTable';
import { Plus, Link as LinkIcon, ExternalLink } from 'lucide-react';
import { calculateDelay } from '../utils/LocalStorageHelper';

const SYSTEM_PROCESSES = [
    'FMS', 'Mind-map', 'Form', 'Checklist', 'Report', 'Register',
    'MIS', 'Tracker', 'Tool', 'WhatsApp msg', 'Dashboard', 'Web App'
];

const Stage1RequirementUpdate = () => {
    const { addRequirement, getHistoryForStage } = useSystem();
    const { user } = useAuth();
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        postedBy: user?.name || '',
        systemName: '',
        processSystem: '',
        reason: '',
        anyLink: ''
    });

    const historyData = getHistoryForStage(STAGES.REQUIREMENT_UPDATE);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.systemName || !formData.processSystem) {
            alert('Please fill all required fields');
            return;
        }

        addRequirement(formData);
        setIsModalOpen(false);
        // Reset form but keep postedBy
        setFormData({
            postedBy: user?.name || '',
            systemName: '',
            processSystem: '',
            reason: '',
            anyLink: ''
        });
    };

    return (
        <div className="space-y-6">
            {/* Header & Add Button */}
            <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-sky-100 shadow-sm">
                <div>
                    <h2 className="text-xl font-bold text-slate-800">Stage 1: {STAGE_NAMES[STAGES.REQUIREMENT_UPDATE]}</h2>
                    <p className="text-sm text-slate-500">Post new requirements for the system</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-lg shadow-md shadow-sky-500/20 transition-all font-medium"
                >
                    <Plus size={18} />
                    Add Requirement
                </button>
            </div>

            {/* History Table (Actually the main list for Stage 1) */}
            <ReusableTable
                headers={['Serial No.', 'Posted By', 'System Name', 'Process System', 'Reason', 'Any Link', 'Date', 'Delay']}
                data={historyData}
                renderRow={(item, index) => (
                    <>
                        <td className="px-4 py-3 font-medium text-slate-700">{item.serialNo}</td>
                        <td className="px-4 py-3 text-slate-600">{item.history[STAGES.REQUIREMENT_UPDATE]?.postedBy}</td>
                        <td className="px-4 py-3 text-slate-800 font-semibold">{item.systemName}</td>
                        <td className="px-4 py-3">
                            <span className="px-2 py-1 rounded text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-100">
                                {item.processSystem}
                            </span>
                        </td>
                        <td className="px-4 py-3 text-slate-600 max-w-xs truncate" title={item.reason}>{item.reason}</td>
                        <td className="px-4 py-3 text-sky-600">
                            {item.anyLink ? (
                                <a href={item.anyLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:underline">
                                    <LinkIcon size={14} /> Link
                                </a>
                            ) : '-'}
                        </td>
                        <td className="px-4 py-3 text-slate-500 text-xs">{item.requirementDate}</td>
                        <td className="px-4 py-3 text-slate-500 text-xs">{calculateDelay(item.requirementDate)} days</td>
                    </>
                )}
            />

            {/* Add Requirement Modal */}
            <ReusableModal
                title="Add New Requirement"
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Posted By</label>
                            <input
                                type="text"
                                name="postedBy"
                                value={formData.postedBy}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-sky-200 rounded-lg focus:outline-none focus:border-sky-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">System Name</label>
                            <input
                                type="text"
                                name="systemName"
                                value={formData.systemName}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-sky-200 rounded-lg focus:outline-none focus:border-sky-500"
                                required
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-slate-700 mb-1">Process System</label>
                            <select
                                name="processSystem"
                                value={formData.processSystem}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-sky-200 rounded-lg focus:outline-none focus:border-sky-500"
                                required
                            >
                                <option value="">Select Process System</option>
                                {SYSTEM_PROCESSES.map(p => (
                                    <option key={p} value={p}>{p}</option>
                                ))}
                            </select>
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-slate-700 mb-1">Reason</label>
                            <textarea
                                name="reason"
                                value={formData.reason}
                                onChange={handleInputChange}
                                rows="3"
                                className="w-full px-3 py-2 border border-sky-200 rounded-lg focus:outline-none focus:border-sky-500"
                            ></textarea>
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-slate-700 mb-1">Any Link or Sample</label>
                            <div className="relative">
                                <ExternalLink size={16} className="absolute left-3 top-3 text-slate-400" />
                                <input
                                    type="text"
                                    name="anyLink"
                                    value={formData.anyLink}
                                    onChange={handleInputChange}
                                    placeholder="https://..."
                                    className="w-full pl-10 pr-3 py-2 border border-sky-200 rounded-lg focus:outline-none focus:border-sky-500"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-100">
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
                            Save Requirement
                        </button>
                    </div>
                </form>
            </ReusableModal>
        </div>
    );
};

export default Stage1RequirementUpdate;
