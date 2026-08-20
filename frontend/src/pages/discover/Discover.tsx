import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { isAfter, isBefore, parseISO } from 'date-fns';
import { ArrowRight, MapPin, Search } from 'lucide-react';
import type { EventItem } from '@/types';
import { useApp } from '@/store/AppContext';
import { organizers } from '@/data/organizers';
import { cities } from '@/data/cities';
import { EventCard, FeaturedEventCard } from '@/components/events/EventCard';
import { Slideshow } from '@/components/common/Slideshow';
import { OrganizerCard } from '@/components/events/OrganizerCard';
import { QuickView } from '@/components/events/QuickView';
import { SectionHeader } from '@/components/common/SectionHeader';
import { Button } from '@/components/common/Button';
import { EventCardSkeleton } from '@/components/common/Skeleton';
import { EmptyState } from '@/components/common/EmptyState';
import { recommendEvents } from '@/utils/recommend';
import { distanceKm } from '@/utils/format';
import { usePageMeta } from '@/hooks/usePageMeta';

const endOfToday = () => {
  const d = new Date();
  d.setHours(23, 59, 59, 999);
  return d;
};

const weekendWindow = () => {
  const start = new Date();
  start.setDate(start.getDate() + ((6 - start.getDay() + 7) % 7));
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(end.getDate() + 1);
  end.setHours(23, 59, 59, 999);
  return { start, end };
};

