import { useState } from 'react';
import { UNITS } from '../lib/constants';

export const RandomPracticeView = ({ db }) => {
    const [phase, setPhase] = useState('config'); // 'config', 'active', 'result'
    const [config, setConfig] = useState({ unit: 'ALL', difficulty: 'ALL', type: 'ALL', count: 10 });
    const [questions, setQuestions] = useState([]);

    const [currentQ, setCurrentQ] = useState(0);
    const [answers, setAnswers] = useState({});
    const [revealed, setRevealed] = useState({});

    const [result, setResult] = useState(null);

    const handleStart = () => {
        let pool = db;
        if (config.unit !== 'ALL') pool = pool.filter(q => q.unit === config.unit);
        if (config.difficulty !== 'ALL') pool = pool.filter(q => (q.difficulty || '').toUpperCase() === config.difficulty);
        if (config.type !== 'ALL') pool = pool.filter(q => (q.type || '').toUpperCase() === config.type || (config.type === 'PYQ' && q.isPYQ));

        if (pool.length === 0) {
            alert("No questions match your current filters. Try broadening your criteria.");
            return;
        }

        const selected = pool.sort(() => 0.5 - Math.random()).slice(0, config.count);
        setQuestions(selected);
        setAnswers({});
        setRevealed({});
        setCurrentQ(0);
        setPhase('active');
    };

    const handleSelectOption = (opt) => {
        if (revealed[currentQ]) return; // Prevent changing answer after it's revealed
        setAnswers(prev => ({ ...prev, [currentQ]: opt }));
        setRevealed(prev => ({ ...prev, [currentQ]: true }));
    };

    const finishPractice = () => {
        let correct = 0, wrong = 0, unattempted = 0;
        questions.forEach((q, idx) => {
            if (!answers[idx]) unattempted++;
            else if (answers[idx] === q.correctAnswer) correct++;
            else wrong++;
        });
        setResult({ total: questions.length, correct, wrong, unattempted, score: correct });
        setPhase('result');
    };

    if (phase === 'config') {
        return (
            <div className="p-8 max-w-4xl mx-auto w-full animate-in fade-in">
                <div className="flex items-center mb-8">
                    <div className="w-14 h-14 bg-emerald-100 rounded-xl flex items-center justify-center mr-4">
                        <i className="fas fa-dumbbell text-3xl text-emerald-600"></i>
                    </div>
                    <div>
                        <h2 className="text-3xl font-black text-slate-800">Random Practice</h2>
                        <p className="text-slate-500 font-medium mt-1">Configure a custom, untimed practice session with instant feedback.</p>
                    </div>
                </div>

                <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <div>
                            <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-2">Syllabus Unit</label>
                            <select className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none font-bold text-slate-700 focus:border-emerald-500 transition-colors" value={config.unit} onChange={e => setConfig({ ...config, unit: e.target.value })}>
                                <option value="ALL">Mix All Units</option>
                                {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-2">Question Source</label>
                            <select className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none font-bold text-slate-700 focus:border-emerald-500 transition-colors" value={config.type} onChange={e => setConfig({ ...config, type: e.target.value })}>
                                <option value="ALL">All Sources</option>
                                <option value="PYQ">Previous Year Questions Only</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-2">Difficulty</label>
                            <select className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none font-bold text-slate-700 focus:border-emerald-500 transition-colors" value={config.difficulty} onChange={e => setConfig({ ...config, difficulty: e.target.value })}>
                                <option value="ALL">Mixed Difficulty</option>
                                <option value="EASY">Easy Only</option>
                                <option value="MODERATE">Moderate Only</option>
                                <option value="HARD">Hard Only</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-2">Question Count</label>
                            <select className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none font-bold text-slate-700 focus:border-emerald-500 transition-colors" value={config.count} onChange={e => setConfig({ ...config, count: Number(e.target.value) })}>
                                <option value={10}>10 Questions</option>
                                <option value={20}>20 Questions</option>
                                <option value={50}>50 Questions</option>
                                <option value={75}>75 Questions</option>
                            </select>
                        </div>
                    </div>

                    <button onClick={handleStart} className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-lg rounded-xl shadow-md transition-colors uppercase tracking-wide flex items-center justify-center">
                        <i className="fas fa-play-circle mr-3"></i> Start Practice Session
                    </button>
                </div>
            </div>
        );
    }

    if (phase === 'active') {
        const q = questions[currentQ];
        const isAnswered = revealed[currentQ];
        const selectedOpt = answers[currentQ];

        return (
            <div className="p-8 max-w-5xl mx-auto w-full animate-in fade-in pb-24">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-black text-slate-800"><i className="fas fa-dumbbell text-emerald-500 mr-2"></i> Practice Session</h2>
                    <div className="flex gap-4 items-center">
                        <span className="font-bold text-slate-500 bg-white px-3 py-1 rounded-lg border border-slate-200 shadow-sm">Q {currentQ + 1} <span className="text-slate-400">of {questions.length}</span></span>
                        <button onClick={() => { if (window.confirm('End practice session early?')) finishPractice(); }} className="px-4 py-2 bg-rose-50 text-rose-600 font-bold rounded-lg hover:bg-rose-100 transition">End Practice</button>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 mb-6">
                    <div className="flex space-x-2 mb-6 border-b border-slate-100 pb-4">
                        <span className="text-xs px-2 py-1 bg-slate-100 text-slate-600 rounded font-bold uppercase tracking-wider">{q.unit}</span>
                        <span className="text-xs px-2 py-1 bg-indigo-50 text-indigo-700 rounded font-bold uppercase tracking-wider">{q.difficulty}</span>
                        {(q.type === 'PYQ' || q.isPYQ) && <span className="text-xs px-2 py-1 bg-amber-100 text-amber-700 rounded font-bold uppercase tracking-wider">PYQ</span>}
                    </div>

                    <p className="text-xl text-slate-800 mb-8 font-medium leading-relaxed">{q.text || q.question}</p>

                    <div className="space-y-3 mb-8">
                        {['A', 'B', 'C', 'D'].map(opt => {
                            let optStyle = "border-slate-200 text-slate-700 bg-slate-50 hover:bg-slate-100 cursor-pointer";

                            if (isAnswered) {
                                const isCorrect = (q.correctAnswer || "").trim().toUpperCase() === opt;
                                if (isCorrect) {
                                    optStyle = "border-emerald-500 bg-emerald-100 text-emerald-900 font-bold shadow-sm";
                                } else if (selectedOpt === opt) {
                                    optStyle = "border-rose-500 bg-rose-50 text-rose-900 font-bold";
                                } else {
                                    optStyle = "border-slate-200 opacity-50 bg-slate-50 text-slate-500 cursor-default";
                                }
                            }

                            return (
                                <div
                                    key={opt}
                                    onClick={() => handleSelectOption(opt)}
                                    className={`p-4 rounded-xl border-2 transition-all flex items-start ${optStyle}`}
                                >
                                    <span className={`mr-4 font-black w-6 ${(q.correctAnswer || "").trim().toUpperCase() === opt && isAnswered ? 'text-emerald-700' : 'text-slate-400'}`}>{opt}.</span>
                                    <span className="flex-1 text-lg font-medium">{q[`option${opt}`]}</span>
                                </div>
                            );
                        })}
                    </div>

                    {isAnswered && (
                        <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-xl mt-6 animate-in fade-in">
                            <div className="font-bold text-blue-900 mb-2 text-base">
                                {selectedOpt === (q.correctAnswer || "").trim().toUpperCase() ? (
                                    <span className="text-emerald-600"><i className="fas fa-check-circle mr-1"></i> Correct!</span>
                                ) : (
                                    <span className="text-rose-600"><i className="fas fa-times-circle mr-1"></i> Incorrect. Correct Answer is {q.correctAnswer}</span>
                                )}
                            </div>
                            <p className="text-blue-800 text-base leading-relaxed">{q.explanation}</p>
                        </div>
                    )}
                </div>

                <div className="flex justify-between items-center">
                    <button onClick={() => setCurrentQ(Math.max(0, currentQ - 1))} disabled={currentQ === 0} className="px-6 py-3 bg-white border border-slate-200 text-slate-700 shadow-sm rounded-xl font-bold disabled:opacity-50 hover:bg-slate-50 transition flex items-center"><i className="fas fa-chevron-left mr-2"></i> Prev</button>

                    {!isAnswered ? (
                        <span className="text-sm font-bold text-slate-400">Select any option for instant feedback</span>
                    ) : (
                        <span className="font-bold text-slate-500 bg-slate-100 px-4 py-2 rounded-lg border border-slate-200"><i className="fas fa-check text-emerald-600 mr-2"></i> Answer Evaluated</span>
                    )}

                    {currentQ === questions.length - 1 ? (
                        <button onClick={finishPractice} className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 shadow-sm transition flex items-center">Finish <i className="fas fa-flag-checkered ml-2"></i></button>
                    ) : (
                        <button onClick={() => setCurrentQ(currentQ + 1)} className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 shadow-sm transition flex items-center">Next <i className="fas fa-chevron-right ml-2"></i></button>
                    )}
                </div>
            </div>
        );
    }

    if (phase === 'result') {
        return (
            <div className="p-8 max-w-3xl mx-auto w-full animate-in fade-in text-center mt-10">
                <div className="bg-white p-10 rounded-3xl shadow-sm border border-slate-200">
                    <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <i className="fas fa-trophy text-5xl text-emerald-500"></i>
                    </div>
                    <h2 className="text-3xl font-black text-slate-800 mb-2">Practice Complete!</h2>
                    <p className="text-slate-500 mb-8 font-medium">Session Summary</p>

                    <div className="grid grid-cols-3 gap-4 mb-10">
                        <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                            <div className="text-4xl font-black text-emerald-600">{result.correct}</div>
                            <div className="text-xs font-bold text-emerald-700 uppercase mt-2 tracking-wide">Correct</div>
                        </div>
                        <div className="p-4 bg-rose-50 rounded-xl border border-rose-100">
                            <div className="text-4xl font-black text-rose-600">{result.wrong}</div>
                            <div className="text-xs font-bold text-rose-700 uppercase mt-2 tracking-wide">Wrong</div>
                        </div>
                        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                            <div className="text-4xl font-black text-slate-600">{result.unattempted}</div>
                            <div className="text-xs font-bold text-slate-500 uppercase mt-2 tracking-wide">Skipped</div>
                        </div>
                    </div>

                    <button onClick={() => setPhase('config')} className="px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-xl transition shadow-md uppercase tracking-wide w-full">Start Another Session</button>
                </div>
            </div>
        );
    }
};
