import { NavLink } from 'react-router-dom';
import { useStore } from '../hooks/useStore';

const NavIcon = ({ path, children }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    {children}
  </svg>
);

export default function Sidebar() {
  const { xp, nextLevelXp, coins, streak } = useStore();
  const pct = Math.min(100, Math.round((xp / nextLevelXp) * 100));

  const links = [
    { to: '/', label: 'Home', icon: <><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></> },
    { to: '/hub', label: 'GameBite', icon: <><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/></> },
    { to: '/rewards', label: 'Rewards', icon: <><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></> },
    { to: '/profile', label: 'Profile', icon: <><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></> },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-56 bg-white border-r border-gray-100 flex flex-col shadow-sm z-40">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-gray-50">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-600 to-purple-700 flex items-center justify-center shadow-md">
            <svg viewBox="0 0 24 24" fill="white" className="w-4 h-4">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
          </div>
          <span className="font-bold text-gray-900 text-lg tracking-tight">GameBite</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {links.map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-violet-50 text-violet-700 shadow-sm'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span className={isActive ? 'text-violet-600' : ''}>
                  <NavIcon>{icon}</NavIcon>
                </span>
                {label}
                {label === 'GameBite' && (
                  <span className="ml-auto text-[10px] font-bold bg-violet-600 text-white px-1.5 py-0.5 rounded-full">LIVE</span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Stats mini card */}
      <div className="mx-3 mb-4 p-3 bg-gradient-to-br from-violet-50 to-purple-50 rounded-2xl border border-violet-100">
        <div className="text-xs text-violet-500 font-semibold mb-1.5">Why GameBite?</div>
        <p className="text-[11px] text-gray-600 leading-relaxed mb-3">
          Turn your waiting time into fun and rewards that keep you coming back.
        </p>
        <div className="space-y-1.5">
          <div className="flex justify-between text-[11px]">
            <span className="text-gray-500 font-medium">Level {Math.floor(Math.random() * 3) + 6 || 7}</span>
            <span className="text-violet-600 font-bold">{xp}/{nextLevelXp} XP</span>
          </div>
          <div className="h-1.5 bg-white rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-violet-500 to-purple-600 rounded-full transition-all duration-700"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
        <div className="flex items-center justify-between mt-2.5">
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-4 rounded-full bg-amber-100 flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="#f59e0b" className="w-2.5 h-2.5"><circle cx="12" cy="12" r="10"/></svg>
            </div>
            <span className="text-[11px] font-bold text-amber-600">{coins}</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 text-orange-400">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/></svg>
            </div>
            <span className="text-[11px] font-bold text-orange-500">{streak}d</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
