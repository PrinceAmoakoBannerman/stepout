import { useMemo } from 'react';
import { isAfter, isBefore, parseISO } from 'date-fns';
import type { EventFilters, EventItem, Venue } from '@/types';
import { distanceKm } from '@/utils/format';

export const defaultFilters: EventFilters = {
  query: '',
  category: 'all',
  area: 'all',
  when: 'any',
  maxPrice: 1000,
  freeOnly: false,
  maxDistance: 50,
  sort: 'recommended',
};

const windowFor = (when: EventFilters['when']) => {
  const start = new Date();
  const end = new Date();
  end.setHours(23, 59, 59, 999);
  switch (when) {
    case 'today':
      return { start, end };
    case 'tomorrow': {
      const s = new Date();
      s.setDate(s.getDate() + 1);
      s.setHours(0, 0, 0, 0);
      const e = new Date(s);
      e.setHours(23, 59, 59, 999);
      return { start: s, end: e };
    }
    case 'weekend': {
      const s = new Date();
      const day = s.getDay();
      const toSat = (6 - day + 7) % 7;
      s.setDate(s.getDate() + toSat);
      s.setHours(0, 0, 0, 0);
      const e = new Date(s);
      e.setDate(e.getDate() + 1);
      e.setHours(23, 59, 59, 999);
      return { start: s, end: e };
    }
    case 'week': {
      const e = new Date();
      e.setDate(e.getDate() + 7);
      return { start, end: e };
    }
    case 'month': {
      const e = new Date();
      e.setMonth(e.getMonth() + 1);
      return { start, end: e };
    }
    default:
      return null;
  }
};

export const minPrice = (event: EventItem) => Math.min(...event.tiers.map((t) => t.price));

export interface FilterContext {
  events: EventItem[];
  venueMap: Record<string, Venue>;
  origin: { lat: number; lng: number };
  filters: EventFilters;
  interests?: string[];
}

export const filterEvents = ({ events, venueMap, origin, filters, interests = [] }: FilterContext) => {
  const range = windowFor(filters.when);
  const q = filters.query.trim().toLowerCase();

  const list = events.filter((event) => {
    if (event.status !== 'published') return false;
    const venue = venueMap[event.venueId];
    const start = parseISO(event.start);

    if (q) {
      const haystack = `${event.title} ${event.summary} ${event.tags.join(' ')} ${venue?.name ?? ''} ${venue?.area ?? ''} ${event.category}`.toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    if (filters.category !== 'all' && event.category !== filters.category) return false;
    if (filters.area !== 'all' && venue?.area !== filters.area) return false;
    if (range && (isBefore(start, range.start) || isAfter(start, range.end))) return false;
    if (filters.freeOnly && minPrice(event) !== 0) return false;
    if (minPrice(event) > filters.maxPrice) return false;
    if (venue && distanceKm(origin, venue) > filters.maxDistance) return false;
    return true;
  });

  const dist = (e: EventItem) => {
    const v = venueMap[e.venueId];
    return v ? distanceKm(origin, v) : 999;
  };

  const sorted = [...list].sort((a, b) => {
    switch (filters.sort) {
      case 'popular':
        return b.interested - a.interested;
      case 'newest':
        return parseISO(b.createdAt).getTime() - parseISO(a.createdAt).getTime();
      case 'closest':
        return dist(a) - dist(b);
      case 'price-asc':
        return minPrice(a) - minPrice(b);
      default: {
        const score = (e: EventItem) =>
          (interests.includes(e.category) ? 40 : 0) +
          (e.trending ? 14 : 0) +
          (e.featured ? 10 : 0) +
          Math.min(e.interested / 250, 12) -
          Math.max(0, dist(e) - 6) * 0.4;
        return score(b) - score(a);
      }
    }
  });

  return sorted;
};

export const useFilteredEvents = (ctx: FilterContext) =>
  useMemo(() => filterEvents(ctx), [ctx.events, ctx.venueMap, ctx.filters, ctx.origin, ctx.interests]);
