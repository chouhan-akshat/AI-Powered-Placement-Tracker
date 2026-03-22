import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const items = [
  ['/', 'Home'],
  ['/dashboard', 'Dash'],
  ['/roadmap', 'Plan'],
  ['/topics', 'Topics'],
  ['/tests', 'Tests'],
  ['/mock-interview', 'Interview'],
  ['/mentor', 'Mentor'],
];

export function MobileNav() {
  const { isAdmin } = useAuth();
  return (
    <div className="sticky top-14 z-30 border-b border-slate-800/80 bg-slate-950/95 px-2 py-2 lg:hidden">
      <div className="flex gap-1 overflow-x-auto pb-1 text-xs">
        {items.map(([to, label]) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `whitespace-nowrap rounded-full px-3 py-1.5 font-medium ${
                isActive ? 'bg-brand-600 text-white' : 'bg-slate-800 text-slate-300'
              }`
            }
          >
            {label}
          </NavLink>
        ))}
        <NavLink
          to="/progress"
          className={({ isActive }) =>
            `whitespace-nowrap rounded-full px-3 py-1.5 font-medium ${
              isActive ? 'bg-brand-600 text-white' : 'bg-slate-800 text-slate-300'
            }`
          }
        >
          Progress
        </NavLink>
        {isAdmin && (
          <NavLink
            to="/admin"
            className="whitespace-nowrap rounded-full bg-amber-900/50 px-3 py-1.5 font-medium text-amber-200"
          >
            Admin
          </NavLink>
        )}
      </div>
    </div>
  );
}
