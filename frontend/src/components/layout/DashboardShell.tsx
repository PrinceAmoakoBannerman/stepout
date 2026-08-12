import { type ReactNode } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { ArrowLeft, LogIn, Moon, Sun, type LucideIcon } from 'lucide-react';
import { Logo } from '@/components/common/Logo';
import { Avatar } from '@/components/common/Avatar';
import { Button } from '@/components/common/Button';
import { useApp } from '@/store/AppContext';
import { cn } from '@/utils/cn';

export interface DashboardLink {
  to: string;
  label: string;
  icon: LucideIcon;
  end?: boolean;
}

interface Props {
  title: string;
  links: DashboardLink[];
  requiredRole: 'organizer' | 'admin';
  demoEmail: string;
  children?: ReactNode;
}

export const DashboardShell = ({ title, links, requiredRole, demoEmail }: Props) => {
  const { user, signIn, theme, toggleTheme, toast } = useApp();
  const navigate = useNavigate();

  const allowed = user && (requiredRole === 'organizer' ? true : user.role === 'admin');

  if (!allowed) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg px-4">
        <div className="card w-full max-w-md p-8 text-center">
          <Logo size="lg" showWordmark={false} to={null} className="justify-center" />
          <h1 className="mt-5 font-display text-2xl font-extrabold">{title} access</h1>
          <p className="mt-2 text-sm text-muted">
            {user
              ? `This area is for platform admins. You're signed in as ${user.name}.`
              : `Sign in to open the ${title.toLowerCase()}, or jump straight in with the demo account.`}
          </p>
          <div className="mt-6 space-y-3">
            <Button
              full
              icon={<LogIn className="h-4 w-4" />}
              onClick={async () => {
                await signIn({ email: demoEmail, password: 'stepout123' });
                toast(`Signed in as the demo ${requiredRole}`, 'success', demoEmail);
              }}
            >
              Continue as demo {requiredRole}
            </Button>
            <Button full variant="outline" onClick={() => navigate('/login')}>
              Sign in with another account
            </Button>
            <Link to="/" className="block pt-1 text-sm link-quiet">
              Back to Discover
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg lg:flex">
      <aside className="hidden w-64 shrink-0 border-r border-line bg-surface lg:flex lg:flex-col">
        <div className="border-b border-line px-5 py-4">
          <Logo size="sm" />
          <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.2em] text-muted">{title}</p>
        </div>
        <nav className="flex-1 space-y-1 p-3" aria-label={title}>
          {links.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors',
                  isActive ? 'bg-raised text-fg' : 'text-muted hover:bg-raised/60 hover:text-fg',
                )
              }
            >
              {({ isActive }) => (
                <>
                  <Icon className={cn('h-[18px] w-[18px]', isActive && 'text-green')} />
                  {label}
                </>
              )}
            </NavLink>
          ))}
        </nav>
        <div className="border-t border-line p-3">
          <Link to="/" className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold link-quiet">
            <ArrowLeft className="h-4 w-4" /> Back to StepOut
          </Link>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-40 border-b border-line bg-bg/85 backdrop-blur-xl">
          <div className="flex h-16 items-center gap-3 px-4 sm:px-6">
            <div className="lg:hidden">
              <Logo size="sm" showWordmark={false} />
            </div>
            <h1 className="font-display text-lg font-bold">{title}</h1>
            <div className="ml-auto flex items-center gap-2">
              <button
                onClick={toggleTheme}
                aria-label="Toggle theme"
                className="flex h-10 w-10 items-center justify-center rounded-xl text-muted hover:bg-raised hover:text-fg"
              >
                {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>
              {user && <Avatar name={user.name} src={user.avatar} size="sm" />}
            </div>
          </div>
          <div className="no-scrollbar flex gap-1 overflow-x-auto border-t border-line px-2 py-2 lg:hidden">
            {links.map(({ to, label, icon: Icon, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  cn(
                    'flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold',
                    isActive ? 'bg-raised text-fg' : 'text-muted',
                  )
                }
              >
                <Icon className="h-4 w-4" />
                {label}
              </NavLink>
            ))}
          </div>
        </header>
        <div className="flex-1 p-4 sm:p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};