export const Discover = () => {
  usePageMeta(
    'StepOut — Find your next thing.',
    'Discover concerts, parties, sports, food, tech and everything happening around Accra.',
  );

  const { events, loading, venueMap, origin, user, cityId, setCityId, savedIds, interestedIds } = useApp();
  const [query, setQuery] = useState('');
  const [quick, setQuick] = useState<EventItem | null>(null);
  const navigate = useNavigate();

  const live = useMemo(
    () => events.filter((e) => e.status === 'published' && isAfter(parseISO(e.end), new Date())),
    [events],
  );

  const tonight = useMemo(
    () => live.filter((e) => isBefore(parseISO(e.start), endOfToday())).slice(0, 4),
    [live],
  );

  const trending = useMemo(
    () => [...live].sort((a, b) => Number(b.trending) - Number(a.trending) || b.interested - a.interested).slice(0, 4),
    [live],
  );

  const picked = useMemo(
    () =>
      recommendEvents({
        events: live,
        interests: user?.interests ?? [],
        savedIds,
        interestedIds,
        venueMap,
        origin,
        limit: 4,
      }),
    [live, user?.interests, savedIds, interestedIds, venueMap, origin],
  );

  const near = useMemo(
    () =>
      [...live]
        .filter((e) => venueMap[e.venueId])
        .sort((a, b) => distanceKm(origin, venueMap[a.venueId]) - distanceKm(origin, venueMap[b.venueId]))
        .slice(0, 4),
    [live, venueMap, origin],
  );

  const weekend = useMemo(() => {
    const { start, end } = weekendWindow();
    return live
      .filter((e) => {
        const s = parseISO(e.start);
        return isAfter(s, start) && isBefore(s, end);
      })
      .slice(0, 4);
  }, [live]);

  const featured = useMemo(() => live.filter((e) => e.featured).slice(0, 3), [live]);

  const submitSearch = () => navigate(query.trim() ? `/events?q=${encodeURIComponent(query.trim())}` : '/events');

  const Row = ({ items }: { items: EventItem[] }) =>
    loading ? (
      <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <EventCardSkeleton key={i} />
        ))}
      </div>
    ) : items.length ? (
      <Slideshow
        items={items}
        pageSizes={{ base: 2, sm: 2, lg: 4 }}
        gridClassName="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4"
        renderItem={(e) => <EventCard key={e.id} event={e} onQuickView={setQuick} />}
      />
    ) : (
      <EmptyState
        title="Nothing here yet"
        message="No events match this section right now. Try the full events list."
        actionLabel="Browse all events"
        actionTo="/events"
      />
    );

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-line">
        <div className="absolute inset-0">
          <div aria-hidden className="absolute inset-0 scale-110 bg-kente blur-md" />
          <div className="absolute inset-0 bg-gradient-to-br from-ink via-ink/80 to-ink/40" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_20%,rgba(252,209,22,.35),transparent_55%)]" />
        </div>

        <div className="shell relative py-16 sm:py-24 lg:py-28">
          <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-white/70">
            Accra · {live.length} things happening
          </p>
          <h1 className="mt-4 max-w-3xl font-display text-4xl font-extrabold leading-[1.05] text-white sm:text-6xl lg:text-7xl">
            Find your next <span className="text-sun">thing.</span>
          </h1>
          <p className="mt-5 max-w-xl text-base text-white/75 sm:text-lg">
            Discover concerts, parties, sports, food, tech and everything happening around Accra.
          </p>

          <div className="mt-8 max-w-3xl rounded-2xl border border-white/15 bg-white/10 p-2 backdrop-blur-md sm:flex sm:items-center sm:gap-2">
            <div className="flex flex-1 items-center gap-2 rounded-xl bg-surface px-3.5 py-3">
              <Search className="h-5 w-5 shrink-0 text-muted" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && submitSearch()}
                placeholder="What are you looking for?"
                aria-label="Search events, places or organizers"
                className="w-full bg-transparent text-sm outline-none placeholder:text-muted/80"
              />
            </div>
            <div className="mt-2 flex items-center gap-2 rounded-xl bg-surface px-3.5 py-3 sm:mt-0 sm:w-52">
              <MapPin className="h-5 w-5 shrink-0 text-magenta" />
              <select
                value={cityId}
                onChange={(e) => setCityId(e.target.value)}
                aria-label="City"
                className="w-full bg-transparent text-sm font-semibold outline-none"
              >
                {cities.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}, Ghana
                  </option>
                ))}
              </select>
            </div>
            <Button size="lg" className="mt-2 w-full sm:mt-0 sm:w-auto" onClick={submitSearch}>
              Explore events
            </Button>
          </div>

          <p className="mt-4 text-xs text-white/60">
            Try: events · places · organizers — “rooftop”, “Osu”, “Sunset Sessions GH”
          </p>
        </div>
      </section>

      <div className="shell space-y-16 py-14 sm:space-y-20">
        {/* Tonight */}
        <section>
          <SectionHeader
            eyebrow="Right now"
            title="Tonight in Accra"
            subtitle="Things happening tonight."
            href="/events?when=today"
          />
          <Row items={tonight} />
        </section>

        {/* Featured */}
        {featured.length > 0 && (
          <section className="grid gap-5 lg:grid-cols-3">
            {featured.map((e) => (
              <FeaturedEventCard key={e.id} event={e} />
            ))}
          </section>
        )}

        {/* Trending */}
        <section>
          <SectionHeader
            eyebrow="Moving fast"
            title="Trending in Accra"
            subtitle="What the city is saving and sharing this week."
            href="/events?sort=popular"
          />
          <Row items={trending} />
        </section>

        {/* Picked for your vibe */}
        <section>
          <SectionHeader
            eyebrow="For you"
            title="Picked for your vibe"
            subtitle={
              user?.interests.length
                ? `Based on the interests you picked: ${user.interests.join(', ')}.`
                : 'Pick a few interests and this row rearranges itself around them.'
            }
            href="/events"
          />
          {!user?.interests.length && (
            <div className="mb-5 flex flex-col items-start gap-3 rounded-2xl border border-green/25 bg-green/5 p-5 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm font-semibold">Tell StepOut what you're into and this row gets sharper.</p>
              <Button size="sm" to={user ? '/onboarding/interests' : '/register'} icon={<ArrowRight className="h-4 w-4" />}>
                {user ? 'Pick interests' : 'Create an account'}
              </Button>
            </div>
          )}
          <Row items={picked} />
        </section>

        {/* Popular near you */}
        <section>
          <SectionHeader eyebrow="Close by" title="Popular near you" href="/map" hrefLabel="Open the map" />
          <Row items={near} />
        </section>

        {/* Organizers */}
        <section>
          <SectionHeader
            eyebrow="The people behind it"
            title="Featured organizers"
            subtitle="Follow them and their new events land in your notifications."
            href="/for-organizers"
            hrefLabel="Become an organizer"
          />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
            {organizers.slice(0, 3).map((o) => (
              <OrganizerCard key={o.id} organizer={o} />
            ))}
          </div>
        </section>

        {/* Weekend */}
        <section>
          <SectionHeader
            eyebrow="Plan ahead"
            title="Upcoming this weekend"
            subtitle="Saturday and Sunday, sorted."
            href="/events?when=weekend"
          />
          <Row items={weekend} />
        </section>
      </div>

      <QuickView event={quick} onClose={() => setQuick(null)} />
    </>
  );
};
