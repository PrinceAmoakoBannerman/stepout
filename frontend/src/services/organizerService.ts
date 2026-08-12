import { format, subDays } from 'date-fns';
import type { Attendee, EventItem, Organizer } from '@/types';
import { organizers } from '@/data/organizers';
import { demoAttendees } from '@/data/people';
import { api, resolve, useApi } from './api';

export interface OrganizerStats {
  totalEvents: number;
  upcomingEvents: number;
  totalViews: number;
  interestedUsers: number;
  ticketsSold: number;
  revenue: number;
}

export interface SeriesPoint {
  label: string;
  views: number;
  tickets: number;
  revenue: number;
  attendance: number;
}

/** Deterministic pseudo-random so charts never jump between renders. */
const wobble = (seed: number) => {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
};

export const organizerService = {
  async get(id: string): Promise<Organizer | undefined> {
    if (useApi) return (await api.get<Organizer>(`/organizers/${id}/`)).data;
    return resolve(organizers.find((o) => o.id === id));
  },

  stats(events: EventItem[]): OrganizerStats {
    const published = events.filter((e) => e.status === 'published');
    const now = Date.now();
    const ticketsSold = events.reduce((sum, e) => sum + e.tiers.reduce((s, t) => s + t.sold, 0), 0);
    const revenue = events.reduce(
      (sum, e) => sum + e.tiers.reduce((s, t) => s + t.sold * t.price, 0),
      0,
    );
    return {
      totalEvents: events.length,
      upcomingEvents: published.filter((e) => new Date(e.start).getTime() > now).length,
      totalViews: events.reduce((s, e) => s + e.views, 0),
      interestedUsers: events.reduce((s, e) => s + e.interested, 0),
      ticketsSold,
      revenue,
    };
  },

  /** 30-day trend used by the overview and analytics charts. */
  series(events: EventItem[], days = 30): SeriesPoint[] {
    const totalViews = events.reduce((s, e) => s + e.views, 0) || 4000;
    const totalTickets = events.reduce((s, e) => s + e.tiers.reduce((a, t) => a + t.sold, 0), 0) || 400;
    const avgPrice =
      events.reduce((s, e) => s + (e.tiers[0]?.price ?? 0), 0) / Math.max(events.length, 1) || 120;

    return Array.from({ length: days }, (_, i) => {
      const date = subDays(new Date(), days - 1 - i);
      const lift = 0.6 + wobble(i + 1) * 0.9 + (i / days) * 0.5;
      const views = Math.round((totalViews / days) * lift);
      const tickets = Math.round((totalTickets / days) * lift);
      return {
        label: format(date, 'd MMM'),
        views,
        tickets,
        revenue: Math.round(tickets * avgPrice),
        attendance: Math.round(tickets * (0.72 + wobble(i + 7) * 0.2)),
      };
    });
  },

  categoryBreakdown(events: EventItem[]) {
    const counts = new Map<string, number>();
    events.forEach((e) => counts.set(e.category, (counts.get(e.category) ?? 0) + 1));
    return [...counts.entries()].map(([name, value]) => ({ name, value }));
  },

  async attendees(eventIds: string[]): Promise<Attendee[]> {
    if (useApi) return (await api.get<Attendee[]>('/attendees/', { params: { events: eventIds.join(',') } })).data;
    return resolve(demoAttendees.filter((a) => eventIds.includes(a.eventId)));
  },
};
