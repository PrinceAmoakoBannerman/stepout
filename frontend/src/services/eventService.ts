import type { EventDraftInput, EventItem, EventStatus, TicketTier, Venue } from '@/types';
import { demoEvents } from '@/data/events';
import { venues as demoVenues } from '@/data/venues';
import { store, uid } from '@/utils/storage';
import { api, resolve, useApi } from './api';

const CUSTOM_EVENTS = 'events:custom';
const OVERRIDES = 'events:overrides';
const CUSTOM_VENUES = 'venues:custom';

type Overrides = Record<string, Partial<EventItem>>;

const custom = () => store.get<EventItem[]>(CUSTOM_EVENTS, []);
const overrides = () => store.get<Overrides>(OVERRIDES, {});
const customVenues = () => store.get<Venue[]>(CUSTOM_VENUES, []);

const merged = (): EventItem[] => {
  const ovr = overrides();
  return [...demoEvents.map((e) => ({ ...e, ...(ovr[e.id] ?? {}) })), ...custom()];
};

export const eventService = {
  async list(): Promise<EventItem[]> {
    if (useApi) return (await api.get<EventItem[]>('/events/')).data;
    return resolve(merged());
  },

  async get(id: string): Promise<EventItem | undefined> {
    if (useApi) return (await api.get<EventItem>(`/events/${id}/`)).data;
    return resolve(merged().find((e) => e.id === id));
  },

  async venues(): Promise<Venue[]> {
    if (useApi) return (await api.get<Venue[]>('/venues/')).data;
    return resolve([...demoVenues, ...customVenues()]);
  },

  /** Creates an event from the organizer wizard. Status decides draft vs. submitted. */
  async create(draft: EventDraftInput, status: EventStatus, organizerId: string): Promise<EventItem> {
    const id = uid('ev');
    const venueId = uid('ven');
    const venue: Venue = {
      id: venueId,
      name: draft.venueName,
      address: draft.address,
      area: draft.area,
      cityId: 'accra',
      lat: draft.lat,
      lng: draft.lng,
      capacity: draft.quantity || 200,
    };
    const tiers: TicketTier[] = [
      {
        id: `${id}-t1`,
        name: draft.isFree ? 'Free entry' : draft.tierName || 'General',
        price: draft.isFree ? 0 : draft.price,
        quantity: draft.quantity || 100,
        sold: 0,
      },
    ];
    const event: EventItem = {
      id,
      title: draft.title,
      category: draft.category,
      summary: draft.summary,
      description: draft.description,
      image: draft.image || `https://picsum.photos/seed/${id}/1200/800`,
      start: new Date(`${draft.startDate}T${draft.startTime}`).toISOString(),
      end: new Date(`${draft.endDate || draft.startDate}T${draft.endTime || draft.startTime}`).toISOString(),
      venueId,
      organizerId,
      tiers,
      interested: 0,
      views: 0,
      status,
      featured: false,
      trending: false,
      tags: [draft.area.toLowerCase()],
      schedule: [],
      info: ['Bring a valid ID.', 'Tickets are non-refundable within 24 hours of the event.'],
      createdAt: new Date().toISOString(),
    };

    if (useApi) return (await api.post<EventItem>('/events/', event)).data;

    store.set(CUSTOM_VENUES, [...customVenues(), venue]);
    store.set(CUSTOM_EVENTS, [event, ...custom()]);
    return resolve(event, 500);
  },

  async update(id: string, patch: Partial<EventItem>): Promise<void> {
    if (useApi) {
      await api.patch(`/events/${id}/`, patch);
      return;
    }
    const list = custom();
    const idx = list.findIndex((e) => e.id === id);
    if (idx > -1) {
      list[idx] = { ...list[idx], ...patch };
      store.set(CUSTOM_EVENTS, list);
    } else {
      const ovr = overrides();
      ovr[id] = { ...(ovr[id] ?? {}), ...patch };
      store.set(OVERRIDES, ovr);
    }
  },

  async duplicate(event: EventItem): Promise<EventItem> {
    const copy: EventItem = {
      ...event,
      id: uid('ev'),
      title: `${event.title} (copy)`,
      status: 'draft',
      interested: 0,
      views: 0,
      tiers: event.tiers.map((t) => ({ ...t, sold: 0 })),
      createdAt: new Date().toISOString(),
    };
    if (useApi) return (await api.post<EventItem>('/events/', copy)).data;
    store.set(CUSTOM_EVENTS, [copy, ...custom()]);
    return resolve(copy, 250);
  },
};
