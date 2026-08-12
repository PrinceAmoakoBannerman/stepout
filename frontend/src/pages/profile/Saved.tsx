import { Bookmark } from 'lucide-react';
import { useApp } from '@/store/AppContext';
import { EventCard } from '@/components/events/EventCard';
import { EmptyState } from '@/components/common/EmptyState';
import { SectionHeader } from '@/components/common/SectionHeader';
import { usePageMeta } from '@/hooks/usePageMeta';

export const Saved = () => {
  usePageMeta('Saved events · StepOut');
  const { events, savedIds } = useApp();
  const now = new Date();
  const saved = savedIds.map(id => events.find(e => e.id === id)).filter(Boolean) as typeof events;
  const upcoming = saved.filter(e => new Date(e.start) > now);
  const past = saved.filter(e => new Date(e.start) <= now);

  return (
    <div className="shell py-10 sm:py-14 space-y-14">
      <header>
        <p className="eyebrow mb-2">Your list</p>
        <h1 className="font-display text-3xl font-extrabold sm:text-4xl">Saved events</h1>
        <div className="horizon-rule mt-4" />
      </header>

      <section>
        <SectionHeader title="Upcoming" subtitle={`${upcoming.length} event${upcoming.length !== 1 ? 's' : ''} saved and still to come.`} />
        {upcoming.length ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {upcoming.map(e => <EventCard key={e.id} event={e} />)}
          </div>
        ) : (
          <EmptyState
            icon={<Bookmark className="h-6 w-6" />}
            title="Nothing saved yet"
            message="Find something you love and tap the bookmark icon to save it here."
            actionLabel="Explore events" actionTo="/events"
          />
        )}
      </section>

      {past.length > 0 && (
        <section>
          <SectionHeader title="Past events" subtitle="Events you saved that have already happened." />
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {past.map(e => <EventCard key={e.id} event={e} />)}
          </div>
        </section>
      )}
    </div>
  );
};
