import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Building2, CalendarDays, Clock3, Search, Tag, Users, X } from 'lucide-react';
import { useApp } from '@/store/AppContext';
import { categories } from '@/data/categories';
import { organizers } from '@/data/organizers';
import { EventImage } from '@/components/events/EventImage';
import { clock, relativeDay } from '@/utils/format';
import { useDebounced } from '@/hooks/useDebounced';

const suggestions = ['football', 'amapiano', 'free events', 'jollof', 'tech meetup', 'rooftop'];

export const SearchOverlay = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const { events, venues, venueMap, recentSearches, pushSearch, clearSearches } = useApp();
  const [term, setTerm] = useState('');
  const query = useDebounced(term, 180).trim().toLowerCase();
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 60);
    else setTerm('');
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  const results = useMemo(() => {
    if (!query) return null;
    const match = (s: string) => s.toLowerCase().includes(query);
    return {
      events: events
        .filter((e) => e.status === 'published')
        .filter((e) => match(e.title) || match(e.summary) || e.tags.some(match) || match(e.category))
        .slice(0, 5),
      organizers: organizers.filter((o) => match(o.name) || o.categories.some(match)).slice(0, 3),
      venues: venues.filter((v) => match(v.name) || match(v.area)).slice(0, 3),
      categories: categories.filter((c) => match(c.name) || match(c.blurb)).slice(0, 4),
    };
  }, [query, events, venues]);

  const go = (path: string, remember?: string) => {
    if (remember) pushSearch(remember);
    onClose();
    navigate(path);
  };

  const submit = () => {
    if (!term.trim()) return;
    pushSearch(term);
    onClose();
    navigate(`/events?q=${encodeURIComponent(term.trim())}`);
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[110]">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-ink/70 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, y: -18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
            className="relative mx-auto mt-0 w-full max-w-2xl overflow-hidden rounded-b-2xl border border-line bg-surface shadow-lift sm:mt-20 sm:rounded-2xl"
          >
            <div className="flex items-center gap-3 border-b border-line px-4 py-3.5">
              <Search className="h-5 w-5 shrink-0 text-muted" />
              <input
                ref={inputRef}
                value={term}
                onChange={(e) => setTerm(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && submit()}
                placeholder="Search events, organizers, venues"
                aria-label="Search StepOut"
                className="w-full bg-transparent text-base outline-none placeholder:text-muted/70"
              />
              <button onClick={onClose} aria-label="Close search" className="rounded-lg p-1 text-muted hover:text-fg">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="max-h-[65vh] overflow-y-auto p-4">
              {!query && (
                <div className="space-y-6">
                  {recentSearches.length > 0 && (
                    <section>
                      <div className="mb-2 flex items-center justify-between">
                        <p className="eyebrow">Recent</p>
                        <button onClick={clearSearches} className="text-xs text-muted hover:text-fg">
                          Clear
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {recentSearches.map((r) => (
                          <button
                            key={r}
                            onClick={() => go(`/events?q=${encodeURIComponent(r)}`, r)}
                            className="inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-sm hover:bg-raised"
                          >
                            <Clock3 className="h-3.5 w-3.5 text-muted" />
                            {r}
                          </button>
                        ))}
                      </div>
                    </section>
                  )}
                  <section>
                    <p className="eyebrow mb-2">Try searching for</p>
                    <div className="flex flex-wrap gap-2">
                      {suggestions.map((s) => (
                        <button
                          key={s}
                          onClick={() => setTerm(s)}
                          className="rounded-full bg-raised px-3 py-1.5 text-sm font-medium hover:bg-line/60"
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </section>
                </div>
              )}

              {results && (
                <div className="space-y-6">
                  {results.events.length > 0 && (
                    <section>
                      <p className="eyebrow mb-2">Events</p>
                      <ul className="space-y-1">
                        {results.events.map((e) => (
                          <li key={e.id}>
                            <button
                              onClick={() => go(`/events/${e.id}`, term)}
                              className="flex w-full items-center gap-3 rounded-xl p-2 text-left hover:bg-raised"
                            >
                              <EventImage src={e.image} alt={e.title} category={e.category} className="h-11 w-11 rounded-lg" />
                              <span className="min-w-0 flex-1">
                                <span className="block truncate text-sm font-semibold">{e.title}</span>
                                <span className="block truncate text-xs text-muted">
                                  {relativeDay(e.start)} · {clock(e.start)} · {venueMap[e.venueId]?.area}
                                </span>
                              </span>
                              <CalendarDays className="h-4 w-4 text-muted" />
                            </button>
                          </li>
                        ))}
                      </ul>
                    </section>
                  )}

                  {results.organizers.length > 0 && (
                    <section>
                      <p className="eyebrow mb-2">Organizers</p>
                      {results.organizers.map((o) => (
                        <button
                          key={o.id}
                          onClick={() => go(`/organizers/${o.id}`, term)}
                          className="flex w-full items-center gap-3 rounded-xl p-2 text-left hover:bg-raised"
                        >
                          <Users className="h-4 w-4 text-green" />
                          <span className="text-sm font-semibold">{o.name}</span>
                        </button>
                      ))}
                    </section>
                  )}

                  {results.venues.length > 0 && (
                    <section>
                      <p className="eyebrow mb-2">Venues</p>
                      {results.venues.map((v) => (
                        <button
                          key={v.id}
                          onClick={() => go(`/map?venue=${v.id}`, term)}
                          className="flex w-full items-center gap-3 rounded-xl p-2 text-left hover:bg-raised"
                        >
                          <Building2 className="h-4 w-4 text-ember" />
                          <span className="text-sm font-semibold">{v.name}</span>
                          <span className="text-xs text-muted">{v.area}</span>
                        </button>
                      ))}
                    </section>
                  )}

                  {results.categories.length > 0 && (
                    <section>
                      <p className="eyebrow mb-2">Categories</p>
                      <div className="flex flex-wrap gap-2">
                        {results.categories.map((c) => (
                          <button
                            key={c.id}
                            onClick={() => go(`/events?category=${c.id}`, term)}
                            className="inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-sm hover:bg-raised"
                          >
                            <Tag className="h-3.5 w-3.5 text-magenta" />
                            {c.name}
                          </button>
                        ))}
                      </div>
                    </section>
                  )}

                  {!results.events.length &&
                    !results.organizers.length &&
                    !results.venues.length &&
                    !results.categories.length && (
                      <div className="py-10 text-center">
                        <p className="font-display text-lg font-bold">No matches for “{term}”</p>
                        <p className="mt-1 text-sm text-muted">
                          Try a category, an area like Osu, or a vibe like amapiano.
                        </p>
                      </div>
                    )}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
