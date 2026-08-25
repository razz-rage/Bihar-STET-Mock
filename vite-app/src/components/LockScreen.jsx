import { useState } from 'react';
import { hashPasscode } from '../lib/auth';
import { PASSCODES } from '../lib/constants';

export const LockScreen = ({ onAccessGranted }) => {
    const [passcode, setPasscode] = useState('');
    const [showError, setShowError] = useState(false);
    const [shareCount, setShareCount] = useState(0);
    const [isChecking, setIsChecking] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsChecking(true);

        const code = passcode.trim().toUpperCase();
        const hashedCode = await hashPasscode(code);

        const user = PASSCODES[hashedCode];

        if (user) {
            setShowError(false);
            onAccessGranted({ ...user, code });
        } else {
            setShowError(true);
            setPasscode('');
        }
        setIsChecking(false);
    };

    const handleShare = async () => {
        const shareData = {
            title: 'Bihar STET CS Prep Platform',
            text: 'Practice for Bihar STET Computer Science with full mock tests, PYQs, and instant analytics!',
            url: 'https://razz-rage.github.io/Bihar-STET-Mock/' // Automatically uses whatever domain you are hosted on
        };

        try {
            if (navigator.share) {
                await navigator.share(shareData);
            } else {
                await navigator.clipboard.writeText(window.location.origin);
                alert(shareCount === 0 ? 'Link copied! Share it with your first friend.' : 'Link copied! Share it with one more friend.');
            }
        } catch (err) {
            console.log('Share canceled or failed:', err);
        } finally {
            setShareCount(prev => prev + 1);
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full animate-in fade-in">

                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                        <i className="fas fa-lock"></i>
                    </div>
                    <h1 className="text-2xl font-black text-slate-800">Bihar STET Prep Portal</h1>
                    <p className="text-slate-500 font-medium mt-2">Enter your personal access code</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-4 mb-6">
                    <div>
                        <input
                            type="password"
                            value={passcode}
                            onChange={(e) => { setPasscode(e.target.value); setShowError(false); }}
                            placeholder="Enter Passcode..."
                            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-center font-mono text-xl tracking-widest outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all"
                        />
                    </div>

                    {showError && (
                        <p className="text-rose-500 text-sm font-bold text-center">
                            Invalid passcode. See below to request access.
                        </p>
                    )}

                    <button type="submit" disabled={isChecking} className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-black rounded-xl transition shadow-md uppercase tracking-wide">
                        {isChecking ? 'Verifying...' : 'Unlock Platform'}
                    </button>
                </form>

                <div className="border-t border-slate-100 pt-6 text-center">
                    {shareCount < 2 ? (
                        <button
                            onClick={handleShare}
                            className={`w-full py-3 font-bold rounded-xl transition flex items-center justify-center shadow-sm border ${shareCount === 1 ? 'bg-amber-50 hover:bg-amber-100 text-amber-700 border-amber-200' : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'}`}
                        >
                            <i className="fas fa-share-alt mr-2 text-indigo-500"></i>
                            {shareCount === 0 ? 'Share to Get Passcode' : 'Share to Get Passcode'}
                        </button>
                    ) : (
                        <div className="animate-in fade-in zoom-in duration-300">
                            <p className="text-sm font-bold text-emerald-600 mb-3">
                                <i className="fas fa-check-circle mr-1"></i> Access Unlocked!
                            </p>
                            <a
                                href="https://t.me/Kirat_123"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full py-3 bg-sky-100 hover:bg-sky-200 text-sky-800 font-bold rounded-xl transition shadow-sm flex items-center justify-center border border-sky-200"
                            >
                                <i className="fab fa-telegram-plane mr-2 text-sky-600 text-lg"></i> Message Admin || Passcode: USER100
                            </a>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};
