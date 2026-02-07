import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bot, Lock, User, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500));

        const result = login(formData.username, formData.password);

        if (result.success) {
            navigate('/dashboard');
        } else {
            setError(result.error);
        }
        setIsLoading(false);
    };

    const demoCredentials = [
        { role: 'Admin', username: 'admin', password: 'admin123', color: 'emerald' },
        { role: 'Client', username: 'client', password: 'client123', color: 'sky' }
    ];

    const fillDemo = (username, password) => {
        setFormData({ username, password });
        setError('');
    };

    return (
        <div className="min-h-[100dvh] flex items-center justify-center bg-gradient-to-br from-sky-50 via-white to-sky-100 p-4">
            <div className="w-full max-w-md">
                {/* Logo Section */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-sky-500 to-sky-400 shadow-lg shadow-sky-500/30 mb-4">
                        <Bot size={32} className="text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-800">Botivate</h1>
                    <p className="text-slate-500 text-sm mt-1">System Tracker</p>
                </div>

                {/* Login Card */}
                <div className="bg-white/90 backdrop-blur-md border border-sky-100 rounded-2xl shadow-xl p-6">
                    <h2 className="text-lg font-semibold text-slate-800 mb-6 text-center">Sign In</h2>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Username */}
                        <div>
                            <label className="block text-xs font-medium text-slate-600 mb-1.5">Username</label>
                            <div className="relative">
                                <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="text"
                                    value={formData.username}
                                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                    placeholder="Enter username"
                                    required
                                    className="w-full pl-10 pr-4 py-2.5 bg-sky-50/50 border border-sky-200 rounded-xl text-sm focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20 transition-all"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-xs font-medium text-slate-600 mb-1.5">Password</label>
                            <div className="relative">
                                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    placeholder="Enter password"
                                    required
                                    className="w-full pl-10 pr-10 py-2.5 bg-sky-50/50 border border-sky-200 rounded-xl text-sm focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20 transition-all"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                >
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-xs">
                                <AlertCircle size={14} />
                                {error}
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-2.5 bg-gradient-to-r from-sky-500 to-sky-400 text-white font-medium rounded-xl shadow-lg shadow-sky-500/25 hover:shadow-sky-500/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Signing in...' : 'Sign In'}
                        </button>
                    </form>

                    {/* Demo Credentials */}
                    <div className="mt-6 pt-6 border-t border-sky-100">
                        <p className="text-xs text-slate-500 text-center mb-3">Demo Credentials (Click to fill)</p>
                        <div className="flex gap-4 justify-center">
                            {demoCredentials.map((cred) => (
                                <button
                                    key={cred.role}
                                    onClick={() => fillDemo(cred.username, cred.password)}
                                    className={`p-2 w-24 rounded-xl text-center transition-all hover:scale-105 ${cred.color === 'emerald' ? 'bg-emerald-50 hover:bg-emerald-100 border border-emerald-200' :
                                        cred.color === 'sky' ? 'bg-sky-50 hover:bg-sky-100 border border-sky-200' :
                                            'bg-purple-50 hover:bg-purple-100 border border-purple-200'
                                        }`}
                                >
                                    <p className={`text-xs font-semibold ${cred.color === 'emerald' ? 'text-emerald-700' :
                                        cred.color === 'sky' ? 'text-sky-700' :
                                            'text-purple-700'
                                        }`}>{cred.role}</p>
                                    <p className="text-[10px] text-slate-500 mt-0.5">{cred.username}</p>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <p className="text-center text-xs text-slate-400 mt-6">
                    Powered by <a href="https://www.botivate.in" target="_blank" rel="noopener noreferrer" className="text-sky-600 hover:underline">Botivate</a>
                </p>
            </div>
        </div>
    );
};

export default Login;
