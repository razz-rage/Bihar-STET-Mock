export const MockStartScreen = ({ onStart, onBack }) => {
    return (
        <div className="flex bg-[#f8fafc] min-h-[80vh] font-sans text-slate-900 w-full items-center justify-center p-8">
            <div className="max-w-3xl w-full bg-white border border-slate-200 rounded-2xl shadow-sm p-8 animate-in fade-in">
                <div className="border-b border-slate-100 pb-5 mb-6">
                    <span className="inline-block px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-full uppercase tracking-wider mb-2 border border-indigo-100">
                        Bihar STET — Paper II
                    </span>
                    <h1 className="text-3xl font-black text-slate-800">
                        Computer Science Full Subject Mock
                    </h1>
                    <p className="text-slate-500 font-medium mt-2">
                        Classes 11–12 Examination Practice Test
                    </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                    <div className="bg-slate-50 p-5 rounded-xl border border-slate-100 text-center">
                        <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">Questions</div>
                        <div className="text-2xl font-black text-slate-800 mt-1">75 MCQs</div>
                    </div>
                    <div className="bg-slate-50 p-5 rounded-xl border border-slate-100 text-center">
                        <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">Duration</div>
                        <div className="text-2xl font-black text-slate-800 mt-1">75 Mins</div>
                    </div>
                    <div className="bg-slate-50 p-5 rounded-xl border border-slate-100 text-center">
                        <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">Total Marks</div>
                        <div className="text-2xl font-black text-slate-800 mt-1">75</div>
                    </div>
                    <div className="bg-slate-50 p-5 rounded-xl border border-slate-100 text-center">
                        <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">Marking</div>
                        <div className="text-2xl font-black text-emerald-600 mt-1">+1 / 0</div>
                    </div>
                </div>

                <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 mb-8 text-slate-700 text-sm leading-relaxed">
                    <h3 className="text-base font-black text-blue-900 mb-3 flex items-center">
                        <i className="fas fa-info-circle mr-2"></i> Instructions to Candidates
                    </h3>
                    <ul className="list-disc pl-5 space-y-2 font-medium">
                        <li>The test comprises exactly <strong>75 questions</strong> mapped to the official Bihar STET syllabus.</li>
                        <li>The countdown timer begins immediately after you click "Start Mock Test".</li>
                        <li>You can navigate freely using the Question Palette.</li>
                        <li>The test will automatically submit when the 75 minutes expire.</li>
                    </ul>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <button onClick={onBack} className="px-6 py-3 text-sm font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors flex items-center">
                        <i className="fas fa-arrow-left mr-2"></i> Back to Dashboard
                    </button>
                    <button onClick={onStart} className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-base rounded-xl shadow-md transition-colors flex items-center">
                        I am ready, Start Mock Test <i className="fas fa-arrow-right ml-2"></i>
                    </button>
                </div>
            </div>
        </div>
    );
};
