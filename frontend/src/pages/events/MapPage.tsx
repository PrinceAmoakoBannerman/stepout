import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { List, MapIcon, X } from 'lucide-react';
import type { EventFilters } from '@/types';
import { useApp } from '@/store/AppContext';
import { EventMap } from '@/components/events/EventMap';
import { EventCard } from '@/components/events/EventCard';
import { FilterPanel } from '@/components/events/FilterPanel';
import { Button } from '@/components/common/Button';
import { defaultFilters, filterEvents } from '@/hooks/useEventFilters';
import { usePageMeta } from '@/hooks/usePageMeta';
import { cn } from '@/utils/cn';

export const MapPage = () => {
  usePageMeta('Event map — Accra', 'See what is happening around you on the StepOut map of Accra.');
  const { events, venueMap, origin, user } = useApp();
  const [params] = useSearchParams();
  const [filters, setFilters] = useState<EventFilters>({ ...defaultFilters, sort: 'closest' });
  const [activeId, setActiveId] = useState<string | null>(null);
  const [mobileView, setMobileView] = useState<'map' | 'list'>('map');

  const results = useMemo(
    () => filterEvents({ events, venueMap, origin, filters, interests: user?.interests ?? [] }),
    [events, venueMap, origin, filters, user?.interests],
  );

  const venueParam = params.get('venue');
  const center = useMemo<[number, number]>(() => {
    if (activeId) {
      const v = venueMap[results.find((e) => e.id === activeId)?.venueId ?? ''];
      if (v) return [v.lat, v.lng];
    }
    if (venueParam && venueMap[venueParam]) return [venueMap[venueParam].lat, venueMap[venueParam].lng];
    return [origin.lat, origin.lng];
  }, [activeId, venueParam, venueMap, results, origin]);

  const active = results.find((e) => e.id === activeId);

  return (
    <div className="lg:grid lg:h-[calc(100vh-4rem)] lg:grid-cols-[380px_1fr]">
      {/* Panel */}
      <aside
        className={cn(
          'flex flex-col border-r border-line bg-bg lg:h-full',
          mobileView === 'map' && 'hidden lg:flex',
        )}
      >
        <div className="border-b border-line p-5">
          <p className="eyebrow mb-2">On the map</p>
          <h1 className="font-display text-2xl font-extrabold">
            {results.length} {results.length === 1 ? 'event' : 'events'} around you
          </h1>
          <div className="horizon-rule mt-3" />
        </div>
        <div className="border-b border-line p-5">
          <FilterPanel
            filters={filters}
            onChange={(p) => setFilters((f) => ({ ...f, ...p }))}
            onReset={() => setFilters({ ...defaultFilters, sort: 'closest' })}
            compact
          />
        </div>
        <div className="min-h-0 flex-1 space-y-3 overflow-y-auto p-4">
          {results.map((event) => (
            <button
              key={event.id}
              onClick={() => setActiveId(event.id)}
              className={cn(
                'w-full rounded-2xl text-left transition-shadow',
                activeId === event.id && 'ring-2 ring-green',
              )}
            >
              <EventCard event={event} layout="row" />
            </button>
          ))}
          {!results.length && (
            <p className="py-10 text-center text-sm text-muted">
              No events match these filters. Widen the distance or clear the date.
            </p>
          )}
        </div>
      </aside>

      {/* Map */}
      <div className={cn('relative h-[calc(100vh-9rem)] lg:h-full', mobileView === 'list' && 'hidden lg:block')}>
        <EventMap
          events={results}
          venueMap={venueMap}
          center={center}
          zoom={activeId ? 15 : 12}
          activeId={activeId}
          onSelect={setActiveId}
          className="h-full w-full"
        />

        {active && (
          <div className="absolute inset-x-4 bottom-4 z-[400] lg:hidden">
            <div className="relative">
              <button
                onClick={() => setActiveId(null)}
                aria-label="Close preview"
                className="absolute -top-3 right-1 z-10 flex h-8 w-8 items-center justify-center rounded-full border border-line bg-surface text-muted shadow"
              >
                <X className="h-4 w-4" />
              </button>
              <EventCard event={active} layout="row" />
            </div>
          </div>
        )}
      </div>

      {/* Mobile toggle */}
      <div className="fixed inset-x-0 bottom-20 z-[500] flex justify-center lg:hidden">
        <Button
          size="sm"
          onClick={() => setMobileView((v) => (v === 'map' ? 'list' : 'map'))}
          icon={mobileView === 'map' ? <List className="h-4 w-4" /> : <MapIcon className="h-4 w-4" />}
        >
          {mobileView === 'map' ? 'Show list' : 'Show map'}
        </Button>
      </div>
    </div>
  );
};
