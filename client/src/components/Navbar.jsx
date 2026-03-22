import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export function Navbar() {
  const { user, logout } = useAuth();
  return (
    <header className="sticky top-0 z-40 glass-panel border-b border-white/10">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="font-display text-xl tracking-tight text-white flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center shadow-lg shadow-brand-500/30">
            <span className="font-bold text-white leading-none">AI</span>
          </div>
          <span className="font-semibold">Placement <span className="text-gradient">Mentor</span></span>
        </Link>
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <div className="hidden items-center gap-2 sm:flex px-3 py-1 rounded-full bg-white/5 border border-white/10">
                <div className="h-6 w-6 rounded-full bg-gradient-to-tr from-brand-500 to-pink-500 flex items-center justify-center text-xs font-bold shadow-inner">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm font-medium text-slate-200">{user.name}</span>
              </div>
              <button
                type="button"
                onClick={logout}
                className="btn-secondary text-sm !px-4 !py-1.5"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm font-medium text-slate-300 hover:text-white transition-colors duration-200">
                Log in
              </Link>
              <Link
                to="/register"
                className="btn-primary text-sm !px-4 !py-1.5"
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
