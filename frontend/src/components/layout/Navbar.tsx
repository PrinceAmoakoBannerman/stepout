import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  Bookmark, ChevronDown, LayoutDashboard, LogOut, MapPin, Moon, Plus, Search, Settings,
  Shield, Sun, User as UserIcon,
} from 'lucide-react';
import { Logo } from '@/components/common/Logo';
import { Button } from '@/components/common/Button';
import { Avatar } from '@/components/common/Avatar';
import { Dropdown, DropdownItem } from '@/components/common/Dropdown';
import { NotificationsMenu } from './NotificationsMenu';
import { SearchOverlay } from './SearchOverlay';
import { useApp } from '@/store/AppContext';
import { cities } from '@/data/cities';
import { cn } from '@/utils/cn';

const links = [
  { to: '/', label: 'Discover', end: true },
  { to: '/events', label: 'Events' },
  { to: '/map', label: 'Map' },
  { to: '/categories', label: 'Categories' },
  { to: '/for-organizers', label: 'For Organizers' },
];

export const Navbar = () => {
  const { user, signOut, theme, toggleTheme, cityId, setCityId } = useApp();
  const [searchOpen, setSearchOpen] = useState(false);
  const navigate = useNavigate();
  const city = cities.find((c) => c.id === cityId);

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-line bg-bg/85 backdrop-blur-xl">
        <div className="shell flex h-16 items-center gap-4">
          <Logo />

          <nav className="ml-4 hidden items-center gap-1 lg:flex" aria-label="Main">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.end}
                className={({ isActive }) =>
                  cn(
                    'relative rounded-lg px-3 py-2 text-sm font-semibold transition-colors',
                    isActive ? 'text-fg' : 'text-muted hover:text-fg',
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    {l.label}
                    {isActive && <span className="absolute inset-x-3 -bottom-[13px] h-[3px] rounded-full bg-horizon" />}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-1 sm:gap-2">
            <Dropdown
              trigger={({ toggle }) => (
                <button
                  onClick={toggle}
                  className="hidden items-center gap-1.5 rounded-xl px-2.5 py-2 text-sm font-semibold text-muted transition-colors hover:bg-raised hover:text-fg md:flex"
                >
                  <MapPin className="h-4 w-4 text-magenta" />
                  {city?.name}
                  <ChevronDown className="h-3.5 w-3.5" />
                </button>
              )}
            >
              {(close) => (
                <>
                  {cities.map((c) => (
                    <DropdownItem
                      key={c.id}
                      onClick={() => {
                        setCityId(c.id);
                        close();
                      }}
                    >
                      <MapPin className={cn('h-4 w-4', c.id === cityId ? 'text-magenta' : 'text-muted')} />
                      <span className="flex-1">{c.name}</span>
                      <span className="font-mono text-[10px] uppercase text-muted">{c.region}</span>
                    </DropdownItem>
                  ))}
                </>
              )}
            </Dropdown>

            <button
              onClick={() => setSearchOpen(true)}
              aria-label="Search"
              className="flex h-10 w-10 items-center justify-center rounded-xl text-muted transition-colors hover:bg-raised hover:text-fg"
            >
              <Search className="h-5 w-5" />
            </button>

            <button
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              className="flex h-10 w-10 items-center justify-center rounded-xl text-muted transition-colors hover:bg-raised hover:text-fg"
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            {user && <NotificationsMenu />}

            <Button
              to="/organizer/events/new"
              size="sm"
              icon={<Plus className="h-4 w-4" />}
              className="hidden sm:inline-flex"
            >
              Create event
            </Button>

            {user ? (
              <Dropdown
                trigger={({ toggle }) => (
                  <button onClick={toggle} className="ml-1 rounded-full" aria-label="Account menu">
                    <Avatar name={user.name} src={user.avatar} size="sm" />
                  </button>
                )}
              >
                {(close) => (
                  <>
                    <div className="border-b border-line px-3 pb-2 pt-1">
                      <p className="text-sm font-bold">{user.name}</p>
                      <p className="truncate text-xs text-muted">{user.email}</p>
                    </div>
                    <DropdownItem onClick={() => { close(); navigate('/profile'); }}>
                      <UserIcon className="h-4 w-4" /> Profile
                    </DropdownItem>
                    <DropdownItem onClick={() => { close(); navigate('/saved'); }}>
                      <Bookmark className="h-4 w-4" /> Saved
                    </DropdownItem>
                    <DropdownItem onClick={() => { close(); navigate('/organizer'); }}>
                      <LayoutDashboard className="h-4 w-4" /> Organizer dashboard
                    </DropdownItem>
                    {user.role === 'admin' && (
                      <DropdownItem onClick={() => { close(); navigate('/admin'); }}>
                        <Shield className="h-4 w-4" /> Admin
                      </DropdownItem>
                    )}
                    <DropdownItem onClick={() => { close(); navigate('/profile?tab=settings'); }}>
                      <Settings className="h-4 w-4" /> Settings
                    </DropdownItem>
                    <DropdownItem danger onClick={() => { close(); signOut(); navigate('/'); }}>
                      <LogOut className="h-4 w-4" /> Sign out
                    </DropdownItem>
                  </>
                )}
              </Dropdown>
            ) : (
              <Button to="/login" variant="outline" size="sm">
                Sign in
              </Button>
            )}
          </div>
        </div>
      </header>

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
};
