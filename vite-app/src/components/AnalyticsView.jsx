export const AnalyticsView = ({ attempts }) => {
    const avg = attempts.length ? (attempts.reduce((a, b) => a + b.score, 0) / attempts.length).toFixed(1) : 0;
    return (
        <div className="p-8 max-w-5xl mx-auto w-full animate-in fade-in">
            <div className="flex items-center mb-6">
                <i className="fas fa-chart-pie text-3xl text-indigo-600 mr-3"></i>
                <h2 className="text-3xl font-black text-slate-800">Performance Analytics</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
                    <h3 className="text-lg font-bold text-slate-700 mb-6">Overall Growth</h3>
                    <div className="flex items-end space-x-2 h-40 border-b border-slate-200 pb-2">
                        {attempts.slice(-10).map((a, i) => (
                            <div key={i} className="bg-indigo-500 w-12 rounded-t-sm" style={{ height: `${(a.score / 75) * 100}%` }}></div>
                        ))}
                        {!attempts.length && <p className="text-slate-400 text-sm mx-auto mb-4">No tests taken yet.</p>}
                    </div>
                </div>
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
                    <h3 className="text-lg font-bold text-slate-700 mb-2">Average Score</h3>
                    <div className="text-6xl font-black text-indigo-600">{avg}</div>
                    <p className="text-slate-500 mt-2">Out of 75 total marks.</p>
                </div>
            </div>
        </div>
    );
};
