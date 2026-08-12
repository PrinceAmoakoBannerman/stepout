import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type {
  AppNotification,
  CategoryId,
  EventDraftInput,
  EventItem,
  EventStatus,
  Ticket,
  UserProfile,
  Venue,
} from '@/types';
import { authService, type Credentials, type RegisterInput } from '@/services/authService';
import { eventService } from '@/services/eventService';
import { ticketService, type CheckoutInput } from '@/services/ticketService';
import { userService } from '@/services/userService';
import { organizerMap } from '@/data/organizers';
import { cityMap } from '@/data/cities';
import { store } from '@/utils/storage';

export interface Toast {
  id: number;
  message: string;
  description?: string;
  variant: 'success' | 'error' | 'info';
}

interface AppValue {
  theme: 'light' | 'dark';
  toggleTheme: () => void;

  cityId: string;
  setCityId: (id: string) => void;
  origin: { lat: number; lng: number };

  events: EventItem[];
  venues: Venue[];
  venueMap: Record<string, Venue>;
  loading: boolean;
  getEvent: (id?: string) => EventItem | undefined;
  venueOf: (event?: EventItem) => Venue | undefined;
  organizerOf: (event?: EventItem) => (typeof organizerMap)[string] | undefined;
  createEvent: (draft: EventDraftInput, status: EventStatus) => Promise<EventItem>;
  updateEvent: (id: string, patch: Partial<EventItem>) => Promise<void>;
  duplicateEvent: (event: EventItem) => Promise<void>;

  user: UserProfile | null;
  signIn: (c: Credentials) => Promise<UserProfile>;
  signUp: (i: RegisterInput) => Promise<UserProfile>;
  signOut: () => void;
  updateProfile: (patch: Partial<UserProfile>) => Promise<void>;
  setInterests: (interests: CategoryId[]) => Promise<void>;

  savedIds: string[];
  toggleSaved: (id: string) => void;
  isSaved: (id: string) => boolean;

  interestedIds: string[];
  toggleInterested: (id: string) => void;
  isInterested: (id: string) => boolean;

  followingIds: string[];
  toggleFollow: (organizerId: string) => void;

  tickets: Ticket[];
  buyTicket: (input: CheckoutInput) => Promise<Ticket>;

  notifications: AppNotification[];
  unreadCount: number;
  markNotificationsRead: () => void;

  recentSearches: string[];
  pushSearch: (term: string) => void;
  clearSearches: () => void;

  toasts: Toast[];
  toast: (message: string, variant?: Toast['variant'], description?: string) => void;
  dismissToast: (id: number) => void;
}

const AppContext = createContext<AppValue | null>(null);

