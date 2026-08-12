export type CategoryId =
  | 'music'
  | 'nightlife'
  | 'sports'
  | 'food'
  | 'tech'
  | 'networking'
  | 'arts'
  | 'culture'
  | 'community'
  | 'workshops';

export interface Category {
  id: CategoryId;
  name: string;
  icon: string; // lucide icon name
  tint: string; // tailwind classes for the icon chip
  blurb: string;
}

export interface City {
  id: string;
  name: string;
  region: string;
  lat: number;
  lng: number;
  active: boolean;
}

export interface Venue {
  id: string;
  name: string;
  address: string;
  area: string;
  cityId: string;
  lat: number;
  lng: number;
  capacity: number;
}

export interface Organizer {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  verified: boolean;
  bio: string;
  followers: number;
  eventsHosted: number;
  categories: CategoryId[];
  cityId: string;
  joined: string;
}

export interface TicketTier {
  id: string;
  name: string;
  price: number; // GHS, 0 = free
  quantity: number;
  sold: number;
}

export interface ScheduleItem {
  time: string;
  title: string;
  detail?: string;
}

export type EventStatus = 'draft' | 'pending' | 'published' | 'cancelled';

export interface EventItem {
  id: string;
  title: string;
  category: CategoryId;
  summary: string;
  description: string;
  image: string;
  start: string; // ISO
  end: string; // ISO
  venueId: string;
  organizerId: string;
  tiers: TicketTier[];
  interested: number;
  views: number;
  status: EventStatus;
  featured: boolean;
  trending: boolean;
  tags: string[];
  schedule: ScheduleItem[];
  info: string[];
  createdAt: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  cityId: string;
  interests: CategoryId[];
  role: 'attendee' | 'organizer' | 'admin';
  organizerId?: string;
  bio?: string;
  joined: string;
}

export interface Ticket {
  id: string;
  eventId: string;
  tierId: string;
  tierName: string;
  attendeeName: string;
  attendeeEmail: string;
  quantity: number;
  total: number;
  purchasedAt: string;
  status: 'valid' | 'checked-in' | 'refunded';
}

export interface Attendee {
  id: string;
  eventId: string;
  name: string;
  email: string;
  tier: string;
  quantity: number;
  purchasedAt: string;
  status: 'confirmed' | 'checked-in' | 'refunded';
}

export interface AppNotification {
  id: string;
  type: 'reminder' | 'organizer' | 'change' | 'ticket' | 'social';
  title: string;
  body: string;
  createdAt: string;
  read: boolean;
  href?: string;
}

export interface Report {
  id: string;
  eventId: string;
  reason: string;
  detail: string;
  reportedBy: string;
  createdAt: string;
  status: 'open' | 'resolved' | 'dismissed';
}

export interface EventDraftInput {
  title: string;
  category: CategoryId;
  summary: string;
  description: string;
  image: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  venueName: string;
  address: string;
  area: string;
  lat: number;
  lng: number;
  isFree: boolean;
  tierName: string;
  price: number;
  quantity: number;
}

export type SortKey = 'recommended' | 'popular' | 'newest' | 'closest' | 'price-asc';

export interface EventFilters {
  query: string;
  category: CategoryId | 'all';
  area: string;
  when: 'any' | 'today' | 'tomorrow' | 'weekend' | 'week' | 'month';
  maxPrice: number;
  freeOnly: boolean;
  maxDistance: number;
  sort: SortKey;
}
