import { Bell, CalendarClock, MapPin, Ticket, UserPlus, Megaphone } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Dropdown } from '@/components/common/Dropdown';
import { useApp } from '@/store/AppContext';
import { timeAgo } from '@/utils/format';
import { cn } from '@/utils/cn';

const icons = {
  reminder: CalendarClock,
  organizer: Megaphone,
  change: MapPin,
  ticket: Ticket,
  social: UserPlus,
};

export const NotificationsMenu = () => {
  const { notifications, unreadCount, markNotificationsRead } = useApp();

  return (
    <Dropdown
      className="w-[22rem] p-0"
      trigger={({ toggle }) => (
        <button
          onClick={() => {
            toggle();
            if (unreadCount) setTimeout(markNotificationsRead, 1200);
          }}
          aria-label={`Notifications${unreadCount ? `, ${unreadCount} unread` : ''}`}
          className="relative flex h-10 w-10 items-center justify-center rounded-xl text-muted transition-colors hover:bg-raised hover:text-fg"
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute right-2 top-2 flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-magenta opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-magenta" />
            </span>
          )}
        </button>
      )}
    >
      {(close) => (
        <div>
          <div className="flex items-center justify-between border-b border-line px-4 py-3">
            <p className="font-display text-sm font-bold">Notifications</p>
            <button onClick={markNotificationsRead} className="text-xs text-muted hover:text-fg">
              Mark all read
            </button>
          </div>
          <ul className="max-h-[22rem] overflow-y-auto">
            {notifications.map((n) => {
              const Icon = icons[n.type];
              return (
                <li key={n.id}>
                  <Link
                    to={n.href ?? '#'}
                    onClick={close}
                    className={cn('flex gap-3 px-4 py-3 transition-colors hover:bg-raised', !n.read && 'bg-green/[0.04]')}
                  >
                    <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-raised text-green">
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-sm font-semibold">{n.title}</span>
                      <span className="mt-0.5 block text-xs text-muted">{n.body}</span>
                      <span className="mt-1 block font-mono text-[10px] uppercase tracking-wider text-muted">
                        {timeAgo(n.createdAt)}
                      </span>
                    </span>
                    {!n.read && <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-magenta" />}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </Dropdown>
  );
};
