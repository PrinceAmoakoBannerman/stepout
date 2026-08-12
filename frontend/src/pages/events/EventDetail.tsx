import { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useApp } from '@/store/AppContext';
import { EventDetailView } from '@/components/events/EventDetailView';
import { EventCard } from '@/components/events/EventCard';
import { SectionHeader } from '@/components/common/SectionHeader';
import { Skeleton } from '@/components/common/Skeleton';
import { EmptyState } from '@/components/common/EmptyState';
import { usePageMeta } from '@/hooks/usePageMeta';

export const EventDetail = () => {
  const { id } = useParams();
  const { getEvent, venueOf, organizerOf, events, loading } = useApp();
  const event = getEvent(id);

  usePageMeta(event ? event.title : 'Event', event?.summary);

  const related = useMemo(
    () =>
      events
        .filter(
          (e) =>
            e.id !== id &&
            e.status === 'published' &&
            new Date(e.start) > new Date() &&
            (e.category === event?.category || e.organizerId === event?.organizerId),
        )
        .slice(0, 4),
    [events, id, event],
  );

  if (loading) {
    return (
      <div>
        <Skeleton className="h-[300px] w-full rounded-none sm:h-[420px]" />
        <div className="shell grid gap-8 py-10 lg:grid-cols-[1fr_360px]">
          <div className="space-y-4">
            <Skeleton className="h-8 w-2/3" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-64 w-full" />
          </div>
          <Skeleton className="h-80 w-full" />
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="shell py-20">
        <EmptyState
          title="That event isn't here"
          message="It may have been unpublished or the link is wrong. The full listing is a click away."
          actionLabel="Browse events"
          actionTo="/events"
        />
      </div>
    );
  }

  return (
    <>
      <div className="shell pt-5">
        <Link to="/events" className="inline-flex items-center gap-1.5 text-sm font-semibold link-quiet">
          <ArrowLeft className="h-4 w-4" /> All events
        </Link>
      </div>

      <EventDetailView event={event} venue={venueOf(event)} organizer={organizerOf(event)} />

      {related.length > 0 && (
        <section className="shell pb-16">
          <SectionHeader eyebrow="You might also like" title="Related events" href="/events" />
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((e) => (
              <EventCard key={e.id} event={e} />
            ))}
          </div>
        </section>
      )}
    </>
  );
};
