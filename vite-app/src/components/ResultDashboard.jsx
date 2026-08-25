import { useState } from 'react';
import { formatTime } from '../lib/format';

export const ResultDashboard = ({ result, onClose }) => {
    const accuracy = result.total > 0 ? ((result.correct / (result.correct + result.wrong)) * 100).toFixed(1) : 0;
    const attempted = result.correct + result.wrong;

    // States for the reporting modal
    const [reportingQ, setReportingQ] = useState(null);
    const [reportDesc, setReportDesc] = useState('');
    const [suggestedOpt, setSuggestedOpt] = useState('');

    const submitReport = () => {
        if (!reportDesc.trim()) {
            alert("Please describe the issue before reporting.");
            return;
        }

        // Create a clean JSON object mimicking your database structure
        const formattedJson = {
            _error_report: `USER ISSUE: ${reportDesc.trim()}`
        };

        // Copy all existing question properties (except test artifacts like userResponse)
        Object.keys(reportingQ).forEach(key => {
            if (key !== 'userResponse') {
                formattedJson[key] = reportingQ[key];
            }
        });

        // Override the correct answer if the user suggested one
        if (suggestedOpt) {
            formattedJson.correctAnswer = suggestedOpt;
        }

        // Convert directly to pretty-printed JSON (4 spaces indent)
        const jsonString = JSON.stringify(formattedJson, null, 4) + ',';

        if (navigator.clipboard) {
            navigator.clipboard.writeText(jsonString).then(() => {
                alert("Pure JSON copied to clipboard!\n\nClick 'OK' to open Telegram and paste the JSON block directly to the Admin.");
                window.open('https://t.me/Kirat_123', '_blank', 'noopener,noreferrer');
            }).catch(() => {
                alert("Could not copy automatically. Please message Admin manually.");
                window.open('https://t.me/Kirat_123', '_blank', 'noopener,noreferrer');
            });
        } else {
            alert("Please message Admin on Telegram (Kirat_123) to report this question.");
            window.open('https://t.me/Kirat_123', '_blank', 'noopener,noreferrer');
        }

        // Close modal and reset fields
        setReportingQ(null);
        setReportDesc('');
        setSuggestedOpt('');
    };

    return (
        <div className="p-8 max-w-5xl mx-auto w-full animate-in fade-in pb-20 relative">

            {/* The Reporting Modal */}
            {reportingQ && (
                <div className="fixed inset-0 bg-slate-900/60 z-[100] flex items-center justify-center p-4 animate-in fade-in">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-8 border border-slate-200">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-black text-rose-600 flex items-center"><i className="fas fa-code mr-2"></i> Generate JSON Report</h3>
                            <button onClick={() => setReportingQ(null)} className="text-slate-400 hover:text-slate-700 transition"><i className="fas fa-times text-xl"></i></button>
                        </div>

                        <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 mb-6 text-sm text-slate-700 font-medium line-clamp-3">
                            {reportingQ.text || reportingQ.question}
                        </div>

                        <label className="block text-sm font-bold text-slate-700 uppercase tracking-wider mb-2">What is wrong with this question?</label>
                        <textarea
                            value={reportDesc}
                            onChange={e => setReportDesc(e.target.value)}
                            className="w-full p-4 border-2 border-slate-200 rounded-xl mb-5 outline-none focus:border-indigo-500 font-medium text-slate-700 resize-none transition-colors"
                            placeholder="e.g. Option C is a typo, the explanation is incorrect, etc."
                            rows="3"
                        ></textarea>

                        <label className="block text-sm font-bold text-slate-700 uppercase tracking-wider mb-2">Suggested Correct Option</label>
                        <select
                            value={suggestedOpt}
                            onChange={e => setSuggestedOpt(e.target.value)}
                            className="w-full p-4 border-2 border-slate-200 rounded-xl mb-8 outline-none focus:border-indigo-500 font-bold text-slate-700 transition-colors"
                        >
                            <option value="">-- I am not sure --</option>
                            <option value="A">Option A</option>
                            <option value="B">Option B</option>
                            <option value="C">Option C</option>
                            <option value="D">Option D</option>
                        </select>

                        <div className="flex justify-end space-x-3">
                            <button onClick={() => { setReportingQ(null); setReportDesc(''); setSuggestedOpt(''); }} className="px-5 py-3 font-bold text-slate-500 hover:bg-slate-100 rounded-xl transition-colors">Cancel</button>
                            <button onClick={submitReport} className="px-6 py-3 bg-indigo-600 text-white font-black rounded-xl hover:bg-indigo-700 shadow-md transition-colors flex items-center">
                                <i className="fas fa-copy mr-2 text-lg"></i> Copy JSON & Send
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-black text-slate-800">Test Report</h1>
                <button onClick={onClose} className="px-6 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold rounded-lg transition-colors flex items-center"><i className="fas fa-home w-4 mr-2"></i> Dashboard</button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-indigo-600 text-white p-6 rounded-xl shadow-md text-center">
                    <div className="text-indigo-200 text-sm font-bold uppercase tracking-wider mb-1">Total Score</div>
                    <div className="text-5xl font-black">{result.score}</div>
                    <div className="text-indigo-200 font-medium mt-1">out of {result.total}</div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 text-center">
                    <div className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-1">Accuracy</div>
                    <div className="text-4xl font-black text-emerald-600">{isNaN(accuracy) ? 0 : accuracy}%</div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 text-center">
                    <div className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-1">Attempted</div>
                    <div className="text-4xl font-black text-blue-600">{attempted}</div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 text-center">
                    <div className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-1">Time Taken</div>
                    <div className="text-4xl font-black text-slate-800">{formatTime(result.timeUsed)}</div>
                </div>
            </div>

            <h2 className="text-2xl font-bold text-slate-800 mb-6">Detailed Analysis</h2>
            <div className="space-y-6">
                {result.questions.map((q, idx) => {
                    const isCorrect = q.userResponse === q.correctAnswer;
                    const isUnattempted = !q.userResponse;

                    let borderClass = isUnattempted ? "border-slate-300" : (isCorrect ? "border-emerald-400" : "border-rose-400");
                    let icon = isUnattempted ? <i className="fas fa-exclamation-triangle text-3xl text-slate-400"></i> : (isCorrect ? <i className="fas fa-check-circle text-3xl text-emerald-500"></i> : <i className="fas fa-times-circle text-3xl text-rose-500"></i>);

                    return (
                        <div key={idx} className={`p-6 rounded-xl border-l-8 shadow-sm bg-white ${borderClass}`}>
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="text-lg font-bold text-slate-800 flex items-center">
                                    <span className="w-8 h-8 flex items-center justify-center bg-slate-100 rounded-full mr-3 text-sm shrink-0">{idx + 1}</span>
                                    {q.text || q.question}
                                </h3>
                                {icon}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4 ml-11">
                                {['A', 'B', 'C', 'D'].map(opt => {
                                    const isSelected = q.userResponse === opt;
                                    const isActuallyCorrect = q.correctAnswer === opt;

                                    let optClass = "border-slate-200 text-slate-700 bg-slate-50";
                                    if (isActuallyCorrect) optClass = "border-emerald-500 bg-emerald-50 text-emerald-900 font-bold shadow-sm";
                                    else if (isSelected) optClass = "border-rose-500 bg-rose-50 text-rose-900 font-bold";

                                    return (
                                        <div key={opt} className={`p-3 border rounded-lg ${optClass}`}>
                                            <span className="mr-2 font-black opacity-50">{opt}.</span> {q[`option${opt}`]}
                                        </div>
                                    )
                                })}
                            </div>

                            <div className="ml-11 mt-4 bg-blue-50 border border-blue-100 rounded-xl p-5 text-sm text-slate-800 leading-relaxed relative">
                                <strong className="text-blue-800 mb-2 flex items-center text-base"><i className="fas fa-info-circle w-5 mr-2"></i> Official Explanation:</strong>
                                <p className="pr-24">{q.explanation}</p>

                                <button
                                    onClick={() => setReportingQ(q)}
                                    className="absolute top-4 right-4 text-xs font-bold text-slate-500 hover:text-rose-600 transition-colors flex items-center bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm hover:border-rose-200 hover:bg-rose-50"
                                >
                                    <i className="fas fa-flag mr-2"></i> Report Error
                                </button>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    );
};
