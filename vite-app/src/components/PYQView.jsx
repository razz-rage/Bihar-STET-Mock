import { useState } from 'react';

export const PYQView = ({ db }) => {
    const pyqs = db.filter(q => q.type === 'PYQ' || q.isPYQ);
    const [userAnswers, setUserAnswers] = useState({});
    const [showDetails, setShowDetails] = useState({});

    const handleSelect = (index, opt) => {
        if (showDetails[index]) return;
        setUserAnswers(prev => ({ ...prev, [index]: opt }));
    };

    const handleCheck = (index) => {
        setShowDetails(prev => ({ ...prev, [index]: true }));
    };

    return (
        <div className="p-8 max-w-5xl mx-auto w-full animate-in fade-in">
            <div className="flex items-center mb-6">
                <i className="fas fa-book-open text-3xl text-amber-600 mr-3"></i>
                <h2 className="text-3xl font-black text-slate-800">PYQ Library</h2>
            </div>
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
                    <span className="font-bold text-slate-600">{pyqs.length} Previous Year Questions Available</span>
                </div>
                <div className="divide-y divide-slate-100 max-h-[600px] overflow-y-auto">
                    {pyqs.map((q, i) => {
                        const isRevealed = showDetails[i];
                        const selectedOpt = userAnswers[i];

                        return (
                            <div key={q.id || i} className="p-6 hover:bg-slate-50 transition-colors">
                                <div className="flex space-x-2 mb-3">
                                    <span className="text-xs px-2 py-1 bg-amber-100 text-amber-800 rounded font-bold">{q.unit}</span>
                                    <span className="text-xs px-2 py-1 bg-slate-100 text-slate-600 rounded font-bold">{q.difficulty}</span>
                                    {q.examYear && <span className="text-xs px-2 py-1 bg-indigo-50 text-indigo-700 rounded font-bold">Year: {q.examYear}</span>}
                                </div>
                                <p className="font-medium text-slate-800 mb-4">{i + 1}. {q.text || q.question}</p>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4">
                                    {['A', 'B', 'C', 'D'].map(opt => {
                                        let optStyle = "border-slate-200 text-slate-700 bg-slate-50 hover:bg-slate-100 cursor-pointer";
                                        if (selectedOpt === opt) {
                                            optStyle = "border-indigo-500 bg-indigo-50 text-indigo-900 font-bold shadow-sm";
                                        }

                                        if (isRevealed) {
                                            const isCorrect = (q.correctAnswer || "").trim().toUpperCase() === opt;
                                            if (isCorrect) {
                                                optStyle = "border-emerald-500 bg-emerald-100 text-emerald-900 font-bold shadow-sm";
                                            } else if (selectedOpt === opt) {
                                                optStyle = "border-rose-500 bg-rose-50 text-rose-900 font-bold";
                                            } else {
                                                optStyle = "border-slate-200 opacity-50 bg-slate-50 text-slate-600 cursor-default";
                                            }
                                        }

                                        return (
                                            <div
                                                key={opt}
                                                onClick={() => handleSelect(i, opt)}
                                                className={`p-3 rounded-lg border text-sm transition-all ${optStyle}`}
                                            >
                                                <span className="mr-2 font-bold opacity-60">{opt}.</span> {q[`option${opt}`]}
                                            </div>
                                        );
                                    })}
                                </div>

                                {!isRevealed ? (
                                    <button
                                        onClick={() => handleCheck(i)}
                                        disabled={!selectedOpt}
                                        className="px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition shadow-sm"
                                    >
                                        Check Answer
                                    </button>
                                ) : (
                                    <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg text-sm text-slate-700 animate-in fade-in">
                                        <div className="font-bold text-blue-900 mb-1">
                                            {selectedOpt === (q.correctAnswer || "").trim().toUpperCase() ? (
                                                <span className="text-emerald-600"><i className="fas fa-check-circle mr-1"></i> Correct!</span>
                                            ) : (
                                                <span className="text-rose-600"><i className="fas fa-times-circle mr-1"></i> Incorrect. Correct Answer is {q.correctAnswer}</span>
                                            )}
                                        </div>
                                        <p className="mt-1 leading-relaxed">{q.explanation}</p>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};
