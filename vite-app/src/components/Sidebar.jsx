export const Sidebar = ({ currentView, setCurrentView, isAdmin, onLogout }) => {
    const allNavItems = [
        { id: 'dashboard', icon: 'fa-home', label: 'Dashboard' },
        { id: 'mock', icon: 'fa-desktop', label: 'Mock Test Engine' },
        { id: 'practice', icon: 'fa-dumbbell', label: 'Random Practice' },
        { id: 'pyq', icon: 'fa-book-open', label: 'PYQ Library' },
        { id: 'analytics', icon: 'fa-chart-pie', label: 'Analytics' },
        { id: 'settings', icon: 'fa-cog', label: 'Settings' }
    ];

    const navItems = allNavItems.filter(item => {
        if (!isAdmin && item.id === 'settings') {
            return false;
        }
        return true;
    });

    return (
        <div className="w-64 bg-slate-900 text-white min-h-screen flex flex-col shadow-2xl z-10 sticky top-0">
            <div className="p-6 border-b border-slate-800">
                <div className="text-2xl font-black tracking-tight text-indigo-400 mb-1">STET<span className="text-white">Prep</span></div>
                <div className="text-xs text-slate-400 font-medium uppercase tracking-wider">
                    {isAdmin ? 'Admin Mode' : 'Student Mode'}
                </div>
            </div>
            <nav className="flex-1 py-6 px-3 space-y-2 overflow-y-auto">
                {navItems.map(item => (
                    <button
                        key={item.id}
                        onClick={() => setCurrentView(item.id)}
                        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${currentView === item.id ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}
                    >
                        <i className={`fas ${item.icon} w-5 text-center`}></i>
                        <span className="font-semibold text-sm">{item.label}</span>
                    </button>
                ))}
            </nav>
            <div className="p-4 border-t border-slate-800 space-y-3">
                <button onClick={onLogout} className="w-full flex items-center space-x-3 px-4 py-3 text-slate-400 hover:text-rose-400 transition-colors">
                    <i className="fas fa-sign-out-alt w-5 text-center"></i>
                    <span className="font-semibold text-sm">Log Out</span>
                </button>
                <div className="bg-slate-800 rounded-lg p-4 text-center">
                    <div className="flex items-center justify-center space-x-2 text-indigo-400 mb-2">
                        <i className="fas fa-database w-5"></i>
                        <span className="text-sm font-bold text-white">Live Fetch Mode</span>
                    </div>
                    <div className="text-xs text-slate-400 mt-1">Data from questions.json</div>
                </div>
            </div>
        </div>
    );
};
