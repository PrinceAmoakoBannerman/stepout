import { CalendarDays, Clock, MapPin, Users } from 'lucide-react';
import type { EventItem } from '@/types';
import { Modal } from '@/components/common/Modal';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import { EventImage } from './EventImage';
import { SaveButton } from './SaveButton';
import { useApp } from '@/store/AppContext';
import { categoryMap } from '@/data/categories';
import { clock, compact, longDay, priceRange } from '@/utils/format';

export const QuickView = ({ event, onClose }: { event: EventItem | null; onClose: () => void }) => {
  const { venueOf } = useApp();
  const venue = event ? venueOf(event) : undefined;

  return (
    <Modal open={Boolean(event)} onClose={onClose} size="lg" title={event?.title}>
      {event && (
        <div className="space-y-4">
          <EventImage
            src={event.image}
            alt={event.title}
            category={event.category}
            className="aspect-[16/9] w-full rounded-xl"
          />
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone="brand">{categoryMap[event.category]?.name}</Badge>
            <Badge tone="muted">
              <Users className="h-3 w-3" /> {compact(event.interested)} interested
            </Badge>
          </div>
          <p className="text-sm text-muted">{event.summary}</p>
          <dl className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl bg-raised p-3">
              <dt className="eyebrow">Date</dt>
              <dd className="mt-1 flex items-center gap-1.5 text-sm font-semibold">
                <CalendarDays className="h-4 w-4 text-green" /> {longDay(event.start)}
              </dd>
            </div>
            <div className="rounded-xl bg-raised p-3">
              <dt className="eyebrow">Time</dt>
              <dd className="mt-1 flex items-center gap-1.5 text-sm font-semibold">
                <Clock className="h-4 w-4 text-magenta" /> {clock(event.start)}
              </dd>
            </div>
            <div className="rounded-xl bg-raised p-3">
              <dt className="eyebrow">Where</dt>
              <dd className="mt-1 flex items-center gap-1.5 text-sm font-semibold">
                <MapPin className="h-4 w-4 text-ember" /> {venue?.area}
              </dd>
            </div>
          </dl>
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4">
            <p className="font-display text-xl font-extrabold">{priceRange(event.tiers.map((t) => t.price))}</p>
            <div className="flex items-center gap-2">
              <SaveButton eventId={event.id} variant="full" />
              <Button to={`/events/${event.id}`}>View event</Button>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
};
