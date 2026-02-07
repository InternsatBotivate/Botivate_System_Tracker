import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutGrid,
  Menu,
  X,
  LogOut,
  User,
  ChevronDown,
  Shield,
  FilePlus,
  FileText,
  PenTool,
  RefreshCcw,
  CheckCircle,
  Bug,
  Code2,
  GraduationCap,
  Rocket,
  Search,
  Database,
  Settings
} from 'lucide-react';

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isSidebarHovered, setIsSidebarHovered] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (showUserMenu && !e.target.closest('.user-menu-container')) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showUserMenu]);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => sidebarOpen && setSidebarOpen(false);
  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Role badge colors
  const roleColors = {
    admin: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    client: 'bg-indigo-100 text-indigo-700 border-indigo-200'
  };

  // Nav Items for System Tracker
  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutGrid },
    { path: '/stage-1', label: 'Requirement Update', icon: FilePlus },
    { path: '/stage-2', label: 'Req. Understanding', icon: FileText },
    { path: '/stage-3', label: 'Sample Design', icon: PenTool },
    { path: '/stage-4', label: 'Design Update', icon: RefreshCcw },
    { path: '/stage-5', label: 'Final Approval', icon: CheckCircle },
    { path: '/stage-6', label: 'Testing', icon: Bug },
    { path: '/stage-7', label: 'Code Review', icon: Code2 },
    { path: '/stage-8', label: 'User Training', icon: GraduationCap },
    { path: '/stage-9', label: 'Go Live', icon: Rocket },
    { path: '/stage-10', label: 'System Indexing', icon: Search },
    { path: '/stage-11', label: 'MIS Integration', icon: Database },
    { path: '/settings', label: 'Settings', icon: Settings }
  ];

  const getPageTitle = () => {
    const item = navItems.find(item => location.pathname === item.path);
    return item ? item.label : 'System Tracker';
  };

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-sky-50 via-white to-sky-100 overflow-hidden">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md border-b border-sky-200/50 fixed top-0 left-0 right-0 z-30 h-14 shadow-sm">
        <div className="px-4 lg:px-6 h-full flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={toggleSidebar}
              className="lg:hidden p-2 -ml-2 text-sky-600 hover:text-sky-700 hover:bg-sky-100 rounded-lg transition-colors"
            >
              <Menu size={22} />
            </button>
            <div className="flex flex-col">
              <span className="text-lg font-bold bg-gradient-to-r from-sky-600 to-sky-400 bg-clip-text text-transparent">
                {getPageTitle()}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Role Badge */}
            <div className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-medium ${roleColors[user?.role] || 'bg-slate-100'}`}>
              <Shield size={12} />
              {user?.role?.toUpperCase()}
            </div>

            {/* User Menu */}
            <div className="relative user-menu-container">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 px-3 py-1.5 bg-sky-50 hover:bg-sky-100 rounded-xl border border-sky-200/50 transition-colors"
              >
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-sky-500 to-sky-400 flex items-center justify-center">
                  <User size={14} className="text-white" />
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-xs font-medium text-slate-700">{user?.name}</p>
                </div>
                <ChevronDown size={14} className={`text-slate-400 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              {showUserMenu && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-sky-100 rounded-xl shadow-xl py-2 z-50">
                  <div className="px-4 py-2 border-b border-sky-100">
                    <p className="text-sm font-medium text-slate-800">{user?.name}</p>
                    <span className={`inline-flex items-center gap-1 mt-1.5 px-2 py-0.5 rounded text-[10px] font-medium border ${roleColors[user?.role] || 'bg-slate-100'}`}>
                      <Shield size={10} />
                      {user?.role?.toUpperCase()}
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut size={16} />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex flex-1 pt-14 overflow-hidden relative">
        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-slate-900/30 backdrop-blur-sm z-40 lg:hidden transition-opacity"
            onClick={closeSidebar}
          />
        )}

        {/* Sidebar */}
        <aside
          className={`
            fixed lg:fixed top-0 lg:top-14 bottom-0 left-0 z-50
            bg-white/95 backdrop-blur-md border-r border-sky-200/50
            transition-all duration-300 ease-in-out shadow-xl lg:shadow-sm
            lg:translate-x-0
            ${sidebarOpen ? 'translate-x-0 w-64' : '-translate-x-full lg:translate-x-0'}
            ${isSidebarHovered ? 'lg:w-64' : 'lg:w-[60px]'}
            w-64
          `}
          onMouseEnter={() => setIsSidebarHovered(true)}
          onMouseLeave={() => setIsSidebarHovered(false)}
        >
          {/* Mobile Sidebar Header */}
          <div className="lg:hidden h-14 flex items-center justify-between px-4 border-b border-sky-100 bg-white">
            <span className="text-base font-bold text-sky-600">Botivate System</span>
            <button onClick={closeSidebar} className="p-2 text-slate-400 hover:text-red-500 rounded-lg hover:bg-red-50">
              <X size={18} />
            </button>
          </div>

          <div className="h-full overflow-y-auto pb-20 pt-3 lg:pt-4 overflow-x-hidden">
            <nav className="px-2 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => closeSidebar()}
                    className={`
                      group flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-all duration-200 
                      text-xs font-medium relative whitespace-nowrap overflow-hidden cursor-pointer
                      ${active
                        ? 'bg-gradient-to-r from-sky-500 to-sky-400 text-white shadow-lg shadow-sky-500/30'
                        : 'text-slate-600 hover:bg-sky-50 hover:text-sky-600'
                      }
                    `}
                  >
                    <Icon
                      size={18}
                      className={`shrink-0 ${active ? 'text-white' : 'text-sky-400 group-hover:text-sky-500'} transition-colors`}
                    />
                    <span className={`
                      transition-all duration-300 
                      lg:opacity-0 lg:-translate-x-4 lg:hidden 
                      ${isSidebarHovered ? '!opacity-100 !translate-x-0 !block' : ''} 
                      ${sidebarOpen ? 'block opacity-100 translate-x-0' : ''}
                    `}>
                      {item.label}
                    </span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className={`
          flex-1 min-w-0 bg-transparent relative z-0 
          transition-all duration-300 ease-in-out overflow-hidden 
          ${isSidebarHovered ? 'lg:ml-64' : 'lg:ml-[60px]'}
          pb-0
        `}>
          <div className="h-full overflow-y-auto p-4 lg:p-6 scroll-smooth">
            <Outlet />
          </div>
        </main>

        {/* Footer */}
        <footer className={`
          fixed bottom-0 right-0 z-20 
          transition-all duration-300 ease-in-out 
          left-0 ${isSidebarHovered ? 'lg:left-64' : 'lg:left-[60px]'}
          bg-white/90 backdrop-blur-md border-t border-sky-100
          py-2 px-4
        `}>
          <div className="flex items-center justify-center gap-1 text-xs text-slate-500">
            <span>System Tracker</span>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default AdminLayout;