import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Copy, Edit, Eye, PlusCircle, Trash2 } from 'lucide-react';
import { useApp } from '@/store/AppContext';
import { Button } from '@/components/common/Button';
import { Badge, statusTone } from '@/components/common/Badge';
import { Tabs } from '@/components/common/Tabs';
import { EventImage } from '@/components/events/EventImage';
import { EmptyState } from '@/components/common/EmptyState';
import { usePageMeta } from '@/hooks/usePageMeta';
import { cedis, compact, relativeDay } from '@/utils/format';
import type { EventStatus } from '@/types';

const statusTabs = [
  { id: 'all', label: 'All' },
  { id: 'published', label: 'Published' },
  { id: 'pending', label: 'Pending' },
  { id: 'draft', label: 'Drafts' },
  { id: 'cancelled', label: 'Cancelled' },
];

export const MyEvents = () => {
  usePageMeta('My Events · StepOut Organizer');
  const { events, user, updateEvent, duplicateEvent, toast } = useApp();
  const [filter, setFilter] = useState('all');
  const myEvents = useMemo(
    () => events.filter(e => e.organizerId === (user?.organizerId ?? 'o1'))
      .filter(e => filter === 'all' || e.status === filter)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    [events, user, filter]
  );

  const cancel = async (id: string) => {
    await updateEvent(id, { status: 'cancelled' });
    toast('Event cancelled', 'info');
  };

  const duplicate = async (event: typeof events[0]) => {
    await duplicateEvent(event);
    toast('Event duplicated as draft', 'success');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="eyebrow mb-1">My events</p>
          <h1 className="font-display text-2xl font-extrabold">Event management</h1>
        </div>
        <Button to="/organizer/events/new" icon={<PlusCircle className="h-4 w-4" />}>Create event</Button>
      </div>

      <Tabs items={statusTabs.map(t => ({
        ...t,
        count: t.id === 'all' ? events.filter(e => e.organizerId === (user?.organizerId ?? 'o1')).length
          : events.filter(e => e.organizerId === (user?.organizerId ?? 'o1') && e.status === t.id).length
      }))} active={filter} onChange={setFilter} />

      {!myEvents.length ? (
        <EmptyState title="No events yet" message="Create your first event to see it here."
          actionLabel="Create event" actionTo="/organizer/events/new" />
      ) : (
        <div className="space-y-3">
          {myEvents.map(event => (
            <div key={event.id} className="card flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
              <EventImage src={event.image} alt={event.title} category={event.category}
                className="h-20 w-full rounded-xl sm:h-20 sm:w-28" />
              <div className="min-w-0 flex-1 space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge tone={statusTone(event.status)}>{event.status}</Badge>
                  <Link to={`/events/${event.id}`} className="truncate font-display font-bold hover:underline">{event.title}</Link>
                </div>
                <p className="text-xs text-muted">{relativeDay(event.start)}</p>
                <div className="flex flex-wrap gap-4 font-mono text-[11px] uppercase tracking-wider text-muted">
                  <span><Eye className="inline h-3 w-3 mr-1" />{compact(event.views)}</span>
                  <span>Tickets: {event.tiers.reduce((s, t) => s + t.sold, 0)}</span>
                  <span>Revenue: {cedis(event.tiers.reduce((s, t) => s + t.sold * t.price, 0))}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Button variant="outline" size="sm" to={`/events/${event.id}`} icon={<Eye className="h-4 w-4" />} />
                <Button variant="outline" size="sm" icon={<Copy className="h-4 w-4" />} onClick={() => duplicate(event)} />
                {event.status !== 'cancelled' && (
                  <Button variant="outline" size="sm" icon={<Trash2 className="h-4 w-4 text-magenta" />}
                    onClick={() => cancel(event.id)} title="Cancel event" />
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
