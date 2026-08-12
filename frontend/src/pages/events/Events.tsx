import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CalendarX2, Search, SlidersHorizontal } from 'lucide-react';
import type { EventFilters, EventItem } from '@/types';
import { useApp } from '@/store/AppContext';
import { EventCard } from '@/components/events/EventCard';
import { QuickView } from '@/components/events/QuickView';
import { CategoryRail, FilterChips, FilterPanel, activeFilterCount } from '@/components/events/FilterPanel';
import { Button } from '@/components/common/Button';
import { Select } from '@/components/common/Field';
import { Modal } from '@/components/common/Modal';
import { EventGridSkeleton } from '@/components/common/Skeleton';
import { EmptyState } from '@/components/common/EmptyState';
import { defaultFilters, filterEvents } from '@/hooks/useEventFilters';
import { usePageMeta } from '@/hooks/usePageMeta';

const PAGE = 12;

export const Events = () => {
  usePageMeta('Events in Accra', 'Search and filter every event happening around Accra on StepOut.');
  const { events, loading, venueMap, origin, user } = useApp();
  const [params, setParams] = useSearchParams();
  const [filters, setFilters] = useState<EventFilters>({
    ...defaultFilters,
    query: params.get('q') ?? '',
    category: (params.get('category') as EventFilters['category']) ?? 'all',
    when: (params.get('when') as EventFilters['when']) ?? 'any',
    freeOnly: params.get('free') === '1',
    sort: (params.get('sort') as EventFilters['sort']) ?? 'recommended',
  });
  const [visible, setVisible] = useState(PAGE);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [quick, setQuick] = useState<EventItem | null>(null);

  const patch = (p: Partial<EventFilters>) => {
    setFilters((f) => ({ ...f, ...p }));
    setVisible(PAGE);
  };

  // Keep the URL shareable — the filters people care about live in the query string.
  useEffect(() => {
    const next = new URLSearchParams();
    if (filters.query) next.set('q', filters.query);
    if (filters.category !== 'all') next.set('category', filters.category);
    if (filters.when !== 'any') next.set('when', filters.when);
    if (filters.freeOnly) next.set('free', '1');
    if (filters.sort !== 'recommended') next.set('sort', filters.sort);
    setParams(next, { replace: true });
  }, [filters]);

  const results = useMemo(
    () => filterEvents({ events, venueMap, origin, filters, interests: user?.interests ?? [] }),
    [events, venueMap, origin, filters, user?.interests],
  );

  const shown = results.slice(0, visible);

  return (
    <div className="shell py-8 sm:py-12">
      <header className="mb-8">
        <p className="eyebrow mb-2">Explore</p>
        <h1 className="font-display text-3xl font-extrabold sm:text-4xl">Events in Accra</h1>
        <div className="horizon-rule mt-4" />
      </header>

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex flex-1 items-center gap-2 rounded-xl border border-line bg-surface px-3.5 py-2.5">
          <Search className="h-4 w-4 shrink-0 text-muted" />
          <input
            value={filters.query}
            onChange={(e) => patch({ query: e.target.value })}
            placeholder="Search events, venues, vibes"
            aria-label="Search events"
            className="w-full bg-transparent text-sm outline-none placeholder:text-muted/70"
          />
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="lg:hidden"
            icon={<SlidersHorizontal className="h-4 w-4" />}
            onClick={() => setSheetOpen(true)}
          >
            Filters
            {activeFilterCount(filters) > 0 && (
              <span className="ml-1 rounded-full bg-magenta px-1.5 font-mono text-[10px] text-white">
                {activeFilterCount(filters)}
              </span>
            )}
          </Button>
          <div className="w-full sm:w-52">
            <Select
              aria-label="Sort events"
              value={filters.sort}
              onChange={(e) => patch({ sort: e.target.value as EventFilters['sort'] })}
            >
              <option value="recommended">Recommended</option>
              <option value="popular">Most popular</option>
              <option value="newest">Newest</option>
              <option value="closest">Closest</option>
              <option value="price-asc">Price: low to high</option>
            </Select>
          </div>
        </div>
      </div>

      <div className="mb-6 space-y-3">
        <CategoryRail active={filters.category} onSelect={(category) => patch({ category })} />
        <FilterChips filters={filters} onChange={patch} />
      </div>

      <div className="lg:grid lg:grid-cols-[260px_1fr] lg:gap-8">
        <aside className="hidden lg:block">
          <div className="sticky top-24 card p-5">
            <FilterPanel filters={filters} onChange={patch} onReset={() => setFilters(defaultFilters)} />
          </div>
        </aside>

        <div>
          <p className="mb-4 text-sm text-muted">
            <strong className="font-display text-fg">{results.length}</strong>{' '}
            {results.length === 1 ? 'event' : 'events'} found
          </p>

          {loading ? (
            <EventGridSkeleton count={9} />
          ) : results.length === 0 ? (
            <EmptyState
              icon={<CalendarX2 className="h-6 w-6" />}
              title="No events match those filters"
              message="Loosen a filter or two — widening the distance or clearing the date usually does it."
              actionLabel="Reset filters"
              onAction={() => setFilters(defaultFilters)}
            />
          ) : (
            <>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {shown.map((event) => (
                  <EventCard key={event.id} event={event} onQuickView={setQuick} />
                ))}
              </div>
              {visible < results.length && (
                <div className="mt-10 flex justify-center">
                  <Button variant="outline" size="lg" onClick={() => setVisible((v) => v + PAGE)}>
                    Load more events
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <Modal open={sheetOpen} onClose={() => setSheetOpen(false)} title="Filters">
        <FilterPanel filters={filters} onChange={patch} onReset={() => setFilters(defaultFilters)} compact />
        <div className="mt-6">
          <Button full onClick={() => setSheetOpen(false)}>
            Show {results.length} events
          </Button>
        </div>
      </Modal>

      <QuickView event={quick} onClose={() => setQuick(null)} />
    </div>
  );
};
