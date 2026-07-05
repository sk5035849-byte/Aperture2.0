import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const links = [
  { to: '/', label: 'Feed', icon: FeedIcon },
  { to: '/explore', label: 'Explore', icon: ExploreIcon },
  { to: '/trending', label: 'Trending', icon: TrendingIcon },
];

export default function Navbar({ onUploadClick }) {
  const { user, logout } = useAuth();

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex fixed left-0 top-0 h-full w-56 flex-col border-r border-darkroom-700 bg-darkroom-900/80 backdrop-blur px-4 py-6 z-20">
        <div className="flex items-center gap-2 px-2 mb-8">
          <ApertureLogo />
          <span className="font-display text-xl tracking-tight">Aperture</span>
        </div>

        <nav className="flex flex-col gap-1">
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-colors ${
                  isActive
                    ? 'bg-darkroom-700 text-safelight-400'
                    : 'text-paper/70 hover:bg-darkroom-800 hover:text-paper'
                }`
              }
            >
              <Icon className="w-5 h-5" />
              {label}
            </NavLink>
          ))}

          <button
            onClick={onUploadClick}
            className="flex items-center gap-3 px-3 py-2.5 mt-2 rounded-md text-sm bg-safelight-500 text-darkroom-950 font-medium hover:bg-safelight-400 transition-colors"
          >
            <PlusIcon className="w-5 h-5" />
            Upload
          </button>
        </nav>

        <div className="mt-auto">
          {user && (
            <NavLink
              to={`/u/${user.username}`}
              className="flex items-center gap-3 px-2 py-2 rounded-md hover:bg-darkroom-800 transition-colors mb-1"
            >
              <Avatar user={user} size={32} />
              <div className="min-w-0">
                <p className="text-sm truncate">{user.full_name || user.username}</p>
                <p className="text-xs text-paper/50 truncate">@{user.username}</p>
              </div>
            </NavLink>
          )}
          <button
            onClick={logout}
            className="w-full text-left px-3 py-2 text-sm text-paper/50 hover:text-crimson-400 transition-colors"
          >
            Sign out
          </button>
        </div>
      </aside>

      {/* Mobile top bar */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-20 flex items-center justify-between px-4 h-14 bg-darkroom-900/90 backdrop-blur border-b border-darkroom-700">
        <div className="flex items-center gap-2">
          <ApertureLogo />
          <span className="font-display text-lg">Aperture</span>
        </div>
        <button onClick={onUploadClick} className="p-2 rounded-full bg-safelight-500 text-darkroom-950">
          <PlusIcon className="w-5 h-5" />
        </button>
      </header>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-20 flex items-center justify-around h-16 bg-darkroom-900/95 backdrop-blur border-t border-darkroom-700">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 text-xs ${
                isActive ? 'text-safelight-400' : 'text-paper/60'
              }`
            }
          >
            <Icon className="w-5 h-5" />
            {label}
          </NavLink>
        ))}
        {user && (
          <NavLink
            to={`/u/${user.username}`}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 text-xs ${
                isActive ? 'text-safelight-400' : 'text-paper/60'
              }`
            }
          >
            <Avatar user={user} size={20} />
            Profile
          </NavLink>
        )}
      </nav>
    </>
  );
}

export function Avatar({ user, size = 32 }) {
  const initial = (user?.full_name || user?.username || '?').charAt(0).toUpperCase();
  return user?.avatar_url ? (
    <img
      src={user.avatar_url}
      alt={user.username}
      style={{ width: size, height: size }}
      className="rounded-full object-cover ring-2 ring-safelight-500/40"
    />
  ) : (
    <div
      style={{ width: size, height: size }}
      className="rounded-full bg-gradient-to-br from-safelight-500 to-crimson-500 flex items-center justify-center text-darkroom-950 font-semibold ring-2 ring-safelight-500/40"
    >
      {initial}
    </div>
  );
}

function ApertureLogo() {
  return (
    <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
      <circle cx="13" cy="13" r="12" stroke="#e8a33d" strokeWidth="1.5" />
      <path d="M13 4 L13 13 L20 17" stroke="#e8a33d" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="13" cy="13" r="3" fill="#a83a32" />
    </svg>
  );
}

function FeedIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path d="M4 6h16M4 12h16M4 18h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
function ExploreIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
      <path d="M15 9l-4.5 1.5L9 15l4.5-1.5L15 9z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}
function TrendingIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path d="M3 17l6-6 4 4 8-8M21 7v6M21 7h-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function PlusIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
