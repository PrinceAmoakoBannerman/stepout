import { NavLink } from 'react-router-dom';
import { Bookmark, Compass, Home, Map, User } from 'lucide-react';
import { cn } from '@/utils/cn';
import { useApp } from '@/store/AppContext';

const items = [
  { to: '/', label: 'Home', icon: Home, end: true },
  { to: '/events', label: 'Explore', icon: Compass },
  { to: '/map', label: 'Map', icon: Map },
  { to: '/saved', label: 'Saved', icon: Bookmark },
  { to: '/profile', label: 'Profile', icon: User },
];

export const MobileNav = () => {
  const { savedIds } = useApp();

  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-line bg-surface/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl lg:hidden"
    >
      <ul className="flex">
        {items.map(({ to, label, icon: Icon, end }) => (
          <li key={to} className="flex-1">
            <NavLink
              to={to}
              end={end}
              className={({ isActive }) =>
                cn(
                  'relative flex flex-col items-center gap-1 py-2.5 text-[10px] font-semibold transition-colors',
                  isActive ? 'text-fg' : 'text-muted',
                )
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && <span className="absolute top-0 h-[3px] w-10 rounded-full bg-horizon" />}
                  <span className="relative">
                    <Icon className={cn('h-5 w-5', isActive && 'text-green')} />
                    {to === '/saved' && savedIds.length > 0 && (
                      <span className="absolute -right-1.5 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-magenta px-1 font-mono text-[9px] text-white">
                        {savedIds.length}
                      </span>
                    )}
                  </span>
                  {label}
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
};
