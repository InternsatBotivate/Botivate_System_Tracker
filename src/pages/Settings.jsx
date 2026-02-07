import React from 'react';
import { useSystem } from '../context/SystemContext';
import { Trash2, Download, AlertTriangle, Database } from 'lucide-react';
import { STORAGE_KEYS, LocalStorageHelper, seedSystemData, seedUsers } from '../utils/LocalStorageHelper';

const Settings = () => {
    const { resetSystem, systems } = useSystem();

    const handleClearData = () => {
        if (confirm('Are you sure you want to clear ALL data? This cannot be undone.')) {
            resetSystem();
            alert('System data cleared successfully.');
            // Reload to reflect empty state clearly
            window.location.reload();
        }
    };

    const handleExport = () => {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(systems, null, 2));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", "system_tracker_export.json");
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    };

    const handleResetUsers = () => {
        if (confirm('Reset default users? You will be logged out.')) {
            LocalStorageHelper.remove(STORAGE_KEYS.USERS);
            LocalStorageHelper.remove(STORAGE_KEYS.CURRENT_USER);
            seedUsers();
            alert('Users reset to default. You may be logged out.');
            window.location.href = '/login';
        }
    };

    const handleLoadDummyData = () => {
        if (confirm('This will overwrite existing data with sample systems. Continue?')) {
            seedSystemData();
            alert('Dummy data loaded successfully! Reloading page...');
            window.location.reload();
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-sky-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-sky-100 bg-sky-50/30">
                    <h3 className="text-lg font-bold text-slate-800">System Settings</h3>
                </div>

                <div className="p-6 space-y-6">
                    {/* Data Management */}
                    <div>
                        <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Data Management</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <button
                                onClick={handleExport}
                                className="flex items-center gap-3 p-4 rounded-xl border border-sky-200 bg-sky-50 text-sky-700 hover:bg-sky-100 transition-colors text-left"
                            >
                                <div className="p-2 bg-white rounded-lg shadow-sm text-sky-600">
                                    <Download size={20} />
                                </div>
                                <div>
                                    <p className="font-semibold">Export Data</p>
                                    <p className="text-xs text-sky-600/80">Download JSON backup</p>
                                </div>
                            </button>

                            <button
                                onClick={handleLoadDummyData}
                                className="flex items-center gap-3 p-4 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors text-left"
                            >
                                <div className="p-2 bg-white rounded-lg shadow-sm text-emerald-600">
                                    <Database size={20} />
                                </div>
                                <div>
                                    <p className="font-semibold">Load Dummy Data</p>
                                    <p className="text-xs text-emerald-600/80">Populate with samples</p>
                                </div>
                            </button>

                            <button
                                onClick={handleClearData}
                                className="flex items-center gap-3 p-4 rounded-xl border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 transition-colors text-left"
                            >
                                <div className="p-2 bg-white rounded-lg shadow-sm text-red-600">
                                    <Trash2 size={20} />
                                </div>
                                <div>
                                    <p className="font-semibold">Clear LocalStorage</p>
                                    <p className="text-xs text-red-600/80">Delete all systems</p>
                                </div>
                            </button>
                        </div>
                    </div>

                    {/* System Reset */}
                    <div>
                        <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">System Actions</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <button
                                onClick={handleResetUsers}
                                className="flex items-center gap-3 p-4 rounded-xl border border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100 transition-colors text-left"
                            >
                                <div className="p-2 bg-white rounded-lg shadow-sm text-amber-600">
                                    <AlertTriangle size={20} />
                                </div>
                                <div>
                                    <p className="font-semibold">Reset Users & Login</p>
                                    <p className="text-xs text-amber-600/80">Re-seed default users</p>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
