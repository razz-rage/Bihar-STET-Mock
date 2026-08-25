import { useState, useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Sidebar } from './Sidebar';
import { DashboardView } from './DashboardView';
import { MockStartScreen } from './MockStartScreen';
import { ActiveMock } from './ActiveMock';
import { RandomPracticeView } from './RandomPracticeView';
import { PYQView } from './PYQView';
import { ResultDashboard } from './ResultDashboard';
import { AnalyticsView } from './AnalyticsView';
import { SettingsView } from './SettingsView';

export const AuthenticatedApp = ({ currentUser, setCurrentUser }) => {
    const [attempts, setAttempts] = useLocalStorage(`stet_cs_attempts_${currentUser.name.replace(/\s+/g, '_').toLowerCase()}`, []);
    const [customQs, setCustomQs] = useLocalStorage('stet_custom_qs', []);

    const [db, setDb] = useState([]);
    const [isLoadingDb, setIsLoadingDb] = useState(true);
    const [dbError, setDbError] = useState(false);

    const [currentView, setCurrentView] = useState('dashboard');
    const [testResult, setTestResult] = useState(null);
    const [isTestStarted, setIsTestStarted] = useState(false);

    const isAdmin = currentUser.role === 'admin';

    useEffect(() => {
        setIsLoadingDb(true);
        fetch('./questions.json')
            .then(res => { if (!res.ok) throw new Error("File not found"); return res.json(); })
            .then(data => {
                const combined = [...customQs, ...data];
                const unique = Array.from(new Map(combined.map(q => [q.id || q.text || q.question, q])).values());
                setDb(unique);
                setIsLoadingDb(false);
            })
            .catch(err => {
                console.error("Error loading questions.json:", err);
                const combined = [...customQs, ...[]];
                const unique = Array.from(new Map(combined.map(q => [q.id || q.text || q.question, q])).values());
                setDb(unique);
                setDbError(true);
                setIsLoadingDb(false);
            });
    }, [customQs]);

    const handleAddQuestions = (newQuestions) => { setCustomQs(prev => [...newQuestions, ...prev]); };

    const handleMockComplete = (result) => {
        setIsTestStarted(false);
        if (result.timeUsed < 300) {
            alert("Test submitted in under 5 minutes. This attempt is considered invalid and has not been saved.");
            setTestResult(null);
            setCurrentView('dashboard');
            return;
        }
        setAttempts(prev => [...prev, result]);
        setTestResult(result);
    };

    if (isLoadingDb) {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white font-bold text-xl">
                <i className="fas fa-circle-notch fa-spin mr-3"></i> Loading Question Bank...
            </div>
        );
    }

    if (testResult) {
        return <ResultDashboard result={testResult} onClose={() => { setTestResult(null); setCurrentView('dashboard'); }} />;
    }

    if (currentView === 'mock') {
        if (!isTestStarted) {
            return <MockStartScreen onStart={() => setIsTestStarted(true)} onBack={() => { setIsTestStarted(false); setCurrentView('dashboard'); }} />;
        }
        return <ActiveMock db={db} onComplete={handleMockComplete} onExit={() => { setIsTestStarted(false); setCurrentView('dashboard'); }} />;
    }

    return (
        <div className="flex bg-[#f8fafc] min-h-screen font-sans text-slate-900">
            <Sidebar
                currentView={currentView}
                setCurrentView={setCurrentView}
                isAdmin={isAdmin}
                onLogout={() => setCurrentUser(null)}
            />
            <div className="flex-1 overflow-y-auto relative">
                {dbError && (
                    <div className="bg-rose-100 text-rose-800 p-4 font-bold text-sm text-center">
                        <i className="fas fa-exclamation-triangle mr-2"></i>
                        Could not load 'questions.json'. Ensure you are using Live Server or Netlify.
                    </div>
                )}
                {currentView === 'dashboard' && <DashboardView setCurrentView={setCurrentView} db={db} attempts={attempts} userName={currentUser.name} />}
                {currentView === 'practice' && <RandomPracticeView db={db} />}
                {currentView === 'pyq' && <PYQView db={db} />}
                {currentView === 'analytics' && <AnalyticsView attempts={attempts} />}
                {currentView === 'settings' && isAdmin && <SettingsView db={db} onAddQuestions={handleAddQuestions} />}
            </div>
        </div>
    );
};