const prefersDark = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches;

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<'light' | 'dark'>(() =>
    store.get<'light' | 'dark' | null>('theme', null) ?? (prefersDark() ? 'dark' : 'light'),
  );
  const [cityId, setCityIdState] = useState(() => store.get('city', 'accra'));
  const [events, setEvents] = useState<EventItem[]>([]);
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<UserProfile | null>(() => authService.current());
  const [savedIds, setSavedIds] = useState<string[]>(() => store.get<string[]>('saved', []));
  const [interestedIds, setInterestedIds] = useState<string[]>(() => store.get<string[]>('interested', []));
  const [followingIds, setFollowingIds] = useState<string[]>(() => store.get<string[]>('following', ['o1']));
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>(() =>
    store.get<string[]>('searches', ['football', 'amapiano', 'free events']),
  );
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    store.set('theme', theme);
  }, [theme]);

  useEffect(() => {
    let alive = true;
    (async () => {
      const [e, v, t, n] = await Promise.all([
        eventService.list(),
        eventService.venues(),
        ticketService.list(),
        userService.notifications(),
      ]);
      if (!alive) return;
      setEvents(e);
      setVenues(v);
      setTickets(t);
      setNotifications(n);
      setLoading(false);
    })();
    return () => {
      alive = false;
    };
  }, []);

  const venueMap = useMemo(
    () => Object.fromEntries(venues.map((v) => [v.id, v])) as Record<string, Venue>,
    [venues],
  );

  const toast = useCallback(
    (message: string, variant: Toast['variant'] = 'success', description?: string) => {
      const id = Date.now() + Math.random();
      setToasts((prev) => [...prev, { id, message, variant, description }]);
      setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3800);
    },
    [],
  );

  const persist = <T,>(key: string, value: T, setter: (v: T) => void) => {
    setter(value);
    store.set(key, value);
  };

  const value: AppValue = {
    theme,
    toggleTheme: () => setTheme((t) => (t === 'dark' ? 'light' : 'dark')),

    cityId,
    setCityId: (id) => persist('city', id, setCityIdState),
    origin: { lat: cityMap[cityId]?.lat ?? 5.6037, lng: cityMap[cityId]?.lng ?? -0.187 },

    events,
    venues,
    venueMap,
    loading,
    getEvent: (id) => events.find((e) => e.id === id),
    venueOf: (event) => (event ? venueMap[event.venueId] : undefined),
    organizerOf: (event) => (event ? organizerMap[event.organizerId] : undefined),

    async createEvent(draft, status) {
      const organizerId = user?.organizerId ?? 'o1';
      const created = await eventService.create(draft, status, organizerId);
      const [e, v] = await Promise.all([eventService.list(), eventService.venues()]);
      setEvents(e);
      setVenues(v);
      return created;
    },
    async updateEvent(id, patch) {
      await eventService.update(id, patch);
      setEvents((prev) => prev.map((e) => (e.id === id ? { ...e, ...patch } : e)));
    },
    async duplicateEvent(event) {
      await eventService.duplicate(event);
      setEvents(await eventService.list());
    },

    user,
    async signIn(c) {
      const u = await authService.login(c);
      setUser(u);
      return u;
    },
    async signUp(i) {
      const u = await authService.register(i);
      setUser(u);
      return u;
    },
    signOut() {
      authService.logout();
      setUser(null);
      toast('Signed out', 'info');
    },
    async updateProfile(patch) {
      const u = await authService.update(patch);
      setUser(u);
    },
    async setInterests(interests) {
      const u = await authService.setInterests(interests);
      setUser(u);
    },

    savedIds,
    isSaved: (id) => savedIds.includes(id),
    toggleSaved(id) {
      const next = savedIds.includes(id) ? savedIds.filter((s) => s !== id) : [id, ...savedIds];
      persist('saved', next, setSavedIds);
      toast(next.includes(id) ? 'Saved to your list' : 'Removed from saved', next.includes(id) ? 'success' : 'info');
    },

    interestedIds,
    isInterested: (id) => interestedIds.includes(id),
    toggleInterested(id) {
      const next = interestedIds.includes(id)
        ? interestedIds.filter((s) => s !== id)
        : [id, ...interestedIds];
      persist('interested', next, setInterestedIds);
      toast(next.includes(id) ? "You're marked as interested" : 'No longer interested', next.includes(id) ? 'success' : 'info');
    },

    followingIds,
    toggleFollow(organizerId) {
      const next = followingIds.includes(organizerId)
        ? followingIds.filter((s) => s !== organizerId)
        : [organizerId, ...followingIds];
      persist('following', next, setFollowingIds);
      toast(next.includes(organizerId) ? 'Following' : 'Unfollowed', 'info');
    },

    tickets,
    async buyTicket(input) {
      const ticket = await ticketService.purchase(input);
      setTickets((prev) => [ticket, ...prev]);
      return ticket;
    },

    notifications,
    unreadCount: notifications.filter((n) => !n.read).length,
    markNotificationsRead: () => setNotifications((prev) => prev.map((n) => ({ ...n, read: true }))),

    recentSearches,
    pushSearch(term) {
      const clean = term.trim();
      if (!clean) return;
      const next = [clean, ...recentSearches.filter((s) => s.toLowerCase() !== clean.toLowerCase())].slice(0, 6);
      persist('searches', next, setRecentSearches);
    },
    clearSearches: () => persist('searches', [], setRecentSearches),

    toasts,
    toast,
    dismissToast: (id) => setToasts((prev) => prev.filter((t) => t.id !== id)),
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside <AppProvider>');
  return ctx;
};
