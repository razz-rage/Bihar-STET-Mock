const StatCard = ({ title, value, color }) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <div className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-1">{title}</div>
        <div className={`text-3xl font-black text-${color}-600`}>{value}</div>
    </div>
);

const ActionCard = ({ icon, color, title, desc, onClick }) => (
    <button onClick={onClick} className={`group bg-white p-8 rounded-xl shadow-sm border border-slate-200 hover:border-${color}-500 hover:shadow-md transition-all text-left flex items-start space-x-6 w-full`}>
        <div className={`bg-${color}-50 p-4 rounded-full group-hover:bg-${color}-600 group-hover:text-white transition-colors text-${color}-600`}>
            <i className={`fas ${icon} text-2xl w-8 text-center`}></i>
        </div>
        <div>
            <h3 className="text-xl font-bold text-slate-800">{title}</h3>
            <p className="text-slate-500 mt-2">{desc}</p>
        </div>
    </button>
);

export const DashboardView = ({ setCurrentView, db, attempts, userName }) => {
    const bestScore = attempts.length > 0 ? Math.max(...attempts.map(a => a.score)) : 0;
    const avgScore = attempts.length > 0 ? (attempts.reduce((acc, a) => acc + a.score, 0) / attempts.length).toFixed(1) : 0;

    return (
        <div className="p-8 max-w-6xl mx-auto w-full animate-in fade-in duration-300">
            <h1 className="text-4xl font-black text-slate-800 mb-2">Welcome Back, {userName}!</h1>
            <p className="text-slate-500 mb-8 text-lg">Your personalized Bihar STET Computer Science dashboard.</p>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                <StatCard title="Question Bank" value={db.length} color="slate" />
                <StatCard title="Mocks Attempted" value={attempts.length} color="blue" />
                <StatCard title="Best Score" value={`${bestScore} / 75`} color="emerald" />
                <StatCard title="Avg Score" value={avgScore} color="indigo" />
            </div>

            <h2 className="text-2xl font-bold text-slate-800 mb-6">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ActionCard icon="fa-clock" color="blue" title="Start Full Mock Test" desc="75 Questions • 75 Minutes. Strictly based on the Bihar STET Computer Science syllabus." onClick={() => setCurrentView('mock')} />
                <ActionCard icon="fa-dumbbell" color="emerald" title="Random Practice" desc="Quick revision sessions without the timer pressure. Choose length and difficulty." onClick={() => setCurrentView('practice')} />
                <ActionCard icon="fa-book-open" color="amber" title="PYQ Library" desc="Browse and practice previous year questions from actual STET papers." onClick={() => setCurrentView('pyq')} />
                <ActionCard icon="fa-chart-pie" color="indigo" title="Performance Analytics" desc="View your test history, score trends, and growth metrics." onClick={() => setCurrentView('analytics')} />
            </div>
        </div>
    );
};
