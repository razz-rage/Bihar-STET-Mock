import { useLocalStorage } from './hooks/useLocalStorage';
import { LockScreen } from './components/LockScreen';
import { AuthenticatedApp } from './components/AuthenticatedApp';

const App = () => {
    const [currentUser, setCurrentUser] = useLocalStorage('stet_user', null);

    return (
        <>
            {/* This banner ONLY shows on mobile screens (md:hidden) */}
            <div className="md:hidden fixed top-0 left-0 w-full bg-rose-600 text-white p-4 text-center text-sm font-bold shadow-xl z-[9999] flex flex-col items-center justify-center border-b-4 border-rose-800">
                <i className="fas fa-desktop text-2xl mb-2"></i>
                Platform not supported on mobile. <br /> Please open on a PC/Laptop for the best experience.
            </div>

            {!currentUser ?
                <LockScreen onAccessGranted={(user) => setCurrentUser(user)} /> :
                <AuthenticatedApp key={currentUser.name} currentUser={currentUser} setCurrentUser={setCurrentUser} />
            }
        </>
    );
};

export default App;
