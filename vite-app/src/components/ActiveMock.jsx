import { useState, useEffect } from 'react';
import { formatTime } from '../lib/format';

export const ActiveMock = ({ db, onComplete, onExit }) => {
    const [questions, setQuestions] = useState([]);
    const [currentQ, setCurrentQ] = useState(0);
    const [answers, setAnswers] = useState({});
    const [timeLeft, setTimeLeft] = useState(75 * 60);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const easy = db.filter(q => (q.difficulty || '').toUpperCase() === 'EASY').sort(() => 0.5 - Math.random());
        const mod = db.filter(q => (q.difficulty || '').toUpperCase() === 'MODERATE').sort(() => 0.5 - Math.random());
        const hard = db.filter(q => (q.difficulty || '').toUpperCase() === 'HARD').sort(() => 0.5 - Math.random());

        let selected = [...easy.slice(0, 23), ...mod.slice(0, 37), ...hard.slice(0, 15)];
        if (selected.length < 75) {
            const remaining = db.filter(q => !selected.includes(q)).sort(() => 0.5 - Math.random());
            selected = [...selected, ...remaining.slice(0, 75 - selected.length)];
        }

        setQuestions(selected.sort(() => 0.5 - Math.random()));
        setIsLoaded(true);
    }, [db]);

    useEffect(() => {
        if (!isLoaded) return;
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    handleSubmit();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLoaded]);

    const handleAnswer = (opt) => setAnswers(prev => ({ ...prev, [currentQ]: opt }));
    const clearAnswer = () => setAnswers(prev => { const newAns = { ...prev }; delete newAns[currentQ]; return newAns; });

    const handleSubmit = () => {
        let correct = 0, wrong = 0, unattempted = 0;
        questions.forEach((q, idx) => {
            if (!answers[idx]) unattempted++;
            else if (answers[idx] === q.correctAnswer) correct++;
            else wrong++;
        });

        const result = {
            id: Date.now(), date: new Date().toISOString(),
            total: questions.length, correct, wrong, unattempted,
            score: correct, timeUsed: (75 * 60) - timeLeft,
            questions: questions.map((q, idx) => ({ ...q, userResponse: answers[idx] || null }))
        };
        onComplete(result);
    };

    if (!isLoaded) return <div className="p-8 text-center mt-20"><i className="fas fa-sync-alt fa-spin text-4xl text-indigo-500 mb-4"></i><p className="font-bold text-slate-600">Generating Mock Test...</p></div>;
    if (!questions.length) return <div className="p-8 text-center text-rose-500 font-bold">Error: Not enough questions in the database.</div>;

    const q = questions[currentQ];
    const warningClass = timeLeft < 300 ? "text-rose-600 animate-pulse" : "text-slate-700";

    return (
        <div className="flex flex-col h-screen bg-slate-50 w-full fixed inset-0 z-50">
            <div className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center shadow-sm">
                <div className="font-bold text-lg text-slate-800 flex items-center">
                    <i className="fas fa-desktop mr-3 text-indigo-600"></i> STET CS <span className="text-sm font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded ml-2">Paper II</span>
                </div>
                <div className={`text-2xl font-black font-mono tracking-widest flex items-center ${warningClass}`}>
                    <i className="fas fa-clock w-6 mr-2"></i>{formatTime(timeLeft)}
                </div>
                <button onClick={() => { if (window.confirm('Exit mock test? Progress will be lost.')) onExit(); }} className="text-rose-500 font-bold hover:text-rose-700 flex items-center bg-rose-50 px-4 py-2 rounded-lg">
                    <i className="fas fa-times w-4 mr-1"></i> Exit
                </button>
            </div>

            <div className="flex flex-1 overflow-hidden">
                <div className="flex-1 p-8 overflow-y-auto">
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 max-w-4xl mx-auto">
                        <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
                            <h2 className="text-2xl font-black text-slate-800">Question {currentQ + 1} <span className="text-slate-400 text-lg font-medium">of {questions.length}</span></h2>
                            <div className="flex space-x-2">
                                <span className="text-xs px-2 py-1 bg-slate-100 text-slate-600 rounded border border-slate-200 font-bold uppercase tracking-wider">{q.difficulty}</span>
                                {(q.type === 'PYQ' || q.isPYQ) && <span className="text-xs px-2 py-1 bg-amber-100 text-amber-700 rounded border border-amber-200 font-bold uppercase tracking-wider">PYQ</span>}
                            </div>
                        </div>

                        <p className="text-xl text-slate-800 mb-8 font-medium leading-relaxed">{q.text || q.question}</p>

                        <div className="space-y-4 mb-10">
                            {['A', 'B', 'C', 'D'].map(opt => (
                                <label key={opt} className={`flex items-start p-4 border-2 rounded-xl cursor-pointer transition-all ${answers[currentQ] === opt ? 'border-indigo-500 bg-indigo-50 shadow-sm' : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'}`}>
                                    <input type="radio" name={`q-${currentQ}`} value={opt} checked={answers[currentQ] === opt} onChange={() => handleAnswer(opt)} className="mt-1 w-5 h-5 text-indigo-600" />
                                    <span className="ml-4 font-black text-slate-400 w-6">{opt}.</span>
                                    <span className={`ml-2 flex-1 text-lg ${answers[currentQ] === opt ? 'text-indigo-900 font-semibold' : 'text-slate-700'}`}>{q[`option${opt}`]}</span>
                                </label>
                            ))}
                        </div>

                        <div className="flex justify-between items-center pt-6 border-t border-slate-100">
                            <div className="space-x-3 flex">
                                <button onClick={clearAnswer} disabled={!answers[currentQ]} className="px-6 py-3 bg-slate-100 text-slate-600 hover:bg-slate-200 rounded-lg font-bold disabled:opacity-50 transition-colors">Clear Selection</button>
                            </div>
                            <div className="space-x-3 flex">
                                <button onClick={() => setCurrentQ(prev => Math.max(0, prev - 1))} disabled={currentQ === 0} className="px-6 py-3 bg-slate-800 text-white rounded-lg font-bold disabled:opacity-50 hover:bg-slate-700 transition-colors flex items-center"><i className="fas fa-chevron-left w-5 mr-1"></i> Prev</button>
                                <button onClick={() => setCurrentQ(prev => Math.min(questions.length - 1, prev + 1))} disabled={currentQ === questions.length - 1} className="px-8 py-3 bg-indigo-600 text-white rounded-lg font-bold disabled:opacity-50 hover:bg-indigo-700 transition-colors flex items-center">Next <i className="fas fa-chevron-right w-5 ml-1"></i></button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="w-80 bg-white border-l border-slate-200 p-6 flex flex-col shadow-[-4px_0_15px_rgba(0,0,0,0.03)]">
                    <h3 className="text-sm font-black text-slate-500 uppercase tracking-widest mb-4">Question Palette</h3>
                    <div className="grid grid-cols-5 gap-2 mb-6 overflow-y-auto flex-1 content-start p-1">
                        {questions.map((_, idx) => {
                            let statusClass = "bg-white text-slate-600 border-slate-300 hover:bg-slate-100";
                            if (answers[idx]) statusClass = "bg-emerald-500 text-white border-emerald-600";
                            else if (idx === currentQ) statusClass = "bg-white text-indigo-600 border-indigo-500 ring-2 ring-indigo-200";

                            return (
                                <button key={idx} onClick={() => setCurrentQ(idx)} className={`h-10 w-full rounded font-bold border ${statusClass} transition-all`}>
                                    {idx + 1}
                                </button>
                            )
                        })}
                    </div>

                    <div className="space-y-3 text-xs font-bold text-slate-600 mb-6 bg-slate-50 p-4 rounded-xl border border-slate-200">
                        <div className="flex items-center"><div className="w-4 h-4 bg-emerald-500 rounded mr-3"></div> Answered</div>
                        <div className="flex items-center"><div className="w-4 h-4 bg-white border-2 border-slate-300 rounded mr-3"></div> Not Answered</div>
                    </div>

                    <button onClick={() => { if (window.confirm('Ready to submit the test?')) handleSubmit(); }} className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-black tracking-wide text-lg shadow-md transition-colors uppercase">
                        Submit Test
                    </button>
                </div>
            </div>
        </div>
    );
};
