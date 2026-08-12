import type { CategoryId, EventItem, Venue } from '@/types';
import { distanceKm } from './format';

export interface RecommendInput {
  events: EventItem[];
  interests: CategoryId[];
  savedIds: string[];
  interestedIds: string[];
  venueMap: Record<string, Venue>;
  origin: { lat: number; lng: number };
  limit?: number;
}

/**
 * Frontend recommendation pass. Deliberately transparent and swappable:
 * once the backend serves /events/recommended/ this whole function collapses
 * into a single fetch, and the ranking moves server-side.
 */
export const recommendEvents = ({
  events,
  interests,
  savedIds,
  interestedIds,
  venueMap,
  origin,
  limit = 8,
}: RecommendInput): EventItem[] => {
  const now = Date.now();

  // Categories the person has already engaged with count as soft signals.
  const engaged = new Map<CategoryId, number>();
  [...savedIds, ...interestedIds].forEach((id) => {
    const ev = events.find((e) => e.id === id);
    if (ev) engaged.set(ev.category, (engaged.get(ev.category) ?? 0) + 1);
  });

  const scored = events
    .filter((e) => e.status === 'published' && new Date(e.start).getTime() > now)
    .map((event) => {
      let score = 0;
      if (interests.includes(event.category)) score += 45;
      score += Math.min(engaged.get(event.category) ?? 0, 4) * 8;
      if (event.trending) score += 12;
      if (event.featured) score += 8;

      // Popularity, dampened so a single huge event doesn't dominate the row.
      score += Math.min(event.interested / 200, 15);

      // Soon is better, but not at any cost.
      const daysOut = (new Date(event.start).getTime() - now) / 86_400_000;
      score += Math.max(0, 14 - daysOut) * 1.2;

      const venue = venueMap[event.venueId];
      if (venue) score += Math.max(0, 12 - distanceKm(origin, venue)) * 0.8;

      // Free events are an easy yes for a first outing.
      if (event.tiers.every((t) => t.price === 0)) score += 6;

      return { event, score };
    })
    .sort((a, b) => b.score - a.score);

  return scored.slice(0, limit).map((s) => s.event);
};
